import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

// Node.js runtime — required because firebase-admin uses node:crypto
// to verify session cookie signatures. Edge runtime cannot do this.

export async function proxy(request: NextRequest) {
  const session = request.cookies.get("__session")?.value;

  // No cookie → redirect before React renders anything.
  if (!session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Cookie present → verify signature + admin claim.
  // Any failure (invalid, expired, revoked, non-admin) → redirect.
  try {
    const decoded = await adminAuth.verifySessionCookie(session, true);
    if (decoded.admin !== true) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
