"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useAuth } from "@/components/auth/AuthProvider";
import AuthModal from "@/components/auth/AuthModal";
import type { User } from "firebase/auth";

import {
  Home,
  LayoutGrid,
  Package,
  Info,
  Mail,
  ArrowUpRight,
  Menu,
  X,
  Sparkles,
  Cpu,
  LogIn,
  LogOut,
  UserPlus,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";

gsap.registerPlugin(SplitText);

/* Palette helpers */
const halftoneLight =
  "radial-gradient(circle, rgba(207,229,246,0.9) 1.2px, transparent 1.7px)";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Solutions", href: "/solutions", icon: LayoutGrid },
  { label: "Packages", href: "/packages", icon: Package },
  { label: "POS Hardware", href: "/hardware", icon: Cpu },
  { label: "About Us", href: "/about", icon: Info },
  { label: "Contact", href: "/contact", icon: Mail },
];

type NavTheme = "light" | "dark" | "blue";

const themeStyles: Record<
  NavTheme,
  {
    nav: string;
    logoBox: string;
    logoText: string;
    logoAccent: string;
    linkActive: string;
    linkInactive: string;
    linkIconActive: string;
    linkIconInactive: string;
    indicator: string;
    mobileButton: string;
    mobilePanel: string;
    mobileHeading: string;
    mobileBrand: string;
    mobileLinkActive: string;
    mobileLinkInactive: string;
    mobileIconActive: string;
    mobileIconInactive: string;
    mobileLabelActive: string;
    mobileLabelInactive: string;
    mobileCurrent: string;
    mobileArrowActive: string;
    mobileArrowInactive: string;
    logoMark: string;
    cta: string;
    avatarRing: string;
  }
> = {
  /* LIGHT — dark navy glass on light pages */
  light: {
    nav: "border-white/10 bg-[#0a1b3d]/95 text-white shadow-[0_8px_35px_rgba(10,27,61,0.35)]",
    logoBox: "border-white/15 bg-white/10",
    logoText: "text-white",
    logoAccent: "text-[#cfe5f6]",
    linkActive:
      "bg-white/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]",
    linkInactive: "text-white/75 hover:bg-white/10 hover:text-white",
    linkIconActive: "text-[#cfe5f6]",
    linkIconInactive: "text-white/60 group-hover:text-[#cfe5f6]",
    indicator: "bg-[#cfe5f6]",
    mobileButton:
      "border-white/20 bg-white/10 text-white hover:bg-white/15",
    mobilePanel:
      "border-white/15 bg-[#0a1b3d]/95 shadow-[0_20px_60px_rgba(10,27,61,0.4)]",
    mobileHeading: "text-white/55",
    mobileBrand: "text-white/40",
    mobileLinkActive: "border-white/15 bg-white/[0.12]",
    mobileLinkInactive:
      "border-transparent hover:border-white/10 hover:bg-white/[0.08]",
    mobileIconActive: "border-[#cfe5f6]/25 bg-[#cfe5f6]/15",
    mobileIconInactive: "border-white/10 bg-white/[0.05]",
    mobileLabelActive: "text-white",
    mobileLabelInactive: "text-white/75",
    mobileCurrent: "text-[#cfe5f6]",
    mobileArrowActive: "text-[#cfe5f6]",
    mobileArrowInactive: "text-white/40",
    logoMark: "border-white/15 bg-white/10 text-[#cfe5f6]",
    // Updated Glassy CTA
    cta: "bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_4px_15px_rgba(0,0,0,0.1)]",
    avatarRing: "ring-[#cfe5f6]/30",
  },

  /* DARK — white glass on dark pages */
  dark: {
    nav: "border-[#0a1b3d]/10 bg-white/90 text-[#0a1b3d] shadow-[0_8px_35px_rgba(10,27,61,0.12)]",
    logoBox: "border-[#0a1b3d]/10 bg-[#0a1b3d]/[0.04]",
    logoText: "text-[#0a1b3d]",
    logoAccent: "text-[#6b7686]",
    linkActive:
      "bg-[#0a1b3d]/[0.08] text-[#0a1b3d] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]",
    linkInactive: "text-[#6b7686] hover:bg-[#0a1b3d]/[0.05] hover:text-[#0a1b3d]",
    linkIconActive: "text-[#0a1b3d]",
    linkIconInactive: "text-[#6b7686]/80 group-hover:text-[#0a1b3d]",
    indicator: "bg-[#0a1b3d]",
    mobileButton:
      "border-[#0a1b3d]/15 bg-white/75 text-[#0a1b3d] hover:bg-[#0a1b3d]/[0.06]",
    mobilePanel:
      "border-[#0a1b3d]/10 bg-white/95 shadow-[0_20px_60px_rgba(10,27,61,0.18)]",
    mobileHeading: "text-[#6b7686]",
    mobileBrand: "text-[#6b7686]/80",
    mobileLinkActive: "border-[#0a1b3d]/[0.10] bg-[#0a1b3d]/[0.05]",
    mobileLinkInactive:
      "border-transparent hover:border-[#0a1b3d]/[0.08] hover:bg-[#0a1b3d]/[0.04]",
    mobileIconActive: "border-[#0a1b3d]/20 bg-[#0a1b3d]/[0.08]",
    mobileIconInactive: "border-[#0a1b3d]/[0.10] bg-[#0a1b3d]/[0.03]",
    mobileLabelActive: "text-[#0a1b3d]",
    mobileLabelInactive: "text-[#6b7686]",
    mobileCurrent: "text-[#0a1b3d]",
    mobileArrowActive: "text-[#0a1b3d]",
    mobileArrowInactive: "text-[#6b7686]/80",
    logoMark: "border-[#0a1b3d]/[0.10] bg-[#0a1b3d]/[0.04] text-[#0a1b3d]",
    // Updated Glassy CTA
    cta: "bg-[#0a1b3d]/80 backdrop-blur-md border border-white/10 text-white hover:bg-[#0a1b3d] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_4px_15px_rgba(0,0,0,0.1)]",
    avatarRing: "ring-white/40",
  },

  /* BLUE — translucent navy on blue sections */
  blue: {
    nav: "border-white/[0.15] bg-[#0a1b3d]/[0.55] text-white shadow-[0_8px_35px_rgba(10,27,61,0.25)]",
    logoBox: "border-white/[0.15] bg-white/[0.07]",
    logoText: "text-white",
    logoAccent: "text-[#cfe5f6]",
    linkActive:
      "bg-white/[0.14] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]",
    linkInactive: "text-white/70 hover:bg-white/[0.08] hover:text-white",
    linkIconActive: "text-[#cfe5f6]",
    linkIconInactive: "text-white/50 group-hover:text-[#cfe5f6]",
    indicator: "bg-[#cfe5f6]",
    mobileButton:
      "border-white/[0.15] bg-[#0a1b3d]/[0.35] text-white hover:bg-white/[0.10]",
    mobilePanel:
      "border-white/[0.13] bg-[#0a1b3d]/[0.85] shadow-[0_20px_60px_rgba(10,27,61,0.35)]",
    mobileHeading: "text-white/55",
    mobileBrand: "text-white/35",
    mobileLinkActive: "border-white/[0.12] bg-white/[0.09]",
    mobileLinkInactive:
      "border-transparent hover:border-white/[0.08] hover:bg-white/[0.05]",
    mobileIconActive: "border-[#cfe5f6]/25 bg-[#cfe5f6]/[0.12]",
    mobileIconInactive: "border-white/[0.10] bg-white/[0.04]",
    mobileLabelActive: "text-white",
    mobileLabelInactive: "text-white/75",
    mobileCurrent: "text-[#cfe5f6]",
    mobileArrowActive: "text-[#cfe5f6]",
    mobileArrowInactive: "text-white/35",
    logoMark: "border-white/[0.14] bg-white/[0.07] text-[#cfe5f6]",
    // Updated Glassy CTA
    cta: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_15px_rgba(0,0,0,0.1)]",
    avatarRing: "ring-[#cfe5f6]/30",
  },
};

/**
 * Circular solid-navy avatar with subtle inner highlight.
 * Shows photoURL if present, else the provided initial.
 */
function AvatarBubble({
  user,
  displayInitial,
  size = "md",
  className = "",
}: {
  user: User | null;
  displayInitial: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeMap = {
    sm: "h-7 w-7 text-[10px]",
    md: "h-9 w-9 text-[11.5px]",
    lg: "h-12 w-12 text-base",
  };

  return (
    <span
      className={`
        relative inline-flex shrink-0 items-center justify-center
        overflow-hidden rounded-full bg-[#0a1b3d] font-bold uppercase
        tracking-wider text-[#cfe5f6]
        shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_3px_10px_-2px_rgba(10,27,61,0.55)]
        ring-2
        ${sizeMap[size]} ${className}
      `}
    >
      {user?.photoURL ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.photoURL}
          alt=""
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        displayInitial
      )}
    </span>
  );
}

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const logoTextRef = useRef<HTMLSpanElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const { user, isAdmin, signOut } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navTheme, setNavTheme] = useState<NavTheme>("dark");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const theme = themeStyles[navTheme];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const openAuth = (mode: "signin" | "signup") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    await signOut();
  };

  const rawName =
    user?.displayName?.trim() || user?.email?.split("@")[0] || "User";
  const displayName =
    rawName.length > 12 ? rawName.slice(0, 11) + "…" : rawName;
  const displayInitial = (rawName[0] ?? "U").toUpperCase();

  /* ---------------- Nav theme detection ---------------- */

  const updateNavTheme = useCallback(() => {
    const navHeight = navRef.current?.getBoundingClientRect().height ?? 64;
    const probeY = Math.min(navHeight / 2, window.innerHeight - 1);

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-nav-theme]")
    );

    const matchingSections = sections.filter((section) => {
      const rect = section.getBoundingClientRect();
      return rect.top <= probeY && rect.bottom > probeY;
    });

    const activeSection = matchingSections.at(-1);
    const requestedTheme = activeSection?.dataset.navTheme;

    if (
      requestedTheme === "light" ||
      requestedTheme === "dark" ||
      requestedTheme === "blue"
    ) {
      setNavTheme((current) =>
        current === requestedTheme ? current : requestedTheme
      );
    } else {
      setNavTheme("light");
    }
  }, []);

  /* ---------------- GSAP entrance ---------------- */

  useEffect(() => {
    let logoSplit: SplitText | undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        { y: -35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.1 }
      );

      gsap.fromTo(
        ".nav-link",
        { y: -8, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.07,
          ease: "power3.out",
          delay: 0.35,
        }
      );

      if (logoTextRef.current) {
        logoSplit = SplitText.create(logoTextRef.current, {
          type: "chars",
          charsClass: "billpos-char",
        });

        gsap.from(logoSplit.chars, {
          y: -75,
          opacity: 0,
          rotationX: -70,
          duration: 0.8,
          stagger: { each: 0.065, from: "start" },
          ease: "bounce.out",
          delay: 0.35,
          clearProps: "transform",
        });
      }
    }, navRef);

    return () => {
      logoSplit?.revert();
      ctx.revert();
    };
  }, []);

  /* ---------------- Theme updates ---------------- */

  useEffect(() => {
    let frame = 0;

    const scheduleUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateNavTheme);
    };

    scheduleUpdate();

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    const observer = new MutationObserver(scheduleUpdate);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-nav-theme"],
    });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      observer.disconnect();
    };
  }, [pathname, updateNavTheme]);

  /* ---------------- Path change → reset ---------------- */

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    if (!window.location.hash) window.scrollTo(0, 0);
  }, [pathname]);

  /* ---------------- Mobile menu scroll lock ---------------- */

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  /* ---------------- Esc key ---------------- */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        setUserMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  /* ---------------- User menu: outside click ---------------- */

  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [userMenuOpen]);

  /* ---------------- User menu: close on sign-out ---------------- */

  useEffect(() => {
    if (!user) setUserMenuOpen(false);
  }, [user]);

  return (
    <>
      <header ref={navRef} className="fixed inset-x-0 top-0 z-50 w-full">
        <nav
          aria-label="Main navigation"
          className={`
            relative mx-auto flex h-[64px] w-full
            items-center justify-between border-b
            px-4 backdrop-blur-2xl
            transition-[background-color,border-color,box-shadow]
            duration-500 ease-out
            sm:h-[70px] sm:px-6 lg:px-10
            ${theme.nav}
          `}
          style={{
            WebkitBackdropFilter: "blur(28px) saturate(180%)",
            backdropFilter: "blur(28px) saturate(180%)",
          }}
        >
          {/* LOGO */}
          <Link
            href="/"
            aria-label="BillPOS home"
            className="group relative z-10 flex shrink-0 items-center gap-2"
          >
            <div
              className={`
                flex h-9 w-9 items-center justify-center rounded-xl
                border shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]
                transition-all duration-300
                ${theme.logoBox}
              `}
            >
              <span
                className={`text-[12px] font-bold tracking-tight ${theme.logoMark}`}
              >
                BP
              </span>
            </div>

            <span
              ref={logoTextRef}
              className={`
                whitespace-nowrap text-[25px] font-semibold
                tracking-[-1.5px] transition-colors duration-300
                sm:text-[28px] ${theme.logoText}
              `}
            >
              Bill<span className={theme.logoAccent}>POS</span>
            </span>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 lg:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`
                    nav-link group relative flex items-center gap-2
                    whitespace-nowrap rounded-xl px-2.5 py-2.5 text-[12.5px]
                    font-medium tracking-wide transition-all duration-300
                    xl:px-3.5 xl:text-[13.5px]
                    ${active ? theme.linkActive : theme.linkInactive}
                  `}
                >
                  <Icon
                    size={15}
                    strokeWidth={1.8}
                    className={`shrink-0 transition-colors duration-300 ${
                      active ? theme.linkIconActive : theme.linkIconInactive
                    }`}
                  />
                  <span className="whitespace-nowrap">{item.label}</span>
                  <span
                    className={`
                      absolute bottom-[3px] left-1/2 h-[2px]
                      -translate-x-1/2 rounded-full
                      transition-all duration-300
                      ${theme.indicator}
                      ${
                        active
                          ? "w-5 opacity-100"
                          : "w-0 opacity-0 group-hover:w-4 group-hover:opacity-70"
                      }
                    `}
                  />
                </Link>
              );
            })}
          </div>

          {/* DESKTOP RIGHT — auth + CTA */}
          <div className="ml-auto hidden shrink-0 items-center gap-2 lg:flex">
            {!user ? (
              <button
                type="button"
                onClick={() => openAuth("signin")}
                className={`
                  group relative inline-flex h-[42px] items-center gap-2
                  overflow-hidden rounded-xl border px-4 text-[12px] font-semibold
                  tracking-wide backdrop-blur-xl transition-all duration-300
                  hover:-translate-y-0.5
                  ${theme.mobileButton}
                `}
              >
                <LogIn
                  size={14}
                  strokeWidth={1.8}
                  className="relative z-10"
                />
                <span className="relative z-10 whitespace-nowrap">
                  Sign In
                </span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                />
              </button>
            ) : (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((o) => !o)}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="menu"
                  className={`
                    group inline-flex h-[42px] max-w-[180px] items-center gap-2
                    overflow-hidden rounded-xl border pl-1 pr-2.5 text-[12px]
                    font-semibold tracking-wide backdrop-blur-xl
                    transition-all duration-300 hover:-translate-y-0.5
                    ${theme.mobileButton}
                  `}
                >
                  <span className="relative shrink-0">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -inset-1 rounded-full bg-[#cfe5f6] opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-60"
                    />
                    <AvatarBubble
                      user={user}
                      displayInitial={displayInitial}
                      size="md"
                      className={`relative ${theme.avatarRing}`}
                    />
                  </span>
                  <span className="hidden max-w-[90px] overflow-hidden text-ellipsis whitespace-nowrap 2xl:block">
                    {displayName}
                  </span>
                  <ChevronDown
                    size={14}
                    strokeWidth={2}
                    className={`shrink-0 transition-transform duration-200 ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {userMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full mt-2 w-72 overflow-hidden rounded-2xl border border-[#0a1b3d]/10 bg-white shadow-[0_25px_60px_-15px_rgba(10,27,61,0.35)] ring-1 ring-[#0a1b3d]/5"
                  >
                    {/* Dropdown hero */}
                    <div className="relative overflow-hidden bg-[#0a1b3d] px-4 py-4 text-white">
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 opacity-15"
                        style={{
                          backgroundImage: halftoneLight,
                          backgroundSize: "9px 9px",
                        }}
                      />
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-[#cfe5f6]/10 blur-2xl"
                      />
                      <div className="relative flex items-center gap-3">
                        <AvatarBubble
                          user={user}
                          displayInitial={displayInitial}
                          size="lg"
                          className="ring-[#cfe5f6]/35"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-white">
                            {rawName}
                          </p>
                          <p className="mt-0.5 truncate text-[11.5px] text-[#cfe5f6]/80">
                            {user.email}
                          </p>
                          {isAdmin && (
                            <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#cfe5f6] px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-[#0a1b3d]">
                              <Sparkles size={9} />
                              Admin
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="p-1.5">
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          role="menuitem"
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium text-[#0a1b3d] transition hover:bg-[#f1f4f8]"
                        >
                          <LayoutDashboard
                            size={15}
                            strokeWidth={1.9}
                            className="text-[#0a1b3d]"
                          />
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={handleSignOut}
                        role="menuitem"
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-[#6b7686] transition hover:bg-[#f1f4f8] hover:text-[#0a1b3d]"
                      >
                        <LogOut size={15} strokeWidth={1.9} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <Link
              href="/demo"
              className={`
                group relative inline-flex h-[42px] items-center gap-2
                overflow-hidden rounded-xl px-4
                text-[12px] font-semibold tracking-wide
                transition-all duration-300 hover:-translate-y-0.5
                ${theme.cta}
              `}
            >
              <span className="relative z-10 whitespace-nowrap">
                Request Demo
              </span>
              <ArrowUpRight
                size={15}
                strokeWidth={1.8}
                className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              />
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className={`
              ml-auto flex h-10 w-10 items-center justify-center
              rounded-xl border backdrop-blur-xl
              transition-all duration-300 lg:hidden
              ${theme.mobileButton}
            `}
            aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? (
              <X size={20} strokeWidth={1.8} />
            ) : (
              <Menu size={20} strokeWidth={1.8} />
            )}
          </button>
        </nav>

        {/* MOBILE NAVIGATION */}
        <div
          id="mobile-navigation"
          aria-hidden={!mobileMenuOpen}
          className={`
            w-full overflow-hidden px-3
            transition-all duration-300 ease-out sm:px-5 lg:hidden
            ${
              mobileMenuOpen
                ? "pointer-events-auto max-h-[100dvh] translate-y-0 pt-2 opacity-100"
                : "pointer-events-none max-h-0 -translate-y-2 opacity-0"
            }
          `}
        >
          <div
            className={`
              mx-auto max-w-xl max-h-[calc(100dvh-100px)] overflow-y-auto overscroll-contain rounded-2xl border p-3
              backdrop-blur-2xl transition-colors duration-500
              ${theme.mobilePanel}
            `}
            style={{
              WebkitBackdropFilter: "blur(32px) saturate(180%)",
              backdropFilter: "blur(32px) saturate(180%)",
            }}
          >
            {/* Heading */}
            <div className="mb-2 flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-2">
                <Sparkles
                  size={14}
                  className={theme.logoAccent}
                  strokeWidth={1.7}
                />
                <span
                  className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${theme.mobileHeading}`}
                >
                  Navigation
                </span>
              </div>
              <span
                className={`text-[10px] font-medium ${theme.mobileBrand}`}
              >
                BillPOS
              </span>
            </div>

            {/* Links */}
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    tabIndex={mobileMenuOpen ? 0 : -1}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      group flex items-center justify-between rounded-xl
                      border px-3 py-3.5 transition-all duration-300
                      ${
                        active
                          ? theme.mobileLinkActive
                          : theme.mobileLinkInactive
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`
                          flex h-9 w-9 items-center justify-center
                          rounded-lg border transition-all duration-300
                          ${
                            active
                              ? theme.mobileIconActive
                              : theme.mobileIconInactive
                          }
                        `}
                      >
                        <Icon
                          size={16}
                          strokeWidth={1.8}
                          className={
                            active
                              ? theme.linkIconActive
                              : theme.linkIconInactive
                          }
                        />
                      </div>
                      <div>
                        <span
                          className={`
                            block whitespace-nowrap text-[13px] font-medium
                            ${
                              active
                                ? theme.mobileLabelActive
                                : theme.mobileLabelInactive
                            }
                          `}
                        >
                          {item.label}
                        </span>
                        {active && (
                          <span
                            className={`mt-0.5 block text-[9px] uppercase tracking-[0.15em] ${theme.mobileCurrent}`}
                          >
                            Current page
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowUpRight
                      size={15}
                      strokeWidth={1.7}
                      className={`
                        transition-all duration-300
                        ${
                          active
                            ? theme.mobileArrowActive
                            : `${theme.mobileArrowInactive} group-hover:translate-x-0.5 group-hover:-translate-y-0.5`
                        }
                      `}
                    />
                  </Link>
                );
              })}
            </div>

            {/* CTA */}
            <div className="mt-3 border-t border-current/10 pt-3">
              <Link
                href="/contact#demo"
                tabIndex={mobileMenuOpen ? 0 : -1}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  group flex h-[48px] w-full items-center justify-center
                  gap-2 rounded-xl text-[13px] font-semibold
                  transition-all duration-300 hover:-translate-y-0.5
                  ${theme.cta}
                `}
              >
                <span>Request a Demo</span>
                <ArrowUpRight
                  size={16}
                  strokeWidth={1.8}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>

            {/* AUTH */}
            <div className="mt-2 border-t border-current/10 pt-3">
              {!user ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => openAuth("signin")}
                    tabIndex={mobileMenuOpen ? 0 : -1}
                    className={`
                      flex h-[48px] items-center justify-center gap-2
                      rounded-xl border text-[13px] font-semibold
                      backdrop-blur-xl transition-all duration-300
                      ${theme.mobileButton}
                    `}
                  >
                    <LogIn size={15} strokeWidth={1.8} />
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => openAuth("signup")}
                    tabIndex={mobileMenuOpen ? 0 : -1}
                    className={`flex h-[48px] items-center justify-center gap-2 rounded-xl text-[13px] font-semibold transition-all duration-300 hover:-translate-y-0.5 ${theme.cta}`}
                  >
                    <UserPlus size={15} strokeWidth={1.8} />
                    Sign Up
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center gap-3 rounded-xl border border-current/10 px-3 py-3">
                    <AvatarBubble
                      user={user}
                      displayInitial={displayInitial}
                      size="md"
                      className={theme.avatarRing}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold">
                        {rawName}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] opacity-70">
                        {user.email}
                      </p>
                    </div>
                    {isAdmin && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#cfe5f6] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#0a1b3d]">
                        Admin
                      </span>
                    )}
                  </div>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      tabIndex={mobileMenuOpen ? 0 : -1}
                      className={`
                        flex items-center gap-2.5 rounded-xl border
                        px-3 py-3 text-[13px] font-medium transition-all duration-300
                        ${
                          isActive("/admin")
                            ? theme.mobileLinkActive
                            : theme.mobileLinkInactive
                        }
                      `}
                    >
                      <LayoutDashboard size={15} strokeWidth={1.8} />
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleSignOut}
                    tabIndex={mobileMenuOpen ? 0 : -1}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-3 text-left text-[13px] font-medium text-[#6b7686] transition-all duration-300 hover:bg-[#0a1b3d]/5 hover:text-[#0a1b3d]"
                  >
                    <LogOut size={15} strokeWidth={1.8} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE BACKDROP */}
      <div
        aria-hidden="true"
        onClick={() => setMobileMenuOpen(false)}
        className={`
          fixed inset-0 z-40 bg-[#0a1b3d]/25
          backdrop-blur-[2px] transition-opacity duration-300 lg:hidden
          ${
            mobileMenuOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      />

      {/* AUTH MODAL */}
      <AuthModal
        open={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}
