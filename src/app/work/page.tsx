import type { Metadata } from "next";
import PageHero from "@/components/motion/PageHero";
import WorkGrid from "@/components/work/WorkGrid";
import { ogDefaults, seo, twitterDefaults } from "@/data/siteContent";

export const metadata: Metadata = {
  title: seo.work.title,
  description: seo.work.description,
  alternates: { canonical: "/work" },
  openGraph: {
    ...ogDefaults,
    title: seo.work.title,
    description: seo.work.description,
    url: "/work",
  },
  twitter: {
    ...twitterDefaults,
    title: seo.work.title,
    description: seo.work.description,
  },
};

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="WORK"
        title="OUR WORK."
        support="A selection of branding, web and digital creative — built to be clear, credible and effective."
      />
      <div className="px-6 pt-4 pb-16 sm:px-8 lg:px-10 lg:pt-6 lg:pb-20">
        <p className="max-w-3xl text-base leading-relaxed text-softgray sm:text-lg">
          Branding, website and content system projects from Clay Graphik — an independent creative studio based in Dubai, serving businesses across the UAE and GCC.
        </p>
      </div>
      <WorkGrid />
    </>
  );
}
