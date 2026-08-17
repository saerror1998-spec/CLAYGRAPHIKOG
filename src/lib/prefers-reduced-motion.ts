"use client";

import { useSyncExternalStore } from "react";

/**
 * Tracks prefers-reduced-motion with a synchronous, hydration-safe read.
 *
 * useSyncExternalStore resolves the live value (via getSnapshot) before the
 * first paint — so client components see the correct preference on their very
 * first render and no GSAP/CSS "non-reduced" pass ever leaks into a
 * reduced-motion session. The server snapshot (false) keeps SSR HTML
 * consistent during hydration.
 */
const subscribe = (onStoreChange: () => void) => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
};

const getSnapshot = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const getServerSnapshot = () => false;

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
