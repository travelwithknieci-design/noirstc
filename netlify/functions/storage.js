import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const store = getStore("noir-manifest");
  const url = new URL(req.url);

  if (req.method === "GET") {
    const key = url.searchParams.get("key");
    if (!key) {
      return new Response(JSON.stringify({ error: "Missing key" }), { status: 400 });
    }
    const value = await store.get(key);
    if (value === null) {
      return new Response(JSON.stringify({ value: null }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ value }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (req.method === "POST") {
    const body = await req.json();
    const { key, value } = body;
    if (!key) {
      return new Response(JSON.stringify({ error: "Missing key" }), { status: 400 });
    }
    await store.set(key, value);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Method not allowed", { status: 405 });
};
