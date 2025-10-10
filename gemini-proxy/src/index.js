/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env) {
		// CORS preflight
		if (request.method === "OPTIONS") {
			return new Response(null, {
				status: 204,
				headers: {
					"access-control-allow-origin": "*",
					"access-control-allow-methods": "POST, OPTIONS",
					"access-control-allow-headers": "content-type",
					"access-control-max-age": "86400",
				},
			});
		}

		if (request.method !== "POST") {
			return new Response(JSON.stringify({ error: "POST only" }), {
				status: 405,
				headers: { "content-type": "application/json", "access-control-allow-origin": "*" },
			});
		}

		try {
			const body = await request.json();
			const url =
				"https://generativelanguage.googleapis.com/v1beta/models/" +
				"gemini-2.5-flash:generateContent?key=" + env.GEMINI_API_KEY;

			const r = await fetch(url, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify(body),
			});

			const text = await r.text();
			return new Response(text, {
				status: r.status,
				headers: {
					"content-type": "application/json",
					"access-control-allow-origin": "*",
					"cache-control": "no-store",
				},
			});
		} catch (e) {
			return new Response(JSON.stringify({ error: String(e) }), {
				status: 500,
				headers: { "content-type": "application/json", "access-control-allow-origin": "*" },
			});
		}
	},
};

