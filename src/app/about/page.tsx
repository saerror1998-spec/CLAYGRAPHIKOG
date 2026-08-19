import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/motion/PageHero";
import AboutCurvedLoop from "@/components/about/AboutCurvedLoop";
import StarBorder from "@/components/ui/StarBorder";
import LiquidButton from "@/components/ui/LiquidButton";
import { services } from "@/data/services";
import { ctas, principles, seo, site } from "@/data/siteContent";

export const metadata: Metadata = {
  title: seo.about.title,
  description: seo.about.description,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="ABOUT CLAY GRAPHIK"
        title="A STUDIO"
        titleAccent="BUILT FOR GROWTH."
        support="Clay Graphik is an independent creative studio in Dubai helping businesses build clearer brands, stronger websites and consistent digital experiences."
      />

      <div className="px-6 pb-24 sm:px-8 lg:px-10 lg:pb-32">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="label text-offwhite/50">POSITIONING</p>
            <h2 className="mt-6 max-w-2xl text-[clamp(1.7rem,3.6vw,2.8rem)] font-medium uppercase leading-[1.05] tracking-[-0.02em] text-offwhite">
              {site.tagline}
            </h2>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-softgray sm:text-lg">
              We combine strategic thinking with visual design and digital
              execution so brand identity, websites and content work as one
              connected system.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-softgray sm:text-lg">
              We work with founders, service businesses, startups and growing
              brands across the UAE, GCC and beyond.
            </p>
          </div>

          <div className="lg:col-span-5">
            <p className="label text-offwhite/50">PHILOSOPHY</p>
            <p className="mt-6 max-w-sm text-base leading-relaxed text-softgray">
              Big-brand discipline without the big-agency overhead. We stay
              small on purpose — fewer hands on the work, one standard applied
              everywhere, and direct communication from the people who are
              actually designing and building your project.
            </p>
          </div>
        </div>

        <div className="mt-24">
          <AboutCurvedLoop />
        </div>

        <div className="mt-24">
          <p className="label text-offwhite/50">PRINCIPLES</p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-softgray">
            Strong design should make a business easier to understand, easier
            to trust and easier to choose.
          </p>
          <div className="mt-8 border-t border-white/[0.08]">
            {principles.map((p) => (
              <div
                key={p.number}
                className="grid grid-cols-1 gap-4 border-b border-white/[0.08] py-8 md:grid-cols-12"
              >
                <span className="label text-lime md:col-span-1">{p.number}</span>
                <h3 className="text-xl font-medium uppercase tracking-tight text-offwhite md:col-span-4 sm:text-2xl">
                  {p.title}
                </h3>
                <p className="max-w-sm text-sm leading-relaxed text-softgray md:col-span-7">
                  {p.copy}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24">
          <p className="label text-offwhite/50">CAPABILITIES</p>
          <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-xl bg-white/[0.08] sm:grid-cols-2">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group flex items-center justify-between gap-4 bg-charcoal p-8 transition-colors duration-300 hover:bg-white/[0.03]"
              >
                <div>
                  <span className="label text-lime">{service.number}</span>
                  <h3 className="mt-3 text-xl font-medium uppercase tracking-tight text-offwhite transition-colors duration-300 group-hover:text-lime">
                    {service.title}
                  </h3>
                </div>
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-softgray transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lime"
                />
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="label text-offwhite/50">HOW WE WORK</p>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-softgray sm:text-lg">
              Discover, define, design, deliver. Every project follows the same
              clear sequence — so there are no surprises about what is
              happening, why, or what comes next. You work directly with the
              studio, and the people you meet on day one are the people doing
              the work.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="border border-white/[0.08] bg-white/[0.02] p-8 lg:p-10">
              <h3 className="text-2xl font-medium uppercase tracking-tight text-offwhite">
                {ctas.startProject}
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-softgray">
                Based in {site.location}, serving the {site.serviceArea} markets.
              </p>
              <StarBorder
                as="div"
                className="mt-8 inline-block"
                style={{ padding: 0 }}
              >
                <LiquidButton
                  as={Link}
                  href="/contact"
                  className="inline-flex items-center gap-3 px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.18em]"
                >
                  {ctas.startProject}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-4 w-4"
                  />
                </LiquidButton>
              </StarBorder>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
