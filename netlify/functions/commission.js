import { getStore } from "@netlify/blobs";
import { verifyToken } from "./_token.js";

const AGENT_SPLIT_RATES = { Carnisa: 1, Asia: 0.8, LaQuanda: 0.8 };

// Bonus commission: for every N priced rooms booked (trip-wide, excluding personal
// rooms), the group earns an additional flat bonus. Only these three ever share in
// it, split proportional to each one's share of all priced rooms in the trip — the
// remainder (representing Adrienne's and Free Agent rooms' share of that stake)
// rolls into the markup pool, the same way unattributed commission already does.
const BONUS_ELIGIBLE_AGENTS = ["Carnisa", "Asia", "LaQuanda"];
const DEFAULT_BONUS_ROOMS_PER_INCREMENT = 11;
const DEFAULT_BONUS_AMOUNT_PER_INCREMENT = 1610;
const BONUS_CONFIG_KEY_PREFIX = "bonusconfig:";
const BONUS_CONFIG_C2_KEY_PREFIX = "bonusconfig2:";

function getRoomPrimaryAgent(guestsInRoom) {
  const primary = guestsInRoom.find((g) => g.primaryTraveler && g.agent);
  if (primary) return primary.agent;
  const any = guestsInRoom.find((g) => g.agent);
  return any ? any.agent : null;
}

function getPrimaryGuest(guestsInRoom) {
  return guestsInRoom.find((g) => g.primaryTraveler) || guestsInRoom[0];
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default async (req) => {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  const payload = verifyToken(token);
  if (!payload || !payload.role) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const url = new URL(req.url);
  const tripId = url.searchParams.get("tripId") || "t_negril27";

  const store = getStore("noir-manifest");
  let roster = [];
  try {
    const raw = await store.get("roster:" + tripId);
    roster = raw ? JSON.parse(raw) : [];
  } catch {
    roster = [];
  }

  let bonusRoomsPerIncrement = DEFAULT_BONUS_ROOMS_PER_INCREMENT;
  let bonusAmountPerIncrement = DEFAULT_BONUS_AMOUNT_PER_INCREMENT;
  try {
    const rawConfig = await store.get(BONUS_CONFIG_KEY_PREFIX + tripId);
    if (rawConfig) {
      const parsed = JSON.parse(rawConfig);
      if (Number(parsed.roomsPerIncrement) > 0) bonusRoomsPerIncrement = Number(parsed.roomsPerIncrement);
      if (Number(parsed.amountPerIncrement) >= 0) bonusAmountPerIncrement = Number(parsed.amountPerIncrement);
    }
  } catch {
    // fall back to defaults
  }

  let bonusRoomsPerIncrementC2 = DEFAULT_BONUS_ROOMS_PER_INCREMENT;
  let bonusAmountPerIncrementC2 = DEFAULT_BONUS_AMOUNT_PER_INCREMENT;
  try {
    const rawConfigC2 = await store.get(BONUS_CONFIG_C2_KEY_PREFIX + tripId);
    if (rawConfigC2) {
      const parsed = JSON.parse(rawConfigC2);
      if (Number(parsed.roomsPerIncrement) > 0) bonusRoomsPerIncrementC2 = Number(parsed.roomsPerIncrement);
      if (Number(parsed.amountPerIncrement) >= 0) bonusAmountPerIncrementC2 = Number(parsed.amountPerIncrement);
    }
  } catch {
    // fall back to defaults
  }

  const active = roster.filter((g) => !g.cancelled);
  const groups = new Map();
  const order = [];
  active.forEach((g) => {
    const key = (g.roomGroup && g.roomGroup.trim().toLowerCase()) || "solo:" + g.id;
    if (!groups.has(key)) {
      groups.set(key, []);
      order.push(key);
    }
    groups.get(key).push(g);
  });

  let totalCommission = 0;
  let tjkcTotal = 0;
  let markupPoolFromFreeAgents = 0;
  let totalPricedRooms = 0;
  const agentTotals = {};
  const agentPricedRoomCounts = {};
  let totalPricedRoomsC2 = 0;
  const agentPricedRoomCountsC2 = {};

  order.forEach((key) => {
    const guestsInRoom = groups.get(key);
    // Commission is stored once per room (replicated onto each roommate for display
    // purposes) — read it from a single guest, never sum across roommates, or a
    // shared room silently doubles its commission.
    const roomCommission = Number(getPrimaryGuest(guestsInRoom)?.commission) || 0;
    const primaryAgent = getRoomPrimaryAgent(guestsInRoom);
    const label = guestsInRoom.map((g) => g.name).join(" & ");
    totalCommission += roomCommission;

    // Bonus room tally — every priced Contract 1 room counts toward the group's main
    // bonus threshold, including an agent's own personal room. Contract 2 rooms count
    // toward their own separate tracker only, never this one, so nothing double-counts.
    // (This is deliberately different from "Agent stake in the trip," which is trip-wide
    // across both contracts and computed independently, client-side.)
    const roomPrice = guestsInRoom.reduce((s, g) => s + (Number(g.price) || 0), 0);
    const stakeAgent = primaryAgent || "Free Agent";
    const roomContract = getPrimaryGuest(guestsInRoom)?.contract || "1";
    const secondaryAgentForStake = getPrimaryGuest(guestsInRoom)?.secondaryAgent || "";
    const validSecondaryForStake = secondaryAgentForStake && secondaryAgentForStake !== stakeAgent;
    if (roomPrice > 0 && roomContract === "1") {
      totalPricedRooms += 1;
      if (validSecondaryForStake) {
        agentPricedRoomCounts[stakeAgent] = (agentPricedRoomCounts[stakeAgent] || 0) + 0.5;
        agentPricedRoomCounts[secondaryAgentForStake] = (agentPricedRoomCounts[secondaryAgentForStake] || 0) + 0.5;
      } else {
        agentPricedRoomCounts[stakeAgent] = (agentPricedRoomCounts[stakeAgent] || 0) + 1;
      }
    }
    if (roomPrice > 0 && roomContract === "2") {
      totalPricedRoomsC2 += 1;
      if (validSecondaryForStake) {
        agentPricedRoomCountsC2[stakeAgent] = (agentPricedRoomCountsC2[stakeAgent] || 0) + 0.5;
        agentPricedRoomCountsC2[secondaryAgentForStake] = (agentPricedRoomCountsC2[secondaryAgentForStake] || 0) + 0.5;
      } else {
        agentPricedRoomCountsC2[stakeAgent] = (agentPricedRoomCountsC2[stakeAgent] || 0) + 1;
      }
    }

    if (!primaryAgent) {
      markupPoolFromFreeAgents += roomCommission;
      return;
    }

    const secondaryAgentRaw = getPrimaryGuest(guestsInRoom)?.secondaryAgent || "";
    const validSecondary =
      secondaryAgentRaw && secondaryAgentRaw !== primaryAgent && typeof AGENT_SPLIT_RATES[secondaryAgentRaw] === "number";

    if (validSecondary && typeof AGENT_SPLIT_RATES[primaryAgent] === "number") {
      const half = roomCommission / 2;
      [primaryAgent, secondaryAgentRaw].forEach((agent) => {
        if (!agentTotals[agent]) {
          agentTotals[agent] = { commission: 0, tjkcDeduction: 0, rooms: [] };
        }
        const rate = AGENT_SPLIT_RATES[agent];
        const roomTjkc = half * (1 - rate);
        tjkcTotal += roomTjkc;
        agentTotals[agent].commission += half;
        agentTotals[agent].tjkcDeduction += roomTjkc;
        agentTotals[agent].rooms.push({
          label: `${label} (split w/ ${agent === primaryAgent ? secondaryAgentRaw : primaryAgent})`,
          commission: half,
          tjkcDeduction: roomTjkc,
          net: half - roomTjkc,
        });
      });
      return;
    }

    if (!agentTotals[primaryAgent]) {
      agentTotals[primaryAgent] = { commission: 0, tjkcDeduction: 0, rooms: [] };
    }
    let roomTjkc = 0;
    if (typeof AGENT_SPLIT_RATES[primaryAgent] === "number") {
      roomTjkc = roomCommission * (1 - AGENT_SPLIT_RATES[primaryAgent]);
      tjkcTotal += roomTjkc;
    }
    agentTotals[primaryAgent].commission += roomCommission;
    agentTotals[primaryAgent].tjkcDeduction += roomTjkc;
    agentTotals[primaryAgent].rooms.push({
      label,
      commission: roomCommission,
      tjkcDeduction: roomTjkc,
      net: roomCommission - roomTjkc,
    });
  });

  // Bonus commission pool
  const bonusIncrements = Math.floor(totalPricedRooms / bonusRoomsPerIncrement);
  const bonusPool = bonusIncrements * bonusAmountPerIncrement;
  const bonusShares = {};
  let bonusDistributed = 0;
  BONUS_ELIGIBLE_AGENTS.forEach((agent) => {
    const count = agentPricedRoomCounts[agent] || 0;
    const share = totalPricedRooms > 0 ? bonusPool * (count / totalPricedRooms) : 0;
    bonusShares[agent] = share;
    bonusDistributed += share;
  });
  const bonusToMarkupPool = bonusPool - bonusDistributed;

  // Contract 2's own bonus tracker — same formula, entirely separate room count and
  // config, lead-only visibility (never sent to non-lead logins at all).
  const bonusIncrementsC2 = Math.floor(totalPricedRoomsC2 / bonusRoomsPerIncrementC2);
  const bonusPoolC2 = bonusIncrementsC2 * bonusAmountPerIncrementC2;
  const bonusSharesC2 = {};
  let bonusDistributedC2 = 0;
  BONUS_ELIGIBLE_AGENTS.forEach((agent) => {
    const count = agentPricedRoomCountsC2[agent] || 0;
    const share = totalPricedRoomsC2 > 0 ? bonusPoolC2 * (count / totalPricedRoomsC2) : 0;
    bonusSharesC2[agent] = share;
    bonusDistributedC2 += share;
  });
  const bonusToMarkupPoolC2 = bonusPoolC2 - bonusDistributedC2;

  const isBonusEligible = BONUS_ELIGIBLE_AGENTS.includes(payload.role);

  // Carnisa's 10% override on Asia's and LaQuanda's earnings — room commission and
  // bonus commission both count. Lead-only; Asia and LaQuanda never see this figure.
  const OVERRIDE_RATE = 0.10;
  const OVERRIDE_SOURCE_AGENTS = ["Asia", "LaQuanda"];
  const override = { rate: OVERRIDE_RATE, sources: {}, total: 0 };
  OVERRIDE_SOURCE_AGENTS.forEach((agent) => {
    const roomBasis = agentTotals[agent]?.commission || 0;
    const bonusBasis = bonusShares[agent] || 0;
    const fromRoom = roomBasis * OVERRIDE_RATE;
    const fromBonus = bonusBasis * OVERRIDE_RATE;
    override.sources[agent] = { roomBasis, bonusBasis, fromRoom, fromBonus, total: fromRoom + fromBonus };
    override.total += fromRoom + fromBonus;
  });

  if (payload.lead) {
    return jsonResponse({
      role: payload.role,
      lead: true,
      totalCommission,
      tjkcTotal,
      markupPoolFromFreeAgents,
      agentTotals,
      bonus: {
        roomsPerIncrement: bonusRoomsPerIncrement,
        amountPerIncrement: bonusAmountPerIncrement,
        totalPricedRooms,
        bonusIncrements,
        bonusPool,
        shares: bonusShares,
        toMarkupPool: bonusToMarkupPool,
      },
      bonusContract2: {
        roomsPerIncrement: bonusRoomsPerIncrementC2,
        amountPerIncrement: bonusAmountPerIncrementC2,
        totalPricedRooms: totalPricedRoomsC2,
        bonusIncrements: bonusIncrementsC2,
        bonusPool: bonusPoolC2,
        shares: bonusSharesC2,
        toMarkupPool: bonusToMarkupPoolC2,
      },
      override,
    });
  }

  const mine = agentTotals[payload.role] || { commission: 0, tjkcDeduction: 0, rooms: [] };
  return jsonResponse({
    role: payload.role,
    lead: false,
    totalCommission,
    mine: {
      commission: mine.commission,
      tjkcDeduction: mine.tjkcDeduction,
      net: mine.commission - mine.tjkcDeduction,
      splitConfirmed: typeof AGENT_SPLIT_RATES[payload.role] === "number",
      rooms: mine.rooms,
    },
    bonus: isBonusEligible
      ? {
          roomsPerIncrement: bonusRoomsPerIncrement,
          amountPerIncrement: bonusAmountPerIncrement,
          bonusPool,
          mine: bonusShares[payload.role] || 0,
        }
      : null,
  });
};
