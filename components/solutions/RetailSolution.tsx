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
  ShieldCheck,
  Truck,
  Barcode,
  Warehouse,
  Repeat,
  Calculator,
  Cloud,
  Store,
  Settings,
  Headphones,
  Layers,
  Maximize2,
  X,
  Compass,
  Zap,
  Star,
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
  { id: "demo", label: "Request Demo" },
];

const previewItems = [
  { Icon: Compass, label: "Overview", note: "The big picture", offset: "lg:-translate-y-3", tint: "bg-blue-50 text-blue-700" },
  { Icon: Zap, label: "Features", note: "14 capabilities", offset: "lg:translate-y-1", tint: "bg-violet-50 text-violet-700" },
  { Icon: ImageIcon, label: "Gallery", note: "Live POS screens", offset: "lg:-translate-y-4", tint: "bg-sky-50 text-sky-700" },
  { Icon: Send, label: "Live Demo", note: "Book a walkthrough", offset: "lg:-translate-y-2", tint: "bg-amber-50 text-amber-700" },
];

const previewStats = [
  { value: "2,000+", label: "Businesses" },
  { value: "1.4M+", label: "Bills processed" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" },
];

const previewChips = [
  "Fast billing",
  "VAT ready",
  "Multi-store",
  "Cloud-based",
  "Barcode support",
  "Live reports",
];

const accordionData = [
  { Icon: Receipt, tag: "Billing", title: "Fast & Reliable POS Billing System", body: "Lightning-fast billing with barcode scanning, multiple payment modes, split payments, receipt printing, and offline-capable operation — even during peak rush hours." },
  { Icon: Calculator, tag: "Compliance", title: "VAT Calculation & Compliance Support", body: "Fully compliant with the new government VAT requirements. Automatic VAT calculation, tax-inclusive pricing, VAT reports, and ready-to-file summaries keep your business audit-ready." },
  { Icon: TrendingUp, tag: "Real-time", title: "Real-Time Sales & Inventory Tracking", body: "Watch sales flow in live from every counter. Stock levels update automatically after every sale, so you always know exactly what you have — across every outlet." },
  { Icon: Package, tag: "Purchasing", title: "Complete Purchase Management", body: "Create purchase orders, record GRN, track supplier invoices, and manage payments end-to-end. Automatic cost-price updates keep your margins accurate." },
  { Icon: Warehouse, tag: "Warehouse", title: "Warehouse & Stock Management", body: "Handle multiple warehouses and stores with true multi-location inventory. Transfer stock between outlets, track bins and shelves, and prevent over-ordering." },
  { Icon: Repeat, tag: "Movement", title: "Stock Movement Tracking", body: "Every unit's journey — purchase, transfer, sale, return, adjustment — recorded with timestamps and user IDs. Full traceability for every item, always." },
  { Icon: Truck, tag: "Suppliers", title: "Supplier Management", body: "Store supplier details, payment terms, and history. Track outstanding payables, compare supplier pricing, and issue purchase orders in a few clicks." },
  { Icon: Barcode, tag: "Barcode", title: "Barcode Support", body: "Print and scan barcodes for products, variants, and batches. Generate barcode labels directly, and use any USB or Bluetooth scanner for instant checkout." },
  { Icon: Users, tag: "Customers", title: "Customer Management", body: "Build customer profiles with purchase history, loyalty points, credit limits, and contact details. Quick lookup at checkout and instant repeat-order options." },
  { Icon: BarChart3, tag: "Reports", title: "Advanced Sales & Business Reports", body: "40+ ready reports — daily sales, profit & loss, top products, staff performance, VAT summaries, stock aging, and more. Export to Excel or PDF instantly." },
  { Icon: Cloud, tag: "Security", title: "Secure Cloud-Based Platform", body: "Access your business from anywhere, on any device. Bank-level encryption, automatic backups, role-based access, and 99.9% uptime keep your data safe." },
  { Icon: Store, tag: "Multi-store", title: "Multi-Store Management", body: "Run unlimited outlets from one dashboard. Centralised pricing, per-store stock, cross-store reports, and user roles per location — all in one login." },
  { Icon: Settings, tag: "Flexible", title: "Customizable to Your Business Requirements", body: "Custom fields, invoice designs, tax rules, workflow steps, and user permissions — BillPOS adapts to how your business actually runs, not the other way around." },
  { Icon: Headphones, tag: "Support", title: "Expert Onboarding & Ongoing Support", body: "Free guided setup, staff training, and data migration. A dedicated support team available 24/7 to make sure you're never blocked in your daily operations." },
];

const galleryItems = [
  { src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=85", title: "Counter POS", caption: "Fast counter billing", badge: "CORE" },
  { src: "https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&w=1200&q=85", title: "Checkout Screen", caption: "Barcode-first workflow", badge: "POS" },
  { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85", title: "Analytics Dashboard", caption: "Real-time business insights", badge: "REPORTS" },
  { src: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1200&q=85", title: "Store Floor", caption: "Multi-outlet control", badge: "STORE" },
  { src: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=85", title: "Inventory System", caption: "Live stock tracking", badge: "STOCK" },
  { src: "https://images.unsplash.com/photo-1556741533-411cf82e4e2d?auto=format&fit=crop&w=1200&q=85", title: "Back Office", caption: "Admin and reports", badge: "ADMIN" },
];

const quickStats = [
  { value: "3s", label: "Avg. billing time" },
  { value: "40+", label: "Ready reports" },
  { value: "99.9%", label: "Uptime" },
];

const leftImages = [
  { src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80", shape: "rounded-[32px]", aspect: "aspect-[4/5]" },
  { src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80", shape: "rounded-t-[120px] rounded-b-[32px]", aspect: "aspect-[4/5]" },
  { src: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=800&q=80", shape: "rounded-[32px]", aspect: "aspect-square" },
];

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export default function RetailSolution() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const shouldScrollRef = useRef(false);
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
        { x: -60, opacity: 0, scale: 0.94 },
        {
          x: 0, opacity: 1, scale: 1, duration: 0.9, stagger: 0.14, ease: "power3.out",
          scrollTrigger: { trigger: root.querySelector(".rs-images-wrap"), start: "top 85%", once: true },
        }
      );

      gsap.fromTo(
        qa(".rs-title"),
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: root.querySelector(".rs-title"), start: "top 90%", once: true },
        }
      );

      const playTl = gsap.timeline({
        scrollTrigger: { trigger: root.querySelector(".rs-play"), start: "top 88%", once: true },
      });

      playTl
        .fromTo(qa(".rs-play-btn"), { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.85, ease: "back.out(1.7)" })
        .fromTo(qa(".rs-click-here"), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.4")
        .fromTo(qa(".rs-play-hint"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.25")
        .fromTo(
          qa(".rs-preview-card"),
          { y: 24, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.65, stagger: { each: 0.08, from: "center" }, ease: "back.out(1.5)" },
          "-=0.35"
        )
        .fromTo(
          qa(".rs-preview-stats > div"),
          { y: 20, opacity: 0, scale: 0.94 },
          { y: 0, opacity: 1, scale: 1, duration: 0.55, stagger: 0.08, ease: "back.out(1.4)" },
          "-=0.15"
        )
        .fromTo(
          qa(".rs-preview-chips > span"),
          { y: 12, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: "back.out(1.5)" },
          "-=0.3"
        )
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

    const cfg = anims[activeStep] ?? anims[0];

    gsap.fromTo(el, cfg.from, {
      x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, duration: 0.75, ease: cfg.ease,
    });

    if (activeStep === 1) {
      requestAnimationFrame(() => {
        gsap.fromTo(qa(".rs-feature-row"), { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power3.out" });
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
    if (!shouldScrollRef.current) return;
    shouldScrollRef.current = false;

    const el = contentRef.current;
    if (!el) return;

    const t = setTimeout(() => {
      const top = el.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top, behavior: "smooth" });
    }, 60);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep]);

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
      id="retail"
      className={`${sans.className} relative w-full scroll-mt-24 overflow-hidden bg-white pt-12 pb-6 sm:pt-16 sm:pb-8 lg:pt-24 lg:pb-10`}
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
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(15,23,42,0.08) 1px, transparent 0)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse at 50% 40%, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, black 30%, transparent 80%)",
        }}
      />

      <div
        aria-hidden="true"
        className="rs-blob-a pointer-events-none absolute -right-40 top-16 hidden h-[520px] w-[520px] lg:block"
        style={{
          background: "radial-gradient(circle at 40% 40%, rgba(219,234,254,0.65), rgba(237,233,254,0.35) 55%, transparent 75%)",
          borderRadius: "58% 42% 45% 55% / 60% 62% 38% 40%",
          filter: "blur(2px)",
        }}
      />

      <div
        aria-hidden="true"
        className="rs-blob-b pointer-events-none absolute -left-32 bottom-10 hidden h-[320px] w-[320px] lg:block"
        style={{
          background: "radial-gradient(circle at 60% 60%, rgba(224,231,255,0.55), transparent 70%)",
          borderRadius: "42% 58% 55% 45% / 55% 45% 55% 45%",
          filter: "blur(4px)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)_220px] lg:gap-10 xl:gap-14">

          {/* LEFT — images */}
          <div className="rs-images-wrap grid grid-cols-3 gap-3 lg:flex lg:flex-col lg:gap-6">
            {leftImages.map((item, i) => (
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

          {/* CENTER */}
          <div className="relative min-w-0">
            <div className="rs-title flex flex-col items-center text-center">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-700 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                Built for retail
              </span>

              <h2 className={`${serif.className} text-[32px] leading-[1.05] tracking-[-0.02em] text-[#111] sm:text-[46px] lg:text-[64px]`}>
                Retail <span className="italic text-blue-700">Solution</span>
              </h2>

              <p className="mt-3 max-w-[560px] text-[13px] leading-7 text-slate-500 sm:text-[14.5px]">
                Manage your retail business smarter with a powerful POS system designed to simplify billing, inventory, purchasing, and daily operations.
              </p>
            </div>

            {!stepperVisible && (
              <div className="rs-play mt-8 flex flex-col items-center justify-center">
                <button
                  type="button"
                  onClick={handlePlayClick}
                  aria-label="Reveal retail solution steps"
                  className="rs-play-btn group relative flex h-[80px] w-[80px] items-center justify-center rounded-full bg-gradient-to-br from-blue-700 to-blue-500 text-white shadow-[0_22px_50px_-20px_rgba(29,78,216,0.85)] sm:h-[88px] sm:w-[88px]"
                >
                  <span className="rs-play-ring absolute inset-0 rounded-full border border-blue-400/60" />
                  <span className="rs-play-ring absolute inset-0 rounded-full border border-blue-400/40" style={{ animationDelay: "0.6s" }} />

                  <svg className="rs-spin-slow absolute inset-[-6px] h-[92px] w-[92px] text-blue-200/70 sm:h-[100px] sm:w-[100px]" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="47" stroke="currentColor" strokeWidth="1" strokeDasharray="3 6" />
                  </svg>

                  <MousePointerClick className="relative h-6 w-6 sm:h-7 sm:w-7" />
                </button>

                <p className="rs-click-here mt-3 text-[10.5px] font-medium uppercase tracking-[0.2em] text-slate-500 sm:text-[11.5px]">
                  Click here
                </p>

                <p className="rs-play-hint mt-2 max-w-[420px] text-center text-[11px] leading-5 text-slate-400 sm:text-[12px] sm:leading-6">
                  Explore full details, features, and live POS screens.
                  <br className="hidden sm:block" /> Start a free demo or book a personalised walkthrough — all in one place.
                </p>

                <div className="rs-preview-wrap mt-10 hidden w-full lg:block">
                  <div className="rs-preview-header mb-5 flex items-center justify-center gap-3">
                    <span className="h-px w-10 bg-slate-200" />
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                      What you&apos;ll discover
                    </p>
                    <span className="h-px w-10 bg-slate-200" />
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    {previewItems.map(({ Icon, label, note, offset, tint }, i) => (
                      <div
                        key={label}
                        className={`rs-preview-card relative flex flex-col items-center rounded-2xl border border-slate-200/80 bg-white/80 px-2.5 py-4 text-center shadow-[0_18px_40px_-30px_rgba(15,23,42,0.35)] backdrop-blur transition-transform duration-500 hover:-translate-y-1 hover:border-blue-200 ${offset}`}
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
                        <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-blue-50/0 via-blue-50/40 to-blue-100/0 opacity-70" />
                        <p className="rs-stat-value relative text-[17px] font-semibold tracking-tight text-slate-800">{s.value}</p>
                        <p className="relative mt-0.5 text-[9px] font-medium uppercase tracking-wider text-slate-400">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rs-preview-chips mt-5 flex w-full flex-wrap items-center justify-center gap-2">
                    {previewChips.map((c) => (
                      <span key={c} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-[10.5px] font-medium text-slate-600 backdrop-blur transition hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-700">
                        <Star className="h-2.5 w-2.5 text-blue-500" />
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
                  <div className="rs-line-fill pointer-events-none absolute left-4 top-3 h-[2px] rounded bg-gradient-to-r from-blue-700 via-blue-500 to-sky-400" style={{ width: "calc(100% - 2rem)" }} />

                  <div className="relative flex items-start justify-between">
                    {steps.map((step, i) => {
                      const isActive = activeStep === i;
                      const isPast = activeStep > i;

                      return (
                        <button
                          key={step.id}
                          type="button"
                          onClick={() => {
                            if (step.id === "demo") {
                              window.location.href = "/demo";
                            } else {
                              setActiveStep(i);
                            }
                          }}
                          className="group flex flex-1 flex-col items-center text-center"
                        >
                          <span className={`rs-step-circle relative flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-300 sm:h-7 sm:w-7 ${isActive ? "border-blue-700 bg-blue-700 shadow-[0_0_0_6px_rgba(29,78,216,0.12)]" : isPast ? "border-blue-500 bg-blue-500" : "border-slate-200 bg-white group-hover:border-blue-300"}`}>
                            {isPast || isActive ? <Check className="h-3 w-3 text-white sm:h-3.5 sm:w-3.5" strokeWidth={3} /> : <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />}
                            {isActive && <span className="absolute inset-[-4px] animate-ping rounded-full border border-blue-400/50" />}
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
                      <SectionHeader index="01" title="Overview" icon={<Sparkles className="h-3.5 w-3.5 text-blue-600" />} />

                      <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
                        <div>
                          <div className="space-y-4 text-[12.5px] leading-7 text-slate-600 sm:text-[13.5px]">
                            <p>BillPOS brings your retail sales, inventory, purchasing, and daily operations into a single connected system. From a small counter to a multi-outlet chain, everything talks to each other in real time.</p>
                            <p>Bill faster with barcode-driven checkout, keep every outlet&apos;s stock accurate, and see what&apos;s actually selling — without spreadsheets or second-guessing.</p>
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
                            <Link href="/demo" className="group inline-flex items-center gap-2 rounded-full bg-[#111] px-5 py-2.5 text-[12px] font-medium text-white transition hover:bg-blue-700">
                              Request a Demo
                              <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => {
                                shouldScrollRef.current = true;
                                setActiveStep(1);
                              }}
                              className="group inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-medium text-slate-700 transition hover:border-blue-300"
                            >
                              See all features
                              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                            </button>
                          </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white/70 p-5 backdrop-blur">
                          <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                            <Users className="h-4 w-4" />
                          </span>
                          <p className="text-[13px] font-semibold text-slate-800">Trusted by 2,000+ retailers</p>
                          <p className="mt-1.5 text-[11px] leading-5 text-slate-400">Supermarkets, boutiques, and multi-outlet chains.</p>

                          <div className="mt-4 flex items-center gap-2">
                            {["bg-blue-500", "bg-violet-500", "bg-emerald-500", "bg-amber-500"].map((c, i) => (
                              <span key={i} className={`h-7 w-7 rounded-full border-2 border-white ${c}`} />
                            ))}
                            <span className="flex h-7 items-center rounded-full border-2 border-white bg-slate-100 px-2 text-[10px] font-semibold text-slate-600">+2k</span>
                          </div>

                          <div className="mt-5 border-t border-slate-100 pt-4">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">This month</span>
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9.5px] font-semibold text-emerald-700">+18%</span>
                            </div>
                            <p className="mt-1 text-[11px] text-slate-400">Average sales lift</p>
                            <div className="mt-3 flex h-12 items-end gap-1">
                              {[40, 62, 48, 75, 58, 90, 70].map((h, i) => (
                                <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-blue-700 to-blue-400" style={{ height: `${h}%` }} />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStep === 1 && (
                    <div>
                      <SectionHeader index="02" title="Features" icon={<Sparkles className="h-3.5 w-3.5 text-blue-600" />} />

                      <div className="mb-6 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50/70 to-white p-4 sm:p-5">
                        <div className="flex items-start gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-white">
                            <Layers className="h-4 w-4" />
                          </span>
                          <div>
                            <p className="text-[13.5px] font-semibold text-slate-800">Everything your retail business needs</p>
                            <p className="mt-1 text-[11.5px] leading-5 text-slate-500">BillPOS helps you reduce manual work, control your inventory, and grow your retail business efficiently — all in one place.</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        {accordionData.map(({ Icon, tag, title, body }, i) => {
                          const isOpen = openAccordion === i;

                          return (
                            <div key={title} className={`rs-feature-row group overflow-hidden rounded-2xl border transition-all duration-300 ${isOpen ? "border-blue-200 bg-white shadow-[0_20px_45px_-30px_rgba(29,78,216,0.35)]" : "border-slate-200 bg-white/70 hover:border-blue-200"}`}>
                              <button type="button" onClick={() => setOpenAccordion(isOpen ? -1 : i)} className="flex w-full items-center gap-3 p-3 text-left sm:p-3.5">
                                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-300 sm:h-10 sm:w-10 ${isOpen ? "bg-blue-700 text-white" : "bg-blue-50 text-blue-700"}`}>
                                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </span>
                                <div className="min-w-0 flex-1">
                                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:text-[9.5px]">{tag}</p>
                                  <p className="mt-0.5 text-[12.5px] font-semibold leading-tight text-slate-800 sm:truncate sm:text-[13.5px]">{title}</p>
                                </div>
                                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 sm:h-8 sm:w-8 ${isOpen ? "rotate-180 border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-400 group-hover:border-blue-200 group-hover:text-blue-600"}`}>
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
                          All <span className="font-semibold text-slate-700">14 features</span> are included in every plan.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div>
                      <SectionHeader index="03" title="Gallery" icon={<ImageIcon className="h-3.5 w-3.5 text-blue-600" />} />

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
                              <p className="text-[9px] font-semibold uppercase tracking-wider text-blue-300">{g.caption}</p>
                              <p className="mt-0.5 text-[11px] font-semibold leading-tight text-white sm:text-[12px]">{g.title}</p>
                            </div>
                          </button>
                        ))}
                      </div>

                      <p className="mt-5 text-center text-[11px] text-slate-400">Click any screen to view the full-size preview</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — info panel */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-white/70 p-5 backdrop-blur">
                <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <ShoppingBag className="h-4 w-4" />
                </span>
                <p className="text-[13px] font-semibold text-slate-800">Ready to try it?</p>
                <p className="mt-1.5 text-[11px] leading-5 text-slate-500">Free 30-day demo. No card needed.</p>
                <Link href="/demo" className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#111] px-4 py-2.5 text-[11.5px] font-medium text-white transition hover:bg-blue-700">
                  Start free demo
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white/70 p-5 backdrop-blur">
                <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <TrendingUp className="h-4 w-4" />
                </span>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">This month</p>
                <p className="mt-2 text-[22px] font-semibold leading-tight tracking-tight text-slate-800">+18%</p>
                <p className="mt-1 text-[11px] text-slate-400">Average sales lift</p>
              </div>
            </div>
          </aside>
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
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-300">{galleryItems[lightbox].badge} · {galleryItems[lightbox].caption}</p>
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
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-700">Section {index}</p>
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
      <input type={type} placeholder={placeholder} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] text-slate-700 outline-none transition focus:border-blue-400" />
    </div>
  );
}
