export default {
	async fetch(req, env) {
		const u = new URL(req.url);

		// Debug
		if (u.pathname === "/echo")
			return new Response(JSON.stringify({ ok: true, now: Date.now() }), { headers: { "Content-Type": "application/json" } });

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
			const text = await r.text();
			return new Response(JSON.stringify({ ok: r.ok, status: r.status, sample: text.slice(0, 200) }), {
				status: r.ok ? 200 : 502,
				headers: { "Content-Type": "application/json" },
			});
		}

		// Proxy only OpenAI-compatible paths
		if (!u.pathname.startsWith("/openai/v1/"))
			return new Response("Not Found", { status: 404 });

		// ---- KEY CHANGE: buffer and send a clean JSON string ----
		const method = req.method.toUpperCase();
		const hasBody = !(method === "GET" || method === "HEAD");
		const textBody = hasBody ? await req.text() : null;

		const r = await fetch("https://api.groq.com" + u.pathname + u.search, {
			method,
			headers: {
				"Authorization": `Bearer ${env.GROQ_API_KEY}`,
				"Content-Type": "application/json",
				"Accept": "application/json",
			},
			body: hasBody ? textBody : undefined, // string, not stream
			redirect: "follow",
		});

		// expose upstream info for debugging
		const out = new Response(r.body, { status: r.status, headers: r.headers });
		out.headers.set("x-upstream-status", String(r.status));
		out.headers.set("x-upstream-url", u.pathname);
		return out;
	},
};
