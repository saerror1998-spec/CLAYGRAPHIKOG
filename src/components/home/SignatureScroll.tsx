"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";

const STEPS = [
  {
    word: "IDEA",
    copy: "Strategy becomes identity.",
    path: "M80 150 H380",
    nodeX: 380,
    nodeY: 150,
  },
  {
    word: "FORM",
    copy: "Identity becomes experience.",
    path: "M460 110 H760",
    nodeX: 760,
    nodeY: 110,
  },
  {
    word: "DIGITAL",
    copy: "Experience creates impact.",
    path: "M460 190 H760",
    nodeX: 760,
    nodeY: 190,
  },
  {
    word: "IMPACT",
    copy: "Built to move the business forward.",
    path: "M840 110 H1120",
    nodeX: 1120,
    nodeY: 110,
  },
];

/**
 * 03 / FROM IDEA TO IMPACT — the signature Nvg8-inspired scroll experience.
 *
 * Desktop: one pinned scene scrubbed by a single timeline. The stage word
 * crossfades IDEA → FORM → DIGITAL → IMPACT while four SVG paths draw
 * sequentially (strokeDasharray/dashoffset via getTotalLength). Reversing
 * the scroll naturally reverses the sequence.
 *
 * Mobile: a simplified vertical sequence — same words, same story, no pin.
 * Reduced motion: the static vertical sequence, fully visible.
 */
export default function SignatureScroll() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || reduced) return;

      const isDesktop = window.innerWidth >= 1024;
      if (!isDesktop) {
        // Mobile: per-block scrubbed reveals with short path draws.
        const blocks = Array.from(root.querySelectorAll<HTMLElement>("[data-mobile-block]"));
        blocks.forEach((block) => {
          const word = block.querySelector("[data-mobile-word]");
          const copy = block.querySelector("[data-mobile-copy]");
          const path = block.querySelector<SVGPathElement>("[data-mobile-path]");
          if (!word || !copy || !path) return;
          const length = path.getTotalLength();
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
          gsap
            .timeline({
              scrollTrigger: {
                trigger: block,
                start: "top 80%",
                end: "top 45%",
                scrub: true,
              },
            })
            .fromTo(
              word,
              { yPercent: 40, opacity: 0.2 },
              { yPercent: 0, opacity: 1, ease: "none" },
              0,
            )
            .fromTo(
              copy,
              { y: 16, opacity: 0 },
              { y: 0, opacity: 1, ease: "none" },
              0,
            )
            .to(path, { strokeDashoffset: 0, ease: "none" }, 0);
        });
        return;
      }

      // ---- Desktop pinned signature ----
      const words = Array.from(root.querySelectorAll<HTMLElement>("[data-sig-word]"));
      const copies = Array.from(root.querySelectorAll<HTMLElement>("[data-sig-copy]"));
      const paths = Array.from(root.querySelectorAll<SVGPathElement>("[data-sig-path]"));
      const nodes = Array.from(root.querySelectorAll<SVGElement>("[data-sig-node]"));

      words.forEach((w, i) => {
        if (i === 0) {
          gsap.set(w, { opacity: 1, yPercent: 0 });
        } else {
          gsap.set(w, { opacity: 0, yPercent: 30 });
        }
      });
      copies.forEach((c, i) => {
        gsap.set(c, { opacity: i === 0 ? 1 : 0 });
      });
      paths.forEach((p) => {
        const length = p.getTotalLength();
        gsap.set(p, { strokeDasharray: length, strokeDashoffset: length });
      });
      gsap.set(nodes, { scale: 0, opacity: 0 });

      const tl = gsap.timeline();

      // Step 0 — IDEA
      tl.to(paths[0], { strokeDashoffset: 0, duration: 0.2, ease: "power2.out" }, 0.03)
        .to(nodes[0], { scale: 1, opacity: 1, duration: 0.12, ease: "back.out(2)" }, 0.2)
        .to(words[0], { opacity: 0, yPercent: -18, duration: 0.13, ease: "power2.in" }, 0.24)
        .to(copies[0], { opacity: 0, duration: 0.1 }, 0.24)
        .to(words[1], { opacity: 1, yPercent: 0, duration: 0.13, ease: "power2.out" }, 0.28)
        .to(copies[1], { opacity: 1, duration: 0.1 }, 0.28)
        // Step 1 — FORM
        .to(paths[1], { strokeDashoffset: 0, duration: 0.18, ease: "power2.out" }, 0.36)
        .to(nodes[1], { scale: 1, opacity: 1, duration: 0.12, ease: "back.out(2)" }, 0.52)
        .to(words[1], { opacity: 0, yPercent: -18, duration: 0.12, ease: "power2.in" }, 0.56)
        .to(copies[1], { opacity: 0, duration: 0.1 }, 0.56)
        .to(words[2], { opacity: 1, yPercent: 0, duration: 0.12, ease: "power2.out" }, 0.6)
        .to(copies[2], { opacity: 1, duration: 0.1 }, 0.6)
        // Step 2 — DIGITAL
        .to(paths[2], { strokeDashoffset: 0, duration: 0.18, ease: "power2.out" }, 0.68)
        .to(nodes[2], { scale: 1, opacity: 1, duration: 0.12, ease: "back.out(2)" }, 0.84)
        .to(words[2], { opacity: 0, yPercent: -18, duration: 0.12, ease: "power2.in" }, 0.88)
        .to(copies[2], { opacity: 0, duration: 0.1 }, 0.88)
        .to(words[3], { opacity: 1, yPercent: 0, duration: 0.12, ease: "power2.out" }, 0.92)
        .to(copies[3], { opacity: 1, duration: 0.1 }, 0.92)
        // Step 3 — IMPACT + final path
        .to(paths[3], { strokeDashoffset: 0, duration: 0.18, ease: "power2.out" }, 1.0)
        .to(nodes[3], { scale: 1, opacity: 1, duration: 0.12, ease: "back.out(2)" }, 1.16);

      ScrollTrigger.create({
        animation: tl,
        trigger: root,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      });
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  // ---- Static / mobile layout ----
  if (reduced) {
    return (
      <section
        ref={rootRef}
        className="bg-[#F4F4EE] px-6 py-20 text-[#050505] sm:px-8 lg:px-10"
        aria-label="From idea to impact"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#050505]/50">
          03 / FROM IDEA TO IMPACT
        </p>
        <ol className="mt-10">
          {STEPS.map((s, i) => (
            <li key={s.word} className="border-t border-[#050505]/15 py-10">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#050505]/50">
                0{i + 1}
              </p>
              <h3
                className={`mt-4 text-4xl font-semibold uppercase tracking-tight sm:text-5xl ${
                  s.word === "IMPACT" ? "text-[#CCFF00]" : ""
                }`}
              >
                {s.word}
              </h3>
              <p className="mt-3 max-w-md text-[#050505]/60">{s.copy}</p>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  return (
    <section
      ref={rootRef}
      className="h-[100svh] overflow-hidden bg-[#F4F4EE] text-[#050505]"
      aria-label="From idea to impact"
    >
      {/* Desktop pinned scene */}
      <div className="hidden h-full flex-col items-center justify-center px-6 text-center lg:flex">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#050505]/50">
          03 / FROM IDEA TO IMPACT
        </p>

        <div className="relative mt-6 h-[1.25em] w-full overflow-hidden">
          {STEPS.map((s) => (
            <span
              key={s.word}
              data-sig-word
              aria-hidden={s.word !== "IDEA"}
              className="absolute left-1/2 top-0 block -translate-x-1/2 text-[clamp(3.2rem,9vw,7rem)] font-semibold uppercase leading-[1.25] tracking-[-0.03em]"
            >
              {s.word}
            </span>
          ))}
          <span className="sr-only">IDEA, FORM, DIGITAL, IMPACT</span>
        </div>

        <div className="relative mt-6 h-7 w-full max-w-md">
          {STEPS.map((s) => (
            <p
              key={s.copy}
              data-sig-copy
              aria-hidden={s.word !== "IDEA"}
              className="absolute inset-0 text-base text-[#050505]/60"
            >
              {s.copy}
            </p>
          ))}
        </div>

        <svg
          className="absolute bottom-[10%] left-0 h-[220px] w-full"
          viewBox="0 0 1200 240"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Inactive track */}
          <path
            d="M80 150 H1120"
            stroke="#050505"
            strokeOpacity="0.18"
            strokeWidth="2"
          />
          {STEPS.map((s, i) => (
            <g key={s.word}>
              <path
                data-sig-path
                d={s.path}
                stroke={i === STEPS.length - 1 ? "#CCFF00" : "#050505"}
                strokeOpacity={i === STEPS.length - 1 ? 1 : 0.85}
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle
                data-sig-node
                cx={s.nodeX}
                cy={s.nodeY}
                r="7"
                fill={i === STEPS.length - 1 ? "#CCFF00" : "#050505"}
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Mobile vertical sequence */}
      <div className="px-6 py-20 lg:hidden">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#050505]/50">
          03 / FROM IDEA TO IMPACT
        </p>
        <ol className="mt-6">
          {STEPS.map((s, i) => (
            <li key={s.word} data-mobile-block className="border-t border-[#050505]/15 py-12">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#050505]/50">
                0{i + 1}
              </p>
              <h3
                data-mobile-word
                className={`mt-4 text-4xl font-semibold uppercase tracking-tight sm:text-5xl ${
                  s.word === "IMPACT" ? "text-[#CCFF00]" : "text-[#050505]"
                }`}
              >
                {s.word}
              </h3>
              <p data-mobile-copy className="mt-3 max-w-md text-[#050505]/60">
                {s.copy}
              </p>
              <svg
                className="mt-6 h-16 w-full"
                viewBox="0 0 1200 240"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  data-mobile-path
                  d={s.path}
                  stroke={s.word === "IMPACT" ? "#CCFF00" : "#050505"}
                  strokeOpacity={s.word === "IMPACT" ? 1 : 0.7}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
