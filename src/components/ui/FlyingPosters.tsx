"use client";

import { useRef, useEffect, useCallback, useMemo } from "react";
import {
  Renderer,
  Camera,
  Transform,
  Plane,
  Program,
  Mesh,
  Texture,
} from "ogl";

/* ─── Shaders ─────────────────────────────────────────────────── */

const vertexShader = `
precision highp float;

attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

uniform float uPosition;
uniform float uTime;
uniform float uSpeed;
uniform vec3 distortionAxis;
uniform vec3 rotationAxis;
uniform float uDistortion;
uniform float uMaxRotation;

varying vec2 vUv;

float PI = 3.141592653589793238;

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    return mat4(
      oc * axis.x * axis.x + c,         oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
      oc * axis.x * axis.y + axis.z * s,oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
      oc * axis.z * axis.x - axis.y * s,oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
      0.0,                              0.0,                                0.0,                                1.0
    );
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
  mat4 m = rotationMatrix(axis, angle);
  return (m * vec4(v, 1.0)).xyz;
}

float qinticInOut(float t) {
  return t < 0.5
    ? 16.0 * pow(t, 5.0)
    : -0.5 * abs(pow(2.0 * t - 2.0, 5.0)) + 1.0;
}

void main() {
  vUv = uv;

  float norm = 0.5;
  vec3 newpos = position;
  float offset = (dot(distortionAxis, position) + norm / 2.) / norm;
  float localprogress = clamp(
    (fract(uPosition * 5.0 * 0.01) - 0.01 * uDistortion * offset) / (1. - 0.01 * uDistortion),
    0.,
    2.
  );
  // Cap rotation at uMaxRotation (PI * 0.42 ≈ 75°) to prevent mirroring
  localprogress = qinticInOut(localprogress) * uMaxRotation;
  newpos = rotate(newpos, rotationAxis, localprogress);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newpos, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform vec2 uImageSize;
uniform vec2 uPlaneSize;
uniform sampler2D tMap;

varying vec2 vUv;

void main() {
  vec2 imageSize = uImageSize;
  vec2 planeSize = uPlaneSize;

  float imageAspect = imageSize.x / imageSize.y;
  float planeAspect = planeSize.x / planeSize.y;
  vec2 scale = vec2(1.0, 1.0);

  if (planeAspect > imageAspect) {
      scale.x = imageAspect / planeAspect;
  } else {
      scale.y = planeAspect / imageAspect;
  }

  vec2 uv = vUv * scale + (1.0 - scale) * 0.5;

  gl_FragColor = texture2D(tMap, uv);
}
`;

/* ─── Helpers ─────────────────────────────────────────────────── */

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function mapRange(
  num: number,
  min1: number,
  max1: number,
  min2: number,
  max2: number,
) {
  return ((num - min1) / (max1 - min1)) * (max2 - min2) + min2;
}

/* ─── Media (one poster plane) ────────────────────────────────── */

class Media {
  extra = 0;
  gl: Renderer["gl"];
  geometry: Plane;
  scene: Transform;
  screen = { width: 0, height: 0 };
  viewport = { width: 0, height: 0 };
  image: string;
  length: number;
  index: number;
  planeWidth: number;
  planeHeight: number;
  distortion: number;
  maxRotation: number;
  height = 0;
  heightTotal = 0;
  y = 0;
  padding = 5;
  plane!: Mesh;
  program!: Program;

  constructor(opts: {
    gl: Renderer["gl"];
    geometry: Plane;
    scene: Transform;
    screen: { width: number; height: number };
    viewport: { width: number; height: number };
    image: string;
    length: number;
    index: number;
    planeWidth: number;
    planeHeight: number;
    distortion: number;
    maxRotation: number;
  }) {
    this.gl = opts.gl;
    this.geometry = opts.geometry;
    this.scene = opts.scene;
    this.screen = { ...opts.screen };
    this.viewport = { ...opts.viewport };
    this.image = opts.image;
    this.length = opts.length;
    this.index = opts.index;
    this.planeWidth = opts.planeWidth;
    this.planeHeight = opts.planeHeight;
    this.distortion = opts.distortion;
    this.maxRotation = opts.maxRotation;

    this.createShader();
    this.createMesh();
    this.onResize();
  }

  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: false });

    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      fragment: fragmentShader,
      vertex: vertexShader,
      uniforms: {
        tMap: { value: texture },
        uPosition: { value: 0 },
        uPlaneSize: { value: [0, 0] },
        uImageSize: { value: [0, 0] },
        uSpeed: { value: 0 },
        rotationAxis: { value: [0, 1, 0] },
        distortionAxis: { value: [1, 1, 0] },
        uDistortion: { value: this.distortion },
        uMaxRotation: { value: this.maxRotation },
        uViewportSize: { value: [this.viewport.width, this.viewport.height] },
        uTime: { value: 0 },
      },
      cullFace: false,
    });

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = this.image;
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSize.value = [
        img.naturalWidth,
        img.naturalHeight,
      ];
    };
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });
    this.plane.setParent(this.scene);
  }

  setScale() {
    this.plane.scale.x =
      (this.viewport.width * this.planeWidth) / this.screen.width;
    this.plane.scale.y =
      (this.viewport.height * this.planeHeight) / this.screen.height;
    this.plane.position.x = 0;
    this.plane.program.uniforms.uPlaneSize.value = [
      this.plane.scale.x,
      this.plane.scale.y,
    ];
  }

  onResize(opts?: {
    screen?: { width: number; height: number };
    viewport?: { width: number; height: number };
  }) {
    if (opts?.screen) this.screen = opts.screen;
    if (opts?.viewport) {
      this.viewport = opts.viewport;
      this.plane.program.uniforms.uViewportSize.value = [
        this.viewport.width,
        this.viewport.height,
      ];
    }
    this.setScale();
    this.padding = 5;
    this.height = this.plane.scale.y + this.padding;
    this.heightTotal = this.height * this.length;
    this.y =
      -this.heightTotal / 2 + (this.index + 0.5) * this.height;
  }

  update(scrollCurrent: number) {
    this.plane.position.y = this.y - scrollCurrent - this.extra;

    const position = mapRange(
      this.plane.position.y,
      -this.viewport.height,
      this.viewport.height,
      5,
      15,
    );

    this.program.uniforms.uPosition.value = position;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = scrollCurrent;

    const planeH = this.plane.scale.y;
    const vpH = this.viewport.height;

    const topEdge = this.plane.position.y + planeH / 2;
    const bottomEdge = this.plane.position.y - planeH / 2;

    if (topEdge < -vpH / 2) {
      this.extra -= this.heightTotal;
    } else if (bottomEdge > vpH / 2) {
      this.extra += this.heightTotal;
    }
  }
}

/* ─── Canvas (OGL renderer) ──────────────────────────────────── */

class Canvas {
  renderer!: Renderer;
  gl!: Renderer["gl"];
  camera!: Camera;
  scene!: Transform;
  screen = { width: 0, height: 0 };
  viewport = { width: 0, height: 0 };
  planeGeometry!: Plane;
  medias: Media[] = [];
  rafId = 0;
  destroyed = false;

  scroll = { ease: 0, current: 0, target: 0 };

  constructor(
    private container: HTMLElement,
    private canvas: HTMLCanvasElement,
    private items: string[],
    private pw: number,
    private ph: number,
    distortion: number,
    scrollEase: number,
    cameraFov: number,
    cameraZ: number,
    maxRotation: number,
  ) {
    this.scroll.ease = scrollEase;
    this.createRenderer();
    this.createCamera(cameraFov, cameraZ);
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(distortion, maxRotation);
    this.startRAF();
  }

  private createRenderer() {
    this.renderer = new Renderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio, 2),
    });
    this.gl = this.renderer.gl;
  }

  private createCamera(fov: number, z: number) {
    this.camera = new Camera(this.gl);
    this.camera.fov = fov;
    this.camera.position.z = z;
  }

  private createScene() {
    this.scene = new Transform();
  }

  private createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 1,
      widthSegments: 100,
    });
  }

  private createMedias(distortion: number, maxRotation: number) {
    this.medias = this.items.map(
      (image, index) =>
        new Media({
          gl: this.gl,
          geometry: this.planeGeometry,
          scene: this.scene,
          screen: this.screen,
          viewport: this.viewport,
          image,
          length: this.items.length,
          index,
          planeWidth: this.pw,
          planeHeight: this.ph,
          distortion,
          maxRotation,
        }),
    );
  }

  onResize() {
    const rect = this.container.getBoundingClientRect();
    this.screen = { width: rect.width, height: rect.height };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.gl.canvas.width / this.gl.canvas.height,
    });
    const fovRad = (this.camera.fov * Math.PI) / 180;
    const h = 2 * Math.tan(fovRad / 2) * this.camera.position.z;
    const w = h * this.camera.aspect;
    this.viewport = { height: h, width: w };
    this.medias.forEach((m) =>
      m.onResize({ screen: this.screen, viewport: this.viewport }),
    );
  }

  setScrollTarget(target: number) {
    this.scroll.target = target;
  }

  private startRAF() {
    const tick = () => {
      if (this.destroyed) return;
      this.scroll.current = lerp(
        this.scroll.current,
        this.scroll.target,
        this.scroll.ease,
      );
      this.medias.forEach((m) => m.update(this.scroll.current));
      this.renderer.render({ scene: this.scene, camera: this.camera });
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.rafId);
  }
}

/* ─── React Component ─────────────────────────────────────────── */

export interface FlyingPostersProps {
  items: string[];
  planeWidth?: number;
  planeHeight?: number;
  distortion?: number;
  scrollEase?: number;
  cameraFov?: number;
  cameraZ?: number;
  /** Max rotation in radians. PI*0.42 ≈ 75° (desktop), PI*0.28 ≈ 50° (mobile). */
  maxRotation?: number;
  className?: string;
}

export default function FlyingPosters({
  items,
  planeWidth = 560,
  planeHeight = 420,
  distortion = 1.5,
  scrollEase = 0.04,
  cameraFov = 44,
  cameraZ = 21,
  maxRotation = Math.PI * 0.42,
  className = "",
}: FlyingPostersProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const instanceRef = useRef<Canvas | null>(null);

  // Memoize items array reference to avoid re-creating Canvas on every render
  const itemsKey = useMemo(() => items.join(","), [items]);

  /* Drive scroll from global page scroll — no wheel hijack */
  const updateScrollFromPage = useCallback(() => {
    if (!containerRef.current || !instanceRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const vh = window.innerHeight;
    // Map section's vertical position to poster scroll range
    const totalTravel = rect.height + vh;
    const scrolled = vh - rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / totalTravel));
    // Scale progress to poster movement range
    instanceRef.current.setScrollTarget(progress * items.length * 6);
  }, [items.length]);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const inst = new Canvas(
      containerRef.current,
      canvasRef.current,
      items,
      planeWidth,
      planeHeight,
      distortion,
      scrollEase,
      cameraFov,
      cameraZ,
      maxRotation,
    );
    instanceRef.current = inst;

    const onResize = () => inst.onResize();
    const onScroll = () => updateScrollFromPage();

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });

    // Initial position
    onScroll();

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      inst.destroy();
      instanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsKey]);

  return (
    <div
      ref={containerRef}
      className={`flying-posters-container ${className}`}
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      <canvas
        ref={canvasRef}
        className="flying-posters-canvas"
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
}
