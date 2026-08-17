import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/motion/PageHero";
import FAQ from "@/components/global/FAQ";
import { services } from "@/data/services";
import { ctas, seo } from "@/data/siteContent";

export const metadata: Metadata = {
  title: seo.services.title,
  description: seo.services.description,
  alternates: { canonical: "/services" },
};

const ISSUES = [
  {
    title: "UNCLEAR DIGITAL EXPERIENCE",
    copy: "Confusing websites make strong businesses harder to understand and trust.",
  },
  {
    title: "WEAK BRAND IDENTITY",
    copy: "Without a clear visual system, businesses blend into the market.",
  },
  {
    title: "INCONSISTENT CONTENT",
    copy: "Disconnected creative makes a brand look less established than it really is.",
  },
  {
    title: "DESIGN WITHOUT DIRECTION",
    copy: "Visuals alone are not enough. Every creative decision needs a clear business objective.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="SERVICES"
        title="DESIGN SYSTEMS"
        titleAccent="BUILT TO MOVE BUSINESS."
        support="Brand identity, websites, content systems and creative direction designed to work together — not as disconnected deliverables."
      />

      <div className="px-6 pb-24 sm:px-8 lg:px-10 lg:pb-32">
        {/* WHY IT MATTERS — problem-oriented context before the services */}
        <div className="border-t border-white/[0.08] py-16 lg:py-24">
          <p className="label text-offwhite/50">WHY IT MATTERS</p>
          <h2 className="mt-8 max-w-3xl text-[clamp(2rem,5vw,3.8rem)] font-medium uppercase leading-[1.02] tracking-[-0.02em] text-offwhite">
            GOOD BUSINESSES
            <br />
            STILL GET
            <br />
            <span className="text-lime">OVERLOOKED.</span>
          </h2>
          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2">
            {ISSUES.map((issue, i) => (
              <div key={issue.title} className="border-t border-white/[0.08] pt-6">
                <span className="label text-lime">0{i + 1}</span>
                <h3 className="mt-4 text-lg font-medium uppercase tracking-tight text-offwhite sm:text-xl">
                  {issue.title}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-softgray">{issue.copy}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/[0.08]">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group grid grid-cols-1 gap-6 border-b border-white/[0.08] py-12 transition-colors duration-300 hover:bg-white/[0.02] md:grid-cols-12 lg:py-16"
            >
              <div className="md:col-span-1">
                <span className="label text-lime">{service.number}</span>
              </div>
              <div className="md:col-span-5">
                <h2 className="text-3xl font-medium uppercase tracking-tight text-offwhite transition-colors duration-300 group-hover:text-lime sm:text-4xl">
                  {service.title}
                </h2>
              </div>
              <div className="md:col-span-5">
                <p className="max-w-sm text-sm leading-relaxed text-softgray">
                  {service.positioning}
                </p>
                <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                  {service.capabilities.map((cap) => (
                    <li key={cap} className="label text-offwhite/40">
                      {cap}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="hidden items-start justify-end md:col-span-1 md:flex">
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-6 w-6 text-softgray transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lime"
                />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="label text-offwhite/50">FAQ</p>
            <div className="mt-8">
              <FAQ />
            </div>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <div className="flex h-full flex-col justify-between border border-white/[0.08] bg-white/[0.02] p-8 lg:p-10">
              <div>
                <h2 className="text-2xl font-medium uppercase tracking-tight text-offwhite">
                  NOT SURE WHERE TO START?
                </h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-softgray">
                  Tell us what you&apos;re building. We&apos;ll point you at the
                  right approach — or the right combination of services.
                </p>
              </div>
              <Link
                href="/contact"
                className="group mt-8 inline-flex w-fit items-center gap-3 bg-lime px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-carbon transition-colors duration-300 hover:bg-offwhite"
              >
                {ctas.startProject}
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
