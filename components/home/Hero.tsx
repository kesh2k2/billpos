"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const hero = heroRef.current;

    if (!hero) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(hero);

      /*
       * ============================================================
       * REDUCED MOTION
       * ============================================================
       */

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(
          q(
            [
              ".hero-background",
              ".hero-overlay",
              ".hero-eyebrow",
              ".hero-word",
              ".hero-accent",
              ".hero-description",
              ".hero-button",
              ".hero-trust-item",
              ".hero-floating-card",
              ".hero-scroll",
              ".hero-glow",
            ].join(",")
          ),
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            filter: "blur(0px)",
          }
        );

        return;
      }

      /*
       * ============================================================
       * 01 — BACKGROUND CINEMATIC REVEAL
       * ============================================================
       */

      gsap.fromTo(
        q(".hero-background"),
        {
          scale: 1.1,
        },
        {
          scale: 1.02,
          duration: 2.8,
          ease: "power2.out",
        }
      );

      /*
       * ============================================================
       * 02 — IMAGE OVERLAY
       * ============================================================
       */

      gsap.fromTo(
        q(".hero-overlay"),
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 1.8,
          ease: "power2.out",
        }
      );

      /*
       * ============================================================
       * 03 — EYEBROW
       * ============================================================
       */

      gsap.fromTo(
        q(".hero-eyebrow"),
        {
          x: -25,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          delay: 0.65,
          ease: "power3.out",
        }
      );

      /*
       * ============================================================
       * 04 — TITLE WORDS
       * ============================================================
       */

      gsap.fromTo(
        q(".hero-word"),
        {
          y: 85,
          opacity: 0,
          rotateX: 45,
          filter: "blur(10px)",
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          filter: "blur(0px)",
          duration: 1.15,
          stagger: 0.11,
          delay: 0.65,
          ease: "power4.out",
        }
      );

      /*
       * ============================================================
       * 05 — ACCENT LINE
       * ============================================================
       */

      gsap.fromTo(
        q(".hero-accent"),
        {
          scaleX: 0,
          transformOrigin: "left center",
        },
        {
          scaleX: 1,
          duration: 0.9,
          delay: 1.45,
          ease: "power3.inOut",
        }
      );

      /*
       * ============================================================
       * 06 — DESCRIPTION
       * ============================================================
       */

      gsap.fromTo(
        q(".hero-description"),
        {
          y: 25,
          opacity: 0,
          filter: "blur(5px)",
        },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.95,
          delay: 1.4,
          ease: "power3.out",
        }
      );

      /*
       * ============================================================
       * 07 — CTA BUTTONS
       * ============================================================
       */

      gsap.fromTo(
        q(".hero-button"),
        {
          y: 22,
          opacity: 0,
          scale: 0.96,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.75,
          stagger: 0.12,
          delay: 1.65,
          ease: "back.out(1.5)",
        }
      );

      /*
       * ============================================================
       * 08 — TRUST MICRO CONTENT
       * ============================================================
       */

      gsap.fromTo(
        q(".hero-trust-item"),
        {
          y: 10,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          delay: 1.95,
          ease: "power2.out",
        }
      );

      /*
       * ============================================================
       * 09 — FLOATING GLASS CARD
       *
       * Starts from LEFT
       * Rotates in 3D
       * Lands in final position
       * ============================================================
       */

      gsap.fromTo(
        q(".hero-floating-card"),
        {
          x: -420,
          y: 70,
          opacity: 0,
          scale: 0.55,
          rotateY: -70,
          rotateX: 18,
          rotateZ: -8,
          filter: "blur(10px)",
          transformOrigin: "center center",
        },
        {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          rotateY: 0,
          rotateX: 0,
          rotateZ: 0,
          filter: "blur(0px)",
          duration: 1.7,
          delay: 1.35,
          ease: "expo.out",
        }
      );

      /*
       * ============================================================
       * CARD SETTLE
       * ============================================================
       */

      gsap.fromTo(
        q(".hero-floating-card"),
        {
          y: 5,
        },
        {
          y: 0,
          duration: 0.7,
          delay: 2.7,
          ease: "back.out(1.4)",
        }
      );

      /*
       * ============================================================
       * CONTINUOUS CARD FLOAT
       * ============================================================
       */

      gsap.to(q(".hero-floating-card"), {
        y: -8,
        duration: 3.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 3.3,
      });

      /*
       * ============================================================
       * 10 — AMBIENT BLUE LIGHT
       * ============================================================
       */

      gsap.to(q(".hero-glow"), {
        x: 35,
        y: -20,
        duration: 7,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      /*
       * ============================================================
       * 11 — SCROLL INDICATOR
       * ============================================================
       */

      gsap.fromTo(
        q(".hero-scroll"),
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 1,
          delay: 2.3,
        }
      );
    }, heroRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="
        relative
        h-[100svh]
        min-h-[640px]
        max-h-[100svh]
        overflow-hidden
        bg-[#07090c]
      "
    >
      {/* ============================================================
          BACKGROUND IMAGE
      ============================================================ */}

      <div
        className="
          hero-background
          absolute
          inset-0
          scale-[1.02]
          bg-cover
          bg-center
          bg-no-repeat
        "
        style={{
          backgroundImage: "url('/images/hero/hero-bg.jpg')",
        }}
      />

      {/* ============================================================
          IMAGE OVERLAY
      ============================================================ */}

      <div
        className="
          hero-overlay
          absolute
          inset-0
          bg-black/15
        "
      />

      {/* ============================================================
          LEFT READABILITY
      ============================================================ */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-r
          from-black/80
          via-black/42
          to-black/5
        "
      />

      {/* ============================================================
          TOP NAVBAR PROTECTION
      ============================================================ */}

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-52
          bg-gradient-to-b
          from-black/50
          via-black/15
          to-transparent
        "
      />

      {/* ============================================================
          BOTTOM FADE
      ============================================================ */}

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          h-40
          bg-gradient-to-t
          from-[#05070a]
          via-[#05070a]/40
          to-transparent
        "
      />

      {/* ============================================================
          AMBIENT LIGHT
      ============================================================ */}

      <div
        className="
          hero-glow
          pointer-events-none
          absolute
          left-[10%]
          top-[42%]
          h-[300px]
          w-[300px]
          rounded-full
          bg-[#6672ff]/10
          blur-[130px]
        "
      />

      {/* ============================================================
          HERO CONTENT
      ============================================================ */}

      <div
        className="
          relative
          z-10
          flex
          h-full
          items-center
        "
      >
        <div
          className="
            mx-auto
            flex
            w-full
            max-w-[1440px]
            items-center
            px-6
            pt-24
            sm:px-8
            sm:pt-28
            md:px-12
            md:pt-24
            lg:px-16
            xl:px-20
          "
        >
          <div
            className="
              relative
              max-w-[820px]
              pb-4
              sm:pb-6
            "
          >
            {/* ======================================================
                EYEBROW
            ====================================================== */}

            <div
              className="
                hero-eyebrow
                mb-5
                flex
                items-center
                gap-3
                pt-5
                sm:mb-6
                sm:pt-7
              "
            >
              <span
                className="
                  h-px
                  w-7
                  bg-[#c3c8ff]
                  sm:w-10
                "
              />

              <span
                className="
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.3em]
                  text-white/70
                  sm:text-[10px]
                  md:text-[11px]
                "
              >
                Smart POS Solution
              </span>
            </div>

            {/* ======================================================
                MAIN HEADING
            ====================================================== */}

            <h1
              className="
                font-serif
                font-medium
                leading-[0.9]
                tracking-[-2.8px]
                text-white
                sm:tracking-[-3.5px]
              "
              style={{
                perspective: "1000px",
              }}
            >
              <span
                className="
                  hero-word
                  mr-2
                  inline-block
                  text-[48px]
                  sm:text-[62px]
                  md:text-[76px]
                  lg:text-[92px]
                  xl:text-[100px]
                "
              >
                Run
              </span>

              <span
                className="
                  hero-word
                  mr-2
                  inline-block
                  text-[48px]
                  sm:text-[62px]
                  md:text-[76px]
                  lg:text-[92px]
                  xl:text-[100px]
                "
              >
                Your
              </span>

              <span
                className="
                  hero-word
                  inline-block
                  text-[48px]
                  sm:text-[62px]
                  md:text-[76px]
                  lg:text-[92px]
                  xl:text-[100px]
                "
              >
                Business
              </span>

              <br />

              <span
                className="
                  hero-word
                  mr-2
                  inline-block
                  text-[48px]
                  text-[#c9ceff]
                  sm:text-[62px]
                  md:text-[76px]
                  lg:text-[92px]
                  xl:text-[100px]
                "
              >
                Smarter
              </span>

              <span
                className="
                  hero-word
                  inline-block
                  text-[48px]
                  text-[#c9ceff]
                  sm:text-[62px]
                  md:text-[76px]
                  lg:text-[92px]
                  xl:text-[100px]
                "
              >
                with BillPOS
              </span>
            </h1>

            {/* ======================================================
                ACCENT LINE
            ====================================================== */}

            <div
              className="
                hero-accent
                mt-5
                h-px
                w-[130px]
                origin-left
                bg-gradient-to-r
                from-[#b4bcff]
                via-[#8c97ff]
                to-transparent
                sm:mt-6
                sm:w-[175px]
              "
            />

            {/* ======================================================
                DESCRIPTION
            ====================================================== */}

            <div
              className="
                hero-description
                mt-5
                max-w-[625px]
                sm:mt-6
              "
            >
              <p
                className="
                  text-[14px]
                  font-light
                  leading-[1.65]
                  text-white/85
                  sm:text-[16px]
                  md:text-[17px]
                "
              >
                A powerful POS platform that brings sales, inventory,
                payments, and business management together in one
                intelligent system.
              </p>

              <p
                className="
                  mt-2
                  text-[11px]
                  leading-[1.6]
                  text-white/50
                  sm:text-[12px]
                  md:text-[13px]
                "
              >
                Simple to manage. Powerful enough to grow with your
                business.
              </p>
            </div>

            {/* ======================================================
                CTA BUTTONS
            ====================================================== */}

            <div
              className="
                mt-6
                flex
                flex-col
                gap-3
                sm:mt-7
                sm:flex-row
              "
            >
              {/* SECONDARY CTA */}

              <a
                href="/packages"
                className="
                  hero-button
                  group
                  relative
                  inline-flex
                  h-[50px]
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-xl
                  border
                  border-white/25
                  bg-white/[0.08]
                  px-6
                  text-[13px]
                  font-medium
                  tracking-wide
                  text-white
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]
                  backdrop-blur-xl
                  transition-all
                  duration-500
                  hover:-translate-y-0.5
                  hover:border-white/45
                  hover:bg-white/[0.15]
                  hover:shadow-[0_15px_35px_rgba(0,0,0,0.25)]
                  sm:h-[52px]
                  sm:px-7
                "
              >
                <span className="relative z-10">
                  View Packages
                </span>

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
              </a>

              {/* PRIMARY CTA */}

              <a
                href="/demo"
                className="
                  hero-button
                  group
                  inline-flex
                  h-[50px]
                  items-center
                  justify-center
                  gap-3
                  rounded-xl
                  border
                  border-[#cbd0ff]/45
                  bg-[#6673e8]/60
                  px-6
                  text-[13px]
                  font-medium
                  tracking-wide
                  text-white
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_10px_35px_rgba(76,87,200,0.16)]
                  backdrop-blur-xl
                  transition-all
                  duration-500
                  hover:-translate-y-0.5
                  hover:border-[#e1e3ff]/65
                  hover:bg-[#6673e8]/75
                  hover:shadow-[0_18px_45px_rgba(76,87,220,0.28)]
                  sm:h-[52px]
                  sm:px-7
                "
              >
                <span>Request a Demo</span>

                <span
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                >
                  →
                </span>
              </a>
            </div>

            {/* ======================================================
                MICRO TRUST INFORMATION
            ====================================================== */}

            <div
              className="
                mt-5
                flex
                flex-wrap
                items-center
                gap-x-3
                gap-y-2
                sm:mt-6
                sm:gap-x-4
              "
            >
              {[
                "Sales",
                "Inventory",
                "Reports",
                "Business Management",
              ].map((item, index) => (
                <div
                  key={item}
                  className="
                    hero-trust-item
                    flex
                    items-center
                    gap-3
                  "
                >
                  <span
                    className="
                      text-[8px]
                      uppercase
                      tracking-[0.18em]
                      text-white/40
                      sm:text-[9px]
                    "
                  >
                    {item}
                  </span>

                  {index !== 3 && (
                    <span
                      className="
                        h-1
                        w-1
                        rounded-full
                        bg-white/25
                      "
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================
              FLOATING POS VALUE CARD
          ======================================================== */}

          <div
            className="
              hero-floating-card
              absolute
              bottom-10
              right-8
              hidden
              w-[215px]
              rounded-2xl
              border
              border-white/15
              bg-black/20
              p-4
              shadow-[0_20px_60px_rgba(0,0,0,0.3)]
              backdrop-blur-2xl
              [transform-style:preserve-3d]
              lg:block
              xl:right-16
            "
          >
            {/* Header */}

            <div className="flex items-center justify-between">
              <span
                className="
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[0.2em]
                  text-white/45
                "
              >
                Business Control
              </span>

              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[#b4bcff]
                  shadow-[0_0_12px_#b4bcff]
                "
              />
            </div>

            {/* Main Value */}

            <div className="mt-3">
              <div
                className="
                  text-[19px]
                  font-medium
                  tracking-[-0.5px]
                  text-white
                "
              >
                One Platform
              </div>

              <p
                className="
                  mt-1
                  text-[10px]
                  leading-[1.6]
                  text-white/45
                "
              >
                Everything your business needs,
                connected in one system.
              </p>
            </div>

            {/* Mini Indicators */}

            <div className="mt-4 flex gap-2">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[85%] rounded-full bg-[#9da7ff]/70" />
              </div>

              <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[68%] rounded-full bg-white/30" />
              </div>

              <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[92%] rounded-full bg-white/20" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          SCROLL INDICATOR
      ============================================================ */}

      <div
        className="
          hero-scroll
          absolute
          bottom-7
          left-1/2
          z-20
          hidden
          -translate-x-1/2
          flex-col
          items-center
          gap-2
          md:flex
        "
      >
        <span
          className="
            text-[8px]
            uppercase
            tracking-[0.35em]
            text-white/35
          "
        >
          Explore
        </span>

        <div className="relative h-8 w-px overflow-hidden bg-white/15">
          <div
            className="
              absolute
              left-0
              top-0
              h-1/2
              w-full
              animate-pulse
              bg-white/60
            "
          />
        </div>
      </div>
    </section>
  );
}
