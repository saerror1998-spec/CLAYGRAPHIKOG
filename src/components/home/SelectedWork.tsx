"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import MediaReveal from "@/components/motion/MediaReveal";
import SectionLabel from "./SectionLabel";

/**
 * 02 / SELECTED WORK — large editorial imagery, asymmetric composition,
 * clip-path media reveal on scroll, restrained hover (scale + arrow shift).
 */
export default function SelectedWork() {
  const featured = projects.slice(0, 2);

  return (
    <section id="work" className="border-t border-white/[0.06] px-6 py-24 sm:px-8 lg:px-10 lg:py-36">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6 lg:mb-20">
        <SectionLabel number="02" title="SELECTED WORK" />
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

      <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-10 lg:gap-14">
        {featured.map((project, i) => (
          <article key={project.slug} className={`group ${i % 2 === 1 ? "md:mt-20" : ""}`}>
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
                  <h3 className="text-2xl font-medium tracking-tight text-offwhite transition-colors duration-300 group-hover:text-lime sm:text-3xl">
                    {project.title}
                  </h3>
                  <p className="label mt-2">{project.category}</p>
                </div>
                <p className="label mt-1">{project.year}</p>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
