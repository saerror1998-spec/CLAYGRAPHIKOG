import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import DiaHeroTextReveal from "@/components/motion/DiaHeroTextReveal";
import HeroThreadsBackground from "@/components/motion/HeroThreadsBackground";

import { getNextProject, getProject, projects } from "@/data/projects";
import { ogDefaults, twitterDefaults } from "@/data/siteContent";
import MediaReveal from "@/components/motion/MediaReveal";
import { getService } from "@/data/services";

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Work" };

  const title = project.clientName
    ? `${project.clientName} Case Study`
    : `${project.title}`;
  const description = project.summary;

  return {
    title,
    description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      ...ogDefaults,
      title,
      description,
      url: `/work/${project.slug}`,
    },
    twitter: {
      ...twitterDefaults,
      title,
      description,
    },
  };
}

/** ── Concept project layout (original) ── */
function ConceptLayout({ project }: { project: NonNullable<ReturnType<typeof getProject>> }) {
  const SECTION_LABELS: Array<{ label: string; title: string }> = [
    { label: "OVERVIEW", title: "overview" },
    { label: "OBJECTIVE", title: "objective" },
    { label: "APPROACH", title: "approach" },
    { label: "SYSTEM", title: "system" },
  ];

  return (
    <>
      <div className="px-6 pt-10 sm:px-8 lg:px-10">
        <MediaReveal className="aspect-[4/5] rounded-2xl sm:aspect-[16/10]">
          <Image
            src={project.image}
            alt={project.imageAlt}
            width={1600}
            height={1000}
            priority
            className="h-full w-full object-cover"
          />
        </MediaReveal>
      </div>

      <div className="px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="label text-offwhite/50">SUMMARY</p>
            <p className="mt-4 max-w-sm text-lg leading-relaxed text-offwhite">
              {project.summary}
            </p>
          </div>

          <div className="space-y-14 lg:col-span-8">
            {SECTION_LABELS.map(({ label, title: key }) => (
              <div key={label} className="border-t border-white/[0.08] pt-8">
                <p className="label text-lime">{label}</p>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-softgray sm:text-lg">
                  {project[key as keyof typeof project] as string}
                </p>
              </div>
            ))}

            <div className="border-t border-white/[0.08] pt-8">
              <p className="label text-lime">DELIVERABLES</p>
              <ul className="mt-5 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
                {project.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-base text-softgray">
                    <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 bg-lime" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-white/[0.08] pt-8">
              <p className="label text-lime">OUTCOME</p>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-softgray sm:text-lg">
                {project.outcome}
              </p>
            </div>

            <div className="border-t border-white/[0.08] pt-8">
              <Link
                href={`/contact?reference=${encodeURIComponent(
                  `Similar project enquiry — ${project.title}`,
                )}`}
                className="group inline-flex items-center gap-3 bg-lime px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-carbon transition-colors duration-300 hover:bg-offwhite"
              >
                START A SIMILAR PROJECT
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/** ── Real client case-study layout ── */
function ClientCaseStudyLayout({ project }: { project: NonNullable<ReturnType<typeof getProject>> }) {
  const sections = project.caseStudy ?? [];
  const deliverables = project.caseStudyDeliverables ?? project.deliverables;
  const relatedServices = project.services
    .map((s) => {
      const slug = s.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
      return getService(slug);
    })
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <>
      {/* ── HERO IMAGE ── */}
      {project.heroImage && (
        <div className="px-6 pt-10 sm:px-8 lg:px-10">
          <MediaReveal className="aspect-[4/5] overflow-hidden rounded-2xl sm:aspect-[16/10]">
            <Image
              src={project.heroImage}
              alt={project.imageAlt}
              width={1600}
              height={1000}
              priority
              className="h-full w-full object-cover"
            />
          </MediaReveal>
        </div>
      )}

      {/* ── EDITORIAL SECTIONS ── */}
      <div className="px-6 pt-20 sm:px-8 lg:px-10 lg:pt-28">
        {sections.map((section, idx) => {
          const hasImage = Boolean(section.image);

          if (section.fullWidthImage && hasImage) {
            return (
              <div key={section.label} className="mb-20">
                <p className="label text-lime">{section.label}</p>
                <h2 className="mt-4 text-2xl font-medium tracking-tight text-offwhite sm:text-3xl">
                  {section.title}
                </h2>
                <p className="mt-6 max-w-3xl text-base leading-relaxed text-softgray sm:text-lg">
                  {section.body}
                </p>
                <div className="mt-10">
                  <MediaReveal className="overflow-hidden rounded-xl">
                    <Image
                      src={section.image!.src}
                      alt={section.image!.alt}
                      width={section.image!.width ?? 1600}
                      height={section.image!.height ?? 1000}
                      className="h-full w-full object-cover"
                    />
                  </MediaReveal>
                </div>
              </div>
            );
          }

          return (
            <div
              key={section.label}
              className={`border-t border-white/[0.08] pt-12 pb-16 ${
                idx < sections.length - 1 ? "mb-4" : "mb-16"
              }`}
            >
              <div
                className={`grid grid-cols-1 gap-10 ${
                  hasImage ? "lg:grid-cols-12" : ""
                }`}
              >
                <div className={hasImage ? "lg:col-span-5" : ""}>
                  <p className="label text-lime">{section.label}</p>
                  <h2 className="mt-4 text-2xl font-medium tracking-tight text-offwhite sm:text-3xl">
                    {section.title}
                  </h2>
                  <p className="mt-5 max-w-2xl text-base leading-relaxed text-softgray sm:text-lg">
                    {section.body}
                  </p>
                </div>

                {hasImage && (
                  <div className="lg:col-span-7">
                    <MediaReveal className="overflow-hidden rounded-xl">
                      <Image
                        src={section.image!.src}
                        alt={section.image!.alt}
                        width={section.image!.width ?? 1600}
                        height={section.image!.height ?? 1000}
                        className="h-full w-full object-cover"
                      />
                    </MediaReveal>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── DELIVERABLES + OUTCOME ── */}
      <div className="px-6 pb-20 sm:px-8 lg:px-10 lg:pb-28">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="label text-lime">DELIVERABLES</p>
            <ul className="mt-6 space-y-3">
              {deliverables.map((d) => (
                <li
                  key={d}
                  className="flex items-start gap-3 text-base text-softgray"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1 w-1 shrink-0 bg-lime"
                  />
                  {d}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <p className="label text-lime">PROJECT OUTPUT</p>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-softgray sm:text-lg">
              {project.outcome}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={`/contact?reference=${encodeURIComponent(
                  `Similar project enquiry — ${project.title}`,
                )}`}
                className="group inline-flex items-center gap-3 bg-lime px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-carbon transition-colors duration-300 hover:bg-offwhite"
              >
                START A SIMILAR PROJECT
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>

              <Link
                href="/work"
                className="group inline-flex items-center gap-2 self-center text-[11px] font-medium uppercase tracking-[0.18em] text-softgray transition-colors hover:text-lime"
              >
                <ArrowLeft
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5"
                />
                ALL WORK
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── RELATED SERVICES ── */}
      {relatedServices.length > 0 && (
        <div className="px-6 pb-16 sm:px-8 lg:px-10 lg:pb-20">
          <div className="border-t border-white/[0.08] pt-12">
            <p className="label text-offwhite/50">RELATED SERVICES</p>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              {relatedServices.map((svc) => (
                <Link
                  key={svc.slug}
                  href={`/services/${svc.slug}`}
                  className="group flex items-center justify-between gap-6 border border-white/[0.08] bg-white/[0.02] p-7 transition-colors duration-300 hover:border-lime/40"
                >
                  <div>
                    <p className="label text-lime">{svc.number}</p>
                    <h3 className="mt-2 text-xl font-medium tracking-tight text-offwhite transition-colors duration-300 group-hover:text-lime">
                      {svc.title}
                    </h3>
                    <p className="mt-2 text-sm text-softgray">
                      {svc.positioning}
                    </p>
                  </div>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 text-softgray transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lime"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const next = getNextProject(slug);
  const isRealClient = project.status === "client";

  return (
    <>
      {/* ── HERO ── */}
      <div className="relative overflow-hidden px-6 pt-32 sm:px-8 lg:px-10 lg:pt-44">
        <HeroThreadsBackground />
        <Link
          href="/work"
          className="group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-softgray transition-colors hover:text-lime"
        >
          <ArrowLeft
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5"
          />
          WORK
        </Link>

        <h1 className="mt-8 max-w-4xl text-[clamp(2.5rem,6.5vw,5.2rem)] font-semibold uppercase leading-[1.0] tracking-[-0.03em] text-offwhite">
          <DiaHeroTextReveal>{project.title}</DiaHeroTextReveal>
        </h1>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          {isRealClient && project.clientName ? (
            <p className="label-lime">{project.clientName}</p>
          ) : (
            <p className="label-lime">{project.category}</p>
          )}
          <p className="label">{project.year}</p>
          {!isRealClient ? (
            <span className="label border border-white/12 px-2.5 py-1 text-offwhite/50">
              STUDIO CONCEPT
            </span>
          ) : null}
        </div>
        {project.services.length ? (
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            {project.services.map((s) => (
              <p key={s} className="label text-offwhite/40">
                {s}
              </p>
            ))}
          </div>
        ) : null}
      </div>

      {/* ── BODY — Concept vs Client layout ── */}
      {isRealClient ? (
        <ClientCaseStudyLayout project={project} />
      ) : (
        <ConceptLayout project={project} />
      )}

      {/* ── NEXT PROJECT ── */}
      {next ? (
        <div className="border-t border-white/[0.08]">
          <Link
            href={`/work/${next.slug}`}
            className="group flex items-center justify-between gap-6 px-6 py-14 sm:px-8 lg:px-10 lg:py-20"
          >
            <div>
              <p className="label text-offwhite/50">NEXT PROJECT</p>
              <h2 className="mt-3 text-3xl font-medium uppercase tracking-tight text-offwhite transition-colors duration-300 group-hover:text-lime sm:text-5xl">
                {next.title}
              </h2>
            </div>
            <ArrowUpRight
              aria-hidden="true"
              className="h-8 w-8 shrink-0 text-softgray transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-lime"
            />
          </Link>
        </div>
      ) : null}
    </>
  );
}
