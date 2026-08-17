"use client";

/**
 * ShinyText — CSS-only shine for `THAT MOVE.`
 *
 * Architecture per the design brief: an outer wrapper (GSAP-controlled by the
 * hero timeline) slides this element into place, while the shine itself is a
 * pure CSS background-position sweep on the static text. No JS animation loop,
 * no glow halo, no flashing: a narrow off-white highlight crosses the lime
 * text once after the entrance, then breathes before repeating.
 */
export default function ShinyText({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      data-shine
      className={`shine-text ${className}`}
      style={{ color: "transparent" }}
    >
      {children}
    </span>
  );
}
