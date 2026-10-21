"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  limit,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  ArrowUpRight,
  MessageCircle,
  Quote,
  Send,
  Star,
  LogIn,
  UserPlus,
  Lock,
  AlertCircle,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { db, auth } from "@/lib/firebase";
import { useAuth } from "@/components/auth/AuthProvider";

type Testimonial = {
  id: string;
  name: string;
  business: string;
  comment: string;
  rating: number;
  userId?: string;
  createdAt?: { toMillis?: () => number } | null;
};

type AuthMode = "signin" | "signup" | null;

const defaultTestimonials: Testimonial[] = [
  {
    id: "default-1",
    name: "Business Owner",
    business: "Retail Business",
    comment:
      "BillPOS makes our daily sales and inventory management much easier. Everything is available in one place.",
    rating: 5,
  },
  {
    id: "default-2",
    name: "Restaurant Owner",
    business: "Restaurant",
    comment:
      "The system is simple to use and gives us a much clearer view of our business operations.",
    rating: 5,
  },
  {
    id: "default-3",
    name: "Shop Manager",
    business: "Retail Shop",
    comment:
      "Managing stock, sales and reports together has made our everyday work much more organized.",
    rating: 5,
  },
];

function friendlyAuthError(code: string | undefined, fallback: string): string {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-login-credentials":
      return "Invalid email or password. If you don't have an account yet, use Create Account.";
    case "auth/email-already-in-use":
      return "This email is already registered. Try signing in instead.";
    case "auth/weak-password":
      return "Password must be at least 6 characters long.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a few minutes and try again.";
    case "auth/operation-not-allowed":
      return "Sign-in method is disabled. Enable Email/Password in Firebase Console.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    default:
      return fallback;
  }
}

export default function TestimonialSection() {
  const { user, loading: authLoading } = useAuth();

  // Public (approved) testimonials from Firestore
  const [approved, setApproved] = useState<Testimonial[]>([]);
  const [firestoreLoading, setFirestoreLoading] = useState(true);
  const [firestoreError, setFirestoreError] = useState<string | null>(null);

  // Feedback form state
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Auth panel state
  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // ── Subscribe to approved feedback ───────────────────────────────
  useEffect(() => {
    const q = query(
      collection(db, "feedback"),
      where("status", "==", "approved"),
      limit(50)
    );

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Testimonial[];

        items.sort((a, b) => {
          const aT = a.createdAt?.toMillis?.() ?? 0;
          const bT = b.createdAt?.toMillis?.() ?? 0;
          return bT - aT;
        });

        setApproved(items);
        setFirestoreLoading(false);
      },
      (err) => {
        console.error("[TestimonialSection] firestore:", err);
        setFirestoreError(err.message);
        setFirestoreLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Reset auth panel when user signs in
  useEffect(() => {
    if (user) {
      setAuthMode(null);
      setAuthEmail("");
      setAuthPassword("");
      setAuthError(null);
    }
  }, [user]);

  // ── Submit feedback (goes to moderation queue) ───────────────────
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setSubmitted(false);

    if (!user) {
      setAuthMode("signin");
      return;
    }

    if (!name.trim() || !business.trim() || !comment.trim()) {
      setFormError("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    try {
      // Capture the ref so we can hand the id to the notify route
      const ref = await addDoc(collection(db, "feedback"), {
        name: name.trim(),
        business: business.trim(),
        comment: comment.trim(),
        rating,
        // These three are enforced by the security rules:
        // - status MUST be "pending"
        // - userId MUST match request.auth.uid
        // - createdAt MUST be server timestamp
        status: "pending",
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      // Fire-and-forget admin notification — never blocks the UX.
      // The route reads the doc, verifies the caller is the submitter,
      // then emails every admin (custom claim admin === true).
      void fetch("/api/notify-admin", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedbackId: ref.id }),
      }).catch((err) => {
        console.warn("[TestimonialSection] notify-admin failed:", err);
      });

      setName("");
      setBusiness("");
      setComment("");
      setRating(5);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 8000);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Submission failed. Please try again.";
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Handle both sign-in and sign-up ──────────────────────────────
  const handleAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!authMode) return;
    setAuthError(null);
    setAuthSubmitting(true);

    try {
      if (authMode === "signup") {
        await createUserWithEmailAndPassword(auth, authEmail, authPassword);
      } else {
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
      }
      setAuthEmail("");
      setAuthPassword("");
      setAuthMode(null);
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string; message?: string };
      setAuthError(
        friendlyAuthError(
          firebaseErr.code,
          firebaseErr.message ?? "Authentication failed."
        )
      );
    } finally {
      setAuthSubmitting(false);
    }
  };

  const displayTestimonials =
    approved.length > 0 ? approved : defaultTestimonials;

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-white py-24 sm:py-28 lg:py-32"
    >
      <div className="pointer-events-none absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-blue-50/70 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-blue-600" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">
                Customer Voices
              </span>
            </div>

            <h2 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl">
              Built for businesses.
              <br />
              <span className="text-slate-400">
                Loved by the people who run them.
              </span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-slate-500 lg:ml-auto">
            See what business owners and teams have to say about managing their
            everyday operations with BillPOS.
          </p>
        </div>

        {/* Testimonials grid */}
        {firestoreLoading ? (
          <div className="mt-16 grid gap-px overflow-hidden border border-slate-200 bg-slate-200 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="min-h-[280px] animate-pulse bg-white p-7 sm:p-8">
                <div className="h-6 w-6 rounded bg-slate-100" />
                <div className="mt-8 flex gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <div key={s} className="h-3 w-3 rounded bg-slate-100" />
                  ))}
                </div>
                <div className="mt-5 space-y-2">
                  <div className="h-3 w-full rounded bg-slate-100" />
                  <div className="h-3 w-4/5 rounded bg-slate-100" />
                  <div className="h-3 w-3/5 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-16 grid gap-px overflow-hidden border border-slate-200 bg-slate-200 md:grid-cols-3">
            {displayTestimonials.slice(0, 6).map((item, index) => (
              <article
                key={item.id}
                className="group relative min-h-[280px] bg-white p-7 transition-colors duration-300 hover:bg-slate-50 sm:p-8"
              >
                <Quote
                  size={24}
                  strokeWidth={1.5}
                  className="text-blue-600/60"
                />

                <div className="mt-8 flex gap-1">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      size={13}
                      strokeWidth={1.8}
                      className={
                        starIndex < item.rating
                          ? "fill-blue-600 text-blue-600"
                          : "text-slate-200"
                      }
                    />
                  ))}
                </div>

                <p className="mt-5 text-[15px] leading-7 text-slate-600">
                  &ldquo;{item.comment}&rdquo;
                </p>

                <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between sm:left-8 sm:right-8">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">
                      {item.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{item.business}</p>
                  </div>

                  <span className="text-xs font-medium text-slate-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}

        {firestoreError && (
          <div className="mt-4 flex items-start gap-2.5 border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <p>
              Live testimonials could not be loaded ({firestoreError}). Showing
              sample content.
            </p>
          </div>
        )}

        {/* Main interaction area */}
        <div className="mt-16 grid overflow-hidden border border-slate-200 lg:grid-cols-[0.8fr_1.2fr]">
          {/* CTA panel */}
          <div className="relative overflow-hidden bg-[#071A2D] p-8 text-white sm:p-10 lg:p-12">
            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-300">
                Your business next
              </p>

              <h3 className="mt-5 max-w-md text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                Ready to make your business easier to manage?
              </h3>

              <p className="mt-5 max-w-md text-sm leading-7 text-white/60">
                See how BillPOS can bring sales, inventory, purchases and
                business management together.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/contact#demo"
                  className="inline-flex items-center justify-center gap-2 bg-white px-5 py-3 text-sm font-semibold text-[#071A2D] transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Request a Demo
                  <ArrowUpRight size={16} />
                </a>

                <a
                  href="https://wa.me/94706833644"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-white/20 px-5 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white/10"
                >
                  Contact via WhatsApp
                  <MessageCircle size={16} />
                </a>
              </div>
            </div>

            <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -bottom-12 -right-12 h-40 w-40 rounded-full border border-white/10" />
          </div>

          {/* Feedback form area */}
          <div className="bg-[#F8FAFC] p-8 sm:p-10 lg:p-12">
            <div className="max-w-xl">
              <div className="flex items-center gap-3">
                <MessageCircle size={20} className="text-blue-600" />
                <h3 className="text-xl font-semibold tracking-tight text-slate-950">
                  Share your experience
                </h3>
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Already using BillPOS? Tell others how it helps your business.
                Reviews are shown after admin approval.
              </p>

              {/* Loading state while AuthProvider resolves */}
              {authLoading && (
                <div className="mt-8 h-32 animate-pulse rounded-xl border border-slate-200 bg-white" />
              )}

              {/* ── NOT SIGNED IN: sign-in / sign-up prompt ──────── */}
              {!authLoading && !user && (
                <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_2px_10px_-4px_rgba(15,23,42,0.08)]">
                  <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-blue-600" strokeWidth={2} />
                      <p className="text-sm font-semibold text-slate-900">
                        Sign in or sign up to submit a review
                      </p>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      It takes 10 seconds — pick one option below and you&apos;ll
                      be able to submit your review right away.
                    </p>
                  </div>

                  <div className="p-5">
                    {/* Buttons — hidden once a mode is selected */}
                    {authMode === null && (
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode("signin");
                            setAuthError(null);
                          }}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50/50"
                        >
                          <LogIn className="h-4 w-4" />
                          Sign In
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode("signup");
                            setAuthError(null);
                          }}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_6px_20px_-8px_rgba(37,99,235,0.5)] transition hover:bg-blue-700"
                        >
                          <UserPlus className="h-4 w-4" />
                          Create Account
                        </button>
                      </div>
                    )}

                    {/* Inline form for the selected mode */}
                    {authMode !== null && (
                      <form onSubmit={handleAuth} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                            {authMode === "signup"
                              ? "Create a new account"
                              : "Welcome back"}
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setAuthMode(null);
                              setAuthError(null);
                              setAuthEmail("");
                              setAuthPassword("");
                            }}
                            className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 transition hover:text-slate-900"
                          >
                            <ArrowLeft className="h-3 w-3" />
                            Back
                          </button>
                        </div>

                        <input
                          type="email"
                          required
                          autoComplete="email"
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          placeholder="Email address"
                          className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        <input
                          type="password"
                          required
                          autoComplete={
                            authMode === "signup"
                              ? "new-password"
                              : "current-password"
                          }
                          minLength={6}
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          placeholder={
                            authMode === "signup"
                              ? "Password (min 6 characters)"
                              : "Password"
                          }
                          className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        {authError && (
                          <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs text-rose-700">
                            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                            <p>{authError}</p>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={authSubmitting}
                          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {authSubmitting
                            ? authMode === "signup"
                              ? "Creating account..."
                              : "Signing in..."
                            : authMode === "signup"
                            ? "Create Account"
                            : "Sign In"}
                        </button>

                        <p className="text-center text-[11px] leading-5 text-slate-400">
                          {authMode === "signup" ? (
                            <>
                              Already have an account?{" "}
                              <button
                                type="button"
                                onClick={() => {
                                  setAuthMode("signin");
                                  setAuthError(null);
                                }}
                                className="font-medium text-blue-600 hover:underline"
                              >
                                Sign in
                              </button>
                            </>
                          ) : (
                            <>
                              Don&apos;t have an account?{" "}
                              <button
                                type="button"
                                onClick={() => {
                                  setAuthMode("signup");
                                  setAuthError(null);
                                }}
                                className="font-medium text-blue-600 hover:underline"
                              >
                                Create one
                              </button>
                            </>
                          )}
                        </p>
                      </form>
                    )}
                  </div>
                </div>
              )}

              {/* ── SIGNED IN: full feedback form ─────────────────── */}
              {!authLoading && user && (
                <>
                  <div className="mt-4 flex items-center gap-2 text-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="text-slate-500">
                      Signed in as{" "}
                      <span className="font-medium text-slate-700">
                        {user.email}
                      </span>
                    </span>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs font-medium text-slate-600">
                          Your name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Perera"
                          maxLength={80}
                          className="h-12 w-full border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-medium text-slate-600">
                          Business
                        </label>
                        <input
                          type="text"
                          value={business}
                          onChange={(e) => setBusiness(e.target.value)}
                          placeholder="ABC Retail"
                          maxLength={100}
                          className="h-12 w-full border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-medium text-slate-600">
                        Your rating
                      </label>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, index) => {
                          const value = index + 1;
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() => setRating(value)}
                              className="p-1"
                              aria-label={`${value} star rating`}
                            >
                              <Star
                                size={19}
                                className={
                                  value <= rating
                                    ? "fill-blue-600 text-blue-600"
                                    : "text-slate-300"
                                }
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-medium text-slate-600">
                        Your experience
                      </label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Tell us about your experience with BillPOS..."
                        rows={4}
                        maxLength={1000}
                        className="w-full resize-none border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-[11px] leading-5 text-slate-400">
                        Reviews are reviewed by our team before appearing on the
                        site.
                      </p>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex h-12 items-center justify-center gap-2 bg-blue-600 px-6 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                      >
                        {submitting ? "Submitting..." : "Submit Review"}
                        <Send size={15} />
                      </button>
                    </div>

                    {formError && (
                      <div className="flex items-start gap-2.5 border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">
                        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <p>{formError}</p>
                      </div>
                    )}

                    {submitted && (
                      <div className="flex items-start gap-2.5 border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
                        <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <p>
                          Thank you! Your review is pending admin approval. It
                          will appear here once approved.
                        </p>
                      </div>
                    )}
                  </form>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom statement */}
        <div className="mt-16 flex flex-col gap-4 border-t border-slate-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-slate-400">
            Real businesses. Real experiences.
          </p>
          <p className="text-sm font-semibold text-slate-900">
            One platform. One connected business.
          </p>
        </div>
      </div>
    </section>
  );
}
