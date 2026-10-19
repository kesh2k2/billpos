"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { Instrument_Serif, Inter } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import {
  ArrowUpRight,
  ArrowRight,
  ShoppingBag,
  UtensilsCrossed,
  Shirt,
  Scissors,
  Store,
  Check,
  X,
  Layers,
  Sparkles,
  TrendingUp,
  Package,
  ChevronDown,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

/* ------------------------------------------------------------------ */
/* Typography — matches hero section                                  */
/* ------------------------------------------------------------------ */

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const sans = Inter({ subsets: ["latin"] });

/* ------------------------------------------------------------------ */
/* Scroll helpers — used by the "Explore" CTA                         */
/* ------------------------------------------------------------------ */

function scrollToId(id: string) {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/**
 * Map each industry to the DOM id of the component it should scroll to.
 *   retail       → RetailSolution.tsx      (#retail)
 *   restaurants  → RestaurantSolution.tsx  (#restaurants)
 *   fashion      → MultiSolutionOverview   (#multi-solutions)
 *   salons       → MultiSolutionOverview   (#multi-solutions)
 *   smes         → MultiSolutionOverview   (#multi-solutions)
 */
function getExploreTarget(industryId: string): string {
  if (industryId === "fashion" || industryId === "salons" || industryId === "smes") {
    return "multi-solutions";
  }
  return industryId;
}

/* ------------------------------------------------------------------ */
/* Data                                                               */
/* ------------------------------------------------------------------ */

const industries = [
  {
    id: "retail",
    name: "Retail",
    eyebrow: "RETAIL & SUPERMARKETS",
    title: "Complete Retail Management",
    description:
      "Manage sales, inventory, purchasing, warehouses and everyday retail operations from one connected platform.",
    features: [
      { label: "Fast POS Billing", note: "Under 3 seconds per bill" },
      { label: "Inventory Management", note: "Real-time stock sync" },
      { label: "Purchase Management", note: "Auto supplier orders" },
      { label: "Warehouse Control", note: "Multi-location ready" },
      { label: "Business Reports", note: "40+ ready reports" },
    ],
    stats: [
      { value: "3s", label: "Avg. billing" },
      { value: "40+", label: "Reports" },
      { value: "99.9%", label: "Uptime" },
    ],
    Icon: ShoppingBag,
    iconStyle: "bg-blue-100 text-blue-700",
    accent: "from-blue-500/10 to-blue-500/0",
  },
  {
    id: "restaurants",
    name: "Restaurants",
    eyebrow: "RESTAURANTS & CAFÉS",
    title: "Complete Restaurant Management",
    description:
      "Bring billing, tables, kitchen operations, inventory and restaurant reporting together in one simple system.",
    features: [
      { label: "Table & Counter Billing", note: "Split bills, merge tables" },
      { label: "Kitchen Order Management", note: "Live KOT to kitchen" },
      { label: "Menu Management", note: "Variants & modifiers" },
      { label: "Ingredient Inventory", note: "Recipe-level tracking" },
      { label: "Sales Reports", note: "Hourly heat maps" },
    ],
    stats: [
      { value: "12s", label: "To KOT" },
      { value: "0ms", label: "Sync lag" },
      { value: "24/7", label: "Support" },
    ],
    Icon: UtensilsCrossed,
    iconStyle: "bg-orange-100 text-orange-600",
    accent: "from-orange-500/10 to-orange-500/0",
  },
  {
    id: "fashion",
    name: "Fashion",
    eyebrow: "FASHION & CLOTHING",
    title: "Built for Fashion Retail",
    description:
      "Keep your clothing business organised with smarter product management, sales tracking and inventory visibility.",
    features: [
      { label: "Variant Management", note: "Size × colour matrix" },
      { label: "Fast Billing", note: "Barcode-first workflow" },
      { label: "Stock Tracking", note: "Per-outlet visibility" },
      { label: "Purchase Management", note: "Season-wise buying" },
      { label: "Business Reports", note: "Best-seller analytics" },
    ],
    stats: [
      { value: "10k+", label: "SKUs ready" },
      { value: "6×", label: "Variants" },
      { value: "1-click", label: "Restock" },
    ],
    Icon: Shirt,
    iconStyle: "bg-rose-100 text-rose-700",
    accent: "from-rose-500/10 to-rose-500/0",
  },
  {
    id: "salons",
    name: "Salons",
    eyebrow: "SALONS & BEAUTY",
    title: "Simplify Your Salon",
    description:
      "Manage services, sales, products and everyday salon operations with a system designed for growing businesses.",
    features: [
      { label: "Service Billing", note: "Packages & memberships" },
      { label: "Product Management", note: "Retail + in-salon" },
      { label: "Sales Tracking", note: "Stylist-wise reports" },
      { label: "Inventory Control", note: "Low-stock alerts" },
      { label: "Business Reports", note: "Repeat-rate insights" },
    ],
    stats: [
      { value: "0 no-shows", label: "With reminders" },
      { value: "2×", label: "Repeat visits" },
      { value: "Instant", label: "Checkout" },
    ],
    Icon: Scissors,
    iconStyle: "bg-emerald-100 text-emerald-700",
    accent: "from-emerald-500/10 to-emerald-500/0",
  },
  {
    id: "smes",
    name: "SMEs",
    eyebrow: "SMALL & MEDIUM BUSINESSES",
    title: "One System for Your Business",
    description:
      "Bring the essential parts of your business together and get a clearer view of your daily operations.",
    features: [
      { label: "Sales Management", note: "All counters, one view" },
      { label: "Inventory Control", note: "Across outlets" },
      { label: "Purchasing", note: "Supplier workflows" },
      { label: "Business Reports", note: "Owner dashboard" },
      { label: "Business Management", note: "Users & roles" },
    ],
    stats: [
      { value: "1 platform", label: "Everything" },
      { value: "₹0", label: "Setup cost" },
      { value: "30 days", label: "Free trial" },
    ],
    Icon: Store,
    iconStyle: "bg-amber-100 text-amber-700",
    accent: "from-amber-500/10 to-amber-500/0",
  },
];

/* ------------------------------------------------------------------ */
/* Per-feature reveal variants                                       */
/* ------------------------------------------------------------------ */

const FEATURE_ANIMS = [
  {
    from: { x: -60, opacity: 0 },
    to: {
      x: 0,
      opacity: 1,
      duration: 0.55,
      ease: "back.out(1.7)",
    },
  },
  {
    from: { x: 60, opacity: 0 },
    to: {
      x: 0,
      opacity: 1,
      duration: 0.5,
      ease: "power3.out",
    },
  },
  {
    from: { scale: 0.6, opacity: 0 },
    to: {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: "elastic.out(1, 0.65)",
    },
  },
  {
    from: { rotation: -8, y: 24, opacity: 0 },
    to: {
      rotation: 0,
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: "bounce.out",
    },
  },
  {
    from: { y: 30, opacity: 0, filter: "blur(6px)" },
    to: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration: 0.65,
      ease: "power3.out",
    },
  },
];

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export default function SolutionSelector() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeIndustry, setActiveIndustry] = useState("retail");
  const [isAnimating, setIsAnimating] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const active =
    industries.find((industry) => industry.id === activeIndustry) ??
    industries[0];

  /* ---------------------------------------------------------------- */
  /* Feature row animation                                             */
  /* ---------------------------------------------------------------- */

  const animateFeatures = useCallback(() => {
    const rows = gsap.utils.toArray<HTMLElement>(".feature-row");

    rows.forEach((row, i) => {
      const anim = FEATURE_ANIMS[i % FEATURE_ANIMS.length];

      gsap.fromTo(row, anim.from, anim.to);
    });
  }, []);

  /* ---------------------------------------------------------------- */
  /* Number load animation                                             */
  /* ---------------------------------------------------------------- */

  const animateNumbers = useCallback(() => {
    gsap.fromTo(
      ".rail-number",
      {
        y: -14,
        opacity: 0,
        rotationX: -90,
      },
      {
        y: 0,
        opacity: 1,
        rotationX: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "back.out(1.9)",
      }
    );

    gsap.fromTo(
      ".drawer-number",
      {
        y: -10,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.05,
        ease: "back.out(1.7)",
      }
    );

    gsap.fromTo(
      ".decorative-number",
      {
        scale: 0.5,
        opacity: 0,
        rotation: -8,
      },
      {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 0.7,
        ease: "back.out(1.6)",
      }
    );
  }, []);



  useEffect(() => {
    const refreshTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".selector-kicker",
        {
          opacity: 0,
          y: 14,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".selector-section",
            start: "top 90%",
            once: true,
          },
        }
      );

      /* ---------- decode text ---------- */
      gsap.to(".selector-decode", {
        text: {
          value: "SELECT YOUR INDUSTRY",
        },
        duration: 1.4,
        ease: "none",
        scrollTrigger: {
          trigger: ".selector-section",
          start: "top 88%",
          once: true,
        },
      });

      gsap.fromTo(
        ".selector-heading-line",
        {
          y: 40,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".selector-section",
            start: "top 88%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".selector-description",
        {
          y: 18,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          delay: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".selector-description",
            start: "top 92%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".rail-item",
        {
          x: (i) => (i % 2 === 0 ? -100 : 100),
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".industry-rail",
            start: "top 92%",
            once: true,
            onEnter: () => animateNumbers(),
          },
        }
      );

      gsap.fromTo(
        ".selector-result",
        {
          y: 40,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".selector-result",
            start: "top 92%",
            once: true,
            onEnter: () => {
              animateFeatures();
              animateNumbers();
            },
          },
        }
      );

      gsap.fromTo(
        ".selector-micro",
        {
          opacity: 0,
          y: 10,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".selector-micro",
            start: "top 96%",
            once: true,
          },
        }
      );

      /* ---------- BillPOS continuous stroke animation ---------- */

      gsap.set(".billpos-draw-text", {
        strokeDashoffset: 900,
      });

      gsap
        .timeline({
          repeat: -1,
          defaults: {
            ease: "power2.inOut",
          },
        })
        .to(".billpos-draw-text", {
          strokeDashoffset: 0,
          duration: 5.4,
        })
        .to(".billpos-draw-text", {
          strokeDashoffset: -900,
          duration: 5.4,
          delay: 5.4,
        })
        .set(".billpos-draw-text", {
          strokeDashoffset: 900,
        });

      /* ---------- floating button — visible only inside section ---------- */

      const floatBtn = document.querySelector(".floating-industry-btn");

      if (floatBtn) {
        gsap.set(floatBtn, {
          autoAlpha: 0,
          y: 24,
        });

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 95%",
          end: "bottom 5%",

          onEnter: () =>
            gsap.to(floatBtn, {
              autoAlpha: 1,
              y: 0,
              duration: 0.45,
              ease: "back.out(1.4)",
            }),

          onLeave: () =>
            gsap.to(floatBtn, {
              autoAlpha: 0,
              y: 24,
              duration: 0.3,
              ease: "power2.in",
            }),

          onEnterBack: () =>
            gsap.to(floatBtn, {
              autoAlpha: 1,
              y: 0,
              duration: 0.45,
              ease: "back.out(1.4)",
            }),

          onLeaveBack: () =>
            gsap.to(floatBtn, {
              autoAlpha: 0,
              y: 24,
              duration: 0.3,
              ease: "power2.in",
            }),
        });
      }
    }, sectionRef);

    return () => {
      window.clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, [animateFeatures, animateNumbers]);

  /* ---------------------------------------------------------------- */
  /* Refresh ScrollTrigger whenever route changes                      */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => cancelAnimationFrame(raf);
  });

  /* ---------------------------------------------------------------- */
  /* Industry switch                                                    */
  /* ---------------------------------------------------------------- */

  const switchIndustry = useCallback(
    (id: string) => {
      if (id === activeIndustry || isAnimating) return;

      setIsAnimating(true);

      const leftCol = document.querySelector(".result-left");
      const rightCol = document.querySelector(".result-right");

      if (!leftCol || !rightCol) {
        setActiveIndustry(id);
        setIsAnimating(false);
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          animateFeatures();
          animateNumbers();
          setIsAnimating(false);
        },
      });

      tl.to([leftCol, rightCol], {
        opacity: 0,
        y: 12,
        duration: 0.2,
        stagger: 0.04,
        ease: "power2.in",
      }).add(() => setActiveIndustry(id));

      requestAnimationFrame(() => {
        gsap.fromTo(
          [leftCol, rightCol],
          {
            opacity: 0,
            y: 12,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.06,
            ease: "power3.out",
          }
        );
      });
    },
    [
      activeIndustry,
      isAnimating,
      animateFeatures,
      animateNumbers,
    ]
  );

  /* ---------------------------------------------------------------- */
  /* Mobile drawer                                                     */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    if (!drawerOpen) return;

    const el = document.querySelector(".industry-drawer");
    const back = document.querySelector(".drawer-backdrop");

    if (!el || !back) return;

    gsap.fromTo(
      el,
      {
        y: "100%",
      },
      {
        y: "0%",
        duration: 0.4,
        ease: "power3.out",
      }
    );

    gsap.fromTo(
      back,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 0.25,
        ease: "power2.out",
      }
    );

    gsap.fromTo(
      ".drawer-item",
      {
        x: -20,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.35,
        stagger: 0.05,
        ease: "power3.out",
      }
    );

    gsap.fromTo(
      ".drawer-number",
      {
        y: -14,
        opacity: 0,
        rotationX: -90,
      },
      {
        y: 0,
        opacity: 1,
        rotationX: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "back.out(1.9)",
        delay: 0.1,
      }
    );
  }, [drawerOpen]);

  const closeDrawer = () => {
    const el = document.querySelector(".industry-drawer");
    const back = document.querySelector(".drawer-backdrop");

    if (!el || !back) {
      setDrawerOpen(false);
      return;
    }

    gsap.to(el, {
      y: "100%",
      duration: 0.3,
      ease: "power3.in",
      onComplete: () => setDrawerOpen(false),
    });

    gsap.to(back, {
      opacity: 0,
      duration: 0.25,
      ease: "power2.in",
    });
  };

  /* ---------------------------------------------------------------- */
  /* Render                                                            */
  /* ---------------------------------------------------------------- */

  return (
    <section
      id="SolutionSelecter"
      ref={sectionRef}
      className={`${sans.className} selector-section relative overflow-hidden bg-[#f8fafc] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24`}
    >
      <style>{`
        @keyframes float-y {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }

        .animate-float-y {
          animation: float-y 4s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-float-y {
            animation: none !important;
          }
        }
      `}</style>

      {/* ---------------- Background ---------------- */}

      <div className="pointer-events-none absolute left-1/2 top-0 h-[380px] w-[720px] -translate-x-1/2 rounded-full bg-blue-100/50 blur-[120px]" />

      <div className="pointer-events-none absolute -left-24 top-[40%] h-[240px] w-[240px] rounded-full bg-violet-200/25 blur-[100px]" />

      <div className="pointer-events-none absolute -right-24 top-[55%] h-[260px] w-[260px] rounded-full bg-sky-200/25 blur-[100px]" />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-slate-200" />

      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(30,64,175,.10) 1px, transparent 0)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse at center, black 25%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 25%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto max-w-[1200px]">
        {/* ---------------- Intro ---------------- */}

        <div className="mx-auto max-w-[760px] text-center">
          <div className="selector-kicker mb-4 flex justify-center">
            <h3
              className="selector-decode overflow-hidden font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-blue-700 sm:text-[11px]"
              aria-label="Select your industry"
            >
              XXXXXXXXXXXXXXXXX
            </h3>
          </div>

          <h2
            className={`${serif.className} selector-heading text-[34px] leading-[1.06] tracking-[-0.02em] text-[#111] sm:text-[46px] lg:text-[58px]`}
          >
            <span className="selector-heading-line block">
              Find the right solution
            </span>

            <span className="selector-heading-line block italic text-blue-700">
              for your business.
            </span>
          </h2>

          <p className="selector-description mx-auto mt-4 max-w-[580px] text-[13.5px] leading-7 text-slate-500 sm:text-[14.5px]">
            Every business works differently. Choose your industry and discover
            how BillPOS can simplify the way you manage your everyday
            operations.
          </p>
        </div>

        {/* ============================================================ */}
        {/* DESKTOP                                                        */}
        {/* ============================================================ */}

        <div className="mt-10 hidden lg:grid lg:grid-cols-[300px_1fr] lg:gap-8">
          {/* ---------------- LEFT RAIL ---------------- */}

          <aside className="industry-rail sticky top-24 self-start">
            <div className="mb-3 flex items-center justify-between px-1">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                Industries
              </span>

              <span className="text-[10px] font-medium text-slate-300">
                {industries.length} options
              </span>
            </div>

            <div className="space-y-2">
              {industries.map(({ id, name, Icon, iconStyle }, i) => {
                const isActive = activeIndustry === id;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => switchIndustry(id)}
                    className={`
                      rail-item group relative flex w-full items-center gap-3 overflow-hidden
                      rounded-2xl border px-4 py-3.5 text-left transition-all duration-300
                      ${
                        isActive
                          ? "border-blue-600 bg-blue-700 text-white shadow-[0_20px_45px_-25px_rgba(29,78,216,0.75)]"
                          : "border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_16px_35px_-22px_rgba(15,23,42,0.35)]"
                      }
                    `}
                  >
                    <span
                      className={`
                        rail-number w-6 shrink-0 font-mono text-[12px] font-bold transition-colors duration-300
                        ${isActive ? "text-white" : "text-slate-700"}
                      `}
                      style={{
                        transformStyle: "preserve-3d",
                      }}
                    >
                      0{i + 1}
                    </span>

                    <span
                      className={`
                        flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
                        transition-all duration-300
                        ${isActive ? "bg-white/15 text-white" : iconStyle}
                      `}
                    >
                      <Icon
                        className={`h-4 w-4 transition-transform duration-300 ${
                          isActive
                            ? "scale-110"
                            : "group-hover:scale-110"
                        }`}
                      />
                    </span>

                    <span
                      className={`flex-1 text-[13px] font-semibold tracking-[-0.01em] ${
                        isActive ? "text-white" : "text-slate-800"
                      }`}
                    >
                      {name}
                    </span>

                    <ArrowRight
                      className={`h-3.5 w-3.5 transition-all duration-300 ${
                        isActive
                          ? "translate-x-0 text-white opacity-90"
                          : "-translate-x-1 text-slate-300 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-white/70 p-4 backdrop-blur">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />

                <p className="text-[11px] font-semibold text-slate-700">
                  Need help choosing?
                </p>
              </div>

              <p className="mt-1.5 text-[10.5px] leading-5 text-slate-400">
                Talk to our team and we'll map the right setup for your
                workflow.
              </p>

              <Link
                href="/demo"
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#111] px-3.5 py-2 text-[11px] font-medium text-white transition hover:bg-blue-700"
              >
                Book a demo
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </aside>

          <div className="min-w-0">
            <DetailsPanel active={active} accent={active.accent} />
          </div>
        </div>

        {/* ============================================================ */}
        {/* MOBILE                                                         */}
        {/* ============================================================ */}

        <div className="mt-8 lg:hidden">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Now viewing
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-white px-3 py-1 text-[10.5px] font-semibold text-blue-700">
              <active.Icon className="h-3 w-3" />
              {active.name}
            </span>
          </div>

          <DetailsPanel
            active={active}
            accent={active.accent}
            mobile
          />
        </div>

        <div className="selector-micro mt-10 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-slate-300" />

          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
            One platform • Different workflows
          </p>

          <span className="h-px w-8 bg-slate-300" />
        </div>
      </div>

      {/* ============================================================ */}
      {/* FLOATING BUTTON — visible only inside section                 */}
      {/* ============================================================ */}

      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        className="
          floating-industry-btn fixed bottom-5 right-5 z-40 flex items-center gap-2
          rounded-full bg-blue-700 px-5 py-3.5 text-white
          shadow-[0_20px_40px_-15px_rgba(29,78,216,0.85)]
          transition hover:bg-blue-800 lg:hidden
          animate-float-y
        "
        aria-label="Select industry"
      >
        <Layers className="h-4 w-4" />

        <span className="text-[12.5px] font-semibold tracking-wide">
          Select Industry
        </span>

        <span className="ml-0.5 inline-flex h-5 items-center rounded-full bg-white/20 px-2 text-[10px] font-medium">
          {active.name}
        </span>
      </button>

      {/* ============================================================ */}
      {/* MOBILE DRAWER                                                 */}
      {/* ============================================================ */}

      {drawerOpen && (
        <>
          <div
            className="drawer-backdrop fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
            onClick={closeDrawer}
          />

          <div className="industry-drawer fixed inset-x-0 bottom-0 z-50 rounded-t-[26px] border-t border-slate-200 bg-white px-4 pb-8 pt-4 shadow-[0_-30px_60px_-30px_rgba(15,23,42,0.4)] lg:hidden">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200" />

            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Choose industry
                </p>

                <p
                  className={`${serif.className} mt-1 text-[20px] leading-none text-[#111]`}
                >
                  Select your business
                </p>
              </div>

              <button
                type="button"
                onClick={closeDrawer}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-800"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              {industries.map(
                ({ id, name, Icon, iconStyle }, i) => {
                  const isActive = activeIndustry === id;

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        switchIndustry(id);
                        closeDrawer();
                      }}
                      className={`
                        drawer-item group flex w-full items-center gap-3 rounded-2xl border
                        px-4 py-3.5 text-left transition-all duration-300
                        ${
                          isActive
                            ? "border-blue-600 bg-blue-700 text-white shadow-[0_18px_40px_-22px_rgba(29,78,216,0.7)]"
                            : "border-slate-200 bg-white text-slate-700 hover:border-blue-200"
                        }
                      `}
                    >
                      <span
                        className={`drawer-number w-6 shrink-0 font-mono text-[12px] font-bold ${
                          isActive
                            ? "text-white"
                            : "text-slate-700"
                        }`}
                        style={{
                          transformStyle: "preserve-3d",
                        }}
                      >
                        0{i + 1}
                      </span>

                      <span
                        className={`
                          flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
                          ${isActive ? "bg-white/15 text-white" : iconStyle}
                        `}
                      >
                        <Icon className="h-4 w-4" />
                      </span>

                      <span
                        className={`flex-1 text-[13.5px] font-semibold ${
                          isActive
                            ? "text-white"
                            : "text-slate-800"
                        }`}
                      >
                        {name}
                      </span>

                      {isActive ? (
                        <Check className="h-4 w-4 text-white" />
                      ) : (
                        <ChevronDown className="h-4 w-4 -rotate-90 text-slate-300" />
                      )}
                    </button>
                  );
                }
              )}
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
              <p className="text-[10.5px] leading-5 text-slate-500">
                Not sure which one fits? Our team can help you decide in under
                5 minutes.
              </p>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Details Panel                                                      */
/* ------------------------------------------------------------------ */

type Industry = (typeof industries)[number];

function DetailsPanel({
  active,
  accent,
  mobile = false,
}: {
  active: Industry;
  accent: string;
  mobile?: boolean;
}) {
  const index = industries.findIndex(
    (i) => i.id === active.id
  );

  return (
    <div
      className={`
        selector-result relative overflow-hidden bg-white
        ${
          mobile
            ? "rounded-[24px] border border-slate-200 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.35)]"
            : "rounded-[30px] border border-slate-200 shadow-[0_40px_90px_-45px_rgba(15,23,42,0.4)]"
        }
      `}
    >
      <div className="h-1 w-full bg-gradient-to-r from-blue-700 via-blue-500 to-sky-400" />

      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent}`}
      />

      <div
        className={`relative ${
          mobile
            ? "p-5"
            : "grid p-0 lg:grid-cols-[1fr_1fr]"
        }`}
      >
        {/* ---------------- LEFT ---------------- */}

        <div
          className={`result-left relative ${
            mobile ? "" : "p-8 lg:p-10"
          }`}
        >
          <div
            className={`decorative-number pointer-events-none absolute right-4 top-0 select-none font-bold leading-none ${
              mobile ? "text-[80px]" : "text-[130px]"
            }`}
            style={{
              color: "rgba(15, 23, 42, 0.06)",
              WebkitTextStroke:
                "1.5px rgba(15, 23, 42, 0.10)",
            }}
          >
            0{index + 1}
          </div>

          <div className="relative">
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center justify-center rounded-2xl ${
                  mobile ? "h-12 w-12" : "h-14 w-14"
                } ${active.iconStyle}`}
              >
                <active.Icon
                  className={
                    mobile ? "h-5 w-5" : "h-6 w-6"
                  }
                />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-700">
                  {active.eyebrow}
                </p>

                <span className="mt-1 inline-flex items-center gap-1 text-[10.5px] text-slate-400">
                  <Sparkles className="h-3 w-3" />
                  Tailored workflow
                </span>
              </div>
            </div>

            <h3
              className={`mt-5 font-semibold leading-[1.08] tracking-[-0.02em] text-[#111] ${
                mobile
                  ? "text-[22px]"
                  : "mt-6 max-w-[440px] text-[30px] lg:text-[34px]"
              }`}
            >
              {active.title}
            </h3>

            <p
              className={`mt-3 max-w-[520px] leading-7 text-slate-500 ${
                mobile ? "text-[12.5px]" : "mt-4 text-[13.5px]"
              }`}
            >
              {active.description}
            </p>

            <div
              className={`mt-5 grid grid-cols-3 gap-2.5 ${
                mobile ? "" : "mt-7 gap-3"
              }`}
            >
              {active.stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-left"
                >
                  <p
                    className={`font-semibold tracking-tight text-[#111] ${
                      mobile ? "text-[14px]" : "text-[16px]"
                    }`}
                  >
                    {s.value}
                  </p>

                  <p className="mt-0.5 text-[9.5px] font-medium uppercase tracking-wider text-slate-400">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* CTAs */}

            <div
              className={`mt-6 flex flex-wrap items-center gap-2.5 ${
                mobile ? "" : "mt-8"
              }`}
            >
              {/* ✅ FIXED: routes each industry to the right component
               *   retail      → #retail           (RetailSolution)
               *   restaurants → #restaurants      (RestaurantSolution)
               *   fashion     → #multi-solutions  (MultiSolutionOverview)
               *   salons      → #multi-solutions  (MultiSolutionOverview)
               *   smes        → #multi-solutions  (MultiSolutionOverview)
               */}
              <button
                type="button"
                onClick={() => scrollToId(getExploreTarget(active.id))}
                className="group inline-flex items-center gap-2 rounded-full bg-[#111] px-5 py-2.5 text-[12px] font-medium text-white transition hover:bg-blue-700"
              >
                Explore {active.name}

                <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>

              <Link
                href="/demo"
                prefetch={false}
                className="group inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-medium text-slate-700 transition hover:border-blue-300"
              >
                Book a demo

                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* ---------- BillPOS ---------- */}

            <div className="billpos-draw-wrapper mt-8 flex justify-center sm:justify-start">
              <svg
                viewBox="0 0 520 130"
                className="h-[120px] w-full max-w-[440px] sm:h-[130px] sm:max-w-[520px]"
                aria-label="BillPOS"
              >
                <text
                  x="260"
                  y="150"
                  textAnchor="middle"
                  className={`${serif.className} billpos-draw-text`}
                  style={{
                    fontSize: "200px",
                    fontWeight: 400,
                    fill: "transparent",
                    stroke: "#1d4ed8",
                    strokeWidth: 1.3,
                    strokeDasharray: 900,
                    strokeDashoffset: 900,
                    letterSpacing: "-0.02em",
                  }}
                >
                  BillPOS
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* ---------------- RIGHT ---------------- */}

        <div
          className={`
            result-right relative border-slate-100 bg-[#f8fafc]
            ${
              mobile
                ? "mt-6 rounded-2xl border p-4"
                : "border-l p-8 lg:p-10"
            }
          `}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Built around your workflow
              </p>

              <p
                className={`mt-2 font-semibold text-[#111] ${
                  mobile ? "text-[13.5px]" : "text-[15px]"
                }`}
              >
                What you can manage
              </p>
            </div>

            <span className="hidden h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            </span>
          </div>

          <div
            className={`space-y-2.5 ${
              mobile ? "mt-5" : "mt-6"
            }`}
          >
            {active.features.map((feature, i) => (
              <div
                key={feature.label}
                className="feature-row flex items-center gap-3 rounded-xl border border-transparent bg-white/60 px-3 py-2.5 backdrop-blur transition hover:border-slate-200 hover:bg-white"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-blue-700 shadow-sm">
                  <Check className="h-3.5 w-3.5" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-medium text-slate-800">
                    {feature.label}
                  </p>

                  <p className="mt-0.5 truncate text-[10.5px] text-slate-400">
                    {feature.note}
                  </p>
                </div>

                <span className="ml-auto font-mono text-[9px] text-slate-300">
                  0{i + 1}
                </span>
              </div>
            ))}
          </div>

          <div
            className={`mt-6 rounded-2xl border border-slate-200 bg-white p-4 ${
              mobile ? "mt-5" : "mt-7"
            }`}
          >
            <div className="mb-2.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                <TrendingUp className="h-3 w-3 text-blue-600" />
                This week
              </div>

              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9.5px] font-semibold text-emerald-700">
                +18%
              </span>
            </div>

            <div className="flex h-12 items-end gap-1.5">
              {[40, 62, 48, 75, 58, 90, 70].map(
                (h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-md bg-gradient-to-t from-blue-700 to-blue-400"
                    style={{
                      height: `${h}%`,
                    }}
                  />
                )
              )}
            </div>

            <div className="mt-2 flex justify-between text-[9px] text-slate-300">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>

          <div
            className={`border-t border-slate-200 pt-5 ${
              mobile ? "mt-5" : "mt-7"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Package className="h-3.5 w-3.5" />
              </span>

              <p className="text-[10.5px] leading-5 text-slate-400">
                One connected platform for sales, operations, inventory and
                business visibility — designed for how{" "}
                <span className="font-medium text-slate-600">
                  {active.name.toLowerCase()}
                </span>{" "}
                businesses actually run.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
