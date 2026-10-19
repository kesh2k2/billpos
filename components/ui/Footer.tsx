"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";

import { Mail, Phone, MapPin, ArrowUp, ArrowUpRight } from "lucide-react";

/* =========================================================
   CUSTOM SOCIAL ICONS (inline SVG — no dependency issues)
   ========================================================= */

type IconProps = {
  size?: number;
  className?: string;
};

function FacebookIcon({ size = 16, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function LinkedinIcon({ size = 16, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function InstagramIcon({ size = 16, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function MailIcon({ size = 16, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 5L2 7" />
    </svg>
  );
}

/* =========================================================
   DATA
   ========================================================= */

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1Dn6WNgyPn/",
    icon: FacebookIcon,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/qdesk-ai/",
    icon: LinkedinIcon,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/qdeskai?rpxt=MTE5OXBwcHlzNGJmMA==",
    icon: InstagramIcon,
  },
  {
    label: "Email",
    href: "mailto:support@qdeskai.com",
    icon: MailIcon,
  },
];

const footerColumns = [
  {
    title: "Company",
    links: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "https://qdeskai.com/" },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "Solutions", href: "/solutions" },
      { label: "Packages", href: "/packages" },
      { label: "Request Demo", href: "/demo" },
      { label: "Pricing", href: "/packages#pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", href: "https://qdeskai.com/" },
      { label: "Documentation", href: "https://qdeskai.com/" },
      { label: "Privacy Policy", href: "https://qdeskai.com/" },
      { label: "Terms of Service", href: "https://qdeskai.com/" },
    ],
  },
];

const contactItems = [
  {
    label: "hello@qdeskai.com",
    href: "mailto:support@qdeskai.com",
    icon: Mail,
  },
  {
    label: "0706833644",
    href: "tel:0706833644",
    icon: Phone,
  },
  {
    label: "Nanuoya, Kiribathkumbura, Kandy",
    href: "https://maps.google.com",
    icon: MapPin,
  },
];

/* =========================================================
   FOOTER
   ========================================================= */

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  /*
   * Footer reveal animation (on scroll into view)
   */
  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.set([".footer-brand", ".footer-col", ".footer-bottom"], {
        y: 26,
        opacity: 0,
      });
    }, footerRef);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        gsap.to(".footer-brand", {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
        });

        gsap.to(".footer-col", {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.12,
        });

        gsap.to(".footer-bottom", {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.4,
        });

        observer.disconnect();
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      ctx.revert();
    };
  }, []);

  /*
   * Scroll back to top
   */
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      ref={footerRef}
      className="
        relative
        overflow-hidden
        border-t
        border-white/[0.08]
        bg-[#05070b]
      "
    >
      {/* AMBIENT GLOW */}
      <div
        className="
          pointer-events-none
          absolute
          -top-40
          left-1/2
          h-[420px]
          w-[820px]
          -translate-x-1/2
          rounded-full
          bg-[#6673e8]/[0.10]
          blur-[130px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-24
          right-0
          h-[300px]
          w-[300px]
          rounded-full
          bg-[#aeb7ff]/[0.06]
          blur-[110px]
        "
      />

      {/* CONTENT */}
      <div
        className="
          relative
          z-10
          mx-auto
          max-w-[1180px]
          px-4
          py-10
          sm:px-6
          sm:py-14
          lg:px-8
          lg:py-20
        "
      >
        {/* MAIN GRID */}
        <div
          className="
            grid
            grid-cols-1
            gap-8
            sm:grid-cols-2
            lg:grid-cols-[1.8fr_1fr_1fr_1.2fr]
            lg:gap-8
          "
        >
          {/* BRAND */}
          <div className="footer-brand sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="group inline-flex items-center gap-2"
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

            <p
              className="
                mt-4
                max-w-xs
                text-[12px]
                leading-relaxed
                text-white/45
                sm:mt-5
                sm:text-[13px]
              "
            >
              Smart billing and point-of-sale software built for
              modern businesses. Fast, reliable, and beautifully
              simple.
            </p>

            {/* Social icons */}
            <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:mt-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                const external = social.href.startsWith("http");

                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    target={external ? "_blank" : undefined}
                    rel={
                      external ? "noopener noreferrer" : undefined
                    }
                    aria-label={social.label}
                    className="
                      group
                      relative
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-white/[0.10]
                      bg-white/[0.04]
                      text-white/50
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                      hover:border-[#aeb7ff]/30
                      hover:bg-[#aeb7ff]/10
                      hover:text-[#c8ceff]
                      hover:shadow-[0_10px_28px_rgba(102,115,232,0.20)]
                    "
                  >
                    <Icon size={16} />

                    <span
                      className="
                        absolute
                        inset-0
                        rounded-xl
                        border
                        border-[#aeb7ff]/0
                        transition-all
                        duration-300
                        group-hover:border-[#aeb7ff]/20
                      "
                    />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* LINK COLUMNS */}
          {footerColumns.map((column) => (
            <div key={column.title} className="footer-col">
              <h3
                className="
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.25em]
                  text-white/35
                "
              >
                {column.title}
              </h3>

              <ul className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-3">
                {column.links.map((link) => {
                  const external = link.href.startsWith("http");

                  return (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        {...(external
                          ? {
                              target: "_blank",
                              rel: "noopener noreferrer",
                            }
                          : {})}
                        className="
                          group
                          inline-flex
                          items-center
                          text-[13px]
                          text-white/55
                          transition-colors
                          duration-300
                          hover:text-white
                        "
                      >
                        <span className="relative">
                          {link.label}

                          <span
                            className="
                              absolute
                              -bottom-0.5
                              left-0
                              h-[1px]
                              w-0
                              rounded-full
                              bg-[#aeb7ff]
                              transition-all
                              duration-300
                              group-hover:w-full
                            "
                          />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* CONTACT */}
          <div className="footer-col">
            <h3
              className="
                text-[10px]
                font-medium
                uppercase
                tracking-[0.25em]
                text-white/35
              "
            >
              Get in touch
            </h3>

            <ul className="mt-4 space-y-3 sm:mt-5 sm:space-y-4">
              {contactItems.map((item) => {
                const Icon = item.icon;

                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="group flex items-start gap-3"
                    >
                      <span
                        className="
                          mt-0.5
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          border
                          border-white/[0.08]
                          bg-white/[0.04]
                          text-white/45
                          transition-all
                          duration-300
                          group-hover:border-[#aeb7ff]/25
                          group-hover:bg-[#aeb7ff]/10
                          group-hover:text-[#bfc5ff]
                        "
                      >
                        <Icon size={14} />
                      </span>

                      <span
                        className="
                          pt-1
                          text-[13px]
                          leading-relaxed
                          text-white/55
                          transition-colors
                          duration-300
                          group-hover:text-white
                        "
                      >
                        {item.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Demo CTA */}
            <Link
              href="/demo"
              className="
                group
                mt-5
                inline-flex
                h-[42px]
                items-center
                gap-2
                overflow-hidden
                rounded-xl
                border
                border-[#bfc5ff]/30
                bg-[#6673e8]/40
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
                hover:bg-[#6673e8]/65
                hover:shadow-[0_10px_30px_rgba(76,87,220,0.22)]
                sm:mt-6
              "
            >
              <span className="relative z-10">Request Demo</span>

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
            </Link>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div
          className="
            footer-bottom
            mt-10
            flex
            flex-col
            items-center
            gap-4
            border-t
            border-white/[0.08]
            pt-6
            sm:mt-14
            sm:flex-row
            sm:justify-between
            sm:gap-5
          "
        >
          {/* Copyright — centered on mobile */}
          <p className="text-center text-[11px] text-white/30 sm:text-left">
            © 2026 BillPOS. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            <Link
              href="/privacy"
              className="
                text-[11px]
                text-white/35
                transition-colors
                duration-300
                hover:text-white/75
              "
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="
                text-[11px]
                text-white/35
                transition-colors
                duration-300
                hover:text-white/75
              "
            >
              Terms
            </Link>

            {/* Back to top */}
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="
                group
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                border
                border-white/[0.10]
                bg-white/[0.04]
                text-white/45
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-[#aeb7ff]/30
                hover:bg-[#aeb7ff]/10
                hover:text-[#c8ceff]
              "
            >
              <ArrowUp
                size={15}
                strokeWidth={1.8}
                className="
                  transition-transform
                  duration-300
                  group-hover:-translate-y-0.5
                "
              />
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================
          GIANT WATERMARK — now BELOW the content, above the copyright
          ============================================================ */}
      <div
        className="
          relative
          z-0
          mx-auto
          w-full
          max-w-[1180px]
          px-4
          sm:px-6
          lg:px-8
        "
      >
        <span
          className="
            pointer-events-none
            block
            w-full
            select-none
            text-center
            text-[22vw]
            font-semibold
            leading-[0.8]
            tracking-[-0.08em]
            text-white/[0.02]
            sm:text-[16vw]
            lg:text-[170px]
          "
          aria-hidden="true"
        >
          BillPOS
        </span>
      </div>
    </footer>
  );
}
