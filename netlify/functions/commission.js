import { getStore } from "@netlify/blobs";
import { verifyToken } from "./_token.js";

const AGENT_SPLIT_RATES = { Carnisa: 1, Asia: 0.8, LaQuanda: 0.8 };

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

  const active = roster.filter((g) => !g.cancelled);
  const groups = new Map();
  const order = [];
  active.forEach((g) => {
    const key = (g.roomGroup && g.roomGroup.trim()) || "solo:" + g.id;
    if (!groups.has(key)) {
      groups.set(key, []);
      order.push(key);
    }
    groups.get(key).push(g);
  });

  let totalCommission = 0;
  let tjkcTotal = 0;
  let markupPoolFromFreeAgents = 0;
  const agentTotals = {};

  order.forEach((key) => {
    const guestsInRoom = groups.get(key);
    // Commission is stored once per room (replicated onto each roommate for display
    // purposes) — read it from a single guest, never sum across roommates, or a
    // shared room silently doubles its commission.
    const roomCommission = Number(getPrimaryGuest(guestsInRoom)?.commission) || 0;
    const primaryAgent = getRoomPrimaryAgent(guestsInRoom);
    const label = guestsInRoom.map((g) => g.name).join(" & ");
    totalCommission += roomCommission;

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

  if (payload.lead) {
    return jsonResponse({
      role: payload.role,
      lead: true,
      totalCommission,
      tjkcTotal,
      markupPoolFromFreeAgents,
      agentTotals,
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
  });
};
