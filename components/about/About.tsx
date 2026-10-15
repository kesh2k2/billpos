"use client";

/* ============================================================
 * About Section
 * ------------------------------------------------------------
 * Collage aesthetic matched to the Packages + Contacts sections:
 *   • Cormorant Garamond + Jost
 *   • Torn-paper tags, halftone dots, grain, washi tape
 *   • Letter-bounce hero heading (with hover hop)
 *   • Word-mask intro reveal
 *   • Card drops with back.out for stats, services, stack
 *   • Icon pops and pill staggers
 *   • FAQ rows rise in with stagger
 *   • Parallax collage backdrop
 *
 * Scroll-restoration fix:
 *   Uses the shared `useResetScrollOnMount` hook from
 *   `@/lib/use-reset-scroll-on-mount` so the section always opens
 *   at its own top edge when navigated to.
 *
 * All existing content + features preserved:
 *   - Stats trio with torn clip-paths
 *   - Story section with photo collage
 *   - Services grid (6 items)
 *   - Why-choose section (navy)
 *   - Tech stack groups (5 groups)
 *   - FAQ accordion (openFaq state)
 *   - Final CTA block
 *   - All links, hrefs, and copy from qdeskai.com
 * ============================================================ */

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Cormorant_Garamond, Jost } from "next/font/google";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useResetScrollOnMount } from "@/lib/use-reset-scroll-on-mount";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Check,
  Cloud,
  Code,
  Compass,
  Cpu,
  Headphones,
  Layers,
  Mail,
  Megaphone,
  Palette,
  Phone,
  Plus,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Fonts + palette (same as the other components)                     */
/* ------------------------------------------------------------------ */

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const sans = Jost({ subsets: ["latin"], weight: ["300", "400", "500"] });

// Dark blue  #0a1b3d  |  Light blue #cfe5f6  |  Gray #dfe4eb / #6b7686  |  White

/* ------------------------------------------------------------------ */
/* Texture helpers                                                    */
/* ------------------------------------------------------------------ */

const grain =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const halftoneDark =
  "radial-gradient(circle, rgba(10,27,61,0.9) 1.1px, transparent 1.6px)";
const halftoneLight =
  "radial-gradient(circle, rgba(207,229,246,0.9) 1.2px, transparent 1.7px)";

const torn =
  "polygon(0 0,100% 0,100% 92%,96% 97%,92% 91%,88% 98%,84% 92%,80% 97%,76% 91%,72% 98%,68% 92%,64% 97%,60% 91%,56% 98%,52% 92%,48% 97%,44% 91%,40% 98%,36% 92%,32% 97%,28% 91%,24% 98%,20% 92%,16% 97%,12% 91%,8% 98%,4% 92%,0 97%)";

const tapeClip =
  "polygon(0 0,4% 20%,0 40%,4% 60%,0 80%,3% 100%,100% 100%,96% 80%,100% 60%,96% 40%,100% 20%,97% 0)";

function Grain({ opacity = 0.18 }: { opacity?: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 mix-blend-multiply"
      style={{ backgroundImage: grain, opacity }}
    />
  );
}

function Tape({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute z-20 h-6 w-20 border-y border-white/60 bg-[#cfe5f6]/75 ${className}`}
      style={{ clipPath: tapeClip }}
    />
  );
}

/** Duotone photo. Adds `relative` only if the caller hasn't set a position. */
function Photo({
  src,
  alt,
  className = "",
  tone = 0.4,
}: {
  src: string;
  alt: string;
  className?: string;
  tone?: number;
}) {
  const hasPosition = /(^|\s)(absolute|relative|fixed|sticky)(\s|$)/.test(className);
  return (
    <div className={`${hasPosition ? "" : "relative"} overflow-hidden bg-[#c5ccd6] ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.opacity = "0";
        }}
        className="h-full w-full object-cover grayscale contrast-[1.1] transition duration-700 group-hover:grayscale-0"
      />
      <div
        className="pointer-events-none absolute inset-0 mix-blend-multiply"
        style={{ background: `rgba(18,41,90,${tone})` }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-30 mix-blend-multiply"
        style={{ backgroundImage: halftoneDark, backgroundSize: "6px 6px" }}
      />
    </div>
  );
}

const reduceMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ------------------------------------------------------------------ */
/* Text splitting helpers (no paid GSAP plugin needed)                */
/* ------------------------------------------------------------------ */

/** Every letter becomes its own span so it can bounce. Words never break in the middle. */
function SplitChars({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, wi) => (
        <span key={wi}>
          <span className="inline-block whitespace-nowrap">
            {word.split("").map((ch, ci) => (
              <span
                key={ci}
                data-char="1"
                className="ab-char inline-block will-change-transform"
              >
                {ch}
              </span>
            ))}
          </span>
          {wi < words.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}

/** Every word rises out of its own mask for the staggered reveal. */
function SplitWords({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span key={i}>
          <span className="-mb-[3px] inline-block overflow-hidden pb-[3px] align-top">
            <span className="ab-word inline-block will-change-transform">
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Content (taken from qdeskai.com)                                   */
/* ------------------------------------------------------------------ */

const PHONE_DISPLAY = "0706833644";
const PHONE_TEL = "tel:0706833644";
const EMAIL = "hello@qdeskai.com";

const IMG_TEAM =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=85";
const IMG_COLLAB =
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=85";
const IMG_CODE =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=85";
const IMG_CHIP =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=85";

const stats = [
  { value: "50+", label: "Projects completed", bg: "bg-[#dfe4eb] text-[#0a1b3d]", sub: "text-[#0a1b3d]/65", tilt: "-1deg" },
  { value: "25+", label: "Happy clients", bg: "bg-[#0a1b3d] text-white", sub: "text-white/70", tilt: "0.8deg" },
  { value: "2+", label: "Years of innovation", bg: "bg-[#cfe5f6] text-[#0a1b3d]", sub: "text-[#0a1b3d]/65", tilt: "-0.6deg" },
];

const highlights = [
  "Modern, scalable software development",
  "AI-powered solutions and automation",
  "Agile development with fast delivery",
];

type Variant = "white" | "sky" | "navy" | "gray";

const variantStyles: Record<Variant, { card: string; icon: string; sub: string }> = {
  white: { card: "bg-white text-[#0a1b3d]", icon: "bg-[#cfe5f6] text-[#0a1b3d]", sub: "text-[#0a1b3d]/70" },
  sky: { card: "bg-[#cfe5f6] text-[#0a1b3d]", icon: "bg-white text-[#0a1b3d]", sub: "text-[#0a1b3d]/75" },
  navy: { card: "bg-[#0a1b3d] text-white", icon: "bg-[#cfe5f6] text-[#0a1b3d]", sub: "text-white/70" },
  gray: { card: "bg-[#dfe4eb] text-[#0a1b3d]", icon: "bg-white text-[#0a1b3d]", sub: "text-[#0a1b3d]/70" },
};

const services: {
  Icon: any;
  title: string;
  body: string;
  variant: Variant;
  tilt: string;
}[] = [
  {
    Icon: Palette,
    title: "Web Design",
    body: "Creating stunning, responsive, and user-friendly websites that perfectly represent your brand and engage your target audience effectively.",
    variant: "white",
    tilt: "-1.2deg",
  },
  {
    Icon: Code,
    title: "Software / Web Development",
    body: "Building robust, scalable web applications and custom software solutions tailored to meet your specific business requirements.",
    variant: "sky",
    tilt: "1deg",
  },
  {
    Icon: Megaphone,
    title: "Digital Marketing",
    body: "Comprehensive digital marketing strategies including SEO, social media marketing, and online advertising to boost your brand visibility.",
    variant: "navy",
    tilt: "-0.8deg",
  },
  {
    Icon: Compass,
    title: "IT Consulting",
    body: "Expert IT consulting services to help optimize your technology infrastructure, improve efficiency, and drive digital transformation.",
    variant: "gray",
    tilt: "0.9deg",
  },
  {
    Icon: Smartphone,
    title: "App Development",
    body: "Creating innovative mobile and desktop applications for iOS, Android, and cross-platform solutions to expand your digital presence.",
    variant: "white",
    tilt: "-0.7deg",
  },
  {
    Icon: Cpu,
    title: "AI / IoT Solutions",
    body: "Cutting-edge artificial intelligence and Internet of Things solutions to automate processes and create smart, connected systems.",
    variant: "sky",
    tilt: "1.2deg",
  },
];

const reasons: { Icon: any; eyebrow: string; title: string; body: string }[] = [
  {
    Icon: Layers,
    eyebrow: "Custom development",
    title: "Tailored software solutions",
    body: "We build custom software that fits your business needs. From enterprise applications to specialized tools, our team creates scalable, secure, and high-performance solutions.",
  },
  {
    Icon: Bot,
    eyebrow: "AI & machine learning",
    title: "Intelligent automation",
    body: "Use AI and machine learning to automate processes, gain insights from data, and build systems that adapt and improve over time.",
  },
  {
    Icon: Cloud,
    eyebrow: "Cloud infrastructure",
    title: "Scalable cloud solutions",
    body: "Migrate to the cloud with confidence. We handle deployment, monitoring, and management so your applications run smoothly and scale effortlessly.",
  },
  {
    Icon: ShieldCheck,
    eyebrow: "Security & compliance",
    title: "Enterprise-grade security",
    body: "Industry-standard security protocols, regulatory compliance, and ongoing monitoring to keep your systems and digital assets protected.",
  },
  {
    Icon: Headphones,
    eyebrow: "24/7 support & maintenance",
    title: "Round-the-clock support",
    body: "Post-launch monitoring, security updates, performance optimization, bug fixes, and feature enhancements as your business grows.",
  },
];

const stack: { group: string; items: string[]; variant: Variant; tilt: string; wide?: boolean }[] = [
  {
    group: "Frontend",
    items: ["React.js", "Next.js", "Vue.js", "Tailwind", "Bootstrap", "Material UI"],
    variant: "white",
    tilt: "-0.8deg",
  },
  {
    group: "Backend & databases",
    items: ["Node.js", "Express", "MongoDB", "MySQL", "PostgreSQL", "Firebase", "WordPress"],
    variant: "sky",
    tilt: "0.8deg",
  },
  {
    group: "Mobile",
    items: ["Flutter", "React Native", "Android", "Kotlin", "Java"],
    variant: "gray",
    tilt: "0.6deg",
  },
  {
    group: "Design",
    items: ["Photoshop", "Figma", "Lightroom"],
    variant: "white",
    tilt: "-0.6deg",
  },
  {
    group: "AI & data",
    items: [
      "NLP", "Dialogflow", "Rasa", "Python", "TensorFlow", "PyTorch", "Scikit-learn",
      "OpenAI", "GPT", "HuggingFace", "OpenCV", "YOLO", "Pandas", "NumPy", "SQL",
    ],
    variant: "navy",
    tilt: "-0.4deg",
    wide: true,
  },
];

const faqs = [
  {
    q: "What types of software solutions does Qdesk AI develop?",
    a: "We specialize in custom web applications, mobile apps (iOS & Android), AI/ML solutions, enterprise software, e-commerce platforms, and IoT systems. Our team works with modern technologies like React, Node.js, Python, and cloud platforms to deliver scalable, secure solutions tailored to your business needs.",
  },
  {
    q: "How can AI and machine learning benefit my business?",
    a: "AI can automate repetitive tasks, analyze large datasets for insights, improve customer service with chatbots, enhance decision-making with predictive analytics, and personalize user experiences. We help businesses reduce costs, increase efficiency, and gain competitive advantages through intelligent automation and data-driven solutions.",
  },
  {
    q: "How long does it typically take to develop a custom application?",
    a: "Project timelines vary based on complexity and requirements. Simple web applications: 4-8 weeks, mobile apps: 8-16 weeks, enterprise solutions: 3-6 months, AI/ML projects: 2-4 months. We provide detailed project roadmaps with milestones and keep you updated throughout the development process.",
  },
  {
    q: "Do you provide ongoing maintenance and support after project completion?",
    a: "Yes, we offer comprehensive post-launch support including 24/7 monitoring, security updates, performance optimization, bug fixes, and feature enhancements. Our support packages range from basic maintenance to full managed services, ensuring your application continues to perform optimally as your business grows.",
  },
  {
    q: "What makes Qdesk AI different from other software companies?",
    a: "We combine deep technical expertise with business understanding to deliver solutions that drive real results. Our agile development approach, transparent communication, competitive pricing, and focus on emerging technologies like AI/ML set us apart. We're not just developers - we're your technology partners committed to your long-term success.",
  },
];

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  /* Strong scroll-restoration fix — resets the window scroll AND
   * refreshes ScrollTrigger in the correct order, so the section
   * always opens at its own top edge when navigated to. */
  useResetScrollOnMount(sectionRef);

  /* ---------------- Animations ---------------- */

  useIsoLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root || reduceMotion()) return;

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      /* 1 ─ HERO: tag stamp → letters bounce → intro words rise → collage pops */
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.querySelector(".ab-hero"),
            start: "top 85%",
            once: true,
          },
        })
        .fromTo(
          ".ab-tag",
          { scale: 2.4, opacity: 0, rotation: 14 },
          { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: "back.out(2.2)" }
        )
        .fromTo(
          ".ab-hero .ab-char",
          {
            y: -120,
            rotation: () => gsap.utils.random(-18, 18),
            transformOrigin: "50% 100%",
          },
          {
            y: 0,
            rotation: 0,
            duration: 1.15,
            ease: "bounce.out",
            stagger: { each: 0.035 },
          },
          "-=0.2"
        )
        // separate opacity tween (a bounce ease would flicker it)
        .fromTo(
          ".ab-hero .ab-char",
          { opacity: 0 },
          { opacity: 1, duration: 0.25, ease: "none", stagger: { each: 0.035 } },
          "<"
        )
        .fromTo(
          ".ab-hero .ab-word",
          { yPercent: 115, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.75,
            ease: "power3.out",
            stagger: 0.03,
          },
          "-=0.55"
        )
        .fromTo(
          ".ab-hero-cta",
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", stagger: 0.1 },
          "-=0.35"
        )
        // hero collage
        .fromTo(
          ".ab-hero-photo",
          { y: 60, opacity: 0, rotation: 14, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            rotation: 4,
            scale: 1,
            duration: 1,
            ease: "back.out(1.6)",
          },
          "-=0.65"
        )
        .fromTo(
          ".ab-hero-arch",
          { scale: 0.85, opacity: 0, y: 40 },
          { scale: 1, opacity: 1, y: 0, duration: 0.9, ease: "back.out(1.5)" },
          "-=0.7"
        )
        .fromTo(
          ".ab-hero-sticker",
          { scale: 0, rotation: -45 },
          { scale: 1, rotation: 6, duration: 0.9, ease: "elastic.out(1, 0.45)" },
          "-=0.55"
        )
        .fromTo(
          ".ab-hero-blob",
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1, ease: "power3.out" },
          "-=1"
        );

      /* 2 ─ STATS: three torn cards drop in with alternating tilt */
      gsap.fromTo(
        ".ab-stat",
        {
          y: 90,
          opacity: 0,
          rotation: (i: number) => [-7, 6, -5][i % 3],
          scale: 0.92,
          transformOrigin: "50% 100%",
        },
        {
          y: 0,
          opacity: 1,
          rotation: 0,
          scale: 1,
          duration: 0.9,
          ease: "back.out(1.6)",
          stagger: 0.14,
          scrollTrigger: {
            trigger: root.querySelector(".ab-stats"),
            start: "top 88%",
            once: true,
          },
        }
      );

      // stat text (value + label) rise in after the cards land
      gsap.fromTo(
        ".ab-stat .ab-stat-num",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.14,
          delay: 0.3,
          scrollTrigger: {
            trigger: root.querySelector(".ab-stats"),
            start: "top 88%",
            once: true,
          },
        }
      );
      gsap.fromTo(
        ".ab-stat .ab-stat-label",
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.14,
          delay: 0.42,
          scrollTrigger: {
            trigger: root.querySelector(".ab-stats"),
            start: "top 88%",
            once: true,
          },
        }
      );

      /* 3 ─ STORY: photo collage pops, copy reveals */
      gsap.fromTo(
        ".ab-story-photo-main",
        { y: 60, opacity: 0, rotation: -3, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          rotation: 0,
          scale: 1,
          duration: 1,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: root.querySelector(".ab-story"),
            start: "top 82%",
            once: true,
          },
        }
      );
      gsap.fromTo(
        ".ab-story-photo-arch",
        { scale: 0.85, opacity: 0, rotation: 10 },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.9,
          ease: "back.out(1.6)",
          delay: 0.3,
          scrollTrigger: {
            trigger: root.querySelector(".ab-story"),
            start: "top 82%",
            once: true,
          },
        }
      );
      gsap.fromTo(
        ".ab-story-square",
        { scale: 0, rotation: -30, opacity: 0 },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.8,
          ease: "back.out(2)",
          delay: 0.15,
          scrollTrigger: {
            trigger: root.querySelector(".ab-story"),
            start: "top 82%",
            once: true,
          },
        }
      );
      gsap.fromTo(
        ".ab-story-copy > *",
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.11,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.querySelector(".ab-story"),
            start: "top 82%",
            once: true,
          },
        }
      );
      gsap.fromTo(
        ".ab-story-highlight",
        { x: -22, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.35,
          scrollTrigger: {
            trigger: root.querySelector(".ab-story"),
            start: "top 82%",
            once: true,
          },
        }
      );

      /* 4 ─ SERVICES: header tag + heading bounce, then cards drop with tilt */
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.querySelector(".ab-services-head"),
            start: "top 88%",
            once: true,
          },
        })
        .fromTo(
          ".ab-services-tag",
          { scale: 2.2, opacity: 0, rotation: 12 },
          { scale: 1, opacity: 1, rotation: 0, duration: 0.55, ease: "back.out(2.2)" }
        )
        .fromTo(
          ".ab-services-head .ab-word",
          { yPercent: 115, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.75,
            ease: "power3.out",
            stagger: 0.06,
          },
          "-=0.25"
        );

      gsap.fromTo(
        ".ab-service",
        {
          y: 100,
          opacity: 0,
          rotation: (i: number) => [-7, 6, -5, 7, -6, 5][i % 6],
          scale: 0.92,
          transformOrigin: "50% 100%",
        },
        {
          y: 0,
          opacity: 1,
          rotation: 0,
          scale: 1,
          duration: 0.9,
          ease: "back.out(1.6)",
          stagger: 0.09,
          scrollTrigger: {
            trigger: root.querySelector(".ab-services-grid"),
            start: "top 88%",
            once: true,
          },
        }
      );
      gsap.fromTo(
        ".ab-service .ab-service-icon",
        { scale: 0, rotation: -30, transformOrigin: "50% 50%" },
        {
          scale: 1,
          rotation: 0,
          duration: 0.5,
          ease: "back.out(3)",
          stagger: 0.09,
          delay: 0.35,
          scrollTrigger: {
            trigger: root.querySelector(".ab-services-grid"),
            start: "top 88%",
            once: true,
          },
        }
      );

      /* 5 ─ WHY CHOOSE (navy block): heading bounce + reason rows stagger */
      gsap.fromTo(
        ".ab-why-head > *",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.11,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.querySelector(".ab-why"),
            start: "top 85%",
            once: true,
          },
        }
      );
      gsap.fromTo(
        ".ab-why-photo",
        { y: 50, opacity: 0, rotation: 12, scale: 0.92 },
        {
          y: 0,
          opacity: 1,
          rotation: 0,
          scale: 1,
          duration: 0.95,
          ease: "back.out(1.5)",
          delay: 0.3,
          scrollTrigger: {
            trigger: root.querySelector(".ab-why"),
            start: "top 85%",
            once: true,
          },
        }
      );
      gsap.fromTo(
        ".ab-why-sticker",
        { scale: 0, rotation: -45 },
        {
          scale: 1,
          rotation: -6,
          duration: 0.9,
          ease: "elastic.out(1, 0.45)",
          delay: 0.45,
          scrollTrigger: {
            trigger: root.querySelector(".ab-why"),
            start: "top 85%",
            once: true,
          },
        }
      );
      gsap.fromTo(
        ".ab-reason",
        { x: 30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: root.querySelector(".ab-reasons"),
            start: "top 88%",
            once: true,
          },
        }
      );
      gsap.fromTo(
        ".ab-reason-icon",
        { scale: 0, rotation: -30, transformOrigin: "50% 50%" },
        {
          scale: 1,
          rotation: 0,
          duration: 0.5,
          ease: "back.out(2.8)",
          stagger: 0.1,
          delay: 0.15,
          scrollTrigger: {
            trigger: root.querySelector(".ab-reasons"),
            start: "top 88%",
            once: true,
          },
        }
      );

      /* 6 ─ TECH STACK: heading bounce + group cards drop + pills stagger */
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.querySelector(".ab-stack-head"),
            start: "top 88%",
            once: true,
          },
        })
        .fromTo(
          ".ab-stack-head .ab-word",
          { yPercent: 115, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.75,
            ease: "power3.out",
            stagger: 0.06,
          }
        );

      gsap.fromTo(
        ".ab-stack",
        {
          y: 80,
          opacity: 0,
          rotation: (i: number) => [-5, 5, -4, 4, -3][i % 5],
          scale: 0.94,
          transformOrigin: "50% 100%",
        },
        {
          y: 0,
          opacity: 1,
          rotation: 0,
          scale: 1,
          duration: 0.85,
          ease: "back.out(1.6)",
          stagger: 0.12,
          scrollTrigger: {
            trigger: root.querySelector(".ab-stack-grid"),
            start: "top 88%",
            once: true,
          },
        }
      );
      gsap.fromTo(
        ".ab-stack-pill",
        { y: 14, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.02,
          delay: 0.35,
          scrollTrigger: {
            trigger: root.querySelector(".ab-stack-grid"),
            start: "top 88%",
            once: true,
          },
        }
      );

      /* 7 ─ FAQ: header bounce + rows rise in */
      gsap.fromTo(
        ".ab-faq-head > *",
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.11,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.querySelector(".ab-faq"),
            start: "top 88%",
            once: true,
          },
        }
      );
      gsap.fromTo(
        ".ab-faq-row",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: root.querySelector(".ab-faq-list"),
            start: "top 88%",
            once: true,
          },
        }
      );

      /* 8 ─ CTA: back-sheet + panel + tapes + buttons */
      gsap.fromTo(
        ".ab-cta-sheet",
        { opacity: 0, x: -20, y: -20 },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.querySelector(".ab-cta"),
            start: "top 88%",
            once: true,
          },
        }
      );
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.querySelector(".ab-cta"),
            start: "top 88%",
            once: true,
          },
        })
        .fromTo(
          ".ab-cta-panel",
          { y: 60, opacity: 0, scale: 0.96, transformOrigin: "50% 100%" },
          { y: 0, opacity: 1, scale: 1, duration: 0.95, ease: "back.out(1.5)" }
        )
        .fromTo(
          ".ab-cta-tape",
          { scale: 0, rotation: 0 },
          { scale: 1, rotation: 0, duration: 0.5, stagger: 0.1, ease: "back.out(2)" },
          "-=0.4"
        )
        .fromTo(
          ".ab-cta-head",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
          "-=0.35"
        )
        .fromTo(
          ".ab-cta-btn",
          { scale: 0.85, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.7,
            ease: "elastic.out(1, 0.5)",
            stagger: 0.08,
          },
          "-=0.4"
        );

      /* 9 ─ BACKDROP SHAPES: slow parallax while scrolling */
      gsap.utils.toArray<HTMLElement>(".ab-parallax", root).forEach((el) => {
        const depth = Number(el.dataset.depth || 60);
        gsap.to(el, {
          y: -depth,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });
    }, root);

    // font metrics shift layout → refresh trigger positions
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  /* hover a hero letter → it hops */
  const hopLetter = (e: React.MouseEvent<HTMLElement>) => {
    if (reduceMotion()) return;
    const el = e.target as HTMLElement;
    if (el.dataset.char !== "1" || gsap.isTweening(el)) return;
    gsap.to(el, { y: -18, duration: 0.18, ease: "power2.out", yoyo: true, repeat: 1 });
  };

  /* ---------------------------------------------------------------- */
  /* Render                                                            */
  /* ---------------------------------------------------------------- */

  return (
    <section
      ref={sectionRef}
      id="about"
      className={`${sans.className} relative w-full overflow-hidden bg-[#f1f4f8] py-16 text-[#0a1b3d] sm:py-24 lg:py-28`}
    >
      <Grain opacity={0.14} />

      {/* ============================================================ */}
      {/* Collage backdrop                                              */}
      {/* ============================================================ */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="ab-parallax absolute -left-28 top-20" data-depth="90">
          <div className="h-56 w-56 rounded-full bg-[#dfe4eb] sm:h-80 sm:w-80" />
        </div>
        <div
          className="ab-parallax absolute -right-16 top-[900px] hidden lg:block"
          data-depth="140"
        >
          <div className="h-72 w-48 rotate-[8deg] bg-[#cfe5f6]/70" />
        </div>
        <div
          className="ab-parallax absolute left-[4%] top-[1500px] hidden lg:block"
          data-depth="60"
        >
          <div
            className="h-40 w-40 opacity-40"
            style={{ backgroundImage: halftoneDark, backgroundSize: "9px 9px" }}
          />
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">

        {/* ============================================================ */}
        {/* HERO                                                           */}
        {/* ============================================================ */}

        <div className="ab-hero grid items-center gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
          <div>
            <div className="ab-tag mb-5 sm:mb-6">
              <span
                className={`${serif.className} relative inline-block -rotate-2 bg-[#dfe4eb] px-5 py-1.5 text-[16px] italic sm:text-[17px]`}
                style={{ clipPath: torn }}
              >
                Who we are
              </span>
            </div>

            <h1
              onMouseOver={hopLetter}
              className={`${serif.className} text-[48px] font-light leading-[0.98] tracking-[-0.02em] sm:text-[80px] lg:text-[104px]`}
            >
              <span className="sr-only">About Qdesk AI</span>
              <span aria-hidden="true">
                <SplitChars text="About" />
                <br />
                <span className="font-normal italic text-[#6b7686]">
                  <SplitChars text="Qdesk AI" />
                </span>
              </span>
            </h1>

            <p className="mt-6 max-w-[560px] text-[14.5px] font-light leading-7 text-[#0a1b3d]/70 sm:mt-7 sm:text-[15.5px]">
              <span className="sr-only">
                We're a passionate team of developers, designers, and
                innovators building the next generation of AI-powered software
                solutions. Our mission is to make technology accessible and
                transformative for businesses of all sizes.
              </span>
              <span aria-hidden="true">
                <SplitWords text="We're a passionate team of developers, designers, and innovators building the next generation of AI-powered software solutions. Our mission is to make technology accessible and transformative for businesses of all sizes." />
              </span>
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#services"
                className="ab-hero-cta group/btn inline-flex items-center gap-2 rounded-full bg-[#0a1b3d] px-6 py-3 text-[13.5px] font-normal text-white transition hover:bg-[#12306a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-2"
              >
                Our services
                <ArrowRight className="h-4 w-4 transition group-hover/btn:translate-x-0.5" />
              </a>
              <Link
                href="/contact"
                className="ab-hero-cta group/btn inline-flex items-center gap-2 rounded-full border border-[#0a1b3d]/30 bg-white px-6 py-3 text-[13.5px] font-normal transition hover:border-[#0a1b3d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-2"
              >
                Start your project
                <ArrowUpRight className="h-4 w-4 transition group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* hero collage */}
          <div className="group relative mx-auto h-[340px] w-full max-w-[380px] sm:h-[420px] sm:max-w-[430px]">
            <div className="ab-hero-blob absolute right-0 top-4 h-36 w-36 rounded-full bg-[#0a1b3d] sm:h-52 sm:w-52" />
            <div
              className="absolute -left-2 bottom-2 h-28 w-36 opacity-60 sm:h-36 sm:w-44"
              style={{ backgroundImage: halftoneDark, backgroundSize: "8px 8px" }}
            />
            <div className="ab-hero-photo absolute left-2 top-0 w-[210px] rotate-[4deg] bg-white p-2.5 pb-10 shadow-[0_30px_50px_-25px_rgba(10,27,61,0.55)] sm:left-6 sm:w-[270px] sm:p-3 sm:pb-12">
              <Tape className="-top-3 left-1/2 -translate-x-1/2 -rotate-3" />
              <Photo
                src={IMG_TEAM}
                alt="The Qdesk AI team at work"
                className="aspect-[4/5] w-full"
                tone={0.35}
              />
              <p
                className={`${serif.className} absolute bottom-2.5 left-3.5 text-[17px] italic sm:bottom-3 sm:left-4 sm:text-[20px]`}
              >
                Developers, designers &amp; innovators
              </p>
            </div>
            <Photo
              src={IMG_CHIP}
              alt=""
              tone={0.35}
              className="ab-hero-arch absolute bottom-0 right-0 z-10 h-[170px] w-[112px] rounded-t-full border-[5px] border-white shadow-[0_25px_40px_-20px_rgba(0,0,0,0.6)] sm:h-[220px] sm:w-[150px] sm:border-[6px]"
            />
            <div className="ab-hero-sticker absolute right-1 top-0 z-10 flex h-20 w-20 rotate-6 items-center justify-center bg-[#cfe5f6] p-2 text-center shadow-lg sm:right-3 sm:h-24 sm:w-24">
              <p className={`${serif.className} text-[15px] italic leading-tight sm:text-[17px]`}>
                Kandy,
                <br />
                Sri Lanka
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* STATS                                                          */}
        {/* ============================================================ */}

        <div className="ab-stats mt-20 grid gap-6 sm:mt-24 sm:grid-cols-3 sm:gap-5">
          {stats.map((s) => (
            <div
              key={s.label}
              className={`ab-stat relative px-6 pb-9 pt-7 shadow-[0_30px_50px_-35px_rgba(10,27,61,0.5)] sm:px-7 ${s.bg}`}
              style={{ clipPath: torn, transform: `rotate(${s.tilt})` }}
            >
              <Grain opacity={0.1} />
              <p
                className={`${serif.className} ab-stat-num relative text-[64px] font-light leading-none sm:text-[76px]`}
              >
                {s.value}
              </p>
              <p
                className={`${serif.className} ab-stat-label relative mt-2 text-[22px] italic ${s.sub}`}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* ============================================================ */}
        {/* STORY                                                          */}
        {/* ============================================================ */}

        <div className="ab-story mt-24 grid items-center gap-12 sm:mt-32 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          {/* collage */}
          <div className="group relative mx-auto h-[360px] w-full max-w-[560px] sm:h-[480px]">
            <div
              className="ab-story-square absolute -left-3 -top-3 h-28 w-28 bg-[#cfe5f6] sm:-left-4 sm:-top-4 sm:h-40 sm:w-40"
              aria-hidden="true"
            />
            <div
              className="absolute bottom-10 left-8 h-28 w-32 opacity-50 sm:h-32 sm:w-40"
              style={{ backgroundImage: halftoneDark, backgroundSize: "8px 8px" }}
              aria-hidden="true"
            />
            <Tape className="-top-3 left-1/2 -translate-x-1/2 rotate-2" />
            <Photo
              src={IMG_CODE}
              alt="Code on a laptop screen"
              tone={0.28}
              className="ab-story-photo-main absolute bottom-12 left-0 right-6 top-0 shadow-[0_30px_60px_-30px_rgba(10,27,61,0.7)] sm:bottom-14 sm:right-10"
            />
            <Photo
              src={IMG_COLLAB}
              alt=""
              tone={0.35}
              className="ab-story-photo-arch absolute bottom-0 right-0 z-10 h-[110px] w-[110px] rounded-full border-[6px] border-white shadow-xl sm:h-[190px] sm:w-[190px] sm:border-[8px]"
            />
          </div>

          {/* copy */}
          <div className="ab-story-copy">
            <h2
              className={`${serif.className} text-[36px] font-light leading-[1.02] tracking-[-0.015em] sm:text-[52px] lg:text-[60px]`}
            >
              Building the future of
              <span className="block italic text-[#6b7686]">
                software development
              </span>
            </h2>

            <p className="mt-6 max-w-[540px] text-[14.5px] font-light leading-7 text-[#0a1b3d]/75 sm:text-[15.5px]">
              At Qdesk AI, we&apos;re a young and dynamic team passionate about
              creating innovative software solutions. We combine cutting-edge
              technology with practical business solutions to help companies
              grow and succeed in the digital age.
            </p>

            <ul className="mt-7 border-t border-[#0a1b3d]/15">
              {highlights.map((h) => (
                <li
                  key={h}
                  className="ab-story-highlight flex items-center gap-3.5 border-b border-[#0a1b3d]/15 py-4"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0a1b3d] text-white">
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                  <span
                    className={`${serif.className} text-[21px] font-medium leading-tight sm:text-[23px]`}
                  >
                    {h}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href="/contact"
              className="group/btn mt-8 inline-flex items-center gap-2 rounded-full bg-[#0a1b3d] px-6 py-3 text-[13.5px] font-normal text-white transition hover:bg-[#12306a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-2"
            >
              Start your project
              <ArrowUpRight className="h-4 w-4 transition group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SERVICES                                                       */}
        {/* ============================================================ */}

        <div id="services" className="mt-24 scroll-mt-8 sm:mt-32">
          <div className="ab-services-head max-w-[760px]">
            <div className="ab-services-tag mb-5">
              <span
                className={`${serif.className} relative inline-block rotate-1 bg-[#cfe5f6] px-5 py-1.5 text-[16px] italic sm:text-[17px]`}
                style={{ clipPath: torn }}
              >
                What we do
              </span>
            </div>
            <h2
              className={`${serif.className} text-[38px] font-light leading-[1] tracking-[-0.02em] sm:text-[60px] lg:text-[72px]`}
            >
              <span className="sr-only">
                Professional services &amp; solutions
              </span>
              <span aria-hidden="true">
                <SplitWords text="Professional services" />
                <span className="block italic text-[#6b7686]">
                  <SplitWords text="& solutions" />
                </span>
              </span>
            </h2>
          </div>

          <div className="ab-services-grid mt-12 grid gap-8 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3">
            {services.map(({ Icon, title, body, variant, tilt }) => {
              const v = variantStyles[variant];
              return (
                <div key={title} className="ab-service relative">
                  <div
                    className={`relative h-full rotate-[var(--r)] p-6 shadow-[0_30px_50px_-30px_rgba(10,27,61,0.55)] transition-transform duration-500 hover:-translate-y-1 hover:rotate-0 sm:p-7 ${v.card}`}
                    style={{ ["--r" as any]: tilt }}
                  >
                    <Grain opacity={variant === "navy" ? 0.25 : 0.1} />
                    <Tape className="-top-3 right-6 h-5 w-14 rotate-3" />
                    <span
                      className={`ab-service-icon relative flex h-12 w-12 items-center justify-center rounded-full ${v.icon}`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3
                      className={`${serif.className} relative mt-5 text-[28px] font-medium leading-[1.05]`}
                    >
                      {title}
                    </h3>
                    <p
                      className={`relative mt-3 text-[14px] font-light leading-7 ${v.sub}`}
                    >
                      {body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* WHY CHOOSE                                                     */}
        {/* ============================================================ */}

        <div className="ab-why relative mt-24 bg-[#0a1b3d] text-white sm:mt-32">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{ backgroundImage: halftoneLight, backgroundSize: "10px 10px" }}
          />
          <Grain opacity={0.25} />

          <div className="relative grid gap-12 p-5 py-10 sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:p-14">
            <div className="ab-why-head min-w-0">
              <h2
                className={`${serif.className} text-[38px] font-light leading-[1] tracking-[-0.02em] sm:text-[56px] lg:text-[64px]`}
              >
                Why choose
                <span className="block italic text-[#cfe5f6]">Qdesk AI</span>
              </h2>
              <p className="mt-5 max-w-[360px] text-[14.5px] font-light leading-7 text-white/70">
                We combine technical expertise with business understanding —
                transparent communication, an agile approach, and a focus on
                emerging technologies like AI and machine learning.
              </p>

              <div className="group relative mt-10 h-[280px] w-[250px] max-w-full">
                <Photo
                  src={IMG_TEAM}
                  alt=""
                  tone={0.3}
                  className="ab-why-photo absolute left-0 top-0 h-[240px] w-[170px] rounded-t-full border-[5px] border-white shadow-[0_25px_40px_-20px_rgba(0,0,0,0.7)]"
                />
                <div className="ab-why-sticker absolute bottom-0 right-0 z-10 flex h-24 w-24 -rotate-6 items-center justify-center bg-[#cfe5f6] p-2 text-center text-[#0a1b3d] shadow-lg">
                  <p
                    className={`${serif.className} text-[16px] italic leading-tight`}
                  >
                    Your
                    <br />
                    technology
                    <br />
                    partner
                  </p>
                </div>
              </div>
            </div>

            <ul className="ab-reasons min-w-0 border-t border-white/20">
              {reasons.map(({ Icon, eyebrow, title, body }) => (
                <li
                  key={title}
                  className="ab-reason flex items-start gap-4 border-b border-white/20 py-5 sm:gap-5"
                >
                  <span className="ab-reason-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#cfe5f6] text-[#0a1b3d] sm:h-12 sm:w-12">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-light text-[#cfe5f6]">
                      {eyebrow}
                    </p>
                    <h3
                      className={`${serif.className} mt-1 text-[26px] font-medium leading-tight sm:text-[30px]`}
                    >
                      {title}
                    </h3>
                    <p className="mt-2 text-[14px] font-light leading-7 text-white/70">
                      {body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ============================================================ */}
        {/* TECH STACK                                                     */}
        {/* ============================================================ */}

        <div className="mt-24 sm:mt-32">
          <div className="ab-stack-head max-w-[760px]">
            <h2
              className={`${serif.className} text-[38px] font-light leading-[1] tracking-[-0.02em] sm:text-[60px] lg:text-[72px]`}
            >
              <span className="sr-only">We are expert in</span>
              <span aria-hidden="true">
                <SplitWords text="We are" />
                <span className="block italic text-[#6b7686]">
                  <SplitWords text="expert in" />
                </span>
              </span>
            </h2>
          </div>

          <div className="ab-stack-grid mt-12 grid gap-8 md:grid-cols-2 md:gap-7">
            {stack.map(({ group, items, variant, tilt, wide }) => {
              const v = variantStyles[variant];
              const dark = variant === "navy";
              return (
                <div
                  key={group}
                  className={`ab-stack relative ${wide ? "md:col-span-2" : ""}`}
                >
                  <div
                    className={`relative rotate-[var(--r)] p-6 shadow-[0_30px_50px_-30px_rgba(10,27,61,0.55)] sm:p-7 ${v.card}`}
                    style={{ ["--r" as any]: tilt }}
                  >
                    <Grain opacity={dark ? 0.25 : 0.1} />
                    <p
                      className={`${serif.className} relative text-[28px] italic leading-none`}
                    >
                      {group}
                    </p>
                    <div className="relative mt-5 flex flex-wrap gap-2">
                      {items.map((it) => (
                        <span
                          key={it}
                          className={`ab-stack-pill rounded-full border px-3.5 py-1.5 text-[13px] font-normal ${
                            dark
                              ? "border-white/35 text-white"
                              : "border-[#0a1b3d]/30 text-[#0a1b3d]"
                          }`}
                        >
                          {it}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* FAQ                                                            */}
        {/* ============================================================ */}

        <div className="ab-faq mt-24 grid gap-12 sm:mt-32 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="ab-faq-head">
            <div className="mb-5">
              <span
                className={`${serif.className} relative inline-block -rotate-2 bg-[#dfe4eb] px-5 py-1.5 text-[16px] italic sm:text-[17px]`}
                style={{ clipPath: torn }}
              >
                Common questions
              </span>
            </div>
            <h2
              className={`${serif.className} text-[38px] font-light leading-[1] tracking-[-0.02em] sm:text-[56px] lg:text-[64px]`}
            >
              Frequently asked
              <span className="block italic text-[#6b7686]">questions</span>
            </h2>
            <p className="mt-5 max-w-[360px] text-[14.5px] font-light leading-7 text-[#0a1b3d]/70">
              Can&apos;t find what you&apos;re looking for? Call or write to us
              and we&apos;ll be happy to help.
            </p>
          </div>

          <div className="ab-faq-list min-w-0 border-t border-[#0a1b3d]/15">
            {faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <div
                  key={f.q}
                  className="ab-faq-row border-b border-[#0a1b3d]/15"
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : i)}
                      aria-expanded={open}
                      aria-controls={`faq-panel-${i}`}
                      id={`faq-button-${i}`}
                      className="flex w-full items-start justify-between gap-4 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-2"
                    >
                      <span
                        className={`${serif.className} text-[22px] font-medium leading-tight sm:text-[26px]`}
                      >
                        {f.q}
                      </span>
                      <span
                        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition duration-500 ${
                          open
                            ? "rotate-45 bg-[#0a1b3d] text-white"
                            : "border border-[#0a1b3d]/30"
                        }`}
                      >
                        <Plus className="h-4 w-4" />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-button-${i}`}
                    aria-hidden={!open}
                    className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                      open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-[640px] pb-6 text-[14.5px] font-light leading-7 text-[#0a1b3d]/75">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* CTA                                                            */}
        {/* ============================================================ */}

        <div className="ab-cta relative mt-24 sm:mt-32">
          <span
            aria-hidden="true"
            className="ab-cta-sheet absolute inset-0 translate-x-2 translate-y-2 bg-[#d3d9e2] sm:translate-x-3 sm:translate-y-3"
          />
          <div className="ab-cta-panel relative overflow-hidden bg-[#cfe5f6] px-5 py-12 text-center sm:px-10 sm:py-16">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.22]"
              style={{ backgroundImage: halftoneDark, backgroundSize: "10px 10px" }}
            />
            <Grain opacity={0.15} />
            <Tape className="ab-cta-tape -top-3 left-8 -rotate-6" />
            <Tape className="ab-cta-tape -top-3 right-8 rotate-6" />

            <h2
              className={`${serif.className} ab-cta-head relative mx-auto max-w-[760px] text-[38px] font-light leading-[1] tracking-[-0.02em] sm:text-[60px] lg:text-[68px]`}
            >
              Ready to start
              <span className="block italic">your project?</span>
            </h2>

            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="ab-cta-btn group/btn inline-flex items-center gap-2 rounded-full bg-[#0a1b3d] px-7 py-3.5 text-[14px] font-normal text-white transition hover:bg-[#12306a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-2"
              >
                Start your project
                <ArrowUpRight className="h-4 w-4 transition group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
              </Link>
              <a
                href={PHONE_TEL}
                className="ab-cta-btn inline-flex items-center gap-2 rounded-full border border-[#0a1b3d]/40 bg-white px-6 py-3.5 text-[14px] font-normal transition hover:border-[#0a1b3d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-2"
              >
                <Phone className="h-4 w-4" />
                {PHONE_DISPLAY}
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="ab-cta-btn inline-flex items-center gap-2 rounded-full border border-[#0a1b3d]/40 bg-white px-6 py-3.5 text-[14px] font-normal transition hover:border-[#0a1b3d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a1b3d] focus-visible:ring-offset-2"
              >
                <Mail className="h-4 w-4" />
                {EMAIL}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
