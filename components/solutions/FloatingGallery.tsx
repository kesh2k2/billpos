"use client";

import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";

/* =======================================================
   DATA  (edit freely)
======================================================= */

export interface ShowcaseItem {
  src?: string;
  link?: string;
  title: string;
  category: string;
  description: string;
  chips: string[];
  accent: string; // glow colour for this slide
}

const DEFAULT_ITEMS: ShowcaseItem[] = [
  {
    src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1000&q=85",
    title: "Sales & Billing",
    category: "Core operations",
    description: "Fast and reliable billing for everyday business operations.",
    chips: ["Quick checkout", "Receipts", "Multiple payment types"],
    accent: "#3B82F6",
  },
  {
    src: "https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&w=1000&q=85",
    title: "Inventory Management",
    category: "Stock control",
    description:
      "Keep track of products, stock levels and daily inventory movement.",
    chips: ["Live stock levels", "Low-stock alerts", "Product catalogue"],
    accent: "#22D3EE",
  },
  {
    src: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1000&q=85",
    title: "Purchase Management",
    category: "Purchasing",
    description:
      "Manage purchasing and supplier operations from one connected system.",
    chips: ["Supplier records", "Purchase orders", "Stock-in"],
    accent: "#A78BFA",
  },
  {
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=85",
    title: "Business Reports",
    category: "Business insights",
    description:
      "Understand sales and business performance with useful reports.",
    chips: ["Daily sales", "Profit overview", "Best sellers"],
    accent: "#34D399",
  },
  {
    src: "https://images.unsplash.com/photo-1556741533-411cf82e4e2d?auto=format&fit=crop&w=1000&q=85",
    title: "Warehouse & Stores",
    category: "Business control",
    description:
      "Manage multiple locations and keep your operations organized.",
    chips: ["Multi-location", "Stock transfers", "Store-wise view"],
    accent: "#FBBF24",
  },
  {
    // the old ID for this image was malformed (404) – replaced
    src: "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=1000&q=85",
    title: "Customer Management",
    category: "Customer operations",
    description:
      "Keep customer information connected to your daily sales operations.",
    chips: ["Customer profiles", "Purchase history", "Credit tracking"],
    accent: "#F472B6",
  },
];

const AUTOPLAY_MS = 5200;

/* =======================================================
   HELPERS
======================================================= */

function wrapOffset(i: number, active: number, n: number) {
  let d = i - active;
  if (d > n / 2) d -= n;
  if (d < -n / 2) d += n;
  return d;
}

function ArrowIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ transform: dir === "left" ? "scaleX(-1)" : undefined }}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/* =======================================================
   SLIDE  (one 3D card)
======================================================= */

function Slide({
  item,
  offset,
  onSelect,
  draggedRef,
}: {
  item: ShowcaseItem;
  offset: number;
  onSelect: () => void;
  draggedRef: React.MutableRefObject<boolean>;
}) {
  const abs = Math.abs(offset);
  const isActive = offset === 0;
  const [failed, setFailed] = useState(false);

  const glareRef = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 160, damping: 18 });
  const sry = useSpring(ry, { stiffness: 160, damping: 18 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isActive || e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    rx.set((0.5 - py) * 12);
    ry.set((px - 0.5) * 14);
    if (glareRef.current) {
      glareRef.current.style.background = `radial-gradient(420px circle at ${
        px * 100
      }% ${py * 100}%, rgba(255,255,255,0.28), transparent 45%)`;
      glareRef.current.style.opacity = "1";
    }
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    if (glareRef.current) glareRef.current.style.opacity = "0";
  };

  const handleClick = () => {
    if (draggedRef.current) return;
    if (!isActive) return onSelect();
    if (item.link) window.open(item.link, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{
        width: "var(--w)",
        height: "calc(var(--w) * 1.28)",
        marginLeft: "calc(var(--w) / -2)",
        marginTop: "calc(var(--w) * -0.64)",
        zIndex: 10 - abs,
        pointerEvents: abs > 2 ? "none" : "auto",
      }}
      initial={false}
      animate={{
        x: `${offset * 66}%`,
        z: -abs * 130,
        rotateY: -offset * 30,
        scale: 1 - abs * 0.09,
        opacity: abs > 2 ? 0 : 1 - abs * 0.28,
        filter: `brightness(${1 - abs * 0.3})`,
      }}
      transition={{ type: "spring", stiffness: 140, damping: 20, mass: 0.9 }}
    >
      <motion.div
        role="button"
        tabIndex={abs > 2 ? -1 : 0}
        aria-label={isActive ? item.title : `Show ${item.title}`}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="group relative h-full w-full cursor-pointer select-none overflow-hidden rounded-[28px] border border-white/20 bg-white/[0.06] outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        style={{
          rotateX: srx,
          rotateY: sry,
          transformPerspective: 900,
          boxShadow: isActive
            ? `0 40px 90px -20px ${item.accent}66, 0 20px 50px rgba(0,0,0,0.45)`
            : "0 20px 50px rgba(0,0,0,0.4)",
        }}
      >
        {/* image */}
        {item.src && !failed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.src}
            alt={item.title}
            draggable={false}
            onError={() => setFailed(true)}
            className="pointer-events-none h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            style={{ filter: "saturate(1.05) contrast(1.04)" }}
          />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background: `linear-gradient(145deg, ${item.accent}, #071A2D)`,
            }}
          />
        )}

        {/* tint + readability gradient */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: `linear-gradient(to top, rgba(4,14,26,0.92) 0%, rgba(4,14,26,0.35) 38%, transparent 65%), linear-gradient(160deg, ${item.accent}33, transparent 50%)`,
          }}
        />

        {/* glare */}
        <div
          ref={glareRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
          style={{ mixBlendMode: "overlay" }}
        />

        {/* glass caption */}
        <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-2xl border border-white/15 bg-[#071A2D]/55 p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-xl">
          <div className="mb-1.5 flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: item.accent,
                boxShadow: `0 0 10px ${item.accent}`,
              }}
            />
            <span className="text-[11px] font-medium text-white/70">
              {item.category}
            </span>
          </div>
          <div className="text-[15px] font-semibold leading-tight tracking-[-0.02em] text-white sm:text-base">
            {item.title}
          </div>
        </div>

        {/* shine border */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[28px]"
          style={{
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

/* =======================================================
   GALLERY
======================================================= */

export function ShowcaseGallery({
  items = DEFAULT_ITEMS,
}: {
  items?: ShowcaseItem[];
}) {
  const n = items.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  const progressRef = useRef<HTMLDivElement>(null);
  const elapsedRef = useRef(0);
  const draggedRef = useRef(false);
  const downX = useRef<number | null>(null);

  const go = useCallback(
    (to: number) => setActive(((to % n) + n) % n),
    [n]
  );
  const next = useCallback(() => setActive((a) => (a + 1) % n), [n]);
  const prev = useCallback(() => setActive((a) => (a - 1 + n) % n), [n]);

  /* reduced motion */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* reset progress whenever slide changes */
  useEffect(() => {
    elapsedRef.current = 0;
    if (progressRef.current) progressRef.current.style.transform = "scaleX(0)";
  }, [active]);

  /* autoplay with progress */
  useEffect(() => {
    if (reduced || paused) return;
    let raf = 0;
    const start = performance.now() - elapsedRef.current;

    const tick = (now: number) => {
      const e = now - start;
      elapsedRef.current = e;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${Math.min(
          1,
          e / AUTOPLAY_MS
        )})`;
      }
      if (e >= AUTOPLAY_MS) {
        next();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, paused, reduced, next]);

  /* swipe / drag */
  const onPointerDown = (e: React.PointerEvent) => {
    downX.current = e.clientX;
    draggedRef.current = false;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (downX.current === null) return;
    const dx = e.clientX - downX.current;
    downX.current = null;
    if (Math.abs(dx) > 8) {
      draggedRef.current = true;
      setTimeout(() => (draggedRef.current = false), 50);
    }
    if (dx < -50) next();
    else if (dx > 50) prev();
  };

  const current = items[active];

  return (
    <div
      onPointerEnter={(e) => e.pointerType !== "touch" && setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      className="relative"
    >
      {/* accent glow that follows the active slide */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[38%] -z-10 h-[360px] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px]"
        animate={{ backgroundColor: current.accent }}
        style={{ opacity: 0.38 }}
        transition={{ duration: 0.9 }}
      />

      {/* ---------- STAGE ---------- */}
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="BillPOS features"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") next();
          if (e.key === "ArrowLeft") prev();
        }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        className="relative h-[400px] touch-pan-y overflow-hidden outline-none [--w:230px] sm:h-[480px] sm:[--w:290px] lg:h-[540px] lg:[--w:330px]"
        style={{ perspective: 1400, perspectiveOrigin: "50% 45%" }}
      >
        {/* giant ghost title */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[6%] z-0 flex justify-center"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -24, filter: "blur(8px)" }}
              transition={{ duration: 0.45 }}
              className="whitespace-nowrap text-center text-[clamp(52px,11vw,150px)] font-bold leading-none tracking-[-0.06em]"
              style={{
                color: "transparent",
                WebkitTextStroke: "1.5px rgba(255,255,255,0.12)",
              }}
            >
              {current.title.split(" ")[0]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* cards */}
        <div
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          {items.map((item, i) => (
            <Slide
              key={item.title}
              item={item}
              offset={wrapOffset(i, active, n)}
              onSelect={() => go(i)}
              draggedRef={draggedRef}
            />
          ))}
        </div>

        {/* floor glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 left-1/2 h-10 w-[55%] -translate-x-1/2 rounded-[50%] bg-black/50 blur-2xl"
        />
      </div>

      {/* ---------- INFO BAR ---------- */}
      <div className="relative z-10 mx-auto mt-2 flex max-w-4xl flex-col items-center gap-5 px-2 pb-2 sm:mt-4 md:flex-row md:items-center md:justify-between md:gap-8">
        {/* text */}
        <div className="min-h-[112px] w-full text-center md:min-h-[96px] md:text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <p className="max-w-md text-sm leading-6 text-white/65 sm:text-[15px] md:max-w-lg">
                {current.description}
              </p>

              <div className="mt-3.5 flex flex-wrap justify-center gap-2 md:justify-start">
                {current.chips.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-white/15 bg-white/[0.07] px-3 py-1 text-[11px] font-medium text-white/80 backdrop-blur-md"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* controls */}
        <div className="flex shrink-0 items-center gap-4">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.07] text-white backdrop-blur-xl transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <ArrowIcon dir="left" />
          </button>

          <div className="flex items-center gap-1.5" role="tablist">
            {items.map((it, i) => {
              const on = i === active;
              return (
                <button
                  key={it.title}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-label={it.title}
                  onClick={() => go(i)}
                  className="relative h-1.5 overflow-hidden rounded-full bg-white/20 transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  style={{ width: on ? 40 : 8 }}
                >
                  {on && (
                    <div
                      ref={progressRef}
                      className="absolute inset-0 origin-left rounded-full"
                      style={{
                        background: it.accent,
                        transform: reduced ? "scaleX(1)" : "scaleX(0)",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="Next"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.07] text-white backdrop-blur-xl transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <ArrowIcon dir="right" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* =======================================================
   SECTION  (glass background + heading + gallery)
======================================================= */

export default function BillPOSGallerySection() {
  return (
    <section
      id="system"
      className="relative isolate overflow-hidden bg-[#050F1C] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28"
    >
      {/* ---------- BACKGROUND ---------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0E2C4D_0%,#071A2D_45%,#040C17_100%)]" />

        <div className="absolute -left-24 top-10 h-[420px] w-[420px] rounded-full bg-blue-500/30 blur-[120px]" />
        <div className="absolute right-[-120px] top-1/3 h-[460px] w-[460px] rounded-full bg-cyan-400/20 blur-[130px]" />
        <div className="absolute bottom-[-140px] left-1/3 h-[420px] w-[520px] rounded-full bg-indigo-500/25 blur-[140px]" />

        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />

        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* ---------- HEADING ---------- */}
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-300">
            One connected system
          </p>

          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
            Everything your business needs.
            <span className="block text-blue-300">In one place.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
            From billing and inventory to purchasing, reporting and business
            control — BillPOS brings your everyday operations together.
          </p>
        </div>

        {/* ---------- GLASS PANEL + GALLERY ---------- */}
        <div className="relative mx-auto w-full max-w-6xl">
          <div
            aria-hidden="true"
            className="absolute -inset-4 -z-10 rounded-[48px] bg-gradient-to-b from-blue-400/20 via-transparent to-cyan-300/10 blur-2xl"
          />

          <div className="relative overflow-hidden rounded-[36px] border border-white/15 bg-white/[0.04] px-2 pb-6 pt-4 shadow-[0_30px_80px_rgba(3,15,28,0.45),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-2xl sm:px-6 sm:pb-8 sm:pt-6">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[36px] bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.02)_35%,rgba(255,255,255,0)_60%,rgba(140,200,255,0.08)_100%)]"
            />

            <ShowcaseGallery />
          </div>
        </div>
      </div>
    </section>
  );
}