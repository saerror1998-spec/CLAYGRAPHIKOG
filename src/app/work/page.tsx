import type { Metadata } from "next";
import PageHero from "@/components/motion/PageHero";
import WorkGrid from "@/components/work/WorkGrid";
import { seo } from "@/data/siteContent";

export const metadata: Metadata = {
  title: seo.work.title,
  description: seo.work.description,
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="WORK"
        title="OUR WORK."
        support="A selection of branding, web and digital creative — built to be clear, credible and effective."
      />
      <WorkGrid />
    </>
  );
}
