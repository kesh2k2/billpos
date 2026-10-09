"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Cormorant_Garamond, Jost } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
/* Fonts + palette (same as the solutions component)                  */
/* ------------------------------------------------------------------ */

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const sans = Jost({ subsets: ["latin"], weight: ["300", "400", "500"] });

// Dark blue  #0a1b3d  |  Light blue #cfe5f6  |  Gray #dfe4eb / #6b7686  |  White

/* ------------------------------------------------------------------ */
/* Contact details                                                    */
/* ------------------------------------------------------------------ */

const PHONE_DISPLAY = "077 291 3369";
const PHONE_TEL = "+94772913369";
const WHATSAPP_NUMBER = "94772913369";
const EMAIL = "hello@qdeskai.com";
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

/** Duotone photo. Adds `relative` only if the caller hasn't set a position. */
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

/* ------------------------------------------------------------------ */
/* Info card                                                          */
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
}) {
  const v = variantStyles[variant];
  const body = (
    <>
      <Grain opacity={variant === "navy" ? 0.25 : 0.1} />
      <span className={`relative flex h-11 w-11 items-center justify-center rounded-full ${v.icon}`}>
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <p className={`${serif.className} relative mt-4 text-[26px] italic leading-none`}>{label}</p>
      <div className="relative mt-3 text-[15px] font-light leading-6">
        {lines.map((l) => (
          <p key={l} className="break-words">{l}</p>
        ))}
      </div>
      {cta && (
        <p className="relative mt-4 inline-flex items-center gap-1.5 text-[13px] font-normal">
          {cta}
          <ArrowUpRight className="h-3.5 w-3.5 transition group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5" />
        </p>
      )}
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

type Errors = Partial<Record<"name" | "contact" | "message", string>>;

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

const validate = (v: ContactPayload): Errors => {
  const errs: Errors = {};
  if (v.name.trim().length < 2) errs.name = "Please tell us your name.";

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim());
  const phoneOk = v.phone.replace(/\D/g, "").length >= 9;
  if (!emailOk && !phoneOk) errs.contact = "Add a valid phone number or email so we can reach you.";
  else if (v.email.trim() && !emailOk) errs.contact = "That email doesn't look right.";

  if (v.message.trim().length < 10) errs.message = "Tell us a little more (at least 10 characters).";
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
   * If omitted, the form opens an email to hello@qdeskai.com with the message pre-filled.
   */
  onSubmit?: (data: ContactPayload) => Promise<void>;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const uid = useId();
  const [values, setValues] = useState<ContactPayload>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const set = <K extends keyof ContactPayload>(key: K, val: ContactPayload[K]) => {
    setValues((p) => ({ ...p, [key]: val }));
    if (errors.name && key === "name") setErrors((p) => ({ ...p, name: undefined }));
    if (errors.contact && (key === "phone" || key === "email")) setErrors((p) => ({ ...p, contact: undefined }));
    if (errors.message && key === "message") setErrors((p) => ({ ...p, message: undefined }));
  };

  /* ---------------- Entrance ---------------- */

  useEffect(() => {
    const root = sectionRef.current;
    if (!root || reduceMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ct-header > *",
        { y: 24, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: root.querySelector(".ct-header"), start: "top 88%", once: true },
        }
      );
      gsap.fromTo(
        ".ct-info",
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: root.querySelector(".ct-grid"), start: "top 88%", once: true },
        }
      );
      gsap.fromTo(
        ".ct-form",
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.95, ease: "power3.out",
          scrollTrigger: { trigger: root.querySelector(".ct-grid"), start: "top 88%", once: true },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  /* ---------------- Actions ---------------- */

  const buildText = () =>
    [
      `Name: ${values.name.trim()}`,
      values.phone.trim() && `Phone: ${values.phone.trim()}`,
      values.email.trim() && `Email: ${values.email.trim()}`,
      values.topic && `Interested in: ${values.topic}`,
      `Preferred contact: ${values.preferred}`,
      "",
      values.message.trim(),
    ]
      .filter((l) => l !== false)
      .join("\n");

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
        const subject = `Enquiry from ${values.name.trim()}${values.topic ? ` — ${values.topic}` : ""}`;
        window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildText())}`;
      }
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const openWhatsApp = () => {
    const text = values.message.trim()
      ? buildText()
      : "Hello! I'd like to know more about your POS solutions.";
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
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

      {/* collage backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 top-16 h-56 w-56 rounded-full bg-[#dfe4eb] sm:h-80 sm:w-80" />
        <div className="absolute -left-16 top-[560px] hidden h-72 w-48 -rotate-[8deg] bg-[#cfe5f6]/70 lg:block" />
        <div
          className="absolute bottom-[8%] right-[4%] hidden h-40 w-40 opacity-40 lg:block"
          style={{ backgroundImage: halftoneDark, backgroundSize: "9px 9px" }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">

        {/* ============================================================ */}
        {/* HEADER                                                         */}
        {/* ============================================================ */}

        <div className="ct-header grid items-center gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
          <div>
            <span
              className={`${serif.className} relative mb-5 inline-block -rotate-2 bg-[#dfe4eb] px-5 py-1.5 text-[16px] italic sm:mb-6 sm:text-[17px]`}
              style={{ clipPath: torn }}
            >
              Contact us
            </span>

            <h2
              className={`${serif.className} text-[44px] font-light leading-[0.98] tracking-[-0.02em] sm:text-[72px] lg:text-[96px]`}
            >
              Let&apos;s talk.
              <br />
              <span className="font-normal italic text-[#6b7686]">Right from Kandy.</span>
            </h2>

            <p className="mt-6 max-w-[520px] text-[14.5px] font-light leading-7 text-[#0a1b3d]/70 sm:mt-7 sm:text-[15px]">
              Questions, a demo, or a custom workflow? Call us, message us on
              WhatsApp, or fill in the form — we reply during working hours.
            </p>
          </div>

          {/* polaroid collage */}
          <div className="relative mx-auto h-[300px] w-full max-w-[380px] sm:h-[340px] sm:max-w-[420px]">
            <div className="absolute right-0 top-4 h-36 w-36 rounded-full bg-[#0a1b3d] sm:h-48 sm:w-48" />
            <div
              className="absolute -left-2 bottom-2 h-28 w-36 opacity-60 sm:h-36 sm:w-44"
              style={{ backgroundImage: halftoneDark, backgroundSize: "8px 8px" }}
            />
            <div className="group absolute left-3 top-0 w-[230px] -rotate-[4deg] bg-white p-2.5 pb-10 shadow-[0_30px_50px_-25px_rgba(10,27,61,0.55)] sm:left-6 sm:w-[270px] sm:p-3 sm:pb-12">
              <Tape className="-top-3 left-1/2 -translate-x-1/2 rotate-3" />
              <Photo src={HEADER_IMG} alt="Team working together" className="aspect-[5/4] w-full" tone={0.35} />
              <p className={`${serif.className} absolute bottom-2.5 left-3.5 text-[17px] italic sm:bottom-3 sm:left-4 sm:text-[20px]`}>
                We&apos;re happy to help
              </p>
            </div>
            <div className="absolute bottom-0 right-0 z-10 flex h-24 w-24 rotate-6 items-center justify-center bg-[#cfe5f6] p-2 text-center shadow-lg sm:right-2 sm:h-28 sm:w-28">
              <p className={`${serif.className} text-[15px] italic leading-tight sm:text-[18px]`}>
                Mon – Fri
                <br />
                10am – 5pm
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* INFO + FORM                                                    */}
        {/* ============================================================ */}

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
              href={`mailto:${EMAIL}`}
              variant="sky"
              tilt="1deg"
            />
            <InfoCard
              Icon={Clock}
              label="Schedule time"
              lines={[HOURS]}
              variant="navy"
              tilt="0.8deg"
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

            {/* sticker photo */}
            <div className="group relative hidden h-24 sm:col-span-2 sm:block" aria-hidden="true">
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
            {/* back sheet */}
            <span
              aria-hidden="true"
              className="absolute inset-0 translate-x-2 translate-y-2 bg-[#d3d9e2] sm:translate-x-3 sm:translate-y-3"
            />

            <div className="relative bg-white shadow-[0_50px_90px_-50px_rgba(10,27,61,0.6)]">
              <Tape className="-top-3 left-8 z-30 -rotate-6" />

              {/* navy header strip */}
              <div className="relative overflow-hidden bg-[#0a1b3d] px-5 py-8 sm:px-8 sm:py-10">
                <div
                  className="absolute inset-0 opacity-[0.16]"
                  style={{ backgroundImage: halftoneLight, backgroundSize: "9px 9px" }}
                />
                <div className="absolute -bottom-20 -right-10 h-48 w-48 rounded-full bg-[#12306a]" aria-hidden="true" />
                <Grain opacity={0.25} />
                <h3 className={`${serif.className} relative text-[34px] font-light leading-[1] tracking-[-0.01em] text-white sm:text-[44px]`}>
                  Send us a message
                </h3>
                <p className={`${serif.className} relative mt-2 text-[18px] italic text-[#cfe5f6] sm:text-[20px]`}>
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
                      {onSubmit
                        ? "Your message has been sent. We'll get back to you during working hours (Mon – Fri, 10am to 5pm)."
                        : "Your email app should now be open with your message ready to send. Prefer chat? Reach us on WhatsApp instead."}
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
                        className={`${inputCls} ${errors.name ? "border-[#9b2c2c]" : "border-[#0a1b3d]/30"}`}
                      />
                    </Field>

                    {/* phone + email */}
                    <div className="grid gap-6 sm:grid-cols-2">
                      <Field id={`${uid}-phone`} label="Phone / WhatsApp">
                        <input
                          id={`${uid}-phone`}
                          type="tel"
                          autoComplete="tel"
                          inputMode="tel"
                          value={values.phone}
                          onChange={(e) => set("phone", e.target.value)}
                          placeholder="07X XXX XXXX"
                          aria-invalid={!!errors.contact}
                          className={`${inputCls} ${errors.contact ? "border-[#9b2c2c]" : "border-[#0a1b3d]/30"}`}
                        />
                      </Field>
                      <Field id={`${uid}-email`} label="Email">
                        <input
                          id={`${uid}-email`}
                          type="email"
                          autoComplete="email"
                          value={values.email}
                          onChange={(e) => set("email", e.target.value)}
                          placeholder="you@business.com"
                          aria-invalid={!!errors.contact}
                          aria-describedby={errors.contact ? `${uid}-contact-error` : undefined}
                          className={`${inputCls} ${errors.contact ? "border-[#9b2c2c]" : "border-[#0a1b3d]/30"}`}
                        />
                      </Field>
                    </div>
                    {errors.contact && (
                      <p id={`${uid}-contact-error`} role="alert" className="-mt-3 flex items-start gap-1.5 text-[12.5px] text-[#9b2c2c]">
                        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        {errors.contact}
                      </p>
                    )}

                    {/* topic chips */}
                    <div>
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
                    <Field id={`${uid}-message`} label="Your message" error={errors.message}>
                      <textarea
                        id={`${uid}-message`}
                        rows={5}
                        maxLength={600}
                        value={values.message}
                        onChange={(e) => set("message", e.target.value)}
                        placeholder="Tell us about your shop, how many outlets you run, or what you'd like to customize…"
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? `${uid}-message-error` : undefined}
                        className={`${inputCls} resize-none leading-7 ${errors.message ? "border-[#9b2c2c]" : "border-[#0a1b3d]/30"}`}
                      />
                      <p className="mt-1 text-right text-[11.5px] font-light text-[#6b7686]">
                        {values.message.length}/600
                      </p>
                    </Field>

                    {/* preferred contact */}
                    <div role="radiogroup" aria-labelledby={`${uid}-pref`}>
                      <p id={`${uid}-pref`} className={`${serif.className} mb-2.5 text-[18px] italic leading-none`}>
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
                    <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
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
                        Something went wrong while sending. Please try again, or call us on {PHONE_DISPLAY}.
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