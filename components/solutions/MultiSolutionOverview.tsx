"use client";

import { useEffect, useRef, useState } from "react";
import { Cormorant_Garamond, Jost } from "next/font/google";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  ArrowRight,
  Shirt,
  Scissors,
  Store,
  Check,
  Palette,
  Ruler,
  Tag,
  Package,
  BarChart3,
  Users,
  Calendar,
  Heart,
  Receipt,
  Calculator,
  Cloud,
  Settings,
  Headphones,
  Wand2,
  ShoppingBag,
  X,
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

// Dark blue  #0a1b3d  |  Light blue #cfe5f6  |  Gray #dfe4eb / #6b7686  |  White

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
 * Photo — duotone image block.
 * NOTE: it only adds `relative` when the caller hasn't set a position,
 * otherwise `relative` would override `absolute` and break the collage.
 */
function Photo({
  src,
  alt,
  className = "",
  imgClassName = "",
  tone = 0.4,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  tone?: number;
}) {
  const hasPosition = /(^|\s)(absolute|relative|fixed|sticky)(\s|$)/.test(className);

  return (
    <div
      className={`${hasPosition ? "" : "relative"} overflow-hidden bg-[#c5ccd6] ${className}`}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.opacity = "0";
        }}
        className={`h-full w-full object-cover grayscale contrast-[1.1] transition duration-700 group-hover:grayscale-0 ${imgClassName}`}
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

/* ------------------------------------------------------------------ */
/* Data                                                               */
/* ------------------------------------------------------------------ */

type SolutionKey = "fashion" | "salon" | "sme";

type Feature = { Icon: any; title: string; body: string };

type Solution = {
  key: SolutionKey;
  name: string;
  eyebrow: string;
  tagline: string;
  description: string;
  longDescription: string;
  image: string;
  image2: string;
  Icon: any;
  tilt: string;
  chips: string[];
  features: Feature[];
  stats: { value: string; label: string }[];
  cta: string;
};

const solutions: Solution[] = [
  {
    key: "fashion",
    name: "Fashion",
    eyebrow: "Fashion & clothing",
    tagline: "Built for style.",
    description:
      "Manage every size, colour, and variant with a system designed around how fashion retail actually works.",
    longDescription:
      "From a single boutique to a multi-outlet chain, BillPOS handles the complexity of fashion — size × colour matrices, seasonal pricing, per-outlet stock, and best-seller analytics — so you can focus on curation and customers.",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85",
    image2:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=85",
    Icon: Shirt,
    tilt: "-1.6deg",
    chips: ["Sizes", "Colours", "Variants", "Barcodes"],
    features: [
      { Icon: Ruler, title: "Size × Colour Matrix", body: "True variant management — no spreadsheets, no guesswork, no overselling." },
      { Icon: Tag, title: "Smart Pricing & Discounts", body: "Seasonal pricing, promo codes, and automatic markdown rules built in." },
      { Icon: Package, title: "Per-Outlet Stock", body: "See exactly what's on the shelf in every store, in real time." },
      { Icon: BarChart3, title: "Best-Seller Analytics", body: "Know what's hot, what's slow, and what to reorder — fast." },
    ],
    stats: [
      { value: "10k+", label: "SKUs ready" },
      { value: "6×", label: "Variants" },
      { value: "1-click", label: "Restock" },
    ],
    cta: "Explore Fashion",
  },
  {
    key: "salon",
    name: "Salon",
    eyebrow: "Salons & beauty",
    tagline: "Delight every client.",
    description:
      "Run bookings, services, packages, and product sales from one place — so your stylists focus on clients.",
    longDescription:
      "BillPOS for salons brings appointments, stylist schedules, service packages, and retail products into one calm, uncluttered system. Clients get reminders, stylists get clarity, and you get to see exactly what's driving your revenue.",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1400&q=85",
    image2:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=85",
    Icon: Scissors,
    tilt: "1.2deg",
    chips: ["Bookings", "Packages", "Loyalty", "Retail"],
    features: [
      { Icon: Calendar, title: "Appointments & Bookings", body: "Day view, stylist view, and instant client reminders." },
      { Icon: Heart, title: "Packages & Memberships", body: "Sell service bundles, track balances, and reward regulars." },
      { Icon: Users, title: "Stylist Performance", body: "See who's driving revenue, retention, and re-bookings." },
      { Icon: Package, title: "Product Inventory", body: "Track both in-salon products and retail shelves with alerts." },
    ],
    stats: [
      { value: "0 no-shows", label: "With reminders" },
      { value: "2×", label: "Repeat visits" },
      { value: "Instant", label: "Checkout" },
    ],
    cta: "Explore Salon",
  },
  {
    key: "sme",
    name: "SME",
    eyebrow: "Small & medium businesses",
    tagline: "Everything in one place.",
    description:
      "Bring sales, inventory, purchasing, and reporting together — so you can run your business confidently.",
    longDescription:
      "BillPOS for SMEs unifies sales, stock, purchasing, and reporting so smaller teams can run like larger ones — without needing a dedicated IT department or a stack of disconnected tools.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1400&q=85",
    image2:
      "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=800&q=85",
    Icon: Store,
    tilt: "-0.8deg",
    chips: ["Sales", "Stock", "Purchasing", "Reports"],
    features: [
      { Icon: ShoppingBag, title: "All Counters, One View", body: "Sales from every counter and outlet in a single dashboard." },
      { Icon: Package, title: "Stock Across Outlets", body: "Know what's where, and move it between outlets in a click." },
      { Icon: Receipt, title: "Purchase & Supplier Flows", body: "GRN, supplier invoices, and payables — all under one roof." },
      { Icon: BarChart3, title: "Owner Dashboard", body: "Profit, top products, and daily summaries at a glance." },
    ],
    stats: [
      { value: "1 platform", label: "Everything" },
      { value: "Rs. 0", label: "Setup cost" },
      { value: "30 days", label: "Free trial" },
    ],
    cta: "Explore SMEs",
  },
];

const customizations = [
  { Icon: Palette, label: "Custom invoice designs" },
  { Icon: Settings, label: "Custom fields & workflows" },
  { Icon: Calculator, label: "Custom tax & VAT rules" },
  { Icon: Users, label: "Custom roles & permissions" },
  { Icon: Receipt, label: "Custom receipt layouts" },
  { Icon: Cloud, label: "Custom integrations" },
];

const HERO_IMG =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=85";
const TEAM_IMG =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=85";

const reduceMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export default function MultiSolutionOverview() {
  const sectionRef = useRef<HTMLElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const [openKey, setOpenKey] = useState<SolutionKey | null>(null);

  const qa = (sel: string): HTMLElement[] => {
    const root = sectionRef.current;
    if (!root) return [];
    return Array.from(root.querySelectorAll<HTMLElement>(sel));
  };

  /* ---------------- Entrance ---------------- */

  useEffect(() => {
    const root = sectionRef.current;
    if (!root || reduceMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        qa(".ms-header > *"),
        { y: 24, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: root.querySelector(".ms-header"), start: "top 85%", once: true },
        }
      );

      gsap.fromTo(
        qa(".ms-card"),
        { y: 70, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.95, stagger: 0.15, ease: "power3.out",
          scrollTrigger: { trigger: root.querySelector(".ms-cards"), start: "top 90%", once: true },
        }
      );

      gsap.fromTo(
        qa(".ms-custom-banner"),
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: root.querySelector(".ms-custom-banner"), start: "top 92%", once: true },
        }
      );
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- Detail animations + scroll into view ---------------- */

  useEffect(() => {
    if (!openKey || !detailRef.current) return;
    const el = detailRef.current;
    const reduced = reduceMotion();

    // bring the opened panel into view (important on mobile where it sits below the stacked cards)
    const scrollTimer = window.setTimeout(() => {
      el.querySelector(".ms-detail-panel")?.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "start",
      });
    }, 80);

    if (reduced) {
      return () => window.clearTimeout(scrollTimer);
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        el.querySelectorAll(".ms-detail-image"),
        { clipPath: "inset(0% 100% 0% 0%)", scale: 1.06 },
        { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.0 }
      )
        .fromTo(
          el.querySelectorAll(".ms-detail-block"),
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
          "-=0.65"
        )
        .fromTo(
          el.querySelectorAll(".ms-feature-item"),
          { x: 30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, stagger: 0.07 },
          "-=0.45"
        )
        .fromTo(
          el.querySelectorAll(".ms-stat"),
          { scale: 0.85, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, stagger: 0.08, ease: "back.out(1.7)" },
          "-=0.5"
        );
    }, el);

    return () => {
      window.clearTimeout(scrollTimer);
      ctx.revert();
    };
  }, [openKey]);

  const active = solutions.find((s) => s.key === openKey) ?? null;

  const handleCardClick = (key: SolutionKey) => {
    setOpenKey((prev) => (prev === key ? null : key));
  };

  const closeDetail = () => setOpenKey(null);

  /* ---------------------------------------------------------------- */
  /* Render                                                            */
  /* ---------------------------------------------------------------- */

  return (
    <section
      ref={sectionRef}
      id="multi-solutions"
      className={`${sans.className} relative w-full scroll-mt-24 overflow-hidden bg-[#f1f4f8] py-16 text-[#0a1b3d] sm:py-24 lg:py-28`}
    >
      <Grain opacity={0.14} />

      {/* collage backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 top-24 h-56 w-56 rounded-full bg-[#dfe4eb] sm:h-80 sm:w-80" />
        <div className="absolute right-[-60px] top-[420px] hidden h-72 w-52 rotate-[8deg] bg-[#cfe5f6]/70 lg:block" />
        <div
          className="absolute left-[6%] top-[46%] hidden h-40 w-40 opacity-40 lg:block"
          style={{ backgroundImage: halftoneDark, backgroundSize: "9px 9px" }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">

        {/* ============================================================ */}
        {/* HEADER                                                         */}
        {/* ============================================================ */}

        <div className="ms-header grid items-center gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
          <div>
            <span
              className={`${serif.className} relative mb-5 inline-block -rotate-2 bg-[#dfe4eb] px-5 py-1.5 text-[16px] italic text-[#0a1b3d] sm:mb-6 sm:text-[17px]`}
              style={{ clipPath: torn }}
            >
              More industries
            </span>

            <h2
              className={`${serif.className} text-[44px] font-light leading-[0.98] tracking-[-0.02em] sm:text-[72px] lg:text-[96px]`}
            >
              One platform.
              <br />
              <span className="font-normal italic text-[#6b7686]">Every business.</span>
            </h2>

            <p className="mt-6 max-w-[520px] text-[14.5px] font-light leading-7 text-[#0a1b3d]/70 sm:mt-7 sm:text-[15px]">
              Beyond retail and restaurants — BillPOS is also tailored for
              fashion, salons, and growing SMEs. Select a card to open the
              full story.
            </p>
          </div>

          {/* polaroid collage */}
          <div className="relative mx-auto h-[330px] w-full max-w-[380px] sm:h-[380px] sm:max-w-[420px]">
            <div className="absolute right-0 top-4 h-36 w-36 rounded-full bg-[#0a1b3d] sm:h-52 sm:w-52" />
            <div
              className="absolute -left-2 bottom-2 h-28 w-36 opacity-60 sm:h-36 sm:w-44"
              style={{ backgroundImage: halftoneDark, backgroundSize: "8px 8px" }}
            />
            <div className="group absolute left-3 top-0 w-[220px] rotate-[4deg] bg-white p-2.5 pb-11 shadow-[0_30px_50px_-25px_rgba(10,27,61,0.55)] sm:left-6 sm:w-[270px] sm:p-3 sm:pb-12">
              <Tape className="-top-3 left-1/2 -translate-x-1/2 -rotate-3" />
              <Photo src={HERO_IMG} alt="Boutique interior" className="aspect-[4/5] w-full" tone={0.35} />
              <p className={`${serif.className} absolute bottom-3 left-3.5 text-[17px] italic text-[#0a1b3d] sm:left-4 sm:text-[20px]`}>
                Fashion, salons &amp; SMEs
              </p>
            </div>
            <div className="absolute bottom-0 right-0 z-10 flex h-20 w-20 -rotate-6 items-center justify-center bg-[#cfe5f6] text-center shadow-lg sm:right-2 sm:h-24 sm:w-24">
              <p className={`${serif.className} text-[15px] italic leading-tight sm:text-[18px]`}>
                Made for
                <br />
                Sri Lanka
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CARDS                                                          */}
        {/* ============================================================ */}

        <div className="ms-cards mt-20 grid gap-14 sm:mt-24 xl:grid-cols-3 xl:gap-8">
          {solutions.map((s) => {
            const isOpen = openKey === s.key;
            const Icon = s.Icon;

            return (
              <div
                key={s.key}
                className="ms-card group relative mx-auto w-full max-w-[520px] xl:max-w-none"
              >
                <div
                  className={`relative transition-transform duration-500 ${
                    isOpen ? "-translate-y-2 rotate-0" : "rotate-[var(--r)] hover:-translate-y-2 hover:rotate-0"
                  }`}
                  style={{ ["--r" as any]: s.tilt }}
                >
                  {/* back sheet */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 translate-x-2 translate-y-2 bg-[#d3d9e2] sm:translate-x-3 sm:translate-y-3"
                  />

                  <button
                    type="button"
                    onClick={() => handleCardClick(s.key)}
                    aria-expanded={isOpen}
                    className="relative block w-full bg-white text-left shadow-[0_40px_70px_-40px_rgba(10,27,61,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-4"
                  >
                    <Tape className="-top-3 left-8 z-30 -rotate-6" />

                    {/* navy top */}
                    <div className="relative h-[230px] overflow-hidden bg-[#0a1b3d] sm:h-[250px]">
                      <div
                        className="absolute inset-0 opacity-[0.16]"
                        style={{ backgroundImage: halftoneLight, backgroundSize: "9px 9px" }}
                      />
                      <div
                        className="absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-[#12306a]"
                        aria-hidden="true"
                      />
                      <div className="relative z-10 px-5 pt-7 sm:px-6">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#cfe5f6] text-[#0a1b3d]">
                          <Icon className="h-4 w-4" />
                        </span>
                        <h3
                          className={`${serif.className} mt-4 text-[46px] font-light leading-[0.9] tracking-[-0.02em] text-white sm:text-[58px]`}
                        >
                          {s.name}
                        </h3>
                        <p
                          className={`${serif.className} mt-2 max-w-[150px] text-[18px] italic leading-[1.15] text-[#cfe5f6] sm:max-w-[200px] sm:text-[20px]`}
                        >
                          {s.tagline}
                        </p>
                      </div>
                      <Grain opacity={0.25} />
                    </div>

                    {/* arch cutout */}
                    <Photo
                      src={s.image}
                      alt={s.name}
                      tone={0.3}
                      className="absolute right-4 top-7 z-10 h-[186px] w-[132px] rounded-t-full border-[5px] border-white shadow-[0_25px_40px_-20px_rgba(0,0,0,0.6)] sm:right-5 sm:top-8 sm:h-[236px] sm:w-[168px] sm:border-[6px]"
                      imgClassName="group-hover:scale-105"
                    />

                    {/* circle sticker */}
                    <Photo
                      src={s.image2}
                      alt=""
                      tone={0.35}
                      className="absolute left-4 top-[186px] z-10 h-[76px] w-[76px] rounded-full border-[4px] border-white shadow-lg sm:left-5 sm:top-[205px] sm:h-[96px] sm:w-[96px] sm:border-[5px]"
                    />

                    {/* body */}
                    <div className="relative bg-white px-5 pb-6 pt-[72px] sm:px-6 sm:pb-7 sm:pt-24">
                      <Grain opacity={0.1} />

                      <p className="relative text-[14px] font-light leading-7 text-[#0a1b3d]/80 sm:text-[14.5px]">
                        {s.description}
                      </p>

                      <div
                        className="relative -mx-2 mt-6 -rotate-1 bg-[#cfe5f6] px-4 pb-6 pt-4 sm:-mx-3 sm:px-5"
                        style={{ clipPath: torn }}
                      >
                        <div className="flex flex-wrap gap-2">
                          {s.chips.map((c) => (
                            <span
                              key={c}
                              className="rounded-full border border-[#0a1b3d]/30 px-3 py-1 text-[12px] font-normal text-[#0a1b3d]"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="relative mt-5 flex items-center justify-between">
                        <span className={`${serif.className} text-[22px] italic`}>
                          {isOpen ? "Selected" : "View details"}
                        </span>
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-full transition duration-500 ${
                            isOpen
                              ? "rotate-45 bg-[#0a1b3d] text-white"
                              : "border border-[#0a1b3d]/30 text-[#0a1b3d] group-hover:bg-[#0a1b3d] group-hover:text-white"
                          }`}
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ============================================================ */}
        {/* DETAIL PANEL                                                   */}
        {/* ============================================================ */}

        <div ref={detailRef} className="relative">
          {active && (
            <div className="ms-detail-panel group relative mt-16 scroll-mt-6 bg-white shadow-[0_50px_90px_-50px_rgba(10,27,61,0.6)] sm:mt-20">
              <Grain opacity={0.1} />
              <div className="h-2 w-full bg-[#0a1b3d]" />

              <div className="relative grid gap-10 p-5 sm:gap-12 sm:p-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:p-14">

                {/* LEFT: collage + stats */}
                <div className="ms-detail-block min-w-0">
                  <div className="relative h-[340px] sm:h-[480px]">
                    <div className="absolute -left-3 -top-3 h-28 w-28 bg-[#cfe5f6] sm:-left-4 sm:-top-4 sm:h-40 sm:w-40" aria-hidden="true" />
                    <div
                      className="absolute bottom-10 left-8 h-28 w-32 opacity-50 sm:h-32 sm:w-40"
                      style={{ backgroundImage: halftoneDark, backgroundSize: "8px 8px" }}
                      aria-hidden="true"
                    />
                    <Tape className="-top-3 left-1/2 z-30 -translate-x-1/2 rotate-2" />

                    <Photo
                      src={active.image}
                      alt={active.name}
                      tone={0.28}
                      className="absolute bottom-12 left-0 right-6 top-0 shadow-[0_30px_60px_-30px_rgba(10,27,61,0.7)] sm:bottom-14 sm:right-10"
                      imgClassName="ms-detail-image"
                    />

                    <div className="absolute left-3 top-3 z-10 flex items-center gap-2 bg-white px-3 py-1.5 sm:left-4 sm:top-4 sm:px-3.5">
                      <active.Icon className="h-3.5 w-3.5" />
                      <span className="text-[11px] font-normal sm:text-[12px]">{active.eyebrow}</span>
                    </div>

                    <p
                      className={`${serif.className} absolute bottom-[68px] left-4 z-10 text-[30px] font-light leading-none text-white sm:bottom-20 sm:left-6 sm:text-[46px]`}
                    >
                      {active.name}
                      <span className="block italic text-[#cfe5f6]">Solution</span>
                    </p>

                    <Photo
                      src={active.image2}
                      alt=""
                      tone={0.35}
                      className="absolute bottom-0 right-0 z-10 h-[104px] w-[104px] rounded-full border-[6px] border-white shadow-xl sm:h-[200px] sm:w-[200px] sm:border-[8px]"
                    />
                  </div>

                  <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
                    {active.stats.map((st, i) => (
                      <div
                        key={st.label}
                        className={`ms-stat min-w-0 px-3 pb-5 pt-3 text-left sm:p-4 sm:pb-6 ${
                          i === 1 ? "rotate-1 bg-[#0a1b3d] text-white" : i === 0 ? "-rotate-1 bg-[#dfe4eb]" : "rotate-[0.5deg] bg-[#cfe5f6]"
                        }`}
                        style={{ clipPath: torn }}
                      >
                        <p className={`${serif.className} break-words text-[19px] font-medium leading-[1.05] sm:text-[28px]`}>
                          {st.value}
                        </p>
                        <p className={`mt-2 text-[11px] font-light leading-tight sm:text-[12px] ${i === 1 ? "text-white/70" : "text-[#0a1b3d]/65"}`}>
                          {st.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RIGHT: narrative + features */}
                <div className="min-w-0">
                  <div className="ms-detail-block flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[13px] font-normal text-[#6b7686]">{active.eyebrow}</p>
                      <p
                        className={`${serif.className} mt-2 text-[36px] font-light italic leading-[1] tracking-[-0.01em] sm:text-[56px]`}
                      >
                        {active.tagline}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={closeDetail}
                      aria-label="Close details"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#0a1b3d]/25 bg-white transition hover:bg-[#0a1b3d] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d]"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="ms-detail-block mt-5 max-w-[560px] text-[14.5px] font-light leading-7 text-[#0a1b3d]/75 sm:mt-6 sm:text-[15px]">
                    {active.longDescription}
                  </p>

                  <div className="mt-7 border-t border-[#0a1b3d]/15 sm:mt-8">
                    {active.features.map(({ Icon, title, body }) => (
                      <div
                        key={title}
                        className="ms-feature-item flex items-start gap-3.5 border-b border-[#0a1b3d]/15 py-4 sm:gap-4"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#cfe5f6] text-[#0a1b3d] sm:h-11 sm:w-11">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className={`${serif.className} text-[21px] font-medium leading-tight sm:text-[22px]`}>{title}</p>
                          <p className="mt-1 text-[13.5px] font-light leading-6 text-[#0a1b3d]/70">{body}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA — "Explore Fashion / Salon / SMEs" button removed.
                   *      Only the "Request a demo" button remains. */}
                  <div className="ms-detail-block mt-7 flex flex-wrap items-center gap-3 sm:mt-8">
                    <Link
                      href="/demo"
                      className="group/btn inline-flex items-center gap-2 rounded-full bg-[#0a1b3d] px-6 py-3 text-[13.5px] font-normal text-white transition hover:bg-[#12306a]"
                    >
                      Request a demo
                      <ArrowUpRight className="h-4 w-4 transition group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* CUSTOMIZABLE BANNER                                            */}
        {/* ============================================================ */}

        <div className="ms-custom-banner relative mt-20 bg-[#0a1b3d] text-white sm:mt-24">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{ backgroundImage: halftoneLight, backgroundSize: "10px 10px" }}
          />
          <Grain opacity={0.25} />

          <div className="relative grid items-center gap-12 p-5 py-10 sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:p-14">
            <div className="min-w-0">
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-1.5 text-[12.5px] font-light text-[#cfe5f6] sm:mb-6">
                <Wand2 className="h-3.5 w-3.5" />
                Fully customizable
              </span>

              <h3
                className={`${serif.className} text-[34px] font-light leading-[1.04] tracking-[-0.015em] sm:text-[52px] lg:text-[64px]`}
              >
                Don&apos;t see your exact workflow?
                <span className="block italic text-[#cfe5f6]">We&apos;ll build it for you.</span>
              </h3>

              <p className="mt-5 max-w-[520px] text-[14.5px] font-light leading-7 text-white/70 sm:mt-6 sm:text-[15px]">
                Every business is different — and BillPOS is designed to adapt.
                From custom invoice designs to tailored tax rules, user roles,
                and integrations, our team can shape the platform around the
                way <em>you</em> actually work.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-8">
                <Link
                  href="/contact"
                  className="group/btn inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[13.5px] font-normal text-[#0a1b3d] transition hover:bg-[#cfe5f6]"
                >
                  Talk to our team
                  <ArrowUpRight className="h-4 w-4 transition group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                </Link>
                <Link
                  href="/demo"
                  className="group/btn inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-[13.5px] font-normal text-white transition hover:border-white"
                >
                  See customization in action
                  <ArrowRight className="h-4 w-4 transition group-hover/btn:translate-x-0.5" />
                </Link>
              </div>

              <p className="mt-6 flex items-start gap-2 text-[13px] font-light text-white/60">
                <Headphones className="mt-0.5 h-4 w-4 shrink-0" />
                Free guided onboarding &amp; 24/7 local support included.
              </p>
            </div>

            {/* paper card + polaroid */}
            <div className="relative min-w-0 pb-4 pt-2 sm:pt-20 lg:pl-6">
              {/* polaroid sits above the card, clear of the content */}
              <div className="group absolute right-4 top-0 z-20 hidden w-[130px] rotate-[6deg] bg-white p-2 pb-6 shadow-xl sm:block">
                <Photo src={TEAM_IMG} alt="Team at work" className="aspect-square w-full" tone={0.3} />
                <Tape className="-top-3 left-1/2 h-5 w-14 -translate-x-1/2 -rotate-6" />
              </div>

              <div className="relative -rotate-1 bg-white p-5 text-[#0a1b3d] shadow-[0_40px_60px_-30px_rgba(0,0,0,0.7)] sm:p-8">
                <Grain opacity={0.1} />
                <Tape className="-top-3 left-8 -rotate-3" />

                <p className={`${serif.className} relative text-[26px] italic leading-none sm:text-[28px]`}>
                  Popular customizations
                </p>

                <div className="relative mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {customizations.map(({ Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 bg-[#f1f4f8] px-3 py-3 transition hover:bg-[#cfe5f6]"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#0a1b3d]">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <p className="text-[13px] font-normal leading-snug">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="relative mt-6 flex items-center gap-3 border-t border-[#0a1b3d]/15 pt-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0a1b3d] text-white">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <p className="text-[13px] font-light text-[#0a1b3d]/75">
                    Most customizations delivered in under{" "}
                    <span className="font-medium text-[#0a1b3d]">2 weeks</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* footer line */}
        <div className="mt-12 flex items-center justify-center gap-3 sm:mt-14 sm:gap-4">
          <span className="h-px w-6 shrink-0 bg-[#6b7686]/50 sm:w-10" />
          <p className={`${serif.className} text-center text-[16px] italic text-[#6b7686] sm:text-[19px]`}>
            Fashion / Salon / SMEs / Retail / Restaurants
          </p>
          <span className="h-px w-6 shrink-0 bg-[#6b7686]/50 sm:w-10" />
        </div>
      </div>
    </section>
  );
}
