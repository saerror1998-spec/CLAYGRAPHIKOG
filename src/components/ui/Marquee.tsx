"use client";

import React from "react";
import "./marquee.css";

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Repeat the children group this many times to fill the viewport. @default 5 */
  repeat?: number;
  /** Reverse the marquee direction. */
  reverse?: boolean;
  /** Pause the marquee animation on hover. */
  pauseOnHover?: boolean;
  /** Apply a subtle edge mask. @default true */
  applyMask?: boolean;
}

/**
 * CSS-based infinite horizontal marquee.
 * Each child group is repeated `repeat` times with `flex shrink-0`.
 * Animation is pure CSS (`@keyframes marquee-x`) for zero JS runtime cost.
 */
export default function Marquee({
  children,
  repeat = 5,
  pauseOnHover = false,
  reverse = false,
  className,
  applyMask = true,
  ...props
}: MarqueeProps) {
  const wrapperClass = [
    "group/marquee relative flex h-full p-0 flex-row w-max",
    "[--duration:10s] [--gap:12px] [gap:var(--gap)]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const groupClass = [
    "flex shrink-0 [gap:var(--gap)]",
    "marquee-horizontal flex-row",
    pauseOnHover ? "marquee-pause-on-hover" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div {...props} className={wrapperClass}>
      {Array.from({ length: repeat }).map((_, index) => (
        <div
          key={`item-${index}`}
          className={groupClass}
          style={reverse ? { animationDirection: "reverse" } : undefined}
        >
          {children}
        </div>
      ))}
      {applyMask && (
        <div className="pointer-events-none absolute inset-0 z-10 h-full w-full bg-linear-to-r from-[#050505]/60 from-[3%] via-transparent via-[50%] to-[#050505]/60 to-[97%]" />
      )}
    </div>
  );
}
