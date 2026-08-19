"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { projects } from "@/data/projects";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";

const PROJECT_IMAGES: Record<string, string> = {
  "brand-book-system": "/images/home/home-project-branding.jpg",
  "web-platform-concept": "/images/home/home-project-web.jpg",
  "content-system-concept": "/images/home/home-project-digital.jpg",
};

/**
 * 03 / PROJECTS — real scroll-stack with position:sticky + GSAP scale.
 * Cards pin at staggered top offsets, each new card slides over the previous.
 * GSAP controls scale + opacity of pinned cards for depth.
 */
export default function HomeProjects() {
  const rootRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      const container = containerRef.current;
      if (!root || !container) return;

      const reducedNow =
        reduced ||
        (typeof window !== "undefined" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches);

      // --- Section entrance: masked heading ---
      const headingLines = Array.from(
        root.querySelectorAll<HTMLElement>("[data-proj-heading-line]"),
      );
      const sectionLabel = root.querySelector("[data-proj-label]");

      if (!reducedNow) {
        const entranceTl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 85%",
            end: "top 50%",
            scrub: 0.6,
          },
        });

        if (sectionLabel) {
          gsap.set(sectionLabel, { opacity: 0, y: 14 });
          entranceTl.to(sectionLabel, { opacity: 1, y: 0, duration: 0.25, ease: "none" }, 0);
        }
        headingLines.forEach((line, i) => {
          gsap.set(line, { yPercent: 105 });
          entranceTl.to(line, { yPercent: 0, duration: 0.4, ease: "none" }, 0.05 + i * 0.1);
        });
      }

      // --- Scroll stack (skip on reduced motion or mobile) ---
      if (reducedNow || window.innerWidth < 1024) return;

      const cards = Array.from(container.querySelectorAll<HTMLElement>("[data-proj-card]"));
      if (cards.length < 2) return;

      const CARD_COUNT = cards.length;
      const STACK_OFFSET = 8; // px between stacked cards

      // Each card gets position:sticky at staggered top offsets
      // Card 0: top 80px, Card 1: top 88px, Card 2: top 96px
      cards.forEach((card, i) => {
        card.style.position = "sticky";
        card.style.top = `${80 + i * STACK_OFFSET}px`;
        card.style.zIndex = `${i + 1}`;
      });

      // GSAP controls scale + subtle shadow as each card enters the stack
      cards.forEach((card, i) => {
        if (i === 0) {
          // First card: starts at full scale, scales down as next card arrives
          gsap.fromTo(
            card,
            { scale: 1 },
            {
              scale: 1 - (CARD_COUNT - 1) * 0.035,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top top",
                endTrigger: container,
                end: "bottom bottom",
                scrub: 0.8,
              },
            },
          );
        } else {
          // Subsequent cards: arrive at full scale, previous ones scale behind
          const cardsBefore = i; // how many cards are behind this one
          const prevCardScaleTarget = 1 - (cardsBefore) * 0.035;

          // Scale previous cards as this card enters
          for (let j = 0; j < i; j++) {
            const prevCard = cards[j];
            const prevTargetScale = Math.max(1 - (i - j) * 0.035, 0.93);

            gsap.to(prevCard, {
              scale: prevTargetScale,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top 80%",
                end: "top top",
                scrub: 0.6,
              },
            });
          }
        }
      });

      // Image parallax inside each card
      cards.forEach((card) => {
        const img = card.querySelector<HTMLElement>("[data-proj-img]");
        if (!img) return;

        gsap.fromTo(
          img,
          { scale: 1.07, yPercent: -3 },
          {
            scale: 1,
            yPercent: 3,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          },
        );
      });
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  return (
    <section
      id="work"
      ref={rootRef}
      className="bg-carbon px-6 py-24 sm:px-8 lg:px-10 lg:py-36"
    >
      {/* Section header */}
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6 lg:mb-20">
        <div>
          <p data-proj-label className="font-mono text-[11px] uppercase tracking-[0.18em] text-offwhite/50">
            03 / SELECTED WORK
          </p>
          <div className="mt-6">
            <div className="overflow-hidden">
              <h2
                data-proj-heading-line
                className="text-[clamp(1.9rem,4.2vw,3.4rem)] font-semibold uppercase leading-[1.04] tracking-[-0.02em] text-offwhite"
              >
                WORK BUILT
              </h2>
            </div>
            <div className="overflow-hidden">
              <h2
                data-proj-heading-line
                className="text-[clamp(1.9rem,4.2vw,3.4rem)] font-semibold uppercase leading-[1.04] tracking-[-0.02em] text-offwhite"
              >
                TO BE USED,
              </h2>
            </div>
            <div className="overflow-hidden">
              <h2
                data-proj-heading-line
                className="text-[clamp(1.9rem,4.2vw,3.4rem)] font-semibold uppercase leading-[1.04] tracking-[-0.02em] text-lime"
              >
                NOT JUST SEEN.
              </h2>
            </div>
          </div>
        </div>
        <Link
          href="/work"
          className="group flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-offwhite transition-colors hover:text-lime"
        >
          VIEW ALL WORK
          <ArrowUpRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      {/* Stacked cards — position:sticky for real stacking */}
      <div
        ref={containerRef}
        className="relative mx-auto max-w-5xl"
        style={{ perspective: "1200px" }}
      >
        {projects.map((project, i) => (
          <div
            key={project.slug}
            data-proj-card
            className={`relative ${i > 0 ? "-mt-4" : ""}`}
            style={{
              willChange: "transform",
              transformOrigin: "top center",
            }}
          >
            <Link
              href={`/work/${project.slug}`}
              className="group block overflow-hidden rounded-2xl bg-[#0B0B0B] ring-1 ring-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Content */}
                <div className="flex flex-col justify-between p-8 lg:p-12">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-lime">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-offwhite/40">
                        {project.category}
                      </span>
                    </div>
                    <h3 className="mt-8 text-[clamp(1.6rem,3.2vw,2.8rem)] font-semibold uppercase tracking-tight text-offwhite transition-colors duration-300 group-hover:text-lime">
                      {project.title}
                    </h3>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-softgray/70">
                      {project.summary}
                    </p>
                  </div>
                  <div className="mt-10 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-offwhite transition-colors group-hover:text-lime">
                    VIEW CASE STUDY
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </div>
                </div>
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden md:aspect-auto">
                  <div
                    data-proj-img
                    className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                  >
                    <Image
                      src={PROJECT_IMAGES[project.slug] || project.image}
                      alt={project.imageAlt}
                      width={1200}
                      height={900}
                      className="h-full w-full object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
