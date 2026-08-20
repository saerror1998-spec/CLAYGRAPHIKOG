"use client";

import React, { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

export type StackedSectionsProps = {
  children?: React.ReactNode;
  /** Scale covered panes while the next card rises. @default true */
  withDramaEffect?: boolean;
  /** Visible peek strip height in px between stacked cards. @default 48 */
  stackOffset?: number;
  /** CSS height of each card (not the total pinned area). @default "66vh" */
  cardHeight?: string;
  /** Tailwind classes for each card */
  cardClassName?: string;
  className?: string;
};

/**
 * GSAP ScrollTrigger stacked card deck.
 *
 * Cards are absolutely positioned inside a pinned container.
 * Card 0 enters first. Then each subsequent card slides up and overlaps,
 * pushing earlier cards up and scaling them down.
 *
 * The pin container height is calculated dynamically to accommodate
 * all card entrances plus stacking transitions.
 */
export default function StackedSections({
  children,
  withDramaEffect = true,
  stackOffset = 48,
  cardHeight = "66vh",
  cardClassName,
  className,
}: StackedSectionsProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const items = React.Children.toArray(children);
  const total = items.length;

  useGSAP(
    () => {
      if (!wrapperRef.current || total === 0) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        return;

      const deck = wrapperRef.current.querySelector<HTMLElement>(
        "[data-stack-deck]",
      );
      if (!deck) return;

      const cards = Array.from(
        deck.querySelectorAll<HTMLElement>("[data-stack-pane]"),
      );
      if (cards.length === 0) return;

      const ctx = gsap.context(() => {
        // --- Phase 1: Card 0 enters from below to position 0 ---
        // --- Phase 2+: Each card slides up while previous cards shift up ---
        //
        // Timeline: 0 → 1
        // Segment per card = 1/total
        //
        // For card i (i > 0):
        //   - slides from yPercent:100 to yPercent:(100 - i * stackOffsetPct)
        //   - where stackOffsetPct makes the card stop stackOffset px above where it started
        //
        // For card i (i < current):
        //   - shifts from its position to position -stackOffset px
        //   - scales down proportionally

        // Segment sizes: first card enters quickly, each stacking transition is ~65vh
        const enterFraction = 0.22; // card 0 entrance
        const stackFraction = (1 - enterFraction) / Math.max(total - 1, 1); // per stacking transition

        // Initialize: all cards off-screen below
        cards.forEach((card, i) => {
          gsap.set(card, {
            yPercent: 100,
            opacity: 1,
            zIndex: i + 1,
            scale: 1,
          });
        });

        // Build timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top top",
            // Compact: ~50vh for first card entrance + ~65vh per stacking transition
            end: () => `+=${window.innerHeight * (0.5 + (total - 1) * 0.65 + 0.3)}`,
            pin: true,
            scrub: 0.4,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        cards.forEach((card, i) => {
          const segStart = i === 0 ? 0 : enterFraction + (i - 1) * stackFraction;
          const isLast = i === total - 1;

          if (i === 0) {
            // Card 0: enters from below to position 0
            tl.to(
              card,
              {
                yPercent: 0,
                duration: enterFraction,
                ease: "none",
              },
              0,
            );
          } else {
            // Card i: enters from below, stops at stackOffset * i above its natural position
            // Natural position = 0 (all cards start at top:0 via absolute)
            // Stacked position = -(i * stackOffset) px from natural top
            // In percent: 100% - (stackOffset * i / cardHeight * 100)%
            // Approximate: we want the card to stop such that it sits
            // stackOffset px above the previous card's resting position.
            //
            // Actually simpler: the target yPercent = -(i * stackOffset / cardHeightPx * 100)
            // We don't know cardHeightPx precisely, so use a different approach:
            // Move card to yPercent = -(i * stackOffset / (cardHeight in px * 0.01))
            //
            // Better: just target a specific pixel offset via y instead of yPercent
            const targetY = -(i * stackOffset); // negative = moves up from natural position

            // Card slides from below (yPercent:100 = one full card height below)
            // to target position
            tl.to(
              card,
              {
                yPercent: 0,
                y: targetY,
                duration: stackFraction,
                ease: "none",
              },
              segStart,
            );

            // As this card enters, shift all previous cards up by stackOffset
            if (withDramaEffect) {
              for (let j = 0; j < i; j++) {
                const prevCard = cards[j];
                const prevTargetY = -((i - j) * stackOffset);
                const depth = total - 1 - j;
                const targetScale = Math.max(0.92, 1 - depth * 0.02);

                tl.to(
                  prevCard,
                  {
                    y: prevTargetY,
                    scale: targetScale,
                    duration: stackFraction,
                    ease: "none",
                  },
                  segStart,
                );
              }
            }
          }
        });
      }, { scope: wrapperRef });

      return () => ctx.revert();
    },
    { scope: wrapperRef, dependencies: [total, stackOffset, withDramaEffect] },
  );

  if (total === 0) return null;

  return (
    <div ref={wrapperRef} className={className}>
      <div
        data-stack-deck=""
        className="relative w-full"
        style={{
          // Deck needs height for the cards inside. Since cards are absolute,
          // we give it the height of a single card.
          height: cardHeight,
          overflow: "visible",
        }}
      >
        {items.map((child, index) => (
          <div
            key={
              React.isValidElement(child) && child.key != null
                ? child.key
                : `stack-pane-${index}`
            }
            data-stack-pane=""
            className="absolute inset-x-0 top-0 origin-[50%_0%]"
            style={{
              zIndex: index + 1,
            }}
          >
            <div
              className={cardClassName}
              style={{ height: cardHeight }}
            >
              <div className="h-full origin-[50%_0%]">{child}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
