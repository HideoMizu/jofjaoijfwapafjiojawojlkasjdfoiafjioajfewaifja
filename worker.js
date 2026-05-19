// Cloudflare Worker for Soccer Team Manager v6
// Required KV binding name: SOCCER_KV
// Routes:
//   GET  /api/data?team=BBS&pw=ABC
//   POST /api/data  { team, password, data }

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-store"
};

function json(obj, status=200){
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" }
  });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    const url = new URL(request.url);

    try {
      if (url.pathname === "/api/data" && request.method === "GET") {
        const team = url.searchParams.get("team") || "";
        const pw = url.searchParams.get("pw") || "";
        if (!team || !pw) return json({ error: "team and pw are required" }, 400);

        const key = `team:${team}`;
        const data = await env.SOCCER_KV.get(key, "json");
        if (!data) return json({ exists: false, data: null }, 404);

        if (!data.team || data.team.password !== pw) {
          return json({ error: "wrong password" }, 403);
        }

        return json({ exists: true, data });
      }

      if (url.pathname === "/api/data" && request.method === "POST") {
        const body = await request.json();
        const team = body.team || "";
        const password = body.password || "";
        const data = body.data;

        if (!team || !password || !data) return json({ error: "team, password, data are required" }, 400);
        if (!data.team || data.team.name !== team || data.team.password !== password) {
          return json({ error: "team/password mismatch" }, 403);
        }

        const key = `team:${team}`;
        const existing = await env.SOCCER_KV.get(key, "json");
        if (existing && existing.team && existing.team.password !== password) {
          return json({ error: "wrong password" }, 403);
        }

        data.meta = data.meta || {};
        data.meta.savedAt = new Date().toISOString();

        await env.SOCCER_KV.put(key, JSON.stringify(data));
        return json({ ok: true, savedAt: data.meta.savedAt });
      }

      return json({ error: "not found" }, 404);
    } catch (e) {
      return json({ error: e.message || String(e) }, 500);
    }
  }
};
