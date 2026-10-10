
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

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
} from "lucide-react";

gsap.registerPlugin(SplitText);

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Solutions", href: "/solutions", icon: LayoutGrid },
  { label: "Packages", href: "/packages", icon: Package },
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
  }
> = {
  light: {
    // Dark, low-opacity glass over light sections.
    nav: "border-white/10 bg-slate-950/[0.20] text-white shadow-[0_8px_35px_rgba(0,0,0,0.10)]",
    logoBox: "border-white/15 bg-white/[0.08]",
    logoText: "text-white",
    logoAccent: "text-indigo-300",
    linkActive:
      "bg-white/[0.14] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]",
    linkInactive:
      "text-white/70 hover:bg-white/[0.08] hover:text-white",
    linkIconActive: "text-indigo-300",
    linkIconInactive: "text-white/55 group-hover:text-indigo-300",
    indicator: "bg-indigo-300",
    mobileButton:
      "border-white/15 bg-slate-950/[0.15] text-white hover:bg-white/[0.10]",
    mobilePanel:
      "border-white/[0.14] bg-slate-950/[0.78] shadow-[0_20px_60px_rgba(0,0,0,0.20)]",
    mobileHeading: "text-white/55",
    mobileBrand: "text-white/40",
    mobileLinkActive: "border-white/[0.12] bg-white/[0.10]",
    mobileLinkInactive:
      "border-transparent hover:border-white/[0.08] hover:bg-white/[0.06]",
    mobileIconActive: "border-indigo-300/20 bg-indigo-400/[0.13]",
    mobileIconInactive: "border-white/[0.10] bg-white/[0.04]",
    mobileLabelActive: "text-white",
    mobileLabelInactive: "text-white/75",
    mobileCurrent: "text-indigo-300",
    mobileArrowActive: "text-indigo-300",
    mobileArrowInactive: "text-white/40",
    logoMark: "border-white/15 bg-white/[0.08] text-indigo-300",
  },

  dark: {
    nav: "border-white/[0.10] bg-black/[0.16] text-white shadow-[0_8px_35px_rgba(0,0,0,0.12)]",
    logoBox: "border-white/[0.13] bg-white/[0.06]",
    logoText: "text-white",
    logoAccent: "text-indigo-300",
    linkActive:
      "bg-white/[0.12] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]",
    linkInactive:
      "text-white/65 hover:bg-white/[0.07] hover:text-white",
    linkIconActive: "text-indigo-300",
    linkIconInactive: "text-white/45 group-hover:text-indigo-300",
    indicator: "bg-indigo-300",
    mobileButton:
      "border-white/[0.14] bg-black/[0.12] text-white hover:bg-white/[0.08]",
    mobilePanel:
      "border-white/[0.12] bg-black/[0.76] shadow-[0_20px_60px_rgba(0,0,0,0.25)]",
    mobileHeading: "text-white/50",
    mobileBrand: "text-white/35",
    mobileLinkActive: "border-white/[0.12] bg-white/[0.09]",
    mobileLinkInactive:
      "border-transparent hover:border-white/[0.08] hover:bg-white/[0.05]",
    mobileIconActive: "border-indigo-300/20 bg-indigo-400/[0.12]",
    mobileIconInactive: "border-white/[0.10] bg-white/[0.04]",
    mobileLabelActive: "text-white",
    mobileLabelInactive: "text-white/70",
    mobileCurrent: "text-indigo-300",
    mobileArrowActive: "text-indigo-300",
    mobileArrowInactive: "text-white/35",
    logoMark: "border-white/[0.13] bg-white/[0.06] text-indigo-300",
  },

  blue: {
    nav: "border-white/[0.12] bg-[#071A2D]/[0.18] text-white shadow-[0_8px_35px_rgba(0,0,0,0.12)]",
    logoBox: "border-white/[0.14] bg-white/[0.07]",
    logoText: "text-white",
    logoAccent: "text-sky-300",
    linkActive:
      "bg-white/[0.12] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]",
    linkInactive:
      "text-blue-50/70 hover:bg-white/[0.07] hover:text-white",
    linkIconActive: "text-sky-300",
    linkIconInactive: "text-blue-50/50 group-hover:text-sky-300",
    indicator: "bg-sky-300",
    mobileButton:
      "border-white/[0.15] bg-[#071A2D]/[0.12] text-white hover:bg-white/[0.09]",
    mobilePanel:
      "border-white/[0.13] bg-[#071A2D]/[0.78] shadow-[0_20px_60px_rgba(0,0,0,0.25)]",
    mobileHeading: "text-blue-50/55",
    mobileBrand: "text-blue-50/35",
    mobileLinkActive: "border-white/[0.12] bg-white/[0.09]",
    mobileLinkInactive:
      "border-transparent hover:border-white/[0.08] hover:bg-white/[0.05]",
    mobileIconActive: "border-sky-300/20 bg-sky-300/[0.12]",
    mobileIconInactive: "border-white/[0.10] bg-white/[0.04]",
    mobileLabelActive: "text-white",
    mobileLabelInactive: "text-blue-50/75",
    mobileCurrent: "text-sky-300",
    mobileArrowActive: "text-sky-300",
    mobileArrowInactive: "text-blue-50/35",
    logoMark: "border-white/[0.14] bg-white/[0.07] text-sky-300",
  },
};

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const logoTextRef = useRef<HTMLSpanElement>(null);

  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navTheme, setNavTheme] = useState<NavTheme>("dark");

  const theme = themeStyles[navTheme];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Detect the section currently passing behind the navbar.
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
      setNavTheme("dark");
    }
  }, []);

  // GSAP navbar and logo entrance animations.
  useEffect(() => {
    let logoSplit: SplitText | undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        { y: -35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          delay: 0.1,
        }
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
          stagger: {
            each: 0.065,
            from: "start",
          },
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

  // Update the glass theme while scrolling, resizing, or navigating.
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

  // Reset scroll position whenever the page changes.
  useEffect(() => {
    setMobileMenuOpen(false);

    // Preserve anchor navigation, such as /contact#demo.
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  // Prevent background scrolling while the mobile menu is open.
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

  // Support closing the menu with Escape.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header
        ref={navRef}
        className="fixed inset-x-0 top-0 z-50 w-full"
      >
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
                group-hover:border-indigo-300/40
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

          {/* DESKTOP NAVIGATION */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
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
                    rounded-xl px-3.5 py-2.5 text-[13px]
                    font-medium tracking-wide transition-all duration-300
                    xl:px-4 xl:text-[14px]
                    ${active ? theme.linkActive : theme.linkInactive}
                  `}
                >
                  <Icon
                    size={15}
                    strokeWidth={1.8}
                    className={`
                      transition-colors duration-300
                      ${active ? theme.linkIconActive : theme.linkIconInactive}
                    `}
                  />

                  <span>{item.label}</span>

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

          {/* DESKTOP CTA */}
          <div className="ml-auto hidden items-center lg:flex">
            <Link
              href="/contact#demo"
              className="
                group relative inline-flex h-[42px] items-center gap-2
                overflow-hidden rounded-xl border border-indigo-400/20
                bg-indigo-600 px-4 text-[12px] font-semibold
                tracking-wide text-white
                shadow-[0_4px_18px_rgba(79,70,229,0.18)]
                transition-all duration-300
                hover:-translate-y-0.5 hover:bg-indigo-700
                hover:shadow-[0_8px_24px_rgba(79,70,229,0.25)]
              "
            >
              <span className="relative z-10">Request Demo</span>

              <ArrowUpRight
                size={15}
                strokeWidth={1.8}
                className="
                  relative z-10 transition-transform duration-300
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                "
              />

              <span
                className="
                  absolute inset-0 -translate-x-full
                  bg-gradient-to-r from-transparent
                  via-white/15 to-transparent
                  transition-transform duration-700
                  group-hover:translate-x-full
                "
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
            aria-label={
              mobileMenuOpen ? "Close navigation" : "Open navigation"
            }
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
                ? "pointer-events-auto max-h-[600px] translate-y-0 pt-2 opacity-100"
                : "pointer-events-none max-h-0 -translate-y-2 opacity-0"
            }
          `}
        >
          <div
            className={`
              mx-auto max-w-xl rounded-2xl border p-3
              backdrop-blur-2xl transition-colors duration-500
              ${theme.mobilePanel}
            `}
            style={{
              WebkitBackdropFilter: "blur(32px) saturate(180%)",
              backdropFilter: "blur(32px) saturate(180%)",
            }}
          >
            {/* MOBILE MENU HEADING */}
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

            {/* MOBILE LINKS */}
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
                            block text-[13px] font-medium
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
                            className={`
                              mt-0.5 block text-[9px] uppercase
                              tracking-[0.15em] ${theme.mobileCurrent}
                            `}
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

            {/* MOBILE CTA */}
            <div className="mt-3 border-t border-current/10 pt-3">
              <Link
                href="/contact#demo"
                tabIndex={mobileMenuOpen ? 0 : -1}
                onClick={() => setMobileMenuOpen(false)}
                className="
                  group flex h-[48px] w-full items-center
                  justify-center gap-2 rounded-xl
                  bg-indigo-600 text-[13px] font-semibold text-white
                  shadow-sm transition-all duration-300 hover:bg-indigo-700
                "
              >
                <span>Request a Demo</span>

                <ArrowUpRight
                  size={16}
                  strokeWidth={1.8}
                  className="
                    transition-transform duration-300
                    group-hover:translate-x-0.5
                    group-hover:-translate-y-0.5
                  "
                />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE BACKDROP */}
      <div
        aria-hidden="true"
        onClick={() => setMobileMenuOpen(false)}
        className={`
          fixed inset-0 z-40 bg-black/20
          backdrop-blur-[2px] transition-opacity duration-300 lg:hidden
          ${
            mobileMenuOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      />
    </>
  );
}
