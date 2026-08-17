"use client";

import { useLayoutEffect, useState } from "react";

/**
 * Tracks the user's prefers-reduced-motion preference.
 * The initial read happens in a layout effect (before paint) so no animated
 * UI ever flashes for reduced-motion users.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
