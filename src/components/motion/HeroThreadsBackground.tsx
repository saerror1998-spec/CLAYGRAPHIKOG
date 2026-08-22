"use client";

import { useEffect, useRef, useCallback } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";

/* ------------------------------------------------------------------ */
/*  GLSL — procedural flowing threads                                  */
/* ------------------------------------------------------------------ */

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uAmplitude;
uniform float uDistance;
uniform vec3 uColor;
uniform float uOpacity;

// Simple hash for pseudo-random per-thread variation
float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

// Smooth noise
float noise(float x) {
  float i = floor(x);
  float f = fract(x);
  float a = hash(i);
  float b = hash(i + 1.0);
  return mix(a, b, f * f * (3.0 - 2.0 * f));
}

// Thread wave function — each thread has unique phase/speed/amplitude
float threadWave(float x, float threadId, float time) {
  float phase = threadId * 1.618; // golden ratio offset
  float speed = 0.3 + hash(threadId) * 0.4;
  float freq = 0.8 + hash(threadId + 100.0) * 0.6;
  float amp = uAmplitude * (0.6 + hash(threadId + 200.0) * 0.4);

  float wave = sin(x * freq + time * speed + phase) * amp;
  wave += sin(x * freq * 1.7 + time * speed * 0.7 + phase * 2.3) * amp * 0.3;
  wave += noise(x * 2.0 + time * speed * 0.5 + phase) * amp * 0.15;

  return wave;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;

  // Normalized coordinates
  float x = uv.x * aspect;
  float y = uv.y;

  // Mouse influence — subtle displacement
  float mx = uMouse.x * aspect;
  float my = uMouse.y;
  float mouseDist = length(vec2(x, y) - vec2(mx, my));
  float mouseInfluence = uDistance * exp(-mouseDist * 2.5) * 0.5;

  // Accumulate thread contributions
  float threads = 0.0;
  float totalThreads = 16.0;

  for (float i = 0.0; i < 16.0; i++) {
    // Thread vertical position — spread across hero
    float threadY = 0.08 + (i / totalThreads) * 0.84;

    // Thread wave
    float wave = threadWave(x, i, uTime);

    // Mouse displacement
    wave += mouseInfluence * sin(i * 0.5 + uTime);

    // Distance from this thread's center
    float dist = abs(y - (threadY + wave));

    // Thread thickness — very thin, with depth variation
    float thickness = 0.0015 + hash(i + 300.0) * 0.001;

    // Brightness — sharp falloff from thread center
    float brightness = smoothstep(thickness, 0.0, dist);

    // Depth layer — threads further back are dimmer
    float depth = 0.3 + hash(i + 400.0) * 0.7;
    brightness *= depth;

    threads += brightness;
  }

  // Clamp and apply color
  threads = clamp(threads, 0.0, 1.0);

  // Output: lime threads on transparent background
  vec3 color = uColor * threads;
  float alpha = threads * uOpacity;

  gl_FragColor = vec4(color, alpha);
}
`;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface HeroThreadsBackgroundProps {
  className?: string;
  /** Pause animation when offscreen. @default true */
  pauseOffscreen?: boolean;
}

export default function HeroThreadsBackground({
  className = "",
  pauseOffscreen = true,
}: HeroThreadsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  const rafRef = useRef(0);
  const pausedRef = useRef(false);
  const hiddenRef = useRef(false);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const startTimeRef = useRef(0);

  /* ---- Mouse tracking (passive, no pointer capture). */
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: 1.0 - (e.clientY - rect.top) / rect.height, // flip Y for GL
    };
  }, []);

  /* ---- Main effect. */
  useEffect(() => {
    if (reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    /* Renderer */
    const renderer = new Renderer({
      canvas,
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio, 1.5),
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    /* Program */
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [canvas.width, canvas.height] },
        uMouse: { value: [0.5, 0.5] },
        uAmplitude: { value: 1.4 },
        uDistance: { value: 0.4 },
        uColor: { value: [0.8, 1.0, 0.0] }, // #CCFF00
        uOpacity: { value: 0.35 },
      },
    });

    /* Fullscreen quad */
    const geo = new Triangle(gl);
    const mesh = new Mesh(gl, { geometry: geo, program });

    startTimeRef.current = performance.now() / 1000;

    /* Resize handler. */
    const onResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [w * dpr, h * dpr];
    };
    onResize();
    window.addEventListener("resize", onResize);

    /* Render loop. */
    const render = () => {
      if (pausedRef.current || hiddenRef.current) {
        rafRef.current = requestAnimationFrame(render);
        return;
      }
      const t = performance.now() / 1000 - startTimeRef.current;
      program.uniforms.uTime.value = t;
      program.uniforms.uMouse.value = [mouseRef.current.x, mouseRef.current.y];
      renderer.render({ scene: mesh });
      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);

    /* Tab visibility. */
    const onVisChange = () => {
      hiddenRef.current = document.hidden;
    };
    document.addEventListener("visibilitychange", onVisChange);

    /* Mouse listener. */
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("visibilitychange", onVisChange);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [reduced, onMouseMove]);

  /* ---- IntersectionObserver for offscreen pause. */
  useEffect(() => {
    if (!pauseOffscreen || reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        pausedRef.current = !entry.isIntersecting;
      },
      { threshold: 0.05 },
    );
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [pauseOffscreen, reduced]);

  /* ---- Reduced motion: static dark background only. */
  if (reduced) {
    return <div className={`absolute inset-0 bg-charcoal ${className}`} />;
  }

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 h-full w-full ${className}`}
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    />
  );
}
