export default {
	async fetch(req, env) {
		const url = new URL(req.url);

		// 1) Simple echo to prove the Worker is live
		if (url.pathname === "/echo") {
			return new Response(JSON.stringify({ ok: true, now: Date.now() }), {
				status: 200,
				headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
			});
		}

		// 2) Health check: do a tiny Groq chat call via the Worker
		if (url.pathname === "/health") {
			const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
				method: "POST",
				headers: {
					"Authorization": `Bearer ${env.GROQ_API_KEY}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					model: "llama-3.3-70b-versatile",
					messages: [{ role: "user", content: "ping" }],
					max_tokens: 4,
				}),
			});
			const text = await r.text();
			return new Response(JSON.stringify({
				ok: r.ok, status: r.status, sample: text.slice(0, 200)
			}), {
				status: r.ok ? 200 : 502,
				headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
			});
		}

		// 3) Proxy only OpenAI-compatible paths
		if (!url.pathname.startsWith("/openai/v1/")) {
			return new Response("Not Found", { status: 404 });
		}

		url.hostname = "api.groq.com"; // keep path as-is
		const hdrs = new Headers(req.headers);
		hdrs.set("Authorization", `Bearer ${env.GROQ_API_KEY}`);
		hdrs.set("Host", "api.groq.com");

		const init = {
			method: req.method,
			headers: hdrs,
			body: (req.method === "GET" || req.method === "HEAD") ? undefined : await req.arrayBuffer(),
		};

		const upstream = await fetch(url, init);
		return new Response(upstream.body, { status: upstream.status, headers: upstream.headers });
	},
};
