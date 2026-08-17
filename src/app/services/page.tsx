import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/motion/PageHero";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Strategy & Identity, Websites & UX, Content Systems and Creative Direction — Clay Graphik, independent creative studio in Dubai.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="SERVICES"
        title="SERVICES."
        titleAccent="CLEAR, CREDIBLE, BUILT TO GROW."
        support="Four practice areas, one partner. Everything a growing brand needs — from strategy to launch — designed and delivered with the same standard."
      />

      <div className="px-6 pb-24 sm:px-8 lg:px-10 lg:pb-32">
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

        <div className="mt-16 flex flex-col items-start justify-between gap-6 border border-white/[0.08] bg-white/[0.02] p-8 lg:flex-row lg:items-center lg:p-10">
          <div>
            <h2 className="text-2xl font-medium uppercase tracking-tight text-offwhite">
              NOT SURE WHERE TO START?
            </h2>
            <p className="mt-2 max-w-md text-sm text-softgray">
              Tell us what you&apos;re building. We&apos;ll point you at the right
              place — or the right partner.
            </p>
          </div>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 bg-lime px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-carbon transition-colors duration-300 hover:bg-offwhite"
          >
            TALK TO US
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </>
  );
}
