"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { useSite } from "./site-context";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";
import { navigation, socials } from "@/data/siteContent";

const MENU_ITEMS = navigation.map((item, i) => ({
  ...item,
  number: `0${i + 1}`,
}));

const SOCIALS = socials;

/**
 * Underlay navigation revealed from the right beneath the foreground stage.
 * Desktop: pre-layers + panel slide in, labels rise from yPercent 140 with
 * slight rotation, numbering and socials reveal separately (menu.txt rhythm).
 * Mobile: full-screen overlay with the same typography/stagger/numbering.
 */
export default function UnderlayMenu() {
  const { menuOpen, closeMenu } = useSite();
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const openTweenRef = useRef<gsap.core.Timeline | null>(null);

  // Initial hidden state (before first paint).
  useGSAP(
    () => {
      // Read the live preference directly rather than trusting the hook's
      // snapshot: during hydration the hook can briefly return the server
      // value (false), and if the non-reduced hidden-state pass ran even
      // once it would leave a residual inline transform that fights the
      // reduced class path and traps the panel offscreen.
      const reducedNow =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reducedNow) {
        // Reduced motion: the panel/labels are shown/hidden by CSS classes,
        // so clear any residual GSAP transforms and let the class path own
        // layout.
        gsap.set("[data-underlay-layer], [data-underlay-panel]", { clearProps: "transform" });
        gsap.set("[data-menu-item-label]", { clearProps: "transform" });
        gsap.set("[data-menu-number]", { clearProps: "opacity" });
        gsap.set("[data-menu-social]", { clearProps: "transform,opacity" });
        return;
      }
      gsap.set("[data-underlay-layer], [data-underlay-panel]", { xPercent: 100 });
      gsap.set("[data-menu-item-label]", { yPercent: 140, rotate: 10 });
      gsap.set("[data-menu-number]", { opacity: 0 });
      gsap.set("[data-menu-social]", { y: 25, opacity: 0 });
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  const playOpen = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    openTweenRef.current?.kill();

    const layers = Array.from(root.querySelectorAll("[data-underlay-layer]"));
    const panel = root.querySelector("[data-underlay-panel]");
    if (!panel) return;

    const labels = Array.from(root.querySelectorAll("[data-menu-item-label]"));
    const numbers = Array.from(root.querySelectorAll("[data-menu-number]"));
    const socials = Array.from(root.querySelectorAll("[data-menu-social]"));

    gsap.set([...layers, panel], { xPercent: 100 });
    gsap.set(labels, { yPercent: 140, rotate: 10 });
    gsap.set(numbers, { opacity: 0 });
    gsap.set(socials, { y: 25, opacity: 0 });

    const tl = gsap.timeline();
    layers.forEach((el, i) => {
      tl.fromTo(
        el,
        { xPercent: 100 },
        { xPercent: 0, duration: 0.5, ease: "power4.out" },
        i * 0.07,
      );
    });

    const insert = layers.length * 0.07 + 0.08;
    tl.fromTo(
      panel,
      { xPercent: 100 },
      { xPercent: 0, duration: 0.6, ease: "power4.out" },
      insert,
    );

    const itemsStart = insert + 0.12;
    tl.to(
      labels,
      { yPercent: 0, rotate: 0, duration: 1, ease: "power4.out", stagger: 0.1 },
      itemsStart,
    );
    tl.to(
      numbers,
      { opacity: 1, duration: 0.6, ease: "power2.out", stagger: 0.08 },
      itemsStart + 0.15,
    );
    tl.to(
      socials,
      { y: 0, opacity: 1, duration: 0.55, ease: "power3.out", stagger: 0.08 },
      insert + 0.5,
    );

    openTweenRef.current = tl;
  }, []);

  const playClose = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    openTweenRef.current?.kill();
    openTweenRef.current = null;

    const panel = root.querySelector("[data-underlay-panel]");
    if (!panel) return;

    const layers = Array.from(root.querySelectorAll("[data-underlay-layer]"));
    const labels = Array.from(root.querySelectorAll("[data-menu-item-label]"));
    const numbers = Array.from(root.querySelectorAll("[data-menu-number]"));
    const socials = Array.from(root.querySelectorAll("[data-menu-social]"));

    // Close is faster than open.
    gsap.to([...layers, panel], {
      xPercent: 100,
      duration: 0.32,
      ease: "power3.in",
      overwrite: "auto",
      onComplete: () => {
        gsap.set(labels, { yPercent: 140, rotate: 10 });
        gsap.set(numbers, { opacity: 0 });
        gsap.set(socials, { y: 25, opacity: 0 });
      },
    });
  }, []);

  // Open/close driven by the open-state changes only. The initial mount is
  // skipped on purpose: running playClose() for an already-closed menu would
  // leave a residual inline transform on the panel (visible in reduced-motion
  // sessions, where the class-based show/hide must own the layout).
  const prevOpenRef = useRef(false);
  useEffect(() => {
    const wasOpen = prevOpenRef.current;
    prevOpenRef.current = menuOpen;
    if (menuOpen === wasOpen) return; // mount + no-op toggles
    if (reduced) return;
    if (menuOpen) {
      playOpen();
    } else {
      playClose();
    }
  }, [menuOpen, reduced, playOpen, playClose]);

  // Escape to close.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen, closeMenu]);

  const desktopPanelHidden = reduced ? (!menuOpen ? "translate-x-full" : "translate-x-0") : "";
  const mobileHidden = menuOpen ? "opacity-100" : "opacity-0 pointer-events-none";

  // Keyboard: move focus into the menu when it opens.
  useEffect(() => {
    if (!menuOpen) return;
    const root = rootRef.current;
    if (!root) return;
    const firstLink = root.querySelector<HTMLAnchorElement>(
      "[data-underlay-panel] a, [data-underlay-mobile] a",
    );
    firstLink?.focus({ preventScroll: true });
  }, [menuOpen]);

  return (
    <div ref={rootRef}>
      {/* ---- Desktop underlay ---- */}
      <div
        id="underlay-menu"
        className="fixed inset-y-0 right-0 z-[1] hidden lg:flex"
        inert={!menuOpen}
      >
        {/* Pre-layers */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div data-underlay-layer className="absolute inset-0 bg-[#0a0a0a]" />
          <div data-underlay-layer className="absolute inset-0 bg-[#0f0f0f]" />
        </div>

        {/* Panel */}
        <aside
          data-underlay-panel
          className={`relative flex h-full w-[400px] flex-col justify-between border-l border-white/[0.06] bg-carbon px-10 py-8 transition-transform duration-300 ease-out ${desktopPanelHidden}`}
        >
          <div className="flex items-center justify-between">
            <Link href="/" onClick={closeMenu} aria-label="Clay Graphik — Home">
              <Image
                src="/brand/clay-graphik-logo.png"
                alt="Clay Graphik"
                width={110}
                height={30}
                className="h-5 w-auto"
                priority
              />
            </Link>
            <button
              type="button"
              onClick={closeMenu}
              className="label cursor-pointer hover:text-offwhite"
              aria-label="Close menu"
            >
              CLOSE
            </button>
          </div>

          <nav aria-label="Underlay navigation">
            <ul className="space-y-1">
              {MENU_ITEMS.map((item) => (
                <li key={item.href} className="group flex items-baseline gap-4 overflow-hidden py-1">
                  <span
                    data-menu-number
                    className="label w-6 shrink-0 pt-2 text-lime"
                    aria-hidden="true"
                  >
                    {item.number}
                  </span>
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className="block overflow-hidden"
                    aria-label={`Go to ${item.label}`}
                  >
                    <span
                      data-menu-item-label
                      className="block text-[44px] font-medium uppercase leading-[1.1] tracking-tighter text-offwhite transition-colors duration-300 group-hover:text-lime lg:text-[52px]"
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-white/[0.06] pt-6">
            <ul className="mb-6 flex gap-5">
              {SOCIALS.map((s) => (
                <li key={s.label} data-menu-social>
                  <a
                    href={s.href}
                    target={s.external ? "_blank" : undefined}
                    rel={s.external ? "noopener noreferrer" : undefined}
                    className="label cursor-pointer transition-colors hover:text-lime"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <Link
              href="/contact"
              onClick={closeMenu}
              data-menu-social
              className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.08em] text-offwhite transition-colors hover:text-lime"
            >
              START A PROJECT
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
            <p className="label mt-8">DUBAI, UAE</p>
          </div>
        </aside>
      </div>

      {/* ---- Mobile full-screen menu ---- */}
      <div
        data-underlay-mobile
        className={`fixed inset-0 z-[30] flex flex-col justify-between bg-carbon px-6 pb-10 pt-6 transition-opacity duration-300 lg:hidden ${mobileHidden}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!menuOpen}
      >
        <div className="flex items-center justify-between">
          <Image
            src="/brand/clay-graphik-logo.png"
            alt="Clay Graphik"
            width={110}
            height={30}
            className="h-5 w-auto"
          />
          <button
            type="button"
            onClick={closeMenu}
            className="label cursor-pointer"
            aria-label="Close menu"
          >
            CLOSE
          </button>
        </div>

        <nav aria-label="Mobile navigation">
          <ul className="space-y-1">
            {MENU_ITEMS.map((item) => (
              <li key={item.href} className="group flex items-baseline gap-3 overflow-hidden py-1.5">
                <span data-menu-number className="label w-5 shrink-0 pt-1 text-lime" aria-hidden="true">
                  {item.number}
                </span>
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  className="block overflow-hidden"
                  aria-label={`Go to ${item.label}`}
                >
                  <span
                    data-menu-item-label
                    className="block text-[40px] font-medium uppercase leading-[1.05] tracking-tighter text-offwhite transition-colors duration-300 group-hover:text-lime"
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-white/[0.06] pt-5">
          <div className="mb-5 flex gap-5">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.external ? "_blank" : undefined}
                rel={s.external ? "noopener noreferrer" : undefined}
                className="label transition-colors hover:text-lime"
              >
                {s.label}
              </a>
            ))}
          </div>
          <Link
            href="/contact"
            onClick={closeMenu}
            className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.08em] text-offwhite"
          >
            START A PROJECT <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
