"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePrefersReducedMotion } from "@/lib/prefers-reduced-motion";

/* ------------------------------------------------------------------ */
/*  GLSL — procedural flowing threads (raw WebGL)                      */
/* ------------------------------------------------------------------ */

const VERT = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uAmplitude;
uniform float uDistance;
uniform vec3 uColor;

float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

float noise(float x) {
  float i = floor(x);
  float f = fract(x);
  float a = hash(i);
  float b = hash(i + 1.0);
  return mix(a, b, f * f * (3.0 - 2.0 * f));
}

float threadWave(float x, float threadId, float time) {
  float phase = threadId * 1.618;
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
  float x = uv.x * aspect;
  float y = uv.y;

  float mx = uMouse.x * aspect;
  float my = uMouse.y;
  float mouseDist = length(vec2(x, y) - vec2(mx, my));
  float mouseInfluence = uDistance * exp(-mouseDist * 2.5) * 0.5;

  float threads = 0.0;
  float totalThreads = 16.0;

  for (float i = 0.0; i < 16.0; i++) {
    float threadY = 0.08 + (i / totalThreads) * 0.84;
    float wave = threadWave(x, i, uTime);
    wave += mouseInfluence * sin(i * 0.5 + uTime);
    float dist = abs(y - (threadY + wave));

    float thickness = 0.004 + hash(i + 300.0) * 0.003;
    float brightness = smoothstep(thickness, 0.0, dist);
    float depth = 0.5 + hash(i + 400.0) * 0.5;
    brightness *= depth;

    threads += brightness;
  }

  threads = clamp(threads, 0.0, 1.0);
  float alpha = clamp(threads * 1.4, 0.0, 1.0);
  vec3 premulColor = uColor * alpha;

  gl_FragColor = vec4(premulColor, alpha);
}
`;

/* ------------------------------------------------------------------ */
/*  WebGL helpers                                                      */
/* ------------------------------------------------------------------ */

function compileShader(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertSrc: string,
  fragSrc: string,
) {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vertSrc);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);
  if (!vs || !fs) return null;

  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(prog));
    return null;
  }
  return prog;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface HeroThreadsBackgroundProps {
  className?: string;
  pauseOffscreen?: boolean;
}

export default function HeroThreadsBackground({
  className = "",
  pauseOffscreen = true,
}: HeroThreadsBackgroundProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: 1.0 - (e.clientY - rect.top) / rect.height,
    };
  }, []);

  useEffect(() => {
    const ctn = wrapRef.current;
    if (!ctn || reduced) return;

    /* Create canvas and append to container (matching Aurora pattern). */
    const canvas = document.createElement("canvas");
    canvas.style.pointerEvents = "none";
    canvas.setAttribute("aria-hidden", "true");
    ctn.appendChild(canvas);

    const dpr = Math.min(window.devicePixelRatio, 1.5);
    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) {
      ctn.removeChild(canvas);
      return;
    }

    /* Enable blending for transparent output (premultiplied alpha). */
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    /* Compile shaders. */
    const program = createProgram(gl, VERT, FRAG);
    if (!program) {
      ctn.removeChild(canvas);
      return;
    }
    gl.useProgram(program);

    /* Fullscreen quad: two triangles. */
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    /* Uniform locations. */
    const uTime = gl.getUniformLocation(program, "uTime");
    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uMouse = gl.getUniformLocation(program, "uMouse");
    const uAmplitude = gl.getUniformLocation(program, "uAmplitude");
    const uDistance = gl.getUniformLocation(program, "uDistance");
    const uColor = gl.getUniformLocation(program, "uColor");

    /* Resize handler. */
    const resize = () => {
      const w = Math.max(1, Math.floor(ctn.offsetWidth));
      const h = Math.max(1, Math.floor(ctn.offsetHeight));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(ctn);

    /* Initial size. */
    resize();

    /* Render loop. */
    const startTime = performance.now() / 1000;
    let visible = true;
    let rafId = 0;

    const render = () => {
      rafId = 0;
      if (!visible) return;

      const t = performance.now() / 1000 - startTime;
      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
      gl.uniform1f(uAmplitude, 1.4);
      gl.uniform1f(uDistance, 0.4);
      gl.uniform3f(uColor, 0.8, 1.0, 0.0);

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      rafId = requestAnimationFrame(render);
    };

    /* IntersectionObserver for offscreen pause. */
    let observer: IntersectionObserver | null = null;
    if (pauseOffscreen) {
      observer = new IntersectionObserver(
        ([entry]) => {
          const wasVisible = visible;
          visible = entry.isIntersecting;
          if (visible && !wasVisible && rafId === 0) {
            rafId = requestAnimationFrame(render);
          }
        },
        { threshold: 0.02 },
      );
      observer.observe(ctn);
    }

    /* Tab visibility. */
    const onVisChange = () => {
      if (document.hidden) {
        visible = false;
      } else {
        visible = true;
        if (rafId === 0) rafId = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", onVisChange);

    /* Mouse. */
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    /* Start. */
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      observer?.disconnect();
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("visibilitychange", onVisChange);
      if (ctn && canvas.parentNode === ctn) {
        ctn.removeChild(canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [reduced, pauseOffscreen, onMouseMove]);

  /* ---- Reduced motion: static dark background only. */
  if (reduced) {
    return <div className={`absolute inset-0 bg-charcoal ${className}`} />;
  }

  return (
    <div
      ref={wrapRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
}
