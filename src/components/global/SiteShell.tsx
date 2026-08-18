"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type Lenis from "lenis";
import { gsap } from "@/lib/gsap";
import { SiteContext } from "./site-context";
import SmoothScrollProvider from "./SmoothScrollProvider";
import Header from "./Header";
import Footer from "./Footer";
import UnderlayMenu from "./UnderlayMenu";
import InitialLoader from "./InitialLoader";
import ColumnPageTransition from "./ColumnPageTransition";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";

const MENU_WIDTH = 400;
const MENU_CLOSE_DELAY = 150; // ms — column wipe starts this long after menu close begins

/**
 * The Clay Graphik canvas:
 *   outer canvas (Carbon Black)
 *   └─ underlay navigation (fixed, revealed from the right)
 *   └─ foreground stage (Deep Charcoal, rounded, contained) — shifts left
 *      and reframes slightly when the menu opens on desktop.
 */
export default function SiteShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [entryDone, setEntryDone] = useState(false);
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const reduced = usePrefersReducedMotion();
  const menuOpenRef = useRef(menuOpen);
  menuOpenRef.current = menuOpen;
  const isNavigatingRef = useRef(isNavigating);
  isNavigatingRef.current = isNavigating;

  const onLenisReady = useCallback((lenis: Lenis) => {
    setLenis(lenis);
  }, []);

  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), []);

  /**
   * Navigate with the column wipe transition.
   * If the menu is open it closes first; the route change is delayed so the
   * column cover begins while the menu is still retracting.
   */
  const navigate = useCallback(
    (href: string) => {
      if (isNavigatingRef.current) return;
      const currentPath = window.location.pathname;
      if (currentPath === href) return;

      setIsNavigating(true);

      if (menuOpenRef.current) {
        setMenuOpen(false);
        setTimeout(() => {
          router.push(href);
        }, MENU_CLOSE_DELAY);
      } else {
        router.push(href);
      }
    },
    [router],
  );

  // Unlock navigation after the column reveal completes.
  // The ColumnPageTransition sets isNavigating via context — we listen to a
  // custom event so the transition component can signal completion without
  // direct state coupling.
  useEffect(() => {
    const onTransitionDone = () => setIsNavigating(false);
    window.addEventListener("column-transition-done", onTransitionDone);
    return () =>
      window.removeEventListener("column-transition-done", onTransitionDone);
  }, []);

  // Lock scrolling during the entry sequence.
  useEffect(() => {
    if (!lenis) return;
    if (!entryDone) lenis.stop();
    else lenis.start();
  }, [entryDone, lenis]);

  // Lock scrolling while the mobile menu is open.
  useEffect(() => {
    if (!lenis || typeof window === "undefined") return;
    const isMobile = window.innerWidth < 1024;
    if (menuOpen && isMobile) lenis.stop();
    else lenis.start();
  }, [menuOpen, lenis]);

  // Foreground stage shift (desktop only). The shift is layout-critical —
  // without it the underlay would stay hidden behind the stage — so it also
  // applies in reduced-motion mode, but INSTANTLY (no tween).
  // IMPORTANT: never leave a residual transform on the stage when closed —
  // a transformed ancestor becomes the containing block for fixed elements
  // and breaks ScrollTrigger's fixed pinning inside the stage.
  const stageMountedRef = useRef(false);
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (!stageMountedRef.current) {
      stageMountedRef.current = true;
      return; // skip the initial no-op animation
    }
    if (window.innerWidth < 1024) return;

    const scale = 0.7;
    const vw = window.innerWidth;
    const gap = 24;
    const shift = MENU_WIDTH + gap - (vw * (1 - scale)) / 2;

    if (menuOpen) {
      if (reduced) {
        gsap.set(stage, { x: -shift, scale, transformOrigin: "50% 0%" });
      } else {
        gsap.to(stage, {
          x: -shift,
          scale,
          duration: 0.8,
          ease: "power4.inOut",
          transformOrigin: "50% 0%",
        });
      }
    } else if (reduced) {
      gsap.set(stage, { clearProps: "transform" });
    } else {
      gsap.to(stage, {
        x: 0,
        scale: 1,
        duration: 0.55,
        ease: "power3.inOut",
        onComplete: () => {
          if (!menuOpenRef.current) gsap.set(stage, { clearProps: "transform" });
        },
      });
    }
  }, [menuOpen, reduced]);

  // Close the menu on route change (the navigate() function already handles
  // this for menu-triggered navigations; this catches back/forward and
  // Header/footer clicks).
  useEffect(() => {
    if (menuOpenRef.current) setMenuOpen(false);
  }, [pathname]);

  // Click-away: clicking the stage while the menu is open closes it.
  const handleStageClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!menuOpenRef.current) return;
      if ((e.target as HTMLElement).closest("[data-menu-toggle]")) return;
      setMenuOpen(false);
    },
    [],
  );

  const contextValue = useMemo(
    () => ({
      lenis,
      entryDone,
      menuOpen,
      openMenu,
      closeMenu,
      toggleMenu,
      isNavigating,
      navigate,
    }),
    [lenis, entryDone, menuOpen, openMenu, closeMenu, toggleMenu, isNavigating, navigate],
  );

  return (
    <SiteContext.Provider value={contextValue}>
      <SmoothScrollProvider onReady={onLenisReady}>
        <UnderlayMenu />
        <div className="relative min-h-screen overflow-x-clip bg-carbon">
          {/* Foreground stage */}
          {/* NOTE: no will-change/transform on this wrapper — a transformed
              ancestor would become the containing block for fixed elements
              and break ScrollTrigger's fixed pinning inside the stage. */}
          <div
            ref={stageRef}
            data-stage
            className="relative z-[2]"
            onClick={handleStageClick}
          >
            <div className="p-3 sm:p-4 lg:p-6">
              <div className="relative flex min-h-[calc(100svh-24px)] flex-col overflow-hidden rounded-[28px] bg-charcoal shadow-[0_0_90px_rgba(0,0,0,0.6)] ring-1 ring-white/[0.04] lg:min-h-[calc(100svh-48px)] lg:rounded-[32px]">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </div>
          </div>
        </div>

        <InitialLoader onDone={() => setEntryDone(true)} />
        <ColumnPageTransition />
      </SmoothScrollProvider>
    </SiteContext.Provider>
  );
}
