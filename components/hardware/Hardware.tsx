"use client";

/* ============================================================
 * POS Hardware Section — BillPOS
 * ------------------------------------------------------------
 * Collage aesthetic matched to About / Packages / Contacts.
 *
 * Card layouts (rotates per category for visual variety):
 *   • standard  → image on top, content below
 *   • overlay   → full-bleed image, text overlaid
 *   • wide      → spans 2 cols, image on left, content right
 *
 * No brands, no prices. Every card requests a quotation
 * through WhatsApp.
 *
 * Mobile: every card can be maximised / minimised.
 * Hover (and tap): square frame + zoom on product photos.
 * ============================================================ */

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Cormorant_Garamond, Jost } from "next/font/google";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useResetScrollOnMount } from "@/lib/use-reset-scroll-on-mount";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CreditCard,
  Cpu,
  Headphones,
  Keyboard,
  Mail,
  MessageCircle,
  Maximize2,
  Minimize2,
  Monitor,
  Mouse,
  Package,
  Phone,
  Plus,
  Printer,
  Scan,
  ShieldCheck,
  ShoppingCart,
  WalletCards,
  Zap,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Fonts + palette                                                    */
/* ------------------------------------------------------------------ */

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const sans = Jost({ subsets: ["latin"], weight: ["300", "400", "500"] });

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

/**
 * Duotone photo — used throughout the site.
 *  • halftone → dotted "net" overlay (off for product cards)
 *  • zoom     → image scales up when the parent `.group` is hovered / tapped
 *  • frame    → white square frame draws in on hover / tap
 *  • soft     → lighter greyscale so product photos stay clear
 */
function Photo({
  src,
  alt,
  className = "",
  tone = 0.4,
  halftone = true,
  zoom = false,
  frame = false,
  soft = false,
}: {
  src: string;
  alt: string;
  className?: string;
  tone?: number;
  halftone?: boolean;
  zoom?: boolean;
  frame?: boolean;
  soft?: boolean;
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
        className={`h-full w-full object-cover ${
          soft ? "grayscale-[0.55]" : "grayscale"
        } contrast-[1.1] transition duration-700 ease-out group-hover:grayscale-0 ${
          zoom
            ? "group-hover:scale-110 group-active:scale-110 group-focus-within:scale-110"
            : ""
        }`}
      />
      <div
        className="pointer-events-none absolute inset-0 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-70"
        style={{ background: `rgba(18,41,90,${tone})` }}
      />
      {halftone && (
        <div
          className="pointer-events-none absolute inset-0 opacity-30 mix-blend-multiply"
          style={{ backgroundImage: halftoneDark, backgroundSize: "6px 6px" }}
        />
      )}
      {frame && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 z-10 scale-90 border-2 border-white/90 opacity-0 transition duration-500 ease-out group-hover:scale-100 group-hover:opacity-100 group-active:scale-100 group-active:opacity-100 group-focus-within:scale-100 group-focus-within:opacity-100"
        />
      )}
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
                className="hw-char inline-block will-change-transform"
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
            <span className="hw-word inline-block will-change-transform">
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

const PHONE_DISPLAY = "0706833644";
const PHONE_TEL = "tel:0706833644";
const EMAIL = "support@qdeskai.com";

/** WhatsApp number in international format, digits only (no +). */
const WA_NUMBER = "947706833644";

const waLink = (message: string) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;

const WA_GENERAL = waLink(
  "Hello BillPOS, I'd like to request a quotation for POS hardware."
);

const IMG_TEAM =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=85";
const IMG_HERO_POS =
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1400&q=85";
const IMG_HERO_PRINTER =
  "https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&w=800&q=85";
const IMG_STORY =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=85";
const IMG_STORY_ARCH =
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=85";

/* ------------------------------------------------------------------ */
/* Equipment images — put your photos in /public/hardware/            */
/* ------------------------------------------------------------------ */

const IMG = {
  thermalPrinter: "/hardware/thermal-printer.jpg",
  scanner2d: "/hardware/2d-scanner.jpg",
  scanner3d: "/hardware/3d-scanner.jpg",
  cashDrawer: "/hardware/cash-drawer.jpg",
  cpu: "/hardware/cpu.jpg",
  cpuI3: "/hardware/i3-cpu.jpg",
  monitor: "/hardware/monitor.jpg",
  singleScreen: "/hardware/single-screen.jpg",
  dualScreen: "/hardware/dual-screen.jpg",
  keyboard: "/hardware/keyboard.jpg",
  mouse: "/hardware/mouse.jpg",
};

/* ------------------------------------------------------------------ */
/* Section data                                                       */
/* ------------------------------------------------------------------ */

const stats = [
  { value: "11", label: "Equipment types", bg: "bg-[#dfe4eb] text-[#0a1b3d]", sub: "text-[#0a1b3d]/65", tilt: "-1deg" },
  { value: "100%", label: "Genuine stock", bg: "bg-[#0a1b3d] text-white", sub: "text-white/70", tilt: "0.8deg" },
  { value: "1Y", label: "Standard warranty", bg: "bg-[#cfe5f6] text-[#0a1b3d]", sub: "text-[#0a1b3d]/65", tilt: "-0.6deg" },
];

const highlights = [
  "Genuine stock with warranty",
  "Island-wide delivery & on-site installation",
  "Quick quotations straight on WhatsApp",
];

const quoteSteps = [
  { n: "1", title: "Pick your items", body: "Browse the equipment below." },
  { n: "2", title: "Tap Request quotation", body: "WhatsApp opens with the item filled in." },
  { n: "3", title: "Get your quote", body: "We reply with an exact quotation." },
];

type Variant = "white" | "sky" | "navy" | "gray";
type CardStyle = "standard" | "overlay" | "wide";

const variantStyles: Record<Variant, { card: string; icon: string; sub: string; imageTone: number }> = {
  white: { card: "bg-white text-[#0a1b3d]", icon: "bg-[#cfe5f6] text-[#0a1b3d]", sub: "text-[#0a1b3d]/80", imageTone: 0.25 },
  sky: { card: "bg-[#cfe5f6] text-[#0a1b3d]", icon: "bg-white text-[#0a1b3d]", sub: "text-[#0a1b3d]/80", imageTone: 0.2 },
  navy: { card: "bg-[#0a1b3d] text-white", icon: "bg-[#cfe5f6] text-[#0a1b3d]", sub: "text-white/80", imageTone: 0.4 },
  gray: { card: "bg-[#dfe4eb] text-[#0a1b3d]", icon: "bg-white text-[#0a1b3d]", sub: "text-[#0a1b3d]/80", imageTone: 0.3 },
};

type Equipment = {
  Icon: any;
  tag: string;
  title: string;
  description: string;
  variant: Variant;
  tilt: string;
  image: string;
  cardStyle: CardStyle;
};

const categories: { group: string; items: Equipment[] }[] = [
  {
    group: "Printing & Scanning",
    items: [
      {
        Icon: Printer,
        tag: "Printer",
        title: "Thermal Printer",
        description:
          "Fast, ink-free receipt printing for your counter. Prints crisp bills in seconds.",
        variant: "navy",
        tilt: "0deg",
        image: IMG.thermalPrinter,
        cardStyle: "standard",
      },
      {
        Icon: Scan,
        tag: "Scanner",
        title: "2D Scanner",
        description:
          "Reads barcodes and QR codes, even from phone screens or damaged labels.",
        variant: "white",
        tilt: "0deg",
        image: IMG.scanner2d,
        cardStyle: "overlay",
      },
      {
        Icon: Scan,
        tag: "Scanner",
        title: "3D Scanner",
        description:
          "Quick, accurate scanning for high-volume checkout and stock handling.",
        variant: "sky",
        tilt: "0deg",
        image: IMG.scanner3d,
        cardStyle: "standard",
      },
    ],
  },
  {
    group: "CPU's",
    items: [
      {
        Icon: Cpu,
        tag: "CPU",
        title: "CPU",
        description:
          "Reliable desktop unit built to run BillPOS smoothly all day at the counter.",
        variant: "navy",
        tilt: "0deg",
        image: IMG.cpu,
        cardStyle: "wide",
      },
      {
        Icon: Cpu,
        tag: "CPU",
        title: "i3 CPU",
        description:
          "Intel Core i3 desktop — fast and dependable for everyday billing and inventory.",
        variant: "white",
        tilt: "0deg",
        image: IMG.cpuI3,
        cardStyle: "standard",
      },
    ],
  },
  {
    group: "Displays",
    items: [
      {
        Icon: Monitor,
        tag: "Display",
        title: "Monitor",
        description:
          "Clear, bright screen for billing, reports and day-to-day management.",
        variant: "sky",
        tilt: "0deg",
        image: IMG.monitor,
        cardStyle: "standard",
      },
      {
        Icon: Monitor,
        tag: "Display",
        title: "Single Screen",
        description:
          "Simple one-screen setup for the cashier — compact and easy to operate.",
        variant: "gray",
        tilt: "0deg",
        image: IMG.singleScreen,
        cardStyle: "overlay",
      },
      {
        Icon: Monitor,
        tag: "Display",
        title: "Dual Screen",
        description:
          "Cashier screen plus a customer-facing display so shoppers see every item and total.",
        variant: "white",
        tilt: "0deg",
        image: IMG.dualScreen,
        cardStyle: "standard",
      },
    ],
  },
  {
    group: "Counter Essentials",
    items: [
      {
        Icon: WalletCards,
        tag: "Drawer",
        title: "Cash Drawer",
        description:
          "Secure, lockable drawer that pops open automatically when a bill is printed.",
        variant: "navy",
        tilt: "0deg",
        image: IMG.cashDrawer,
        cardStyle: "overlay",
      },
      {
        Icon: Keyboard,
        tag: "Input",
        title: "Keyboard",
        description:
          "Durable keyboard for fast entry of items, codes and customer details.",
        variant: "white",
        tilt: "0deg",
        image: IMG.keyboard,
        cardStyle: "standard",
      },
      {
        Icon: Mouse,
        tag: "Input",
        title: "Mouse",
        description:
          "Smooth, responsive mouse for easy navigation across the BillPOS screens.",
        variant: "sky",
        tilt: "0deg",
        image: IMG.mouse,
        cardStyle: "standard",
      },
    ],
  },
];

const allTitles = categories.flatMap((c) => c.items.map((i) => i.title));

const reasons: { Icon: any; eyebrow: string; title: string; body: string }[] = [
  {
    Icon: ShieldCheck,
    eyebrow: "Genuine hardware",
    title: "Authorised stock only",
    body: "Every computer, printer, and scanner we supply is genuine, sourced through official channels, and backed by warranty — never grey-market imports.",
  },
  {
    Icon: Zap,
    eyebrow: "Plug-and-play",
    title: "Configured before delivery",
    body: "We pre-configure each device to your BillPOS tenant — network settings, printer profiles, barcode formats, and receipt templates — so it works the moment it arrives.",
  },
  {
    Icon: Headphones,
    eyebrow: "Island-wide support",
    title: "On-site installation & repair",
    body: "Our team travels across Sri Lanka for installation, staff training, and hardware service. Remote diagnosis first, on-site when needed.",
  },
  {
    Icon: ShoppingCart,
    eyebrow: "Flexible procurement",
    title: "Buy, lease, or bundle",
    body: "Purchase outright, add hardware to your software subscription as a monthly bundle, or lease for seasonal cash-flow — your choice.",
  },
  {
    Icon: CreditCard,
    eyebrow: "Payment ready",
    title: "Card terminal integration",
    body: "We integrate Sri Lankan card payment terminals and PIN pads directly into your BillPOS checkout flow — no double entry.",
  },
];

const stack: { group: string; items: string[]; variant: Variant; tilt: string; wide?: boolean }[] = [
  {
    group: "Computers",
    items: ["CPU", "i3 CPU", "Desktop POS"],
    variant: "white",
    tilt: "-0.8deg",
  },
  {
    group: "Displays",
    items: ["Monitor", "Single screen", "Dual screen"],
    variant: "sky",
    tilt: "0.8deg",
  },
  {
    group: "Printing & scanning",
    items: ["Thermal printer", "2D scanner", "3D scanner"],
    variant: "gray",
    tilt: "0.6deg",
  },
  {
    group: "Counter accessories",
    items: ["Cash drawer", "Keyboard", "Mouse"],
    variant: "white",
    tilt: "-0.6deg",
  },
  {
    group: "Consumables",
    items: [
      "58mm paper rolls", "80mm paper rolls", "Barcode labels",
      "Ribbons", "Cleaning kits", "RJ-11 cables", "Paper cores",
      "Label cartridges", "Receipt paper", "Barcode stickers",
      "Thermal ribbons", "POS stands", "Keyboard covers", "Cable ties", "Dust covers",
    ],
    variant: "navy",
    tilt: "-0.4deg",
    wide: true,
  },
];

const faqs = [
  {
    q: "How do I get a price for the hardware?",
    a: "Tap “Request quotation” on any item and it opens a WhatsApp chat with us, with the item already filled in. Tell us the quantity and your business type and we'll reply with an exact quotation.",
  },
  {
    q: "Do you offer installation and setup?",
    a: "Yes. Remote configuration — network, printer profile, receipt template — is always included. On-site installation is available as an add-on or bundled depending on the package you choose.",
  },
  {
    q: "Which setup is best for a small retail shop?",
    a: "Most single-outlet shops do well with a CPU, a single screen, a thermal printer, a scanner and a cash drawer. If you want customers to see their bill as it's built, add a dual screen. Message us and we'll suggest the right mix.",
  },
  {
    q: "Do you offer warranty and after-sales service?",
    a: "Yes. Every device ships with a warranty, and our team handles claims directly so you don't have to chase suppliers. Extended warranty and annual maintenance contracts are available on request.",
  },
  {
    q: "Can I use my existing scanner and printer with BillPOS?",
    a: "In most cases yes. BillPOS supports USB barcode scanners, thermal receipt printers, and RJ-11 cash drawers. Share your existing hardware list with us and we'll confirm compatibility before you commit to anything.",
  },
  {
    q: "Do you deliver island-wide?",
    a: "Yes — we deliver across Sri Lanka. Colombo and Kandy usually receive same-day or next-day delivery. Other districts typically take 2–3 working days. On-site installation is available in most major towns; remote setup works everywhere.",
  },
];

/* ------------------------------------------------------------------ */
/* Card renderers (3 distinct layouts)                                */
/* ------------------------------------------------------------------ */

type CardProps = {
  item: Equipment;
  expanded: boolean;
  onToggle: () => void;
};

/** Maximise / minimise button — mobile only. */
function ExpandToggle({
  expanded,
  onToggle,
  title,
  tone,
}: {
  expanded: boolean;
  onToggle: () => void;
  title: string;
  tone: "dark" | "light" | "inverted";
}) {
  const cls =
    tone === "dark"
      ? "border-white/35 text-white hover:bg-white/10"
      : tone === "inverted"
        ? "border-white/50 bg-white/15 text-white backdrop-blur hover:bg-white/25"
        : "border-[#0a1b3d]/30 text-[#0a1b3d] hover:bg-[#0a1b3d]/5";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={expanded}
      aria-label={`${expanded ? "Minimise" : "Maximise"} ${title}`}
      title={expanded ? "Minimise" : "Maximise"}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-2 sm:hidden ${cls}`}
    >
      {expanded ? (
        <Minimize2 className="h-4 w-4" />
      ) : (
        <Maximize2 className="h-4 w-4" />
      )}
    </button>
  );
}

function QuoteButton({
  title,
  dark,
  inverted,
}: {
  title: string;
  dark?: boolean;
  inverted?: boolean;
}) {
  const cls = inverted
    ? "bg-white text-[#0a1b3d] hover:bg-[#cfe5f6]"
    : dark
      ? "bg-[#cfe5f6] text-[#0a1b3d] hover:bg-white"
      : "bg-[#0a1b3d] text-white hover:bg-[#12306a]";
  return (
    <a
      href={waLink(`Hello BillPOS, I'd like to request a quotation for: ${title}`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Request a quotation for ${title} on WhatsApp`}
      className={`group/btn inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-[14px] font-normal transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-2 ${cls}`}
    >
      <MessageCircle className="h-4 w-4" />
      Request quotation
      <ArrowUpRight
        size={15}
        strokeWidth={1.9}
        className="transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
      />
    </a>
  );
}

/* ── STANDARD — image top, content below, quote button ─────────────── */
function StandardCard({ item, expanded, onToggle }: CardProps) {
  const v = variantStyles[item.variant];
  const dark = item.variant === "navy";
  const { Icon, tag, title, description, image } = item;

  const imgAspect = expanded ? "aspect-[4/3]" : "aspect-[16/9] sm:aspect-[4/3]";
  const descClamp = expanded ? "" : "line-clamp-2 sm:line-clamp-none";

  return (
    <article className="hw-card group relative">
      <div
        className={`relative flex h-full flex-col overflow-hidden shadow-[0_30px_50px_-30px_rgba(10,27,61,0.55)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_40px_60px_-30px_rgba(10,27,61,0.7)] ${v.card}`}
        style={{ transform: `rotate(${item.tilt})` }}
      >
        {/* Image */}
        <div className={`relative ${imgAspect} w-full overflow-hidden`}>
          <Photo
            src={image}
            alt={title}
            tone={v.imageTone}
            halftone={false}
            zoom
            frame
            soft
            className="absolute inset-0 h-full w-full"
          />
          <Tape className="-top-3 right-6 h-5 w-14 rotate-3" />
          <span className="absolute left-3 top-3 z-20 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0a1b3d] shadow-sm">
            {tag}
          </span>
        </div>

        {/* Body */}
        <div className="relative flex flex-1 flex-col p-6 sm:p-7">
          <div className="relative flex items-start gap-3">
            <span
              className={`hw-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${v.icon}`}
            >
              <Icon className="h-[18px] w-[18px]" />
            </span>
            <h4
              className={`${serif.className} flex-1 text-[25px] font-medium leading-[1.1]`}
            >
              {title}
            </h4>
            <ExpandToggle
              expanded={expanded}
              onToggle={onToggle}
              title={title}
              tone={dark ? "dark" : "light"}
            />
          </div>

          <p
            className={`relative mt-4 text-[15px] font-light leading-[1.7] ${v.sub} ${descClamp}`}
          >
            {description}
          </p>

          <div
            className={`relative mt-auto border-t pt-5 ${
              dark ? "border-white/20" : "border-[#0a1b3d]/15"
            }`}
          >
            <div className="mt-0">
              <QuoteButton title={title} dark={dark} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ── OVERLAY — full-bleed image with dark gradient, text on top ───── */
function OverlayCard({ item, expanded, onToggle }: CardProps) {
  const v = variantStyles[item.variant];
  const { Icon, tag, title, description, image } = item;

  const minH = expanded ? "min-h-[440px]" : "min-h-[300px]";
  const descClamp = expanded ? "" : "line-clamp-2 sm:line-clamp-none";

  return (
    <article className="hw-card group relative">
      <div
        className={`relative flex h-full ${minH} flex-col overflow-hidden shadow-[0_30px_50px_-30px_rgba(10,27,61,0.6)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_40px_60px_-30px_rgba(10,27,61,0.8)] sm:min-h-[460px]`}
      >
        {/* Full-bleed image */}
        <Photo
          src={image}
          alt={title}
          tone={0.5}
          halftone={false}
          zoom
          frame
          soft
          className="absolute inset-0 h-full w-full"
        />
        {/* Extra gradient for readability */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a1b3d] via-[#0a1b3d]/65 to-transparent" />

        <Tape className="-top-3 right-6 z-20 h-5 w-14 rotate-3" />

        {/* Top row */}
        <div className="relative z-20 flex items-center justify-between gap-3 p-6">
          <span
            className={`hw-icon flex h-11 w-11 items-center justify-center rounded-full ${v.icon}`}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur">
              {tag}
            </span>
            <ExpandToggle
              expanded={expanded}
              onToggle={onToggle}
              title={title}
              tone="inverted"
            />
          </div>
        </div>

        {/* Bottom content */}
        <div className="relative z-20 mt-auto p-6 text-white sm:p-7">
          <h4
            className={`${serif.className} text-[29px] font-medium leading-[1.08] sm:text-[31px]`}
          >
            {title}
          </h4>

          <p
            className={`mt-3 text-[15px] font-light leading-[1.7] text-white/90 ${descClamp}`}
          >
            {description}
          </p>

          <div className="mt-5 border-t border-white/25 pt-5">
            <QuoteButton title={title} inverted />
          </div>
        </div>
      </div>
    </article>
  );
}

/* ── WIDE — spans 2 cols, image on left half, content on right ────── */
function WideCard({ item, expanded, onToggle }: CardProps) {
  const v = variantStyles[item.variant];
  const dark = item.variant === "navy";
  const { Icon, tag, title, description, image } = item;

  const imgAspect = expanded ? "aspect-[4/3]" : "aspect-[16/9]";
  const descClamp = expanded ? "" : "line-clamp-2 sm:line-clamp-none";

  return (
    <article className="hw-card group relative lg:col-span-2">
      <div
        className={`relative grid h-full overflow-hidden shadow-[0_30px_50px_-30px_rgba(10,27,61,0.55)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_40px_60px_-30px_rgba(10,27,61,0.7)] sm:grid-cols-2 ${v.card}`}
        style={{ transform: `rotate(${item.tilt})` }}
      >
        {/* Left — image */}
        <div
          className={`relative ${imgAspect} w-full overflow-hidden sm:aspect-auto sm:h-full sm:min-h-[380px]`}
        >
          <Photo
            src={image}
            alt={title}
            tone={v.imageTone}
            halftone={false}
            zoom
            frame
            soft
            className="absolute inset-0 h-full w-full"
          />
          <Tape className="-top-3 left-6 z-20 h-5 w-14 -rotate-3" />
          <span className="absolute left-3 top-3 z-20 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0a1b3d] shadow-sm">
            Featured
          </span>
        </div>

        {/* Right — content */}
        <div className="relative flex flex-col p-6 sm:p-8 lg:p-10">
          <div className="relative flex items-center gap-3">
            <span
              className={`hw-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${v.icon}`}
            >
              <Icon className="h-5 w-5" />
            </span>
            <span
              className={`flex-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${
                dark ? "text-[#cfe5f6]/90" : "text-[#0a1b3d]/65"
              }`}
            >
              {tag}
            </span>
            <ExpandToggle
              expanded={expanded}
              onToggle={onToggle}
              title={title}
              tone={dark ? "dark" : "light"}
            />
          </div>

          <h4
            className={`${serif.className} relative mt-5 text-[31px] font-medium leading-[1.06] sm:text-[36px]`}
          >
            {title}
          </h4>

          <p
            className={`relative mt-3 text-[15px] font-light leading-[1.7] sm:text-[15.5px] ${v.sub} ${descClamp}`}
          >
            {description}
          </p>

          <div
            className={`relative mt-auto border-t pt-5 ${
              dark ? "border-white/20" : "border-[#0a1b3d]/15"
            }`}
          >
            <div className="mt-6 sm:mt-8">
              <QuoteButton title={title} dark={dark} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ── Dispatcher ────────────────────────────────────────────────────── */
function EquipmentCard(props: CardProps) {
  switch (props.item.cardStyle) {
    case "overlay":
      return <OverlayCard {...props} />;
    case "wide":
      return <WideCard {...props} />;
    case "standard":
    default:
      return <StandardCard {...props} />;
  }
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export default function Hardware() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  /** Mobile maximise / minimise state, keyed by item title. */
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const allExpanded = allTitles.every((t) => expanded[t]);

  const toggleOne = (title: string) =>
    setExpanded((prev) => ({ ...prev, [title]: !prev[title] }));

  const toggleAll = () =>
    setExpanded(
      allExpanded
        ? {}
        : Object.fromEntries(allTitles.map((t) => [t, true]))
    );

  useResetScrollOnMount(sectionRef);

  /* Card heights change on expand / collapse — keep scroll triggers accurate. */
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [expanded]);

  /* ---------------- Animations ---------------- */

  useIsoLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root || reduceMotion()) return;

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      /* 1 ─ HERO */
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.querySelector(".hw-hero"),
            start: "top 85%",
            once: true,
          },
        })
        .fromTo(
          ".hw-tag",
          { scale: 2.4, opacity: 0, rotation: 14 },
          { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: "back.out(2.2)" }
        )
        .fromTo(
          ".hw-hero .hw-char",
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
          ".hw-hero .hw-char",
          { opacity: 0 },
          { opacity: 1, duration: 0.25, ease: "none", stagger: { each: 0.035 } },
          "<"
        )
        .fromTo(
          ".hw-hero .hw-word",
          { yPercent: 115, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.75,
            ease: "power3.out",
            stagger: 0.03,
          },
          "-=0.55"
        )
        .fromTo(
          ".hw-hero-cta",
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", stagger: 0.1 },
          "-=0.35"
        )
        .fromTo(
          ".hw-hero-photo",
          { y: 60, opacity: 0, rotation: 14, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            rotation: 4,
            scale: 1,
            duration: 1,
            ease: "back.out(1.6)",
          },
          "-=0.65"
        )
        .fromTo(
          ".hw-hero-arch",
          { scale: 0.85, opacity: 0, y: 40 },
          { scale: 1, opacity: 1, y: 0, duration: 0.9, ease: "back.out(1.5)" },
          "-=0.7"
        )
        .fromTo(
          ".hw-hero-sticker",
          { scale: 0, rotation: -45 },
          { scale: 1, rotation: 6, duration: 0.9, ease: "elastic.out(1, 0.45)" },
          "-=0.55"
        )
        .fromTo(
          ".hw-hero-blob",
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1, ease: "power3.out" },
          "-=1"
        );

      /* 2 ─ STATS */
      gsap.fromTo(
        ".hw-stat",
        {
          y: 90,
          opacity: 0,
          rotation: (i: number) => [-7, 6, -5][i % 3],
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
          stagger: 0.14,
          scrollTrigger: {
            trigger: root.querySelector(".hw-stats"),
            start: "top 88%",
            once: true,
          },
        }
      );
      gsap.fromTo(
        ".hw-stat .hw-stat-num",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.14,
          delay: 0.3,
          scrollTrigger: {
            trigger: root.querySelector(".hw-stats"),
            start: "top 88%",
            once: true,
          },
        }
      );
      gsap.fromTo(
        ".hw-stat .hw-stat-label",
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.14,
          delay: 0.42,
          scrollTrigger: {
            trigger: root.querySelector(".hw-stats"),
            start: "top 88%",
            once: true,
          },
        }
      );

      /* 3 ─ STORY */
      gsap.fromTo(
        ".hw-story-photo-main",
        { y: 60, opacity: 0, rotation: -3, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          rotation: 0,
          scale: 1,
          duration: 1,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: root.querySelector(".hw-story"),
            start: "top 82%",
            once: true,
          },
        }
      );
      gsap.fromTo(
        ".hw-story-photo-arch",
        { scale: 0.85, opacity: 0, rotation: 10 },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.9,
          ease: "back.out(1.6)",
          delay: 0.3,
          scrollTrigger: {
            trigger: root.querySelector(".hw-story"),
            start: "top 82%",
            once: true,
          },
        }
      );
      gsap.fromTo(
        ".hw-story-square",
        { scale: 0, rotation: -30, opacity: 0 },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.8,
          ease: "back.out(2)",
          delay: 0.15,
          scrollTrigger: {
            trigger: root.querySelector(".hw-story"),
            start: "top 82%",
            once: true,
          },
        }
      );
      gsap.fromTo(
        ".hw-story-copy > *",
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.11,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.querySelector(".hw-story"),
            start: "top 82%",
            once: true,
          },
        }
      );
      gsap.fromTo(
        ".hw-story-highlight",
        { x: -22, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.35,
          scrollTrigger: {
            trigger: root.querySelector(".hw-story"),
            start: "top 82%",
            once: true,
          },
        }
      );

      /* 4 ─ EQUIPMENT HEADER */
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.querySelector(".hw-equip-head"),
            start: "top 88%",
            once: true,
          },
        })
        .fromTo(
          ".hw-equip-tag",
          { scale: 2.2, opacity: 0, rotation: 12 },
          { scale: 1, opacity: 1, rotation: 0, duration: 0.55, ease: "back.out(2.2)" }
        )
        .fromTo(
          ".hw-equip-head .hw-word",
          { yPercent: 115, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.75,
            ease: "power3.out",
            stagger: 0.06,
          },
          "-=0.25"
        );

      /* 4b — Equipment card entrance, one category at a time. */
      const catBlocks = gsap.utils.toArray<HTMLElement>(".hw-cat", root);
      catBlocks.forEach((block) => {
        const cards = block.querySelectorAll(".hw-card");
        gsap.fromTo(
          cards,
          {
            y: 100,
            opacity: 0,
            rotation: (i: number) => [-6, 4, -3, 5, -4, 3][i % 6],
            scale: 0.94,
            transformOrigin: "50% 100%",
          },
          {
            y: 0,
            opacity: 1,
            rotation: 0,
            scale: 1,
            duration: 0.9,
            ease: "back.out(1.6)",
            stagger: 0.09,
            scrollTrigger: {
              trigger: block,
              start: "top 88%",
              once: true,
            },
          }
        );
        gsap.fromTo(
          block.querySelectorAll(".hw-card .hw-icon"),
          { scale: 0, rotation: -30, transformOrigin: "50% 50%" },
          {
            scale: 1,
            rotation: 0,
            duration: 0.5,
            ease: "back.out(3)",
            stagger: 0.09,
            delay: 0.35,
            scrollTrigger: {
              trigger: block,
              start: "top 88%",
              once: true,
            },
          }
        );
      });

      /* 5 ─ WHY CHOOSE (navy) */
      gsap.fromTo(
        ".hw-why-head > *",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.11,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.querySelector(".hw-why"),
            start: "top 85%",
            once: true,
          },
        }
      );
      gsap.fromTo(
        ".hw-why-photo",
        { y: 50, opacity: 0, rotation: 12, scale: 0.92 },
        {
          y: 0,
          opacity: 1,
          rotation: 0,
          scale: 1,
          duration: 0.95,
          ease: "back.out(1.5)",
          delay: 0.3,
          scrollTrigger: {
            trigger: root.querySelector(".hw-why"),
            start: "top 85%",
            once: true,
          },
        }
      );
      gsap.fromTo(
        ".hw-why-sticker",
        { scale: 0, rotation: -45 },
        {
          scale: 1,
          rotation: -6,
          duration: 0.9,
          ease: "elastic.out(1, 0.45)",
          delay: 0.45,
          scrollTrigger: {
            trigger: root.querySelector(".hw-why"),
            start: "top 85%",
            once: true,
          },
        }
      );
      gsap.fromTo(
        ".hw-reason",
        { x: 30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: root.querySelector(".hw-reasons"),
            start: "top 88%",
            once: true,
          },
        }
      );
      gsap.fromTo(
        ".hw-reason-icon",
        { scale: 0, rotation: -30, transformOrigin: "50% 50%" },
        {
          scale: 1,
          rotation: 0,
          duration: 0.5,
          ease: "back.out(2.8)",
          stagger: 0.1,
          delay: 0.15,
          scrollTrigger: {
            trigger: root.querySelector(".hw-reasons"),
            start: "top 88%",
            once: true,
          },
        }
      );

      /* 6 ─ STACK */
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.querySelector(".hw-stack-head"),
            start: "top 88%",
            once: true,
          },
        })
        .fromTo(
          ".hw-stack-head .hw-word",
          { yPercent: 115, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.75,
            ease: "power3.out",
            stagger: 0.06,
          }
        );

      gsap.fromTo(
        ".hw-stack",
        {
          y: 80,
          opacity: 0,
          rotation: (i: number) => [-5, 5, -4, 4, -3][i % 5],
          scale: 0.94,
          transformOrigin: "50% 100%",
        },
        {
          y: 0,
          opacity: 1,
          rotation: 0,
          scale: 1,
          duration: 0.85,
          ease: "back.out(1.6)",
          stagger: 0.12,
          scrollTrigger: {
            trigger: root.querySelector(".hw-stack-grid"),
            start: "top 88%",
            once: true,
          },
        }
      );
      gsap.fromTo(
        ".hw-stack-pill",
        { y: 14, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.02,
          delay: 0.35,
          scrollTrigger: {
            trigger: root.querySelector(".hw-stack-grid"),
            start: "top 88%",
            once: true,
          },
        }
      );

      /* 7 ─ FAQ */
      gsap.fromTo(
        ".hw-faq-head > *",
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.11,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.querySelector(".hw-faq"),
            start: "top 88%",
            once: true,
          },
        }
      );
      gsap.fromTo(
        ".hw-faq-row",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: root.querySelector(".hw-faq-list"),
            start: "top 88%",
            once: true,
          },
        }
      );

      /* 8 ─ CTA */
      gsap.fromTo(
        ".hw-cta-sheet",
        { opacity: 0, x: -20, y: -20 },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.querySelector(".hw-cta"),
            start: "top 88%",
            once: true,
          },
        }
      );
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.querySelector(".hw-cta"),
            start: "top 88%",
            once: true,
          },
        })
        .fromTo(
          ".hw-cta-panel",
          { y: 60, opacity: 0, scale: 0.96, transformOrigin: "50% 100%" },
          { y: 0, opacity: 1, scale: 1, duration: 0.95, ease: "back.out(1.5)" }
        )
        .fromTo(
          ".hw-cta-tape",
          { scale: 0, rotation: 0 },
          { scale: 1, rotation: 0, duration: 0.5, stagger: 0.1, ease: "back.out(2)" },
          "-=0.4"
        )
        .fromTo(
          ".hw-cta-head",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
          "-=0.35"
        )
        .fromTo(
          ".hw-cta-btn",
          { scale: 0.85, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.7,
            ease: "elastic.out(1, 0.5)",
            stagger: 0.08,
          },
          "-=0.4"
        );

      /* 9 ─ PARALLAX */
      gsap.utils.toArray<HTMLElement>(".hw-parallax", root).forEach((el) => {
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

  /* ---------------------------------------------------------------- */
  /* Render                                                            */
  /* ---------------------------------------------------------------- */

  return (
    <section
      ref={sectionRef}
      id="hardware"
      className={`${sans.className} relative w-full overflow-hidden bg-[#f1f4f8] py-16 text-[#0a1b3d] sm:py-24 lg:py-28`}
    >
      <Grain opacity={0.14} />

      {/* Collage backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="hw-parallax absolute -left-28 top-20" data-depth="90">
          <div className="h-56 w-56 rounded-full bg-[#dfe4eb] sm:h-80 sm:w-80" />
        </div>
        <div
          className="hw-parallax absolute -right-16 top-[900px] hidden lg:block"
          data-depth="140"
        >
          <div className="h-72 w-48 rotate-[8deg] bg-[#cfe5f6]/70" />
        </div>
        <div
          className="hw-parallax absolute left-[4%] top-[1500px] hidden lg:block"
          data-depth="60"
        >
          <div
            className="h-40 w-40 opacity-40"
            style={{ backgroundImage: halftoneDark, backgroundSize: "9px 9px" }}
          />
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">

        {/* HERO */}
        <div className="hw-hero grid items-center gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
          <div>
            <div className="hw-tag mb-5 sm:mb-6">
              <span
                className={`${serif.className} relative inline-block -rotate-2 bg-[#dfe4eb] px-5 py-1.5 text-[16px] italic sm:text-[17px]`}
                style={{ clipPath: torn }}
              >
                POS Hardware
              </span>
            </div>

            <h1
              onMouseOver={hopLetter}
              className={`${serif.className} text-[48px] font-light leading-[0.98] tracking-[-0.02em] sm:text-[80px] lg:text-[104px]`}
            >
              <span className="sr-only">Everything you need to sell.</span>
              <span aria-hidden="true">
                <SplitChars text="Everything you" />
                <br />
                <span className="font-normal italic text-[#6b7686]">
                  <SplitChars text="need to sell." />
                </span>
              </span>
            </h1>

            <p className="mt-6 max-w-[560px] text-[15px] font-light leading-7 text-[#0a1b3d]/75 sm:mt-7 sm:text-[16px]">
              <span className="sr-only">
                Computers, screens, thermal printers, scanners, cash drawers,
                keyboards and mice — configured and delivered ready to run
                BillPOS.
              </span>
              <span aria-hidden="true">
                <SplitWords text="Computers, screens, thermal printers, scanners, cash drawers, keyboards and mice — configured and delivered ready to run BillPOS." />
              </span>
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#equipment"
                className="hw-hero-cta group/btn inline-flex items-center gap-2 rounded-full bg-[#0a1b3d] px-6 py-3.5 text-[14px] font-normal text-white transition hover:bg-[#12306a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-2"
              >
                Browse equipment
                <ArrowRight className="h-4 w-4 transition group-hover/btn:translate-x-0.5" />
              </a>
              <a
                href={WA_GENERAL}
                target="_blank"
                rel="noopener noreferrer"
                className="hw-hero-cta group/btn inline-flex items-center gap-2 rounded-full border border-[#0a1b3d]/30 bg-white px-6 py-3.5 text-[14px] font-normal transition hover:border-[#0a1b3d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-2"
              >
                <MessageCircle className="h-4 w-4" />
                Request a quotation
                <ArrowUpRight className="h-4 w-4 transition group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
              </a>
            </div>
          </div>

          {/* hero collage */}
          <div className="group relative mx-auto h-[340px] w-full max-w-[380px] sm:h-[420px] sm:max-w-[430px]">
            <div className="hw-hero-blob absolute right-0 top-4 h-36 w-36 rounded-full bg-[#0a1b3d] sm:h-52 sm:w-52" />
            <div
              className="absolute -left-2 bottom-2 h-28 w-36 opacity-60 sm:h-36 sm:w-44"
              style={{ backgroundImage: halftoneDark, backgroundSize: "8px 8px" }}
            />
            <div className="hw-hero-photo absolute left-2 top-0 w-[210px] rotate-[4deg] bg-white p-2.5 pb-10 shadow-[0_30px_50px_-25px_rgba(10,27,61,0.55)] sm:left-6 sm:w-[270px] sm:p-3 sm:pb-12">
              <Tape className="-top-3 left-1/2 -translate-x-1/2 -rotate-3" />
              <Photo
                src={IMG_HERO_POS}
                alt="A POS terminal on a retail counter"
                className="aspect-[4/5] w-full"
                tone={0.35}
              />
              <p
                className={`${serif.className} absolute bottom-2.5 left-3.5 text-[17px] italic sm:bottom-3 sm:left-4 sm:text-[20px]`}
              >
                Hardware that just works
              </p>
            </div>
            <Photo
              src={IMG_HERO_PRINTER}
              alt=""
              tone={0.35}
              className="hw-hero-arch absolute bottom-0 right-0 z-10 h-[170px] w-[112px] rounded-t-full border-[5px] border-white shadow-[0_25px_40px_-20px_rgba(0,0,0,0.6)] sm:h-[220px] sm:w-[150px] sm:border-[6px]"
            />
            <div className="hw-hero-sticker absolute right-1 top-0 z-10 flex h-20 w-20 rotate-6 items-center justify-center bg-[#cfe5f6] p-2 text-center shadow-lg sm:right-3 sm:h-24 sm:w-24">
              <p className={`${serif.className} text-[15px] italic leading-tight sm:text-[17px]`}>
                Genuine
                <br />
                stock
              </p>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="hw-stats mt-20 grid gap-6 sm:mt-24 sm:grid-cols-3 sm:gap-5">
          {stats.map((s) => (
            <div
              key={s.label}
              className={`hw-stat relative px-6 pb-9 pt-7 shadow-[0_30px_50px_-35px_rgba(10,27,61,0.5)] sm:px-7 ${s.bg}`}
              style={{ clipPath: torn, transform: `rotate(${s.tilt})` }}
            >
              <Grain opacity={0.1} />
              <p
                className={`${serif.className} hw-stat-num relative text-[64px] font-light leading-none sm:text-[76px]`}
              >
                {s.value}
              </p>
              <p
                className={`${serif.className} hw-stat-label relative mt-2 text-[22px] italic ${s.sub}`}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* STORY */}
        <div className="hw-story mt-24 grid items-center gap-12 sm:mt-32 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div className="group relative mx-auto h-[360px] w-full max-w-[560px] sm:h-[480px]">
            <div
              className="hw-story-square absolute -left-3 -top-3 h-28 w-28 bg-[#cfe5f6] sm:-left-4 sm:-top-4 sm:h-40 sm:w-40"
              aria-hidden="true"
            />
            <div
              className="absolute bottom-10 left-8 h-28 w-32 opacity-50 sm:h-32 sm:w-40"
              style={{ backgroundImage: halftoneDark, backgroundSize: "8px 8px" }}
              aria-hidden="true"
            />
            <Tape className="-top-3 left-1/2 -translate-x-1/2 rotate-2" />
            <Photo
              src={IMG_STORY}
              alt="A shop counter set up with POS hardware"
              tone={0.28}
              className="hw-story-photo-main absolute bottom-12 left-0 right-6 top-0 shadow-[0_30px_60px_-30px_rgba(10,27,61,0.7)] sm:bottom-14 sm:right-10"
            />
            <Photo
              src={IMG_STORY_ARCH}
              alt=""
              tone={0.35}
              className="hw-story-photo-arch absolute bottom-0 right-0 z-10 h-[110px] w-[110px] rounded-full border-[6px] border-white shadow-xl sm:h-[190px] sm:w-[190px] sm:border-[8px]"
            />
          </div>

          <div className="hw-story-copy">
            <h2
              className={`${serif.className} text-[36px] font-light leading-[1.02] tracking-[-0.015em] sm:text-[52px] lg:text-[60px]`}
            >
              Hardware that pairs
              <span className="block italic text-[#6b7686]">
                perfectly with BillPOS
              </span>
            </h2>

            <p className="mt-6 max-w-[540px] text-[15px] font-light leading-7 text-[#0a1b3d]/80 sm:text-[16px]">
              We&apos;ve tested every device on this page with BillPOS —
              printers, scanners, drawers, screens, and computers that Sri
              Lankan retailers, restaurants, and supermarkets rely on. Pick what
              you need, or let us put together a tailored bundle.
            </p>

            <ul className="mt-7 border-t border-[#0a1b3d]/15">
              {highlights.map((h) => (
                <li
                  key={h}
                  className="hw-story-highlight flex items-center gap-3.5 border-b border-[#0a1b3d]/15 py-4"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0a1b3d] text-white">
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                  <span
                    className={`${serif.className} text-[21px] font-medium leading-tight sm:text-[23px]`}
                  >
                    {h}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href="/contact"
              className="group/btn mt-8 inline-flex items-center gap-2 rounded-full bg-[#0a1b3d] px-6 py-3.5 text-[14px] font-normal text-white transition hover:bg-[#12306a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-2"
            >
              Talk to our team
              <ArrowUpRight className="h-4 w-4 transition group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* EQUIPMENT CATALOGUE */}
        <div id="equipment" className="mt-24 scroll-mt-8 sm:mt-32">
          <div className="hw-equip-head max-w-[760px]">
            <div className="hw-equip-tag mb-5">
              <span
                className={`${serif.className} relative inline-block rotate-1 bg-[#cfe5f6] px-5 py-1.5 text-[16px] italic sm:text-[17px]`}
                style={{ clipPath: torn }}
              >
                What we stock
              </span>
            </div>
            <h2
              className={`${serif.className} text-[38px] font-light leading-[1] tracking-[-0.02em] sm:text-[60px] lg:text-[72px]`}
            >
              <span className="sr-only">Every POS device, ready to run</span>
              <span aria-hidden="true">
                <SplitWords text="Every POS device," />
                <span className="block italic text-[#6b7686]">
                  <SplitWords text="ready to run" />
                </span>
              </span>
            </h2>
          </div>

          {/* How to get a quotation — simple 3 steps */}
          <ol className="mt-10 grid gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-4">
            {quoteSteps.map((s) => (
              <li
                key={s.n}
                className="flex items-start gap-4 rounded-2xl border border-[#0a1b3d]/12 bg-white/70 p-4 sm:p-5"
              >
                <span
                  className={`${serif.className} flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0a1b3d] text-[20px] text-white`}
                >
                  {s.n}
                </span>
                <div>
                  <p className="text-[15px] font-medium leading-snug">{s.title}</p>
                  <p className="mt-0.5 text-[13.5px] font-light leading-6 text-[#0a1b3d]/70">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {/* Quick-jump chips + mobile expand all */}
          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
            <nav
              aria-label="Equipment categories"
              className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
            >
              {categories.map((cat, i) => (
                <a
                  key={cat.group}
                  href={`#cat-${i}`}
                  className="shrink-0 rounded-full border border-[#0a1b3d]/25 bg-white px-4 py-2 text-[13.5px] font-normal transition hover:border-[#0a1b3d] hover:bg-[#0a1b3d] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-2"
                >
                  {cat.group}
                  <span className="ml-1.5 text-[#6b7686]">{cat.items.length}</span>
                </a>
              ))}
            </nav>

            <button
              type="button"
              onClick={toggleAll}
              aria-pressed={allExpanded}
              className="inline-flex items-center justify-center gap-2 self-start rounded-full border border-[#0a1b3d]/30 bg-white px-4 py-2.5 text-[13.5px] font-normal transition hover:border-[#0a1b3d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-2 sm:hidden"
            >
              {allExpanded ? (
                <>
                  <Minimize2 className="h-4 w-4" />
                  Collapse all
                </>
              ) : (
                <>
                  <Maximize2 className="h-4 w-4" />
                  Expand all
                </>
              )}
            </button>
          </div>

          {/* Category blocks */}
          <div className="mt-10 space-y-16 sm:mt-14 sm:space-y-20">
            {categories.map((cat, catIndex) => (
              <div key={cat.group} id={`cat-${catIndex}`} className="hw-cat scroll-mt-8">
                {/* Category header */}
                <div className="mb-7 flex items-center gap-4 sm:mb-8">
                  <span
                    className={`${serif.className} font-mono text-[13px] tracking-[0.28em] text-[#6b7686]`}
                  >
                    {String(catIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="h-px flex-1 bg-[#0a1b3d]/15" />
                  <h3
                    className={`${serif.className} text-[26px] font-medium tracking-[-0.01em] sm:text-[34px]`}
                  >
                    {cat.group}
                  </h3>
                  <span className="rounded-full bg-[#0a1b3d] px-2.5 py-1 text-[11px] font-medium text-white">
                    {cat.items.length} {cat.items.length === 1 ? "item" : "items"}
                  </span>
                </div>

                {/* Equipment grid — auto-flow handles wide cards via lg:col-span-2 */}
                <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
                  {cat.items.map((item) => (
                    <EquipmentCard
                      key={item.title}
                      item={item}
                      expanded={!!expanded[item.title]}
                      onToggle={() => toggleOne(item.title)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Quotation note */}
          <p className="mt-12 max-w-[640px] text-[13.5px] font-light italic leading-6 text-[#6b7686]">
            Product images are representative. Tap “Request quotation” on any
            item to chat with us on WhatsApp — we&apos;ll reply with an exact
            quote tailored to your business.
          </p>
        </div>

        {/* WHY CHOOSE */}
        <div className="hw-why relative mt-24 bg-[#0a1b3d] text-white sm:mt-32">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{ backgroundImage: halftoneLight, backgroundSize: "10px 10px" }}
          />
          <Grain opacity={0.25} />

          <div className="relative grid gap-12 p-5 py-10 sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:p-14">
            <div className="hw-why-head min-w-0">
              <h2
                className={`${serif.className} text-[38px] font-light leading-[1] tracking-[-0.02em] sm:text-[56px] lg:text-[64px]`}
              >
                Why buy from
                <span className="block italic text-[#cfe5f6]">Qdesk AI</span>
              </h2>
              <p className="mt-5 max-w-[360px] text-[15px] font-light leading-7 text-white/80">
                We don&apos;t just sell boxes. We make sure each device works
                with your BillPOS setup from day one — and keeps working as your
                business grows.
              </p>

              <div className="group relative mt-10 h-[280px] w-[250px] max-w-full">
                <Photo
                  src={IMG_TEAM}
                  alt=""
                  tone={0.3}
                  className="hw-why-photo absolute left-0 top-0 h-[240px] w-[170px] rounded-t-full border-[5px] border-white shadow-[0_25px_40px_-20px_rgba(0,0,0,0.7)]"
                />
                <div className="hw-why-sticker absolute bottom-0 right-0 z-10 flex h-24 w-24 -rotate-6 items-center justify-center bg-[#cfe5f6] p-2 text-center text-[#0a1b3d] shadow-lg">
                  <p
                    className={`${serif.className} text-[16px] italic leading-tight`}
                  >
                    Your
                    <br />
                    hardware
                    <br />
                    partner
                  </p>
                </div>
              </div>
            </div>

            <ul className="hw-reasons min-w-0 border-t border-white/20">
              {reasons.map(({ Icon, eyebrow, title, body }) => (
                <li
                  key={title}
                  className="hw-reason flex items-start gap-4 border-b border-white/20 py-5 sm:gap-5"
                >
                  <span className="hw-reason-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#cfe5f6] text-[#0a1b3d] sm:h-12 sm:w-12">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-light text-[#cfe5f6]">
                      {eyebrow}
                    </p>
                    <h3
                      className={`${serif.className} mt-1 text-[26px] font-medium leading-tight sm:text-[30px]`}
                    >
                      {title}
                    </h3>
                    <p className="mt-2 text-[14.5px] font-light leading-7 text-white/80">
                      {body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* STACK */}
        <div className="mt-24 sm:mt-32">
          <div className="hw-stack-head max-w-[760px]">
            <h2
              className={`${serif.className} text-[38px] font-light leading-[1] tracking-[-0.02em] sm:text-[60px] lg:text-[72px]`}
            >
              <span className="sr-only">Equipment categories we cover</span>
              <span aria-hidden="true">
                <SplitWords text="Equipment" />
                <span className="block italic text-[#6b7686]">
                  <SplitWords text="categories we cover" />
                </span>
              </span>
            </h2>
          </div>

          <div className="hw-stack-grid mt-12 grid gap-8 md:grid-cols-2 md:gap-7">
            {stack.map(({ group, items, variant, tilt, wide }) => {
              const v = variantStyles[variant];
              const dark = variant === "navy";
              return (
                <div
                  key={group}
                  className={`hw-stack relative ${wide ? "md:col-span-2" : ""}`}
                >
                  <div
                    className={`relative rotate-[var(--r)] p-6 shadow-[0_30px_50px_-30px_rgba(10,27,61,0.55)] sm:p-7 ${v.card}`}
                    style={{ ["--r" as any]: tilt }}
                  >
                    <Grain opacity={dark ? 0.25 : 0.1} />
                    <p
                      className={`${serif.className} relative text-[28px] italic leading-none`}
                    >
                      {group}
                    </p>
                    <div className="relative mt-5 flex flex-wrap gap-2">
                      {items.map((it) => (
                        <span
                          key={it}
                          className={`hw-stack-pill rounded-full border px-3.5 py-1.5 text-[13.5px] font-normal ${
                            dark
                              ? "border-white/35 text-white"
                              : "border-[#0a1b3d]/30 text-[#0a1b3d]"
                          }`}
                        >
                          {it}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ */}
        <div className="hw-faq mt-24 grid gap-12 sm:mt-32 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="hw-faq-head">
            <div className="mb-5">
              <span
                className={`${serif.className} relative inline-block -rotate-2 bg-[#dfe4eb] px-5 py-1.5 text-[16px] italic sm:text-[17px]`}
                style={{ clipPath: torn }}
              >
                Common questions
              </span>
            </div>
            <h2
              className={`${serif.className} text-[38px] font-light leading-[1] tracking-[-0.02em] sm:text-[56px] lg:text-[64px]`}
            >
              Hardware
              <span className="block italic text-[#6b7686]">questions</span>
            </h2>
            <p className="mt-5 max-w-[360px] text-[15px] font-light leading-7 text-[#0a1b3d]/75">
              Not sure what you need? Call or write to us — we&apos;ll help you
              pick the right devices for your business.
            </p>
          </div>

          <div className="hw-faq-list min-w-0 border-t border-[#0a1b3d]/15">
            {faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <div
                  key={f.q}
                  className="hw-faq-row border-b border-[#0a1b3d]/15"
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : i)}
                      aria-expanded={open}
                      aria-controls={`hw-faq-panel-${i}`}
                      id={`hw-faq-button-${i}`}
                      className="flex w-full items-start justify-between gap-4 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-2"
                    >
                      <span
                        className={`${serif.className} text-[22px] font-medium leading-tight sm:text-[26px]`}
                      >
                        {f.q}
                      </span>
                      <span
                        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition duration-500 ${
                          open
                            ? "rotate-45 bg-[#0a1b3d] text-white"
                            : "border border-[#0a1b3d]/30"
                        }`}
                      >
                        <Plus className="h-4 w-4" />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`hw-faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`hw-faq-button-${i}`}
                    aria-hidden={!open}
                    className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                      open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-[640px] pb-6 text-[15px] font-light leading-7 text-[#0a1b3d]/80">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="hw-cta relative mt-24 sm:mt-32">
          <span
            aria-hidden="true"
            className="hw-cta-sheet absolute inset-0 translate-x-2 translate-y-2 bg-[#d3d9e2] sm:translate-x-3 sm:translate-y-3"
          />
          <div className="hw-cta-panel relative overflow-hidden bg-[#cfe5f6] px-5 py-12 text-center sm:px-10 sm:py-16">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.22]"
              style={{ backgroundImage: halftoneDark, backgroundSize: "10px 10px" }}
            />
            <Grain opacity={0.15} />
            <Tape className="hw-cta-tape -top-3 left-8 -rotate-6" />
            <Tape className="hw-cta-tape -top-3 right-8 rotate-6" />

            <h2
              className={`${serif.className} hw-cta-head relative mx-auto max-w-[760px] text-[38px] font-light leading-[1] tracking-[-0.02em] sm:text-[60px] lg:text-[68px]`}
            >
              Need a hardware quote?
              <span className="block italic">Let&apos;s build your bundle.</span>
            </h2>

            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href={WA_GENERAL}
                target="_blank"
                rel="noopener noreferrer"
                className="hw-cta-btn group/btn inline-flex items-center gap-2 rounded-full bg-[#0a1b3d] px-7 py-3.5 text-[14px] font-normal text-white transition hover:bg-[#12306a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-2"
              >
                <MessageCircle className="h-4 w-4" />
                Request quotation on WhatsApp
                <ArrowUpRight className="h-4 w-4 transition group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
              </a>
              <a
                href={PHONE_TEL}
                className="hw-cta-btn inline-flex items-center gap-2 rounded-full border border-[#0a1b3d]/40 bg-white px-6 py-3.5 text-[14px] font-normal transition hover:border-[#0a1b3d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-2"
              >
                <Phone className="h-4 w-4" />
                {PHONE_DISPLAY}
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="hw-cta-btn inline-flex items-center gap-2 rounded-full border border-[#0a1b3d]/40 bg-white px-6 py-3.5 text-[14px] font-normal transition hover:border-[#0a1b3d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-2"
              >
                <Mail className="h-4 w-4" />
                {EMAIL}
              </a>
            </div>
          </div>
        </div>
      </div>


    </section>
  );
}
