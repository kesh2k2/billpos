"use client";

/* ============================================================
 * Contacts Section
 * ------------------------------------------------------------
 * Collage aesthetic matched to the Packages + About sections:
 *   • Cormorant Garamond + Jost
 *   • Torn-paper tags, halftone dots, grain, washi tape
 *   • Letter-bounce heading (with hover hop)
 *   • Word-mask intro reveal
 *   • Card drops with back.out / elastic.out
 *   • Wobbling sticker on the schedule card
 *   • Parallax collage backdrop
 *
 * Validation (v4):
 *   • Full name  — first AND last name required (2+ words)
 *                  Auto-capitalizes first letter of each word
 *   • Phone      — exactly 10 digits, must start with 0
 *   • Email      — lowercase first letter + @gmail.com or @yahoo.com
 *                  Auto-lowercases the first character
 *   • Live errors appear as the user types
 *
 * Scroll-restoration fix:
 *   Uses the shared `useResetScrollOnMount` hook from
 *   `@/lib/use-reset-scroll-on-mount`.
 *
 * EmailJS:
 *   Uses ONE shared template for both Contact and Demo forms.
 *   The template reads `form_type` to render the correct
 *   header/subject and hides the other form's fields via
 *   `{{#if}}` conditionals. Env vars:
 *     NEXT_PUBLIC_EMAILJS_SERVICE_ID
 *     NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
 *     NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
 * ============================================================ */

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Cormorant_Garamond, Jost } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import emailjs from "@emailjs/browser";
import { useResetScrollOnMount } from "@/lib/use-reset-scroll-on-mount";
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  Clock,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Fonts + palette                                                     */
/* ------------------------------------------------------------------ */

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const sans = Jost({ subsets: ["latin"], weight: ["300", "400", "500"] });

/* ------------------------------------------------------------------ */
/* Contact details                                                     */
/* ------------------------------------------------------------------ */

const PHONE_DISPLAY = "070 683 3644";
const PHONE_TEL = "+94706833644";
const WHATSAPP_NUMBER = "+94706833644";
const EMAIL = "Support@qdeskAI.com";
const HOURS = "Mon – Fri: 10am to 5pm";
const ADDRESS_LINES = ["No: 15/1/8,", "Nanuoya,", "Kiribathkumbura,", "Kandy"];
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  "15/1/8, Nanuoya, Kiribathkumbura, Kandy"
)}`;

const TOPICS = ["Fashion", "Salon", "SME", "Retail", "Restaurant", "Something else"];
const PREFERRED = ["WhatsApp", "Call", "Email"];

const HEADER_IMG =
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=85";
const TEAM_IMG =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=85";

/* ------------------------------------------------------------------ */
/* EmailJS (single shared template for Contact + Demo)                 */
/* ------------------------------------------------------------------ */

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

/* ------------------------------------------------------------------ */
/* Texture helpers                                                     */
/* ------------------------------------------------------------------ */

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

function Photo({
  src,
  alt,
  className = "",
  tone = 0.4,
}: {
  src: string;
  alt: string;
  className?: string;
  tone?: number;
}) {
  const hasPosition = /(^|\s)(absolute|relative|fixed|sticky)(\s|$)/.test(className);
  return (
    <div className={`${hasPosition ? "" : "relative"} overflow-hidden bg-[#c5ccd6] ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.opacity = "0";
        }}
        className="h-full w-full object-cover grayscale contrast-[1.1] transition duration-700 group-hover:grayscale-0"
      />
      <div
        className="pointer-events-none absolute inset-0 mix-blend-multiply"
        style={{ background: `rgba(18,41,90,${tone})` }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-30 mix-blend-multiply"
        style={{ backgroundImage: halftoneDark, backgroundSize: "6px 6px" }}
      />
    </div>
  );
}

const reduceMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ------------------------------------------------------------------ */
/* Text splitting helpers                                              */
/* ------------------------------------------------------------------ */

function SplitChars({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, wi) => (
        <span key={wi}>
          <span className="inline-block whitespace-nowrap">
            {word.split("").map((ch, ci) => (
              <span
                key={ci}
                data-char="1"
                className="ct-char inline-block will-change-transform"
              >
                {ch}
              </span>
            ))}
          </span>
          {wi < words.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}

function SplitWords({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span key={i}>
          <span className="-mb-[3px] inline-block overflow-hidden pb-[3px] align-top">
            <span className="ct-word inline-block will-change-transform">
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Info card                                                           */
/* ------------------------------------------------------------------ */

type Variant = "white" | "sky" | "navy" | "gray";

const variantStyles: Record<Variant, { card: string; icon: string; sub: string }> = {
  white: { card: "bg-white text-[#0a1b3d]", icon: "bg-[#cfe5f6] text-[#0a1b3d]", sub: "text-[#6b7686]" },
  sky: { card: "bg-[#cfe5f6] text-[#0a1b3d]", icon: "bg-white text-[#0a1b3d]", sub: "text-[#0a1b3d]/65" },
  navy: { card: "bg-[#0a1b3d] text-white", icon: "bg-[#cfe5f6] text-[#0a1b3d]", sub: "text-white/65" },
  gray: { card: "bg-[#dfe4eb] text-[#0a1b3d]", icon: "bg-white text-[#0a1b3d]", sub: "text-[#0a1b3d]/65" },
};

function InfoCard({
  Icon,
  label,
  lines,
  cta,
  href,
  external,
  variant,
  tilt,
  className = "",
  featured = false,
}: {
  Icon: any;
  label: string;
  lines: string[];
  cta?: string;
  href?: string;
  external?: boolean;
  variant: Variant;
  tilt: string;
  className?: string;
  featured?: boolean;
}) {
  const v = variantStyles[variant];

  const body = (
    <>
      <Grain opacity={variant === "navy" ? 0.25 : 0.1} />
      <span className={`ct-icon relative flex h-11 w-11 items-center justify-center rounded-full ${v.icon}`}>
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <p className={`${serif.className} ct-line relative mt-4 text-[26px] italic leading-none`}>
        {label}
      </p>
      <div className="ct-line relative mt-3 text-[15px] font-light leading-6">
        {lines.map((l) => (
          <p key={l} className="break-words">{l}</p>
        ))}
      </div>
      {cta && (
        <p className="ct-line relative mt-4 inline-flex items-center gap-1.5 text-[13px] font-normal">
          {cta}
          <ArrowUpRight className="h-3.5 w-3.5 transition group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5" />
        </p>
      )}
      {featured && <span className="ct-sticker absolute -top-3 right-5 z-20" aria-hidden="true" />}
    </>
  );

  const shared = `group/card relative block h-full p-5 shadow-[0_30px_50px_-30px_rgba(10,27,61,0.55)] transition-transform duration-500 rotate-[var(--r)] hover:-translate-y-1 hover:rotate-0 sm:p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-4 ${v.card}`;

  return (
    <div className={`ct-info relative ${className}`}>
      {href ? (
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className={shared}
          style={{ ["--r" as any]: tilt }}
        >
          <Tape className="-top-3 right-6 h-5 w-14 rotate-3" />
          {body}
        </a>
      ) : (
        <div className={shared} style={{ ["--r" as any]: tilt }}>
          <Tape className="-top-3 right-6 h-5 w-14 rotate-3" />
          {body}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Form                                                               */
/* ------------------------------------------------------------------ */

export type ContactPayload = {
  name: string;
  phone: string;
  email: string;
  topic: string;
  preferred: string;
  message: string;
};

type Errors = Partial<
  Record<"name" | "phone" | "email" | "contact" | "message", string>
>;

const emptyForm: ContactPayload = {
  name: "",
  phone: "",
  email: "",
  topic: "",
  preferred: "WhatsApp",
  message: "",
};

const inputCls =
  "w-full border-0 border-b bg-[#f1f4f8] px-3.5 py-3 text-[15px] font-light text-[#0a1b3d] outline-none transition placeholder:text-[#6b7686]/70 focus:border-[#0a1b3d] focus:bg-[#cfe5f6]/50";

/* ------------------------------------------------------------------ */
/* Auto-format helpers                                                 */
/* ------------------------------------------------------------------ */

/**
 * Capitalize the first letter of every word.
 *   "john wick"   → "John Wick"
 *   "JOHN wick"   → "JOHN Wick"
 *   "john  wick"  → "John  Wick" (preserves extra spaces)
 *   "mary-jane"   → "Mary-Jane"  (word-boundary aware)
 */
function capitalizeName(value: string): string {
  return value.replace(/(^|\s)(\S)/g, (_, sep, ch) => sep + ch.toUpperCase());
}

/**
 * Lowercase the FIRST character of the string only.
 * Preserves the rest exactly as typed so we don't clobber
 * any mid-email casing the user intentionally typed.
 *   "John@gmail.com"  → "john@gmail.com"
 *   "JOHN@gmail.com"  → "jOHN@gmail.com"  (validation still rejects due to invalid uppercase)
 */
function lowercaseFirst(value: string): string {
  if (value.length === 0) return value;
  return value.charAt(0).toLowerCase() + value.slice(1);
}

/* ------------------------------------------------------------------ */
/* Validation rules                                                    */
/* ------------------------------------------------------------------ */

/**
 * Phone: exactly 10 digits, first digit must be 0.
 *   ✓ 0745566987   ✗ 774455968 (no leading 0)
 *                  ✗ 077456547 (only 9 digits)
 *                  ✗ 07586485964 (11 digits)
 */
const PHONE_RE = /^0\d{9}$/;

/**
 * Email:
 *   • First character must be a lowercase letter (a–z)
 *   • Domain must be exactly @gmail.com or @yahoo.com
 *   ✓ john@gmail.com   ✓ mary.jane@yahoo.com
 *   ✗ John@gmail.com   ✗ john@outlook.com
 *   ✗ 1john@gmail.com  ✗ john@GMAIL.com
 */
const EMAIL_RE = /^[a-z][a-zA-Z0-9._-]*@(gmail\.com|yahoo\.com)$/;

const validate = (v: ContactPayload): Errors => {
  const errs: Errors = {};

  /* ── Full name — first + last name required ────────────── */
  const nameParts = v.name.trim().split(/\s+/).filter(Boolean);
  if (nameParts.length < 2 || nameParts.some((p) => p.length < 2)) {
    errs.name = "Please enter your full name (first and last name).";
  }

  /* ── Contact methods ──────────────────────────────────── */
  const phoneTrim = v.phone.trim();
  const emailTrim = v.email.trim();

  const phoneDigits = phoneTrim.replace(/\D/g, "");
  const phoneOk = PHONE_RE.test(phoneDigits);
  const emailOk = EMAIL_RE.test(emailTrim);

  if (phoneTrim.length === 0 && emailTrim.length === 0) {
    errs.contact = "Add a phone number or email so we can reach you.";
  }

  if (phoneTrim.length > 0 && !phoneOk) {
    errs.phone =
      "Enter a 10-digit mobile number starting with 0 (e.g. 0745566987).";
  }

  if (emailTrim.length > 0 && !emailOk) {
    errs.email =
      "Email must start with a lowercase letter and end with @gmail.com or @yahoo.com.";
  }

  /* ── Message ──────────────────────────────────────────── */
  if (v.message.trim().length < 10) {
    errs.message = "Tell us a little more (at least 10 characters).";
  }

  return errs;
};

function Field({
  id,
  label,
  error,
  optional,
  children,
  className = "",
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className={`${serif.className} mb-1.5 block text-[18px] italic leading-none`}>
        {label}
        {optional && <span className="ml-2 text-[14px] not-italic text-[#6b7686]">optional</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 flex items-start gap-1.5 text-[12.5px] text-[#9b2c2c]">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export default function Contacts({
  onSubmit,
}: {
  /**
   * Optional. Plug in your API here (return a promise; throw to show the error state).
   * If omitted, the form sends directly through EmailJS using the shared template.
   */
  onSubmit?: (data: ContactPayload) => Promise<void>;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const uid = useId();
  const [values, setValues] = useState<ContactPayload>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useResetScrollOnMount(sectionRef);

  /* --------------------------------------------------------------
   * Live validation + auto-formatting
   *   • Name  → capitalizes first letter of each word as you type
   *   • Email → lowercases the first character as you type
   *   • Re-validate the whole form with the new values
   *   • Update ONLY the error slot for the field being edited
   *   • Clear cross-field "contact" error as soon as either phone
   *     or email has content
   * ------------------------------------------------------------ */
  const set = <K extends keyof ContactPayload>(key: K, val: ContactPayload[K]) => {
    let formatted: ContactPayload[K] = val;

    if (key === "name" && typeof val === "string") {
      formatted = capitalizeName(val) as ContactPayload[K];
    }

    if (key === "email" && typeof val === "string") {
      formatted = lowercaseFirst(val) as ContactPayload[K];
    }

    const next: ContactPayload = { ...values, [key]: formatted };
    setValues(next);

    const allErrs = validate(next);

    setErrors((prev) => {
      const merged: Errors = { ...prev };

      if (key === "name") {
        if (allErrs.name) merged.name = allErrs.name;
        else delete merged.name;
      }

      if (key === "phone") {
        if (next.phone.trim().length > 0 && allErrs.phone) {
          merged.phone = allErrs.phone;
        } else {
          delete merged.phone;
        }
        if (next.phone.trim().length > 0 && merged.contact) {
          delete merged.contact;
        }
      }

      if (key === "email") {
        if (next.email.trim().length > 0 && allErrs.email) {
          merged.email = allErrs.email;
        } else {
          delete merged.email;
        }
        if (next.email.trim().length > 0 && merged.contact) {
          delete merged.contact;
        }
      }

      if (key === "message") {
        if (allErrs.message) merged.message = allErrs.message;
        else delete merged.message;
      }

      return merged;
    });
  };

  /* ---------------- Animations ---------------- */

  useIsoLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root || reduceMotion()) return;

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      /* 1 ─ HEADER */
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.querySelector(".ct-header"),
            start: "top 85%",
            once: true,
          },
        })
        .fromTo(
          ".ct-tag",
          { scale: 2.4, opacity: 0, rotation: 14 },
          { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: "back.out(2.2)" }
        )
        .fromTo(
          ".ct-char",
          {
            y: -120,
            rotation: () => gsap.utils.random(-18, 18),
            transformOrigin: "50% 100%",
          },
          {
            y: 0,
            rotation: 0,
            duration: 1.15,
            ease: "bounce.out",
            stagger: { each: 0.035 },
          },
          "-=0.2"
        )
        .fromTo(
          ".ct-char",
          { opacity: 0 },
          { opacity: 1, duration: 0.25, ease: "none", stagger: { each: 0.035 } },
          "<"
        )
        .fromTo(
          ".ct-word",
          { yPercent: 115, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.75,
            ease: "power3.out",
            stagger: 0.035,
          },
          "-=0.55"
        )
        .fromTo(
          ".ct-polaroid",
          { y: 60, opacity: 0, rotation: -14, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            rotation: -4,
            scale: 1,
            duration: 1,
            ease: "back.out(1.6)",
          },
          "-=0.6"
        )
        .fromTo(
          ".ct-clock",
          { scale: 0, rotation: -45 },
          { scale: 1, rotation: 6, duration: 0.9, ease: "elastic.out(1, 0.45)" },
          "-=0.55"
        )
        .fromTo(
          ".ct-blob",
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1, ease: "power3.out" },
          "-=0.9"
        );

      /* 2 ─ INFO CARDS */
      gsap.fromTo(
        ".ct-info",
        {
          y: 90,
          opacity: 0,
          rotation: (i: number) => [-7, 6, -5, 7, -6][i % 5],
          scale: 0.92,
          transformOrigin: "50% 100%",
        },
        {
          y: 0,
          opacity: 1,
          rotation: 0,
          scale: 1,
          duration: 0.9,
          ease: "back.out(1.6)",
          stagger: 0.11,
          scrollTrigger: {
            trigger: root.querySelector(".ct-grid"),
            start: "top 85%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".ct-info .ct-icon",
        { scale: 0, rotation: -30, transformOrigin: "50% 50%" },
        {
          scale: 1,
          rotation: 0,
          duration: 0.55,
          ease: "back.out(3)",
          stagger: 0.11,
          delay: 0.35,
          scrollTrigger: {
            trigger: root.querySelector(".ct-grid"),
            start: "top 85%",
            once: true,
          },
        }
      );
      gsap.fromTo(
        ".ct-info .ct-line",
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          stagger: { each: 0.06, from: "start" },
          delay: 0.45,
          scrollTrigger: {
            trigger: root.querySelector(".ct-grid"),
            start: "top 85%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".ct-team",
        { y: 40, opacity: 0, rotation: -8 },
        {
          y: 0,
          opacity: 1,
          rotation: 0,
          duration: 0.85,
          ease: "back.out(1.5)",
          delay: 0.5,
          scrollTrigger: {
            trigger: root.querySelector(".ct-grid"),
            start: "top 85%",
            once: true,
          },
        }
      );

      /* 3 ─ FORM */
      const formTrigger = root.querySelector(".ct-form");
      gsap.fromTo(
        ".ct-backsheet",
        { opacity: 0, x: -20, y: -20 },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: formTrigger, start: "top 85%", once: true },
        }
      );
      gsap
        .timeline({
          scrollTrigger: { trigger: formTrigger, start: "top 85%", once: true },
        })
        .fromTo(
          ".ct-form-card",
          { y: 70, opacity: 0, rotation: -3, scale: 0.96, transformOrigin: "50% 100%" },
          {
            y: 0,
            opacity: 1,
            rotation: 0,
            scale: 1,
            duration: 1,
            ease: "back.out(1.4)",
          }
        )
        .fromTo(
          ".ct-field",
          { y: 22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.07,
            ease: "power2.out",
          },
          "-=0.55"
        )
        .fromTo(
          ".ct-submit",
          { scale: 0.85, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.7, ease: "elastic.out(1, 0.5)" },
          "-=0.3"
        );

      /* 4 ─ PARALLAX */
      gsap.utils.toArray<HTMLElement>(".ct-parallax", root).forEach((el) => {
        const depth = Number(el.dataset.depth || 60);
        gsap.to(el, {
          y: -depth,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });
    }, root);

    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  const hopLetter = (e: React.MouseEvent<HTMLElement>) => {
    if (reduceMotion()) return;
    const el = e.target as HTMLElement;
    if (el.dataset.char !== "1" || gsap.isTweening(el)) return;
    gsap.to(el, { y: -18, duration: 0.18, ease: "power2.out", yoyo: true, repeat: 1 });
  };

  /* ---------------- Actions ---------------- */

  const buildText = (): string => {
    const lines: string[] = [`Name: ${values.name.trim()}`];
    if (values.phone.trim()) lines.push(`Phone: ${values.phone.trim()}`);
    if (values.email.trim()) lines.push(`Email: ${values.email.trim()}`);
    if (values.topic) lines.push(`Interested in: ${values.topic}`);
    lines.push(`Preferred contact: ${values.preferred}`, "", values.message.trim());
    return lines.join("\n");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setStatus("sending");
    try {
      if (onSubmit) {
        /* Custom handler provided — delegate entirely to it. */
        await onSubmit(values);
      } else {
        /* Default: send via EmailJS (single shared template). */
        const response = await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            form_type: "Contact enquiry",
            from_name: values.name.trim(),
            phone: values.phone.trim() || "Not provided",
            from_email: values.email.trim() || "Not provided",
            preferred_contact: values.preferred,
            topic: values.topic || "Not specified",
            message: values.message.trim(),
          },
          { publicKey: EMAILJS_PUBLIC_KEY }
        );

        if (response.status !== 200) {
          throw new Error(`EmailJS responded with status ${response.status}`);
        }
      }
      setStatus("sent");
    } catch (error) {
      console.error("Failed to send contact form:", error);
      setStatus("error");
    }
  };

  const openWhatsApp = () => {
    const text = values.message.trim()
      ? buildText()
      : "Hello! I'd like to know more about your POS solutions.";
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const reset = () => {
    setValues(emptyForm);
    setErrors({});
    setStatus("idle");
  };

  const firstName = values.name.trim().split(" ")[0];

  /* ---------------------------------------------------------------- */
  /* Render                                                            */
  /* ---------------------------------------------------------------- */

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={`${sans.className} relative w-full overflow-hidden bg-[#f1f4f8] py-16 text-[#0a1b3d] sm:py-24 lg:py-28`}
    >
      <Grain opacity={0.14} />

      {/* Collage backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="ct-parallax absolute -right-24 top-16" data-depth="90">
          <div className="h-56 w-56 rounded-full bg-[#dfe4eb] sm:h-80 sm:w-80" />
        </div>
        <div
          className="ct-parallax absolute -left-16 top-[560px] hidden lg:block"
          data-depth="140"
        >
          <div className="h-72 w-48 -rotate-[8deg] bg-[#cfe5f6]/70" />
        </div>
        <div
          className="ct-parallax absolute bottom-[8%] right-[4%] hidden lg:block"
          data-depth="60"
        >
          <div
            className="h-40 w-40 opacity-40"
            style={{ backgroundImage: halftoneDark, backgroundSize: "9px 9px" }}
          />
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="ct-header grid items-center gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
          <div>
            <div className="ct-tag mb-5 sm:mb-6">
              <span
                className={`${serif.className} relative inline-block -rotate-2 bg-[#dfe4eb] px-5 py-1.5 text-[16px] italic sm:text-[17px]`}
                style={{ clipPath: torn }}
              >
                Contact us
              </span>
            </div>

            <h2
              onMouseOver={hopLetter}
              className={`${serif.className} text-[44px] font-light leading-[0.98] tracking-[-0.02em] sm:text-[72px] lg:text-[96px]`}
            >
              <span className="sr-only">Let&apos;s talk. Right from Kandy.</span>
              <span aria-hidden="true">
                <SplitChars text="Let's talk." />
                <br />
                <span className="font-normal italic text-[#6b7686]">
                  <SplitChars text="Right from Kandy." />
                </span>
              </span>
            </h2>

            <p className="mt-6 max-w-[520px] text-[14.5px] font-light leading-7 text-[#0a1b3d]/70 sm:mt-7 sm:text-[15px]">
              <span className="sr-only">
                Questions, a demo, or a custom workflow? Call us, message us on
                WhatsApp, or fill in the form — we reply during working hours.
              </span>
              <span aria-hidden="true">
                <SplitWords text="Questions, a demo, or a custom workflow? Call us, message us on WhatsApp, or fill in the form — we reply during working hours." />
              </span>
            </p>
          </div>

          {/* polaroid collage */}
          <div className="relative mx-auto h-[300px] w-full max-w-[380px] sm:h-[340px] sm:max-w-[420px]">
            <div className="ct-blob absolute right-0 top-4 h-36 w-36 rounded-full bg-[#0a1b3d] sm:h-48 sm:w-48" />
            <div
              className="absolute -left-2 bottom-2 h-28 w-36 opacity-60 sm:h-36 sm:w-44"
              style={{ backgroundImage: halftoneDark, backgroundSize: "8px 8px" }}
            />
            <div className="ct-polaroid group absolute left-3 top-0 w-[230px] -rotate-[4deg] bg-white p-2.5 pb-10 shadow-[0_30px_50px_-25px_rgba(10,27,61,0.55)] sm:left-6 sm:w-[270px] sm:p-3 sm:pb-12">
              <Tape className="-top-3 left-1/2 -translate-x-1/2 rotate-3" />
              <Photo
                src={HEADER_IMG}
                alt="Team working together"
                className="aspect-[5/4] w-full"
                tone={0.35}
              />
              <p
                className={`${serif.className} absolute bottom-2.5 left-3.5 text-[17px] italic sm:bottom-3 sm:left-4 sm:text-[20px]`}
              >
                We&apos;re happy to help
              </p>
            </div>
            <div className="ct-clock absolute bottom-0 right-0 z-10 flex h-24 w-24 rotate-6 items-center justify-center bg-[#cfe5f6] p-2 text-center shadow-lg sm:right-2 sm:h-28 sm:w-28">
              <p className={`${serif.className} text-[15px] italic leading-tight sm:text-[18px]`}>
                Mon – Fri
                <br />
                10am – 5pm
              </p>
            </div>
          </div>
        </div>

        {/* INFO + FORM */}
        <div className="ct-grid mt-20 grid items-start gap-14 sm:mt-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">

          {/* LEFT — contact cards */}
          <div className="grid gap-6 sm:grid-cols-2 sm:gap-7">
            <InfoCard
              Icon={Phone}
              label="Call / WhatsApp"
              lines={[PHONE_DISPLAY]}
              cta="Call now"
              href={`tel:${PHONE_TEL}`}
              variant="white"
              tilt="-1.2deg"
            />
            <InfoCard
              Icon={Mail}
              label="Email"
              lines={[EMAIL]}
              cta="Write to us"
              href={`mailto:${EMAIL}?subject=${encodeURIComponent("Enquiry from the website")}`}
              variant="sky"
              tilt="1deg"
            />
            <InfoCard
              Icon={Clock}
              label="Schedule time"
              lines={[HOURS]}
              variant="navy"
              tilt="0.8deg"
              featured
            />
            <InfoCard
              Icon={MessageCircle}
              label="Chat on WhatsApp"
              lines={["Message us any time and we'll reply in working hours."]}
              cta="Open WhatsApp"
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              external
              variant="gray"
              tilt="-0.8deg"
            />
            <InfoCard
              Icon={MapPin}
              label="Visit us"
              lines={ADDRESS_LINES}
              cta="Open in Maps"
              href={MAPS_URL}
              external
              variant="white"
              tilt="-0.6deg"
              className="sm:col-span-2"
            />

            <div className="ct-team group relative hidden h-24 sm:col-span-2 sm:block" aria-hidden="true">
              <Photo
                src={TEAM_IMG}
                alt=""
                tone={0.35}
                className="absolute left-0 top-0 h-24 w-24 rounded-full border-[5px] border-white shadow-lg"
              />
              <div
                className="absolute left-28 top-4 h-14 w-56 bg-[#cfe5f6]"
                style={{ clipPath: torn }}
              />
            </div>
          </div>

          {/* RIGHT — form */}
          <div className="ct-form relative">
            <span
              aria-hidden="true"
              className="ct-backsheet absolute inset-0 translate-x-2 translate-y-2 bg-[#d3d9e2] sm:translate-x-3 sm:translate-y-3"
            />

            <div className="ct-form-card relative bg-white shadow-[0_50px_90px_-50px_rgba(10,27,61,0.6)]">
              <Tape className="-top-3 left-8 z-30 -rotate-6" />

              <div className="relative overflow-hidden bg-[#0a1b3d] px-5 py-8 sm:px-8 sm:py-10">
                <div
                  className="absolute inset-0 opacity-[0.16]"
                  style={{ backgroundImage: halftoneLight, backgroundSize: "9px 9px" }}
                />
                <div
                  className="absolute -bottom-20 -right-10 h-48 w-48 rounded-full bg-[#12306a]"
                  aria-hidden="true"
                />
                <Grain opacity={0.25} />
                <h3
                  className={`${serif.className} relative text-[34px] font-light leading-[1] tracking-[-0.01em] text-white sm:text-[44px]`}
                >
                  Send us a message
                </h3>
                <p
                  className={`${serif.className} relative mt-2 text-[18px] italic text-[#cfe5f6] sm:text-[20px]`}
                >
                  Tell us a little about your business.
                </p>
              </div>

              <div className="relative px-5 pb-8 pt-7 sm:px-8 sm:pb-10 sm:pt-9">
                <Grain opacity={0.08} />

                {status === "sent" ? (
                  <div className="relative py-8 text-center" role="status">
                    <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0a1b3d] text-white">
                      <Check className="h-7 w-7" strokeWidth={2.5} />
                    </span>
                    <p className={`${serif.className} mt-6 text-[36px] font-light leading-none sm:text-[44px]`}>
                      Thank you{firstName ? `, ${firstName}` : ""}.
                    </p>
                    <p className="mx-auto mt-4 max-w-[380px] text-[14.5px] font-light leading-7 text-[#0a1b3d]/75">
                      Your message has been sent. We&apos;ll get back to you during
                      working hours (Mon – Fri, 10am to 5pm).
                    </p>
                    <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={openWhatsApp}
                        className="inline-flex items-center gap-2 rounded-full bg-[#0a1b3d] px-6 py-3 text-[13.5px] font-normal text-white transition hover:bg-[#12306a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-2"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Chat on WhatsApp
                      </button>
                      <button
                        type="button"
                        onClick={reset}
                        className="inline-flex items-center gap-2 rounded-full border border-[#0a1b3d]/30 bg-white px-6 py-3 text-[13.5px] font-normal transition hover:border-[#0a1b3d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-2"
                      >
                        Send another message
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="relative grid gap-6">
                    {/* name */}
                    <Field
                      id={`${uid}-name`}
                      label="Full name"
                      error={errors.name}
                      className="ct-field"
                    >
                      <input
                        id={`${uid}-name`}
                        type="text"
                        autoComplete="name"
                        value={values.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="e.g. Nimal Perera"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? `${uid}-name-error` : undefined}
                        className={`${inputCls} ${
                          errors.name ? "border-[#9b2c2c]" : "border-[#0a1b3d]/30"
                        }`}
                      />
                    </Field>

                    {/* phone + email */}
                    <div className="ct-field grid gap-6 sm:grid-cols-2">
                      <Field
                        id={`${uid}-phone`}
                        label="Phone / WhatsApp"
                        error={errors.phone}
                      >
                        <input
                          id={`${uid}-phone`}
                          type="tel"
                          autoComplete="tel"
                          inputMode="tel"
                          value={values.phone}
                          onChange={(e) => set("phone", e.target.value)}
                          placeholder="07X XXX XXXX"
                          aria-invalid={!!errors.phone || !!errors.contact}
                          aria-describedby={
                            errors.phone
                              ? `${uid}-phone-error`
                              : errors.contact
                                ? `${uid}-contact-error`
                                : undefined
                          }
                          className={`${inputCls} ${
                            errors.phone || errors.contact
                              ? "border-[#9b2c2c]"
                              : "border-[#0a1b3d]/30"
                          }`}
                        />
                      </Field>
                      <Field
                        id={`${uid}-email`}
                        label="Email"
                        error={errors.email}
                      >
                        <input
                          id={`${uid}-email`}
                          type="email"
                          autoComplete="email"
                          value={values.email}
                          onChange={(e) => set("email", e.target.value)}
                          placeholder="you@gmail.com"
                          aria-invalid={!!errors.email || !!errors.contact}
                          aria-describedby={
                            errors.email
                              ? `${uid}-email-error`
                              : errors.contact
                                ? `${uid}-contact-error`
                                : undefined
                          }
                          className={`${inputCls} ${
                            errors.email || errors.contact
                              ? "border-[#9b2c2c]"
                              : "border-[#0a1b3d]/30"
                          }`}
                        />
                      </Field>
                    </div>
                    {errors.contact && (
                      <p
                        id={`${uid}-contact-error`}
                        role="alert"
                        className="-mt-3 flex items-start gap-1.5 text-[12.5px] text-[#9b2c2c]"
                      >
                        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        {errors.contact}
                      </p>
                    )}

                    {/* topic chips */}
                    <div className="ct-field">
                      <p className={`${serif.className} mb-2.5 text-[18px] italic leading-none`}>
                        I&apos;m interested in
                        <span className="ml-2 text-[14px] not-italic text-[#6b7686]">optional</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {TOPICS.map((t) => {
                          const on = values.topic === t;
                          return (
                            <button
                              key={t}
                              type="button"
                              aria-pressed={on}
                              onClick={() => set("topic", on ? "" : t)}
                              className={`rounded-full border px-4 py-2 text-[13px] font-normal transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-2 ${
                                on
                                  ? "border-[#0a1b3d] bg-[#0a1b3d] text-white"
                                  : "border-[#0a1b3d]/30 bg-white hover:border-[#0a1b3d] hover:bg-[#cfe5f6]/60"
                              }`}
                            >
                              {t}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* message */}
                    <Field
                      id={`${uid}-message`}
                      label="Your message"
                      error={errors.message}
                      className="ct-field"
                    >
                      <textarea
                        id={`${uid}-message`}
                        rows={5}
                        maxLength={600}
                        value={values.message}
                        onChange={(e) => set("message", e.target.value)}
                        placeholder="Tell us about your shop, how many outlets you run, or what you'd like to customize…"
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? `${uid}-message-error` : undefined}
                        className={`${inputCls} resize-none leading-7 ${
                          errors.message ? "border-[#9b2c2c]" : "border-[#0a1b3d]/30"
                        }`}
                      />
                      <p className="mt-1 text-right text-[11.5px] font-light text-[#6b7686]">
                        {values.message.length}/600
                      </p>
                    </Field>

                    {/* preferred contact */}
                    <div className="ct-field" role="radiogroup" aria-labelledby={`${uid}-pref`}>
                      <p
                        id={`${uid}-pref`}
                        className={`${serif.className} mb-2.5 text-[18px] italic leading-none`}
                      >
                        Best way to reach you
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {PREFERRED.map((p) => {
                          const on = values.preferred === p;
                          return (
                            <button
                              key={p}
                              type="button"
                              role="radio"
                              aria-checked={on}
                              onClick={() => set("preferred", p)}
                              className={`flex items-center justify-center gap-2 border-b-2 px-2 py-3 text-[13.5px] font-normal transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-2 ${
                                on
                                  ? "border-[#0a1b3d] bg-[#cfe5f6]"
                                  : "border-[#0a1b3d]/20 bg-[#f1f4f8] hover:bg-[#cfe5f6]/50"
                              }`}
                            >
                              {p === "WhatsApp" && <MessageCircle className="h-4 w-4" />}
                              {p === "Call" && <Phone className="h-4 w-4" />}
                              {p === "Email" && <Mail className="h-4 w-4" />}
                              {p}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* actions */}
                    <div className="ct-submit flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
                      <button
                        type="submit"
                        disabled={status === "sending"}
                        className="group/btn inline-flex items-center justify-center gap-2 rounded-full bg-[#0a1b3d] px-7 py-3.5 text-[14px] font-normal text-white transition hover:bg-[#12306a] disabled:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-2"
                      >
                        {status === "sending" ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending…
                          </>
                        ) : (
                          <>
                            Send message
                            <Send className="h-4 w-4 transition group-hover/btn:translate-x-0.5" />
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={openWhatsApp}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#0a1b3d]/30 bg-white px-6 py-3.5 text-[14px] font-normal transition hover:border-[#0a1b3d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-2"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Send on WhatsApp
                      </button>
                    </div>

                    {status === "error" && (
                      <p role="alert" className="flex items-start gap-2 text-[13px] text-[#9b2c2c]">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        Something went wrong while sending. Please try again, or call us on{" "}
                        {PHONE_DISPLAY}.
                      </p>
                    )}

                    <p className="text-[12px] font-light leading-5 text-[#6b7686]">
                      We only use your details to reply to this enquiry.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
