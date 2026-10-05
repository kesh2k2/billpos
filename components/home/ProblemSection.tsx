"use client";

import {
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type StoryItem = {
  number: string;
  label: string;
  title: ReactNode;
  body: string;
  image: string;
  alt: string;
  side: "left" | "right";
};

const storyItems: StoryItem[] = [
  {
    number: "01",
    label: "SALES",
    title: (
      <>
        Every sale
        <br />
        creates information.
      </>
    ),
    body:
      "Transactions happen continuously. Products move, customers buy, payments are made, and every activity creates another piece of business information.",
    image: "/images/problem/sales.jpg",
    alt: "Modern retail checkout with a POS system",
    side: "right",
  },
  {
    number: "02",
    label: "INVENTORY",
    title: (
      <>
        Stock becomes
        <br />
        another layer
        <br />
        to manage.
      </>
    ),
    body:
      "As products move through the business, keeping track of available stock, low inventory and product movement becomes another daily responsibility.",
    image: "/images/problem/inventory.jpg",
    alt: "Employee checking retail inventory",
    side: "left",
  },
  {
    number: "03",
    label: "PURCHASES",
    title: (
      <>
        Then come
        <br />
        purchases.
      </>
    ),
    body:
      "Suppliers, purchase orders, incoming stock and costs create another stream of information that needs to stay accurate and connected.",
    image: "/images/problem/purchases.jpg",
    alt: "Business employee receiving incoming stock",
    side: "right",
  },
  {
    number: "04",
    label: "BUSINESS REPORTS",
    title: (
      <>
        Reports tell
        <br />
        you what
        <br />
        happened.
      </>
    ),
    body:
      "Sales, inventory and purchasing data eventually need to become useful information — something you can understand and use to make better business decisions.",
    image: "/images/problem/reports.jpg",
    alt: "Business owner reviewing analytics and reports",
    side: "left",
  },
];

function EditorialImage({
  item,
  className = "",
}: {
  item: StoryItem;
  className?: string;
}) {
  return (
    <div
      className={`problem-slide-image relative overflow-hidden bg-slate-100 ${className}`}
      style={{
        aspectRatio: "1.32 / 1",
        transformStyle: "preserve-3d",
      }}
    >
      <img
        src={item.image}
        alt={item.alt}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      <div className="pointer-events-none absolute inset-0 border border-white/40" />

      <div className="pointer-events-none absolute bottom-4 left-4">
        <span className="inline-flex bg-white/90 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-slate-700 backdrop-blur-sm">
          {item.label}
        </span>
      </div>
    </div>
  );
}

function DesktopStorySlide({
  item,
}: {
  item: StoryItem;
}) {
  const imageFirst = item.side === "left";

  return (
    <article
      className={`problem-slide absolute inset-0 flex items-center px-6 sm:px-10 lg:px-16 xl:px-24 ${
        imageFirst ? "lg:flex-row" : "lg:flex-row-reverse"
      }`}
      aria-label={`${item.number} ${item.label}`}
    >
      <div className="mx-auto grid w-full max-w-[1380px] grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-16 xl:gap-24">
        {/* TEXT */}
        <div
          className={`problem-slide-content min-w-0 ${
            imageFirst ? "lg:order-2" : "lg:order-1"
          }`}
        >
          <div className="problem-slide-number mb-5 text-[clamp(3.5rem,7vw,7rem)] font-light leading-none tracking-[-0.07em] text-slate-200">
            {item.number}
          </div>

          <div className="problem-slide-label mb-5 flex items-center gap-4">
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-blue-600">
              {item.label}
            </span>

            <span className="problem-slide-line block h-px w-14 bg-blue-600" />
          </div>

          <h3 className="max-w-[620px] text-[clamp(2.6rem,5vw,5.4rem)] font-medium leading-[0.94] tracking-[-0.055em] text-slate-900">
            {item.title}
          </h3>

          <p className="mt-7 max-w-[510px] text-[15px] leading-7 text-slate-500 sm:text-base sm:leading-8">
            {item.body}
          </p>

          <div className="mt-8 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            Business information
          </div>
        </div>

        {/* IMAGE */}
        <div
          className={`min-w-0 ${
            imageFirst ? "lg:order-1" : "lg:order-2"
          }`}
        >
          <EditorialImage
            item={item}
            className="mx-auto w-full max-w-[650px] shadow-[0_28px_80px_rgba(15,23,42,0.10)]"
          />

          <div
            className={`mt-3 flex max-w-[650px] justify-between text-[9px] uppercase tracking-[0.2em] text-slate-400 ${
              imageFirst ? "lg:ml-auto" : ""
            }`}
          >
            <span>{item.label}</span>
            <span>BillPOS</span>
          </div>
        </div>
      </div>
    </article>
  );
}

function MobileStoryItem({
  item,
}: {
  item: StoryItem;
}) {
  const imageFirst = item.side === "left";

  return (
    <article
      className="mobile-story-item relative py-20 sm:py-24"
      aria-label={`${item.number} ${item.label}`}
    >
      <div className="mx-auto max-w-[720px] px-5 sm:px-8">
        {/* TOP META */}
        <div className="mb-8 flex items-center justify-between border-b border-slate-200 pb-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-blue-600">
            {item.label}
          </span>

          <span className="text-xs font-medium tracking-[0.15em] text-slate-300">
            {item.number}
          </span>
        </div>

        {/* TEXT */}
        <div className="mobile-story-copy">
          <h3 className="text-[clamp(2.6rem,12vw,4.5rem)] font-medium leading-[0.94] tracking-[-0.06em] text-slate-900">
            {item.title}
          </h3>

          <p className="mt-6 max-w-[570px] text-[15px] leading-7 text-slate-500 sm:text-base sm:leading-8">
            {item.body}
          </p>
        </div>

        {/* IMAGE */}
        <div
          className={`mobile-story-image mt-10 w-[94%] sm:mt-12 sm:w-[88%] ${
            imageFirst ? "ml-0" : "ml-auto"
          }`}
        >
          <div
            className="relative overflow-hidden bg-slate-100 shadow-[0_22px_60px_rgba(15,23,42,0.10)]"
            style={{ aspectRatio: "1.2 / 1" }}
          >
            <img
              src={item.image}
              alt={item.alt}
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
            />

            <div className="pointer-events-none absolute inset-0 border border-white/40" />
          </div>

          <div className="mt-3 flex justify-between text-[9px] uppercase tracking-[0.2em] text-slate-400">
            <span>{item.label}</span>
            <span>BillPOS</span>
          </div>
        </div>

        {/* BOTTOM RULE */}
        <div className="mt-12 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
        </div>
      </div>
    </article>
  );
}

export default function ProblemSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const ctx = gsap.context(() => {
      const isDesktop = window.innerWidth >= 1024;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // ============================================================
      // REDUCED MOTION
      // ============================================================

      if (prefersReducedMotion) {
        const desktopStory = section.querySelector(
          ".problem-story"
        ) as HTMLElement | null;

        if (desktopStory) {
          gsap.set(desktopStory, {
            height: "auto",
            minHeight: 0,
            overflow: "visible",
          });
        }

        gsap.set(
          section.querySelectorAll(".problem-slide"),
          {
            position: "relative",
            inset: "auto",
            autoAlpha: 1,
            y: 0,
            clearProps: "transform",
          }
        );

        gsap.set(
          section.querySelectorAll(
            ".problem-intro-panel, .problem-final-panel"
          ),
          {
            position: "relative",
            inset: "auto",
            autoAlpha: 1,
            y: 0,
          }
        );

        gsap.set(
          section.querySelectorAll(
            ".problem-slide-image, .problem-slide-content, .problem-slide-number, .problem-slide-label, .problem-slide-line"
          ),
          {
            autoAlpha: 1,
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotateY: 0,
            rotateZ: 0,
            clearProps: "all",
          }
        );

        gsap.set(
          section.querySelectorAll(".mobile-story-item"),
          {
            autoAlpha: 1,
            opacity: 1,
            clearProps: "all",
          }
        );

        return;
      }

      // ============================================================
      // DESKTOP
      // ============================================================

      if (isDesktop) {
        const story = section.querySelector(
          ".problem-story"
        ) as HTMLElement | null;

        const intro = section.querySelector(
          ".problem-intro-panel"
        ) as HTMLElement | null;

        const finalPanel = section.querySelector(
          ".problem-final-panel"
        ) as HTMLElement | null;

        const progressFill = section.querySelector(
          ".problem-progress-fill"
        ) as HTMLElement | null;

        const slides = Array.from(
          section.querySelectorAll<HTMLElement>(".problem-slide")
        );

        if (!story || !intro || !finalPanel || slides.length === 0) {
          return;
        }

        // ------------------------------------------------------------
        // INITIAL STATES
        // ------------------------------------------------------------

        gsap.set(intro, {
          autoAlpha: 1,
          y: 0,
        });

        gsap.set(slides, {
          autoAlpha: 0,
          y: 60,
          visibility: "hidden",
        });

        gsap.set(finalPanel, {
          autoAlpha: 0,
          y: 90,
          visibility: "hidden",
        });

        if (progressFill) {
          gsap.set(progressFill, {
            scaleY: 0,
            transformOrigin: "top center",
          });
        }

        // ------------------------------------------------------------
        // MAIN SCROLL STORY
        // ------------------------------------------------------------

        const timeline = gsap.timeline({
          defaults: {
            ease: "power3.out",
          },

          scrollTrigger: {
            trigger: story,
            start: "top top",
            end: "+=4400",
            scrub: 1.15,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // ============================================================
        // INTRO
        // ============================================================

        timeline.to(
          intro,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
          },
          0
        );

        // Keep intro readable
        timeline.to(
          {},
          {
            duration: 1.35,
          }
        );

        // Intro leaves completely
        timeline.to(intro, {
          autoAlpha: 0,
          y: -70,
          duration: 0.65,
          ease: "power3.inOut",
        });

        // ============================================================
        // STORY SLIDES
        // ============================================================

        slides.forEach((slide, index) => {
          const image = slide.querySelector(
            ".problem-slide-image"
          ) as HTMLElement | null;

          const content = slide.querySelector(
            ".problem-slide-content"
          ) as HTMLElement | null;

          const number = slide.querySelector(
            ".problem-slide-number"
          ) as HTMLElement | null;

          const label = slide.querySelector(
            ".problem-slide-label"
          ) as HTMLElement | null;

          const line = slide.querySelector(
            ".problem-slide-line"
          ) as HTMLElement | null;

          const isFromLeft = index % 2 === 0;

          // ----------------------------------------------------------
          // SLIDE INITIAL POSITION
          // ----------------------------------------------------------

          gsap.set(slide, {
            autoAlpha: 0,
            y: 60,
            visibility: "hidden",
          });

          if (image) {
            gsap.set(image, {
              opacity: 0,
              scale: 0.76,
              rotateY: isFromLeft ? -34 : 34,
              rotateZ: isFromLeft ? -4 : 4,
              transformPerspective: 1500,
              transformOrigin: "center center",
            });
          }

          if (content) {
            gsap.set(content, {
              opacity: 0,
              x: isFromLeft ? -55 : 55,
            });
          }

          if (number) {
            gsap.set(number, {
              opacity: 0,
              y: 25,
            });
          }

          if (label) {
            gsap.set(label, {
              opacity: 0,
              y: 18,
            });
          }

          if (line) {
            gsap.set(line, {
              scaleX: 0,
              transformOrigin: isFromLeft
                ? "left center"
                : "right center",
            });
          }

          // ----------------------------------------------------------
          // ENTER
          // ----------------------------------------------------------

          timeline.set(slide, {
            visibility: "visible",
          });

          timeline.to(slide, {
            autoAlpha: 1,
            y: 0,
            duration: 0.3,
            ease: "power3.out",
          });

          if (image) {
            timeline.to(
              image,
              {
                opacity: 1,
                scale: 1,
                rotateY: 0,
                rotateZ: 0,
                duration: 0.95,
                ease: "expo.out",
              },
              "<"
            );
          }

          if (content) {
            timeline.to(
              content,
              {
                opacity: 1,
                x: 0,
                duration: 0.75,
                ease: "power3.out",
              },
              "<0.1"
            );
          }

          if (number) {
            timeline.to(
              number,
              {
                opacity: 1,
                y: 0,
                duration: 0.45,
              },
              "<0.05"
            );
          }

          if (label) {
            timeline.to(
              label,
              {
                opacity: 1,
                y: 0,
                duration: 0.4,
              },
              "<0.05"
            );
          }

          if (line) {
            timeline.to(
              line,
              {
                scaleX: 1,
                duration: 0.55,
                ease: "power2.out",
              },
              "<0.05"
            );
          }

          // ----------------------------------------------------------
          // PROGRESS
          // ----------------------------------------------------------

          if (progressFill) {
            timeline.to(
              progressFill,
              {
                scaleY: (index + 1) / slides.length,
                duration: 0.7,
                ease: "power2.out",
              },
              "<0.05"
            );
          }

          // ----------------------------------------------------------
          // READING TIME
          // ----------------------------------------------------------

          timeline.to(
            {},
            {
              duration: 1.9,
            }
          );

          // ----------------------------------------------------------
          // SUBTLE IMAGE MOVEMENT
          // ----------------------------------------------------------

          if (image) {
            timeline.to(
              image,
              {
                scale: 1.025,
                duration: 1.1,
                ease: "none",
              },
              "<0.15"
            );
          }

          // ----------------------------------------------------------
          // CRITICAL:
          // COMPLETE SLIDE EXIT
          // ----------------------------------------------------------
          //
          // autoAlpha -> 0 means:
          // opacity 0 + visibility hidden.
          //
          // Therefore the next slide cannot visually overlap
          // with this one.
          // ----------------------------------------------------------

          timeline.to(slide, {
            autoAlpha: 0,
            y: -75,
            duration: 0.72,
            ease: "power3.inOut",
          });

          timeline.set(slide, {
            visibility: "hidden",
          });

          // ----------------------------------------------------------
          // SMALL EMPTY GAP
          // ----------------------------------------------------------

          timeline.to(
            {},
            {
              duration: 0.22,
            }
          );
        });

        // ============================================================
        // FINAL TRANSITION
        // ============================================================
        //
        // At this point:
        //
        // Sales      = hidden
        // Inventory  = hidden
        // Purchases  = hidden
        // Reports    = hidden
        //
        // Only now the final message appears.
        // ============================================================

        timeline.set(finalPanel, {
          visibility: "visible",
        });

        timeline.to(
          finalPanel,
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
          }
        );

        // ------------------------------------------------------------
        // FINAL MESSAGE REVEAL
        // ------------------------------------------------------------

        const finalKicker = finalPanel.querySelector(
          ".problem-final-kicker"
        ) as HTMLElement | null;

        const finalTitle = finalPanel.querySelector(
          ".problem-final-title"
        ) as HTMLElement | null;

        const finalDescription = finalPanel.querySelector(
          ".problem-final-description"
        ) as HTMLElement | null;

        if (finalKicker) {
          gsap.set(finalKicker, {
            opacity: 0,
            y: 20,
          });

          timeline.to(
            finalKicker,
            {
              opacity: 1,
              y: 0,
              duration: 0.45,
            },
            "<0.2"
          );
        }

        if (finalTitle) {
          gsap.set(finalTitle, {
            opacity: 0,
            y: 35,
            scale: 0.97,
          });

          timeline.to(
            finalTitle,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: "expo.out",
            },
            "<0.05"
          );
        }

        if (finalDescription) {
          gsap.set(finalDescription, {
            opacity: 0,
            y: 20,
          });

          timeline.to(
            finalDescription,
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
            },
            "<0.15"
          );
        }

        // ------------------------------------------------------------
        // FINAL READING / PAUSE
        // ------------------------------------------------------------

        timeline.to(
          {},
          {
            duration: 2,
          }
        );

        // ------------------------------------------------------------
        // VERY SUBTLE FINAL MOVEMENT
        // ------------------------------------------------------------

        if (finalTitle) {
          timeline.to(finalTitle, {
            y: -6,
            duration: 0.7,
            ease: "sine.inOut",
          });
        }
      }

      // ============================================================
      // MOBILE
      // ============================================================

      if (!isDesktop) {
        const mobileItems = Array.from(
          section.querySelectorAll<HTMLElement>(
            ".mobile-story-item"
          )
        );

        if (mobileItems.length === 0) {
          return;
        }

        mobileItems.forEach((item) => {
          const copy = item.querySelector(
            ".mobile-story-copy"
          ) as HTMLElement | null;

          const image = item.querySelector(
            ".mobile-story-image"
          ) as HTMLElement | null;

          gsap.set(item, {
            opacity: 0,
            y: 35,
          });

          if (copy) {
            gsap.set(copy, {
              opacity: 0,
              y: 25,
            });
          }

          if (image) {
            gsap.set(image, {
              opacity: 0,
              scale: 0.88,
              rotateY: -18,
              rotateZ: -2,
              transformPerspective: 1000,
            });
          }

          const mobileTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: item,
              start: "top 82%",
              end: "bottom 35%",
              toggleActions: "play none none reverse",
            },
          });

          mobileTimeline.to(item, {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
          });

          if (copy) {
            mobileTimeline.to(
              copy,
              {
                opacity: 1,
                y: 0,
                duration: 0.55,
                ease: "power3.out",
              },
              "<0.08"
            );
          }

          if (image) {
            mobileTimeline.to(
              image,
              {
                opacity: 1,
                scale: 1,
                rotateY: 0,
                rotateZ: 0,
                duration: 0.9,
                ease: "expo.out",
              },
              "<0.05"
            );

            gsap.to(image, {
              y: -10,
              ease: "none",
              scrollTrigger: {
                trigger: item,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            });
          }
        });
      }
    }, section);

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#F8FAFC] text-slate-900"
    >
      {/* ============================================================
          DESKTOP STORY
          ============================================================ */}

      <div className="problem-story hidden min-h-[680px] lg:block">
        {/* ----------------------------------------------------------
            BACKGROUND
            ---------------------------------------------------------- */}

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[8%] top-[18%] h-px w-[84%] bg-slate-200" />

          <div className="absolute left-[8%] top-[82%] h-px w-[84%] bg-slate-200" />

          <div className="absolute left-[50%] top-0 h-full w-px bg-slate-100" />
        </div>

        {/* ----------------------------------------------------------
            TOP EDITORIAL LABEL
            ---------------------------------------------------------- */}

        <div className="pointer-events-none absolute left-6 top-7 z-50 sm:left-10 lg:left-16 xl:left-24">
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />

            <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-slate-400">
              THE PROBLEM
            </span>
          </div>
        </div>

        {/* ----------------------------------------------------------
            PROGRESS
            ---------------------------------------------------------- */}

        <div className="pointer-events-none absolute right-6 top-1/2 z-50 hidden -translate-y-1/2 lg:right-8 lg:block">
          <div className="flex items-center gap-4">
            <span className="text-[8px] font-medium uppercase tracking-[0.25em] text-slate-300 [writing-mode:vertical-rl]">
              BUSINESS FLOW
            </span>

            <div className="relative h-32 w-px overflow-hidden bg-slate-200">
              <div className="problem-progress-fill absolute left-0 top-0 h-full w-full origin-top bg-blue-600" />
            </div>
          </div>
        </div>

        {/* ==========================================================
            INTRO
            ========================================================== */}

        <div className="problem-intro-panel absolute inset-0 z-20 flex items-center">
          <div className="mx-auto w-full max-w-[1380px] px-6 sm:px-10 lg:px-16 xl:px-24">
            <div className="max-w-[1050px]">
              <div className="mb-7 flex items-center gap-4">
                <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-blue-600">
                  WHY BUSINESS GETS COMPLICATED
                </span>

                <span className="h-px w-16 bg-blue-600" />
              </div>

              <h2 className="max-w-[1000px] text-[clamp(3.4rem,7.5vw,8rem)] font-medium leading-[0.88] tracking-[-0.065em] text-slate-900">
                Business doesn't
                <br />
                become complicated
                <br />
                <span className="text-slate-300">
                  all at once.
                </span>
              </h2>

              <div className="mt-10 grid max-w-[900px] grid-cols-1 gap-8 md:grid-cols-[1fr_0.7fr] md:gap-16">
                <p className="text-[15px] leading-7 text-slate-500 sm:text-base sm:leading-8">
                  It happens one process at a time. A sale here.
                  Inventory there. A purchase from a supplier.
                  Then a report that needs to bring everything
                  together.
                </p>

                <div className="border-l border-slate-200 pl-5">
                  <span className="block text-[9px] font-semibold uppercase tracking-[0.25em] text-slate-400">
                    THE REAL CHALLENGE
                  </span>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Information starts moving in different
                    directions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================================
            STORY SLIDES
            ========================================================== */}

        {storyItems.map((item) => (
          <DesktopStorySlide
            key={item.number}
            item={item}
          />
        ))}

        {/* ==========================================================
            FINAL SCENE
            ========================================================== */}

        <div className="problem-final-panel absolute inset-0 z-30 flex items-center justify-center px-6 text-center">
          <div className="relative mx-auto max-w-[1100px]">
            {/* Editorial top rule */}
            <div className="mx-auto mb-9 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-blue-600" />

              <span className="problem-final-kicker text-[9px] font-semibold uppercase tracking-[0.38em] text-blue-600">
                THE ANSWER
              </span>

              <span className="h-px w-12 bg-blue-600" />
            </div>

            <h2 className="problem-final-title text-[clamp(3.6rem,8.5vw,9rem)] font-medium leading-[0.84] tracking-[-0.075em] text-slate-900">
              Everything
              <br />
              should work
              <br />
              <span className="text-blue-600">
                together.
              </span>
            </h2>

            <p className="problem-final-description mx-auto mt-9 max-w-[600px] text-[15px] leading-7 text-slate-500 sm:text-base sm:leading-8">
              When every part of your business works from the
              same system, information becomes clearer, decisions
              become faster, and managing the business becomes
              simpler.
            </p>

            <div className="mt-10 flex items-center justify-center gap-3 text-[9px] font-medium uppercase tracking-[0.3em] text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              One connected business
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          MOBILE STORY
          ============================================================ */}

      <div className="mobile-story lg:hidden">
        {/* ----------------------------------------------------------
            MOBILE INTRO
            ---------------------------------------------------------- */}

        <div className="px-5 pb-10 pt-24 sm:px-8 sm:pb-14 sm:pt-28">
          <div className="mx-auto max-w-[720px]">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />

              <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-blue-600">
                THE PROBLEM
              </span>
            </div>

            <h2 className="text-[clamp(3.2rem,14vw,5.4rem)] font-medium leading-[0.88] tracking-[-0.065em] text-slate-900">
              Business doesn't
              <br />
              become complicated
              <br />
              <span className="text-slate-300">
                all at once.
              </span>
            </h2>

            <p className="mt-8 max-w-[600px] text-[15px] leading-7 text-slate-500 sm:text-base sm:leading-8">
              It happens one process at a time. A sale here.
              Inventory there. A purchase from a supplier. Then a
              report that needs to bring everything together.
            </p>
          </div>
        </div>

        {/* ----------------------------------------------------------
            MOBILE ITEMS
            ---------------------------------------------------------- */}

        <div>
          {storyItems.map((item) => (
            <MobileStoryItem
              key={item.number}
              item={item}
            />
          ))}
        </div>

        {/* ==========================================================
            MOBILE FINAL
            ========================================================== */}

        <div className="relative px-5 pb-28 pt-20 sm:px-8 sm:pb-36 sm:pt-28">
          <div className="mx-auto max-w-[720px] text-center">
            <div className="mb-8 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-blue-600" />

              <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-blue-600">
                THE ANSWER
              </span>

              <span className="h-px w-10 bg-blue-600" />
            </div>

            <h2 className="text-[clamp(3.4rem,15vw,6rem)] font-medium leading-[0.86] tracking-[-0.07em] text-slate-900">
              Everything
              <br />
              should work
              <br />
              <span className="text-blue-600">
                together.
              </span>
            </h2>

            <p className="mx-auto mt-8 max-w-[560px] text-[15px] leading-7 text-slate-500 sm:text-base sm:leading-8">
              One connected system can bring the different parts
              of your business into one clear view.
            </p>

            <div className="mt-9 flex items-center justify-center gap-3 text-[9px] font-medium uppercase tracking-[0.28em] text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              One connected business
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}