"use client";

import { useRef, useEffect, useState, useMemo, useId, useCallback } from "react";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";
import "./CurvedLoop.css";

interface CurvedLoopProps {
  marqueeText?: string;
  speed?: number;
  curveAmount?: number;
  direction?: "left" | "right";
  interactive?: boolean;
  className?: string;
}

/**
 * Curved SVG textPath marquee — text sweeps along a shallow U-curve.
 * Pauses offscreen via IntersectionObserver. Supports pointer drag on desktop.
 */
export default function CurvedLoop({
  marqueeText = "CLARITY \u2726 CRAFT \u2726 SYSTEMS \u2726 GROWTH \u2726 CLAY GRAPHIK \u2726",
  speed = 1,
  curveAmount = 260,
  direction = "left",
  interactive = true,
  className = "",
}: CurvedLoopProps) {
  const reduced = usePrefersReducedMotion();
  const measureRef = useRef<SVGTextElement>(null);
  const textPathRef = useRef<SVGTextPathElement>(null);
  const jacketRef = useRef<HTMLDivElement>(null);
  const [spacing, setSpacing] = useState(0);
  const uid = useId();
  const pathId = `cg-curve-${uid}`;

  const text = useMemo(() => {
    const hasTrailing = /\s|\u00A0$/.test(marqueeText);
    return (hasTrailing ? marqueeText.replace(/\s+$/, "") : marqueeText) + "\u00A0";
  }, [marqueeText]);

  const pathD = `M-100,40 Q500,${40 + curveAmount} 1540,40`;

  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const dirRef = useRef(direction);
  const velRef = useRef(0);
  const visibleRef = useRef(true);
  const frameRef = useRef(0);

  const textLength = spacing;
  const totalText = textLength
    ? Array(Math.ceil(1800 / textLength) + 2)
        .fill(text)
        .join("")
    : text;
  const ready = spacing > 0;

  // Measure text width
  useEffect(() => {
    if (measureRef.current) setSpacing(measureRef.current.getComputedTextLength());
  }, [text, className]);

  // Set initial offset
  useEffect(() => {
    if (!spacing) return;
    if (textPathRef.current) {
      const initial = -spacing;
      textPathRef.current.setAttribute("startOffset", initial + "px");
    }
  }, [spacing]);

  // RAF loop with IntersectionObserver pause
  useEffect(() => {
    if (!spacing || !ready || reduced) return;

    const step = () => {
      if (!dragRef.current && textPathRef.current && visibleRef.current) {
        const delta = dirRef.current === "right" ? speed : -speed;
        const currentOffset = parseFloat(textPathRef.current.getAttribute("startOffset") || "0");
        let newOffset = currentOffset + delta;

        const wrapPoint = spacing;
        if (newOffset <= -wrapPoint) newOffset += wrapPoint;
        if (newOffset > 0) newOffset -= wrapPoint;

        textPathRef.current.setAttribute("startOffset", newOffset + "px");
      }
      frameRef.current = requestAnimationFrame(step);
    };

    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [spacing, speed, ready, reduced]);

  // IntersectionObserver for offscreen pause
  useEffect(() => {
    const jacket = jacketRef.current;
    if (!jacket || reduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 },
    );

    observer.observe(jacket);
    return () => observer.disconnect();
  }, [reduced]);

  // Pointer drag handlers
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!interactive || reduced) return;
      dragRef.current = true;
      lastXRef.current = e.clientX;
      velRef.current = 0;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [interactive, reduced],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!interactive || !dragRef.current || !textPathRef.current) return;
      const dx = e.clientX - lastXRef.current;
      lastXRef.current = e.clientX;
      velRef.current = dx;

      const currentOffset = parseFloat(textPathRef.current.getAttribute("startOffset") || "0");
      let newOffset = currentOffset + dx;

      const wrapPoint = spacing;
      if (newOffset <= -wrapPoint) newOffset += wrapPoint;
      if (newOffset > 0) newOffset -= wrapPoint;

      textPathRef.current.setAttribute("startOffset", newOffset + "px");
    },
    [interactive, spacing],
  );

  const endDrag = useCallback(() => {
    if (!interactive) return;
    dragRef.current = false;
    dirRef.current = velRef.current > 0 ? "right" : "left";
  }, [interactive]);

  const cursorStyle = interactive ? (dragRef.current ? "grabbing" : "grab") : "auto";

  return (
    <div
      ref={jacketRef}
      className={`cg-curved-loop ${className}`}
      style={{ visibility: ready ? "visible" : "hidden", cursor: cursorStyle }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      <svg className="cg-curved-loop-svg" viewBox="0 0 1440 120">
        <text
          ref={measureRef}
          xmlSpace="preserve"
          style={{ visibility: "hidden", opacity: 0, pointerEvents: "none" }}
        >
          {text}
        </text>
        <defs>
          <path id={pathId} d={pathD} fill="none" stroke="transparent" />
        </defs>
        {ready && (
          <text fontWeight="bold" xmlSpace="preserve" className="cg-curved-loop-text">
            <textPath
              ref={textPathRef}
              href={`#${pathId}`}
              startOffset="0px"
              xmlSpace="preserve"
            >
              {totalText}
            </textPath>
          </text>
        )}
      </svg>
    </div>
  );
}
