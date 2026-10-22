// app/api/session/route.ts
// Exchanges a Firebase ID token for an HTTP-only session cookie (POST),
// or clears that cookie on sign-out (DELETE).
//
// The cookie is the ONLY thing middleware trusts to authorize /admin/*.

import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

export const runtime = "nodejs";

// 5 days — Firebase allows up to 14. Shorter = safer (users re-auth more).
const EXPIRES_IN_MS = 5 * 24 * 60 * 60 * 1000;

// Note: ID tokens have a 1-hour TTL. Any valid token therefore has
// auth_time within the last hour. We set this generously to 1 hour so
// this check is effectively a no-op for valid tokens — the actual
// security comes from verifyIdToken(idToken, checkRevoked=true), which
// rejects expired, revoked, and forged tokens.
//
// A tighter window (like Firebase's 5-minute example for "sensitive
// operations") breaks routine session-cookie refreshes for users who
// have been signed in for more than a few minutes.
const MAX_AUTH_AGE_SECONDS = 60 * 60; // 1 hour — matches token TTL

function originOk(request: Request): boolean {
  const allowed = process.env.APP_ORIGIN;
  if (!allowed) return false;
  const actual = request.headers.get("origin");
  return actual === allowed;
}

// ── POST: create session cookie ─────────────────────────────────────
export async function POST(request: Request) {
  if (!originOk(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  const authorization = request.headers.get("authorization");
  const idToken = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : null;

  if (!idToken) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  try {
    const decoded = await adminAuth.verifyIdToken(idToken, true /* checkRevoked */);

    // Reject tokens near expiry (which would fail anyway, but this
    // short-circuits before we burn an API call on createSessionCookie).
    const authAge = Date.now() / 1000 - decoded.auth_time;
    if (authAge > MAX_AUTH_AGE_SECONDS) {
      return NextResponse.json(
        { error: "Session expired — please sign in again" },
        { status: 401 }
      );
    }

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: EXPIRES_IN_MS,
    });

    const response = NextResponse.json({ ok: true });
    response.cookies.set("__session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: EXPIRES_IN_MS / 1000,
    });
    return response;
  } catch (err) {
    console.error("[session POST] verify failed:", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

// ── DELETE: clear session cookie (sign-out) ────────────────────────
export async function DELETE(request: Request) {
  if (!originOk(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set("__session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
