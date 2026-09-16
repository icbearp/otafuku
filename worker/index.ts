import { onRequestOptions, onRequestPost } from "../functions/api/inquiry";

type Env = {
  ASSETS: { fetch(request: Request): Promise<Response> };
  DB: D1Database;
};

const securityHeaders: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'",
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/inquiry") {
      if (request.method === "POST") {
        return onRequestPost({ request, env } as Parameters<typeof onRequestPost>[0]);
      }
      if (request.method === "OPTIONS") {
        return onRequestOptions({ request, env } as Parameters<typeof onRequestOptions>[0]);
      }
      return new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST, OPTIONS" } });
    }

    const assetResponse = await env.ASSETS.fetch(request);
    const headers = new Headers(assetResponse.headers);
    for (const [name, value] of Object.entries(securityHeaders)) headers.set(name, value);
    if (url.pathname.startsWith("/assets/")) {
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
    }

    return new Response(assetResponse.body, {
      status: assetResponse.status,
      statusText: assetResponse.statusText,
      headers,
    });
  },
};
