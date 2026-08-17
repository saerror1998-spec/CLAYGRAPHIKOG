"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { services } from "@/data/services";
import BorderGlow from "@/components/motion/BorderGlow";
import SectionLabel from "./SectionLabel";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";

/**
 * 04 / SERVICES — restrained bento: a 2×2 grid of BorderGlow cards with a
 * shared spotlight that follows the pointer (gsap.quickTo). Stars, particles,
 * tilt and magnetism are OFF by design.
 */
export default function ServicesSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const grid = gridRef.current;
      const spot = spotRef.current;
      if (!grid || !spot || reduced) return;

      const quickX = gsap.quickTo(spot, "left", { duration: 0.35, ease: "power3.out" });
      const quickY = gsap.quickTo(spot, "top", { duration: 0.35, ease: "power3.out" });

      const onMove = (e: PointerEvent) => {
        quickX(e.clientX);
        quickY(e.clientY);
      };
      const onEnter = () => gsap.to(spot, { opacity: 1, duration: 0.3 });
      const onLeave = () => gsap.to(spot, { opacity: 0, duration: 0.3 });

      grid.addEventListener("pointermove", onMove);
      grid.addEventListener("pointerenter", onEnter);
      grid.addEventListener("pointerleave", onLeave);
      return () => {
        grid.removeEventListener("pointermove", onMove);
        grid.removeEventListener("pointerenter", onEnter);
        grid.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: gridRef, dependencies: [reduced] },
  );

  return (
    <section className="border-t border-white/[0.06] px-6 py-24 sm:px-8 lg:px-10 lg:py-36">
      <SectionLabel number="04" title="SERVICES" />

      <div className="mb-14 mt-10 flex flex-wrap items-end justify-between gap-6 lg:mb-16">
        <h2 className="max-w-2xl text-[clamp(1.9rem,4.2vw,3.4rem)] font-medium uppercase leading-[1.04] tracking-[-0.02em] text-offwhite">
          Everything a growing brand needs, under one roof.
        </h2>
        <Link
          href="/services"
          className="group flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-offwhite transition-colors hover:text-lime"
        >
          ALL SERVICES
          <ArrowUpRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      <div ref={gridRef} className="relative">
        {/* Shared pointer spotlight */}
        <div
          ref={spotRef}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-0 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
          style={{
            background:
              "radial-gradient(circle, rgba(204,255,0,0.07) 0%, rgba(204,255,0,0.03) 30%, transparent 65%)",
          }}
        />

        <div className="relative grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5">
          {services.map((service) => (
            <BorderGlow key={service.slug} borderRadius={24} className="h-full">
              <Link
                href={`/services/${service.slug}`}
                className="group flex h-full flex-col justify-between bg-[#0B0B0B] p-8 lg:p-10"
              >
                <div className="flex items-start justify-between">
                  <span className="label text-lime">{service.number}</span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-5 w-5 text-softgray transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lime"
                  />
                </div>

                <div className="mt-16">
                  <h3 className="text-2xl font-medium uppercase tracking-tight text-offwhite transition-colors duration-300 group-hover:text-lime sm:text-3xl">
                    {service.title}
                  </h3>
                  <p className="mt-4 max-w-sm text-sm leading-relaxed text-softgray">
                    {service.positioning}
                  </p>
                  <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
                    {service.capabilities.slice(0, 3).map((cap) => (
                      <li key={cap} className="label text-offwhite/45">
                        {cap}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            </BorderGlow>
          ))}
        </div>
      </div>
    </section>
  );
}
