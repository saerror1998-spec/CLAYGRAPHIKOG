"use client";

import { useRef, useCallback, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface DiaHeroTextRevealProps {
  /** The heading content — plain string or ReactNode with styled spans. */
  children: ReactNode;
  /** Additional className applied to the outer wrapper (h1 styling). */
  className?: string;
  /** Per-character stagger in seconds. @default 0.028 */
  stagger?: number;
  /** Total duration cap in seconds. @default 1.2 */
  maxDuration?: number;
  /** Delay before reveal starts (after page transition). @default 0.15 */
  delay?: number;
  /** Transient highlight colors cycled through during reveal. */
  trailColors?: string[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Collect all text nodes inside a DOM node (DFS). */
function getTextNodes(el: Node): Text[] {
  const nodes: Text[] = [];
  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";
      if (text.trim().length > 0) nodes.push(node as Text);
    } else {
      node.childNodes.forEach(walk);
    }
  };
  walk(el);
  return nodes;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const DEFAULT_TRAIL_COLORS = ["#CCFF00", "#F4F4EE", "#B9B9B3"];

export default function DiaHeroTextReveal({
  children,
  className,
  stagger = 0.028,
  maxDuration = 1.2,
  delay = 0.15,
  trailColors = DEFAULT_TRAIL_COLORS,
}: DiaHeroTextRevealProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  /* Store original computed color per character span. */
  const originalColors = useRef<Map<HTMLElement, string>>(new Map());

  /* ---- Wrap every text character in a span, preserving parent styling. */
  const wrapCharacters = useCallback(() => {
    const root = wrapperRef.current;
    if (!root) return;

    const textNodes = getTextNodes(root);

    textNodes.forEach((textNode) => {
      const text = textNode.textContent || "";
      const parent = textNode.parentElement;
      if (!parent) return;

      /* Compute the final color from the parent's computed style. */
      const computedColor = getComputedStyle(parent).color;

      const frag = document.createDocumentFragment();
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const span = document.createElement("span");
        span.textContent = char;
        span.style.display = "inline-block";
        span.style.willChange = "opacity, color";

        /* Preserve whitespace for layout. */
        if (char === " ") {
          span.style.whiteSpace = "pre";
        }

        originalColors.current.set(span, computedColor);
        frag.appendChild(span);
      }

      parent.replaceChild(frag, textNode);
    });
  }, []);

  /* ---- Animate the character reveal. */
  const animateReveal = useCallback(() => {
    const root = wrapperRef.current;
    if (!root || reduced) return;

    const chars = Array.from(root.querySelectorAll<HTMLElement>("span[style]"));
    if (chars.length === 0) return;

    /* Set initial state — characters invisible, no layout shift. */
    gsap.set(chars, { opacity: 0 });

    /* Build the timeline. */
    const tl = gsap.timeline();

    chars.forEach((char, i) => {
      const finalColor = originalColors.current.get(char) || "#F4F4EE";
      const trailColor = trailColors[i % trailColors.length];
      const charDelay = i * stagger;

      /* Phase 1: character appears with trail color. */
      tl.to(char, {
        opacity: 1,
        color: trailColor,
        duration: 0.08,
        ease: "none",
      }, delay + charDelay);

      /* Phase 2: trail color fades to final. */
      tl.to(char, {
        color: finalColor,
        duration: 0.18,
        ease: "power2.out",
      }, delay + charDelay + 0.08);
    });

    return () => {
      tl.kill();
    };
  }, [reduced, stagger, delay, trailColors, maxDuration]);

  /* ---- Set up on mount. */
  useGSAP(
    () => {
      const root = wrapperRef.current;
      if (!root) return;

      /* Wrap characters. */
      wrapCharacters();

      if (reduced) {
        /* Reduced motion: show everything immediately. */
        const chars = Array.from(root.querySelectorAll<HTMLElement>("span[style]"));
        chars.forEach((char) => {
          const finalColor = originalColors.current.get(char) || "#F4F4EE";
          char.style.opacity = "1";
          char.style.color = finalColor;
        });
        return;
      }

      /* Animate. */
      const cleanup = animateReveal();

      return () => {
        cleanup?.();
      };
    },
    { scope: wrapperRef, dependencies: [reduced, wrapCharacters, animateReveal] },
  );

  return (
    <span ref={wrapperRef} className={className} aria-label={typeof children === "string" ? children : undefined}>
      {children}
    </span>
  );
}
