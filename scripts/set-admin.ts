// scripts/set-admin.ts
// One-shot admin provisioning. Inlines Admin SDK init because
// lib/firebase-admin.ts has `import "server-only"` which is only
// meaningful inside the Next.js runtime.
//
// Usage:
//   npx tsx scripts/set-admin.ts <email>              # set claim on existing user
//   npx tsx scripts/set-admin.ts <email> <password>   # create user first, then set claim

import { config } from "dotenv";
import path from "node:path";

async function main() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  const { error } = config({ path: envPath });
  if (error) throw new Error("Cannot load .env.local: " + error.message);

  const email = process.argv[2];
  const password = process.argv[3];

  if (!email) {
    console.error("Usage: npx tsx scripts/set-admin.ts <email> [password]");
    console.error("");
    console.error("  If the user exists, only the admin claim is set.");
    console.error("  If the user does not exist and password is provided, they are created first.");
    process.exit(1);
  }

  // Inline Admin SDK init - do NOT import lib/firebase-admin.ts
  const { cert, initializeApp } = await import("firebase-admin/app");
  const { getAuth } = await import("firebase-admin/auth");

  const app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    }),
  });

  const auth = getAuth(app);

  let uid: string;

  try {
    const user = await auth.getUserByEmail(email);
    uid = user.uid;
    console.log("Found existing user: " + user.email + " (uid=" + uid + ")");
  } catch (err: any) {
    const notFound =
      err?.code === "auth/user-not-found" ||
      (typeof err?.message === "string" && err.message.includes("no user record"));

    if (notFound && password) {
      console.log("User not found - creating: " + email);
      const user = await auth.createUser({ email, password });
      uid = user.uid;
      console.log("Created user: " + user.email + " (uid=" + uid + ")");
    } else if (notFound) {
      throw new Error(
        "User " + email + " not found.\n" +
        "  Either create the account first (Firebase Console -> Authentication -> Users -> Add user),\n" +
        "  or re-run with a password:\n" +
        "    npx tsx scripts/set-admin.ts " + email + " <YourPassword>"
      );
    } else {
      throw err;
    }
  }

  await auth.setCustomUserClaims(uid, { admin: true });
  console.log("Set admin=true custom claim for uid=" + uid);

  const refreshed = await auth.getUser(uid);
  console.log("");
  console.log("Verification:");
  console.log("  Email:  " + refreshed.email);
  console.log("  UID:    " + refreshed.uid);
  console.log("  Claims: " + JSON.stringify(refreshed.customClaims));

  if (refreshed.customClaims?.admin !== true) {
    throw new Error("Verification failed: admin claim not present after set!");
  }

  console.log("");
  console.log("SUCCESS: " + email + " is now an admin.");
  console.log("");
  console.log("Important:");
  console.log("  - If you were already signed in somewhere, sign out and sign back in.");
  console.log("    Custom claims are baked into the ID token at mint time, so an old");
  console.log("    token will not show admin=true until it is refreshed.");
  console.log("  - This user can now access /admin (once Step 7 is deployed).");
}

main().catch((err) => {
  console.error("");
  console.error("FAILED:", err?.message ?? err);
  process.exit(1);
});
