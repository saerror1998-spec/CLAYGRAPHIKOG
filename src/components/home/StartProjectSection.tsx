import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SectionLabel from "./SectionLabel";
import StarBorder from "@/components/ui/StarBorder";
import LiquidButton from "@/components/ui/LiquidButton";
import { site, waLink } from "@/data/siteContent";

const ACTIONS = [
  {
    label: "START A PROJECT",
    href: "/contact",
    external: false,
    primary: true,
  },
  {
    label: "WHATSAPP",
    href: waLink(),
    external: true,
    primary: false,
  },
  {
    label: "EMAIL",
    href: `mailto:${site.email}`,
    external: false,
    primary: false,
  },
];

/**
 * 07 / START A PROJECT — final conversion CTA.
 */
export default function StartProjectSection() {
  return (
    <section className="border-t border-white/[0.06] px-6 py-24 sm:px-8 lg:px-10 lg:py-40">
      <SectionLabel number="07" title="START A PROJECT" />

      <h2 className="mt-10 text-[clamp(2.4rem,6.5vw,5.2rem)] font-semibold uppercase leading-[1.0] tracking-[-0.03em] text-offwhite">
        LET&apos;S MAKE
        <br />
        SOMETHING
        <br />
        <span className="text-lime">WORTH NOTICING.</span>
      </h2>

      <div className="mt-14 flex flex-wrap items-center gap-4 lg:mt-16">
        {ACTIONS.map((action) =>
          action.primary ? (
            <StarBorder
              key={action.label}
              as="div"
              className="inline-block"
              style={{ padding: 0 }}
            >
              <LiquidButton
                as={Link}
                href={action.href}
                className="inline-flex items-center gap-3 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.18em]"
              >
                {action.label}
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4"
                />
              </LiquidButton>
            </StarBorder>
          ) : (
            <Link
              key={action.label}
              href={action.href}
              target={action.external ? "_blank" : undefined}
              rel={action.external ? "noopener noreferrer" : undefined}
              className="group inline-flex items-center gap-3 border border-white/15 px-8 py-4 text-[11px] font-medium uppercase tracking-[0.18em] text-offwhite transition-colors duration-300 hover:border-lime hover:text-lime"
            >
              {action.label}
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          ),
        )}
      </div>
    </section>
  );
}
