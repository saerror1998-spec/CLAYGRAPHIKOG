import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/motion/PageHero";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "About",
  description:
    "Clay Graphik is an independent creative studio in Dubai — small studio, serious craft. Working with founders, service businesses and growing brands across the UAE, GCC and beyond.",
};

const PRINCIPLES = [
  {
    number: "01",
    title: "Clarity before decoration",
    copy: "If it doesn't help the message land, it doesn't ship.",
  },
  {
    number: "02",
    title: "Strategy drives design",
    copy: "The best work is decided before a single pixel moves.",
  },
  {
    number: "03",
    title: "Built to convert",
    copy: "Beautiful is a baseline. Work must also move the business.",
  },
  {
    number: "04",
    title: "One standard, everywhere",
    copy: "The same care goes into a single social post and a full identity.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="ABOUT"
        title="SMALL STUDIO."
        titleAccent="SERIOUS CRAFT."
        support="Clay Graphik is an independent creative studio in Dubai, working with founders, service businesses and growing brands across the UAE, GCC and beyond."
      />

      <div className="px-6 pb-24 sm:px-8 lg:px-10 lg:pb-32">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="label text-offwhite/50">POSITIONING</p>
            <h2 className="mt-6 max-w-2xl text-[clamp(1.7rem,3.6vw,2.8rem)] font-medium uppercase leading-[1.05] tracking-[-0.02em] text-offwhite">
              STRATEGIC DESIGN. CONVERSION FOCUSED. GROWTH DRIVEN.
            </h2>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-softgray sm:text-lg">
              We build brands and digital experiences for businesses that take
              their growth seriously. The work is designed to do three things
              in order: create clarity, build trust, and move people to act.
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
          <p className="label text-offwhite/50">PRINCIPLES</p>
          <div className="mt-8 border-t border-white/[0.08]">
            {PRINCIPLES.map((p) => (
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
                START A PROJECT
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-softgray">
                Based in Dubai, serving the UAE, GCC and global markets.
              </p>
              <Link
                href="/contact"
                className="group mt-8 inline-flex items-center gap-3 bg-lime px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-carbon transition-colors duration-300 hover:bg-offwhite"
              >
                ABOUT THE STUDIO
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
