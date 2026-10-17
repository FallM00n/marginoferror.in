// Margin of Error edge worker.
// Serves the static site (via the ASSETS binding) and a tiny reactions API.
// Reactions are stored in Cloudflare KV under the REACTIONS binding.
// If REACTIONS is not configured yet, the API reports {enabled:false}
// and the site simply hides the reaction buttons.

const TYPES = ["useful", "think", "disagree"];
const SLUG = /^\/(writing|projects)\/[a-z0-9-]{1,100}\/$/;

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

const empty = () => Object.fromEntries(TYPES.map((t) => [t, 0]));

function normalize(raw) {
  const out = empty();
  if (!raw) return out;
  try {
    const parsed = JSON.parse(raw);
    for (const t of TYPES) out[t] = Math.max(0, parseInt(parsed[t], 10) || 0);
  } catch (e) {}
  return out;
}

async function reactions(request, env, url) {
  if (!env.REACTIONS) return json({ enabled: false });

  if (request.method === "GET") {
    const slug = url.searchParams.get("slug") || "";
    if (!SLUG.test(slug)) return json({ error: "bad slug" }, 400);
    return json({ enabled: true, counts: normalize(await env.REACTIONS.get("r:" + slug)) });
  }

  if (request.method === "POST") {
    const origin = request.headers.get("origin");
    if (origin) {
      try {
        if (new URL(origin).host !== url.host) return json({ error: "forbidden" }, 403);
      } catch (e) {
        return json({ error: "forbidden" }, 403);
      }
    }
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return json({ error: "bad body" }, 400);
    }
    const { slug, type, delta } = body || {};
    if (!SLUG.test(slug || "") || !TYPES.includes(type) || (delta !== 1 && delta !== -1)) {
      return json({ error: "bad request" }, 400);
    }
    const key = "r:" + slug;
    const counts = normalize(await env.REACTIONS.get(key));
    counts[type] = Math.max(0, counts[type] + delta);
    await env.REACTIONS.put(key, JSON.stringify(counts));
    return json({ enabled: true, counts });
  }

  return json({ error: "method not allowed" }, 405);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/reactions") return reactions(request, env, url);
    return env.ASSETS.fetch(request);
  },
};
