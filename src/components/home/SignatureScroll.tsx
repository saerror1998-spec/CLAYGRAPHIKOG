"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";

/**
 * Phase words — one dominant editorial word per step. The words must NEVER be
 * clipped: the mask container is sized in `em` relative to its OWN font-size
 * (which is the large clamp size), so `h-[1em]` wraps the actual glyphs with
 * headroom. GSAP animates only yPercent + opacity of the word itself.
 */
const STEPS = [
  {
    word: "IDEA",
    copy: "Strategy becomes identity.",
    nodeX: 150,
    nodeY: 210,
    lime: false,
  },
  {
    word: "FORM",
    copy: "Identity becomes experience.",
    nodeX: 430,
    nodeY: 105,
    lime: false,
  },
  {
    word: "DIGITAL",
    copy: "Experience creates impact.",
    nodeX: 770,
    nodeY: 305,
    lime: false,
  },
  {
    word: "IMPACT",
    copy: "Built to move the business forward.",
    nodeX: 1050,
    nodeY: 150,
    lime: true,
  },
];

/**
 * Expressive diagrammatic paths (Nvg8-style connected system, not progress
 * bars): thick rounded connective curves that grow left→right and end in a
 * lime flourish. Each step draws its own group of paths + reveals its node.
 */
const SVG_PATHS = [
  // Step 1 — IDEA: first sprout + small branch curl off the origin node
  ["M150 210 C 260 210, 310 150, 392 112", "M150 210 C 180 268, 238 262, 262 220"],
  // Step 2 — FORM: connector into the second node + closed rounded loop
  ["M392 112 L 430 105", "M430 105 C 482 105, 482 178, 430 178 C 378 178, 378 105, 430 105"],
  // Step 3 — DIGITAL: long diagonal sweep down-right + curl under the node
  ["M430 178 C 560 282, 640 305, 734 305", "M734 305 C 706 358, 646 360, 622 316"],
  // Step 4 — IMPACT: rising lime arc + flourish curl off the final node
  ["M770 305 C 900 305, 940 190, 1014 160", "M1014 160 C 1070 138, 1096 196, 1054 236"],
];

/**
 * 03 / FROM IDEA TO IMPACT — the signature Nvg8-inspired scroll experience.
 *
 * Desktop: one pinned scene scrubbed by a single timeline. The stage word
 * crossfades IDEA → FORM → DIGITAL → IMPACT while four SVG path groups draw
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
      // Read the LIVE preference too: during hydration the hook can briefly
      // report the server snapshot (false), and if the desktop pin path ran
      // even once it would leave a dead-scroll pin-spacer behind for
      // reduced-motion users.
      const reducedNow =
        reduced ||
        (typeof window !== "undefined" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches);
      if (!root || reducedNow) return;

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
      const pathGroups = Array.from(root.querySelectorAll<SVGGElement>("[data-sig-group]"));
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
      pathGroups.forEach((g) => {
        g.querySelectorAll<SVGPathElement>("path").forEach((p) => {
          const length = p.getTotalLength();
          gsap.set(p, { strokeDasharray: length, strokeDashoffset: length });
        });
      });
      gsap.set(nodes, { scale: 0, opacity: 0, transformOrigin: "50% 50%" });

      const tl = gsap.timeline();

      // Step 0 — IDEA: first path group draws, node pops in
      tl.to(pathGroups[0].querySelectorAll("path"), { strokeDashoffset: 0, duration: 0.2, ease: "power2.out" }, 0.03)
        .to(nodes[0], { scale: 1, opacity: 1, duration: 0.12, ease: "back.out(2)" }, 0.2)
        .to(words[0], { opacity: 0, yPercent: -12, duration: 0.13, ease: "power2.in" }, 0.24)
        .to(copies[0], { opacity: 0, duration: 0.1 }, 0.24)
        .to(words[1], { opacity: 1, yPercent: 0, duration: 0.13, ease: "power2.out" }, 0.28)
        .to(copies[1], { opacity: 1, duration: 0.1 }, 0.28)
        // Step 1 — FORM: second group draws + evolves
        .to(pathGroups[1].querySelectorAll("path"), { strokeDashoffset: 0, duration: 0.18, ease: "power2.out" }, 0.36)
        .to(nodes[1], { scale: 1, opacity: 1, duration: 0.12, ease: "back.out(2)" }, 0.52)
        .to(words[1], { opacity: 0, yPercent: -12, duration: 0.12, ease: "power2.in" }, 0.56)
        .to(copies[1], { opacity: 0, duration: 0.1 }, 0.56)
        .to(words[2], { opacity: 1, yPercent: 0, duration: 0.12, ease: "power2.out" }, 0.6)
        .to(copies[2], { opacity: 1, duration: 0.1 }, 0.6)
        // Step 2 — DIGITAL: third group draws
        .to(pathGroups[2].querySelectorAll("path"), { strokeDashoffset: 0, duration: 0.18, ease: "power2.out" }, 0.68)
        .to(nodes[2], { scale: 1, opacity: 1, duration: 0.12, ease: "back.out(2)" }, 0.84)
        .to(words[2], { opacity: 0, yPercent: -12, duration: 0.12, ease: "power2.in" }, 0.88)
        .to(copies[2], { opacity: 0, duration: 0.1 }, 0.88)
        .to(words[3], { opacity: 1, yPercent: 0, duration: 0.12, ease: "power2.out" }, 0.92)
        .to(copies[3], { opacity: 1, duration: 0.1 }, 0.92)
        // Step 3 — IMPACT: lime group completes the system
        .to(pathGroups[3].querySelectorAll("path"), { strokeDashoffset: 0, duration: 0.18, ease: "power2.out" }, 1.0)
        .to(nodes[3], { scale: 1, opacity: 1, duration: 0.12, ease: "back.out(2)" }, 1.16)
        // Brief completion hold, then clean unpin
        .to({}, { duration: 0.14 });

      ScrollTrigger.create({
        animation: tl,
        trigger: root,
        start: "top top",
        end: "+=200%",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      });
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  // ---- Static / reduced-motion layout (everything visible, no pin) ----
  if (reduced) {
    return (
      <section
        ref={rootRef}
        className="bg-[#F4F4EE] px-6 py-20 text-[#050505] sm:px-8 lg:px-10"
        aria-label="From idea to impact"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#050505]/50">
          01 / FROM IDEA TO IMPACT
        </p>
        <ol className="mt-10">
          {STEPS.map((s, i) => (
            <li
              key={s.word}
              className={`border-t border-[#050505]/15 ${
                i === STEPS.length - 1 ? "py-16 pb-24" : "py-12 min-h-[30vh]"
              } flex flex-col justify-center`}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#050505]/50">
                0{i + 1}
              </p>
              <h2
                className={`mt-4 text-4xl font-semibold uppercase tracking-tight sm:text-5xl ${
                  s.lime ? "text-[#CCFF00]" : "text-[#050505]"
                }`}
              >
                {s.word}
              </h2>
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
      className="bg-[#F4F4EE] text-[#050505] lg:h-[100svh] lg:overflow-hidden"
      aria-label="From idea to impact"
    >
      {/* Desktop pinned scene */}
      <div className="hidden h-full flex-col items-center justify-center px-6 text-center lg:flex">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#050505]/50">
          01 / FROM IDEA TO IMPACT
        </p>

        {/* Dominant phase word — font-size lives on the container so the
            mask height (`1em`) resolves against the real glyph size. */}
        <div
          className="relative mt-4 h-[1em] w-full overflow-hidden text-[clamp(5rem,10vw,10.625rem)] font-semibold uppercase leading-[0.9] tracking-[-0.03em]"
          aria-hidden="true"
        >
          {STEPS.map((s) => (
            <span
              key={s.word}
              data-sig-word
              className={`absolute left-0 top-0 block w-full text-center ${
                s.lime ? "text-[#CCFF00]" : "text-[#050505]"
              }`}
            >
              {s.word}
            </span>
          ))}
          <span className="sr-only">IDEA, FORM, DIGITAL, IMPACT</span>
        </div>

        <div className="relative mt-5 h-7 w-full max-w-md">
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
          className="absolute bottom-[8%] left-0 h-[240px] w-full"
          viewBox="0 0 1200 400"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {SVG_PATHS.map((group, gi) => (
            <g key={STEPS[gi].word} data-sig-group>
              {group.map((d, pi) => {
                const isLime = gi === STEPS.length - 1;
                return (
                  <path
                    key={pi}
                    data-sig-path
                    d={d}
                    stroke={isLime ? "#CCFF00" : "#050505"}
                    strokeOpacity={isLime ? 1 : 0.85}
                    strokeWidth={pi === 0 ? 5 : 3}
                    strokeLinecap="round"
                  />
                );
              })}
            </g>
          ))}
          {STEPS.map((s) => (
            <circle
              key={s.word}
              data-sig-node
              cx={s.nodeX}
              cy={s.nodeY}
              r="7"
              fill={s.lime ? "#CCFF00" : "#050505"}
            />
          ))}
        </svg>
      </div>

      {/* Mobile vertical sequence */}
      <div className="px-6 py-20 lg:hidden">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#050505]/50">
          01 / FROM IDEA TO IMPACT
        </p>
        <ol className="mt-6">
          {STEPS.map((s, i) => (
            <li key={s.word} data-mobile-block className={`border-t border-[#050505]/15 ${i === STEPS.length - 1 ? 'py-16 pb-24 min-h-[50vh]' : 'py-12 min-h-[30vh]'}`}>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#050505]/50">
                0{i + 1}
              </p>
              <h2
                data-mobile-word
                className={`mt-4 text-4xl font-semibold uppercase tracking-tight sm:text-5xl ${
                  s.lime ? "text-[#CCFF00]" : "text-[#050505]"
                }`}
              >
                {s.word}
              </h2>
              <p data-mobile-copy className="mt-3 max-w-md text-[#050505]/60">
                {s.copy}
              </p>
              <svg
                className="mt-6 h-20 w-full"
                viewBox="0 0 1200 400"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  data-mobile-path
                  d={SVG_PATHS[i][0]}
                  stroke={s.lime ? "#CCFF00" : "#050505"}
                  strokeOpacity={s.lime ? 1 : 0.7}
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
