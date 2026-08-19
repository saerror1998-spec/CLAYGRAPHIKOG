"use client";

import { useEffect, useRef, memo, useCallback, useState } from "react";

const SMOOTH_TAU = 0.25;
const MIN_COPIES = 2;
const COPY_HEADROOM = 2;

/**
 * LogoLoop — infinite horizontal (or vertical) scrolling logo/word strip.
 * Single RAF loop, IntersectionObserver pauses when offscreen.
 */
export default memo(function LogoLoop({
  items,
  speed = 120,
  direction = "left",
  logoHeight = 28,
  gap = 32,
  hoverSpeed,
  ariaLabel = "Partner logos",
  className = "",
  style,
}: {
  items: { text: string; isSep?: boolean }[];
  speed?: number;
  direction?: "left" | "right";
  logoHeight?: number;
  gap?: number;
  hoverSpeed?: number;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef<HTMLUListElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);
  const [seqWidth, setSeqWidth] = useState(0);
  const [copyCount, setCopyCount] = useState(MIN_COPIES);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const effectiveHoverSpeed = hoverSpeed !== undefined ? hoverSpeed : 0;

  const updateDimensions = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth ?? 0;
    const sequenceRect = seqRef.current?.getBoundingClientRect?.();
    const sequenceWidth = sequenceRect?.width ?? 0;
    if (sequenceWidth > 0) {
      setSeqWidth(Math.ceil(sequenceWidth));
      const copiesNeeded = Math.ceil(containerWidth / sequenceWidth) + COPY_HEADROOM;
      setCopyCount(Math.max(MIN_COPIES, copiesNeeded));
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    if (seqRef.current) observer.observe(seqRef.current);
    return () => observer.disconnect();
  }, [updateDimensions]);

  // IntersectionObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const io = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );
    io.observe(container);
    return () => io.disconnect();
  }, []);

  // RAF animation
  useEffect(() => {
    const track = trackRef.current;
    if (!track || seqWidth <= 0) return;

    const magnitude = Math.abs(speed);
    const dirMult = direction === "left" ? 1 : -1;
    const targetVelocity = magnitude * dirMult;

    offsetRef.current = ((offsetRef.current % seqWidth) + seqWidth) % seqWidth;

    const animate = (timestamp: number) => {
      if (lastTimestampRef.current === null) lastTimestampRef.current = timestamp;
      const dt = Math.max(0, timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      const target = isHovered ? effectiveHoverSpeed * dirMult : isVisible ? targetVelocity : 0;
      const ef = 1 - Math.exp(-dt / SMOOTH_TAU);
      velocityRef.current += (target - velocityRef.current) * ef;

      let next = offsetRef.current + velocityRef.current * dt;
      next = ((next % seqWidth) + seqWidth) % seqWidth;
      offsetRef.current = next;
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
      lastTimestampRef.current = null;
    };
  }, [speed, direction, seqWidth, isHovered, isVisible, effectiveHoverSpeed]);

  const logoLists = Array.from({ length: copyCount }, (_, ci) => (
    <ul
      key={`copy-${ci}`}
      ref={ci === 0 ? seqRef : undefined}
      className="flex shrink-0 items-center"
      role="list"
      aria-hidden={ci > 0}
    >
      {items.map((item, ii) => (
        <li key={`${ci}-${ii}`} className="shrink-0" style={{ paddingRight: gap }}>
          {item.isSep ? (
            <span className="text-lg text-lime/60">✦</span>
          ) : (
            <span
              className="font-semibold uppercase tracking-[-0.01em] text-offwhite/80"
              style={{ fontSize: `clamp(1rem, 2vw, ${logoHeight / 16}rem)` }}
            >
              {item.text}
            </span>
          )}
        </li>
      ))}
    </ul>
  ));

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      style={{ ...style, cursor: "grab" }}
      role="region"
      aria-label={ariaLabel}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div ref={trackRef} className="flex whitespace-nowrap">
        {logoLists}
      </div>
    </div>
  );
});
