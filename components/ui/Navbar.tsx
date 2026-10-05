"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

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

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Solutions",
    href: "/solutions",
    icon: LayoutGrid,
  },
  {
    label: "Packages",
    href: "/packages",
    icon: Package,
  },
  {
    label: "About Us",
    href: "/about",
    icon: Info,
  },
  {
    label: "Contact",
    href: "/contact",
    icon: Mail,
  },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /*
   * Check whether current route is active
   */
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  /*
   * Navbar entrance animation
   */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        {
          y: -30,
          opacity: 0,
          scale: 0.97,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.1,
          ease: "power3.out",
          delay: 0.15,
        }
      );

      gsap.fromTo(
        ".nav-link",
        {
          y: -8,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          delay: 0.45,
        }
      );
    }, navRef);

    return () => ctx.revert();
  }, []);

  /*
   * Close mobile menu when route changes
   */
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  /*
   * Prevent background scrolling when mobile menu is open
   */
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

  /*
   * ESC key closes mobile menu
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      {/* =====================================================
          NAVBAR
          ===================================================== */}

      <header
        ref={navRef}
        className="
          absolute
          left-0
          right-0
          top-4
          z-50
          px-4
          sm:top-5
          sm:px-6
          lg:px-8
        "
      >
        <nav
          className="
            relative
            mx-auto
            flex
            h-[64px]
            max-w-[1180px]
            items-center
            rounded-2xl
            border
            border-white/[0.14]
            bg-black/[0.28]
            px-3
            shadow-[0_8px_40px_rgba(0,0,0,0.28)]
            backdrop-blur-2xl
            sm:h-[70px]
            sm:px-5
            lg:px-6
          "
          aria-label="Main navigation"
        >
          {/* =================================================
              LOGO
              ================================================= */}

          <Link
            href="/"
            className="
              group
              relative
              z-10
              flex
              shrink-0
              items-center
              gap-2
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                border
                border-white/10
                bg-white/[0.07]
                shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]
                transition-all
                duration-300
                group-hover:border-[#aeb7ff]/30
                group-hover:bg-[#aeb7ff]/10
              "
            >
              <span
                className="
                  text-[12px]
                  font-semibold
                  tracking-tight
                  text-[#c8ceff]
                "
              >
                BP
              </span>
            </div>

            <span
              className="
                text-[25px]
                font-medium
                tracking-[-1.5px]
                text-white
                transition-colors
                duration-300
                group-hover:text-[#c8ceff]
                sm:text-[28px]
              "
            >
              Bill<span className="text-[#aeb7ff]">POS</span>
            </span>
          </Link>

          {/* =================================================
              DESKTOP NAVIGATION
              ================================================= */}

          <div
            className="
              absolute
              left-1/2
              hidden
              -translate-x-1/2
              items-center
              gap-1
              lg:flex
            "
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`
                    nav-link
                    group
                    relative
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    px-3.5
                    py-2.5
                    text-[13px]
                    font-medium
                    tracking-wide
                    transition-all
                    duration-300
                    xl:px-4
                    xl:text-[14px]

                    ${
                      active
                        ? "bg-white/[0.09] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                        : "text-white/60 hover:bg-white/[0.05] hover:text-white"
                    }
                  `}
                >
                  <Icon
                    size={15}
                    strokeWidth={1.7}
                    className={`
                      transition-all
                      duration-300

                      ${
                        active
                          ? "text-[#b8c0ff]"
                          : "text-white/45 group-hover:text-[#b8c0ff]"
                      }
                    `}
                  />

                  <span>{item.label}</span>

                  {/* Active indicator */}

                  <span
                    className={`
                      absolute
                      bottom-[3px]
                      left-1/2
                      h-[2px]
                      -translate-x-1/2
                      rounded-full
                      bg-[#aeb7ff]
                      shadow-[0_0_10px_rgba(174,183,255,0.6)]
                      transition-all
                      duration-300

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

          {/* =================================================
              DESKTOP CTA
              ================================================= */}

          <div className="ml-auto hidden items-center gap-3 lg:flex">
            <Link
              href="/demo"
              className="
                group
                relative
                inline-flex
                h-[42px]
                items-center
                gap-2
                overflow-hidden
                rounded-xl
                border
                border-[#bfc5ff]/30
                bg-[#6673e8]/50
                px-4
                text-[12px]
                font-medium
                tracking-wide
                text-white
                shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]
                backdrop-blur-xl
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-[#d5d8ff]/50
                hover:bg-[#6673e8]/70
                hover:shadow-[0_10px_30px_rgba(76,87,220,0.22)]
              "
            >
              <span className="relative z-10">
                Request Demo
              </span>

              <ArrowUpRight
                size={15}
                strokeWidth={1.8}
                className="
                  relative
                  z-10
                  transition-transform
                  duration-300
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                "
              />

              <span
                className="
                  absolute
                  inset-0
                  -translate-x-full
                  bg-gradient-to-r
                  from-transparent
                  via-white/10
                  to-transparent
                  transition-transform
                  duration-700
                  group-hover:translate-x-full
                "
              />
            </Link>
          </div>

          {/* =================================================
              MOBILE MENU BUTTON
              ================================================= */}

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen((prev) => !prev)
            }
            className="
              ml-auto
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-white/15
              bg-white/[0.07]
              text-white
              backdrop-blur-xl
              transition-all
              duration-300
              hover:border-white/25
              hover:bg-white/[0.12]
              lg:hidden
            "
            aria-label={
              mobileMenuOpen
                ? "Close navigation"
                : "Open navigation"
            }
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X
                size={19}
                strokeWidth={1.7}
              />
            ) : (
              <Menu
                size={19}
                strokeWidth={1.7}
              />
            )}
          </button>
        </nav>

        {/* =================================================
            MOBILE MENU
            ================================================= */}

        <div
          className={`
            mx-auto
            max-w-[1180px]
            overflow-hidden
            transition-all
            duration-500
            ease-out
            lg:hidden

            ${
              mobileMenuOpen
                ? "mt-3 max-h-[600px] opacity-100"
                : "pointer-events-none max-h-0 opacity-0"
            }
          `}
        >
          <div
            className="
              rounded-2xl
              border
              border-white/[0.14]
              bg-[#080a0f]/90
              p-3
              shadow-[0_20px_70px_rgba(0,0,0,0.45)]
              backdrop-blur-2xl
            "
          >
            {/* Mobile heading */}

            <div
              className="
                mb-2
                flex
                items-center
                justify-between
                px-3
                py-2
              "
            >
              <div className="flex items-center gap-2">
                <Sparkles
                  size={13}
                  className="text-[#aeb7ff]"
                  strokeWidth={1.7}
                />

                <span
                  className="
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.25em]
                    text-white/40
                  "
                >
                  Navigation
                </span>
              </div>

              <span className="text-[9px] text-white/25">
                BillPOS
              </span>
            </div>

            {/* Navigation links */}

            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-current={
                      active ? "page" : undefined
                    }
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className={`
                      group
                      flex
                      items-center
                      justify-between
                      rounded-xl
                      border
                      px-3
                      py-3.5
                      transition-all
                      duration-300

                      ${
                        active
                          ? "border-white/[0.10] bg-white/[0.08]"
                          : "border-transparent hover:border-white/[0.07] hover:bg-white/[0.05]"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-lg
                          border
                          transition-all
                          duration-300

                          ${
                            active
                              ? "border-[#aeb7ff]/20 bg-[#aeb7ff]/10"
                              : "border-white/[0.08] bg-white/[0.04]"
                          }
                        `}
                      >
                        <Icon
                          size={16}
                          strokeWidth={1.7}
                          className={
                            active
                              ? "text-[#bfc5ff]"
                              : "text-white/45"
                          }
                        />
                      </div>

                      <div>
                        <span
                          className={`
                            block
                            text-[13px]
                            font-medium

                            ${
                              active
                                ? "text-white"
                                : "text-white/65"
                            }
                          `}
                        >
                          {item.label}
                        </span>

                        {active && (
                          <span
                            className="
                              mt-0.5
                              block
                              text-[8px]
                              uppercase
                              tracking-[0.18em]
                              text-[#aeb7ff]/60
                            "
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
                        transition-all
                        duration-300

                        ${
                          active
                            ? "text-[#aeb7ff]"
                            : "text-white/20 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white/50"
                        }
                      `}
                    />
                  </Link>
                );
              })}
            </div>

            {/* Mobile CTA */}

            <div className="mt-3 border-t border-white/[0.08] pt-3">
              <Link
                href="/demo"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="
                  group
                  flex
                  h-[50px]
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-[#c5caff]/30
                  bg-[#6673e8]/60
                  text-[13px]
                  font-medium
                  text-white
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]
                  transition-all
                  duration-300
                  hover:bg-[#6673e8]/75
                "
              >
                <span>Request a Demo</span>

                <ArrowUpRight
                  size={16}
                  strokeWidth={1.8}
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-0.5
                    group-hover:-translate-y-0.5
                  "
                />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          MOBILE BACKDROP
          ===================================================== */}

      <div
        onClick={() => setMobileMenuOpen(false)}
        className={`
          fixed
          inset-0
          z-40
          bg-black/40
          backdrop-blur-[2px]
          transition-opacity
          duration-500
          lg:hidden

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