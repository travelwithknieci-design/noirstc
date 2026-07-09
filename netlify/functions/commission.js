import { getStore } from "@netlify/blobs";
import { verifyToken } from "./_token.js";

const AGENT_SPLIT_RATES = { Carnisa: 1, Asia: 0.8, LaQuanda: 0.8 };

// Bonus commission: for every N priced rooms booked (trip-wide, excluding personal
// rooms), the group earns an additional flat bonus. Only these three ever share in
// it, split proportional to each one's share of all priced rooms in the trip — the
// remainder (representing Adrienne's and Free Agent rooms' share of that stake)
// rolls into the markup pool, the same way unattributed commission already does.
const BONUS_ELIGIBLE_AGENTS = ["Carnisa", "Asia", "LaQuanda"];
const BONUS_ROOMS_PER_INCREMENT = 11;
const BONUS_AMOUNT_PER_INCREMENT = 1610;

function getRoomPrimaryAgent(guestsInRoom) {
  const primary = guestsInRoom.find((g) => g.primaryTraveler && g.agent);
  if (primary) return primary.agent;
  const any = guestsInRoom.find((g) => g.agent);
  return any ? any.agent : null;
}

function getPrimaryGuest(guestsInRoom) {
  return guestsInRoom.find((g) => g.primaryTraveler) || guestsInRoom[0];
}

function isPersonalRoom(guestsInRoom, stakeAgent) {
  if (!stakeAgent || stakeAgent === "Free Agent") return false;
  return guestsInRoom.some(
    (g) => g.name && g.name.trim().split(/\s+/)[0].toLowerCase() === stakeAgent.toLowerCase()
  );
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

  order.forEach((key) => {
    const guestsInRoom = groups.get(key);
    // Commission is stored once per room (replicated onto each roommate for display
    // purposes) — read it from a single guest, never sum across roommates, or a
    // shared room silently doubles its commission.
    const roomCommission = Number(getPrimaryGuest(guestsInRoom)?.commission) || 0;
    const primaryAgent = getRoomPrimaryAgent(guestsInRoom);
    const label = guestsInRoom.map((g) => g.name).join(" & ");
    totalCommission += roomCommission;

    // Stake tally — same rule as the client's "Agent stake in the trip": a room
    // counts only if it's actually priced, and an agent's own personal room never
    // counts as one of their sales.
    const roomPrice = guestsInRoom.reduce((s, g) => s + (Number(g.price) || 0), 0);
    const stakeAgent = primaryAgent || "Free Agent";
    if (roomPrice > 0 && !isPersonalRoom(guestsInRoom, stakeAgent)) {
      totalPricedRooms += 1;
      agentPricedRoomCounts[stakeAgent] = (agentPricedRoomCounts[stakeAgent] || 0) + 1;
    }

    if (!primaryAgent) {
      markupPoolFromFreeAgents += roomCommission;
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
  const bonusIncrements = Math.floor(totalPricedRooms / BONUS_ROOMS_PER_INCREMENT);
  const bonusPool = bonusIncrements * BONUS_AMOUNT_PER_INCREMENT;
  const bonusShares = {};
  let bonusDistributed = 0;
  BONUS_ELIGIBLE_AGENTS.forEach((agent) => {
    const count = agentPricedRoomCounts[agent] || 0;
    const share = totalPricedRooms > 0 ? bonusPool * (count / totalPricedRooms) : 0;
    bonusShares[agent] = share;
    bonusDistributed += share;
  });
  const bonusToMarkupPool = bonusPool - bonusDistributed;

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
        roomsPerIncrement: BONUS_ROOMS_PER_INCREMENT,
        amountPerIncrement: BONUS_AMOUNT_PER_INCREMENT,
        totalPricedRooms,
        bonusIncrements,
        bonusPool,
        shares: bonusShares,
        toMarkupPool: bonusToMarkupPool,
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
          roomsPerIncrement: BONUS_ROOMS_PER_INCREMENT,
          amountPerIncrement: BONUS_AMOUNT_PER_INCREMENT,
          bonusPool,
          mine: bonusShares[payload.role] || 0,
        }
      : null,
  });
};
