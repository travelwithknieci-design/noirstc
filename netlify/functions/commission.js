import { getStore } from "@netlify/blobs";
import { verifyToken } from "./_token.js";

const AGENT_SPLIT_RATES = { Carnisa: 1, Asia: 0.8, LaQuanda: 0.8 };

function getRoomPrimaryAgent(guestsInRoom) {
  const primary = guestsInRoom.find((g) => g.primaryTraveler && g.agent);
  if (primary) return primary.agent;
  const any = guestsInRoom.find((g) => g.agent);
  return any ? any.agent : null;
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
  active.forEach((g) => {
    const key = (g.roomGroup && g.roomGroup.trim()) || "solo:" + g.id;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(g);
  });

  let totalCommission = 0;
  let tjkcTotal = 0;
  let markupPoolFromFreeAgents = 0;
  const agentTotals = {};

  groups.forEach((guestsInRoom) => {
    const roomCommission = guestsInRoom.reduce((s, g) => s + (Number(g.commission) || 0), 0);
    const primaryAgent = getRoomPrimaryAgent(guestsInRoom);
    totalCommission += roomCommission;
    if (!primaryAgent) {
      markupPoolFromFreeAgents += roomCommission;
      return;
    }
    if (!agentTotals[primaryAgent]) agentTotals[primaryAgent] = { commission: 0, tjkcDeduction: 0 };
    agentTotals[primaryAgent].commission += roomCommission;
    if (typeof AGENT_SPLIT_RATES[primaryAgent] === "number") {
      const deduction = roomCommission * (1 - AGENT_SPLIT_RATES[primaryAgent]);
      agentTotals[primaryAgent].tjkcDeduction += deduction;
      tjkcTotal += deduction;
    }
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

  const mine = agentTotals[payload.role] || { commission: 0, tjkcDeduction: 0 };
  return jsonResponse({
    role: payload.role,
    lead: false,
    totalCommission,
    mine: {
      commission: mine.commission,
      tjkcDeduction: mine.tjkcDeduction,
      net: mine.commission - mine.tjkcDeduction,
      splitConfirmed: typeof AGENT_SPLIT_RATES[payload.role] === "number",
    },
  });
};
