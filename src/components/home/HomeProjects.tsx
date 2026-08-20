"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { projects } from "@/data/projects";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";
import ContainerScroll from "@/components/ui/ContainerScrollAnimation";
import BackgroundBeamsWithCollision from "@/components/ui/BackgroundBeamsWithCollision";

const PROJECT_IMAGES: Record<string, string> = {
  "brand-book-system": "/images/home/home-project-branding.jpg",
  "web-platform-concept": "/images/home/home-project-web.jpg",
  "content-system-concept": "/images/home/home-project-digital.jpg",
};

/**
 * 04 / SELECTED WORK — Container Scroll Animation
 * Each project gets its own perspective-to-flat scroll reveal.
 * No stacking — independent 3D card transitions per project.
 */
export default function HomeProjects() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

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
          entranceTl.to(
            sectionLabel,
            { opacity: 1, y: 0, duration: 0.25, ease: "none" },
            0,
          );
        }
        headingLines.forEach((line, i) => {
          gsap.set(line, { yPercent: 105 });
          entranceTl.to(
            line,
            { yPercent: 0, duration: 0.4, ease: "none" },
            0.05 + i * 0.1,
          );
        });
      }
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  return (
    <section
      id="work"
      ref={rootRef}
      className="relative bg-carbon px-6 py-24 sm:px-8 lg:px-10 lg:py-36"
    >
      <BackgroundBeamsWithCollision />
      <div className="relative z-10">
      {/* Section header */}
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6 lg:mb-20">
        <div>
          <p
            data-proj-label
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-offwhite/50"
          >
            04 / SELECTED WORK
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

      {/* Container Scroll projects */}
      <div className="mx-auto max-w-5xl">
        {projects.map((project, i) => (
          <div key={project.slug} className={i < projects.length - 1 ? "mb-8 md:mb-16" : ""}>
          <ContainerScroll
            titleComponent={
              <Link
                href={`/work/${project.slug}`}
                className="group block text-center"
              >
                <div className="flex items-center justify-center gap-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-lime">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-offwhite/40">
                    {project.category}
                  </span>
                </div>
                <h3 className="mt-4 text-[clamp(1.6rem,3.2vw,2.8rem)] font-semibold uppercase tracking-tight text-offwhite transition-colors duration-300 group-hover:text-lime">
                  {project.title}
                </h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-softgray/70">
                  {project.summary}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-offwhite transition-colors group-hover:text-lime">
                  VIEW CASE STUDY
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </div>
              </Link>
            }
          >
            <div className="relative aspect-video w-full">
              <Image
                src={PROJECT_IMAGES[project.slug] || project.image}
                alt={project.imageAlt}
                width={1200}
                height={675}
                className="h-full w-full object-cover"
                sizes="(max-width: 768px) 100vw, 80vw"
              />
            </div>
          </ContainerScroll>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
