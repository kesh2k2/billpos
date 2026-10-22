"use client";

// app/admin/page.tsx
// Admin dashboard — feedback moderation, user admin management,
// package editing. Styled with the Contacts section's aesthetic:
// Cormorant + Jost, navy #0a1b3d, light blue #cfe5f6, gray #dfe4eb,
// grain, halftone dots, torn paper, washi tape.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Cormorant_Garamond, Jost } from "next/font/google";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  X,
  Trash2,
  Save,
  MessageSquare,
  Package as PackageIcon,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  RefreshCw,
  AlertCircle,
  LogOut,
  Users,
  Shield,
  ShieldOff,
  Search,
  Loader2,
  Sparkles,
  Crown,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/auth/AuthProvider";

/* ─────────── Fonts + palette ─────────── */

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const sans = Jost({ subsets: ["latin"], weight: ["300", "400", "500"] });

const grain =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const halftoneDark =
  "radial-gradient(circle, rgba(10,27,61,0.9) 1.1px, transparent 1.6px)";
const halftoneLight =
  "radial-gradient(circle, rgba(207,229,246,0.9) 1.2px, transparent 1.7px)";

const torn =
  "polygon(0 0,100% 0,100% 92%,96% 97%,92% 91%,88% 98%,84% 92%,80% 97%,76% 91%,72% 98%,68% 92%,64% 97%,60% 91%,56% 98%,52% 92%,48% 97%,44% 91%,40% 98%,36% 92%,32% 97%,28% 91%,24% 98%,20% 92%,16% 97%,12% 91%,8% 98%,4% 92%,0 97%)";

const tapeClip =
  "polygon(0 0,4% 20%,0 40%,4% 60%,0 80%,3% 100%,100% 100%,96% 80%,100% 60%,96% 40%,100% 20%,97% 0)";

function Grain({ opacity = 0.18 }: { opacity?: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 mix-blend-multiply"
      style={{ backgroundImage: grain, opacity }}
    />
  );
}

function Tape({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute z-20 h-6 w-20 border-y border-white/60 bg-[#cfe5f6]/75 ${className}`}
      style={{ clipPath: tapeClip }}
    />
  );
}

/* ─────────── Types ─────────── */

type FeedbackStatus = "pending" | "approved" | "rejected";

type Feedback = {
  id: string;
  name: string;
  business: string;
  comment: string;
  rating: number;
  status: FeedbackStatus;
  userId: string;
  createdAt?: { toMillis?: () => number; toDate?: () => Date };
};

type UserRow = {
  uid: string;
  email: string | null;
  displayName: string | null;
  admin: boolean;
  disabled: boolean;
  emailVerified: boolean;
  created: string | null;
  lastSignIn: string | null;
};

type PackageDoc = {
  id?: string;
  key: string;
  name: string;
  tagline: string;
  inherits?: string;
  features: string[];
  featured?: boolean;
  order?: number;
};

const SEED_PACKAGES: PackageDoc[] = [
  {
    key: "starter",
    name: "Starter",
    tagline: "Everything a single shop needs to start selling with confidence.",
    features: [
      "POS & Quick POS checkout",
      "Cash & card payments",
      "Daily sales reports",
      "Receipt printing",
      "Customer lookup",
      "Email support",
      "Product & inventory management",
      "Stock alerts & low-stock warnings",
      "Barcode generator",
      "Customer management",
      "Basic reports & PDF export",
      "WhatsApp e-Bill",
    ],
    featured: false,
    order: 1,
  },
  {
    key: "business",
    name: "Business",
    tagline: "For growing businesses with branches, staff and after-sales work.",
    inherits: "Everything in Starter",
    features: [
      "Multi-branch & stock transfers",
      "Courier integration & tracking",
      "Job sheets, parts & warranty",
      "Staff management & roles",
      "SMS & email notifications",
      "Chat support",
    ],
    featured: true,
    order: 2,
  },
  {
    key: "premium",
    name: "Premium",
    tagline: "For scaling businesses that need deeper insight and integrations.",
    inherits: "Everything in Business",
    features: [
      "Advanced analytics & dashboards",
      "WooCommerce & marketplace sync",
      "API access & webhooks",
      "WhatsApp notifications",
      "Custom branding & VIP support",
    ],
    featured: false,
    order: 3,
  },
];

const EMPTY_PACKAGE: PackageDoc = {
  key: "",
  name: "",
  tagline: "",
  features: [],
  featured: false,
  order: 4,
};

/* ─────────── Small UI atoms ─────────── */

function StatusBadge({ status }: { status: FeedbackStatus }) {
  if (status === "approved") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-[#0a1b3d]/15 bg-[#cfe5f6] px-2 py-0.5 text-[10px] font-normal uppercase tracking-wider text-[#0a1b3d]">
        <CheckCircle2 size={10} /> Approved
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-[#0a1b3d]/15 bg-[#dfe4eb] px-2 py-0.5 text-[10px] font-normal uppercase tracking-wider text-[#6b7686]">
        <XCircle size={10} /> Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[#0a1b3d]/30 bg-white px-2 py-0.5 text-[10px] font-normal uppercase tracking-wider text-[#0a1b3d]">
      <Clock size={10} /> Pending
    </span>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={
            i < rating ? "text-[#0a1b3d]" : "text-[#dfe4eb]"
          }
        >
          ★
        </span>
      ))}
    </span>
  );
}

/* ─────────── Not-admin / loading screens ─────────── */

function LoadingScreen() {
  return (
    <div
      className={`${sans.className} flex min-h-screen items-center justify-center bg-[#f1f4f8] text-[#0a1b3d]`}
    >
      <Grain opacity={0.14} />
      <div className="relative flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className={`${serif.className} text-[20px] italic`}>
          Loading admin dashboard…
        </p>
      </div>
    </div>
  );
}

function NotAdminScreen({
  email,
  onRefresh,
  onSignOut,
}: {
  email: string | null;
  onRefresh: () => Promise<void>;
  onSignOut: () => Promise<void>;
}) {
  const [refreshing, setRefreshing] = useState(false);

  return (
    <div
      className={`${sans.className} relative min-h-screen bg-[#f1f4f8] pb-16 pt-24 text-[#0a1b3d]`}
    >
      <Grain opacity={0.14} />
      <div className="relative mx-auto max-w-2xl px-4 sm:px-6">
        <div className="relative">
          <span
            aria-hidden="true"
            className="absolute inset-0 translate-x-2 translate-y-2 bg-[#d3d9e2]"
          />
          <div className="relative bg-white p-8 shadow-2xl sm:p-10">
            <Tape className="-top-3 left-8 -rotate-6" />
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#dfe4eb] text-[#0a1b3d]">
              <Shield size={22} />
            </span>
            <h1
              className={`${serif.className} mt-4 text-[32px] font-light leading-tight tracking-tight sm:text-[40px]`}
            >
              Admin access not loaded.
            </h1>
            <p className="mt-3 text-[14px] font-light leading-7 text-[#0a1b3d]/70">
              {email
                ? `You're signed in as ${email}, but this session doesn't yet have the admin claim.`
                : "You're not signed in."}{" "}
              This is usually a stale token — try refreshing, or sign out and
              sign back in.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={async () => {
                  setRefreshing(true);
                  try {
                    await onRefresh();
                  } finally {
                    setRefreshing(false);
                  }
                }}
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-full bg-[#0a1b3d] px-6 py-3 text-[13.5px] font-normal text-white transition hover:bg-[#12306a] disabled:opacity-60"
              >
                {refreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Refresh token
              </button>
              <button
                type="button"
                onClick={onSignOut}
                className="inline-flex items-center gap-2 rounded-full border border-[#0a1b3d]/30 bg-white px-6 py-3 text-[13.5px] font-normal transition hover:border-[#0a1b3d]"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-[#0a1b3d]/30 bg-white px-6 py-3 text-[13.5px] font-normal transition hover:border-[#0a1b3d]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to site
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────── Main component ─────────── */

export default function AdminDashboard() {
  const { user, isAdmin, loading, refreshClaims, signOut } = useAuth();

  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [tab, setTab] = useState<"feedback" | "users" | "packages">(
    "feedback"
  );

  // Feedback
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | FeedbackStatus>("pending");

  // Users
  const [users, setUsers] = useState<UserRow[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState("");
  const [busyUid, setBusyUid] = useState<string | null>(null);

  // Packages
  const [packages, setPackages] = useState<PackageDoc[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [packagesError, setPackagesError] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<PackageDoc | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newPkg, setNewPkg] = useState<PackageDoc>(EMPTY_PACKAGE);
  const [savingPkg, setSavingPkg] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // Toast when a new pending feedback arrives while on the page
  const [toast, setToast] = useState<{ name: string } | null>(null);
  const prevPendingIds = useRef<Set<string>>(new Set());
  const firstLoad = useRef(true);

  /* ─── Force token refresh on mount ─── */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await refreshClaims();
      if (!cancelled) setCheckingAdmin(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshClaims]);

  /* ─── Sign out + hard redirect ─── */
  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
    } finally {
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  }, [signOut]);

  /* ─── Feedback subscription (only when admin confirmed) ─── */
  useEffect(() => {
    if (!isAdmin) {
      setFeedbackLoading(false);
      return;
    }

    const unsub = onSnapshot(
      collection(db, "feedback"),
      (snap) => {
        const items = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Feedback[];

        items.sort((a, b) => {
          const aT = a.createdAt?.toMillis?.() ?? 0;
          const bT = b.createdAt?.toMillis?.() ?? 0;
          return bT - aT;
        });

        setFeedback(items);
        setFeedbackLoading(false);
        setFeedbackError(null);

        // Toast on new pending arrivals (skip first load)
        const currentIds = new Set(
          items.filter((f) => f.status === "pending").map((f) => f.id)
        );
        if (firstLoad.current) {
          prevPendingIds.current = currentIds;
          firstLoad.current = false;
        } else {
          const newIds = [...currentIds].filter(
            (id) => !prevPendingIds.current.has(id)
          );
          if (newIds.length > 0) {
            const newest = items.find((f) => f.id === newIds[0]);
            setToast({ name: newest?.name ?? "Someone" });
            window.setTimeout(() => setToast(null), 6000);
          }
          prevPendingIds.current = currentIds;
        }
      },
      (err) => {
        console.error("[admin] feedback:", err);
        setFeedbackError(err.message);
        setFeedbackLoading(false);
      }
    );

    return () => unsub();
  }, [isAdmin]);

  /* ─── Packages subscription (public read, safe for all) ─── */
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "packages"),
      (snap) => {
        const items = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as PackageDoc[];
        items.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
        setPackages(items);
        setPackagesLoading(false);
      },
      (err) => {
        console.error("[admin] packages:", err);
        setPackagesError(err.message);
        setPackagesLoading(false);
      }
    );
    return () => unsub();
  }, []);

  /* ─── Users: lazy-load when tab opens ─── */
  const loadUsers = useCallback(async () => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      const res = await fetch("/api/admin/users", {
        credentials: "same-origin",
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      const data = (await res.json()) as { users: UserRow[] };
      setUsers(data.users);
    } catch (err) {
      setUsersError((err as Error).message);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "users" && isAdmin) {
      loadUsers();
    }
  }, [tab, isAdmin, loadUsers]);

  const toggleAdmin = async (u: UserRow) => {
    const verb = u.admin ? "Remove admin from" : "Grant admin to";
    if (!confirm(`${verb} ${u.email ?? u.uid}?`)) return;
    setBusyUid(u.uid);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: u.uid, admin: !u.admin }),
      });
      if (!res.ok) throw new Error(await res.text());
      await loadUsers();
    } catch (err) {
      alert("Failed: " + (err as Error).message);
    } finally {
      setBusyUid(null);
    }
  };

  const filteredUsers = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        (u.email ?? "").toLowerCase().includes(q) ||
        (u.displayName ?? "").toLowerCase().includes(q) ||
        u.uid.toLowerCase().includes(q)
    );
  }, [users, userSearch]);

  /* ─── Feedback actions ─── */
  const setFeedbackStatus = async (id: string, status: FeedbackStatus) => {
    try {
      await updateDoc(doc(db, "feedback", id), { status });
    } catch (err) {
      alert("Update failed: " + (err as Error).message);
    }
  };

  const removeFeedback = async (id: string) => {
    if (!confirm("Permanently delete this review?")) return;
    try {
      await deleteDoc(doc(db, "feedback", id));
    } catch (err) {
      alert("Delete failed: " + (err as Error).message);
    }
  };

  /* ─── Package actions ─── */
  const seedPackages = async () => {
    if (
      !confirm(
        "Create default packages in Firestore? Existing packages will not be touched."
      )
    )
      return;
    setSeeding(true);
    try {
      for (const pkg of SEED_PACKAGES) {
        await addDoc(collection(db, "packages"), pkg);
      }
    } catch (err) {
      alert("Seed failed: " + (err as Error).message);
    } finally {
      setSeeding(false);
    }
  };

  const startEdit = (pkg: PackageDoc) => {
    setIsCreating(false);
    setEditingKey(pkg.key);
    setEditForm({ ...pkg, features: [...pkg.features] });
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditForm(null);
  };

  const startCreate = () => {
    setEditingKey(null);
    setEditForm(null);
    setNewPkg({
      ...EMPTY_PACKAGE,
      order: packages.length > 0 ? Math.max(...packages.map(p => p.order || 0)) + 1 : 1
    });
    setIsCreating(true);
  };

  const cancelCreate = () => {
    setIsCreating(false);
    setNewPkg(EMPTY_PACKAGE);
  };

  const saveEdit = async () => {
    if (!editForm || !editingKey) return;
    setSavingPkg(true);
    try {
      const original = packages.find((p) => p.key === editingKey);
      if (!original?.id) throw new Error("Package doc missing id");
      await updateDoc(doc(db, "packages", original.id), {
        name: editForm.name.trim(),
        tagline: editForm.tagline.trim(),
        inherits: editForm.inherits?.trim() || null,
        features: editForm.features.filter((f) => f.trim().length > 0),
        featured: !!editForm.featured,
      });
      setEditingKey(null);
      setEditForm(null);
    } catch (err) {
      alert("Save failed: " + (err as Error).message);
    } finally {
      setSavingPkg(false);
    }
  };

  const saveCreate = async () => {
    if (!newPkg.key.trim() || !newPkg.name.trim() || !newPkg.tagline.trim()) {
      alert("Please fill in the Key, Name, and Tagline.");
      return;
    }

    // Check if key already exists
    if (packages.some((p) => p.key.toLowerCase() === newPkg.key.trim().toLowerCase())) {
      alert("A package with this Key already exists. Please choose a different key (e.g. 'enterprise').");
      return;
    }

    setSavingPkg(true);
    try {
      await addDoc(collection(db, "packages"), {
        key: newPkg.key.trim().toLowerCase(),
        name: newPkg.name.trim(),
        tagline: newPkg.tagline.trim(),
        inherits: newPkg.inherits?.trim() || null,
        features: newPkg.features.filter((f) => f.trim().length > 0),
        featured: !!newPkg.featured,
        order: newPkg.order || 99,
      });
      setIsCreating(false);
      setNewPkg(EMPTY_PACKAGE);
    } catch (err) {
      alert("Create failed: " + (err as Error).message);
    } finally {
      setSavingPkg(false);
    }
  };

  const pendingCount = feedback.filter((f) => f.status === "pending").length;
  const approvedCount = feedback.filter((f) => f.status === "approved").length;
  const rejectedCount = feedback.filter((f) => f.status === "rejected").length;

  const filteredFeedback =
    filter === "all" ? feedback : feedback.filter((f) => f.status === filter);

  /* ─── Early exits ─── */
  if (loading || checkingAdmin) return <LoadingScreen />;
  if (!user || !isAdmin) {
    return (
      <NotAdminScreen
        email={user?.email ?? null}
        onRefresh={refreshClaims}
        onSignOut={handleSignOut}
      />
    );
  }

  /* ─── Main render ─── */
  return (
    <div
      className={`${sans.className} relative min-h-screen bg-[#f1f4f8] pb-24 pt-24 text-[#0a1b3d]`}
    >
      <Grain opacity={0.14} />

      {/* Decorative backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 top-20 h-56 w-56 rounded-full bg-[#dfe4eb] sm:h-80 sm:w-80" />
        <div
          className="absolute -left-16 top-[500px] hidden h-72 w-48 -rotate-[8deg] bg-[#cfe5f6]/60 lg:block"
        />
        <div
          className="absolute bottom-[10%] right-[4%] hidden h-40 w-40 opacity-40 lg:block"
          style={{ backgroundImage: halftoneDark, backgroundSize: "9px 9px" }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* ═══ Header row ═══ */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full border border-[#0a1b3d]/25 bg-white px-4 py-2 text-[12.5px] font-normal transition hover:border-[#0a1b3d] hover:bg-[#cfe5f6]/50"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-0.5" />
            Back to site
          </Link>

          <div className="flex items-center gap-2">
            <span className="hidden truncate text-[12.5px] font-light text-[#6b7686] sm:inline">
              Signed in as{" "}
              <span className="font-normal text-[#0a1b3d]">{user.email}</span>
            </span>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#0a1b3d]/25 bg-white px-4 py-2 text-[12.5px] font-normal transition hover:border-[#0a1b3d] hover:bg-[#cfe5f6]/50"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </div>

        {/* ═══ Hero ═══ */}
        <div className="relative mb-8 overflow-hidden bg-[#0a1b3d] px-6 py-8 text-white sm:px-10 sm:py-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage: halftoneLight,
              backgroundSize: "10px 10px",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-16 -right-10 h-44 w-44 rounded-full bg-[#12306a]"
          />
          <Grain opacity={0.25} />
          <div className="relative">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-[#cfe5f6]" />
              <p className="text-[9.5px] font-normal uppercase tracking-[0.22em] text-[#cfe5f6]/80">
                Admin dashboard
              </p>
            </div>
            <h1
              className={`${serif.className} text-[36px] font-light leading-[1.02] tracking-tight sm:text-[52px]`}
            >
              Moderate feedback.
              <br />
              <span className="italic text-[#cfe5f6]">
                Manage users & packages.
              </span>
            </h1>
            <p className="mt-3 max-w-[540px] text-[13.5px] font-light leading-6 text-white/70">
              Approve reviews before they go public, grant admin access to
              trusted teammates, and update the plans customers see — all from
              one place.
            </p>
          </div>
        </div>

        {/* ═══ Tabs ═══ */}
        <div className="mb-6 flex flex-wrap gap-2">
          {(
            [
              {
                key: "feedback" as const,
                label: "Feedback",
                icon: MessageSquare,
                badge: pendingCount,
              },
              {
                key: "users" as const,
                label: "Users",
                icon: Users,
                badge: 0,
              },
              {
                key: "packages" as const,
                label: "Packages",
                icon: PackageIcon,
                badge: 0,
              },
            ]
          ).map(({ key, label, icon: Icon, badge }) => {
            const active = tab === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setTab(key);
                  if (key !== "packages") {
                    cancelCreate();
                    cancelEdit();
                  }
                }}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[12.5px] font-normal transition ${
                  active
                    ? "border-[#0a1b3d] bg-[#0a1b3d] text-white shadow-[0_8px_20px_-10px_rgba(10,27,61,0.6)]"
                    : "border-[#0a1b3d]/25 bg-white text-[#0a1b3d] hover:border-[#0a1b3d] hover:bg-[#cfe5f6]/40"
                }`}
              >
                <Icon size={14} strokeWidth={2} />
                {label}
                {badge > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-normal ${
                      active
                        ? "bg-[#cfe5f6] text-[#0a1b3d]"
                        : "bg-[#0a1b3d] text-[#cfe5f6]"
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ═══════════════════════════════════════════════ */}
        {/* FEEDBACK TAB                                    */}
        {/* ═══════════════════════════════════════════════ */}
        {tab === "feedback" && (
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {(
                [
                  { key: "pending" as const, label: "Pending", count: pendingCount },
                  { key: "approved" as const, label: "Approved", count: approvedCount },
                  { key: "rejected" as const, label: "Rejected", count: rejectedCount },
                  { key: "all" as const, label: "All", count: feedback.length },
                ]
              ).map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11.5px] font-normal transition ${
                    filter === f.key
                      ? "border-[#0a1b3d] bg-[#0a1b3d] text-white"
                      : "border-[#0a1b3d]/20 bg-white text-[#0a1b3d] hover:border-[#0a1b3d] hover:bg-[#cfe5f6]/40"
                  }`}
                >
                  {f.label}
                  <span
                    className={`rounded-full px-1.5 text-[10px] font-normal ${
                      filter === f.key
                        ? "bg-[#cfe5f6] text-[#0a1b3d]"
                        : "bg-[#f1f4f8] text-[#6b7686]"
                    }`}
                  >
                    {f.count}
                  </span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => refreshClaims()}
                className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-[#0a1b3d]/20 bg-white px-3 py-1.5 text-[11.5px] font-normal text-[#0a1b3d] transition hover:border-[#0a1b3d]"
                title="Refresh token claims (in case you were just granted admin)"
              >
                <RefreshCw size={11} /> Refresh token
              </button>
            </div>

            {feedbackError && (
              <div className="mb-5 flex items-start gap-2.5 border border-[#0a1b3d]/20 bg-[#dfe4eb] px-4 py-3 text-[12px] text-[#0a1b3d]">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <p>{feedbackError}</p>
              </div>
            )}

            {feedbackLoading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-28 animate-pulse bg-white shadow-sm"
                  />
                ))}
              </div>
            ) : filteredFeedback.length === 0 ? (
              <div className="relative bg-white px-6 py-16 text-center shadow-sm">
                <Tape className="-top-3 left-1/2 -translate-x-1/2 -rotate-3" />
                <MessageSquare
                  className="mx-auto mb-3 text-[#dfe4eb]"
                  size={36}
                />
                <p className={`${serif.className} text-[26px] italic`}>
                  No {filter === "all" ? "" : filter} feedback
                </p>
                <p className="mt-2 text-[12.5px] font-light text-[#6b7686]">
                  {filter === "pending"
                    ? "All caught up — nothing waiting for review."
                    : "Feedback submitted through the site will appear here."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFeedback.map((item) => (
                  <article
                    key={item.id}
                    className="relative bg-white p-5 shadow-[0_10px_30px_-15px_rgba(10,27,61,0.15)]"
                  >
                    <Tape className="-top-2.5 left-8 h-5 w-16 -rotate-3" />
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[13.5px] font-normal text-[#0a1b3d]">
                            {item.name}
                          </span>
                          <span className="text-[12px] font-light text-[#6b7686]">
                            · {item.business}
                          </span>
                          <StatusBadge status={item.status} />
                        </div>

                        <div className="mt-1.5 flex items-center gap-2">
                          <Stars rating={item.rating} />
                          <span className="text-[11px] font-light text-[#6b7686]">
                            {item.rating}/5
                          </span>
                        </div>

                        <p className="mt-2.5 whitespace-pre-line text-[13px] font-light leading-6 text-[#0a1b3d]/85">
                          {item.comment}
                        </p>

                        {item.createdAt?.toDate && (
                          <p className="mt-2 text-[11px] font-light text-[#6b7686]/80">
                            Submitted{" "}
                            {item.createdAt.toDate().toLocaleString()}
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 flex-col gap-1.5">
                        {item.status !== "approved" && (
                          <button
                            type="button"
                            onClick={() =>
                              setFeedbackStatus(item.id, "approved")
                            }
                            className="inline-flex items-center gap-1 rounded-full bg-[#0a1b3d] px-3.5 py-1.5 text-[11.5px] font-normal text-white transition hover:bg-[#12306a]"
                          >
                            <Check size={11} strokeWidth={3} /> Approve
                          </button>
                        )}
                        {item.status !== "rejected" && (
                          <button
                            type="button"
                            onClick={() =>
                              setFeedbackStatus(item.id, "rejected")
                            }
                            className="inline-flex items-center gap-1 rounded-full border border-[#0a1b3d]/30 bg-white px-3.5 py-1.5 text-[11.5px] font-normal text-[#0a1b3d] transition hover:bg-[#dfe4eb]"
                          >
                            <X size={11} strokeWidth={3} /> Reject
                          </button>
                        )}
                        {item.status === "approved" && (
                          <button
                            type="button"
                            onClick={() =>
                              setFeedbackStatus(item.id, "pending")
                            }
                            className="inline-flex items-center gap-1 rounded-full border border-[#0a1b3d]/25 bg-white px-3.5 py-1.5 text-[11.5px] font-normal text-[#6b7686] transition hover:text-[#0a1b3d]"
                          >
                            <Clock size={11} /> Unapprove
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeFeedback(item.id)}
                          className="inline-flex items-center gap-1 rounded-full border border-[#0a1b3d]/20 bg-white px-3.5 py-1.5 text-[11.5px] font-normal text-[#6b7686] transition hover:border-[#0a1b3d] hover:text-[#0a1b3d]"
                        >
                          <Trash2 size={11} /> Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════ */}
        {/* USERS TAB                                       */}
        {/* ═══════════════════════════════════════════════ */}
        {tab === "users" && (
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <div className="relative flex-1">
                <Search
                  size={14}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7686]"
                />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search by email, name, or uid…"
                  className="w-full border-0 border-b border-[#0a1b3d]/25 bg-white py-2.5 pl-9 pr-3.5 text-[13px] font-light text-[#0a1b3d] outline-none transition placeholder:text-[#6b7686]/70 focus:border-[#0a1b3d] focus:bg-[#cfe5f6]/30"
                />
              </div>
              <button
                type="button"
                onClick={loadUsers}
                disabled={usersLoading}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#0a1b3d]/25 bg-white px-3.5 py-1.5 text-[11.5px] font-normal text-[#0a1b3d] transition hover:border-[#0a1b3d] disabled:opacity-60"
              >
                <RefreshCw size={11} className={usersLoading ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>

            {usersError && (
              <div className="mb-5 flex items-start gap-2.5 border border-[#0a1b3d]/20 bg-[#dfe4eb] px-4 py-3 text-[12px] text-[#0a1b3d]">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <p>{usersError}</p>
              </div>
            )}

            {usersLoading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-20 animate-pulse bg-white shadow-sm"
                  />
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="relative bg-white px-6 py-16 text-center shadow-sm">
                <Tape className="-top-3 left-1/2 -translate-x-1/2 -rotate-3" />
                <Users className="mx-auto mb-3 text-[#dfe4eb]" size={36} />
                <p className={`${serif.className} text-[26px] italic`}>
                  No users found
                </p>
                <p className="mt-2 text-[12.5px] font-light text-[#6b7686]">
                  {userSearch
                    ? "Try a different search term."
                    : "No registered users yet."}
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredUsers.map((u) => {
                  const isSelf = u.uid === user.uid;
                  return (
                    <article
                      key={u.uid}
                      className="flex flex-col gap-3 bg-white p-4 shadow-[0_10px_30px_-15px_rgba(10,27,61,0.15)] sm:flex-row sm:items-center sm:gap-4"
                    >
                      <div className="flex items-center gap-3 sm:min-w-0 sm:flex-1">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0a1b3d] text-[12px] font-normal text-[#cfe5f6]">
                          {(u.email?.[0] ?? "?").toUpperCase()}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate text-[13.5px] font-normal text-[#0a1b3d]">
                              {u.email ?? "(no email)"}
                            </p>
                            {u.admin && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#cfe5f6] px-2 py-0.5 text-[9.5px] font-normal uppercase tracking-wider text-[#0a1b3d]">
                                <Crown size={9} /> Admin
                              </span>
                            )}
                            {isSelf && (
                              <span className="rounded-full border border-[#0a1b3d]/25 px-2 py-0.5 text-[9.5px] font-normal text-[#6b7686]">
                                You
                              </span>
                            )}
                            {u.disabled && (
                              <span className="rounded-full bg-[#dfe4eb] px-2 py-0.5 text-[9.5px] font-normal text-[#6b7686]">
                                Disabled
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 truncate text-[11px] font-light text-[#6b7686]">
                            UID {u.uid.slice(0, 12)}…
                            {u.lastSignIn && (
                              <>
                                {" · last sign-in "}
                                {new Date(u.lastSignIn).toLocaleDateString()}
                              </>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-1.5">
                        {u.admin ? (
                          <button
                            type="button"
                            onClick={() => toggleAdmin(u)}
                            disabled={isSelf || busyUid === u.uid}
                            className="inline-flex items-center gap-1 rounded-full border border-[#0a1b3d]/30 bg-white px-3.5 py-1.5 text-[11.5px] font-normal text-[#0a1b3d] transition hover:bg-[#dfe4eb] disabled:cursor-not-allowed disabled:opacity-40"
                            title={
                              isSelf
                                ? "You cannot demote yourself"
                                : "Remove admin"
                            }
                          >
                            {busyUid === u.uid ? (
                              <Loader2 size={11} className="animate-spin" />
                            ) : (
                              <ShieldOff size={11} />
                            )}
                            Remove admin
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => toggleAdmin(u)}
                            disabled={busyUid === u.uid}
                            className="inline-flex items-center gap-1 rounded-full bg-[#0a1b3d] px-3.5 py-1.5 text-[11.5px] font-normal text-white transition hover:bg-[#12306a] disabled:opacity-60"
                          >
                            {busyUid === u.uid ? (
                              <Loader2 size={11} className="animate-spin" />
                            ) : (
                              <Shield size={11} />
                            )}
                            Make admin
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════ */}
        {/* PACKAGES TAB                                    */}
        {/* ═══════════════════════════════════════════════ */}
        {tab === "packages" && (
          <div>
            {packagesError && (
              <div className="mb-5 flex items-start gap-2.5 border border-[#0a1b3d]/20 bg-[#dfe4eb] px-4 py-3 text-[12px] text-[#0a1b3d]">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <p>{packagesError}</p>
              </div>
            )}

            {packagesLoading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-28 animate-pulse bg-white shadow-sm"
                  />
                ))}
              </div>
            ) : packages.length === 0 && !isCreating ? (
              <div className="relative bg-white px-6 py-16 text-center shadow-sm">
                <Tape className="-top-3 left-1/2 -translate-x-1/2 -rotate-3" />
                <PackageIcon
                  className="mx-auto mb-3 text-[#dfe4eb]"
                  size={36}
                />
                <p className={`${serif.className} text-[26px] italic`}>
                  No packages in Firestore yet
                </p>
                <p className="mt-2 max-w-md text-[12.5px] font-light text-[#6b7686] sm:mx-auto">
                  The public site currently shows the built-in defaults. Click
                  below to copy them into Firestore or create a new one.
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={seedPackages}
                    disabled={seeding}
                    className="inline-flex items-center gap-2 rounded-full border border-[#0a1b3d]/30 bg-white px-5 py-2.5 text-[12.5px] font-normal text-[#0a1b3d] transition hover:border-[#0a1b3d] hover:bg-[#cfe5f6]/40 disabled:opacity-60"
                  >
                    <RefreshCw size={14} className={seeding ? "animate-spin" : ""} />
                    {seeding ? "Seeding…" : "Seed default packages"}
                  </button>
                  <button
                    type="button"
                    onClick={startCreate}
                    className="inline-flex items-center gap-2 rounded-full bg-[#0a1b3d] px-5 py-2.5 text-[12.5px] font-normal text-white transition hover:bg-[#12306a]"
                  >
                    <Plus size={14} />
                    Create custom package
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">

                {/* CREATE NEW PACKAGE BUTTON */}
                {!isCreating && (
                  <div className="mb-4 flex justify-end">
                    <button
                      type="button"
                      onClick={startCreate}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#0a1b3d] px-4 py-2 text-[12px] font-normal text-white transition hover:bg-[#12306a]"
                    >
                      <Plus size={14} />
                      Create New Package
                    </button>
                  </div>
                )}

                {/* NEW PACKAGE FORM */}
                {isCreating && (
                  <article className="relative bg-white p-5 shadow-[0_10px_30px_-15px_rgba(10,27,61,0.15)] border-l-4 border-[#0a1b3d]">
                    <Tape className="-top-2.5 right-8 h-5 w-16 rotate-3" />
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[13px] font-normal text-[#0a1b3d]">
                          Create New Package
                        </h3>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block text-[11px] font-normal uppercase tracking-wider text-[#6b7686]">
                          Unique Key *
                          <input
                            type="text"
                            value={newPkg.key}
                            onChange={(e) =>
                              setNewPkg((f) => ({ ...f, key: e.target.value }))
                            }
                            placeholder="e.g. enterprise"
                            className="mt-1 block w-full border-0 border-b border-[#0a1b3d]/25 bg-[#f1f4f8] px-3 py-2.5 text-[13px] font-light text-[#0a1b3d] outline-none transition focus:border-[#0a1b3d] focus:bg-[#cfe5f6]/40"
                          />
                        </label>

                        <label className="block text-[11px] font-normal uppercase tracking-wider text-[#6b7686]">
                          Display Name *
                          <input
                            type="text"
                            value={newPkg.name}
                            onChange={(e) =>
                              setNewPkg((f) => ({ ...f, name: e.target.value }))
                            }
                            placeholder="e.g. Enterprise"
                            className="mt-1 block w-full border-0 border-b border-[#0a1b3d]/25 bg-[#f1f4f8] px-3 py-2.5 text-[13px] font-light text-[#0a1b3d] outline-none transition focus:border-[#0a1b3d] focus:bg-[#cfe5f6]/40"
                          />
                        </label>
                      </div>

                      <label className="block text-[11px] font-normal uppercase tracking-wider text-[#6b7686]">
                        Tagline *
                        <textarea
                          rows={2}
                          value={newPkg.tagline}
                          onChange={(e) =>
                            setNewPkg((f) => ({ ...f, tagline: e.target.value }))
                          }
                          placeholder="e.g. For large-scale operations with complex needs."
                          className="mt-1 block w-full resize-none border-0 border-b border-[#0a1b3d]/25 bg-[#f1f4f8] px-3 py-2.5 text-[13px] font-light text-[#0a1b3d] outline-none transition focus:border-[#0a1b3d] focus:bg-[#cfe5f6]/40"
                        />
                      </label>

                      <label className="block text-[11px] font-normal uppercase tracking-wider text-[#6b7686]">
                        Inherits from (optional)
                        <input
                          type="text"
                          value={newPkg.inherits ?? ""}
                          onChange={(e) =>
                            setNewPkg((f) => ({ ...f, inherits: e.target.value }))
                          }
                          placeholder="e.g. Everything in Premium"
                          className="mt-1 block w-full border-0 border-b border-[#0a1b3d]/25 bg-[#f1f4f8] px-3 py-2.5 text-[13px] font-light text-[#0a1b3d] outline-none transition focus:border-[#0a1b3d] focus:bg-[#cfe5f6]/40"
                        />
                      </label>

                      <div>
                        <label className="mb-1 block text-[11px] font-normal uppercase tracking-wider text-[#6b7686]">
                          Features (one per line)
                        </label>
                        <textarea
                          rows={6}
                          value={newPkg.features.join("\n")}
                          onChange={(e) =>
                            setNewPkg((f) => ({
                              ...f,
                              features: e.target.value.split("\n"),
                            }))
                          }
                          placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                          className="block w-full resize-none border-0 border-b border-[#0a1b3d]/25 bg-[#f1f4f8] px-3 py-2.5 font-mono text-[12px] text-[#0a1b3d] outline-none transition focus:border-[#0a1b3d] focus:bg-[#cfe5f6]/40"
                        />
                      </div>

                      <label className="inline-flex items-center gap-2 text-[12px] font-normal text-[#0a1b3d]">
                        <input
                          type="checkbox"
                          checked={!!newPkg.featured}
                          onChange={(e) =>
                            setNewPkg((f) => ({ ...f, featured: e.target.checked }))
                          }
                          className="h-4 w-4 rounded border-[#0a1b3d]/30 text-[#0a1b3d] focus:ring-[#0a1b3d]"
                        />
                        Featured (shows the "Recommended" badge)
                      </label>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={saveCreate}
                          disabled={savingPkg}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#0a1b3d] px-4 py-2 text-[12px] font-normal text-white transition hover:bg-[#12306a] disabled:opacity-60"
                        >
                          <Save size={12} />
                          {savingPkg ? "Creating…" : "Save Package"}
                        </button>
                        <button
                          type="button"
                          onClick={cancelCreate}
                          disabled={savingPkg}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#0a1b3d]/25 bg-white px-4 py-2 text-[12px] font-normal text-[#0a1b3d] transition hover:border-[#0a1b3d] disabled:opacity-60"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </article>
                )}

                {/* EXISTING PACKAGES */}
                {packages.map((pkg) => {
                  const isEditing = editingKey === pkg.key;
                  return (
                    <article
                      key={pkg.key}
                      className="relative bg-white p-5 shadow-[0_10px_30px_-15px_rgba(10,27,61,0.15)]"
                    >
                      <Tape className="-top-2.5 right-8 h-5 w-16 rotate-3" />

                      {!isEditing ? (
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-[14.5px] font-normal text-[#0a1b3d]">
                                {pkg.name}
                              </h3>
                              {pkg.featured && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#cfe5f6] px-2 py-0.5 text-[9.5px] font-normal uppercase tracking-wider text-[#0a1b3d]">
                                  <Sparkles size={9} /> Featured
                                </span>
                              )}
                              <span className="rounded-full bg-[#f1f4f8] px-2 py-0.5 text-[10px] font-mono text-[#6b7686]">
                                {pkg.key}
                              </span>
                            </div>
                            <p className="mt-1 text-[12.5px] font-light text-[#6b7686]">
                              {pkg.tagline}
                            </p>
                            <p className="mt-2 text-[11px] font-light text-[#6b7686]/80">
                              {pkg.features.length} features
                              {pkg.inherits &&
                                ` · inherits from ${pkg.inherits}`}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => startEdit(pkg)}
                            className="shrink-0 self-start rounded-full border border-[#0a1b3d]/25 bg-white px-4 py-1.5 text-[11.5px] font-normal text-[#0a1b3d] transition hover:border-[#0a1b3d] hover:bg-[#cfe5f6]/40"
                          >
                            Edit
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-[13px] font-normal text-[#0a1b3d]">
                              Editing: {editForm?.name}
                            </h3>
                            <span className="rounded-full bg-[#f1f4f8] px-2 py-0.5 text-[10px] font-mono text-[#6b7686]">
                              {pkg.key}
                            </span>
                          </div>

                          <label className="block text-[11px] font-normal uppercase tracking-wider text-[#6b7686]">
                            Name
                            <input
                              type="text"
                              value={editForm?.name ?? ""}
                              onChange={(e) =>
                                setEditForm((f) =>
                                  f ? { ...f, name: e.target.value } : f
                                )
                              }
                              className="mt-1 block w-full border-0 border-b border-[#0a1b3d]/25 bg-[#f1f4f8] px-3 py-2.5 text-[13px] font-light text-[#0a1b3d] outline-none transition focus:border-[#0a1b3d] focus:bg-[#cfe5f6]/40"
                            />
                          </label>

                          <label className="block text-[11px] font-normal uppercase tracking-wider text-[#6b7686]">
                            Tagline
                            <textarea
                              rows={2}
                              value={editForm?.tagline ?? ""}
                              onChange={(e) =>
                                setEditForm((f) =>
                                  f ? { ...f, tagline: e.target.value } : f
                                )
                              }
                              className="mt-1 block w-full resize-none border-0 border-b border-[#0a1b3d]/25 bg-[#f1f4f8] px-3 py-2.5 text-[13px] font-light text-[#0a1b3d] outline-none transition focus:border-[#0a1b3d] focus:bg-[#cfe5f6]/40"
                            />
                          </label>

                          <label className="block text-[11px] font-normal uppercase tracking-wider text-[#6b7686]">
                            Inherits from (optional)
                            <input
                              type="text"
                              value={editForm?.inherits ?? ""}
                              onChange={(e) =>
                                setEditForm((f) =>
                                  f ? { ...f, inherits: e.target.value } : f
                                )
                              }
                              placeholder="Everything in Starter"
                              className="mt-1 block w-full border-0 border-b border-[#0a1b3d]/25 bg-[#f1f4f8] px-3 py-2.5 text-[13px] font-light text-[#0a1b3d] outline-none transition focus:border-[#0a1b3d] focus:bg-[#cfe5f6]/40"
                            />
                          </label>

                          <div>
                            <label className="mb-1 block text-[11px] font-normal uppercase tracking-wider text-[#6b7686]">
                              Features (one per line)
                            </label>
                            <textarea
                              rows={Math.max(
                                6,
                                (editForm?.features.length ?? 0) + 1
                              )}
                              value={(editForm?.features ?? []).join("\n")}
                              onChange={(e) =>
                                setEditForm((f) =>
                                  f
                                    ? {
                                        ...f,
                                        features: e.target.value.split("\n"),
                                      }
                                    : f
                                )
                              }
                              className="block w-full resize-none border-0 border-b border-[#0a1b3d]/25 bg-[#f1f4f8] px-3 py-2.5 font-mono text-[12px] text-[#0a1b3d] outline-none transition focus:border-[#0a1b3d] focus:bg-[#cfe5f6]/40"
                            />
                          </div>

                          <label className="inline-flex items-center gap-2 text-[12px] font-normal text-[#0a1b3d]">
                            <input
                              type="checkbox"
                              checked={!!editForm?.featured}
                              onChange={(e) =>
                                setEditForm((f) =>
                                  f ? { ...f, featured: e.target.checked } : f
                                )
                              }
                              className="h-4 w-4 rounded border-[#0a1b3d]/30 text-[#0a1b3d] focus:ring-[#0a1b3d]"
                            />
                            Featured (shows the "Recommended" badge)
                          </label>

                          <div className="flex gap-2 pt-2">
                            <button
                              type="button"
                              onClick={saveEdit}
                              disabled={savingPkg}
                              className="inline-flex items-center gap-1.5 rounded-full bg-[#0a1b3d] px-4 py-2 text-[12px] font-normal text-white transition hover:bg-[#12306a] disabled:opacity-60"
                            >
                              <Save size={12} />
                              {savingPkg ? "Saving…" : "Save"}
                            </button>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              disabled={savingPkg}
                              className="inline-flex items-center gap-1.5 rounded-full border border-[#0a1b3d]/25 bg-white px-4 py-2 text-[12px] font-normal text-[#0a1b3d] transition hover:border-[#0a1b3d] disabled:opacity-60"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ═══ Toast for new feedback ═══ */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#0a1b3d] px-5 py-3 text-white shadow-[0_20px_50px_-15px_rgba(10,27,61,0.6)]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#cfe5f6] text-[#0a1b3d]">
            <MessageSquare size={14} strokeWidth={2.5} />
          </span>
          <div>
            <p className="text-[12.5px] font-normal leading-tight">
              New feedback from {toast.name}
            </p>
            <p className="text-[11px] font-light text-white/70">
              Waiting for your review.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Dismiss"
            className="ml-2 flex h-6 w-6 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
