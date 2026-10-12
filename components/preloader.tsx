"use client";

/* ============================================================
 * Preloader — BillPOS
 * ------------------------------------------------------------
 * Two modes:
 *
 *   • "full"    (home page)
 *       — B outline + orbiting icons + "BillPOS" letters
 *       — slim progress bar synced with the pour
 *       — slow cinematic pour (~4.2s)
 *
 *   • "minimal" (every other page)
 *       — ONLY the orbiting POS icons + the B filling with ink
 *       — NO "BillPOS" text, NO progress bar
 *       — fast pour (~1.4s)
 * ============================================================ */

import { useLayoutEffect, useRef } from "react";
import { Cormorant_Garamond, Jost } from "next/font/google";
import gsap from "gsap";
import {
  ShoppingCart,
  Boxes,
  ReceiptText,
  BarChart3,
  WalletCards,
  CreditCard,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Fonts                                                              */
/* ------------------------------------------------------------------ */

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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

const torn =
  "polygon(0 0,100% 0,100% 92%,96% 97%,92% 91%,88% 98%,84% 92%,80% 97%,76% 91%,72% 98%,68% 92%,64% 97%,60% 91%,56% 98%,52% 92%,48% 97%,44% 91%,40% 98%,36% 92%,32% 97%,28% 91%,24% 98%,20% 92%,16% 97%,12% 91%,8% 98%,4% 92%,0 97%)";

const tapeClip =
  "polygon(0 0,4% 20%,0 40%,4% 60%,0 80%,3% 100%,100% 100%,96% 80%,100% 60%,96% 40%,100% 20%,97% 0)";

function Tape({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute z-20 h-6 w-20 border-y border-white/60 bg-[#cfe5f6]/75 ${className}`}
      style={{ clipPath: tapeClip }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Props + speed presets                                              */
/* ------------------------------------------------------------------ */

export type PreloaderMode = "full" | "minimal";

type PreloaderProps = {
  onReveal: () => void;
  onComplete: () => void;
  label?: string;
  /** "full" for home, "minimal" for every other page. */
  mode?: PreloaderMode;
};

/**
 * All animation durations live here so both modes stay in sync
 * from a single source of truth.
 */
const SPEED = {
  full: {
    bIn: 0.35,
    blobsIn: 0.35,
    orbsIn: 0.28,
    orbsStagger: 0.035,
    lettersIn: 0.38,
    lettersStagger: 0.03,
    orbitOuter: 22,
    orbitInner: 16,

    pour: 4.2,
    waveBack: 4.6,
    waveMid: 3.6,
    waveFront: 3.0,
    bubbleRise: 2.4,
    bubbleStagger: 0.5,
    bubbleFade: 0.9,
    bar: 4.2,
    metaDelay: 2.0,
    settleAt: 4.15,
    settleDur: 0.24,

    revealBeat: 0.15,
    exitLetters: 0.4,
    exitLettersStagger: 0.025,
    exitOrbs: 0.35,
    exitBWrap: 0.45,
    exitBarMeta: 0.3,
    exitRoot: 0.45,
    exitRootAt: 0.25,
  },
  minimal: {
    bIn: 0.22,
    blobsIn: 0.22,
    orbsIn: 0.18,
    orbsStagger: 0.022,
    lettersIn: 0,
    lettersStagger: 0,
    orbitOuter: 14,
    orbitInner: 10,

    pour: 1.4,
    waveBack: 1.6,
    waveMid: 1.3,
    waveFront: 1.1,
    bubbleRise: 0.9,
    bubbleStagger: 0.18,
    bubbleFade: 0.45,
    bar: 1.4,
    metaDelay: 0.6,
    settleAt: 1.35,
    settleDur: 0.16,

    revealBeat: 0.08,
    exitLetters: 0,
    exitLettersStagger: 0,
    exitOrbs: 0.2,
    exitBWrap: 0.28,
    exitBarMeta: 0,
    exitRoot: 0.3,
    exitRootAt: 0.15,
  },
} as const;

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export default function Preloader({
  onReveal,
  onComplete,
  label = "BillPOS",
  mode = "full",
}: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef(false);
  const completeRef = useRef(false);

  const isFull = mode === "full";

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const S = SPEED[mode];

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const fireReveal = () => {
      if (revealRef.current) return;
      revealRef.current = true;
      onReveal();
    };
    const fireComplete = () => {
      if (completeRef.current) return;
      completeRef.current = true;
      onComplete();
    };

    const ctx = gsap.context(() => {
      /* ==========================================================
       * REDUCED MOTION
       * ========================================================== */
      if (reduce) {
        gsap.set(root, { autoAlpha: 1 });
        gsap.set(".pl-b-outline", { opacity: 1 });
        gsap.set(".pl-liquid-group", { y: -240 });
        gsap.set(".pl-orb", { opacity: 1 });
        gsap.set(".pl-blob-a, .pl-blob-b", { opacity: 1 });
        gsap.set(".pl-bubble", { opacity: 0 });
        gsap.set(".pl-letter", { yPercent: 0, opacity: 1 });
        gsap.set(".pl-bar-fill", { scaleX: 1 });
        gsap.set(".pl-meta", { opacity: 1 });

        const tl = gsap.timeline({ onComplete: fireComplete });
        tl.add(() => fireReveal());
        tl.to({}, { duration: 0.7 });
        tl.to(root, { autoAlpha: 0, duration: 0.35, ease: "none" });
        return;
      }

      /* ==========================================================
       * INITIAL STATES
       * ========================================================== */
      gsap.set(root, { autoAlpha: 1 });
      gsap.set(".pl-b-outline", { opacity: 0, scale: 0.9, filter: "blur(8px)" });
      gsap.set(".pl-liquid-group", { y: 260 });
      gsap.set(".pl-bubble", { opacity: 0, y: 0, scale: 0.4 });
      gsap.set(".pl-orb", { opacity: 0, scale: 0.6 });
      gsap.set(".pl-blob-a, .pl-blob-b", { opacity: 0 });

      if (isFull) {
        gsap.set(".pl-letter", {
          yPercent: 130,
          opacity: 0,
          rotate: 8,
          transformOrigin: "50% 100%",
        });
        gsap.set(".pl-bar-fill", { scaleX: 0, transformOrigin: "left center" });
        gsap.set(".pl-meta", { opacity: 0, y: 8 });
      }

      /* ==========================================================
       * AMBIENT LOOPS
       * ========================================================== */
      gsap.to(".pl-blob-a", {
        scale: 1.08,
        duration: 5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      gsap.to(".pl-blob-b", {
        scale: 0.92,
        duration: 4.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      /* ==========================================================
       * MAIN TIMELINE
       * ========================================================== */
      const tl = gsap.timeline({ onComplete: () => fireReveal() });

      /* ── INTRO ────────────────────────────────────────────── */
      tl.to(".pl-b-outline", {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: S.bIn,
        ease: "expo.out",
      });

      tl.to(
        ".pl-blob-a, .pl-blob-b",
        { opacity: 1, duration: S.blobsIn, ease: "power2.out" },
        `-=${S.blobsIn * 0.7}`
      );

      tl.to(
        ".pl-orb",
        {
          opacity: 1,
          scale: 1,
          duration: S.orbsIn,
          ease: "back.out(2)",
          stagger: { each: S.orbsStagger, from: "random" },
        },
        `-=${S.orbsIn}`
      );

      /* Continuous orbit rings */
      gsap.to(".pl-orbit-ring", {
        rotation: 360,
        duration: S.orbitOuter,
        ease: "none",
        repeat: -1,
        transformOrigin: "50% 50%",
      });
      gsap.to(".pl-orbit-ring-inner", {
        rotation: -360,
        duration: S.orbitInner,
        ease: "none",
        repeat: -1,
        transformOrigin: "50% 50%",
      });

      /* "BillPOS" letters — only in full mode */
      if (isFull) {
        tl.to(
          ".pl-letter",
          {
            yPercent: 0,
            opacity: 1,
            rotate: 0,
            duration: S.lettersIn,
            ease: "back.out(2.4)",
            stagger: { each: S.lettersStagger },
          },
          `-=${S.lettersIn * 0.5}`
        );
      }

      /* ── INK POUR ─────────────────────────────────────────── */
      tl.addLabel("pour");

      tl.to(
        ".pl-liquid-group",
        {
          y: -40,
          duration: S.pour,
          ease: "power1.inOut",
        },
        "pour"
      );

      gsap.to(".pl-wave-back", {
        xPercent: -8,
        duration: S.waveBack,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      gsap.to(".pl-wave-mid", {
        xPercent: 6,
        duration: S.waveMid,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      gsap.to(".pl-wave-front", {
        xPercent: -10,
        duration: S.waveFront,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      /* Bubbles */
      const bubbles = gsap.utils.toArray<HTMLElement>(".pl-bubble");
      bubbles.forEach((b, i) => {
        const startDelay = i * S.bubbleStagger;
        tl.fromTo(
          b,
          { opacity: 0, y: 20, scale: 0.4 },
          {
            opacity: 0.85,
            y: -40,
            scale: 1,
            duration: S.bubbleRise,
            ease: "power1.out",
          },
          `pour+=${startDelay}`
        );
        tl.to(
          b,
          {
            opacity: 0,
            y: -80,
            duration: S.bubbleFade,
            ease: "power2.in",
          },
          `pour+=${startDelay + S.bubbleRise * 0.7}`
        );
      });

      /* Progress bar + meta line — only in full mode */
      if (isFull) {
        tl.to(
          ".pl-bar-fill",
          {
            scaleX: 1,
            duration: S.bar,
            ease: "power1.inOut",
          },
          "pour"
        );

        tl.to(
          ".pl-meta",
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
          `pour+=${S.metaDelay}`
        );
      }

      /* Settle wobble */
      tl.to(
        ".pl-liquid-group",
        {
          y: -44,
          duration: S.settleDur,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
        },
        `pour+=${S.settleAt}`
      );

      /* ── REVEAL ───────────────────────────────────────────── */
      tl.add(() => fireReveal());
      tl.to({}, { duration: S.revealBeat });

      /* ── EXIT ─────────────────────────────────────────────── */
      if (isFull) {
        tl.to(
          ".pl-letter",
          {
            yPercent: -130,
            opacity: 0,
            rotate: -6,
            duration: S.exitLetters,
            ease: "power2.in",
            stagger: { each: S.exitLettersStagger },
          },
          "exit"
        );
      }

      tl.to(
        ".pl-orb",
        {
          opacity: 0,
          scale: 0.6,
          duration: S.exitOrbs,
          ease: "power2.in",
          stagger: { each: 0.025 },
        },
        "exit"
      );

      tl.to(
        ".pl-b-wrap",
        {
          scale: 1.08,
          opacity: 0,
          filter: "blur(10px)",
          duration: S.exitBWrap,
          ease: "power2.in",
        },
        "exit+=0.05"
      );

      if (isFull) {
        tl.to(
          ".pl-bar-wrap, .pl-meta",
          {
            opacity: 0,
            y: -8,
            duration: S.exitBarMeta,
            ease: "power2.in",
            stagger: { each: 0.03 },
          },
          "exit"
        );
      }

      tl.to(
        root,
        {
          autoAlpha: 0,
          duration: S.exitRoot,
          ease: "none",
          onComplete: fireComplete,
        },
        `exit+=${S.exitRootAt}`
      );
    }, root);

    return () => ctx.revert();
  }, [onReveal, onComplete, mode, isFull]);

  const letters = label.split("");

  const outerOrbs = [
    { Icon: ShoppingCart, angle: 0, radius: 105 },
    { Icon: ReceiptText, angle: 120, radius: 105 },
    { Icon: WalletCards, angle: 240, radius: 105 },
  ];
  const innerOrbs = [
    { Icon: Boxes, angle: 60, radius: 74 },
    { Icon: BarChart3, angle: 180, radius: 74 },
    { Icon: CreditCard, angle: 300, radius: 74 },
  ];

  const toXY = (angle: number, radius: number) => {
    const rad = (angle * Math.PI) / 180;
    return { x: Math.cos(rad) * radius, y: Math.sin(rad) * radius };
  };

  const VB = 200;
  const B_SIZE = 130;
  const B_WEIGHT = 600;

  const wavePath = (amplitude: number, yOffset: number) => `
    M -300 ${yOffset}
    Q -250 ${yOffset - amplitude}, -200 ${yOffset}
    T -100 ${yOffset}
    T 0 ${yOffset}
    T 100 ${yOffset}
    T 200 ${yOffset}
    T 300 ${yOffset}
    T 400 ${yOffset}
    T 500 ${yOffset}
    L 500 500
    L -300 500 Z
  `;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={`${sans.className} fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#f1f4f8] text-[#0a1b3d]`}
      style={{ visibility: "hidden" }}
    >
      {/* Background */}
      <div
        className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-[0.14]"
        style={{ backgroundImage: grain }}
      />
      <div
        aria-hidden="true"
        className="pl-blob-a pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pl-blob-b pointer-events-none absolute -right-24 -top-24 h-[280px] w-[280px] rounded-full bg-[#0a1b3d]/[0.05] blur-[80px] sm:h-[420px] sm:w-[420px]"
      />

      {/* Corner tags + tape + halftone — only in full mode */}
      {isFull && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-6 top-6 hidden sm:block"
          >
            <span
              className={`${serif.className} inline-block -rotate-2 bg-[#dfe4eb] px-5 py-1.5 text-[16px] italic text-[#0a1b3d]`}
              style={{ clipPath: torn }}
            >
              BillPOS
            </span>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-6 right-6 hidden sm:block"
          >
            <span
              className={`${serif.className} inline-block rotate-1 bg-[#cfe5f6] px-5 py-1.5 text-[16px] italic text-[#0a1b3d]`}
              style={{ clipPath: torn }}
            >
              Loading…
            </span>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-10 left-8 hidden h-28 w-28 opacity-40 sm:block"
            style={{ backgroundImage: halftoneDark, backgroundSize: "9px 9px" }}
          />

          <Tape className="right-10 top-8 hidden rotate-[8deg] sm:block" />
        </>
      )}

      {/* Centerpiece */}
      <div className="relative flex flex-col items-center">
        {/* Orbit rings */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-0 w-0"
        >
          <div className="pl-orbit-ring absolute left-0 top-0 h-0 w-0">
            {outerOrbs.map(({ Icon, angle, radius }, i) => {
              const { x, y } = toXY(angle, radius);
              return (
                <span
                  key={`o-${i}`}
                  className="pl-orb absolute flex h-9 w-9 items-center justify-center rounded-full border border-[#0a1b3d]/10 bg-white/80 text-[#0a1b3d]/75 shadow-[0_10px_30px_-12px_rgba(10,27,61,0.3)] backdrop-blur-sm"
                  style={{
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  }}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.7} />
                </span>
              );
            })}
          </div>

          <div className="pl-orbit-ring-inner absolute left-0 top-0 h-0 w-0">
            {innerOrbs.map(({ Icon, angle, radius }, i) => {
              const { x, y } = toXY(angle, radius);
              return (
                <span
                  key={`i-${i}`}
                  className="pl-orb absolute flex h-8 w-8 items-center justify-center rounded-full border border-[#0a1b3d]/10 bg-white/80 text-[#0a1b3d]/75 shadow-[0_10px_30px_-12px_rgba(10,27,61,0.3)] backdrop-blur-sm"
                  style={{
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  }}
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.7} />
                </span>
              );
            })}
          </div>
        </div>

        {/* The B with liquid fill */}
        <div className="pl-b-wrap relative">
          <svg
            width="140"
            height="140"
            viewBox={`0 0 ${VB} ${VB}`}
            className="block sm:h-[155px] sm:w-[155px] lg:h-[175px] lg:w-[175px]"
            style={{ overflow: "visible" }}
          >
            <defs>
              <mask id="pl-liquid-mask" maskUnits="userSpaceOnUse">
                <g className="pl-liquid-group">
                  <path
                    className="pl-wave-back"
                    d={wavePath(10, 0)}
                    fill="white"
                    opacity="0.75"
                  />
                  <path
                    className="pl-wave-mid"
                    d={wavePath(7, 4)}
                    fill="white"
                    opacity="0.9"
                  />
                  <path
                    className="pl-wave-front"
                    d={wavePath(5, 8)}
                    fill="white"
                  />
                </g>
              </mask>
            </defs>

            <text
              x={VB / 2}
              y={VB / 2 + B_SIZE * 0.34}
              textAnchor="middle"
              style={{
                fontFamily: serif.style.fontFamily,
                fontSize: `${B_SIZE}px`,
                fontWeight: B_WEIGHT,
                fill: "#0a1b3d",
              }}
              mask="url(#pl-liquid-mask)"
            >
              B
            </text>

            <text
              x={VB / 2}
              y={VB / 2 + B_SIZE * 0.34}
              textAnchor="middle"
              className="pl-b-outline"
              style={{
                fontFamily: serif.style.fontFamily,
                fontSize: `${B_SIZE}px`,
                fontWeight: B_WEIGHT,
                fill: "transparent",
                stroke: "#ffffff",
                strokeWidth: 1.8,
                paintOrder: "stroke",
              }}
            >
              B
            </text>

            <circle className="pl-bubble" cx="80" cy="150" r="3" fill="#0a1b3d" opacity="0.5" />
            <circle className="pl-bubble" cx="120" cy="160" r="2.5" fill="#0a1b3d" opacity="0.5" />
            <circle className="pl-bubble" cx="95" cy="155" r="2" fill="#0a1b3d" opacity="0.5" />
            <circle className="pl-bubble" cx="140" cy="145" r="2.2" fill="#0a1b3d" opacity="0.5" />
          </svg>
        </div>

        {/* "BillPOS" letters — full mode only */}
        {isFull && (
          <div
            className="mt-1 flex items-end justify-center overflow-hidden sm:mt-2"
            style={{ paddingBottom: "0.2em" }}
          >
            {letters.map((ch, i) => (
              <span
                key={i}
                className="-mb-[3px] inline-block overflow-hidden pb-[3px]"
              >
                <span
                  className={`pl-letter ${serif.className} inline-block text-[22px] font-medium tracking-[-0.02em] text-[#0a1b3d] sm:text-[28px]`}
                >
                  {ch}
                </span>
              </span>
            ))}
          </div>
        )}

        {/* Progress bar — full mode only */}
        {isFull && (
          <div className="pl-bar-wrap mt-5 h-[3px] w-[140px] overflow-hidden rounded-full bg-[#0a1b3d]/10 sm:w-[180px]">
            <span className="pl-bar-fill block h-full w-full rounded-full bg-[#0a1b3d]" />
          </div>
        )}

        {/* Meta line — full mode only */}
        {isFull && (
          <div className="pl-meta mt-5 flex items-center gap-3 opacity-0">
            <span className="h-px w-8 bg-[#0a1b3d]/25" />
            <span className="text-[9px] font-medium uppercase tracking-[0.34em] text-[#0a1b3d]/45">
              Smart POS · Sri Lanka
            </span>
            <span className="h-px w-8 bg-[#0a1b3d]/25" />
          </div>
        )}
      </div>
    </div>
  );
}
