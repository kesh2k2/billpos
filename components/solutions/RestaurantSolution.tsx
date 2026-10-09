"use client";

import { useEffect, useRef, useState } from "react";
import { Instrument_Serif, Inter } from "next/font/google";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  MousePointerClick,
  ShoppingBag,
  Package,
  BarChart3,
  Receipt,
  Users,
  Sparkles,
  Check,
  TrendingUp,
  Calendar,
  Send,
  Image as ImageIcon,
  Calculator,
  Cloud,
  Store,
  Settings,
  Layers,
  Maximize2,
  X,
  Compass,
  Zap,
  Star,
  Tablet,
  ChefHat,
  ClipboardList,
  Wine,
  Route,
  Smartphone,
  LayoutGrid,
  Timer,
  ShieldAlert,
  Heart,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const sans = Inter({ subsets: ["latin"] });

/* ------------------------------------------------------------------ */
/* Data                                                               */
/* ------------------------------------------------------------------ */

const steps = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features" },
  { id: "gallery", label: "Gallery" },
  { id: "trial", label: "Request Trial" },
  { id: "demo", label: "Request Demo" },
];

const previewItems = [
  { Icon: Compass, label: "Overview", note: "The big picture", offset: "lg:-translate-y-3", tint: "bg-orange-50 text-orange-700" },
  { Icon: Zap, label: "Features", note: "17 capabilities", offset: "lg:translate-y-1", tint: "bg-amber-50 text-amber-700" },
  { Icon: ImageIcon, label: "Gallery", note: "Live kitchen screens", offset: "lg:-translate-y-4", tint: "bg-rose-50 text-rose-700" },
  { Icon: Calendar, label: "Free Trial", note: "30 days, no card", offset: "lg:translate-y-1", tint: "bg-emerald-50 text-emerald-700" },
  { Icon: Send, label: "Live Demo", note: "Book a walkthrough", offset: "lg:-translate-y-2", tint: "bg-sky-50 text-sky-700" },
];

const previewStats = [
  { value: "1,200+", label: "Restaurants" },
  { value: "2.8M+", label: "Orders served" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" },
];

const previewChips = [
  "Table ordering",
  "KOT & BOT",
  "Kitchen routing",
  "Self-ordering",
  "Bar management",
  "Live reports",
];

const accordionData = [
  { Icon: Receipt, tag: "Billing", title: "Fast & Reliable POS Billing System", body: "Lightning-fast billing with split bills, multiple payment modes, tip handling, and receipt printing — engineered for peak restaurant rush hours without slowdowns." },
  { Icon: Calculator, tag: "Compliance", title: "VAT Calculation & Compliance Support", body: "Fully compliant with the new government VAT requirements. Automatic VAT calculation, tax-inclusive menu pricing, VAT reports, and ready-to-file summaries for restaurants." },
  { Icon: TrendingUp, tag: "Real-time", title: "Real-Time Sales & Inventory Tracking", body: "Watch orders flow in live from every table and counter. Ingredient and menu-item stock levels update automatically as orders are fired to the kitchen." },
  { Icon: Package, tag: "Supply chain", title: "Purchase & Warehouse Management", body: "Create purchase orders for suppliers, record GRN, and manage dry-store, cold-store, and bar inventory — end-to-end, with cost-price updates built in." },
  { Icon: BarChart3, tag: "Insights", title: "Advanced Reports & Business Analytics", body: "40+ reports designed for restaurants — daily covers, item mix, peak-hour heat maps, table turnover, staff performance, and profitability by dish or category." },
  { Icon: Cloud, tag: "Security", title: "Secure Cloud-Based Platform", body: "Access your restaurant from anywhere, on any device. Bank-level encryption, automatic backups, role-based access for waiters and managers, and 99.9% uptime." },
  { Icon: Store, tag: "Multi-outlet", title: "Multi-Store Operations", body: "Run unlimited restaurant outlets from one dashboard. Centralised menus, per-store pricing, cross-branch reports, and user roles per location — all in one login." },
  { Icon: Settings, tag: "Flexible", title: "Customizable Business Solutions", body: "Custom menus, modifier groups, tax rules, invoice designs, and user permissions — BillPOS adapts to how your restaurant actually runs, not the other way around." },
  { Icon: Tablet, tag: "Tablet POS", title: "Tablet-Based Order Taking", body: "Waiters take orders on tablets directly at the table. Orders sync instantly to the kitchen, eliminating handwritten chits and double entry — faster service, fewer mistakes." },
  { Icon: ChefHat, tag: "Kitchen stock", title: "Kitchen Inventory Management", body: "Track ingredient-level stock with recipe-based depletion. Know exactly how much chicken, rice, or oil is left — and get alerts before you run out during service." },
  { Icon: ClipboardList, tag: "KOT", title: "Kitchen Order Ticket (KOT) Management", body: "Automated KOT generation with dish names, quantities, modifiers, and table numbers. Real-time KOT tracking from order to dispatch, with full audit history." },
  { Icon: Wine, tag: "BOT", title: "Bar Order Ticket (BOT) Management", body: "Separate BOT flow for your bar — cocktail recipes, liquor tracking, and peg/measure handling. Bar orders print on their own ticket, avoiding kitchen-bar confusion." },
  { Icon: Route, tag: "Routing", title: "Direct Kitchen & Bar Order Routing", body: "Route each item automatically to the right station — kitchen, bar, grill, dessert, or pizza counter. Perfect for restaurants with multiple prep areas and stations." },
  { Icon: Smartphone, tag: "Self-service", title: "Customer Self-Ordering System", body: "Let guests order from QR-code menus on their own phones. Orders flow directly to the kitchen, reducing waiter load and increasing upsell with images and descriptions." },
  { Icon: LayoutGrid, tag: "Tables", title: "Table Management", body: "Visual floor plan showing every table's status — free, seated, ordered, served. Move or merge tables, split bills, and track covers per table throughout the day." },
  { Icon: Timer, tag: "Speed", title: "Faster Order Processing", body: "From table to kitchen in seconds. Quick-add favourites, one-tap repeat orders, and smart shortcuts mean your staff spend less time on screens and more time on guests." },
  { Icon: ShieldAlert, tag: "Accuracy", title: "Reduced Order Mistakes", body: "Digitised ordering removes misheard items, forgotten modifiers, and wrong table numbers. Every dish is confirmed back to the kitchen with all customisations clearly noted." },
  { Icon: Heart, tag: "Hospitality", title: "Improved Customer Service", body: "Faster service, accurate orders, and quicker billing create happier guests. Track repeat customers, their favourite dishes, and reward loyalty automatically." },
];

const galleryItems = [
  { src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85", title: "Front of House", caption: "Table & counter service", badge: "FOH" },
  { src: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=85", title: "Live Kitchen", caption: "Real-time KOT flow", badge: "KOT" },
  { src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=85", title: "Table Setup", caption: "Visual floor plan", badge: "TABLES" },
  { src: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=1200&q=85", title: "Chef's Station", caption: "Kitchen routing", badge: "ROUTING" },
  { src: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=85", title: "Bar Counter", caption: "Separate BOT flow", badge: "BAR" },
  { src: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=1200&q=85", title: "Service Floor", caption: "Tablet-based ordering", badge: "POS" },
];

const quickStats = [
  { value: "8s", label: "Avg. order time" },
  { value: "40+", label: "Ready reports" },
  { value: "99.9%", label: "Uptime" },
];

const rightImages = [
  { src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80", shape: "rounded-[32px]", aspect: "aspect-[4/5]" },
  { src: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80", shape: "rounded-t-[120px] rounded-b-[32px]", aspect: "aspect-[4/5]" },
  { src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80", shape: "rounded-[32px]", aspect: "aspect-square" },
];

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export default function RestaurantSolution() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [stepperVisible, setStepperVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [openAccordion, setOpenAccordion] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const qa = (sel: string): HTMLElement[] => {
    const root = sectionRef.current;
    if (!root) return [];
    return Array.from(root.querySelectorAll<HTMLElement>(sel));
  };

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        qa(".rs-image"),
        { x: 60, opacity: 0, scale: 0.94 },
        { x: 0, opacity: 1, scale: 1, duration: 0.9, stagger: 0.14, ease: "power3.out", scrollTrigger: { trigger: root.querySelector(".rs-images-wrap"), start: "top 85%", once: true } }
      );

      gsap.fromTo(
        qa(".rs-info-panel"),
        { x: -60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: root.querySelector(".rs-info-panel"), start: "top 88%", once: true } }
      );

      gsap.fromTo(
        qa(".rs-title"),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: root.querySelector(".rs-title"), start: "top 90%", once: true } }
      );

      gsap.to(qa(".rs-image"), { y: -18, ease: "none", scrollTrigger: { trigger: root.querySelector(".rs-images-wrap"), start: "top bottom", end: "bottom top", scrub: true } });

      const playTl = gsap.timeline({ scrollTrigger: { trigger: root.querySelector(".rs-play"), start: "top 88%", once: true } });

      playTl
        .fromTo(qa(".rs-play-btn"), { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.85, ease: "back.out(1.7)" })
        .fromTo(qa(".rs-click-here"), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.4")
        .fromTo(qa(".rs-play-hint"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.25")
        .fromTo(qa(".rs-preview-card"), { y: 24, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.65, stagger: { each: 0.08, from: "center" }, ease: "back.out(1.5)" }, "-=0.35")
        .fromTo(qa(".rs-preview-stats > div"), { y: 20, opacity: 0, scale: 0.94 }, { y: 0, opacity: 1, scale: 1, duration: 0.55, stagger: 0.08, ease: "back.out(1.4)" }, "-=0.15")
        .fromTo(qa(".rs-preview-chips > span"), { y: 12, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: "back.out(1.5)" }, "-=0.3")
        .add(() => {
          gsap.to(qa(".rs-play-btn"), { scale: 1.09, duration: 0.9, repeat: -1, yoyo: true, ease: "sine.inOut" });
          gsap.to(qa(".rs-click-here"), { opacity: 0.3, duration: 0.9, repeat: -1, yoyo: true, ease: "sine.inOut" });
          gsap.to(qa(".rs-play-ring"), { scale: 1.25, opacity: 0, duration: 1.6, repeat: -1, ease: "power2.out", stagger: 0.3 });
          qa(".rs-preview-card").forEach((card, i) => {
            gsap.to(card, { y: i % 2 === 0 ? -6 : 6, duration: 2.4 + i * 0.2, repeat: -1, yoyo: true, ease: "sine.inOut" });
          });
          gsap.to(qa(".rs-preview-icon"), { scale: 1.08, duration: 1.6, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: { each: 0.18, from: "center" } });
          gsap.to(qa(".rs-preview-stats .rs-stat-value"), { y: -2, duration: 1.8, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: { each: 0.15, from: "start" } });
        });

      gsap.to(qa(".rs-blob-a"), { y: -20, duration: 8, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to(qa(".rs-blob-b"), { y: 24, duration: 10, ease: "sine.inOut", repeat: -1, yoyo: true });
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlayClick = () => {
    if (stepperVisible) return;
    const root = sectionRef.current;
    if (!root) return;

    const playBtn = qa(".rs-play-btn");
    const clickHere = qa(".rs-click-here");
    const playHint = qa(".rs-play-hint");
    const previewCards = qa(".rs-preview-card");
    const previewIcons = qa(".rs-preview-icon");
    const previewHeader = qa(".rs-preview-header");
    const previewStats = qa(".rs-preview-stats");
    const previewChips = qa(".rs-preview-chips");
    const statValues = qa(".rs-preview-stats .rs-stat-value");
    const wrapper = root.querySelector(".rs-play") as HTMLElement | null;

    gsap.killTweensOf([...playBtn, ...clickHere, ...previewCards, ...previewIcons, ...statValues]);

    const tl = gsap.timeline({ onComplete: () => setStepperVisible(true) });

    tl.to(previewCards, { opacity: 0, y: -34, scale: 0.82, filter: "blur(10px)", duration: 0.55, stagger: { each: 0.06, from: "center" }, ease: "power3.in" })
      .to(previewHeader, { opacity: 0, y: -14, duration: 0.35, ease: "power2.in" }, 0.05)
      .to(previewStats, { opacity: 0, y: 16, duration: 0.35, ease: "power2.in" }, 0.1)
      .to(previewChips, { opacity: 0, y: 10, duration: 0.35, ease: "power2.in" }, 0.15)
      .to(playBtn, { scale: 1.5, opacity: 0, filter: "blur(14px)", duration: 0.6, ease: "power3.inOut" }, 0.15)
      .to(clickHere, { opacity: 0, y: -10, duration: 0.3, ease: "power2.in" }, 0.2)
      .to(playHint, { opacity: 0, y: 10, duration: 0.35, ease: "power2.in" }, 0.25)
      .add(() => { if (wrapper) wrapper.style.overflow = "hidden"; })
      .to(wrapper, { height: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0, duration: 0.4, ease: "power2.inOut" }, 0.6);
  };

  useEffect(() => {
    if (!stepperVisible) return;
    const root = sectionRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      tl.fromTo(qa(".rs-stepper-wrap"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" })
        .fromTo(qa(".rs-line-fill"), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "power2.inOut", transformOrigin: "left center" }, 0.35)
        .fromTo(qa(".rs-step-circle"), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.75, stagger: 0.15, ease: "back.out(2.6)" }, 0.55)
        .fromTo(qa(".rs-step-label"), { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.12, ease: "power3.out" }, 0.9)
        .fromTo(qa(".rs-content-window"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 1.5);
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepperVisible]);

  useEffect(() => {
    if (!stepperVisible || !contentRef.current) return;
    const root = sectionRef.current;
    if (!root) return;

    const el = contentRef.current;

    const anims = [
      { from: { x: -60, opacity: 0 }, ease: "power3.out" },
      { from: { x: 60, opacity: 0 }, ease: "power3.out" },
      { from: { scale: 0.9, rotation: -3, opacity: 0 }, ease: "back.out(1.4)" },
      { from: { y: 60, opacity: 0 }, ease: "power3.out" },
      { from: { scale: 0.85, opacity: 0 }, ease: "elastic.out(1, 0.7)" },
    ];

    const cfg = anims[activeStep];

    gsap.fromTo(el, cfg.from, { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, duration: 0.75, ease: cfg.ease });

    if (activeStep === 1) {
      requestAnimationFrame(() => {
        gsap.fromTo(qa(".rs-feature-row"), { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power3.out" });
      });
    }

    if (activeStep === 2) {
      requestAnimationFrame(() => {
        gsap.fromTo(qa(".rs-gallery-card"), { y: 50, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.1, ease: "back.out(1.4)" });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep, stepperVisible]);

  useEffect(() => {
    if (lightbox === null) return;
    const root = sectionRef.current;
    if (!root) return;
    gsap.fromTo(qa(".rs-lightbox"), { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
    gsap.fromTo(qa(".rs-lightbox-img"), { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.4)" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox]);

  const closeLightbox = () => {
    const root = sectionRef.current;
    if (!root) return;
    gsap.to(qa(".rs-lightbox"), { opacity: 0, duration: 0.25, ease: "power2.in", onComplete: () => setLightbox(null) });
  };

  return (
    <section
      ref={sectionRef}
      /* FIX: minimal top padding to close the gap with RetailSolution */
      className={`${sans.className} relative w-full overflow-hidden bg-white pt-2 pb-12 sm:pt-4 sm:pb-16 lg:pt-4 lg:pb-24`}
    >
      <style>{`
        @keyframes rs-spin { to { transform: rotate(360deg); } }
        .rs-spin-slow { animation: rs-spin 30s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .rs-spin-slow { animation: none !important; }
        }
      `}</style>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(120,53,15,0.08) 1px, transparent 0)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse at 50% 40%, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, black 30%, transparent 80%)",
        }}
      />

      <div
        aria-hidden="true"
        className="rs-blob-a pointer-events-none absolute -right-40 top-16 hidden h-[520px] w-[520px] lg:block"
        style={{
          background: "radial-gradient(circle at 40% 40%, rgba(254,215,170,0.55), rgba(253,230,138,0.3) 55%, transparent 75%)",
          borderRadius: "58% 42% 45% 55% / 60% 62% 38% 40%",
          filter: "blur(2px)",
        }}
      />

      <div
        aria-hidden="true"
        className="rs-blob-b pointer-events-none absolute -left-32 bottom-10 hidden h-[320px] w-[320px] lg:block"
        style={{
          background: "radial-gradient(circle at 60% 60%, rgba(254,226,226,0.55), transparent 70%)",
          borderRadius: "42% 58% 55% 45% / 55% 45% 55% 45%",
          filter: "blur(4px)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)_260px] lg:gap-10 xl:gap-14">

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="rs-info-panel rounded-3xl border border-slate-200 bg-white/70 p-5 backdrop-blur">
                <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
                  <ShoppingBag className="h-4 w-4" />
                </span>
                <p className="text-[13px] font-semibold text-slate-800">Ready to try it?</p>
                <p className="mt-1.5 text-[11px] leading-5 text-slate-500">Free 30-day trial. No card needed.</p>
                <Link href="/demo" className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#111] px-4 py-2.5 text-[11.5px] font-medium text-white transition hover:bg-orange-600">
                  Start free trial
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="rs-info-panel rounded-3xl border border-slate-200 bg-white/70 p-5 backdrop-blur">
                <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
                  <TrendingUp className="h-4 w-4" />
                </span>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">This month</p>
                <p className="mt-2 text-[22px] font-semibold leading-none tracking-tight text-slate-800">+18%</p>
                <p className="mt-1 text-[11px] text-slate-400">Average sales lift</p>
              </div>

              <div className="rs-info-panel rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50/70 to-white p-5">
                <div className="flex items-center gap-2">
                  <ChefHat className="h-3.5 w-3.5 text-orange-600" />
                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-orange-700">For restaurants</p>
                </div>
                <p className="mt-2 text-[11px] leading-5 text-slate-500">Built with KOT, BOT, table management, and kitchen routing out of the box.</p>
              </div>
            </div>
          </aside>

          <div className="relative min-w-0">
            <div className="rs-title flex flex-col items-center text-center">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-orange-700 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                Built for restaurants
              </span>

              <h2 className={`${serif.className} text-[32px] leading-[1.05] tracking-[-0.02em] text-[#111] sm:text-[46px] lg:text-[64px]`}>
                Restaurant <span className="italic text-orange-700">Solution</span>
              </h2>

              <p className="mt-3 max-w-[560px] text-[13px] leading-7 text-slate-500 sm:text-[14.5px]">
                Run your restaurant faster and more efficiently with an advanced POS system built for modern food businesses.
              </p>
            </div>

            {!stepperVisible && (
              <div className="rs-play mt-8 flex flex-col items-center justify-center">
                <button
                  type="button"
                  onClick={handlePlayClick}
                  aria-label="Reveal restaurant solution steps"
                  className="rs-play-btn group relative flex h-[80px] w-[80px] items-center justify-center rounded-full bg-gradient-to-br from-orange-600 to-orange-500 text-white shadow-[0_22px_50px_-20px_rgba(234,88,12,0.85)] sm:h-[88px] sm:w-[88px]"
                >
                  <span className="rs-play-ring absolute inset-0 rounded-full border border-orange-400/60" />
                  <span className="rs-play-ring absolute inset-0 rounded-full border border-orange-400/40" style={{ animationDelay: "0.6s" }} />

                  <svg className="rs-spin-slow absolute inset-[-6px] h-[92px] w-[92px] text-orange-200/70 sm:h-[100px] sm:w-[100px]" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="47" stroke="currentColor" strokeWidth="1" strokeDasharray="3 6" />
                  </svg>

                  <MousePointerClick className="relative h-6 w-6 sm:h-7 sm:w-7" />
                </button>

                <p className="rs-click-here mt-3 text-[10.5px] font-medium uppercase tracking-[0.2em] text-slate-500 sm:text-[11.5px]">
                  Click here
                </p>

                <p className="rs-play-hint mt-2 max-w-[420px] text-center text-[11px] leading-5 text-slate-400 sm:text-[12px] sm:leading-6">
                  Explore full details, features, and live kitchen screens.
                  <br className="hidden sm:block" /> Request a free trial or book a personalised demo — all in one place.
                </p>

                <div className="rs-preview-wrap mt-10 hidden w-full lg:block">
                  <div className="rs-preview-header mb-5 flex items-center justify-center gap-3">
                    <span className="h-px w-10 bg-slate-200" />
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                      What you&apos;ll discover
                    </p>
                    <span className="h-px w-10 bg-slate-200" />
                  </div>

                  <div className="grid grid-cols-5 gap-3">
                    {previewItems.map(({ Icon, label, note, offset, tint }, i) => (
                      <div
                        key={label}
                        className={`rs-preview-card relative flex flex-col items-center rounded-2xl border border-slate-200/80 bg-white/80 px-2.5 py-4 text-center shadow-[0_18px_40px_-30px_rgba(15,23,42,0.35)] backdrop-blur transition-transform duration-500 hover:-translate-y-1 hover:border-orange-200 ${offset}`}
                      >
                        <span className="pointer-events-none absolute -top-2 left-1/2 hidden h-1 w-1 -translate-x-1/2 rounded-full bg-slate-200 lg:block" />
                        <span className={`rs-preview-icon flex h-9 w-9 items-center justify-center rounded-xl ${tint}`}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <p className="mt-3 text-[11px] font-semibold text-slate-800">{label}</p>
                        <p className="mt-1 text-[9.5px] font-medium uppercase tracking-wider text-slate-400">0{i + 1}</p>
                        <p className="mt-2 line-clamp-2 text-[10.5px] leading-4 text-slate-500">{note}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rs-preview-stats mt-8 grid w-full grid-cols-4 gap-2.5">
                    {previewStats.map((s) => (
                      <div key={s.label} className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 p-3 text-center backdrop-blur">
                        <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-orange-50/0 via-orange-50/40 to-orange-100/0 opacity-70" />
                        <p className="rs-stat-value relative text-[17px] font-semibold tracking-tight text-slate-800">{s.value}</p>
                        <p className="relative mt-0.5 text-[9px] font-medium uppercase tracking-wider text-slate-400">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rs-preview-chips mt-5 flex w-full flex-wrap items-center justify-center gap-2">
                    {previewChips.map((c) => (
                      <span key={c} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-[10.5px] font-medium text-slate-600 backdrop-blur transition hover:border-orange-200 hover:bg-orange-50/50 hover:text-orange-700">
                        <Star className="h-2.5 w-2.5 text-orange-500" />
                        {c}
                      </span>
                    ))}
                  </div>

                  <p className="mt-6 text-center text-[11px] text-slate-400">
                    Click the button above to reveal each section in detail.
                  </p>
                </div>
              </div>
            )}

            {stepperVisible && (
              <div className="rs-stepper-wrap mt-10">
                <div className="relative">
                  <div className="pointer-events-none absolute left-4 right-4 top-3 h-[2px] rounded bg-slate-200/80" />
                  <div className="rs-line-fill pointer-events-none absolute left-4 top-3 h-[2px] rounded bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400" style={{ width: "calc(100% - 2rem)" }} />

                  <div className="relative flex items-start justify-between">
                    {steps.map((step, i) => {
                      const isActive = activeStep === i;
                      const isPast = activeStep > i;

                      return (
                        <button key={step.id} type="button" onClick={() => setActiveStep(i)} className="group flex flex-1 flex-col items-center text-center">
                          <span className={`rs-step-circle relative flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-300 sm:h-7 sm:w-7 ${isActive ? "border-orange-600 bg-orange-600 shadow-[0_0_0_6px_rgba(234,88,12,0.12)]" : isPast ? "border-orange-500 bg-orange-500" : "border-slate-200 bg-white group-hover:border-orange-300"}`}>
                            {isPast || isActive ? <Check className="h-3 w-3 text-white sm:h-3.5 sm:w-3.5" strokeWidth={3} /> : <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />}
                            {isActive && <span className="absolute inset-[-4px] animate-ping rounded-full border border-orange-400/50" />}
                          </span>
                          <span className={`rs-step-label mt-2 text-[9.5px] font-medium transition-colors duration-300 sm:mt-3 sm:text-[11.5px] ${isActive ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"}`}>
                            {step.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div ref={contentRef} className="rs-content-window mt-10 sm:mt-12">
                  {activeStep === 0 && (
                    <div>
                      <SectionHeader index="01" title="Overview" icon={<Sparkles className="h-3.5 w-3.5 text-orange-600" />} />

                      <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
                        <div>
                          <div className="space-y-4 text-[12.5px] leading-7 text-slate-600 sm:text-[13.5px]">
                            <p>BillPOS brings your restaurant&apos;s orders, kitchen, bar, tables, and daily operations into one connected system. From a café counter to a multi-branch chain, every order flows to the right place — instantly.</p>
                            <p>Waiters take orders on tablets at the table, KOT and BOT print where they should, and stock depletes as dishes are served. No handwritten chits, no misheard orders, no confusion between kitchen and bar.</p>
                            <p>The result is faster service, happier guests, and a restaurant that runs with far less friction — even during the busiest dinner rush.</p>
                          </div>

                          <div className="mt-6 grid grid-cols-3 gap-2.5 sm:gap-3">
                            {quickStats.map((s) => (
                              <div key={s.label} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-2.5 text-left sm:p-3">
                                <p className="text-[14px] font-semibold tracking-tight text-[#111] sm:text-[16px]">{s.value}</p>
                                <p className="mt-0.5 text-[9px] font-medium uppercase tracking-wider text-slate-400 sm:text-[9.5px]">{s.label}</p>
                              </div>
                            ))}
                          </div>

                          <div className="mt-6 flex flex-wrap items-center gap-2.5 sm:gap-3">
                            <Link href="/demo" className="group inline-flex items-center gap-2 rounded-full bg-[#111] px-5 py-2.5 text-[12px] font-medium text-white transition hover:bg-orange-600">
                              Request a Demo
                              <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                            </Link>
                            <Link href="/solutions#restaurant-features" className="group inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-medium text-slate-700 transition hover:border-orange-300">
                              See all features
                              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                            </Link>
                          </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white/70 p-5 backdrop-blur">
                          <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
                            <Users className="h-4 w-4" />
                          </span>
                          <p className="text-[13px] font-semibold text-slate-800">Trusted by 1,200+ restaurants</p>
                          <p className="mt-1.5 text-[11px] leading-5 text-slate-400">Cafés, fine dining, quick-service, and chains.</p>

                          <div className="mt-4 flex items-center gap-2">
                            {["bg-orange-500", "bg-rose-500", "bg-amber-500", "bg-emerald-500"].map((c, i) => (
                              <span key={i} className={`h-7 w-7 rounded-full border-2 border-white ${c}`} />
                            ))}
                            <span className="flex h-7 items-center rounded-full border-2 border-white bg-slate-100 px-2 text-[10px] font-semibold text-slate-600">+1k</span>
                          </div>

                          <div className="mt-5 border-t border-slate-100 pt-4">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">This month</span>
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9.5px] font-semibold text-emerald-700">+18%</span>
                            </div>
                            <p className="mt-1 text-[11px] text-slate-400">Average sales lift</p>
                            <div className="mt-3 flex h-12 items-end gap-1">
                              {[40, 62, 48, 75, 58, 90, 70].map((h, i) => (
                                <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-orange-600 to-amber-400" style={{ height: `${h}%` }} />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStep === 1 && (
                    <div>
                      <SectionHeader index="02" title="Features" icon={<Sparkles className="h-3.5 w-3.5 text-orange-600" />} />

                      <div className="mb-6 rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50/70 to-white p-4 sm:p-5">
                        <div className="flex items-start gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-600 text-white">
                            <Layers className="h-4 w-4" />
                          </span>
                          <div>
                            <p className="text-[13.5px] font-semibold text-slate-800">Everything your restaurant needs</p>
                            <p className="mt-1 text-[11.5px] leading-5 text-slate-500">BillPOS helps restaurants simplify operations, improve order accuracy, and deliver a better customer experience — all in one place.</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        {accordionData.map(({ Icon, tag, title, body }, i) => {
                          const isOpen = openAccordion === i;

                          return (
                            <div key={title} className={`rs-feature-row group overflow-hidden rounded-2xl border transition-all duration-300 ${isOpen ? "border-orange-200 bg-white shadow-[0_20px_45px_-30px_rgba(234,88,12,0.35)]" : "border-slate-200 bg-white/70 hover:border-orange-200"}`}>
                              <button type="button" onClick={() => setOpenAccordion(isOpen ? -1 : i)} className="flex w-full items-center gap-3 p-3 text-left sm:p-3.5">
                                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-300 sm:h-10 sm:w-10 ${isOpen ? "bg-orange-600 text-white" : "bg-orange-50 text-orange-700"}`}>
                                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </span>
                                <div className="min-w-0 flex-1">
                                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:text-[9.5px]">{tag}</p>
                                  <p className="mt-0.5 text-[12.5px] font-semibold leading-tight text-slate-800 sm:truncate sm:text-[13.5px]">{title}</p>
                                </div>
                                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 sm:h-8 sm:w-8 ${isOpen ? "rotate-180 border-orange-200 bg-orange-50 text-orange-700" : "border-slate-200 bg-white text-slate-400 group-hover:border-orange-200 group-hover:text-orange-600"}`}>
                                  <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </span>
                              </button>

                              <div className="grid transition-all duration-500 ease-out" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
                                <div className="overflow-hidden">
                                  <div className="border-t border-slate-100 px-3 pb-3 pt-3 sm:px-3.5 sm:pb-3.5">
                                    <p className="text-[11.5px] leading-6 text-slate-500 sm:text-[12px]">{body}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-6 flex flex-wrap items-center gap-2.5 rounded-2xl border border-slate-200 bg-white/70 p-3.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        </span>
                        <p className="text-[11.5px] text-slate-500">
                          All <span className="font-semibold text-slate-700">17 features</span> are included in every plan.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div>
                      <SectionHeader index="03" title="Gallery" icon={<ImageIcon className="h-3.5 w-3.5 text-orange-600" />} />

                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {galleryItems.map((g, i) => (
                          <button key={i} type="button" onClick={() => setLightbox(i)} className="rs-gallery-card group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50 text-left shadow-[0_20px_45px_-30px_rgba(15,23,42,0.35)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(15,23,42,0.4)]">
                            <div className="aspect-[4/5] overflow-hidden">
                              <img src={g.src} alt={g.title} className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0" />
                            </div>
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/20 to-transparent" />
                            <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-wider text-slate-700 backdrop-blur sm:left-3 sm:top-3 sm:text-[9px]">{g.badge}</span>
                            <span className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-slate-700 opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100 sm:right-3 sm:top-3 sm:h-7 sm:w-7">
                              <Maximize2 className="h-3 w-3" />
                            </span>
                            <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3">
                              <p className="text-[9px] font-semibold uppercase tracking-wider text-orange-300">{g.caption}</p>
                              <p className="mt-0.5 text-[11px] font-semibold leading-tight text-white sm:text-[12px]">{g.title}</p>
                            </div>
                          </button>
                        ))}
                      </div>

                      <p className="mt-5 text-center text-[11px] text-slate-400">Click any screen to view the full-size preview</p>
                    </div>
                  )}

                  {activeStep === 3 && (
                    <div>
                      <SectionHeader index="04" title="Request Trial" icon={<Calendar className="h-3.5 w-3.5 text-orange-600" />} />

                      <div className="mx-auto max-w-[640px] rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.35)] sm:p-8">
                        <div className="flex items-start gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
                            <Calendar className="h-4 w-4" />
                          </span>
                          <div>
                            <p className="text-[13.5px] font-semibold text-slate-800 sm:text-[14px]">Start your 30-day free trial</p>
                            <p className="mt-1 text-[11px] leading-5 text-slate-400 sm:text-[11.5px]">No credit card required. Full access to every feature. Cancel anytime.</p>
                          </div>
                        </div>

                        <form className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
                          <Field label="Full name" placeholder="Your name" />
                          <Field label="Restaurant name" placeholder="Restaurant name" />
                          <Field label="Email" placeholder="you@example.com" type="email" />
                          <Field label="Phone" placeholder="+94 7X XXX XXXX" type="tel" />
                          <div className="sm:col-span-2">
                            <label className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Restaurant type</label>
                            <select className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] text-slate-700 outline-none transition focus:border-orange-400">
                              <option>Café</option>
                              <option>Fine dining</option>
                              <option>Quick-service / Fast food</option>
                              <option>Bar &amp; restaurant</option>
                              <option>Multi-outlet chain</option>
                              <option>Other</option>
                            </select>
                          </div>
                          <button type="submit" className="group mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-orange-600 px-5 py-3 text-[12.5px] font-medium text-white shadow-[0_12px_28px_-14px_rgba(234,88,12,0.75)] transition hover:bg-orange-700 sm:col-span-2">
                            Start free trial
                            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                  {activeStep === 4 && (
                    <div>
                      <SectionHeader index="05" title="Request Demo" icon={<Send className="h-3.5 w-3.5 text-orange-600" />} />

                      <div className="mx-auto grid max-w-[820px] gap-4 lg:grid-cols-[1.05fr_1fr] lg:gap-5">
                        <div className="rounded-3xl border border-slate-200 bg-white/70 p-5 backdrop-blur sm:p-6">
                          <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
                            <Send className="h-4 w-4" />
                          </span>
                          <p className="text-[14px] font-semibold text-slate-800 sm:text-[15px]">See BillPOS in action</p>
                          <p className="mt-2 text-[11.5px] leading-6 text-slate-500 sm:text-[12px]">A 30-minute walkthrough tailored to your restaurant&apos;s workflow. See KOT, BOT, table management, and live kitchen screens with your own scenarios.</p>

                          <ul className="mt-5 space-y-2.5">
                            {["Personalised demo", "Q&A with a product specialist", "Setup roadmap for your restaurant"].map((item) => (
                              <li key={item} className="flex items-center gap-2.5 text-[11.5px] text-slate-600 sm:text-[12px]">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-50 text-orange-700">
                                  <Check className="h-3 w-3" strokeWidth={3} />
                                </span>
                                {item}
                              </li>
                            ))}
                          </ul>

                          <div className="mt-5 rounded-2xl border border-orange-100 bg-orange-50/50 p-3.5">
                            <p className="text-[10.5px] leading-5 text-slate-500 sm:text-[11px]">
                              Preferred slot today: <span className="font-semibold text-orange-700">3:00 PM – 5:00 PM</span> (after lunch rush)
                            </p>
                          </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.35)] sm:p-6">
                          <form className="grid gap-3" onSubmit={(e) => e.preventDefault()}>
                            <Field label="Full name" placeholder="Your name" />
                            <Field label="Email" placeholder="you@example.com" type="email" />
                            <Field label="Preferred date" placeholder="YYYY-MM-DD" type="date" />
                            <div>
                              <label className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Notes</label>
                              <textarea rows={3} placeholder="Tell us about your restaurant…" className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] text-slate-700 outline-none transition focus:border-orange-400" />
                            </div>
                            <button type="submit" className="group mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#111] px-5 py-3 text-[12.5px] font-medium text-white transition hover:bg-orange-600">
                              Book my demo
                              <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="rs-images-wrap grid grid-cols-3 gap-3 lg:flex lg:flex-col lg:gap-6">
            {rightImages.map((item, i) => (
              <div
                key={i}
                className={`rs-image group relative overflow-hidden border border-slate-200/80 bg-slate-50 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.35)] transition-transform duration-500 hover:-translate-y-1 lg:flex-none ${item.shape} ${item.aspect}`}
              >
                <img src={item.src} alt="" className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/20" />
                <span className="absolute left-3 top-3 hidden h-6 w-6 items-center justify-center rounded-full bg-white/90 text-[10px] font-semibold text-slate-700 backdrop-blur sm:flex">
                  0{i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {lightbox !== null && (
        <div className="rs-lightbox fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-md" onClick={closeLightbox}>
          <button type="button" onClick={closeLightbox} aria-label="Close" className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white/20 sm:right-6 sm:top-6">
            <X className="h-5 w-5" />
          </button>
          <div className="rs-lightbox-img relative max-h-[88vh] w-full max-w-[900px] overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.7)]" onClick={(e) => e.stopPropagation()}>
            <img src={galleryItems[lightbox].src} alt={galleryItems[lightbox].title} className="h-auto w-full object-contain" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/95 to-transparent p-4 sm:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-300">{galleryItems[lightbox].badge} · {galleryItems[lightbox].caption}</p>
              <p className={`${serif.className} mt-1 text-[22px] leading-none text-white sm:text-[28px]`}>{galleryItems[lightbox].title}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function SectionHeader({ index, title, icon }: { index: string; title: string; icon: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-end justify-between sm:mb-6">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-orange-600">Section {index}</p>
        <h3 className={`${serif.className} mt-1 text-[22px] leading-none tracking-[-0.02em] text-[#111] sm:text-[32px]`}>{title}</h3>
      </div>
      <span className="hidden h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white sm:flex">{icon}</span>
    </div>
  );
}

function Field({ label, placeholder, type = "text" }: { label: string; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</label>
      <input type={type} placeholder={placeholder} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] text-slate-700 outline-none transition focus:border-orange-400" />
    </div>
  );
}