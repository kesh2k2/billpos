
"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import gsap from "gsap";

import {
  ArrowLeft,
  ArrowRight,
  Store,
  Utensils,
  Shirt,
  Pill,
  Hammer,
  Scissors,
  Monitor,
  ShoppingCart,
  Boxes,
  Apple,
  Smartphone,
  Croissant,
} from "lucide-react";

type Industry = {
  name: string;
  description: string;
  image: string;
  icon: React.ElementType;
};

const industries: Industry[] = [
  {
    name: "Retail Shops",
    description:
      "Manage sales, inventory, customers and daily operations from one simple platform.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=90",
    icon: Store,
  },
  {
    name: "Restaurants & Cafés",
    description:
      "Handle orders, tables, kitchen operations and payments with ease.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=90",
    icon: Utensils,
  },
  {
    name: "Fashion & Clothing",
    description:
      "Track products, sizes, colors, stock and sales across your fashion business.",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=90",
    icon: Shirt,
  },
  {
    name: "Pharmacies",
    description:
      "Keep pharmacy sales, inventory and product management organized.",
    image:
      "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=1600&q=90",
    icon: Pill,
  },
  {
    name: "Hardware Stores",
    description:
      "Manage thousands of products, suppliers, purchases and stock movements.",
    image:
      "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=1600&q=90",
    icon: Hammer,
  },
  {
    name: "Salons & Beauty",
    description:
      "Simplify appointments, services, product sales and customer management.",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=90",
    icon: Scissors,
  },
  {
    name: "Electronics",
    description:
      "Control electronics inventory, sales, warranties and customer records.",
    image:
      "https://images.unsplash.com/photo-1593642532744-d377ab507dc8?auto=format&fit=crop&w=1600&q=90",
    icon: Monitor,
  },
  {
    name: "Supermarkets",
    description:
      "Run high-volume sales, inventory, purchasing and multi-store operations.",
    image:
      "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1600&q=90",
    icon: ShoppingCart,
  },
  {
    name: "Wholesale",
    description:
      "Manage bulk sales, warehouses, suppliers and stock movement efficiently.",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=90",
    icon: Boxes,
  },
  {
    name: "Grocery Stores",
    description:
      "Keep everyday sales, products, suppliers and inventory under control.",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=90",
    icon: Apple,
  },
  {
    name: "Mobile & Accessories",
    description:
      "Track devices, accessories, stock, sales and customer purchases.",
    image:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1600&q=90",
    icon: Smartphone,
  },
  {
    name: "Bakeries & Food",
    description:
      "Manage food products, daily sales, stock and business operations simply.",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=90",
    icon: Croissant,
  },
];

export default function IndustrySection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const infoRef = useRef<HTMLDivElement>(null);

  /*
   * Store card references
   */
  const setCardRef = useCallback(
    (element: HTMLDivElement | null, index: number) => {
      if (element) {
        cardsRef.current[index] = element;
      }
    },
    []
  );

  /*
   * Calculate circular position
   */
  const getRelativePosition = (
    index: number,
    active: number
  ): number => {
    const total = industries.length;

    let difference = index - active;

    if (difference > total / 2) {
      difference -= total;
    }

    if (difference < -total / 2) {
      difference += total;
    }

    return difference;
  };

  /*
   * Animate all cards
   *
   * Only the slider positioning is adjusted here
   * to keep the complete carousel visually centered.
   */
  const animateCards = useCallback((newIndex: number) => {
    const timeline = gsap.timeline({
      defaults: {
        duration: 0.75,
        ease: "power3.out",
      },
    });

    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      const position = getRelativePosition(index, newIndex);

      let x = 0;
      let scale = 0.5;
      let opacity = 0;
      let zIndex = 1;
      let blur = 5;

      /*
       * CENTER
       */
      if (position === 0) {
        x = 0;
        scale = 1;
        opacity = 1;
        zIndex = 50;
        blur = 0;
      }

      /*
       * FIRST LEFT
       */
      else if (position === -1) {
        x = -92;
        scale = 0.78;
        opacity = 0.72;
        zIndex = 40;
        blur = 0;
      }

      /*
       * FIRST RIGHT
       */
      else if (position === 1) {
        x = 92;
        scale = 0.78;
        opacity = 0.72;
        zIndex = 40;
        blur = 0;
      }

      /*
       * SECOND LEFT
       */
      else if (position === -2) {
        x = -172;
        scale = 0.62;
        opacity = 0.42;
        zIndex = 30;
        blur = 0;
      }

      /*
       * SECOND RIGHT
       */
      else if (position === 2) {
        x = 172;
        scale = 0.62;
        opacity = 0.42;
        zIndex = 30;
        blur = 0;
      }

      /*
       * THIRD LEFT
       */
      else if (position === -3) {
        x = -245;
        scale = 0.5;
        opacity = 0.2;
        zIndex = 20;
        blur = 1;
      }

      /*
       * THIRD RIGHT
       */
      else if (position === 3) {
        x = 245;
        scale = 0.5;
        opacity = 0.2;
        zIndex = 20;
        blur = 1;
      }

      /*
       * HIDDEN
       */
      else {
        x = position > 0 ? 340 : -340;
        scale = 0.4;
        opacity = 0;
        zIndex = 1;
        blur = 5;
      }

      /*
       * IMPORTANT:
       * Use xPercent only.
       * Every card starts from exactly left-1/2
       * and the slider itself is centered.
       */
      timeline.to(
        card,
        {
          xPercent: x,
          scale,
          opacity,
          zIndex,
          filter: `blur(${blur}px)`,
        },
        0
      );

      const image = card.querySelector(
        ".industry-image"
      ) as HTMLElement | null;

      if (image) {
        timeline.to(
          image,
          {
            scale: position === 0 ? 1.04 : 1.08,
          },
          0
        );
      }
    });
  }, []);

  /*
   * Initial animation
   */
  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    gsap.fromTo(
      sectionRef.current,
      {
        opacity: 0,
        y: 18,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
      }
    );

    animateCards(0);
  }, [animateCards]);

  /*
   * Active slide animation
   */
  useEffect(() => {
    animateCards(activeIndex);

    if (infoRef.current) {
      gsap.fromTo(
        infoRef.current,
        {
          opacity: 0,
          y: 7,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: "power2.out",
        }
      );
    }
  }, [activeIndex, animateCards]);

  /*
   * AUTO SLIDE
   * 8 seconds
   */
  useEffect(() => {
    const autoSlide = setInterval(() => {
      setActiveIndex(
        (current) => (current + 1) % industries.length
      );
    }, 8000);

    return () => {
      clearInterval(autoSlide);
    };
  }, []);

  /*
   * Next
   */
  const nextSlide = () => {
    setActiveIndex(
      (current) => (current + 1) % industries.length
    );
  };

  /*
   * Previous
   */
  const previousSlide = () => {
    setActiveIndex(
      (current) =>
        (current - 1 + industries.length) %
        industries.length
    );
  };

  const activeIndustry = industries[activeIndex];

  const ActiveIcon = activeIndustry.icon;

  return (
    <section
      ref={sectionRef}
      className="
        relative
        overflow-hidden
        bg-[#e9edf3]
        px-4
        py-12
        sm:px-6
        sm:py-14
        lg:px-8
        lg:py-16
      "
    >
      {/* ========================================
          BACKGROUND
      ======================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="
            absolute
            -left-32
            top-0
            h-72
            w-72
            rounded-full
            bg-blue-300/20
            blur-[100px]
          "
        />

        <div
          className="
            absolute
            -right-28
            bottom-0
            h-80
            w-80
            rounded-full
            bg-sky-300/20
            blur-[110px]
          "
        />

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-64
            w-64
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-blue-200/10
            blur-[100px]
          "
        />
      </div>

      {/* ========================================
          MAIN CONTAINER
      ======================================== */}

      <div className="relative mx-auto max-w-6xl">

        {/* ========================================
            HEADER
        ======================================== */}

        <div className="mb-5 text-center sm:mb-6">
          <div
            className="
              mb-2
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-blue-200/70
              bg-white/60
              px-3
              py-1
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-blue-700
              backdrop-blur-sm
              sm:text-[10px]
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-blue-600
              "
            />

            Built for every business
          </div>

          <h2
            className="
              text-3xl
              font-bold
              tracking-tight
              text-slate-900
              sm:text-4xl
              lg:text-[40px]
            "
          >
            One platform.
            <span className="ml-2 text-blue-600">
              Every business.
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-1.5
              max-w-xl
              text-xs
              leading-5
              text-slate-500
              sm:text-sm
            "
          >
            Flexible tools designed to simplify operations
            across different industries.
          </p>
        </div>

        {/* ========================================
            CENTERED SLIDER
        ======================================== */}

        <div className="mx-auto w-full max-w-6xl">
          <div className="flex flex-col items-center">

            {/* ------------------------------------
                IMAGE SLIDER
            ------------------------------------ */}

            <div
              className="
                relative
                mx-auto
                flex
                h-[275px]
                w-full
                max-w-[1100px]
                items-center
                justify-center
                overflow-visible
                sm:h-[295px]
                lg:h-[315px]
              "
            >
              {/* 
                This inner stage is explicitly centered.
                This prevents the carousel from visually
                drifting toward the right.
              */}
              <div
                className="
                  absolute
                  left-1/2
                  top-1/2
                  h-full
                  w-full
                  -translate-x-1/2
                  -translate-y-1/2
                "
              >
                {industries.map((industry, index) => (
                  <div
                    key={industry.name}
                    ref={(element) =>
                      setCardRef(element, index)
                    }
                    className="
                      absolute
                      left-1/2
                      top-1/2
                      w-[180px]
                      -translate-x-1/2
                      -translate-y-1/2
                      sm:w-[200px]
                      lg:w-[220px]
                    "
                    style={{
                      transformOrigin:
                        "center center",
                    }}
                  >
                    <div
                      className="
                        relative
                        h-[235px]
                        overflow-hidden
                        rounded-[32px]
                        border
                        border-white/80
                        bg-white
                        shadow-[0_16px_40px_rgba(15,23,42,0.12)]
                        sm:h-[255px]
                        sm:rounded-[36px]
                        lg:h-[275px]
                      "
                    >
                      <img
                        src={industry.image}
                        alt={industry.name}
                        className="
                          industry-image
                          absolute
                          inset-0
                          h-full
                          w-full
                          object-cover
                          will-change-transform
                        "
                      />

                      <div
                        className="
                          pointer-events-none
                          absolute
                          inset-0
                          bg-gradient-to-t
                          from-black/10
                          via-transparent
                          to-transparent
                        "
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ====================================
                INDUSTRY INFO
            ==================================== */}

            <div
              ref={infoRef}
              className="
                mt-2
                w-full
                text-center
              "
            >
              <div className="flex items-center justify-center gap-2">
                <div
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-lg
                    bg-blue-600
                    text-white
                    shadow-sm
                  "
                >
                  <ActiveIcon
                    size={14}
                    strokeWidth={2.2}
                  />
                </div>

                <span
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-blue-600
                  "
                >
                  Industry{" "}
                  {String(activeIndex + 1).padStart(
                    2,
                    "0"
                  )}
                </span>
              </div>

              <h3
                className="
                  mt-1
                  text-2xl
                  font-bold
                  tracking-tight
                  text-slate-900
                  sm:text-[27px]
                "
              >
                {activeIndustry.name}
              </h3>

              <p
                className="
                  mx-auto
                  mt-1
                  max-w-lg
                  px-4
                  text-[11px]
                  leading-5
                  text-slate-500
                  sm:text-xs
                "
              >
                {activeIndustry.description}
              </p>
            </div>

            {/* ====================================
                CONTROLS
            ==================================== */}

            <div
              className="
                mt-4
                flex
                items-center
                gap-3
              "
            >
              <button
                type="button"
                onClick={previousSlide}
                aria-label="Previous industry"
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-slate-300/80
                  bg-white/80
                  text-slate-600
                  shadow-sm
                  transition-all
                  duration-200
                  hover:border-blue-300
                  hover:bg-white
                  hover:text-blue-600
                "
              >
                <ArrowLeft size={14} />
              </button>

              <div className="flex items-center gap-1.5">
                {industries.map(
                  (industry, index) => (
                    <button
                      key={industry.name}
                      type="button"
                      aria-label={`Go to ${industry.name}`}
                      onClick={() =>
                        setActiveIndex(index)
                      }
                      className={`
                        h-1.5
                        rounded-full
                        transition-all
                        duration-300
                        ${
                          index === activeIndex
                            ? "w-6 bg-blue-600"
                            : "w-1.5 bg-slate-300 hover:bg-slate-400"
                        }
                      `}
                    />
                  )
                )}
              </div>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next industry"
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-slate-300/80
                  bg-white/80
                  text-slate-600
                  shadow-sm
                  transition-all
                  duration-200
                  hover:border-blue-300
                  hover:bg-white
                  hover:text-blue-600
                "
              >
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Counter */}

            <div
              className="
                mt-1.5
                text-[9px]
                font-medium
                tracking-[0.15em]
                text-slate-400
              "
            >
              {String(activeIndex + 1).padStart(
                2,
                "0"
              )}
              {" / "}
              {String(industries.length).padStart(
                2,
                "0"
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

