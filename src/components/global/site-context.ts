"use client";

import { createContext, useContext } from "react";
import type Lenis from "lenis";

export interface SiteContextValue {
  /** The single Lenis instance (null until mounted). */
  lenis: Lenis | null;
  /** True after the initial entry sequence has completed. */
  entryDone: boolean;
  /** Whether the underlay navigation is open. */
  menuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
  /** True while a column-wipe page transition is in progress. */
  isNavigating: boolean;
  /**
   * Navigate to an internal route with the column wipe transition.
   * If the menu is open, it closes first; the route change is delayed
   * ~180 ms so the cover animation begins while the menu is still
   * retracting — matching the reference's coordinated multi-layer feel.
   */
  navigate: (href: string) => void;
}

export const SiteContext = createContext<SiteContextValue | null>(null);

export function useSite(): SiteContextValue {
  const ctx = useContext(SiteContext);
  if (!ctx) {
    throw new Error("useSite must be used inside <SiteShell>");
  }
  return ctx;
}
