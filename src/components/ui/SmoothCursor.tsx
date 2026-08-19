"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Global smooth cursor — directional arrow that follows the pointer with
 * a premium spring feel. Uses GSAP quickTo (no extra dependencies).
 * Desktop fine-pointer only; disabled on touch/coarse devices.
 */

const DESKTOP_QUERY = "(any-hover: hover) and (any-pointer: fine)";

/** Clay Graphik arrow cursor SVG — Lime fill, dark stroke */
function CursorArrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={28}
      height={30}
      viewBox="0 0 50 54"
      fill="none"
      style={{ display: "block" }}
    >
      <path
        d="M42.6817 41.1495L27.5103 6.79925C26.7269 5.02557 24.2082 5.02558 23.3927 6.79925L7.59814 41.1495C6.75833 42.9759 8.52712 44.8902 10.4125 44.1954L24.3757 39.0496C24.8829 38.8627 25.4385 38.8627 25.9422 39.0496L39.8121 44.1954C41.6849 44.8902 43.4884 42.9759 42.6817 41.1495Z"
        fill="#CCFF00"
      />
      <path
        d="M43.7146 40.6933L28.5431 6.34306C27.3556 3.65428 23.5772 3.69516 22.3668 6.32755L6.57226 40.6778C5.3134 43.4156 7.97238 46.298 10.803 45.2549L24.7662 40.109C25.0221 40.0147 25.2999 40.0156 25.5494 40.1082L39.4193 45.254C42.2261 46.2953 44.9254 43.4347 43.7146 40.6933Z"
        stroke="#050505"
        strokeWidth={2}
      />
    </svg>
  );
}

export default function SmoothCursor() {
  const elRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const prevPosRef = useRef({ x: -100, y: -100 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const angleRef = useRef(0);
  const scaleRef = useRef(1);
  const settleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visibleRef = useRef(false);
  const rafRef = useRef(0);
  const cleanupRef = useRef<(() => void) | null>(null);

  const setup = useCallback(() => {
    const el = elRef.current;
    if (!el) return;

    // Check media query
    const mq = window.matchMedia(DESKTOP_QUERY);
    if (!mq.matches) return;

    // Smooth position using GSAP quickTo
    const qX = gsap.quickTo(el, "x", {
      duration: 0.15,
      ease: "power3.out",
    });
    const qY = gsap.quickTo(el, "y", {
      duration: 0.15,
      ease: "power3.out",
    });

    // Hide native cursor
    document.documentElement.classList.add("cg-custom-cursor");

    let lastTime = performance.now();

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;

      if (!visibleRef.current) {
        visibleRef.current = true;
        el.style.opacity = "1";
      }

      const now = performance.now();
      const dt = Math.max(now - lastTime, 1);
      lastTime = now;

      // Track velocity
      velocityRef.current = {
        x: (e.clientX - prevPosRef.current.x) / dt,
        y: (e.clientY - prevPosRef.current.y) / dt,
      };
      prevPosRef.current = { x: e.clientX, y: e.clientY };

      // Spring-follow position
      qX(e.clientX);
      qY(e.clientY);

      // Rotation
      const speed = Math.sqrt(
        velocityRef.current.x ** 2 + velocityRef.current.y ** 2,
      );
      if (speed > 0.08) {
        const target =
          Math.atan2(velocityRef.current.y, velocityRef.current.x) * (180 / Math.PI) + 90;

        // Shortest angle
        let diff = target - angleRef.current;
        while (diff > 180) diff -= 360;
        while (diff < -180) diff += 360;
        angleRef.current += diff;

        gsap.to(el, {
          rotation: angleRef.current,
          duration: 0.12,
          ease: "power2.out",
          overwrite: "auto",
        });

        // Compress during movement
        scaleRef.current = 0.94;
        gsap.to(el, {
          scale: 0.94,
          duration: 0.1,
          ease: "power2.out",
          overwrite: "auto",
        });

        // Settle timeout
        if (settleTimeoutRef.current) clearTimeout(settleTimeoutRef.current);
        settleTimeoutRef.current = setTimeout(() => {
          scaleRef.current = 1;
          gsap.to(el, {
            scale: 1,
            duration: 0.25,
            ease: "power2.out",
            overwrite: "auto",
          });
        }, 150);
      }
    };

    const onPointerLeave = () => {
      visibleRef.current = false;
      el.style.opacity = "0";
    };

    const onPointerEnter = () => {
      if (mq.matches) {
        visibleRef.current = true;
        el.style.opacity = "1";
      }
    };

    // Media query change handler
    const onMqChange = (e: MediaQueryListEvent) => {
      if (!e.matches) {
        visibleRef.current = false;
        el.style.opacity = "0";
        document.documentElement.classList.remove("cg-custom-cursor");
      } else {
        document.documentElement.classList.add("cg-custom-cursor");
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("pointerenter", onPointerEnter);
    mq.addEventListener("change", onMqChange);

    cleanupRef.current = () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("pointerenter", onPointerEnter);
      mq.removeEventListener("change", onMqChange);
      document.documentElement.classList.remove("cg-custom-cursor");
      if (settleTimeoutRef.current) clearTimeout(settleTimeoutRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    // Delay setup to ensure DOM is ready
    rafRef.current = requestAnimationFrame(setup);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      cleanupRef.current?.();
    };
  }, [setup]);

  return (
    <div
      ref={elRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 9999,
        pointerEvents: "none",
        willChange: "transform",
        opacity: 0,
        transform: "translate(-50%, -50%)",
      }}
    >
      <CursorArrow />
    </div>
  );
}
