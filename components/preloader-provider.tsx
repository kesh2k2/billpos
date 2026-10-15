"use client";

/* ============================================================
 * PreloaderProvider
 * ------------------------------------------------------------
 * Shows the <Preloader /> on every route change.
 *
 * Mode rule:
 *   • pathname === "/"  → "full"    (cinematic + text + bar)
 *   • any other route   → "minimal" (icons + B only, very fast)
 *
 * Flash-free reveal:
 *   Children visibility is DERIVED from pathname — not driven by
 *   an effect. On the render where pathname changes, `revealedPath`
 *   is still the OLD path, so the new page never paints before
 *   the preloader takes over.
 *
 *   An instant-cover <div> at z-[9998] sits below the preloader
 *   so there's no blank/white flash even before the preloader's
 *   dynamic chunk has finished downloading.
 * ============================================================ */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Preloader = dynamic(() => import("./preloader"), { ssr: false });

type PreloaderContextValue = {
  show: () => void;
  isLoading: boolean;
};

const PreloaderContext = createContext<PreloaderContextValue>({
  show: () => {},
  isLoading: false,
});

export const usePreloader = () => useContext(PreloaderContext);

export function PreloaderProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  /* revealedPath — the pathname whose children are allowed to render.
   * completedPath — the pathname whose preloader animation has fully
   *                 finished (so the overlay can unmount).
   *
   * Both start as `null` so the very first render shows only the
   * cover, and neither the preloader's exit nor the children can
   * leak through. */
  const [revealedPath, setRevealedPath] = useState<string | null>(null);
  const [completedPath, setCompletedPath] = useState<string | null>(null);

  /* Derived — no effect needed, so no render-gap flash. */
  const showChildren = revealedPath === pathname;
  const showOverlay = completedPath !== pathname;

  /* --------------------------------------------------------------
   * Scroll restoration guard — reset to top on every navigation.
   * ------------------------------------------------------------ */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prev =
      "scrollRestoration" in window.history
        ? window.history.scrollRestoration
        : null;

    if (prev !== null) window.history.scrollRestoration = "manual";

    const rafId = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      if (prev !== null) window.history.scrollRestoration = prev;
    };
  }, [pathname]);

  /* --------------------------------------------------------------
   * Called by the preloader when its intro finishes.
   * Mount children + refresh ScrollTrigger.
   * ------------------------------------------------------------ */
  const handleReveal = useCallback(() => {
    setRevealedPath(pathname);

    // Two rAFs: React commit → browser paint → refresh triggers.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    });
  }, [pathname]);

  /* --------------------------------------------------------------
   * Called by the preloader when its exit finishes.
   * Safe to unmount the overlay.
   * ------------------------------------------------------------ */
  const handleComplete = useCallback(() => {
    setCompletedPath(pathname);
  }, [pathname]);

  const show = useCallback(() => {
    setRevealedPath(null);
    setCompletedPath(null);
  }, []);

  /* Home → full, everything else → minimal. */
  const isHome = pathname === "/";
  const mode: "full" | "minimal" = isHome ? "full" : "minimal";

  return (
    <PreloaderContext.Provider value={{ show, isLoading: showOverlay }}>
      {/* Children — only when the current pathname has been revealed */}
      {showChildren && children}

      {/* Instant cover — prevents any flash on first paint before the
       * dynamic preloader chunk has loaded. Same bg as the preloader. */}
      {!showChildren && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-[9998] bg-[#f1f4f8]"
        />
      )}

      {/* Preloader overlay — keyed to pathname so a new navigation
       * always mounts a fresh instance (fresh animation state). */}
      {showOverlay && (
        <Preloader
          key={pathname}
          onReveal={handleReveal}
          onComplete={handleComplete}
          mode={mode}
        />
      )}
    </PreloaderContext.Provider>
  );
}
