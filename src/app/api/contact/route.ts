import { NextResponse } from "next/server";

export interface ContactPayload {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  service: string;
  budget: string;
  details: string;
}

/**
 * Contact form endpoint.
 *
 * Delivery is structured so enquiries reach connect@claygraphik.com. Until an
 * email provider is configured, the endpoint returns a clear non-success
 * state (503) — it NEVER fakes success.
 *
 * Configure via env:
 *   RESEND_API_KEY=re_...            (Resend provider)
 *   CONTACT_TO=connect@claygraphik.com
 *   CONTACT_FROM=...                 (optional sender)
 */
export async function POST(request: Request) {
  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const name = (payload.name ?? "").trim();
  const email = (payload.email ?? "").trim().toLowerCase();
  const details = (payload.details ?? "").trim();

  if (!name || name.length < 2) {
    return NextResponse.json({ error: "NAME_REQUIRED" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "EMAIL_INVALID" }, { status: 400 });
  }
  if (!details || details.length < 20) {
    return NextResponse.json({ error: "DETAILS_TOO_SHORT" }, { status: 400 });
  }

  const to = process.env.CONTACT_TO || "connect@claygraphik.com";
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error: "CONTACT_FORM_NOT_CONFIGURED",
        message:
          "This form is not connected to an email provider yet. Please email connect@claygraphik.com directly.",
      },
      { status: 503 },
    );
  }

  const text = [
    `Name: ${name}`,
    `Company: ${payload.company || "—"}`,
    `Email: ${email}`,
    `Phone/WhatsApp: ${payload.phone || "—"}`,
    `Service: ${payload.service || "—"}`,
    `Budget: ${payload.budget || "—"}`,
    "",
    "Project details:",
    details,
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || "Clay Graphik Website <onboarding@resend.dev>",
        to: [to],
        subject: `New enquiry — ${name}${payload.company ? ` (${payload.company})` : ""}`,
        text,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "SEND_FAILED" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "SEND_FAILED" }, { status: 502 });
  }
}
