"use client";

import { useCallback, useRef } from "react";

interface BorderGlowProps {
  children: React.ReactNode;
  className?: string;
  borderRadius?: number;
  edgeSensitivity?: number;
  glowColor?: string;
}

/**
 * Directional border glow (adapted from the reference "carda border glow"):
 * pointer position → edge proximity + cursor angle → CSS variables
 * (`--edge-proximity`, `--cursor-angle`) consumed by the border ring CSS.
 * The glow follows the relevant edge; the ring never stays fully lit.
 */
export default function BorderGlow({
  children,
  className = "",
  borderRadius = 24,
  edgeSensitivity = 30,
  glowColor = "204, 255, 0",
}: BorderGlowProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const getEdgeProximity = useCallback(
    (el: HTMLDivElement, x: number, y: number) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = x - cx;
      const dy = y - cy;
      let kx = Infinity;
      let ky = Infinity;
      if (dx !== 0) kx = cx / Math.abs(dx);
      if (dy !== 0) ky = cy / Math.abs(dy);
      return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
    },
    [],
  );

  const getCursorAngle = useCallback((el: HTMLDivElement, x: number, y: number) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = x - cx;
    const dy = y - cy;
    if (dx === 0 && dy === 0) return 0;
    const radians = Math.atan2(dy, dx);
    let degrees = radians * (180 / Math.PI) + 90;
    if (degrees < 0) degrees += 360;
    return degrees;
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const edge = getEdgeProximity(card, x, y);
      const angle = getCursorAngle(card, x, y);
      // Direct CSS variable writes — no per-event JS animation.
      card.style.setProperty("--edge-proximity", `${(edge * 100).toFixed(2)}`);
      card.style.setProperty("--cursor-angle", `${angle.toFixed(2)}deg`);
    },
    [getEdgeProximity, getCursorAngle],
  );

  const handlePointerLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--edge-proximity", "0");
  }, []);

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`border-glow-card ${className}`}
      style={
        {
          "--edge-sensitivity": edgeSensitivity,
          "--border-radius": `${borderRadius}px`,
          "--glow-color": glowColor,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
