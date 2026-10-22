// app/api/admin/users/route.ts
// GET: list all users (requires admin)
// POST: { uid, admin: boolean } — promote/demote (requires admin)

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";

export const runtime = "nodejs";

async function getAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("__session")?.value;
  if (!session) return null;
  try {
    const decoded = await adminAuth.verifySessionCookie(session, true);
    if (decoded.admin !== true) return null;
    return decoded;
  } catch {
    return null;
  }
}

export async function GET() {
  const admin = await getAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const list = await adminAuth.listUsers(1000);
    const users = list.users
      .map((u) => ({
        uid: u.uid,
        email: u.email ?? null,
        displayName: u.displayName ?? null,
        admin: u.customClaims?.admin === true,
        disabled: u.disabled,
        emailVerified: u.emailVerified,
        created: u.metadata.creationTime ?? null,
        lastSignIn: u.metadata.lastSignInTime ?? null,
      }))
      .sort((a, b) => {
        if (a.admin !== b.admin) return a.admin ? -1 : 1;
        return (a.email ?? "").localeCompare(b.email ?? "");
      });

    return NextResponse.json({ users, selfUid: admin.uid });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const admin = await getAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      uid?: unknown;
      admin?: unknown;
    };
    if (typeof body.uid !== "string" || typeof body.admin !== "boolean") {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }
    if (body.uid === admin.uid && body.admin === false) {
      return NextResponse.json(
        { error: "You cannot remove your own admin privileges." },
        { status: 400 }
      );
    }

    await adminAuth.setCustomUserClaims(body.uid, { admin: body.admin });
    // Force the user to get a fresh token on next request
    await adminAuth.revokeRefreshTokens(body.uid);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
