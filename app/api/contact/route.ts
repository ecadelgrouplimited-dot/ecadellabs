import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendInquiryAutoReply, sendInquiryNotification } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { name, email, organisation, type, message } = await request.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Save to database
    await prisma.inquiry.create({
      data: { name, email, organisation: organisation ?? null, type: type ?? "general", message },
    });

    // Send emails if SMTP is configured
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await Promise.allSettled([
        sendInquiryAutoReply(email, name, type ?? "general"),
        sendInquiryNotification({ name, email, organisation, type: type ?? "general", message }),
      ]);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact error:", err);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
