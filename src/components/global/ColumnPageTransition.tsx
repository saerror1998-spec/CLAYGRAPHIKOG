"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useSite } from "./site-context";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";

const COL_COUNT = 6;
const COL_COLORS = ["#121212", "#101010", "#0E0E0E", "#121212", "#101010", "#0E0E0E"];

export interface ColumnTransitionHandle {
  /** Instantly start the column-wipe cover animation. Resolves at full cover. */
  cover: () => Promise<void>;
  /** Reveal the destination page. Resolves when overlay is hidden. */
  reveal: () => Promise<void>;
}

/**
 * Column-wipe page transition — 6 vertical strips enter from the top with
 * right-to-left stagger (stair-step cover), then retract left-to-right
 * to reveal the destination page.
 *
 * Exposed imperatively via ref: SiteShell calls cover() → push route → reveal().
 */
const ColumnPageTransition = forwardRef<ColumnTransitionHandle>(function ColumnPageTransition(
  _props,
  ref,
) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { lenis } = useSite();
  const reduced = usePrefersReducedMotion();
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  const resetScroll = () => {
    window.scrollTo(0, 0);
    lenisRef.current?.scrollTo(0, { immediate: true });
    ScrollTrigger.refresh();
  };

  useImperativeHandle(ref, () => ({
    cover: () =>
      new Promise<void>((resolve) => {
        const overlay = overlayRef.current;
        if (!overlay || reduced) {
          resolve();
          return;
        }

        // Kill any in-flight timeline.
        tlRef.current?.kill();

        const columns = Array.from(
          overlay.querySelectorAll<HTMLElement>("[data-col]"),
        );

        // Prepare: all columns hidden at top.
        gsap.set(overlay, { visibility: "visible" });
        gsap.set(columns, {
          scaleY: 0,
          transformOrigin: "top",
          willChange: "transform",
        });

        // Cover — right-to-left stagger (from: "end" = last column first).
        const tl = gsap.timeline({ onComplete: resolve });
        tlRef.current = tl;

        tl.to(columns, {
          scaleY: 1,
          duration: 0.46,
          ease: "power3.inOut",
          stagger: { each: 0.05, from: "end" },
        });
      }),

    reveal: () =>
      new Promise<void>((resolve) => {
        const overlay = overlayRef.current;
        if (!overlay || reduced) {
          resolve();
          return;
        }

        const columns = Array.from(
          overlay.querySelectorAll<HTMLElement>("[data-col]"),
        );

        // Switch transform-origin to bottom for the retract.
        gsap.set(columns, { transformOrigin: "bottom" });

        const tl = gsap.timeline({
          onComplete: () => {
            tlRef.current = null;
            window.dispatchEvent(new CustomEvent("column-transition-done"));
            resolve();
          },
        });
        tlRef.current = tl;

        // Reveal — left-to-right stagger (from: "start" = first column first).
        tl.to(columns, {
          scaleY: 0,
          duration: 0.46,
          ease: "power3.inOut",
          stagger: { each: 0.05, from: "start" },
        });

        // Clean up after reveal.
        tl.set(overlay, { visibility: "hidden" });
        tl.set(columns, { clearProps: "willChange" });
      }),
  }), [reduced]);

  const overlayClass = reduced
    ? "invisible translate-y-full"
    : "invisible pointer-events-none";

  return (
    <div
      ref={overlayRef}
      data-page-transition
      aria-hidden="true"
      className={`fixed inset-0 z-[60] ${overlayClass}`}
    >
      {Array.from({ length: COL_COUNT }).map((_, i) => (
        <div
          key={i}
          data-col
          className="absolute top-0 h-full"
          style={{
            left: `calc(${i} * (100% / ${COL_COUNT}))`,
            width: `calc(100% / ${COL_COUNT} + 1px)`, // +1px overlap prevents subpixel seams
            backgroundColor: COL_COLORS[i],
          }}
        />
      ))}
    </div>
  );
});

export default ColumnPageTransition;
