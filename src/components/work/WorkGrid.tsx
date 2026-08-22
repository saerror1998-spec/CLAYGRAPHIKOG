"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  projects,
  type ProjectCategory,
  type Project,
} from "@/data/projects";
import MediaReveal from "@/components/motion/MediaReveal";
import { gsap } from "@/lib/gsap";

const FILTERS: Array<{ label: string; value: ProjectCategory | "ALL" }> = [
  { label: "ALL", value: "ALL" },
  { label: "BRANDING", value: "Branding" },
  { label: "WEB", value: "Web" },
  { label: "SOCIAL / DIGITAL", value: "Social / Digital" },
];

function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <article className={`group ${index % 2 === 1 ? "md:mt-20" : ""}`}>
      <Link href={`/work/${project.slug}`} className="block">
        <MediaReveal className="aspect-[4/5] rounded-xl">
          <Image
            src={project.image}
            alt={project.imageAlt}
            width={1200}
            height={1500}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
          />
        </MediaReveal>
        <div className="mt-6 flex items-start justify-between gap-6">
          <div>
            <h2 className="text-2xl font-medium tracking-tight text-offwhite transition-colors duration-300 group-hover:text-lime sm:text-3xl">
              {project.title}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <p className="label">{project.category}</p>
              {project.status === "concept" ? (
                <span className="label border border-white/12 px-2 py-0.5 text-offwhite/50">
                  STUDIO CONCEPT
                </span>
              ) : null}
            </div>
          </div>
          <p className="label mt-1">{project.year}</p>
        </div>
      </Link>
    </article>
  );
}

/**
 * Work index: category filter with a fast, smooth crossfade (no dashboard
 * filtering UI). Transition is a short GSAP fade — not a per-frame loop.
 */
export default function WorkGrid() {
  const [filter, setFilter] = useState<ProjectCategory | "ALL">("ALL");
  const gridRef = useRef<HTMLDivElement>(null);
  const transitioningRef = useRef(false);

  const allFiltered =
    filter === "ALL" ? projects : projects.filter((p) => p.category === filter);

  const filteredClients = allFiltered.filter((p) => p.status === "client");
  const filteredConcepts = allFiltered.filter((p) => p.status === "concept");

  useEffect(() => {
    if (transitioningRef.current) return;
    transitioningRef.current = true;
    const grid = gridRef.current;
    if (!grid) {
      transitioningRef.current = false;
      return;
    }
    gsap.to(grid, {
      opacity: 0,
      y: 10,
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => {
        gsap.fromTo(
          grid,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.22, ease: "power2.out" },
        );
        transitioningRef.current = false;
      },
    });
  }, [filter]);

  return (
    <div className="px-6 pb-24 sm:px-8 lg:px-10 lg:pb-32">
      {/* Filter bar */}
      <div className="no-scrollbar mb-12 flex gap-2 overflow-x-auto lg:mb-16">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            aria-pressed={filter === f.value}
            className={`cursor-pointer whitespace-nowrap px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-300 ${
              filter === f.value
                ? "bg-lime text-carbon"
                : "border border-white/12 text-softgray hover:border-lime/60 hover:text-offwhite"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div ref={gridRef}>
        {/* ── CLIENT WORK ── */}
        {filteredClients.length > 0 && (
          <>
            <p className="label mb-8 text-lime">CLIENT WORK</p>
            <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-10 lg:gap-14">
              {filteredClients.map((project, i) => (
                <ProjectCard key={project.slug} project={project} index={i} />
              ))}
            </div>
          </>
        )}

        {/* ── STUDIO CONCEPT ── */}
        {filteredConcepts.length > 0 && (
          <div className={filteredClients.length > 0 ? "mt-20" : ""}>
            <p className="label mb-8 text-offwhite/50">STUDIO CONCEPT</p>
            <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-10 lg:gap-14">
              {filteredConcepts.map((project, i) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  index={filteredClients.length + i}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
