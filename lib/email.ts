import nodemailer from "nodemailer";

function getTransporter() {
  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST ?? "smtp.hostinger.com",
    port:   Number(process.env.SMTP_PORT ?? 465),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const FROM = `"ECADEL LABS" <${process.env.SMTP_USER ?? "ecadel@ecadelgroup.com"}>`;

export async function sendInquiryAutoReply(to: string, name: string, type: string) {
  const labels: Record<string, string> = {
    research: "Research Collaboration",
    fellowship: "Fellowship Application",
    partnership: "Institutional Partnership",
    grant: "Grant Inquiry",
    general: "General Inquiry",
  };
  const label = labels[type] ?? "Inquiry";

  await getTransporter().sendMail({
    from: FROM,
    to,
    subject: `We received your ${label} — ECADEL LABS`,
    html: `<!DOCTYPE html><html><body style="background:#060608;color:#F0EDE6;font-family:'Helvetica Neue',sans-serif;padding:40px 20px;">
<table width="600" style="max-width:600px;margin:0 auto;">
<tr><td style="background:#0A0C12;border-top:3px solid #C8A96E;padding:28px 36px;border-bottom:1px solid rgba(255,255,255,0.07);">
  <span style="font-weight:800;font-size:15px;letter-spacing:0.25em;color:#F0EDE6;text-transform:uppercase;">ECADEL <span style="color:#C8A96E;">LABS</span></span>
  <div style="font-size:9px;letter-spacing:0.2em;color:rgba(200,196,190,0.45);text-transform:uppercase;margin-top:4px;">Research &amp; Innovation Engine</div>
</td></tr>
<tr><td style="background:#0A0C12;padding:40px 36px;">
  <p style="font-size:9px;letter-spacing:0.3em;color:#C8A96E;text-transform:uppercase;margin-bottom:20px;">— ${label} Received</p>
  <h1 style="font-size:28px;font-weight:300;color:#F0EDE6;margin-bottom:8px;">Thank you, <strong>${name}.</strong></h1>
  <p style="font-size:14px;font-style:italic;color:#9A9590;margin-bottom:32px;">Your ${label.toLowerCase()} has been received. We will respond within 72 hours.</p>
  <p style="font-size:14px;line-height:1.8;color:#9A9590;margin-bottom:16px;">
    ECADEL LABS reviews every inquiry from researchers, universities, grant bodies, and institutions personally. You will receive a substantive response — not a template.
  </p>
  <p style="font-size:14px;line-height:1.8;color:#9A9590;margin-bottom:32px;">
    In the meantime, explore our research at <a href="https://ecadellabs.cloud" style="color:#C8A96E;text-decoration:none;">ecadellabs.cloud</a>.
  </p>
</td></tr>
<tr><td style="background:#060608;border-top:1px solid rgba(255,255,255,0.06);padding:18px 36px;display:flex;justify-content:space-between;">
  <span style="font-size:8px;letter-spacing:0.12em;color:rgba(200,196,190,0.25);text-transform:uppercase;">© 2026 ECADEL LABS · A Division of ECADEL GROUP LIMITED · Kampala, Uganda</span>
</td></tr>
</table></body></html>`,
  });
}

export async function sendInquiryNotification(data: {
  name: string; email: string; organisation?: string; type: string; message: string;
}) {
  const label = data.type.charAt(0).toUpperCase() + data.type.slice(1);
  await getTransporter().sendMail({
    from:    FROM,
    to:      process.env.SMTP_USER ?? "ecadel@ecadelgroup.com",
    replyTo: data.email,
    subject: `[LABS ${label}] ${data.name}${data.organisation ? ` — ${data.organisation}` : ""} · ecadellabs.cloud`,
    html: `<!DOCTYPE html><html><body style="background:#0A0C12;color:#F0EDE6;font-family:'Helvetica Neue',sans-serif;padding:32px 20px;">
<table width="600" style="max-width:600px;margin:0 auto;">
<tr><td style="background:#141928;border-top:3px solid #C8A96E;padding:18px 28px;">
  <span style="font-size:9px;letter-spacing:0.25em;color:#C8A96E;text-transform:uppercase;">ECADEL LABS · New Inquiry · ecadellabs.cloud</span>
</td></tr>
<tr><td style="background:#0D1220;padding:28px;">
  <h2 style="font-size:22px;font-weight:300;color:#F0EDE6;margin-bottom:4px;">${data.name}</h2>
  <p style="font-size:12px;font-style:italic;color:#C8A96E;margin-bottom:24px;">${label} · ${data.organisation ?? "—"}</p>
  <table width="100%" style="border:1px solid rgba(255,255,255,0.06);margin-bottom:24px;">
    ${[["Name",data.name],["Organisation",data.organisation??"-"],["Email",data.email],["Type",label]].map(([k,v])=>`
    <tr><td style="padding:10px 16px;width:36%;background:#0A0C12;border-bottom:1px solid rgba(255,255,255,0.04);font-size:8px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(200,196,190,0.4);">${k}</td>
    <td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.04);font-size:13px;color:#E8E4DC;">${v}</td></tr>`).join("")}
  </table>
  <div style="background:rgba(200,169,110,0.04);border-left:3px solid #C8A96E;padding:20px 24px;">
    <p style="font-size:8px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(200,196,190,0.4);margin-bottom:12px;">Message</p>
    <p style="font-size:13px;color:#9A9590;line-height:1.75;">${data.message}</p>
  </div>
  <p style="margin-top:20px;font-size:11px;color:rgba(200,196,190,0.35);">Reply directly to respond to <a href="mailto:${data.email}" style="color:#C8A96E;">${data.email}</a></p>
</td></tr>
</table></body></html>`,
  });
}
