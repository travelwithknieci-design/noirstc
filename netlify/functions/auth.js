import { signToken } from "./_token.js";

// Passwords are set as Netlify environment variables (Site configuration -> Environment variables),
// one per agent, named AUTH_PASSWORD_<NAME> with the name uppercased and spaces replaced with underscores.
// e.g. AUTH_PASSWORD_CARNISA, AUTH_PASSWORD_ASIA, AUTH_PASSWORD_LAQUANDA, AUTH_PASSWORD_ADRIENNE
const KNOWN_ROLES = ["Carnisa", "Asia", "LaQuanda", "Adrienne"];

function envKeyFor(name) {
  return "AUTH_PASSWORD_" + name.toUpperCase().replace(/[^A-Z]/g, "");
}

export default async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
  }

  const { name, password } = body || {};
  if (!name || !password || !KNOWN_ROLES.includes(name)) {
    return new Response(JSON.stringify({ error: "Invalid name or password" }), { status: 401 });
  }

  const expected = process.env[envKeyFor(name)];
  if (!expected || password !== expected) {
    return new Response(JSON.stringify({ error: "Invalid name or password" }), { status: 401 });
  }

  const isLead = name === "Carnisa";
  const token = signToken({ role: name, lead: isLead });

  return new Response(JSON.stringify({ token, role: name, lead: isLead }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
