import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import PageHero from "@/components/motion/PageHero";
import { getService, services } from "@/data/services";
import { getProject } from "@/data/projects";

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: "Services" };
  return {
    title: service.title,
    description: service.description,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const related = service.relatedWork
    .map((p) => getProject(p))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <PageHero
        eyebrow={`SERVICE ${service.number}`}
        title={service.title}
        titleAccent=""
        support={service.description}
      />

      <div className="px-6 pb-24 sm:px-8 lg:px-10 lg:pb-32">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="label text-offwhite/50">CAPABILITIES</p>
            <ul className="mt-6 space-y-1">
              {service.capabilities.map((cap, i) => (
                <li
                  key={cap}
                  className="flex items-baseline gap-5 border-b border-white/[0.06] py-5"
                >
                  <span className="label w-6 text-lime">0{i + 1}</span>
                  <span className="text-xl font-medium tracking-tight text-offwhite sm:text-2xl">
                    {cap}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <p className="label text-offwhite/50">HOW IT WORKS</p>
            <p className="mt-6 max-w-sm text-base leading-relaxed text-softgray">
              Every engagement starts with a conversation about the business,
              the audience and the objective. The strategy, design and build
              then follow a clear, documented process — so you always know
              what is happening, why, and what comes next.
            </p>

            <Link
              href="/contact"
              className="group mt-10 inline-flex items-center gap-3 bg-lime px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-carbon transition-colors duration-300 hover:bg-offwhite"
            >
              START A PROJECT
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>

            <Link
              href="/services"
              className="group mt-8 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-softgray transition-colors hover:text-lime"
            >
              <ArrowLeft
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5"
              />
              ALL SERVICES
            </Link>
          </div>
        </div>

        {related.length ? (
          <div className="mt-20 border-t border-white/[0.08] pt-12">
            <p className="label text-offwhite/50">RELATED WORK</p>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              {related.map((project) => (
                <Link
                  key={project.slug}
                  href={`/work/${project.slug}`}
                  className="group flex items-center justify-between gap-6 border border-white/[0.08] bg-white/[0.02] p-7 transition-colors duration-300 hover:border-lime/40"
                >
                  <div>
                    <h3 className="text-xl font-medium tracking-tight text-offwhite transition-colors duration-300 group-hover:text-lime">
                      {project.title}
                    </h3>
                    <p className="label mt-2">{project.category}</p>
                  </div>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 text-softgray transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lime"
                  />
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
