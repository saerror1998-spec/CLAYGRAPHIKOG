"use client";

import { useMemo, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";

interface ScrollRevealProps {
  children: string;
  className?: string;
  /** Starting opacity per word (reference: 0.1–0.18). */
  baseOpacity?: number;
  /** Blur strength in px (reference: 3–4px). */
  blurStrength?: number;
  /** Starting rotation in deg (reference: 2–3deg). */
  baseRotation?: number;
  /** Whether the section container also fades/rotates in. */
  enableContainerRotation?: boolean;
}

/**
 * Progressive scroll reveal (adapted from the reference ScrollReveal):
 * per-word opacity 0.15 → 1, blur 4px → 0, small rotation → 0, scrubbed to
 * scroll position. At half progress roughly half the words feel resolved.
 *
 * Cleanup is strictly scoped: only this component's own tweens/triggers are
 * reverted (never `ScrollTrigger.getAll()`).
 */
export default function ScrollReveal({
  children,
  className = "",
  baseOpacity = 0.15,
  blurStrength = 4,
  baseRotation = 2,
  enableContainerRotation = true,
}: ScrollRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const words = useMemo(() => {
    const parts = children.split(/(\s+)/);
    return parts.map((part, i) =>
      part.match(/^\s+$/) ? (
        <span key={i}> </span>
      ) : (
        <span key={i} className="sr-word">
          {part}
        </span>
      ),
    );
  }, [children]);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || reduced) return;

      const wordEls = Array.from(root.querySelectorAll<HTMLElement>(".sr-word"));
      if (!wordEls.length) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 85%",
          end: "bottom 55%",
          scrub: true,
        },
      });

      tl.fromTo(
        wordEls,
        { opacity: baseOpacity, filter: `blur(${blurStrength}px)` },
        { opacity: 1, filter: "blur(0px)", stagger: 0.06, ease: "none" },
      );

      if (enableContainerRotation) {
        tl.fromTo(
          root,
          { rotate: baseRotation, transformOrigin: "0% 50%" },
          { rotate: 0, ease: "none" },
          0,
        );
      }
    },
    { scope: rootRef, dependencies: [reduced, baseOpacity, blurStrength, baseRotation, enableContainerRotation] },
  );

  return (
    <div ref={rootRef} className={className}>
      {words}
    </div>
  );
}
