"use client";

/* ============================================================
 * Request a Demo — BillPOS
 * ------------------------------------------------------------
 * A distinct layout from the Contacts section:
 *
 *   • Split column layout
 *       LEFT  → "What to expect" numbered timeline (01–04)
 *                + a polaroid photo stuck on the side
 *       RIGHT → the booking form (all demo-specific fields)
 *
 *   • Bottom strip → alternative contact channels
 *
 * Shared design DNA with the rest of the site:
 *   Cormorant Garamond + Jost · torn tags · halftone · washi tape
 *   grain · letter-bounce headings · parallax backdrop
 *
 * Validation (matched to Contacts):
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
import { useResetScrollOnMount } from "@/lib/use-reset-scroll-on-mount";
import {
  AlertCircle,
  ArrowUpRight,
  Calendar,
  Check,
  Clock,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Send,
  Store,
  Users,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Fonts                                                              */
/* ------------------------------------------------------------------ */

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const sans = Jost({ subsets: ["latin"], weight: ["300", "400", "500"] });

/* ------------------------------------------------------------------ */
/* Contact details                                                    */
/* ------------------------------------------------------------------ */

const EMAIL = "hello@qdeskai.com";
const PHONE_DISPLAY = "077 291 3369";
const PHONE_TEL = "+94772913369";
const WHATSAPP_NUMBER = "94772913369";

const HEADER_IMG =
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=85";

/* ------------------------------------------------------------------ */
/* Texture helpers                                                    */
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
/* Text splitting helpers                                             */
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
                className="dm-char inline-block will-change-transform"
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
            <span className="dm-word inline-block will-change-transform">
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
/* Content                                                            */
/* ------------------------------------------------------------------ */

const STEPS = [
  {
    n: "01",
    title: "Book a slot",
    body:
      "Fill the form with your preferred date, time and what you'd like to focus on. Takes about a minute.",
  },
  {
    n: "02",
    title: "We confirm",
    body:
      "Within one working day we'll reach out on your preferred channel to lock in the time and share the meeting link.",
  },
  {
    n: "03",
    title: "The walkthrough",
    body:
      "A focused 30-minute live tour of BillPOS — shown on screens that match how your business actually runs.",
  },
  {
    n: "04",
    title: "Your next step",
    body:
      "If it's a fit, we'll send a tailored quotation. If not, you'll still leave with a clearer picture of what to look for.",
  },
];

const BUSINESS_TYPES = [
  "Fashion",
  "Salon",
  "Retail",
  "Restaurant",
  "Supermarket",
  "Pharmacy",
  "SME",
  "Something else",
];

const TEAM_SIZES = ["Just me", "2 – 5", "6 – 20", "20+"];

const LOCATION_COUNTS = ["1", "2 – 3", "4 – 10", "10+"];

const TIME_SLOTS = ["Morning", "Afternoon", "Evening"];

const PREFERRED = ["WhatsApp", "Call", "Email"];

/* ------------------------------------------------------------------ */
/* Form                                                               */
/* ------------------------------------------------------------------ */

export type DemoPayload = {
  name: string;
  business: string;
  phone: string;
  email: string;
  businessType: string;
  teamSize: string;
  locations: string;
  date: string;
  timeSlot: string;
  preferred: string;
  focus: string;
  notes: string;
};

type Errors = Partial<
  Record<"name" | "phone" | "email" | "contact" | "date" | "focus", string>
>;

const emptyForm: DemoPayload = {
  name: "",
  business: "",
  phone: "",
  email: "",
  businessType: "",
  teamSize: "",
  locations: "",
  date: "",
  timeSlot: "Morning",
  preferred: "WhatsApp",
  focus: "",
  notes: "",
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
 */
function capitalizeName(value: string): string {
  return value.replace(/(^|\s)(\S)/g, (_, sep, ch) => sep + ch.toUpperCase());
}

/**
 * Lowercase the FIRST character of the string only.
 * Preserves the rest exactly as typed.
 *   "John@gmail.com"  → "john@gmail.com"
 *   "JOHN@gmail.com"  → "jOHN@gmail.com"
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
 */
const EMAIL_RE = /^[a-z][a-zA-Z0-9._-]*@(gmail\.com|yahoo\.com)$/;

const validate = (v: DemoPayload): Errors => {
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
    errs.contact = "Add a phone number or email so we can confirm your demo.";
  }

  if (phoneTrim.length > 0 && !phoneOk) {
    errs.phone =
      "Enter a 10-digit mobile number starting with 0 (e.g. 0745566987).";
  }

  if (emailTrim.length > 0 && !emailOk) {
    errs.email =
      "Email must start with a lowercase letter and end with @gmail.com or @yahoo.com.";
  }

  /* ── Date ─────────────────────────────────────────────── */
  if (!v.date) errs.date = "Pick a preferred date.";

  /* ── Focus ────────────────────────────────────────────── */
  if (v.focus.trim().length < 10)
    errs.focus = "Tell us what you'd like to focus on (at least 10 characters).";

  return errs;
};

function Field({
  id,
  label,
  hint,
  error,
  optional,
  children,
  className = "",
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className={`${serif.className} mb-1.5 block text-[18px] italic leading-none`}
      >
        {label}
        {optional && (
          <span className="ml-2 text-[14px] not-italic text-[#6b7686]">
            optional
          </span>
        )}
      </label>
      {hint && (
        <p className="mb-2 text-[12.5px] font-light leading-5 text-[#6b7686]">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 flex items-start gap-1.5 text-[12.5px] text-[#9b2c2c]"
        >
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

export default function RequestDemo({
  onSubmit,
}: {
  /**
   * Optional API hook. Return a promise; throw to trigger the error state.
   * If omitted, the form opens a mailto: to hello@qdeskai.com.
   */
  onSubmit?: (data: DemoPayload) => Promise<void>;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const uid = useId();
  const [values, setValues] = useState<DemoPayload>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

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
  const set = <K extends keyof DemoPayload>(key: K, val: DemoPayload[K]) => {
    let formatted: DemoPayload[K] = val;

    if (key === "name" && typeof val === "string") {
      formatted = capitalizeName(val) as DemoPayload[K];
    }

    if (key === "email" && typeof val === "string") {
      formatted = lowercaseFirst(val) as DemoPayload[K];
    }

    const next: DemoPayload = { ...values, [key]: formatted };
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

      if (key === "date") {
        if (allErrs.date) merged.date = allErrs.date;
        else delete merged.date;
      }

      if (key === "focus") {
        if (allErrs.focus) merged.focus = allErrs.focus;
        else delete merged.focus;
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
            trigger: root.querySelector(".dm-header"),
            start: "top 85%",
            once: true,
          },
        })
        .fromTo(
          ".dm-tag",
          { scale: 2.4, opacity: 0, rotation: 14 },
          { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: "back.out(2.2)" }
        )
        .fromTo(
          ".dm-char",
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
          ".dm-char",
          { opacity: 0 },
          { opacity: 1, duration: 0.25, ease: "none", stagger: { each: 0.035 } },
          "<"
        )
        .fromTo(
          ".dm-word",
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
          ".dm-polaroid",
          { y: 60, opacity: 0, rotation: -14, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            rotation: -3,
            scale: 1,
            duration: 1,
            ease: "back.out(1.6)",
          },
          "-=0.6"
        )
        .fromTo(
          ".dm-clock",
          { scale: 0, rotation: -45 },
          { scale: 1, rotation: 6, duration: 0.9, ease: "elastic.out(1, 0.45)" },
          "-=0.55"
        )
        .fromTo(
          ".dm-blob",
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1, ease: "power3.out" },
          "-=0.9"
        );

      /* 2 ─ STEPS (left column) */
      gsap.fromTo(
        ".dm-step",
        { x: -40, opacity: 0, rotation: -2 },
        {
          x: 0,
          opacity: 1,
          rotation: 0,
          duration: 0.8,
          ease: "back.out(1.5)",
          stagger: 0.12,
          scrollTrigger: {
            trigger: root.querySelector(".dm-steps"),
            start: "top 82%",
            once: true,
          },
        }
      );
      gsap.fromTo(
        ".dm-step-num",
        { scale: 0, rotation: -45, transformOrigin: "left center" },
        {
          scale: 1,
          rotation: 0,
          duration: 0.6,
          ease: "back.out(3)",
          stagger: 0.12,
          delay: 0.2,
          scrollTrigger: {
            trigger: root.querySelector(".dm-steps"),
            start: "top 82%",
            once: true,
          },
        }
      );

      /* 3 ─ FORM */
      const formTrigger = root.querySelector(".dm-form");
      gsap.fromTo(
        ".dm-backsheet",
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
          ".dm-form-card",
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
          ".dm-field",
          { y: 22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.06,
            ease: "power2.out",
          },
          "-=0.55"
        )
        .fromTo(
          ".dm-submit",
          { scale: 0.85, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.7, ease: "elastic.out(1, 0.5)" },
          "-=0.3"
        );

      /* 4 ─ BOTTOM STRIP */
      gsap.fromTo(
        ".dm-alt",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.querySelector(".dm-alt-strip"),
            start: "top 92%",
            once: true,
          },
        }
      );

      /* 5 ─ PARALLAX */
      gsap.utils.toArray<HTMLElement>(".dm-parallax", root).forEach((el) => {
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
    const lines: string[] = [
      `Hi! I'd like to book a BillPOS demo.`,
      "",
      `Name: ${values.name.trim()}`,
    ];
    if (values.business.trim()) lines.push(`Business: ${values.business.trim()}`);
    if (values.phone.trim()) lines.push(`Phone: ${values.phone.trim()}`);
    if (values.email.trim()) lines.push(`Email: ${values.email.trim()}`);
    if (values.businessType) lines.push(`Business type: ${values.businessType}`);
    if (values.teamSize) lines.push(`Team size: ${values.teamSize}`);
    if (values.locations) lines.push(`Locations: ${values.locations}`);
    if (values.date) lines.push(`Preferred date: ${values.date}`);
    if (values.timeSlot) lines.push(`Preferred time: ${values.timeSlot}`);
    lines.push(`Preferred contact: ${values.preferred}`);
    lines.push("", "Focus:", values.focus.trim());
    if (values.notes.trim()) lines.push("", "Additional notes:", values.notes.trim());
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
        await onSubmit(values);
      } else {
        const subject = `Demo request — ${values.name.trim()}${
          values.businessType ? ` (${values.businessType})` : ""
        }`;
        window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
          subject
        )}&body=${encodeURIComponent(buildText())}`;
      }
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const openWhatsApp = () => {
    const text = values.focus.trim()
      ? buildText()
      : "Hello! I'd like to book a BillPOS demo.";
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
  const today = new Date().toISOString().split("T")[0];

  /* ---------------------------------------------------------------- */
  /* Render                                                            */
  /* ---------------------------------------------------------------- */

  return (
    <section
      ref={sectionRef}
      id="request-demo"
      className={`${sans.className} relative w-full overflow-hidden bg-[#f1f4f8] py-16 text-[#0a1b3d] sm:py-24 lg:py-28`}
    >
      <Grain opacity={0.14} />

      {/* Backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="dm-parallax absolute -right-24 top-16" data-depth="90">
          <div className="h-56 w-56 rounded-full bg-[#dfe4eb] sm:h-80 sm:w-80" />
        </div>
        <div
          className="dm-parallax absolute -left-16 top-[560px] hidden lg:block"
          data-depth="140"
        >
          <div className="h-72 w-48 -rotate-[8deg] bg-[#cfe5f6]/70" />
        </div>
        <div
          className="dm-parallax absolute bottom-[8%] right-[4%] hidden lg:block"
          data-depth="60"
        >
          <div
            className="h-40 w-40 opacity-40"
            style={{ backgroundImage: halftoneDark, backgroundSize: "9px 9px" }}
          />
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">

        {/* ============================================================ */}
        {/* HEADER                                                        */}
        {/* ============================================================ */}

        <div className="dm-header grid items-center gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
          <div>
            <div className="dm-tag mb-5 sm:mb-6">
              <span
                className={`${serif.className} relative inline-block -rotate-2 bg-[#dfe4eb] px-5 py-1.5 text-[16px] italic sm:text-[17px]`}
                style={{ clipPath: torn }}
              >
                Request a demo
              </span>
            </div>

            <h2
              onMouseOver={hopLetter}
              className={`${serif.className} text-[44px] font-light leading-[0.98] tracking-[-0.02em] sm:text-[72px] lg:text-[96px]`}
            >
              <span className="sr-only">Book a 30-minute demo of BillPOS.</span>
              <span aria-hidden="true">
                <SplitChars text="Book a 30-minute" />
                <br />
                <span className="font-normal italic text-[#6b7686]">
                  <SplitChars text="demo of BillPOS." />
                </span>
              </span>
            </h2>

            <p className="mt-6 max-w-[540px] text-[14.5px] font-light leading-7 text-[#0a1b3d]/70 sm:mt-7 sm:text-[15px]">
              <span className="sr-only">
                A live walkthrough with our team, tailored to how your business
                actually runs — not a generic sales pitch. Pick a date, tell us
                what you'd like to focus on, and we'll take it from there.
              </span>
              <span aria-hidden="true">
                <SplitWords text="A live walkthrough with our team, tailored to how your business actually runs — not a generic sales pitch. Pick a date, tell us what you'd like to focus on, and we'll take it from there." />
              </span>
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[12.5px] font-light text-[#0a1b3d]/65">
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#0a1b3d]/60" />
                30 minutes
              </span>
              <span className="inline-flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-[#0a1b3d]/60" />
                Live Q&amp;A
              </span>
              <span className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-[#0a1b3d]/60" />
                No obligation
              </span>
            </div>
          </div>

          {/* polaroid collage */}
          <div className="relative mx-auto h-[300px] w-full max-w-[380px] sm:h-[340px] sm:max-w-[420px]">
            <div className="dm-blob absolute right-0 top-4 h-36 w-36 rounded-full bg-[#0a1b3d] sm:h-48 sm:w-48" />
            <div
              className="absolute -left-2 bottom-2 h-28 w-36 opacity-60 sm:h-36 sm:w-44"
              style={{ backgroundImage: halftoneDark, backgroundSize: "8px 8px" }}
            />
            <div className="dm-polaroid group absolute left-3 top-0 w-[230px] -rotate-[4deg] bg-white p-2.5 pb-10 shadow-[0_30px_50px_-25px_rgba(10,27,61,0.55)] sm:left-6 sm:w-[270px] sm:p-3 sm:pb-12">
              <Tape className="-top-3 left-1/2 -translate-x-1/2 rotate-3" />
              <Photo
                src={HEADER_IMG}
                alt="A live BillPOS product walkthrough"
                className="aspect-[5/4] w-full"
                tone={0.35}
              />
              <p
                className={`${serif.className} absolute bottom-2.5 left-3.5 text-[17px] italic sm:bottom-3 sm:left-4 sm:text-[20px]`}
              >
                A live product walkthrough
              </p>
            </div>
            <div className="dm-clock absolute bottom-0 right-0 z-10 flex h-24 w-24 rotate-6 items-center justify-center bg-[#cfe5f6] p-2 text-center shadow-lg sm:right-2 sm:h-28 sm:w-28">
              <p className={`${serif.className} text-[15px] italic leading-tight sm:text-[18px]`}>
                30 min
                <br />
                Free demo
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SPLIT — steps (left) + form (right)                           */}
        {/* ============================================================ */}

        <div className="mt-20 grid items-start gap-12 sm:mt-24 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">

          {/* LEFT — what to expect */}
          <div className="dm-steps relative">
            <div className="mb-8">
              <span
                className={`${serif.className} relative inline-block rotate-1 bg-[#cfe5f6] px-5 py-1.5 text-[16px] italic sm:text-[17px]`}
                style={{ clipPath: torn }}
              >
                What to expect
              </span>
              <h3
                className={`${serif.className} mt-6 text-[32px] font-light leading-[1.05] tracking-[-0.02em] sm:text-[44px]`}
              >
                Four simple steps,
                <span className="block italic text-[#6b7686]">
                  from request to walkthrough.
                </span>
              </h3>
            </div>

            <ol className="relative border-l border-[#0a1b3d]/15 pl-6 sm:pl-8">
              {STEPS.map((s, i) => (
                <li
                  key={s.n}
                  className="dm-step relative pb-9 last:pb-0"
                >
                  <span
                    className="absolute -left-[33px] top-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-[#0a1b3d] sm:-left-[41px]"
                    aria-hidden="true"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#cfe5f6]" />
                  </span>

                  <p
                    className={`dm-step-num ${serif.className} text-[36px] font-light italic leading-none text-[#6b7686]`}
                  >
                    {s.n}
                  </p>

                  <h4
                    className={`${serif.className} mt-2 text-[24px] font-medium leading-tight sm:text-[28px]`}
                  >
                    {s.title}
                  </h4>

                  <p className="mt-2 max-w-[440px] text-[14px] font-light leading-7 text-[#0a1b3d]/70">
                    {s.body}
                  </p>

                  {i < STEPS.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="mt-5 block h-px w-full bg-[#0a1b3d]/10"
                    />
                  )}
                </li>
              ))}
            </ol>

            <div className="mt-10 hidden items-center gap-3 lg:flex">
              <span className="h-px w-10 bg-[#0a1b3d]/20" />
              <span className="font-mono text-[10px] tracking-[0.28em] text-[#6b7686]">
                NO PRESSURE · NO SCRIPTS
              </span>
            </div>
          </div>

          {/* RIGHT — form */}
          <div className="dm-form relative">
            <span
              aria-hidden="true"
              className="dm-backsheet absolute inset-0 translate-x-2 translate-y-2 bg-[#d3d9e2] sm:translate-x-3 sm:translate-y-3"
            />

            <div className="dm-form-card relative bg-white shadow-[0_50px_90px_-50px_rgba(10,27,61,0.6)]">
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
                  className={`${serif.className} relative text-[34px] font-light leading-[1] tracking-[-0.01em] text-white sm:text-[42px]`}
                >
                  Book your demo
                </h3>
                <p
                  className={`${serif.className} relative mt-2 text-[18px] italic text-[#cfe5f6] sm:text-[20px]`}
                >
                  Tell us about your business — we'll do the rest.
                </p>
              </div>

              <div className="relative px-5 pb-8 pt-7 sm:px-8 sm:pb-10 sm:pt-9">
                <Grain opacity={0.08} />

                {status === "sent" ? (
                  <div className="relative py-8 text-center" role="status">
                    <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0a1b3d] text-white">
                      <Check className="h-7 w-7" strokeWidth={2.5} />
                    </span>
                    <p
                      className={`${serif.className} mt-6 text-[34px] font-light leading-none sm:text-[42px]`}
                    >
                      Thank you{firstName ? `, ${firstName}` : ""}.
                    </p>
                    <p className="mx-auto mt-4 max-w-[400px] text-[14.5px] font-light leading-7 text-[#0a1b3d]/75">
                      {onSubmit
                        ? "We'll confirm your demo by email or WhatsApp within one working day. Talk soon!"
                        : "Your email app should now be open with your demo request ready to send. Prefer a faster reply? Reach us on WhatsApp."}
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
                        Book another demo
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="relative grid gap-6">

                    {/* ── SECTION 1: About you ─────────────────── */}
                    <fieldset className="dm-field space-y-6">
                      <legend className="sr-only">About you</legend>

                      <div className="grid gap-6 sm:grid-cols-2">
                        <Field id={`${uid}-name`} label="Full name" error={errors.name}>
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

                        <Field id={`${uid}-business`} label="Business name" optional>
                          <input
                            id={`${uid}-business`}
                            type="text"
                            autoComplete="organization"
                            value={values.business}
                            onChange={(e) => set("business", e.target.value)}
                            placeholder="e.g. Perera Fashion House"
                            className={`${inputCls} border-[#0a1b3d]/30`}
                          />
                        </Field>
                      </div>

                      <div className="grid gap-6 sm:grid-cols-2">
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
                    </fieldset>

                    {/* ── SECTION 2: Your business ────────────── */}
                    <fieldset className="dm-field space-y-6 border-t border-[#0a1b3d]/10 pt-6">
                      <legend className="sr-only">Your business</legend>

                      <div>
                        <p
                          className={`${serif.className} mb-2.5 text-[18px] italic leading-none`}
                        >
                          Business type
                          <span className="ml-2 text-[14px] not-italic text-[#6b7686]">
                            optional
                          </span>
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {BUSINESS_TYPES.map((t) => {
                            const on = values.businessType === t;
                            return (
                              <button
                                key={t}
                                type="button"
                                aria-pressed={on}
                                onClick={() => set("businessType", on ? "" : t)}
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

                      <div role="radiogroup" aria-labelledby={`${uid}-team`}>
                        <p
                          id={`${uid}-team`}
                          className={`${serif.className} mb-2.5 text-[18px] italic leading-none`}
                        >
                          <Users className="mr-1.5 -mt-0.5 inline h-4 w-4" />
                          Team size
                          <span className="ml-2 text-[14px] not-italic text-[#6b7686]">
                            optional
                          </span>
                        </p>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                          {TEAM_SIZES.map((t) => {
                            const on = values.teamSize === t;
                            return (
                              <button
                                key={t}
                                type="button"
                                role="radio"
                                aria-checked={on}
                                onClick={() => set("teamSize", on ? "" : t)}
                                className={`border-b-2 px-3 py-3 text-[13.5px] font-normal transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-2 ${
                                  on
                                    ? "border-[#0a1b3d] bg-[#cfe5f6]"
                                    : "border-[#0a1b3d]/20 bg-[#f1f4f8] hover:bg-[#cfe5f6]/50"
                                }`}
                              >
                                {t}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div role="radiogroup" aria-labelledby={`${uid}-loc`}>
                        <p
                          id={`${uid}-loc`}
                          className={`${serif.className} mb-2.5 text-[18px] italic leading-none`}
                        >
                          <Store className="mr-1.5 -mt-0.5 inline h-4 w-4" />
                          Number of locations
                          <span className="ml-2 text-[14px] not-italic text-[#6b7686]">
                            optional
                          </span>
                        </p>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                          {LOCATION_COUNTS.map((t) => {
                            const on = values.locations === t;
                            return (
                              <button
                                key={t}
                                type="button"
                                role="radio"
                                aria-checked={on}
                                onClick={() => set("locations", on ? "" : t)}
                                className={`border-b-2 px-3 py-3 text-[13.5px] font-normal transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-2 ${
                                  on
                                    ? "border-[#0a1b3d] bg-[#cfe5f6]"
                                    : "border-[#0a1b3d]/20 bg-[#f1f4f8] hover:bg-[#cfe5f6]/50"
                                }`}
                              >
                                {t}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </fieldset>

                    {/* ── SECTION 3: When ──────────────────────── */}
                    <fieldset className="dm-field space-y-6 border-t border-[#0a1b3d]/10 pt-6">
                      <legend className="sr-only">When</legend>

                      <div className="grid gap-6 sm:grid-cols-[1fr_1.2fr]">
                        <Field
                          id={`${uid}-date`}
                          label="Preferred date"
                          error={errors.date}
                        >
                          <input
                            id={`${uid}-date`}
                            type="date"
                            value={values.date}
                            onChange={(e) => set("date", e.target.value)}
                            aria-invalid={!!errors.date}
                            aria-describedby={errors.date ? `${uid}-date-error` : undefined}
                            min={today}
                            className={`${inputCls} ${
                              errors.date ? "border-[#9b2c2c]" : "border-[#0a1b3d]/30"
                            }`}
                          />
                        </Field>

                        <div>
                          <p
                            className={`${serif.className} mb-1.5 block text-[18px] italic leading-none`}
                          >
                            <Calendar className="mr-1.5 -mt-0.5 inline h-4 w-4" />
                            Preferred time
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            {TIME_SLOTS.map((t) => {
                              const on = values.timeSlot === t;
                              return (
                                <button
                                  key={t}
                                  type="button"
                                  aria-pressed={on}
                                  onClick={() => set("timeSlot", t)}
                                  className={`border-b-2 px-2 py-3 text-[13.5px] font-normal transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-2 ${
                                    on
                                      ? "border-[#0a1b3d] bg-[#cfe5f6]"
                                      : "border-[#0a1b3d]/20 bg-[#f1f4f8] hover:bg-[#cfe5f6]/50"
                                  }`}
                                >
                                  {t}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div role="radiogroup" aria-labelledby={`${uid}-pref`}>
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
                    </fieldset>

                    {/* ── SECTION 4: Focus ─────────────────────── */}
                    <fieldset className="dm-field space-y-6 border-t border-[#0a1b3d]/10 pt-6">
                      <legend className="sr-only">Focus</legend>

                      <Field
                        id={`${uid}-focus`}
                        label="What would you like to focus on?"
                        hint="Mention the modules or workflows you care about most, so we can tailor the walkthrough."
                        error={errors.focus}
                      >
                        <textarea
                          id={`${uid}-focus`}
                          rows={4}
                          maxLength={600}
                          value={values.focus}
                          onChange={(e) => set("focus", e.target.value)}
                          placeholder="e.g. Multi-branch stock transfers, WhatsApp e-Bill, sales reports by staff, barcode printing…"
                          aria-invalid={!!errors.focus}
                          aria-describedby={errors.focus ? `${uid}-focus-error` : undefined}
                          className={`${inputCls} resize-none leading-7 ${
                            errors.focus ? "border-[#9b2c2c]" : "border-[#0a1b3d]/30"
                          }`}
                        />
                        <p className="mt-1 text-right text-[11.5px] font-light text-[#6b7686]">
                          {values.focus.length}/600
                        </p>
                      </Field>

                      <Field
                        id={`${uid}-notes`}
                        label="Anything we should prepare?"
                        optional
                        hint="Optional — let us know if there's data, screenshots or a workflow you'd like us to have ready."
                      >
                        <textarea
                          id={`${uid}-notes`}
                          rows={3}
                          maxLength={400}
                          value={values.notes}
                          onChange={(e) => set("notes", e.target.value)}
                          placeholder="e.g. Please show how to import an existing product list."
                          className={`${inputCls} resize-none leading-7 border-[#0a1b3d]/30`}
                        />
                      </Field>
                    </fieldset>

                    {/* ── Actions ──────────────────────────────── */}
                    <div className="dm-submit flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
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
                            Book my demo
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
                        Quick booking on WhatsApp
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
                      We only use your details to arrange and confirm this demo.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* BOTTOM STRIP — alternative contact channels                   */}
        {/* ============================================================ */}

        <div className="dm-alt-strip mt-20 sm:mt-24">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#0a1b3d]/15 to-transparent" />

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-12">
            <div className="dm-alt">
              <h3
                className={`${serif.className} text-[30px] font-light leading-[1.05] tracking-[-0.02em] sm:text-[40px]`}
              >
                Not ready to book?
                <span className="block italic text-[#6b7686]">
                  Reach us however you like.
                </span>
              </h3>
            </div>

            <div className="dm-alt flex flex-wrap items-center gap-3 lg:justify-end">
              <a
                href={`tel:${PHONE_TEL}`}
                className="inline-flex items-center gap-2 rounded-full border border-[#0a1b3d]/30 bg-white px-5 py-3 text-[13.5px] font-normal transition hover:border-[#0a1b3d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-2"
              >
                <Phone className="h-4 w-4" />
                {PHONE_DISPLAY}
              </a>
              <a
                href={`mailto:${EMAIL}?subject=${encodeURIComponent("Enquiry about BillPOS")}`}
                className="inline-flex items-center gap-2 rounded-full border border-[#0a1b3d]/30 bg-white px-5 py-3 text-[13.5px] font-normal transition hover:border-[#0a1b3d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-2"
              >
                <Mail className="h-4 w-4" />
                {EMAIL}
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#0a1b3d] px-5 py-3 text-[13.5px] font-normal text-white transition hover:bg-[#12306a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-2"
              >
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
