import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import SignatureScroll from "@/components/home/SignatureScroll";
import HomeServices from "@/components/home/HomeServices";
import HomeProjects from "@/components/home/HomeProjects";
import HomeBrandLoop from "@/components/home/HomeBrandLoop";
import HomeSolutions from "@/components/home/HomeSolutions";
import HomeReviews from "@/components/home/HomeReviews";
import HomeProjectCTA from "@/components/home/HomeProjectCTA";
import HomeVisualGallery from "@/components/home/HomeVisualGallery";
import { seo } from "@/data/siteContent";

export const metadata: Metadata = {
  title: seo.home.title,
  description: seo.home.description,
  alternates: { canonical: "/" },
};

/**
 * Editorial homepage:
 * 00 — Hero [KEEP]
 * 01 — FROM IDEA TO IMPACT [SignatureScroll — restored]
 * 02 — Services / What We Do
 * 03 — Projects & Branding (scroll-stack)
 * 04 — Brand / Capability Loop
 * 05 — Solutions
 * 06 — Client Reviews
 * 07 — Project CTA / Image Banner
 * 08 — Visual Gallery (CircularGallery + ImageTrail)
 * 09 — Premium Footer [KEEP]
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <SignatureScroll />
      <HomeServices />
      <HomeProjects />
      <HomeBrandLoop />
      <HomeSolutions />
      <HomeReviews />
      <HomeProjectCTA />
      <HomeVisualGallery />
    </>
  );
}
