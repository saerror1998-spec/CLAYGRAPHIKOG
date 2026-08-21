"use client";

import { useCallback, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface TeamMember {
  name: string;
  role: string;
  image: string;
  alt: string;
}

const TEAM: TeamMember[] = [
  {
    name: "TEAM MEMBER 01",
    role: "Creative Director",
    image: "/images/team/team-member-01.jpg",
    alt: "Creative Director — Clay Graphik",
  },
  {
    name: "TEAM MEMBER 02",
    role: "Lead Developer",
    image: "/images/team/team-member-02.jpg",
    alt: "Lead Developer — Clay Graphik",
  },
  {
    name: "TEAM MEMBER 03",
    role: "Brand Strategist",
    image: "/images/team/team-member-03.jpg",
    alt: "Brand Strategist — Clay Graphik",
  },
  {
    name: "TEAM MEMBER 04",
    role: "Content Director",
    image: "/images/team/team-member-04.jpg",
    alt: "Content Director — Clay Graphik",
  },
];

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const ROTATE_AMPLITUDE = 10; // degrees
const HOVER_SCALE = 1.04;
const RETURN_DURATION = 0.55;

/* ------------------------------------------------------------------ */
/*  Single team card — tilted card only, no flip                        */
/* ------------------------------------------------------------------ */

function TeamCard({ member }: { member: TeamMember }) {
  const cardRef = useRef<HTMLDivElement>(null);

  /* GSAP quickTo targets — no React state updates on pointer move */
  const qRotateX = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const qRotateY = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const qScale = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  /* Stable RAF so we can cancel orphan frames */
  const tiltRaf = useRef(0);

  /* ---- set up quickTo once ---- */
  useGSAP(
    () => {
      const el = cardRef.current;
      if (!el) return;
      qRotateX.current = gsap.quickTo(el, "rotateX", {
        duration: RETURN_DURATION,
        ease: "power3.out",
      });
      qRotateY.current = gsap.quickTo(el, "rotateY", {
        duration: RETURN_DURATION,
        ease: "power3.out",
      });
      qScale.current = gsap.quickTo(el, "scale", {
        duration: RETURN_DURATION,
        ease: "power3.out",
      });
    },
    { scope: cardRef },
  );

  /* ---- pointer-driven tilt ---- */
  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 → 1
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1; // -1 → 1
    cancelAnimationFrame(tiltRaf.current);
    tiltRaf.current = requestAnimationFrame(() => {
      qRotateX.current?.(-ny * ROTATE_AMPLITUDE);
      qRotateY.current?.(nx * ROTATE_AMPLITUDE);
      qScale.current?.(HOVER_SCALE);
    });
  }, []);

  /* ---- pointer enter ---- */
  const onPointerEnter = useCallback(() => {
    qScale.current?.(HOVER_SCALE);
  }, []);

  /* ---- pointer leave — return to neutral ---- */
  const onPointerLeave = useCallback(() => {
    cancelAnimationFrame(tiltRaf.current);
    qRotateX.current?.(0);
    qRotateY.current?.(0);
    qScale.current?.(1);
  }, []);

  return (
    <div
      ref={cardRef}
      className="team-tilt-card"
      style={{
        perspective: "800px",
        transformStyle: "preserve-3d",
        transform: "rotateX(0deg) rotateY(0deg) scale(1)",
        willChange: "transform",
      }}
      onPointerMove={onPointerMove}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={member.image}
        alt={member.alt}
        className="team-tilt-img"
        draggable={false}
      />
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
        {TEAM.map((member) => (
          <div key={member.name} data-team-card>
            <TeamCard member={member} />
          </div>
        ))}
      </div>
    </section>
  );
}
