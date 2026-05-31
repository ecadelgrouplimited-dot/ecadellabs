import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyJWT, COOKIE_NAME } from "@/lib/auth";
import nodemailer from "nodemailer";

function getTransporter() {
  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST ?? "smtp.hostinger.com",
    port:   Number(process.env.SMTP_PORT ?? 465),
    secure: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

const FROM = `"ECADEL LABS Research" <${process.env.SMTP_USER ?? "ecadel@ecadelgroup.com"}>`;
const BASE = "https://ecadellabs.cloud";

export async function POST(request: Request) {
  // Require admin
  const jar     = await cookies();
  const token   = jar.get(COOKIE_NAME)?.value;
  const payload = token ? verifyJWT(token) : null;
  if (!payload || payload.role !== "admin") {
    return NextResponse.json({ error:"Forbidden" }, { status:403 });
  }

  const { subject, body, preview } = await request.json();
  if (!subject?.trim() || !body?.trim()) {
    return NextResponse.json({ error:"Subject and body are required" }, { status:400 });
  }

  // Get all newsletter subscribers
  const subscribers = await prisma.inquiry.findMany({
    where:  { type:"newsletter", archived:false },
    select: { email:true, name:true },
  });

  if (subscribers.length === 0) {
    return NextResponse.json({ error:"No subscribers found" }, { status:400 });
  }

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#060608;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="600" style="max-width:600px;margin:0 auto;">
    <!-- Header -->
    <tr>
      <td style="background:#0A0C12;border-top:3px solid #C8A96E;padding:28px 36px;border-bottom:1px solid rgba(255,255,255,0.07);">
        <span style="font-weight:800;font-size:15px;letter-spacing:0.25em;color:#F0EDE6;text-transform:uppercase;">
          ECADEL <span style="color:#C8A96E;">LABS</span>
        </span>
        <div style="font-size:9px;letter-spacing:0.2em;color:rgba(200,196,190,0.4);text-transform:uppercase;margin-top:4px;">
          Research &amp; Innovation Engine
        </div>
      </td>
    </tr>
    <!-- Body -->
    <tr>
      <td style="background:#0A0C12;padding:36px 36px 20px;">
        <p style="font-size:9px;letter-spacing:0.3em;color:#C8A96E;text-transform:uppercase;margin:0 0 20px;">
          Research Update
        </p>
        <h1 style="font-size:24px;font-weight:700;color:#F0EDE6;margin:0 0 24px;line-height:1.2;">${subject}</h1>
        <div style="font-size:15px;line-height:1.8;color:rgba(200,196,190,0.8);">
          ${body.replace(/\n\n/g,"</p><p style=\"margin-bottom:1em;\">").replace(/\n/g,"<br>")}
        </div>
      </td>
    </tr>
    <!-- CTA -->
    <tr>
      <td style="background:#0A0C12;padding:0 36px 32px;">
        <a href="${BASE}/publications" style="display:inline-block;padding:12px 28px;background:#C8A96E;color:#060608;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:0.02em;">
          Read Latest Research →
        </a>
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="background:#060608;border-top:1px solid rgba(255,255,255,0.07);padding:18px 36px;">
        <p style="font-size:9px;color:rgba(200,196,190,0.3);margin:0;letter-spacing:0.1em;">
          ECADEL LABS · A Division of ECADEL GROUP LIMITED · Kampala, Uganda<br>
          You received this because you subscribed to ECADEL LABS research updates.<br>
          <a href="${BASE}" style="color:#C8A96E;text-decoration:none;">ecadellabs.cloud</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  if (preview) {
    // Preview mode — return HTML without sending
    return NextResponse.json({ html, count: subscribers.length });
  }

  // Send to all subscribers
  const transporter = getTransporter();
  let sent = 0;
  let failed = 0;

  for (const sub of subscribers) {
    try {
      await transporter.sendMail({ from: FROM, to: sub.email, subject, html });
      sent++;
    } catch { failed++; }
  }

  return NextResponse.json({ sent, failed, total: subscribers.length });
}
