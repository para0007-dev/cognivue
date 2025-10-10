export default {
	async fetch(req, env) {
		const url = new URL(req.url);

		console.log("PATH:", url.pathname); // <-- see exact path
		if (!u.pathname.startsWith("/openai/v1/")) {
			return new Response("Not Found", { status: 404 });
		}

		// Health + echo
		if (url.pathname === "/echo") {
			return new Response(JSON.stringify({ ok: true, now: Date.now() }), {
				headers: { "Content-Type": "application/json" },
			});
		}
		if (url.pathname === "/health") {
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

		// Only proxy OpenAI-compatible paths
		if (!url.pathname.startsWith("/openai/v1/")) {
			return new Response("Not Found", { status: 404 });
		}

		// Build upstream URL
		const upstreamUrl = new URL(url.toString());
		upstreamUrl.hostname = "api.groq.com";

		// Construct a clean request (avoid cloning hop-by-hop headers)
		const isBody = !(req.method === "GET" || req.method === "HEAD");
		const body = isBody ? await req.arrayBuffer() : undefined;

		const headers = new Headers();
		headers.set("Authorization", `Bearer ${env.GROQ_API_KEY}`);
		if (isBody) headers.set("Content-Type", req.headers.get("Content-Type") || "application/json");
		headers.set("Accept", "application/json");

		const resp = await fetch(upstreamUrl, {
			method: req.method,
			headers,
			body,
		});

		// Pass through response
		const outHeaders = new Headers(resp.headers);
		return new Response(resp.body, { status: resp.status, headers: outHeaders });
	},
};
