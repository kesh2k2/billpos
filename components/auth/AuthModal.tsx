"use client";

// components/auth/AuthModal.tsx
// Sign-in / sign-up modal styled to match the Contacts section
// (Cormorant + Jost, navy header, halftone dots, grain, washi tape,
//  offset shadow card). Palette: #0a1b3d / #cfe5f6 / #dfe4eb / white.

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Cormorant_Garamond, Jost } from "next/font/google";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  X,
  LogIn,
  UserPlus,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/components/auth/AuthProvider";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const sans = Jost({ subsets: ["latin"], weight: ["300", "400", "500"] });

/* Texture helpers (mirrors the Contacts component) */
const grain =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const halftoneLight =
  "radial-gradient(circle, rgba(207,229,246,0.9) 1.2px, transparent 1.7px)";

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

type Mode = "signin" | "signup";

function friendlyAuthError(code: string | undefined, fallback: string): string {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-login-credentials":
      return "Invalid email or password. If you don't have an account yet, use Sign Up.";
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

const fieldCls =
  "w-full border-0 border-b bg-[#f1f4f8] px-3.5 py-3 text-[15px] font-light text-[#0a1b3d] outline-none transition placeholder:text-[#6b7686]/70 focus:border-[#0a1b3d] focus:bg-[#cfe5f6]/50";

export default function AuthModal({
  open,
  initialMode = "signin",
  onClose,
}: {
  open: boolean;
  initialMode?: Mode;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setVisible(false);
      return;
    }
    setMode(initialMode);
    setError(null);
    setSubmitting(false);
    setEmail("");
    setPassword("");
    setShowPassword(false);
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [open, initialMode]);

  useEffect(() => {
    if (open && user) onClose();
  }, [user, open, onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      const fb = err as { code?: string; message?: string };
      setError(
        friendlyAuthError(fb.code, fb.message ?? "Authentication failed.")
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!open || !mounted) return null;

  const isSignup = mode === "signup";

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#0a1b3d]/70 p-4 backdrop-blur-md transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className={`${sans.className} relative w-full max-w-[440px]`}>
        {/* Offset shadow card (QuoteDialog pattern) */}
        <span
          aria-hidden="true"
          className="absolute inset-0 translate-x-2 translate-y-2 bg-[#d3d9e2]"
        />

        {/* Main panel */}
        <div
          className={`relative overflow-hidden bg-white text-[#0a1b3d] shadow-2xl transition-all duration-300 ${
            visible
              ? "translate-y-0 scale-100 opacity-100"
              : "translate-y-4 scale-95 opacity-0"
          }`}
        >
          {/* Washi tape */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-3 left-8 z-30 h-6 w-20 -rotate-6 border-y border-white/60 bg-[#cfe5f6]/75"
            style={{ clipPath: tapeClip }}
          />

          {/* ═══════════ Navy header ═══════════ */}
          <div className="relative overflow-hidden bg-[#0a1b3d] px-5 pb-7 pt-8 sm:px-7 sm:pb-8 sm:pt-9">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-15"
              style={{ backgroundImage: halftoneLight, backgroundSize: "9px 9px" }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-16 -right-10 h-40 w-40 rounded-full bg-[#12306a]"
            />
            <Grain opacity={0.25} />

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white/85 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#cfe5f6]"
            >
              <X size={15} />
            </button>

            <div className="relative">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-[#cfe5f6]" />
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.24em] text-[#cfe5f6]/75">
                  BillPOS Account
                </p>
              </div>
              <h2
                id="auth-modal-title"
                className={`${serif.className} relative mt-3 text-[30px] font-light leading-[1.05] tracking-tight text-white sm:text-[36px]`}
              >
                {isSignup ? "Create your account." : "Welcome back."}
              </h2>
              <p
                className={`${serif.className} relative mt-2 text-[17px] italic text-[#cfe5f6] sm:text-[19px]`}
              >
                {isSignup
                  ? "Join thousands of businesses."
                  : "Sign in to continue."}
              </p>
            </div>
          </div>

          {/* ═══════════ White body ═══════════ */}
          <div className="relative px-5 pb-6 pt-6 sm:px-7 sm:pb-7 sm:pt-7">
            <Grain opacity={0.08} />

            {/* Mode chips */}
            <div className="relative grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setError(null);
                }}
                aria-pressed={!isSignup}
                className={`flex items-center justify-center gap-1.5 rounded-full border px-3 py-2.5 text-[12.5px] font-normal transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-2 ${
                  !isSignup
                    ? "border-[#0a1b3d] bg-[#0a1b3d] text-white"
                    : "border-[#0a1b3d]/25 bg-white text-[#0a1b3d] hover:border-[#0a1b3d] hover:bg-[#cfe5f6]/40"
                }`}
              >
                <LogIn size={13} strokeWidth={2} />
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                }}
                aria-pressed={isSignup}
                className={`flex items-center justify-center gap-1.5 rounded-full border px-3 py-2.5 text-[12.5px] font-normal transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-2 ${
                  isSignup
                    ? "border-[#0a1b3d] bg-[#0a1b3d] text-white"
                    : "border-[#0a1b3d]/25 bg-white text-[#0a1b3d] hover:border-[#0a1b3d] hover:bg-[#cfe5f6]/40"
                }`}
              >
                <UserPlus size={13} strokeWidth={2} />
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="relative mt-5 grid gap-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="auth-email"
                  className={`${serif.className} mb-1.5 block text-[18px] italic leading-none`}
                >
                  Email
                </label>
                <input
                  id="auth-email"
                  type="email"
                  required
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`${fieldCls} ${
                    error ? "border-[#9b2c2c]" : "border-[#0a1b3d]/30"
                  }`}
                />
              </div>

              {/* Password */}
              <div>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <label
                    htmlFor="auth-password"
                    className={`${serif.className} text-[18px] italic leading-none`}
                  >
                    Password
                  </label>
                  {isSignup && (
                    <span className="text-[11px] font-light text-[#6b7686]">
                      min 6 characters
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    autoComplete={
                      isSignup ? "new-password" : "current-password"
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={
                      isSignup ? "Create a password" : "Enter your password"
                    }
                    className={`${fieldCls} pr-11 ${
                      error ? "border-[#9b2c2c]" : "border-[#0a1b3d]/30"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded text-[#6b7686] transition hover:text-[#0a1b3d]"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <p
                  role="alert"
                  className="flex items-start gap-2 text-[12.5px] leading-5 text-[#9b2c2c]"
                >
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="group/btn relative mt-1 inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[#0a1b3d] px-6 text-[14px] font-normal text-white transition hover:bg-[#12306a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {submitting
                    ? isSignup
                      ? "Creating account…"
                      : "Signing in…"
                    : isSignup
                    ? "Create Account"
                    : "Sign In"}
                  {!submitting && (
                    <ArrowRight
                      size={16}
                      className="transition group-hover/btn:translate-x-0.5"
                    />
                  )}
                </span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full"
                />
              </button>
            </form>

            {/* Switch link */}
            <p className="relative mt-4 text-center text-[12.5px] text-[#6b7686]">
              {isSignup ? "Already have an account?" : "New to BillPOS?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setMode(isSignup ? "signin" : "signup");
                  setError(null);
                }}
                className="font-medium text-[#0a1b3d] underline-offset-2 hover:underline"
              >
                {isSignup ? "Sign in" : "Create one"}
              </button>
            </p>

            {/* Trust footer */}
            <div className="relative mt-5 flex items-center justify-center gap-4 border-t border-[#0a1b3d]/10 pt-4 text-[10.5px] font-medium uppercase tracking-wider text-[#6b7686]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={11} className="text-[#0a1b3d]" />
                Secure
              </span>
              <span className="flex items-center gap-1.5">
                <Zap size={11} className="text-[#0a1b3d]" />
                Fast
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles size={11} className="text-[#0a1b3d]" />
                Free
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
