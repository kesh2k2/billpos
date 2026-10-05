"use client";

/* ============================================================
 * BillPOS — Features Section
 * ------------------------------------------------------------
 * A premium, editorial, numbered feature flow rendered on a
 * deep gray "graphite" canvas. Built for clarity, hierarchy,
 * and quiet luxury rather than loud color.
 *
 * Design principles applied here:
 *   • Layered gray canvas (near-black cool gray + blue bloom)
 *   • Editorial numbered flow with alternating rhythm
 *   • Glass surface rows with hairline dividers that ignite
 *     on hover
 *   • Refined typography hierarchy (huge titles, muted body)
 *   • Subtle grain + grid texture for depth
 *   • Fixed event-listener cleanup (previous version leaked)
 * ============================================================ */

import { useEffect, useRef } from "react";
import {
  ShoppingCart,
  Boxes,
  Truck,
  BarChart3,
  WalletCards,
  Building2,
  Users,
  ReceiptText,
} from "lucide-react";

/* ============================================================
 * DATA
 * ============================================================ */

const features = [
  {
    number: "01",
    title: "Sales Management",
    description:
      "Handle everyday sales faster with a complete billing workflow designed for smooth business operations.",
    items: [
      "POS Billing",
      "Quotations",
      "Sales Returns",
      "Customer Management",
    ],
    icon: ShoppingCart,
  },
  {
    number: "02",
    title: "Inventory Management",
    description:
      "Keep track of your stock across products, warehouses and business locations from one connected system.",
    items: [
      "Stock Management",
      "Stock Adjustment",
      "Stock Movement",
      "Warehouse Control",
    ],
    icon: Boxes,
  },
  {
    number: "03",
    title: "Purchase Management",
    description:
      "Manage purchasing from supplier orders to incoming stock and purchase returns.",
    items: [
      "Purchase Management",
      "Supplier Management",
      "Purchase Returns",
      "Incoming Stock",
    ],
    icon: Truck,
  },
  {
    number: "04",
    title: "Business Reports",
    description:
      "Turn your business activity into clear information that helps you understand what is happening.",
    items: [
      "Sales Reports",
      "Business Reports",
      "Performance Insights",
      "Business Overview",
    ],
    icon: BarChart3,
  },
  {
    number: "05",
    title: "Expenses & Payments",
    description:
      "Keep expenses, payments and transactions organized so your financial activity stays visible.",
    items: [
      "Expense Management",
      "Payment Tracking",
      "Transaction Records",
      "Financial Visibility",
    ],
    icon: WalletCards,
  },
  {
    number: "06",
    title: "Multi-Store & Warehouse",
    description:
      "Manage multiple business locations and warehouses while keeping operations connected.",
    items: [
      "Multi-Store Management",
      "Multiple Warehouses",
      "Stock Transfers",
      "Centralized Control",
    ],
    icon: Building2,
  },
  {
    number: "07",
    title: "User Management",
    description:
      "Control access and organize your team with structured user and permission management.",
    items: [
      "User Accounts",
      "Role Management",
      "Access Control",
      "Activity Visibility",
    ],
    icon: Users,
  },
  {
    number: "08",
    title: "Complete Business Operations",
    description:
      "Bring the important parts of your daily business together inside one connected POS ecosystem.",
    items: ["Sales", "Inventory", "Purchases", "Reports"],
    icon: ReceiptText,
  },
];

/* ============================================================
 * SECTION
 * ============================================================ */

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  /* --------------------------------------------------------
   * Row hover binding
   * ------------------------------------------------------
   * Uses `is-active` class on each `.feature-item` so that
   * Tailwind's `group-hover:` alternatives can be paired with
   * JS-driven state for elements outside the group scope.
   * Cleanup is properly collected (previous version leaked).
   * ------------------------------------------------------ */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const items = Array.from(
      section.querySelectorAll<HTMLElement>(".feature-item")
    );

    const cleanups: Array<() => void> = [];

    items.forEach((item) => {
      const handleEnter = () => item.classList.add("is-active");
      const handleLeave = () => item.classList.remove("is-active");

      item.addEventListener("mouseenter", handleEnter);
      item.addEventListener("mouseleave", handleLeave);

      cleanups.push(() => {
        item.removeEventListener("mouseenter", handleEnter);
        item.removeEventListener("mouseleave", handleLeave);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative overflow-hidden bg-[#0A0D12] py-24 sm:py-32 lg:py-40"
    >
      {/* =====================================================
       * BACKGROUND LAYERS
       * ===================================================== */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Ambient top bloom */}
        <div className="absolute -top-40 left-1/2 h-[560px] w-[1100px] -translate-x-1/2 rounded-full bg-blue-500/[0.09] blur-[160px]" />

        {/* Secondary warm-gray bloom bottom-right */}
        <div className="absolute -bottom-32 right-0 h-[420px] w-[820px] rounded-full bg-slate-400/[0.05] blur-[140px]" />

        {/* Fine grid pattern with radial fade */}
        <div
          className="absolute inset-0 opacity-[0.55]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.028) 1px, transparent 1px)",
            backgroundSize: "78px 78px",
            maskImage:
              "radial-gradient(ellipse at 50% 30%, black 25%, transparent 78%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 50% 30%, black 25%, transparent 78%)",
          }}
        />

        {/* Grain texture */}
        <div
          className="absolute inset-0 opacity-[0.35] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='0.35'/></svg>\")",
            backgroundSize: "160px 160px",
          }}
        />

        {/* Editorial side rules */}
        <div className="absolute inset-y-0 left-[5%] w-px bg-white/[0.045]" />
        <div className="absolute inset-y-0 right-[5%] w-px bg-white/[0.045]" />

        {/* Hairline horizon */}
        <div className="absolute inset-x-0 top-[34%] h-px bg-white/[0.025]" />
        <div className="absolute inset-x-0 top-[72%] h-px bg-white/[0.025]" />

        {/* Ghost background word */}
        <div className="absolute left-0 top-12 select-none text-[15vw] font-semibold leading-none tracking-[-0.09em] text-white/[0.018] sm:text-[17vw]">
          FEATURES
        </div>
      </div>

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        {/* =====================================================
         * HEADER
         * ===================================================== */}
        <header className="mb-16 grid gap-10 lg:grid-cols-[0.85fr_1.6fr] lg:items-end lg:gap-14 lg:mb-24">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-blue-400/80" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-blue-300">
                BillPOS Offers
              </span>
            </div>

            <p className="mt-6 max-w-xs text-sm leading-6 text-white/40">
              Built for everyday business — from a single counter to
              multi-store operations.
            </p>

            {/* Live count chip */}
            <div className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.025] px-3.5 py-1.5 backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-400" />
              </span>
              <span className="font-mono text-[10px] tracking-[0.22em] text-white/50">
                08 MODULES
              </span>
            </div>
          </div>

          <div>
            <h2 className="max-w-4xl text-[clamp(2.6rem,6vw,6rem)] font-semibold leading-[0.94] tracking-[-0.055em] text-white">
              Everything your
              <br />
              <span className="bg-gradient-to-r from-blue-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
                business needs.
              </span>
            </h2>
          </div>
        </header>

        {/* =====================================================
         * FEATURE FLOW
         * ===================================================== */}
        <div className="relative">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isEven = index % 2 === 0;

            return (
              <div key={feature.number} className="relative">
                <article
                  className={`
                    feature-item group relative
                    border-t border-white/[0.07]
                    py-10 lg:py-14
                    transition-colors duration-500
                    ${isEven ? "lg:pr-[10%]" : "lg:pl-[10%] lg:pr-[3%]"}
                  `}
                >
                  {/* Row hover spotlight */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 inset-y-0 -z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(700px circle at var(--mx, 20%) 50%, rgba(96,165,250,0.06), transparent 70%)",
                    }}
                  />

                  {/* Left accent rail — grows on hover */}
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 h-px w-0 bg-gradient-to-r from-blue-400 via-blue-400/60 to-transparent transition-all duration-700 ease-out group-hover:w-full"
                  />

                  <div className="relative grid gap-8 lg:grid-cols-[96px_1fr_1.25fr] lg:items-start lg:gap-10">
                    {/* ── NUMBER ─────────────────────────── */}
                    <div className="flex items-center gap-3 lg:items-start">
                      <span className="font-mono text-[11px] font-medium tracking-[0.28em] text-white/25 transition-colors duration-500 group-hover:text-blue-300">
                        {feature.number}
                      </span>
                      <span className="h-px w-6 bg-white/10 transition-all duration-500 group-hover:w-10 group-hover:bg-blue-400/60 lg:hidden" />
                    </div>

                    {/* ── TITLE + ICON ───────────────────── */}
                    <div>
                      <div className="mb-6 flex items-center gap-4">
                        <div
                          className="
                            relative flex h-12 w-12 shrink-0 items-center justify-center
                            rounded-xl
                            border border-white/[0.09]
                            bg-white/[0.035]
                            text-blue-300
                            backdrop-blur-sm
                            transition-all duration-500
                            group-hover:-translate-y-1
                            group-hover:border-blue-400/30
                            group-hover:bg-blue-500/[0.08]
                            group-hover:text-blue-200
                            group-hover:shadow-[0_14px_40px_-12px_rgba(59,130,246,0.55)]
                          "
                        >
                          <Icon size={19} strokeWidth={1.7} />

                          {/* Tiny corner dot */}
                          <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-blue-400 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        </div>

                        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-white/30">
                          BillPOS
                        </span>
                      </div>

                      <h3 className="text-[clamp(1.9rem,3.6vw,3.2rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-white transition-colors duration-500 group-hover:text-blue-100">
                        {feature.title}
                      </h3>
                    </div>

                    {/* ── DESCRIPTION + ITEMS ────────────── */}
                    <div>
                      <p className="max-w-xl text-[14.5px] leading-7 text-white/45">
                        {feature.description}
                      </p>

                      <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3.5">
                        {feature.items.map((item) => (
                          <div
                            key={item}
                            className="flex items-center gap-2.5 text-[13px] text-white/65 transition-colors duration-500 group-hover:text-white/85"
                          >
                            <span className="relative flex h-1.5 w-1.5 items-center justify-center">
                              <span className="absolute inset-0 rounded-full bg-blue-400/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                              <span className="relative h-1.5 w-1.5 rounded-full bg-blue-400" />
                            </span>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom underline — anchored to the left */}
                  <span
                    aria-hidden
                    className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-blue-400/70 to-transparent transition-all duration-700 ease-out group-hover:w-32"
                  />
                </article>

                {/* ── CONNECTOR ────────────────────────── */}
                {index < features.length - 1 && (
                  <div className="relative hidden h-10 lg:block">
                    <div
                      className={`
                        relative h-full w-px
                        bg-gradient-to-b from-white/[0.05] via-white/[0.12] to-white/[0.05]
                        ${isEven ? "ml-[47px]" : "ml-auto mr-[47px]"}
                      `}
                    >
                      {/* Small node at midpoint */}
                      <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* =====================================================
         * BOTTOM STATEMENT
         * ===================================================== */}
        <div className="relative mt-20 sm:mt-28">
          {/* Gradient rule */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

          <div className="grid gap-8 pt-10 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-14 lg:pt-14">
            <h3 className="text-[clamp(1.9rem,3.6vw,3.4rem)] font-medium leading-[1.05] tracking-[-0.045em] text-white">
              One platform.
              <br />
              <span className="text-blue-300">
                Everyday business, connected.
              </span>
            </h3>

            <div className="lg:pb-2">
              <p className="max-w-sm text-[14px] leading-7 text-white/45">
                From the first sale to the final report, BillPOS keeps your
                business operations connected in one system.
              </p>

              <div className="mt-6 flex items-center gap-3 border-t border-white/[0.07] pt-5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-white/35">
                  Connected by BillPOS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}