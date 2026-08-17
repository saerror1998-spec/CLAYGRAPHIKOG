"use client";

/**
 * ShinyText — CSS-only shine surface for `THAT MOVE.`
 *
 * Ownership: this element owns ONLY the text gradient + background-position
 * (pure CSS). The outer wrapper (`.that-move-motion-wrapper`) is what GSAP
 * animates on entrance — GSAP never touches this span, and this span is never
 * SplitText-wrapped. This prevents the background-clip surface from being
 * broken by character wrappers.
 */
export default function ShinyText({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span data-shine className={`shine-text ${className}`}>
      {children}
    </span>
  );
}
