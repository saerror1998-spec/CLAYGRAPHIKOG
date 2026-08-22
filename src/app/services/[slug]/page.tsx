import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import PageHero from "@/components/motion/PageHero";
import StarBorder from "@/components/ui/StarBorder";
import LiquidButton from "@/components/ui/LiquidButton";
import { getService, services } from "@/data/services";
import { ogDefaults, serviceSeo, twitterDefaults } from "@/data/siteContent";
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
  const seoEntry = serviceSeo[slug];
  const title = seoEntry?.title ?? `${service.title} | Clay Graphik`;
  const description = seoEntry?.description ?? service.description;
  return {
    title,
    description,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      ...ogDefaults,
      title,
      description,
      url: `/services/${service.slug}`,
    },
    twitter: {
      ...twitterDefaults,
      title,
      description,
    },
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const related = service.relatedWork
    .map((p) => getProject(p))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const relatedSvc = service.relatedServices
    .map((s) => getService(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <>
      <PageHero
        eyebrow={`SERVICE ${service.number}`}
        title={service.title}
        titleAccent=""
        support={service.description}
      />

      <div className="px-6 pb-24 sm:px-8 lg:px-10 lg:pb-32">
        {/* WHAT THIS SERVICE COVERS */}
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="label text-offwhite/50">WHAT THIS SERVICE COVERS</p>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-softgray sm:text-lg">
              {service.about}
            </p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-softgray sm:text-lg">
              {service.problem}
            </p>
          </div>

          <div className="lg:col-span-5">
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
        </div>

        {/* WHAT WE DELIVER + HOW IT WORKS */}
        <div className="mt-20 grid grid-cols-1 gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="label text-offwhite/50">WHAT WE DELIVER</p>
            <ul className="mt-6 space-y-4">
              {service.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-3 text-base text-softgray">
                  <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 bg-lime" />
                  {d}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <p className="label text-offwhite/50">HOW IT WORKS</p>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-softgray sm:text-lg">
              {service.process}
            </p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-softgray sm:text-lg">
              {service.outcome}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <StarBorder
                as="div"
                className="inline-block"
                style={{ padding: 0 }}
              >
                <LiquidButton
                  as={Link}
                  href={`/contact?service=${encodeURIComponent(service.title)}`}
                  className="inline-flex items-center gap-3 px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.18em]"
                >
                  START A PROJECT
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-4 w-4"
                  />
                </LiquidButton>
              </StarBorder>

              <Link
                href="/services"
                className="group inline-flex items-center gap-2 self-center text-[11px] font-medium uppercase tracking-[0.18em] text-softgray transition-colors hover:text-lime"
              >
                <ArrowLeft
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5"
                />
                ALL SERVICES
              </Link>
            </div>
          </div>
        </div>

        {/* RELATED SERVICES — contextual internal links */}
        {relatedSvc.length ? (
          <div className="mt-20 border-t border-white/[0.08] pt-12">
            <p className="label text-offwhite/50">ALSO EXPLORE</p>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              {relatedSvc.map((svc) => (
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
                    <p className="mt-2 text-sm text-softgray">{svc.positioning}</p>
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

        {/* RELATED WORK */}
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
