"use client";

import Link from "next/link";
import Image from "next/image";
import { useSite } from "./site-context";

/**
 * Minimal header: official Clay Graphik logo — left, Menu button — right.
 * The label cycles MENU / CLOSE via a CSS transform (no JS animation loop).
 */
export default function Header() {
  const { menuOpen, toggleMenu } = useSite();

  return (
    <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 pt-6 sm:px-8 sm:pt-8 lg:px-10 lg:pt-10">
      <Link href="/" aria-label="Clay Graphik — Home" className="inline-block">
        <Image
          src="/brand/clay-graphik-logo.png"
          alt="Clay Graphik"
          width={118}
          height={32}
          className="h-[22px] w-auto sm:h-6"
          priority
        />
      </Link>

      <button
        type="button"
        data-menu-toggle
        onClick={toggleMenu}
        aria-expanded={menuOpen}
        aria-controls="underlay-menu"
        className="group flex cursor-pointer items-center gap-3"
      >
        <span className="relative block h-[11px] overflow-hidden" aria-hidden="true">
          <span
            className={`block text-[11px] font-medium uppercase tracking-[0.18em] text-offwhite transition-transform duration-300 ease-out ${
              menuOpen ? "-translate-y-full" : "translate-y-0"
            }`}
          >
            MENU
          </span>
          <span
            className={`absolute left-0 top-full block text-[11px] font-medium uppercase tracking-[0.18em] text-lime transition-transform duration-300 ease-out ${
              menuOpen ? "-translate-y-full" : "translate-y-0"
            }`}
          >
            MENU
          </span>
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
        </span>
        <span className="relative block h-4 w-4" aria-hidden="true">
          <span
            className={`absolute left-1/2 top-1/2 h-[1.5px] w-4 -translate-x-1/2 -translate-y-1/2 bg-offwhite transition-transform duration-300 ease-out ${
              menuOpen ? "rotate-0" : ""
            }`}
          />
          <span
            className={`absolute left-1/2 top-1/2 h-4 w-[1.5px] -translate-x-1/2 -translate-y-1/2 bg-offwhite transition-transform duration-300 ease-out ${
              menuOpen ? "rotate-90 opacity-0" : "rotate-0"
            }`}
          />
        </span>
      </button>
    </header>
  );
}
