import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebase-admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("__session")?.value;

  // Proxy normally blocks this — defensive redirect if it doesn't.
  if (!session) redirect("/");

  let isAdmin = false;
  try {
    const decoded = await adminAuth.verifySessionCookie(session, true);
    isAdmin = decoded.admin === true;
  } catch {
    isAdmin = false;
  }

  if (!isAdmin) redirect("/");

  return <>{children}</>;
}
