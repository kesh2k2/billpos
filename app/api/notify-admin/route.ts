// app/api/notify-admin/route.ts
// Called from the client after a successful feedback submission.
// Sends an email to every Firebase user with admin: true.
//
// Uses @/lib/send-email if it exports `sendEmail`. If not,
// falls back to a console.log so the flow never breaks.
// To enable real email, make sure lib/send-email.ts exports:
//   export async function sendEmail({ to, subject, html, text })

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

async function getSessionUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("__session")?.value;
  if (!session) return null;
  try {
    return await adminAuth.verifySessionCookie(session, true);
  } catch {
    return null;
  }
}

async function trySendEmail(payload: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<boolean> {
  try {
    const mod = await import("@/lib/send-email");
    const anyMod = mod as unknown as Record<string, unknown>;
    const fn =
      (anyMod.sendEmail as Function | undefined) ??
      (anyMod.default as Function | undefined) ??
      (anyMod.send as Function | undefined);
    if (typeof fn !== "function") {
      console.warn("[notify-admin] lib/send-email exports no sendEmail fn");
      return false;
    }
    await fn(payload);
    return true;
  } catch (err) {
    console.warn("[notify-admin] email send failed:", (err as Error).message);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const body = (await request.json()) as { feedbackId?: unknown };
    if (typeof body.feedbackId !== "string") {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const doc = await adminDb.collection("feedback").doc(body.feedbackId).get();
    if (!doc.exists) {
      return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
    }

    const data = doc.data() as {
      userId?: string;
      name?: string;
      business?: string;
      comment?: string;
      rating?: number;
      status?: string;
    };

    // Only the submitter can trigger the notification (prevents spam)
    if (data.userId !== session.uid) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // List admins
    const list = await adminAuth.listUsers(1000);
    const adminEmails = list.users
      .filter((u) => u.customClaims?.admin === true && u.email && !u.disabled)
      .map((u) => u.email as string);

    if (adminEmails.length === 0) {
      console.warn("[notify-admin] no admin emails to notify");
      return NextResponse.json({ ok: true, notified: 0 });
    }

    const stars =
      "★".repeat(data.rating ?? 0) + "☆".repeat(5 - (data.rating ?? 0));
    const adminUrl = `${process.env.APP_ORIGIN ?? ""}/admin`;
    const subject = `New feedback pending review from ${data.name ?? "a user"}`;
    const text =
      `New feedback pending review\n\n` +
      `From: ${data.name ?? "—"} (${data.business ?? "—"})\n` +
      `Rating: ${stars}\n\n` +
      `${data.comment ?? ""}\n\n` +
      `Review at: ${adminUrl}`;
    const html = `
      <h2 style="font-family:Georgia,serif;color:#0a1b3d;margin:0 0 16px;">
        New feedback pending review
      </h2>
      <p style="color:#0a1b3d;"><strong>From:</strong> ${data.name ?? "—"} (${data.business ?? "—"})</p>
      <p style="color:#0a1b3d;"><strong>Rating:</strong> ${stars}</p>
      <blockquote style="border-left:3px solid #cfe5f6;padding-left:12px;color:#333;margin:16px 0;">
        ${(data.comment ?? "").replace(/</g, "&lt;")}
      </blockquote>
      <p><a href="${adminUrl}" style="background:#0a1b3d;color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none;display:inline-block;">Open admin dashboard</a></p>
    `;

    let sent = 0;
    for (const to of adminEmails) {
      const ok = await trySendEmail({ to, subject, html, text });
      if (ok) {
        sent++;
      } else {
        console.log(
          `[notify-admin] would notify ${to}: ${subject}`
        );
      }
    }

    return NextResponse.json({
      ok: true,
      notified: sent,
      total: adminEmails.length,
    });
  } catch (err) {
    console.error("[notify-admin]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
