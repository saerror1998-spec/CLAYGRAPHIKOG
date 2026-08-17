import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import WhatWeDo from "@/components/home/WhatWeDo";
import SelectedWork from "@/components/home/SelectedWork";
import SignatureScroll from "@/components/home/SignatureScroll";
import ServicesSection from "@/components/home/ServicesSection";
import ProcessSection from "@/components/home/ProcessSection";
import StudioSection from "@/components/home/StudioSection";
import StartProjectSection from "@/components/home/StartProjectSection";
import { seo } from "@/data/siteContent";

export const metadata: Metadata = {
  title: seo.home.title,
  description: seo.home.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhatWeDo />
      <SelectedWork />
      <SignatureScroll />
      <ServicesSection />
      <ProcessSection />
      <StudioSection />
      <StartProjectSection />
    </>
  );
}
