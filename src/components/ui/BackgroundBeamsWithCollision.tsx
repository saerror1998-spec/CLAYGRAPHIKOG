"use client";

import { useRef, useEffect, useMemo } from "react";
import { gsap } from "@/lib/gsap";

/* ─── Beam config ─────────────────────────────────────────── */

interface BeamConfig {
  x: number;          // % position from left
  duration: number;   // fall duration in seconds
  delay: number;      // initial delay
  repeatDelay: number;
  height: number;     // beam height in px
}

const DESKTOP_BEAMS: BeamConfig[] = [
  { x: 8,   duration: 7,   delay: 0,   repeatDelay: 3,   height: 140 },
  { x: 22,  duration: 5.5, delay: 1.5, repeatDelay: 5,   height: 100 },
  { x: 38,  duration: 8.5, delay: 0.5, repeatDelay: 4,   height: 120 },
  { x: 55,  duration: 6,   delay: 2.5, repeatDelay: 6,   height: 80  },
  { x: 68,  duration: 10,  delay: 0,   repeatDelay: 2.5, height: 160 },
  { x: 82,  duration: 4.5, delay: 3,   repeatDelay: 5.5, height: 110 },
  { x: 93,  duration: 7.5, delay: 1,   repeatDelay: 7,   height: 90  },
];

const MOBILE_BEAMS: BeamConfig[] = [
  { x: 15,  duration: 8,   delay: 0,   repeatDelay: 5,   height: 100 },
  { x: 55,  duration: 6.5, delay: 1.5, repeatDelay: 6,   height: 80  },
  { x: 85,  duration: 9,   delay: 0.8, repeatDelay: 4,   height: 90  },
];

const PARTICLE_COUNT_DESKTOP = 14;
const PARTICLE_COUNT_MOBILE = 8;

/* ─── Component ───────────────────────────────────────────── */

export interface BackgroundBeamsWithCollisionProps {
  className?: string;
  /** Override beams (optional). */
  beams?: BeamConfig[];
  /** Override particle count. */
  particleCount?: number;
}

export default function BackgroundBeamsWithCollision({
  className = "",
  beams: overrideBeams,
  particleCount: overrideParticleCount,
}: BackgroundBeamsWithCollisionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const boundaryRef = useRef<HTMLDivElement>(null);
  const destroyedRef = useRef(false);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const beamConfigs = overrideBeams ?? (isMobile ? MOBILE_BEAMS : DESKTOP_BEAMS);
  const particleCount = overrideParticleCount ?? (isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP);
  // Keep timeline refs stable across renders
  const timelinesRef = useRef<gsap.core.Timeline[]>([]);

  /* Track which beam elements have already collided this cycle */
  const collidedSet = useRef(new Set<number>());

  /* Create beam DOM elements */
  const beamElements = useMemo(() => {
    return beamConfigs.map((cfg) => ({
      ...cfg,
      id: `beam-${cfg.x}-${cfg.duration}`,
    }));
  }, [beamConfigs]);

  useEffect(() => {
    if (!containerRef.current || !boundaryRef.current) return;
    destroyedRef.current = false;

    /* ─── IntersectionObserver — pause/resume beams ────── */
    let paused = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        if (visible && paused) {
          timelines.forEach((tl) => tl.play());
          paused = false;
        } else if (!visible && !paused) {
          timelines.forEach((tl) => tl.pause());
          paused = true;
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(containerRef.current);

    /* ─── GSAP beam animations ──────────────── */
    const beamEls = containerRef.current.querySelectorAll<HTMLElement>("[data-beam]");
    const boundaryRect = () => boundaryRef.current!.getBoundingClientRect();
    const containerRect = () => containerRef.current!.getBoundingClientRect();

    const timelines: gsap.core.Timeline[] = [];

    beamEls.forEach((el, i) => {
      const cfg = beamConfigs[i];
      if (!cfg) return;

      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: cfg.repeatDelay,
        delay: cfg.delay,
        paused: true,
      });

      // Start above the section
      tl.set(el, { y: -cfg.height - 20, opacity: 0 });
      // Fade in briefly
      tl.to(el, { opacity: 0.45, duration: 0.3, ease: "power1.in" }, 0);
      // Fall down to section bottom
      tl.to(el, {
        y: () => {
          const bRect = boundaryRect();
          const cRect = containerRect();
          return bRect.bottom - cRect.top;
        },
        duration: cfg.duration,
        ease: "none",
        onComplete: () => {
          // Trigger collision
          if (!destroyedRef.current) {
            triggerCollision(el, cfg.x, particleCount, containerRef.current!);
          }
        },
      }, 0);

      timelines.push(tl);
    });

    /* ─── Start all timelines ──────────────── */
    timelines.forEach((tl) => tl.play());
    timelinesRef.current = timelines;

    return () => {
      destroyedRef.current = true;
      observer.disconnect();
      timelines.forEach((tl) => tl.kill());
      timelinesRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beamConfigs.length, particleCount]);

  /* ─── Collision effect ──────────────────── */
  function triggerCollision(
    beamEl: HTMLElement,
    xPercent: number,
    numParticles: number,
    container: HTMLElement,
  ) {
    const beamRect = beamEl.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const cx = beamRect.left - containerRect.left + beamRect.width / 2;
    const cy = containerRect.height; // bottom of container

    // Flash
    const flash = document.createElement("div");
    flash.style.cssText = `
      position:absolute;
      left:${cx}px;
      top:${cy}px;
      width:40px;
      height:2px;
      background:transparent;
      box-shadow:0 0 8px 2px rgba(204,255,0,0.7);
      border-radius:2px;
      transform:translate(-50%,-50%);
      pointer-events:none;
      z-index:1;
    `;
    container.appendChild(flash);

    gsap.fromTo(flash, { opacity: 0, scaleX: 0 }, {
      opacity: 0.9,
      scaleX: 1,
      duration: 0.15,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(flash, {
          opacity: 0,
          scaleX: 0.3,
          duration: 0.6,
          ease: "power2.in",
          onComplete: () => flash.remove(),
        });
      },
    });

    // Particles
    for (let i = 0; i < numParticles; i++) {
      const p = document.createElement("div");
      const size = 1 + Math.random() * 2;
      const angle = (Math.PI * 2 * i) / numParticles + (Math.random() - 0.5) * 0.5;
      const dist = 15 + Math.random() * 30;
      const tx = Math.cos(angle) * dist;
      const ty = -10 - Math.random() * 40;

      p.style.cssText = `
        position:absolute;
        left:${cx}px;
        top:${cy}px;
        width:${size}px;
        height:${size}px;
        background:#ccff00;
        border-radius:50%;
        pointer-events:none;
        z-index:1;
        transform:translate(-50%,-50%);
      `;
      container.appendChild(p);

      gsap.fromTo(p,
        { opacity: 1, x: 0, y: 0 },
        {
          x: tx,
          y: ty,
          opacity: 0,
          duration: 0.5 + Math.random() * 0.7,
          ease: "power2.out",
          delay: Math.random() * 0.08,
          onComplete: () => p.remove(),
        },
      );
    }
  }

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
      style={{ zIndex: 0 }}
    >
      {/* Beams */}
      {beamElements.map((beam) => (
        <div
          key={beam.id}
          data-beam
          style={{
            position: "absolute",
            left: `${beam.x}%`,
            top: 0,
            width: "1px",
            height: `${beam.height}px`,
            background: "linear-gradient(to top, transparent, rgba(204,255,0,0.2), rgba(204,255,0,0.6), #ccff00)",
            borderRadius: "1px",
            opacity: 0,
            willChange: "transform, opacity",
          }}
        />
      ))}

      {/* Bottom boundary line (very subtle) */}
      <div
        ref={boundaryRef}
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(to right, transparent, rgba(204,255,0,0.08), transparent)" }}
      />
    </div>
  );
}
