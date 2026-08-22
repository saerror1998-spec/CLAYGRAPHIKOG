import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getNextProject, getProject, projects } from "@/data/projects";
import { ogDefaults, twitterDefaults } from "@/data/siteContent";
import MediaReveal from "@/components/motion/MediaReveal";

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
  const title = project.title;
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

const SECTION_LABELS: Array<{ label: string; title: string }> = [
  { label: "OVERVIEW", title: "overview" },
  { label: "OBJECTIVE", title: "objective" },
  { label: "APPROACH", title: "approach" },
  { label: "SYSTEM", title: "system" },
];

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const next = getNextProject(slug);

  return (
    <>
      <div className="px-6 pt-32 sm:px-8 lg:px-10 lg:pt-44">
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
          {project.title}
        </h1>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <p className="label-lime">{project.category}</p>
          <p className="label">{project.year}</p>
          {project.status === "concept" ? (
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
