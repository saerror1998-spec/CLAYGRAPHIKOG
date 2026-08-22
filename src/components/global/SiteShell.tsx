"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { SiteContext } from "./site-context";
import SmoothScrollProvider from "./SmoothScrollProvider";
import Header from "./Header";
import Footer from "./Footer";
import UnderlayMenu from "./UnderlayMenu";
import InitialLoader from "./InitialLoader";
import ColumnPageTransition from "./ColumnPageTransition";
import SmoothCursor from "@/components/ui/SmoothCursor";
import type { ColumnTransitionHandle } from "./ColumnPageTransition";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";

const MENU_WIDTH = 400;

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
  const transitionRef = useRef<ColumnTransitionHandle>(null);
  const pathname = usePathname();
  const router = useRouter();
  const reduced = usePrefersReducedMotion();
  const menuOpenRef = useRef(menuOpen);
  menuOpenRef.current = menuOpen;
  const isNavigatingRef = useRef(isNavigating);
  isNavigatingRef.current = isNavigating;
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  const onLenisReady = useCallback((lenis: Lenis) => {
    setLenis(lenis);
  }, []);

  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), []);

  /**
   * Navigate with the column wipe transition — IMPERATIVE flow:
   * 1. Close menu if open (fire-and-forget, overlaps with cover)
   * 2. Start column cover immediately (same frame)
   * 3. Wait for full cover → router.push()
   * 4. Wait for pathname confirmation → scroll reset → reveal
   */
  const navigate = useCallback(
    (href: string) => {
      if (isNavigatingRef.current) return;
      const currentPath = window.location.pathname;
      if (currentPath === href) return;

      isNavigatingRef.current = true;
      setIsNavigating(true);

      // Close menu if open — fire and forget. The cover animation starts
      // in the same frame, so both animations overlap visually.
      if (menuOpenRef.current) {
        setMenuOpen(false);
      }

      // Start the cover animation immediately — no delay.
      transitionRef.current?.cover().then(async () => {
        try {
          // Full cover reached — push route while covered.
          await router.push(href);

          // Scroll to top while still covered.
          window.scrollTo(0, 0);
          lenis?.scrollTo(0, { immediate: true });

          // Wait 2 frames for the destination DOM to paint.
          await new Promise<void>((r) =>
            requestAnimationFrame(() => requestAnimationFrame(() => r())),
          );

          ScrollTrigger.refresh();

          // Reveal the new page.
          await transitionRef.current?.reveal();
        } finally {
          isNavigatingRef.current = false;
          setIsNavigating(false);
        }
      });
    },
    [router, lenis],
  );

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

  // Close the menu on route change (catches back/forward navigation).
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
          <div
            ref={stageRef}
            data-stage
            className="relative z-[2]"
            onClick={handleStageClick}
          >
            <div className="p-3 sm:p-4 lg:p-6">
              <div className="relative flex min-h-[calc(100svh-24px)] flex-col overflow-hidden rounded-[28px] bg-charcoal shadow-[0_0_90px_rgba(0,0,0,0.6)] ring-1 ring-white/[0.04] lg:min-h-[calc(100svh-48px)] lg:rounded-[32px]">
                <Header />
                <main id="main-content" className="flex-1">{children}</main>
                <Footer />
              </div>
            </div>
          </div>
        </div>

        <InitialLoader onDone={() => setEntryDone(true)} />
        <ColumnPageTransition ref={transitionRef} />
        <SmoothCursor />
      </SmoothScrollProvider>
    </SiteContext.Provider>
  );
}
