interface Env {
  DB?: D1Database;
}

type InquiryPayload = {
  name?: unknown;
  contact?: unknown;
  business?: unknown;
  message?: unknown;
  consent?: unknown;
  companyWebsite?: unknown;
};

const allowedBusinesses = new Set(["apparel", "ceramics", "ai", "company"]);

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
}

function text(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json({ message: "请使用网站表单提交信息。" }, 415);
  }

  let payload: InquiryPayload;
  try {
    payload = await request.json();
  } catch {
    return json({ message: "提交内容格式不正确。" }, 400);
  }

  if (text(payload.companyWebsite, 200)) {
    return json({ message: "信息已收到。" }, 201);
  }

  const name = text(payload.name, 60);
  const contact = text(payload.contact, 120);
  const business = text(payload.business, 24);
  const message = text(payload.message, 1000);
  const consent = payload.consent === "on" || payload.consent === true;

  if (name.length < 2 || contact.length < 5 || message.length < 10 || !allowedBusinesses.has(business) || !consent) {
    return json({ message: "请完整填写称呼、联系方式、合作方向和需求说明。" }, 400);
  }

  if (!env.DB) {
    return json({ message: "联系服务尚未完成上线配置，请稍后再试。" }, 503);
  }

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  await env.DB.prepare(
    "INSERT INTO inquiries (id, name, contact, business, message, consent, created_at, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(id, name, contact, business, message, 1, createdAt, "new").run();

  return json({ message: "信息已收到，我们会在正式联系方式配置后尽快回复。", id }, 201);
};

export const onRequestOptions: PagesFunction = async () => new Response(null, {
  status: 204,
  headers: {
    "allow": "POST, OPTIONS",
    "cache-control": "no-store",
  },
});
