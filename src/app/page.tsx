import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import SignatureScroll from "@/components/home/SignatureScroll";
import HomeOutcomes from "@/components/home/HomeOutcomes";
import HomeServices from "@/components/home/HomeServices";
import HomeProjects from "@/components/home/HomeProjects";
import HomeBrandLoop from "@/components/home/HomeBrandLoop";
import HomeSolutions from "@/components/home/HomeSolutions";
import HomeReviews from "@/components/home/HomeReviews";
import HomeProjectCTA from "@/components/home/HomeProjectCTA";
import HomeTestimonials from "@/components/home/HomeTestimonials";
import { seo } from "@/data/siteContent";

export const metadata: Metadata = {
  title: seo.home.title,
  description: seo.home.description,
  alternates: { canonical: "/" },
};

/**
 * Editorial homepage:
 * 00 — Hero [KEEP]
 * 01 — FROM IDEA TO IMPACT [SignatureScroll]
 * 02 — BUILT FOR OUTCOMES [HomeOutcomes]
 * 03 — WHAT WE DO [Services]
 * 04 — SELECTED WORK [Projects]
 * 05 — CAPABILITIES [BrandLoop]
 * 06 — SOLUTIONS [Solutions]
 * 07 — WHAT CLIENTS VALUE [Reviews]
 * 08 — START A PROJECT [CTA]
 * 09 — CLIENT REVIEWS [Marquee Testimonials]
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <SignatureScroll />
      <HomeOutcomes />
      <HomeServices />
      <HomeProjects />
      <HomeBrandLoop />
      <HomeSolutions />
      <HomeReviews />
      <HomeProjectCTA />
      <HomeTestimonials />
    </>
  );
}
