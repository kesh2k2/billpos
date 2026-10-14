"use client";

/* ============================================================
 * Packages Section
 * ------------------------------------------------------------
 * Collage aesthetic. Torn edges, halftone dots, washi tape,
 * serif/sans pairing. Letter-bounce heading, word-mask intro,
 * card drops with back.out / elastic.out, wobbling sticker,
 * parallax backdrop.
 *
 * Scroll-restoration fix:
 *   Uses the shared `useResetScrollOnMount` hook from
 *   `@/lib/use-reset-scroll-on-mount` so the section always opens
 *   at its own top edge when navigated to.
 * ============================================================ */

import {
  useCallback,
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
  ArrowUpRight,
  Check,
  Mail,
  MessageCircle,
  Plus,
  Sparkles,
  X,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Fonts + palette (same as the other components)                     */
/* ------------------------------------------------------------------ */

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const sans = Jost({ subsets: ["latin"], weight: ["300", "400", "500"] });

// Dark blue  #0a1b3d  |  Light blue #cfe5f6  |  Gray #dfe4eb / #6b7686  |  White

/* ------------------------------------------------------------------ */
/* Contact details used for quotation requests                        */
/* ------------------------------------------------------------------ */

const QUOTE_EMAIL = "hello@qdeskai.com";
const WHATSAPP_NUMBER = "94772913369"; // international format, no + or spaces

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

const reduceMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// layout effect on the client (animations start before the first paint), normal effect on the server
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ------------------------------------------------------------------ */
/* Text splitting helpers (no paid GSAP plugin needed)                */
/* ------------------------------------------------------------------ */

/** Every letter becomes its own span so it can bounce. Words never break in the middle. */
function SplitChars({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, wi) => (
        <span key={wi}>
          <span className="inline-block whitespace-nowrap">
            {word.split("").map((ch, ci) => (
              <span key={ci} data-char="1" className="pk-char inline-block will-change-transform">
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

/** Every word rises out of its own mask for the staggered reveal. */
function SplitWords({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span key={i}>
          <span className="-mb-[3px] inline-block overflow-hidden pb-[3px] align-top">
            <span className="pk-word inline-block will-change-transform">{word}</span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Data                                                               */
/* ------------------------------------------------------------------ */

const HEADING_LINE_1 = "Plans that grow";
const HEADING_LINE_2 = "with your business.";
const INTRO_TEXT =
  "Choose the package that fits today and upgrade as you grow. Every plan is quoted to your business — request a quotation by email or WhatsApp, whichever you prefer.";

type Pkg = {
  key: string;
  name: string;
  tagline: string;
  inherits?: string; // e.g. "Everything in Starter"
  features: string[];
  featured?: boolean;
  card: string;
  sub: string;
  check: string;
  tilt: string;
};

const packages: Pkg[] = [
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
    card: "bg-white text-[#0a1b3d]",
    sub: "text-[#0a1b3d]/70",
    check: "bg-[#0a1b3d] text-white",
    tilt: "-0.8deg",
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
    card: "bg-[#0a1b3d] text-white",
    sub: "text-white/70",
    check: "bg-[#cfe5f6] text-[#0a1b3d]",
    tilt: "0deg",
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
    card: "bg-[#cfe5f6] text-[#0a1b3d]",
    sub: "text-[#0a1b3d]/75",
    check: "bg-[#0a1b3d] text-white",
    tilt: "0.8deg",
  },
];

const steps = [
  { n: "01", title: "Choose a package", body: "Pick the plan that fits your business today." },
  { n: "02", title: "Tell us how to reach you", body: "Send your request by email or WhatsApp — your choice." },
  { n: "03", title: "Receive your quotation", body: "We'll prepare a quotation tailored to your business." },
];

const fieldCls =
  "w-full border-0 border-b border-[#0a1b3d]/30 bg-[#f1f4f8] px-3.5 py-3 text-[15px] font-light text-[#0a1b3d] outline-none transition placeholder:text-[#6b7686]/70 focus:border-[#0a1b3d] focus:bg-[#cfe5f6]/50";

/* ------------------------------------------------------------------ */
/* Quotation dialog                                                   */
/* ------------------------------------------------------------------ */

function QuoteDialog({ packageName, onClose }: { packageName: string; onClose: () => void }) {
  const uid = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const closing = useRef(false);

  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [notes, setNotes] = useState("");
  const [sentVia, setSentVia] = useState<"email" | "whatsapp" | null>(null);

  /* animated close */
  const requestClose = useCallback(() => {
    if (closing.current) return;
    closing.current = true;

    const el = rootRef.current;
    if (!el || reduceMotion()) {
      onClose();
      return;
    }

    gsap.to(el.querySelector(".pk-dpanel"), {
      y: 40,
      opacity: 0,
      scale: 0.96,
      duration: 0.25,
      ease: "power2.in",
    });
    gsap.to(el, { opacity: 0, duration: 0.25, ease: "none", onComplete: onClose });
  }, [onClose]);

  /* Esc to close + lock page scroll while the dialog is open */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && requestClose();
    window.addEventListener("keydown", onKey);

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [requestClose]);

  /* animated open */
  useEffect(() => {
    const el = rootRef.current;
    if (!el || reduceMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "none" });
      gsap.fromTo(
        ".pk-dpanel",
        { y: 70, rotation: -4, scale: 0.94, opacity: 0 },
        { y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.6)" }
      );
      gsap.fromTo(
        ".pk-dfield",
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.09, delay: 0.3, ease: "power2.out" }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  const buildMessage = () => {
    const lines = [`Hello! I'd like to request a quotation for the ${packageName} package.`, ""];
    if (name.trim()) lines.push(`Name: ${name.trim()}`);
    if (business.trim()) lines.push(`Business: ${business.trim()}`);
    if (notes.trim()) lines.push(`Notes: ${notes.trim()}`);
    return lines.join("\n").trim();
  };

  const sendEmail = () => {
    const subject = `Quotation request — ${packageName} package`;
    window.location.href = `mailto:${QUOTE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildMessage())}`;
    setSentVia("email");
  };

  const sendWhatsApp = () => {
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage())}`,
      "_blank",
      "noopener,noreferrer"
    );
    setSentVia("whatsapp");
  };

  const label = `${serif.className} mb-1.5 block text-[18px] italic leading-none`;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0a1b3d]/65 p-4 sm:items-center sm:py-10"
      onMouseDown={(e) => e.target === e.currentTarget && requestClose()}
    >
      <div className={`${sans.className} pk-dpanel relative w-full max-w-[560px]`}>
        <span aria-hidden="true" className="absolute inset-0 translate-x-2 translate-y-2 bg-[#d3d9e2] sm:translate-x-3 sm:translate-y-3" />

        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${uid}-title`}
          className="relative bg-white text-[#0a1b3d] shadow-2xl"
        >
          <Tape className="-top-3 left-8 z-30 -rotate-6" />

          {/* header */}
          <div className="relative overflow-hidden bg-[#0a1b3d] px-5 py-8 sm:px-8">
            <div
              className="absolute inset-0 opacity-[0.16]"
              style={{ backgroundImage: halftoneLight, backgroundSize: "9px 9px" }}
            />
            <Grain opacity={0.25} />
            <button
              type="button"
              onClick={requestClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 id={`${uid}-title`} className={`${serif.className} relative pr-12 text-[34px] font-light leading-none text-white sm:text-[42px]`}>
              Request a quotation
            </h3>
            <p className={`${serif.className} relative mt-2 text-[20px] italic text-[#cfe5f6]`}>
              {packageName} package
            </p>
          </div>

          {/* body */}
          <div className="relative grid gap-5 px-5 pb-8 pt-7 sm:px-8">
            <Grain opacity={0.08} />

            <div className="relative grid gap-5 sm:grid-cols-2">
              <div className="pk-dfield">
                <label htmlFor={`${uid}-name`} className={label}>
                  Your name <span className="ml-1 text-[14px] not-italic text-[#6b7686]">optional</span>
                </label>
                <input
                  id={`${uid}-name`}
                  autoFocus
                  autoComplete="name"
                  maxLength={80}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Perera"
                  className={fieldCls}
                />
              </div>
              <div className="pk-dfield">
                <label htmlFor={`${uid}-business`} className={label}>
                  Business <span className="ml-1 text-[14px] not-italic text-[#6b7686]">optional</span>
                </label>
                <input
                  id={`${uid}-business`}
                  autoComplete="organization"
                  maxLength={100}
                  value={business}
                  onChange={(e) => setBusiness(e.target.value)}
                  placeholder="ABC Retail"
                  className={fieldCls}
                />
              </div>
            </div>

            <div className="pk-dfield relative">
              <label htmlFor={`${uid}-notes`} className={label}>
                Anything we should know? <span className="ml-1 text-[14px] not-italic text-[#6b7686]">optional</span>
              </label>
              <textarea
                id={`${uid}-notes`}
                rows={3}
                maxLength={500}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Number of branches, type of business, special requirements…"
                className={`${fieldCls} resize-none leading-7`}
              />
            </div>

            <div className="pk-dfield relative border-t border-[#0a1b3d]/15 pt-5">
              <p className={`${serif.className} text-[20px] italic leading-tight`}>
                How would you like to get your quotation?
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={sendEmail}
                  className="group/btn inline-flex items-center justify-center gap-2 rounded-full bg-[#0a1b3d] px-6 py-3.5 text-[14px] font-normal text-white transition hover:bg-[#12306a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-2"
                >
                  <Mail className="h-4 w-4" />
                  Send by email
                </button>
                <button
                  type="button"
                  onClick={sendWhatsApp}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#0a1b3d]/30 bg-white px-6 py-3.5 text-[14px] font-normal transition hover:border-[#0a1b3d] hover:bg-[#cfe5f6]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Send on WhatsApp
                </button>
              </div>

              {sentVia && (
                <p role="status" className="mt-4 flex items-start gap-2.5 bg-[#cfe5f6] px-4 py-3 text-[13.5px] font-normal leading-6">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0a1b3d] text-white">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {sentVia === "email"
                    ? "Your email app should now be open with the request ready to send. Just press send."
                    : "WhatsApp should now be open with your request ready to send. Just press send."}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export default function Packages() {
  const sectionRef = useRef<HTMLElement>(null);
  const [quoteFor, setQuoteFor] = useState<string | null>(null);

  /* Strong scroll-restoration fix — resets the window scroll AND
   * refreshes ScrollTrigger in the correct order, so the section
   * always opens at its own top edge when navigated to. */
  useResetScrollOnMount(sectionRef);

  /* ---------------- Animations ---------------- */

  useIsoLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root || reduceMotion()) return;

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      /* 1 ─ HEADER: tag stamps in → letters bounce down → intro words stagger up */
      gsap
        .timeline({
          scrollTrigger: { trigger: ".pk-header", start: "top 85%", once: true },
        })
        .fromTo(
          ".pk-tag",
          { scale: 2.4, opacity: 0, rotation: 14 },
          { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: "back.out(2.2)" }
        )
        .fromTo(
          ".pk-char",
          { y: -120, rotation: () => gsap.utils.random(-18, 18), transformOrigin: "50% 100%" },
          { y: 0, rotation: 0, duration: 1.15, ease: "bounce.out", stagger: { each: 0.035 } },
          "-=0.2"
        )
        // opacity is a separate tween because a bounce ease would make it flicker
        .fromTo(
          ".pk-char",
          { opacity: 0 },
          { opacity: 1, duration: 0.25, ease: "none", stagger: { each: 0.035 } },
          "<"
        )
        .fromTo(
          ".pk-word",
          { yPercent: 115, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.75, ease: "power3.out", stagger: 0.035 },
          "-=0.55"
        );

      /* 2 ─ PACKAGES: one by one, each card then reveals its own contents */
      const buildCardTimeline = (card: HTMLElement, index: number) => {
        const q = gsap.utils.selector(card);
        const tl = gsap.timeline();

        tl.fromTo(
          card,
          {
            y: 170,
            opacity: 0,
            scale: 0.9,
            rotation: index % 2 === 0 ? -7 : 7,
            transformOrigin: "50% 100%",
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 1.1,
            ease: "back.out(1.5)",
            clearProps: "transform",
          }
        )
          .fromTo(
            q(".pk-quote"),
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
            "-=0.5"
          )
          .fromTo(
            q(".pk-feat"),
            { opacity: 0, x: -26 },
            { opacity: 1, x: 0, duration: 0.45, stagger: 0.05, ease: "power2.out" },
            "-=0.3"
          )
          .fromTo(
            q(".pk-check"),
            { scale: 0, rotation: -90 },
            { scale: 1, rotation: 0, duration: 0.5, stagger: 0.05, ease: "back.out(3)" },
            "<0.1"
          )
          .fromTo(
            q(".pk-btn"),
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.8, ease: "elastic.out(1, 0.5)" },
            "-=0.35"
          );

        const sticker = q(".pk-sticker");
        if (sticker.length) {
          tl.fromTo(
            sticker,
            { scale: 0, rotation: -45 },
            { scale: 1, rotation: 0, duration: 0.9, ease: "elastic.out(1, 0.45)" },
            "-=0.7"
          ).add(() => {
            // gentle idle wobble on the "Recommended" sticker
            gsap.to(sticker, { rotation: 4, duration: 1.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
          });
        }

        return tl;
      };

      const cards = gsap.utils.toArray<HTMLElement>(".pk-card", root);

      // desktop (3 columns side by side): a single timeline — card 1, then 2, then 3
      mm.add("(min-width: 1024px)", () => {
        const grid = gsap.timeline({
          scrollTrigger: { trigger: ".pk-grid", start: "top 80%", once: true },
        });
        cards.forEach((card, i) => grid.add(buildCardTimeline(card, i), i * 0.5));
      });

      // tablet / mobile (cards stacked): each card animates when it scrolls into view
      mm.add("(max-width: 1023px)", () => {
        cards.forEach((card, i) => {
          gsap
            .timeline({ scrollTrigger: { trigger: card, start: "top 88%", once: true } })
            .add(buildCardTimeline(card, i));
        });
      });

      /* 3 ─ HOW IT WORKS: cards drop in with a tilt, numbers pop */
      gsap
        .timeline({ scrollTrigger: { trigger: ".pk-steps", start: "top 88%", once: true } })
        .fromTo(
          ".pk-step",
          { y: 90, opacity: 0, scale: 0.92, rotation: (i: number) => [-6, 5, -4][i % 3] },
          { y: 0, opacity: 1, scale: 1, rotation: 0, duration: 0.9, ease: "back.out(1.6)", stagger: 0.18 }
        )
        .fromTo(
          ".pk-stepnum",
          { scale: 0, rotation: -30, transformOrigin: "left center" },
          { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(3)", stagger: 0.18 },
          "<0.25"
        );

      /* 4 ─ FOOTER ROW */
      gsap.fromTo(
        ".pk-foot > *",
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out",
          scrollTrigger: { trigger: ".pk-foot", start: "top 95%", once: true },
        }
      );

      /* 5 ─ BACKDROP SHAPES: slow parallax while scrolling */
      gsap.utils.toArray<HTMLElement>(".pk-parallax", root).forEach((el) => {
        const depth = Number(el.dataset.depth || 60);
        gsap.to(el, {
          y: -depth,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 1 },
        });
      });
    }, root);

    // positions shift once the web fonts have loaded
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  /* hover a letter → it hops (fun, but only after the entrance has finished) */
  const hopLetter = (e: React.MouseEvent<HTMLElement>) => {
    if (reduceMotion()) return;
    const el = e.target as HTMLElement;
    if (el.dataset.char !== "1" || gsap.isTweening(el)) return;
    gsap.to(el, { y: -18, duration: 0.18, ease: "power2.out", yoyo: true, repeat: 1 });
  };

  /* ---------------------------------------------------------------- */
  /* Render                                                            */
  /* ---------------------------------------------------------------- */

  return (
    <section
      ref={sectionRef}
      id="packages"
      className={`${sans.className} relative w-full overflow-hidden bg-[#f1f4f8] py-16 text-[#0a1b3d] sm:py-24 lg:py-28`}
    >
      <Grain opacity={0.14} />

      {/* collage backdrop (wrapped so GSAP can move it without touching the rotation classes) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="pk-parallax absolute -left-24 top-20" data-depth="90">
          <div className="h-56 w-56 rounded-full bg-[#dfe4eb] sm:h-80 sm:w-80" />
        </div>
        <div className="pk-parallax absolute -right-16 top-[560px] hidden lg:block" data-depth="140">
          <div className="h-72 w-48 rotate-[8deg] bg-[#cfe5f6]/70" />
        </div>
        <div className="pk-parallax absolute bottom-[10%] left-[5%] hidden lg:block" data-depth="60">
          <div
            className="h-40 w-40 opacity-40"
            style={{ backgroundImage: halftoneDark, backgroundSize: "9px 9px" }}
          />
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">

        {/* ============================================================ */}
        {/* HEADER                                                         */}
        {/* ============================================================ */}

        <div className="pk-header mx-auto max-w-[860px] text-center">
          <div className="pk-tag mb-5 sm:mb-6">
            <span
              className={`${serif.className} relative inline-block -rotate-2 bg-[#dfe4eb] px-5 py-1.5 text-[16px] italic sm:text-[17px]`}
              style={{ clipPath: torn }}
            >
              Packages
            </span>
          </div>

          <h2
            onMouseOver={hopLetter}
            className={`${serif.className} text-[44px] font-light leading-[0.98] tracking-[-0.02em] sm:text-[72px] lg:text-[88px]`}
          >
            <span className="sr-only">
              {HEADING_LINE_1} {HEADING_LINE_2}
            </span>
            <span aria-hidden="true">
              <SplitChars text={HEADING_LINE_1} />
              <br />
              <span className="font-normal italic text-[#6b7686]">
                <SplitChars text={HEADING_LINE_2} />
              </span>
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-[580px] text-[14.5px] font-light leading-7 text-[#0a1b3d]/70 sm:mt-7 sm:text-[15px]">
            <span className="sr-only">{INTRO_TEXT}</span>
            <span aria-hidden="true">
              <SplitWords text={INTRO_TEXT} />
            </span>
          </p>
        </div>

        {/* ============================================================ */}
        {/* PACKAGES                                                       */}
        {/* ============================================================ */}

        <div className="pk-grid mt-16 grid items-stretch gap-10 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {packages.map((pkg) => (
            <article key={pkg.key} className="pk-card relative">
              <div
                className={`relative flex h-full rotate-[var(--r)] flex-col p-6 shadow-[0_30px_50px_-30px_rgba(10,27,61,0.55)] transition-transform duration-500 hover:-translate-y-1 hover:rotate-0 sm:p-8 ${pkg.card} ${
                  pkg.featured ? "lg:-translate-y-3 lg:hover:-translate-y-4" : ""
                }`}
                style={{ ["--r" as any]: pkg.tilt }}
              >
                <Grain opacity={pkg.featured ? 0.25 : 0.1} />
                <Tape className="-top-3 left-8 -rotate-6" />

                {pkg.featured && (
                  <>
                    <div
                      className="pointer-events-none absolute inset-0 opacity-[0.12]"
                      style={{ backgroundImage: halftoneLight, backgroundSize: "10px 10px" }}
                    />
                    <div className="pk-sticker absolute -top-5 right-5 z-20">
                      <div className="flex rotate-3 items-center gap-1.5 bg-[#cfe5f6] px-3.5 py-1.5 text-[#0a1b3d] shadow-lg">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span className={`${serif.className} text-[17px] italic leading-none`}>Recommended</span>
                      </div>
                    </div>
                  </>
                )}

                <h3 className={`${serif.className} relative text-[40px] font-light leading-none`}>
                  {pkg.name}
                </h3>

                <p className={`relative mt-3 text-[14px] font-light leading-6 ${pkg.sub}`}>{pkg.tagline}</p>

                {/* quotation instead of a price */}
                <div className="pk-quote relative mt-6 border-y border-current/20 py-5">
                  <p className={`${serif.className} text-[34px] font-light italic leading-none sm:text-[38px]`}>
                    Custom quote
                  </p>
                  <p className={`mt-2 text-[13px] font-light ${pkg.sub}`}>Tailored to your business</p>
                </div>

                {/* features */}
                <ul className="relative mt-6 space-y-3">
                  {pkg.inherits && (
                    <li className="pk-feat flex items-center gap-3">
                      <span className="pk-check flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current/40">
                        <Plus className="h-3 w-3" strokeWidth={2.5} />
                      </span>
                      <span className={`${serif.className} text-[19px] italic leading-tight`}>
                        {pkg.inherits}, plus
                      </span>
                    </li>
                  )}

                  {pkg.features.map((f) => (
                    <li key={f} className="pk-feat flex items-start gap-3 text-[14px] font-light leading-6">
                      <span className={`pk-check mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${pkg.check}`}>
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      <span className="min-w-0 break-words">{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="relative mt-auto pt-8">
                  <button
                    type="button"
                    onClick={() => setQuoteFor(pkg.name)}
                    className={`pk-btn group/btn inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[14px] font-normal transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                      pkg.featured
                        ? "bg-white text-[#0a1b3d] hover:bg-[#cfe5f6] focus-visible:ring-white focus-visible:ring-offset-[#0a1b3d]"
                        : "bg-[#0a1b3d] text-white hover:bg-[#12306a] focus-visible:ring-[#0a1b3d]"
                    }`}
                  >
                    Request a quotation
                    <ArrowUpRight className="h-4 w-4 transition group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ============================================================ */}
        {/* HOW IT WORKS                                                   */}
        {/* ============================================================ */}

        <div className="pk-steps mt-20 grid gap-6 sm:mt-24 sm:grid-cols-3 sm:gap-5">
          {steps.map((s, i) => (
            <div key={s.n} className="pk-step">
              <div
                className={`relative px-6 pb-9 pt-7 shadow-[0_30px_50px_-35px_rgba(10,27,61,0.5)] sm:px-7 ${
                  i === 1 ? "bg-[#dfe4eb]" : "bg-white"
                }`}
                style={{ clipPath: torn, transform: `rotate(${i === 0 ? "-0.8deg" : i === 1 ? "0.6deg" : "-0.5deg"})` }}
              >
                <Grain opacity={0.1} />
                <p className={`pk-stepnum ${serif.className} relative text-[44px] font-light italic leading-none text-[#6b7686]`}>
                  {s.n}
                </p>
                <p className={`${serif.className} relative mt-3 text-[26px] font-medium leading-tight`}>{s.title}</p>
                <p className="relative mt-2 text-[14px] font-light leading-6 text-[#0a1b3d]/70">{s.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ============================================================ */}
        {/* NOT SURE?                                                      */}
        {/* ============================================================ */}

        <div className="pk-foot mt-16 flex flex-col items-center justify-between gap-5 border-t border-[#0a1b3d]/15 pt-8 sm:mt-20 lg:flex-row">
          <p className={`${serif.className} text-center text-[24px] italic text-[#6b7686] lg:text-left`}>
            Not sure which package is right? Just ask us.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={`mailto:${QUOTE_EMAIL}`}
              className="inline-flex items-center gap-2 rounded-full border border-[#0a1b3d]/30 bg-white px-6 py-3 text-[13.5px] font-normal transition hover:border-[#0a1b3d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-2"
            >
              <Mail className="h-4 w-4" />
              {QUOTE_EMAIL}
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#0a1b3d] px-6 py-3 text-[13.5px] font-normal text-white transition hover:bg-[#12306a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-2"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {quoteFor && <QuoteDialog packageName={quoteFor} onClose={() => setQuoteFor(null)} />}
    </section>
  );
}
