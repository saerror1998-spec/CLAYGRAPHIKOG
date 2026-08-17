import Hero from "@/components/home/Hero";
import WhatWeDo from "@/components/home/WhatWeDo";
import SelectedWork from "@/components/home/SelectedWork";
import SignatureScroll from "@/components/home/SignatureScroll";
import ServicesSection from "@/components/home/ServicesSection";
import ProcessSection from "@/components/home/ProcessSection";
import StudioSection from "@/components/home/StudioSection";
import StartProjectSection from "@/components/home/StartProjectSection";

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
