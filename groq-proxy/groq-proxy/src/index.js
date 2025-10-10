export default {
	async fetch(req, env) {
		const u = new URL(req.url);

		// Debug endpoints
		if (u.pathname === "/echo") {
			return new Response(JSON.stringify({ ok: true, path: u.pathname, now: Date.now() }), {
				headers: { "Content-Type": "application/json" },
			});
		}
		if (u.pathname === "/health") {
			const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
				method: "POST",
				headers: {
					"Authorization": `Bearer ${env.GROQ_API_KEY}`,
					"Content-Type": "application/json",
					"Accept": "application/json",
				},
				body: JSON.stringify({
					model: "llama-3.3-70b-versatile",
					messages: [{ role: "user", content: "ping" }],
					max_tokens: 4,
				}),
			});
			const sample = await r.text();
			return new Response(JSON.stringify({ ok: r.ok, status: r.status, sample: sample.slice(0, 200) }), {
				status: r.ok ? 200 : 502,
				headers: { "Content-Type": "application/json" },
			});
		}

		// Normalize and gate the proxied path
		u.pathname = u.pathname.replace(/^\/+/, "/"); // collapse // to /
		if (!u.pathname.startsWith("/openai/v1/")) {
			return new Response("Not Found", { status: 404 });
		}

		// Forward to Groq
		const upstream = new URL(u.toString());
		upstream.hostname = "api.groq.com";

		const hasBody = !(req.method === "GET" || req.method === "HEAD");
		const body = hasBody ? await req.arrayBuffer() : undefined;

		const headers = new Headers();
		headers.set("Authorization", `Bearer ${env.GROQ_API_KEY}`);
		if (hasBody) headers.set("Content-Type", req.headers.get("Content-Type") || "application/json");
		headers.set("Accept", "application/json");

		const r = await fetch(upstream, { method: req.method, headers, body });
		const h = new Headers(r.headers);
		h.set("x-upstream-status", String(r.status));  // help debug
		h.set("x-upstream-url", upstream.pathname);    // help debug
		return new Response(r.body, { status: r.status, headers: h });
	},
};
