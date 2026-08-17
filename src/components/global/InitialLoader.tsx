"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";

/**
 * Very short premium entry sequence (~1.3s, max 1.6s):
 * Carbon Black screen → official mark appears → thin lime line sweeps →
 * surface opens upward → hero begins. Runs once per full page load only
 * (never replayed on client-side route changes).
 */
export default function InitialLoader({ onDone }: { onDone: () => void }) {
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || reduced) {
        // Reduced motion: skip the sequence, hide the overlay and reveal immediately.
        if (root) gsap.set(root, { display: "none" });
        doneRef.current();
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(root, { display: "none" });
        },
      });

      tl.fromTo(
        "[data-loader-mark]",
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
        0,
      )
        .fromTo(
          "[data-loader-line]",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.5, ease: "power4.inOut" },
          0.45,
        )
        .add(() => doneRef.current(), 1.0)
        .to(root, { yPercent: -100, duration: 0.7, ease: "power4.inOut" }, 1.05);

      return () => {
        tl.kill();
      };
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-carbon"
      aria-hidden="true"
    >
      <div
        data-loader-mark
        className="flex flex-col items-center gap-8 px-6"
      >
        <Image
          src="/brand/clay-graphik-logo.png"
          alt=""
          width={220}
          height={60}
          className="h-8 w-auto sm:h-10"
        />
        <div className="h-px w-40 overflow-hidden bg-white/10">
          <div data-loader-line className="h-full w-full origin-left bg-lime" />
        </div>
      </div>
    </div>
  );
}
