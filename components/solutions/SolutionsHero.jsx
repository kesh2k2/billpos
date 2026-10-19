"use client";

import { useEffect, useRef } from "react";
import { Instrument_Serif, Inter } from "next/font/google";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  ArrowUpRight,
  ShoppingBag,
  UtensilsCrossed,
  Shirt,
  Scissors,
  Store,
  ScanLine,
  Boxes,
  BarChart3,
} from "lucide-react";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const sans = Inter({ subsets: ["latin"] });

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const industries = [
  { name: "Retail", Icon: ShoppingBag, tint: "bg-blue-100 text-blue-600" },
  {
    name: "Restaurants",
    Icon: UtensilsCrossed,
    tint: "bg-orange-100 text-orange-500",
  },
  { name: "Fashion", Icon: Shirt, tint: "bg-violet-100 text-violet-600" },
  { name: "Salons", Icon: Scissors, tint: "bg-emerald-100 text-emerald-600" },
  { name: "SMEs", Icon: Store, tint: "bg-sky-100 text-sky-600" },
];

const heroScene =
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80";

const descriptionText =
  "Powerful POS solutions designed around the way your business works — from retail and restaurants to fashion, salons, and growing SMEs.";

/* ------------------------------------------------------------------ */
/*  Small primitives                                                   */
/* ------------------------------------------------------------------ */

function Star4({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12C6.6 11.4 11.4 6.6 12 0z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Scroll helper — used by the "Explore Solutions" CTA              */
/* ------------------------------------------------------------------ */

function scrollToId(id) {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

export default function BillPOSHero() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      /* ---------- entrance timeline ---------- */
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.85 },
      });

      tl.from(".gsap-scene", { scale: 1.06, opacity: 0, duration: 1.2 })
        .from(
          ".gsap-center > *",
          { y: 28, opacity: 0, duration: 0.8, stagger: 0.1 },
          "-=0.75"
        )
        .to(
          ".gsap-word",
          {
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.06,
            stagger: 0.045,
            ease: "none",
          },
          "-=0.35"
        );

      /* ---------- DESKTOP CARD ANIMATION: spin in from right ---------- */
      gsap.fromTo(
        ".gsap-card",
        {
          x: 420,
          y: 60,
          rotation: 180,
          scale: 0.35,
          opacity: 0,
          borderRadius: "50%",
          backgroundColor: "#00FF66",
        },
        {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          opacity: 1,
          borderRadius: "16px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          duration: 2,
          ease: "power2.inOut",
          stagger: 0.22,
          delay: 1.4,
        }
      );

      /* ---------- rotating badge — spin in ---------- */
      gsap.from(".gsap-badge", {
        scale: 0.3,
        rotation: -90,
        opacity: 0,
        duration: 0.9,
        ease: "back.out(1.4)",
        delay: 1.6,
      });

      /* ---------- MOBILE BAR ANIMATIONS: horizontal slide with GSAP eases ---------- */
      const mobileEases = [
        "back.out(1.7)",
        "elastic.out(1, 0.6)",
        "bounce.out",
        "power3.out",
      ];

      gsap.utils.toArray(".gsap-mobile-bar").forEach((bar, i) => {
        gsap.fromTo(
          bar,
          {
            x: -420,
            opacity: 0,
            scale: 0.85,
            borderRadius: "50%",
          },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            borderRadius: "16px",
            duration: 1.4,
            ease: mobileEases[i % mobileEases.length],
            scrollTrigger: {
              trigger: bar,
              start: "top 92%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      /* ---------- MOBILE MARQUEE fade-slide-in ---------- */
      gsap.from(".gsap-mobile-marquee", {
        x: -60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".gsap-mobile-marquee",
          start: "top 95%",
          toggleActions: "play none none none",
        },
      });

      /* ---------- scroll parallax on the image ---------- */
      gsap.to(".gsap-scene", {
        yPercent: -5,
        ease: "none",
        scrollTrigger: {
          trigger: ".gsap-visual",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      /* ---------- zoom-in on scroll: corner texts ---------- */
      gsap.fromTo(
        ".gsap-zoom",
        { scale: 0.75, opacity: 0.35 },
        {
          scale: 1.15,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".gsap-visual",
            start: "top 85%",
            end: "top 25%",
            scrub: 1,
          },
        }
      );

      /* ---------- ScrollTrigger callbacks ---------- */
      ScrollTrigger.create({
        trigger: ".gsap-visual",
        start: "top center",
        end: "bottom top",
        onEnter: (self) => {
          console.log("Hero entered. Progress:", self.progress);
        },
        onLeave: () => console.log("Hero left"),
        onEnterBack: () => console.log("Hero entered again (scrolling back)"),
        onLeaveBack: () => console.log("Hero left (scrolling back)"),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      suppressHydrationWarning
      className={`${sans.className} relative w-full overflow-hidden bg-white pt-[69px] sm:pt-[75px]`}
    >
      {/* keyframes */}
      <style>{`
        @keyframes float-a {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }
        @keyframes float-b {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(10px); }
        }
        @keyframes badge-spin { to { transform: rotate(360deg); } }
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .anim { animation: none !important; }
          .marquee-track { animation: none !important; }
        }
      `}</style>

      {/* ---------------------- visual stage ---------------------- */}
      <div className="gsap-visual relative mx-auto w-full max-w-[1400px] px-3 pb-6 sm:px-6 sm:pb-8">
        <div className="relative overflow-hidden rounded-[26px] border border-slate-200/70 shadow-[0_50px_100px_-50px_rgba(15,23,42,0.45)] sm:rounded-[36px]">
          {/* image — viewport-adaptive height so the entire hero fits on one screen */}
          <img
            src={heroScene}
            alt="Business using BillPOS point of sale"
            className="gsap-scene h-[560px] w-full object-cover object-center grayscale contrast-[1.05] sm:h-[600px] lg:h-[calc(100vh-160px)] lg:min-h-[560px] lg:max-h-[740px]"
          />

          {/* readability overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/55 via-white/35 to-white/55" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0.35)_55%,transparent_85%)]" />

          {/* ------------------ center content ------------------ */}
          <div className="absolute inset-0 z-30 flex items-center justify-center px-6 sm:px-8">
            <div className="gsap-center flex w-full max-w-[760px] flex-col items-center text-center">
              {/* eyebrow */}
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/90 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-blue-700 backdrop-blur sm:mb-5 sm:px-3.5 sm:text-[10px] sm:tracking-[0.2em]">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                Solutions for every business
              </span>

              {/* heading */}
              <h1
                className={`${serif.className} text-[28px] leading-[1.04] tracking-[-0.02em] text-[#111111] sm:text-[42px] md:text-[56px] lg:text-[72px]`}
              >
                <span className="block">One Platform.</span>
                <span className="block italic text-blue-700">
                  Different Businesses.
                </span>
                <span className="block">Built Around You.</span>
              </h1>

              {/* description with typewriter animation */}
              <p
                suppressHydrationWarning
                className="mt-4 w-full max-w-[320px] break-words px-1 text-[10.5px] leading-[1.65] text-slate-600 sm:mt-5 sm:max-w-[460px] sm:text-[12.5px] md:max-w-[520px] md:text-[13.5px] lg:text-[14.5px]"
              >
                {descriptionText.split(" ").map((word, i) => (
                  <span
                    key={i}
                    className="gsap-word mr-[0.28em] inline-block opacity-0 blur-[3px]"
                  >
                    {word}
                  </span>
                ))}
              </p>

              {/* CTAs */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:mt-6 sm:gap-2.5">
                <button
                  type="button"
                  onClick={() => scrollToId("SolutionSelecter")}
                  className="group inline-flex items-center gap-1.5 rounded-full bg-blue-700 px-4 py-2 text-[11px] font-medium text-white shadow-[0_12px_28px_-14px_rgba(29,78,216,0.75)] transition hover:bg-blue-800 sm:gap-2 sm:px-5 sm:py-2.5 sm:text-[12.5px] md:px-6 md:py-3 md:text-[13px]"
                >
                  Explore Solutions
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 sm:h-4 sm:w-4" />
                </button>

                <Link
                  href="/demo"
                  className="group inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/95 px-3.5 py-2 text-[11px] font-medium text-slate-800 shadow-[0_8px_24px_-18px_rgba(15,23,42,0.6)] backdrop-blur transition hover:border-blue-300 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-[12.5px] md:px-5 md:py-3 md:text-[13px]"
                >
                  Request a Demo
                  <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:h-4 sm:w-4" />
                </Link>
              </div>

              {/* supporting text — auto-sliding marquee (DESKTOP ONLY, in-overlay) */}
              <div className="mt-5 hidden w-full max-w-[640px] overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] lg:block">
                <div
                  className="marquee-track flex w-max items-center"
                  style={{ animation: "marquee 26s linear infinite" }}
                >
                  {[0, 1].map((dup) => (
                    <div key={dup} className="flex shrink-0 items-center">
                      {industries.map(({ name, Icon, tint }) => (
                        <span
                          key={`${dup}-${name}`}
                          className="flex shrink-0 items-center gap-3 px-5 text-[15px] font-semibold tracking-wide text-slate-600"
                        >
                          <span
                            className={`flex h-7 w-7 items-center justify-center rounded-lg ${tint}`}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          {name}
                          <span className="ml-2 text-[16px] text-slate-300">
                            •
                          </span>
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ------------------ DESKTOP-ONLY feature cards ------------------
           *  Wrapped in a flex column with a single `gap-5` so all three
           *  cards sit with equal spacing between them, regardless of
           *  hero height. No overlap.
           * ---------------------------------------------------------------- */}
          <div className="pointer-events-none absolute left-[3%] top-1/2 z-20 hidden w-[220px] -translate-y-1/2 flex-col gap-5 lg:flex">
            {/* Live HUD — card 1 */}
            <div
              className="gsap-card anim rounded-2xl border border-white/80 bg-white/95 p-4 shadow-[0_24px_50px_-26px_rgba(15,23,42,0.5)] backdrop-blur-xl"
              style={{
                animation: "float-b 9.5s ease-in-out infinite",
                animationDelay: "3.6s",
              }}
            >
              <div className="mb-2.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-700 text-[9px] font-bold text-white">
                    B
                  </span>
                  <span className="text-[11.5px] font-semibold">BillPOS</span>
                </div>
                <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700">
                  Live
                </span>
              </div>
              <div className="flex h-14 items-end gap-1">
                {[40, 62, 48, 75, 58, 90, 70].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-gradient-to-t from-blue-700 to-blue-400"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <div className="mt-2 flex items-center gap-1 text-[9.5px] text-slate-400">
                <BarChart3 className="h-2.5 w-2.5" /> Sales this week
              </div>
            </div>

            {/* "Sell faster" — card 2 */}
            <div
              className="gsap-card anim rounded-2xl border border-white/80 bg-white/95 p-4 shadow-[0_26px_55px_-30px_rgba(15,23,42,0.5)] backdrop-blur-xl"
              style={{
                animation: "float-a 8s ease-in-out infinite",
                animationDelay: "3.8s",
              }}
            >
              <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <ScanLine className="h-4 w-4" />
              </span>
              <p className="text-[13.5px] font-semibold leading-snug text-[#111]">
                Sell faster, from day one.
              </p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">
                Billing, barcodes and receipts that just work.
              </p>
            </div>

            {/* "Every outlet" — card 3 */}
            <div
              className="gsap-card anim rounded-2xl border border-white/80 bg-white/95 p-4 shadow-[0_26px_55px_-30px_rgba(15,23,42,0.5)] backdrop-blur-xl"
              style={{
                animation: "float-b 9s ease-in-out infinite",
                animationDelay: "4s",
              }}
            >
              <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Boxes className="h-4 w-4" />
              </span>
              <p className="text-[13.5px] font-semibold leading-snug text-[#111]">
                Every outlet, one view.
              </p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">
                Inventory, purchasing and reports in sync.
              </p>
            </div>
          </div>

          {/* rotating badge — top right (DESKTOP ONLY) */}
          <div className="gsap-badge pointer-events-none absolute right-[4%] top-[8%] z-20 hidden h-[150px] w-[150px] items-center justify-center lg:flex xl:h-[170px] xl:w-[170px]">
            <svg
              viewBox="0 0 100 100"
              className="anim absolute inset-0 h-full w-full text-slate-500"
              style={{ animation: "badge-spin 26s linear infinite" }}
            >
              <defs>
                <path
                  id="billpos-circ"
                  d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"
                />
              </defs>
              <text
                fontSize="6.4"
                letterSpacing="3.1"
                fill="currentColor"
                fontWeight="500"
              >
                <textPath href="#billpos-circ">
                  BUILT FOR SRI LANKAN BUSINESSES • EVERYDAY •
                </textPath>
              </text>
            </svg>
            <Star4 className="h-5 w-5 text-[#111] xl:h-6 xl:w-6" />
          </div>

          {/* trust line — bottom center (DESKTOP ONLY) */}
          <div className="gsap-zoom pointer-events-none absolute bottom-[4%] left-1/2 z-20 hidden -translate-x-1/2 text-center lg:block">
            <p className="text-[11.5px] leading-relaxed text-slate-500">


              Trusted by 10 + businesses across Sri Lanka.
            </p>
          </div>

          {/* "One system. Every business." — bottom right (DESKTOP ONLY) */}
          <div className="gsap-zoom pointer-events-none absolute bottom-[4%] right-[4%] z-20 hidden flex-col items-end gap-2 lg:flex">
            <div className="flex items-center gap-2.5">
              <span className="h-px w-8 bg-slate-400/60" />
              <p className="text-left text-[11.5px] leading-relaxed text-slate-500">
                One system.
                <br />
                Every business.
              </p>
            </div>
          </div>
        </div>

        {/* ================= MOBILE-ONLY SECTION BELOW IMAGE ================= */}
        <div className="mt-6 space-y-3 lg:hidden">
          {/* --- MOBILE MARQUEE (horizontal sliding text) --- */}
          <div className="gsap-mobile-marquee w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div
              className="marquee-track flex w-max items-center"
              style={{ animation: "marquee 22s linear infinite" }}
            >
              {[0, 1].map((dup) => (
                <div key={dup} className="flex shrink-0 items-center">
                  {industries.map(({ name, Icon, tint }) => (
                    <span
                      key={`${dup}-${name}`}
                      className="flex shrink-0 items-center gap-2 px-3 text-[12px] font-semibold tracking-wide text-slate-600"
                    >
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-md ${tint}`}
                      >
                        <Icon className="h-3 w-3" />
                      </span>
                      {name}
                      <span className="ml-1 text-[14px] text-slate-300">•</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* --- MOBILE BAR 1: Live Sales (slides with back.out) --- */}
          <div className="gsap-mobile-bar flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)]">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-[12px] font-bold text-white">
              B
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold text-[#111]">
                  Live sales today
                </p>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-semibold text-emerald-700">
                  Live
                </span>
              </div>
              <p className="mt-0.5 truncate text-[11px] text-slate-400">
                Rs. 84,250 • 126 bills • 98% stock
              </p>
            </div>
            <BarChart3 className="h-4 w-4 shrink-0 text-blue-600" />
          </div>

          {/* --- MOBILE BAR 2: Sell faster (slides with elastic.out) --- */}
          <div className="gsap-mobile-bar flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)]">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ScanLine className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-[#111]">
                Sell faster, from day one.
              </p>
              <p className="mt-0.5 truncate text-[11px] text-slate-400">
                Billing, barcodes and receipts that just work.
              </p>
            </div>
          </div>

          {/* --- MOBILE BAR 3: Every outlet (slides with bounce.out) --- */}
          <div className="gsap-mobile-bar flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)]">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Boxes className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-[#111]">
                Every outlet, one view.
              </p>
              <p className="mt-0.5 truncate text-[11px] text-slate-400">
                Inventory, purchasing and reports in sync.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
