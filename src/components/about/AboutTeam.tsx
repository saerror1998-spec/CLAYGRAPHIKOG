"use client";

import { useCallback, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  /** Placeholder — replace with real photo URL later. */
  photo: string;
}

const TEAM: TeamMember[] = [
  {
    name: "TEAM MEMBER 01",
    role: "Creative Director",
    bio: "Leading visual strategy and brand systems with over a decade of experience across identity, web and editorial design.",
    photo: "",
  },
  {
    name: "TEAM MEMBER 02",
    role: "Lead Developer",
    bio: "Building fast, accessible digital experiences with modern web technologies and a focus on performance.",
    photo: "",
  },
  {
    name: "TEAM MEMBER 03",
    role: "Brand Strategist",
    bio: "Shaping positioning, messaging and brand architecture so businesses communicate with clarity and consistency.",
    photo: "",
  },
  {
    name: "TEAM MEMBER 04",
    role: "Content Director",
    bio: "Crafting editorial systems and content frameworks that keep every touchpoint recognisable and on-brand.",
    photo: "",
  },
];

/* ------------------------------------------------------------------ */
/*  Single team card                                                   */
/*                                                                     */
/*  Architecture:                                                      */
/*    OUTER  div  → perspective + tilt (rotateX / rotateY)             */
/*    INNER  div  → flip only  (rotateY 0 | 180)                      */
/*    FRONT  div  → backface-visibility: hidden                        */
/*    BACK   div  → backface-visibility: hidden, rotateY(180deg)      */
/*                                                                     */
/*  Tilt and flip never share a DOM element, so they cannot conflict.  */
/* ------------------------------------------------------------------ */

function TeamCard({ member }: { member: TeamMember }) {
  /* refs for the two independent transform layers */
  const tiltRef = useRef<HTMLDivElement>(null); // outer — tilt
  const flipRef = useRef<HTMLDivElement>(null); // inner — flip

  const tiltX = useRef(0);
  const tiltY = useRef(0);
  const tiltRaf = useRef(0);
  const [flipped, setFlipped] = useState(false);
  const reduced = usePrefersReducedMotion();

  /* ---- pointer-driven tilt (outer wrapper only) ---- */
  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (reduced) return;
      const el = tiltRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      tiltX.current = ny * -8;
      tiltY.current = nx * 8;
      cancelAnimationFrame(tiltRaf.current);
      tiltRaf.current = requestAnimationFrame(() => {
        if (tiltRef.current) {
          tiltRef.current.style.transform =
            `perspective(800px) rotateX(${tiltX.current}deg) rotateY(${tiltY.current}deg) scale(1.03)`;
        }
      });
    },
    [reduced],
  );

  const resetTilt = useCallback(() => {
    cancelAnimationFrame(tiltRaf.current);
    if (!tiltRef.current) return;
    // Animate tilt back to zero — does NOT touch flipRef
    const start = { tx: tiltX.current, ty: tiltY.current, s: 1.03 };
    gsap.to(start, {
      tx: 0,
      ty: 0,
      s: 1,
      duration: 0.45,
      ease: "power3.out",
      overwrite: true,
      onUpdate: () => {
        if (tiltRef.current) {
          tiltRef.current.style.transform =
            `perspective(800px) rotateX(${start.tx}deg) rotateY(${start.ty}deg) scale(${start.s})`;
        }
      },
    });
  }, []);

  /* ---- flip toggle (click / tap) ---- */
  const toggleFlip = useCallback(() => {
    setFlipped((f) => !f);
  }, []);

  /* ---- animate flip (inner wrapper only) ---- */
  useGSAP(
    () => {
      const flipEl = flipRef.current;
      if (!flipEl) return;
      if (reduced) {
        flipEl.style.transform = flipped
          ? "rotateY(180deg)"
          : "rotateY(0deg)";
        return;
      }
      gsap.to(flipEl, {
        rotateY: flipped ? 180 : 0,
        duration: 0.6,
        ease: "power3.inOut",
      });
    },
    { scope: tiltRef, dependencies: [flipped, reduced] },
  );

  /* ---- initials fallback ---- */
  const initials = member.name
    .replace(/TEAM MEMBER \d+/, (m) => m.slice(-2))
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <div
      ref={tiltRef}
      className="group relative h-[340px] w-full cursor-pointer select-none rounded-2xl border border-white/[0.08] bg-charcoal shadow-lg shadow-black/20 transition-[box-shadow] duration-300 group-hover:shadow-xl group-hover:shadow-black/30"
      style={{
        perspective: "800px",
        transformStyle: "preserve-3d",
        transform: "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)",
      }}
      onPointerMove={onPointerMove}
      onPointerLeave={resetTilt}
      onClick={toggleFlip}
      role="button"
      aria-label={`${member.name} — tap to ${flipped ? "show front" : "read bio"}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleFlip();
        }
      }}
    >
      {/* INNER FLIP WRAPPER — only owns rotateY for the flip */}
      <div
        ref={flipRef}
        className="relative h-full w-full"
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateY(0deg)",
        }}
      >
        {/* FRONT FACE */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl p-6"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Photo placeholder */}
          <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.04]">
            {member.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={member.photo}
                alt={member.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl font-semibold tracking-tight text-white/20">
                {initials}
              </span>
            )}
          </div>
          <h3 className="text-center text-lg font-medium uppercase tracking-tight text-offwhite">
            {member.name}
          </h3>
          <p className="mt-1 text-center text-sm text-lime">{member.role}</p>
          <p className="mt-4 text-center text-xs leading-relaxed text-softgray/60">
            Tap to read more
          </p>
        </div>

        {/* BACK FACE */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <p className="text-center text-xs uppercase tracking-[0.14em] text-lime/70">
            {member.role}
          </p>
          <h3 className="mt-3 text-center text-base font-medium uppercase tracking-tight text-offwhite">
            {member.name}
          </h3>
          <p className="mt-4 text-center text-sm leading-relaxed text-softgray">
            {member.bio}
          </p>
          <p className="mt-5 text-[10px] uppercase tracking-[0.12em] text-white/20">
            Tap to flip back
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export default function AboutTeam() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced || !sectionRef.current) return;

      const label = sectionRef.current.querySelector("[data-team-label]");
      const heading = sectionRef.current.querySelector("[data-team-heading]");
      const support = sectionRef.current.querySelector("[data-team-support]");
      const cards = sectionRef.current.querySelectorAll("[data-team-card]");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });

      tl.fromTo(
        label,
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
        0,
      )
        .fromTo(
          heading,
          { yPercent: 105, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.7, ease: "power4.out" },
          0.1,
        )
        .fromTo(
          support,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
          0.35,
        )
        .fromTo(
          cards,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.08,
          },
          0.3,
        );
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={sectionRef}
      className="px-6 pb-20 pt-12 sm:px-8 lg:px-10 lg:pb-28 lg:pt-16"
    >
      {/* Label */}
      <p data-team-label className="label text-offwhite/50">
        01 / TEAM
      </p>

      {/* Heading */}
      <h2
        data-team-heading
        className="mt-6 max-w-2xl text-[clamp(1.7rem,3.6vw,2.8rem)] font-medium uppercase leading-[1.05] tracking-[-0.02em] text-offwhite"
      >
        MEET THE
        <span className="block text-lime">TEAM.</span>
      </h2>

      {/* Supporting copy */}
      <p
        data-team-support
        className="mt-5 max-w-lg text-base leading-relaxed text-softgray sm:text-lg"
      >
        A small, focused team shaping strategy, design, and execution with
        clarity.
      </p>

      {/* Cards grid */}
      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {TEAM.map((member, i) => (
          <div key={member.name} data-team-card>
            <TeamCard member={member} />
          </div>
        ))}
      </div>
    </section>
  );
}
