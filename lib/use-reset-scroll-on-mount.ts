"use client";

/* ============================================================
 * useResetScrollOnMount
 * ------------------------------------------------------------
 * Fully neutralizes browser scroll restoration + GSAP
 * ScrollTrigger's cached scroll offset when the user navigates
 * INTO a section.
 *
 * Why this is needed:
 *   1. `document.fonts.ready.then(() => ScrollTrigger.refresh())`
 *      runs AFTER mount, and ScrollTrigger re-applies its saved
 *      scroll offset — dropping the user mid-section.
 *   2. Next.js routing keeps the browser's last scroll on the new
 *      page until the first paint settles.
 *   3. On short viewports, the trigger can fire against an
 *      incomplete layout, caching the wrong positions.
 *
 * This hook:
 *   - Forces `history.scrollRestoration = "manual"` for the
 *     current navigation cycle.
 *   - Immediately scrolls the window to (0, 0) with `instant`
 *     behavior on the next animation frame (so layout has time to
 *     mount), THEN calls ScrollTrigger.refresh() in the correct
 *     order.
 *   - Repeats the scroll reset after fonts finish loading, then
 *     refreshes again.
 *   - One final safety reset after 200ms, in case late layout
 *     shifts things (images, lazy content, etc.).
 *
 * Note on the ref type:
 *   In React 19, `useRef<HTMLElement>(null)` returns
 *   `RefObject<HTMLElement | null>` — because `.current` is
 *   `null` before the DOM node mounts. The parameter type here
 *   reflects that reality.
 * ============================================================ */

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useResetScrollOnMount(
  sectionRef: React.RefObject<HTMLElement | null>
) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prevRestoration =
      "scrollRestoration" in window.history
        ? window.history.scrollRestoration
        : null;

    if (prevRestoration !== null) {
      window.history.scrollRestoration = "manual";
    }

    const hardReset = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant" as ScrollBehavior,
      });
    };

    // 1) Reset immediately (after layout mounts on the next frame),
    //    then refresh triggers in the correct order.
    const rafId = window.requestAnimationFrame(() => {
      hardReset();
      ScrollTrigger.refresh();
    });

    // 2) Reset again once fonts settle, and refresh in the correct
    //    order — so late-loaded webfonts don't leave triggers cached
    //    at the wrong offsets.
    const fontsPromise = (document as any).fonts?.ready as
      | Promise<unknown>
      | undefined;

    let cancelled = false;
    if (fontsPromise && typeof fontsPromise.then === "function") {
      fontsPromise.then(() => {
        if (cancelled) return;
        hardReset();
        ScrollTrigger.refresh();
      });
    }

    // 3) One final safety reset after a short delay, in case late
    //    layout (images, lazy content) shifts things.
    const safetyId = window.setTimeout(() => {
      hardReset();
    }, 200);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(safetyId);
      if (prevRestoration !== null) {
        window.history.scrollRestoration = prevRestoration;
      }
    };
    // sectionRef is intentionally referenced so lint doesn't warn;
    // it isn't read directly because the reset is a global
    // side-effect.
  }, [sectionRef]);
}
