import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SectionLabel from "./SectionLabel";

/**
 * 06 / STUDIO — small studio, serious craft.
 */
export default function StudioSection() {
  return (
    <section className="border-t border-white/[0.06] px-6 py-24 sm:px-8 lg:px-10 lg:py-36">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <SectionLabel number="06" title="STUDIO" />
        </div>
        <div className="lg:col-span-6">
          <h2 className="text-[clamp(2.2rem,5.2vw,4.2rem)] font-medium uppercase leading-[1.02] tracking-[-0.02em] text-offwhite">
            SMALL STUDIO.
            <br />
            SERIOUS CRAFT.
          </h2>
          <p className="mt-8 max-w-lg text-base leading-relaxed text-softgray sm:text-lg">
            Clay Graphik is an independent creative studio in Dubai, working
            with founders, service businesses and growing brands across the
            UAE, GCC and beyond.
          </p>
          <Link
            href="/about"
            className="group mt-10 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-lime"
          >
            ABOUT THE STUDIO
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
