"use client";

/* ============================================================
 * BillPOS — Solutions Section
 * ------------------------------------------------------------
 * A high-polish, production-ready cards section featuring:
 *   • Directional GSAP scroll reveals
 *       - Left column cards: slide + spin from the left
 *       - Right column cards: slide + spin from the right
 *       - Middle column cards: bounce drop-in from above
 *   • Responsive column detection (1 / 2 / 3 columns)
 *   • Glassmorphic card surfaces with layered shadows
 *   • Cursor-tracked spotlight and micro-interactions
 *   • Tight vertical rhythm (no trailing whitespace)
 *   • Reliable closing statement reveal
 *   • Full `prefers-reduced-motion` support
 * ============================================================ */

import {
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  BarChart3,
  Boxes,
  Building2,
  Check,
  CreditCard,
  FileText,
  PackageCheck,
  Sparkles,
} from "lucide-react";

/* Register the ScrollTrigger plugin once at module load. */
gsap.registerPlugin(ScrollTrigger);

/* ============================================================
 * TYPES
 * ============================================================ */

/** Reveal direction determined by the card's grid column. */
type RevealDirection = "left" | "right" | "up";

/** Shape of a single solution module entry. */
type Solution = {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  features: string[];
  icon: ReactNode;
  /** RGB triplet used to drive the cursor-tracked spotlight. */
  glow: string;
};

/* ============================================================
 * DATA
 * ============================================================ */

const solutions: Solution[] = [
  {
    number: "01",
    eyebrow: "SALES",
    title: "Sales Management",
    description:
      "Handle billing, quotations, returns and every customer transaction from one connected workspace.",
    features: ["POS billing", "Quotations", "Returns"],
    icon: <CreditCard size={17} strokeWidth={1.8} />,
    glow: "59, 130, 246",
  },
  {
    number: "02",
    eyebrow: "INVENTORY",
    title: "Inventory Management",
    description:
      "Know what is available, what is moving and what needs attention across your daily operations.",
    features: ["Stock visibility", "Adjustments", "Warehouses"],
    icon: <Boxes size={17} strokeWidth={1.8} />,
    glow: "56, 189, 248",
  },
  {
    number: "03",
    eyebrow: "PURCHASES",
    title: "Purchase Management",
    description:
      "Keep suppliers, purchases and incoming stock within one clear, controlled workflow.",
    features: ["Purchase records", "Suppliers", "Returns"],
    icon: <PackageCheck size={17} strokeWidth={1.8} />,
    glow: "99, 102, 241",
  },
  {
    number: "04",
    eyebrow: "REPORTING",
    title: "Business Reports",
    description:
      "Turn everyday transactions into clear business insight across sales and performance.",
    features: ["Sales reports", "Insights", "Visibility"],
    icon: <BarChart3 size={17} strokeWidth={1.8} />,
    glow: "34, 211, 238",
  },
  {
    number: "05",
    eyebrow: "OPERATIONS",
    title: "Multi-Store & Warehouse",
    description:
      "Run multiple locations through one connected platform and stay structured as you grow.",
    features: ["Locations", "Warehouses", "Central control"],
    icon: <Building2 size={17} strokeWidth={1.8} />,
    glow: "96, 165, 250",
  },
  {
    number: "06",
    eyebrow: "CONTROL",
    title: "Business Control",
    description:
      "Bring your essential information together so you can make faster, smarter decisions.",
    features: ["Connected data", "Operations", "Decisions"],
    icon: <FileText size={17} strokeWidth={1.8} />,
    glow: "139, 92, 246",
  },
];

/* ============================================================
 * UTILITIES
 * ============================================================ */

/**
 * Resolve the reveal direction for a card based on its position
 * within the responsive grid.
 *
 * @param index   Zero-based index of the card within the list.
 * @param columns Current number of grid columns (1, 2, or 3).
 */
function getRevealDirection(
  index: number,
  columns: number
): RevealDirection {
  // Mobile: every card drops in from above.
  if (columns <= 1) return "up";

  // Tablet: alternate left / right across two columns.
  if (columns === 2) {
    return index % 2 === 0 ? "left" : "right";
  }

  // Desktop (3 columns): outer columns slide in, middle drops in.
  const column = index % 3;
  if (column === 0) return "left";
  if (column === 2) return "right";
  return "up";
}

/**
 * Build the initial (pre-reveal) transform values for a card.
 * Left/right cards carry a rotational tilt to enhance the spin.
 * Middle cards drop straight down with a subtle spin and bounce.
 */
function getInitialState(direction: RevealDirection) {
  switch (direction) {
    case "left":
      return {
        x: -140,
        y: 24,
        rotate: -10,
        scale: 0.92,
        opacity: 0,
      };
    case "right":
      return {
        x: 140,
        y: 24,
        rotate: 10,
        scale: 0.92,
        opacity: 0,
      };
    case "up":
    default:
      return {
        x: 0,
        y: -110,
        rotate: -4,
        scale: 0.94,
        opacity: 0,
      };
  }
}

/**
 * Select the GSAP ease tailored to each reveal direction.
 * The "up" (middle) reveal uses an overshoot ease to produce
 * a natural bouncing drop-in.
 */
function getEase(direction: RevealDirection) {
  return direction === "up" ? "back.out(1.75)" : "power4.out";
}

/* ============================================================
 * SOLUTION CARD
 * ============================================================ */

type SolutionCardProps = {
  item: Solution;
  index: number;
  columns: number;
};

function SolutionCard({ item, index, columns }: SolutionCardProps) {
  const cardRef = useRef<HTMLElement | null>(null);

  /* --------------------------------------------------------
   * Entrance animation
   * ------------------------------------------------------ */
  useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const ctx = gsap.context(() => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      /* Skip entrance choreography when reduced motion is on. */
      if (reduce) {
        gsap.set(card, { clearProps: "all" });
        return;
      }

      const direction = getRevealDirection(index, columns);
      const from = getInitialState(direction);

      /* Apply the pre-reveal state immediately so cards do not
       * flash in their final position before the trigger fires. */
      gsap.set(card, from);

      gsap.to(card, {
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        opacity: 1,
        duration: direction === "up" ? 1.25 : 1.1,
        ease: getEase(direction),
        delay: (index % columns) * 0.06,
        scrollTrigger: {
          trigger: card,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      });
    }, card);

    return () => ctx.revert();
  }, [index, columns]);

  /* --------------------------------------------------------
   * Cursor-tracked spotlight coordinates
   * ------------------------------------------------------ */
  const handlePointerMove = (event: React.MouseEvent<HTMLElement>) => {
    const card = cardRef.current;
    if (!card) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    card.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  return (
    <article
      ref={cardRef}
      onMouseMove={handlePointerMove}
      className="sol-card group relative isolate flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 p-5 backdrop-blur-xl transition-all duration-500 ease-out will-change-transform hover:-translate-y-1.5 hover:border-blue-300/80 hover:bg-white/90 hover:shadow-[0_2px_4px_rgba(15,23,42,0.05),0_22px_50px_-22px_rgba(37,99,235,0.38),0_36px_80px_-48px_rgba(37,99,235,0.28)] sm:p-6"
      style={{
        /* Fallback layered shadow when not hovering. */
        boxShadow:
          "0 1px 2px rgba(15,23,42,0.04), 0 10px 30px -18px rgba(15,23,42,0.16)",
      }}
    >
      {/* --------------------------------------------------
       * Cursor-tracked spotlight (radial gradient overlay)
       * -------------------------------------------------- */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(${item.glow}, 0.13), transparent 65%)`,
        }}
      />

      {/* --------------------------------------------------
       * Top accent line — draws across on hover
       * -------------------------------------------------- */}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-[2.5px] w-0 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-200 transition-all duration-700 ease-out group-hover:w-full"
      />

      {/* --------------------------------------------------
       * Soft corner bloom
       * -------------------------------------------------- */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-blue-100/0 blur-3xl transition-all duration-700 group-hover:bg-blue-200/60"
      />

      {/* --------------------------------------------------
       * Header row — icon chip (static) + number
       * Icon hover flip has been intentionally removed.
       * -------------------------------------------------- */}
      <div className="relative flex items-start justify-between">
        <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/60 text-blue-600 ring-1 ring-inset ring-blue-100/90">
          {item.icon}
        </span>

        <span className="font-mono text-[10px] font-medium tracking-[0.22em] text-slate-300 transition-colors duration-500 group-hover:text-blue-500">
          {item.number}
        </span>
      </div>

      {/* --------------------------------------------------
       * Body — eyebrow, title, description
       * -------------------------------------------------- */}
      <div className="relative mt-6">
        <span className="text-[10px] font-semibold tracking-[0.26em] text-blue-600">
          {item.eyebrow}
        </span>

        <h3 className="mt-2 text-[19px] font-semibold leading-tight tracking-[-0.02em] text-slate-900">
          {item.title}
        </h3>

        <p className="mt-3 text-[13.5px] leading-6 text-slate-500">
          {item.description}
        </p>
      </div>

      {/* --------------------------------------------------
       * Feature pills
       * -------------------------------------------------- */}
      <div className="relative mt-auto pt-6">
        <div className="flex flex-wrap gap-1.5">
          {item.features.map((feature) => (
            <span
              key={feature}
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-50/90 px-2.5 py-1 text-[11px] font-medium text-slate-500 ring-1 ring-inset ring-slate-200/80 transition-all duration-500 group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:ring-blue-100"
            >
              <Check
                size={10}
                strokeWidth={3}
                className="text-blue-500"
              />
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* --------------------------------------------------
       * Corner arrow — fades in on hover
       * -------------------------------------------------- */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-5 right-5 flex h-7 w-7 translate-y-1 translate-x-1 items-center justify-center rounded-full border border-slate-200/90 bg-white/80 text-slate-300 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:border-blue-200 group-hover:text-blue-600 group-hover:opacity-100"
      >
        <ArrowUpRight size={13} strokeWidth={1.9} />
      </span>
    </article>
  );
}

/* ============================================================
 * SOLUTIONS SECTION
 * ============================================================ */

export default function SolutionSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const closingRef = useRef<HTMLDivElement | null>(null);

  /* --------------------------------------------------------
   * Responsive column tracking
   * Drives per-card reveal direction (and stagger).
   * ------------------------------------------------------ */
  const [columns, setColumns] = useState<number>(3);

  useEffect(() => {
    const computeColumns = () => {
      const w = window.innerWidth;
      if (w < 640) setColumns(1);
      else if (w < 1024) setColumns(2);
      else setColumns(3);
    };

    computeColumns();
    window.addEventListener("resize", computeColumns);
    return () => window.removeEventListener("resize", computeColumns);
  }, []);

  /* --------------------------------------------------------
   * Header + rule choreography
   * ------------------------------------------------------ */
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      /* Reduced-motion: reveal everything instantly. */
      if (reduce) {
        gsap.set(
          [
            ".sol-eyebrow",
            ".sol-line",
            ".sol-intro",
            ".sol-meta",
            ".sol-rule",
          ],
          { clearProps: "all" }
        );
        return;
      }

      const eyebrow = section.querySelector(".sol-eyebrow");
      const lines = gsap.utils.toArray<HTMLElement>(".sol-line", section);
      const intro = section.querySelector(".sol-intro");
      const meta = section.querySelector(".sol-meta");
      const rule = section.querySelector(".sol-rule");

      /* ── Header intro timeline ────────────────────────── */
      gsap.set(eyebrow, { opacity: 0, y: 14 });
      gsap.set(lines, { yPercent: 116 });
      gsap.set(intro, { opacity: 0, y: 22 });
      gsap.set(meta, { opacity: 0, y: 16 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        })
        .to(eyebrow, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
        })
        .to(
          lines,
          {
            yPercent: 0,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.08,
          },
          "-=0.25"
        )
        .to(
          intro,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.7"
        )
        .to(
          meta,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.5"
        );

      /* ── Gradient rule draw-in ────────────────────────── */
      if (rule) {
        gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
        gsap.to(rule, {
          scaleX: 1,
          duration: 1.1,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: rule,
            start: "top 92%",
            toggleActions: "play none none reverse",
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  /* --------------------------------------------------------
   * Closing statement choreography
   * ------------------------------------------------------
   * Uses the closing container itself as the trigger with
   * a generous "top 85%" start position. This is far more
   * reliable than the previous "section bottom 94%" approach,
   * which could fail to fire on short viewports or when the
   * section never scrolls far enough for the bottom to cross
   * 94% of the viewport.
   * ------------------------------------------------------ */
  useLayoutEffect(() => {
    const closing = closingRef.current;
    if (!closing) return;

    const ctx = gsap.context(() => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const finalLines = gsap.utils.toArray<HTMLElement>(
        ".sol-final-line",
        closing
      );
      const finalBits = gsap.utils.toArray<HTMLElement>(
        ".sol-final",
        closing
      );

      /* Reduced-motion: reveal instantly. */
      if (reduce) {
        gsap.set([...finalLines, ...finalBits], { clearProps: "all" });
        return;
      }

      gsap.set(finalLines, { yPercent: 116 });
      gsap.set(finalBits, { opacity: 0, y: 22 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: closing,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })
        .to(finalLines, {
          yPercent: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.09,
        })
        .to(
          finalBits,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.08,
          },
          "-=0.7"
        );
    }, closing);

    return () => ctx.revert();
  }, []);

  /* --------------------------------------------------------
   * Recalculate ScrollTrigger positions once the entrance
   * animations register (prevents spacing drift on fonts /
   * lazy-loaded assets).
   * ------------------------------------------------------ */
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 250);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="solutions"
      className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-blue-50/60"
    >
      {/* =====================================================
       * BACKGROUND DETAILS
       * ===================================================== */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Fine grid pattern with radial mask */}
        <div
          className="absolute inset-0 opacity-[0.55]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(15,23,42,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.035) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage:
              "radial-gradient(ellipse at 50% 0%, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 50% 0%, black 30%, transparent 75%)",
          }}
        />

        {/* Soft blue bloom at the top */}
        <div className="absolute -top-40 left-1/2 h-[520px] w-[1100px] -translate-x-1/2 rounded-full bg-blue-300/[0.18] blur-[160px]" />

        {/* Editorial side rules */}
        <div className="absolute inset-y-0 left-[6%] w-px bg-slate-200/70" />
        <div className="absolute inset-y-0 right-[6%] w-px bg-slate-200/70" />

        {/* Ghost section number */}
        <div className="absolute -right-4 top-16 select-none font-mono text-[14rem] font-medium leading-none tracking-[-0.12em] text-blue-900/[0.035] sm:text-[18rem] lg:right-[3%] lg:text-[22rem]">
          02
        </div>
      </div>

      <div className="relative mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12">
        {/* =====================================================
         * HEADER
         * ===================================================== */}
        <header className="pt-24 sm:pt-32 lg:pt-40">
          <div className="grid lg:grid-cols-12 lg:gap-12">
            {/* Left — eyebrow + heading */}
            <div className="lg:col-span-7">
              <div className="sol-eyebrow flex items-center gap-3">
                <span className="h-px w-9 bg-blue-500" />
                <span className="text-[10px] font-semibold tracking-[0.32em] text-blue-600">
                  THE SOLUTION
                </span>
              </div>

              <h2 className="mt-7 text-[clamp(2.5rem,6.4vw,6.2rem)] font-medium leading-[0.94] tracking-[-0.06em] text-slate-900">
                <span className="block overflow-hidden py-[0.08em] -my-[0.08em]">
                  <span className="sol-line block">Everything</span>
                </span>
                <span className="block overflow-hidden py-[0.08em] -my-[0.08em]">
                  <span className="sol-line block text-blue-600">
                    connected.
                  </span>
                </span>
              </h2>
            </div>

            {/* Right — intro + meta */}
            <div className="mt-10 lg:col-span-5 lg:mt-0 lg:flex lg:flex-col lg:justify-end lg:pb-3">
              <p className="sol-intro max-w-md text-[15px] leading-7 text-slate-500">
                BillPOS brings the essential parts of your business into one
                connected system — helping your team work with clearer
                information and better control.
              </p>

              <div className="sol-meta mt-8 flex items-center gap-3 border-t border-slate-200 pt-5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-100">
                  <Sparkles size={11} strokeWidth={1.9} />
                </span>
                <span className="font-mono text-[9.5px] tracking-[0.28em] text-slate-400">
                  SIX CONNECTED MODULES
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* =====================================================
         * GRADIENT RULE
         * ===================================================== */}
        <div className="sol-rule mt-14 h-px w-full bg-gradient-to-r from-blue-500/70 via-slate-200 to-transparent sm:mt-16" />

        {/* =====================================================
         * CARD GRID
         * --------------------------------------------------
         * 1 col (mobile) · 2 cols (tablet) · 3 cols (desktop)
         * Reveal direction is derived per-card from its column.
         * ===================================================== */}
        <div
          ref={gridRef}
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-5"
        >
          {solutions.map((item, index) => (
            <SolutionCard
              key={item.number}
              item={item}
              index={index}
              columns={columns}
            />
          ))}
        </div>

        {/* =====================================================
         * CLOSING STATEMENT
         * --------------------------------------------------
         * Tight vertical rhythm so the section flows directly
         * into the next one without trailing whitespace.
         * Animation is triggered from this container itself
         * (see closingRef effect above) for reliable firing.
         * ===================================================== */}
        <div
          ref={closingRef}
          className="relative pb-16 pt-20 sm:pb-20 sm:pt-24 lg:pb-24 lg:pt-28"
        >
          <div className="grid lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-8">
              <h3 className="text-[clamp(2.1rem,5.4vw,5.4rem)] font-medium leading-[0.95] tracking-[-0.055em] text-slate-900">
                <span className="block overflow-hidden py-[0.08em] -my-[0.08em]">
                  <span className="sol-final-line block">One system.</span>
                </span>
                <span className="block overflow-hidden py-[0.08em] -my-[0.08em]">
                  <span className="sol-final-line block text-blue-600">
                    One connected business.
                  </span>
                </span>
              </h3>
            </div>

            <div className="mt-8 lg:col-span-4 lg:mt-0 lg:flex lg:items-end lg:pb-3">
              <p className="sol-final max-w-sm text-sm leading-7 text-slate-500">
                Every part of your operation becomes part of the same
                business picture — from the first sale to the final report.
              </p>
            </div>
          </div>

          <div className="sol-final mt-12 flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-slate-400">
              Connected by BillPOS
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}