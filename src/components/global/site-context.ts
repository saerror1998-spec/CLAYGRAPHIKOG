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
}

export const SiteContext = createContext<SiteContextValue | null>(null);

export function useSite(): SiteContextValue {
  const ctx = useContext(SiteContext);
  if (!ctx) {
    throw new Error("useSite must be used inside <SiteShell>");
  }
  return ctx;
}
