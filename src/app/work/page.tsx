import type { Metadata } from "next";
import PageHero from "@/components/motion/PageHero";
import WorkGrid from "@/components/work/WorkGrid";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected branding, web and digital creative by Clay Graphik — an independent creative studio in Dubai.",
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
