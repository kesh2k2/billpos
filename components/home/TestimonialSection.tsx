"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  MessageCircle,
  Quote,
  Send,
  Star,
} from "lucide-react";

type Testimonial = {
  id: string;
  name: string;
  business: string;
  comment: string;
  rating: number;
  createdAt: string;
};

const STORAGE_KEY = "billpos-testimonials";

const defaultTestimonials: Testimonial[] = [
  {
    id: "default-1",
    name: "Business Owner",
    business: "Retail Business",
    comment:
      "BillPOS makes our daily sales and inventory management much easier. Everything is available in one place.",
    rating: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-2",
    name: "Restaurant Owner",
    business: "Restaurant",
    comment:
      "The system is simple to use and gives us a much clearer view of our business operations.",
    rating: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-3",
    name: "Shop Manager",
    business: "Retail Shop",
    comment:
      "Managing stock, sales and reports together has made our everyday work much more organized.",
    rating: 5,
    createdAt: new Date().toISOString(),
  },
];

export default function TestimonialSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(
    defaultTestimonials
  );

  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed: Testimonial[] = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setTestimonials([...parsed, ...defaultTestimonials]);
        }
      }
    } catch {
      console.warn("Unable to load testimonials.");
    }
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !business.trim() || !comment.trim()) {
      return;
    }

    const newTestimonial: Testimonial = {
      id: `testimonial-${Date.now()}`,
      name: name.trim(),
      business: business.trim(),
      comment: comment.trim(),
      rating,
      createdAt: new Date().toISOString(),
    };

    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      const existing: Testimonial[] = saved
        ? JSON.parse(saved)
        : [];

      const updated = [newTestimonial, ...existing];

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updated)
      );

      setTestimonials([
        newTestimonial,
        ...testimonials,
      ]);

      setName("");
      setBusiness("");
      setComment("");
      setRating(5);

      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch {
      console.warn("Unable to save testimonial.");
    }
  };

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-white py-24 sm:py-28 lg:py-32"
    >
      {/* Background detail */}
      <div className="pointer-events-none absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-blue-50/70 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-blue-600" />

              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">
                Customer Voices
              </span>
            </div>

            <h2 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl">
              Built for businesses.
              <br />
              <span className="text-slate-400">
                Loved by the people who run them.
              </span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-slate-500 lg:ml-auto">
            See what business owners and teams have to say about
            managing their everyday operations with BillPOS.
          </p>
        </div>

        {/* Testimonials */}
        <div className="mt-16 grid gap-px overflow-hidden border border-slate-200 bg-slate-200 md:grid-cols-3">
          {testimonials.slice(0, 6).map((item, index) => (
            <article
              key={item.id}
              className="
                group
                relative
                min-h-[280px]
                bg-white
                p-7
                transition-colors
                duration-300
                hover:bg-slate-50
                sm:p-8
              "
            >
              <Quote
                size={24}
                strokeWidth={1.5}
                className="text-blue-600/60"
              />

              <div className="mt-8 flex gap-1">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    size={13}
                    strokeWidth={1.8}
                    className={
                      starIndex < item.rating
                        ? "fill-blue-600 text-blue-600"
                        : "text-slate-200"
                    }
                  />
                ))}
              </div>

              <p className="mt-5 text-[15px] leading-7 text-slate-600">
                “{item.comment}”
              </p>

              <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between sm:left-8 sm:right-8">
                <div>
                  <p className="text-sm font-semibold text-slate-950">
                    {item.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {item.business}
                  </p>
                </div>

                <span className="text-xs font-medium text-slate-300">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Main interaction area */}
        <div className="mt-16 grid overflow-hidden border border-slate-200 lg:grid-cols-[0.8fr_1.2fr]">
          {/* CTA */}
          <div className="relative overflow-hidden bg-[#071A2D] p-8 text-white sm:p-10 lg:p-12">
            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-300">
                Your business next
              </p>

              <h3 className="mt-5 max-w-md text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                Ready to make your business easier to manage?
              </h3>

              <p className="mt-5 max-w-md text-sm leading-7 text-white/60">
                See how BillPOS can bring sales, inventory, purchases
                and business management together.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/contact#demo"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    bg-white
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-[#071A2D]
                    transition-transform
                    duration-300
                    hover:-translate-y-0.5
                  "
                >
                  Request a Demo
                  <ArrowUpRight size={16} />
                </a>

                <a
                  href="https://wa.me/94706833644"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    border
                    border-white/20
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    transition-colors
                    duration-300
                    hover:bg-white/10
                  "
                >
                  Contact via WhatsApp
                  <MessageCircle size={16} />
                </a>
              </div>
            </div>

            <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -bottom-12 -right-12 h-40 w-40 rounded-full border border-white/10" />
          </div>

          {/* Comment form */}
          <div className="bg-[#F8FAFC] p-8 sm:p-10 lg:p-12">
            <div className="max-w-xl">
              <div className="flex items-center gap-3">
                <MessageCircle
                  size={20}
                  className="text-blue-600"
                />

                <h3 className="text-xl font-semibold tracking-tight text-slate-950">
                  Share your experience
                </h3>
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Already using BillPOS? Tell others how it helps
                your business.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-600">
                      Your name
                    </label>

                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Perera"
                      className="
                        h-12
                        w-full
                        border
                        border-slate-200
                        bg-white
                        px-4
                        text-sm
                        text-slate-900
                        outline-none
                        transition
                        placeholder:text-slate-300
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                      "
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-600">
                      Business
                    </label>

                    <input
                      type="text"
                      value={business}
                      onChange={(e) =>
                        setBusiness(e.target.value)
                      }
                      placeholder="ABC Retail"
                      className="
                        h-12
                        w-full
                        border
                        border-slate-200
                        bg-white
                        px-4
                        text-sm
                        text-slate-900
                        outline-none
                        transition
                        placeholder:text-slate-300
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                      "
                    />
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-600">
                    Your rating
                  </label>

                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map(
                      (_, index) => {
                        const value = index + 1;

                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setRating(value)}
                            className="p-1"
                            aria-label={`${value} star rating`}
                          >
                            <Star
                              size={19}
                              className={
                                value <= rating
                                  ? "fill-blue-600 text-blue-600"
                                  : "text-slate-300"
                              }
                            />
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-600">
                    Your experience
                  </label>

                  <textarea
                    value={comment}
                    onChange={(e) =>
                      setComment(e.target.value)
                    }
                    placeholder="Tell us about your experience with BillPOS..."
                    rows={4}
                    className="
                      w-full
                      resize-none
                      border
                      border-slate-200
                      bg-white
                      px-4
                      py-3
                      text-sm
                      leading-6
                      text-slate-900
                      outline-none
                      transition
                      placeholder:text-slate-300
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-100
                    "
                  />
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[11px] leading-5 text-slate-400">
                    Your comment is currently saved locally
                    in this browser.
                  </p>

                  <button
                    type="submit"
                    className="
                      inline-flex
                      h-12
                      items-center
                      justify-center
                      gap-2
                      bg-blue-600
                      px-6
                      text-sm
                      font-semibold
                      text-white
                      transition-all
                      duration-300
                      hover:bg-blue-700
                      hover:-translate-y-0.5
                    "
                  >
                    {submitted ? "Submitted" : "Submit Review"}
                    <Send size={15} />
                  </button>
                </div>

                {submitted && (
                  <div className="border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700">
                    Thank you! Your review has been added.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Bottom statement */}
        <div className="mt-16 flex flex-col gap-4 border-t border-slate-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-slate-400">
            Real businesses. Real experiences.
          </p>

          <p className="text-sm font-semibold text-slate-900">
            One platform. One connected business.
          </p>
        </div>
      </div>
    </section>
  );
}
