import { useEffect, useRef } from "react";

/**
 * Fullscreen GLSL scene used behind page headers — domain-warped noise
 * filaments and drifting glow, tinted with the Quantum palette, with an
 * optional raymarched chrome ring for the home hero.
 *
 * Deliberately dependency-free raw WebGL: no three.js, no model files. The
 * "3D" is a signed-distance field marched per pixel, so it ships as a few KB
 * of shader source and gets real reflections and depth for free.
 *
 * If the context can't be created the canvas simply stays empty and the CSS
 * background shows through, so nothing depends on it rendering.
 */

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2 u_res;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_object;   // 1.0 = raymarch the ring (home hero only)
uniform float u_gain;     // overall intensity, dimmer on interior pages

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

// ---- the 3D half: a chrome ring with a slowly turning hex gem inside ----

const vec3 PINK = vec3(0.98, 0.26, 0.55);
const vec3 CYAN = vec3(0.25, 0.79, 0.90);
const vec3 VIOLET = vec3(0.55, 0.27, 0.94);

mat3 rotY(float a) {
  float c = cos(a), s = sin(a);
  return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
}

mat3 rotX(float a) {
  float c = cos(a), s = sin(a);
  return mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c);
}

float sdTorus(vec3 p, vec2 t) {
  return length(vec2(length(p.xz) - t.x, p.y)) - t.y;
}

// faceted crystal: several small faces, each catching a different key light
float sdOctahedron(vec3 p, float s) {
  p = abs(p);
  float m = p.x + p.y + p.z - s;
  vec3 q;
  if (3.0 * p.x < m) q = p.xyz;
  else if (3.0 * p.y < m) q = p.yzx;
  else if (3.0 * p.z < m) q = p.zxy;
  else return m * 0.57735027;
  float k = clamp(0.5 * (q.z - q.y + s), 0.0, s);
  return length(vec3(q.x, q.y - s + k, q.z - k));
}

// x = distance, y = 0 for the rings, 1 for the gem
vec2 map(vec3 p, float t) {
  vec3 q = rotX(sin(t * 0.5) * 0.35) * rotY(t * 0.7) * p;
  float ring = sdTorus(q, vec2(0.66, 0.045));
  // a second, finer ring on a different axis — reads as a logo rather than a hoop
  float ring2 = sdTorus(rotX(1.1) * rotY(0.6) * q, vec2(0.88, 0.014));
  ring = min(ring, ring2);
  // rounded, so the bevels catch the key lights too
  float gem = sdOctahedron(rotY(-t * 1.6) * rotX(0.9) * q, 0.30) - 0.045;
  return ring < gem ? vec2(ring, 0.0) : vec2(gem, 1.0);
}

vec3 mapNormal(vec3 p, float t) {
  vec2 e = vec2(0.0012, 0.0);
  return normalize(vec3(
    map(p + e.xyy, t).x - map(p - e.xyy, t).x,
    map(p + e.yxy, t).x - map(p - e.yxy, t).x,
    map(p + e.yyx, t).x - map(p - e.yyx, t).x
  ));
}

// neon studio: pink key from one side, cyan from the other, violet overhead
vec3 env(vec3 d) {
  vec3 c = mix(CYAN, PINK, smoothstep(-0.8, 0.8, d.x));
  c = mix(c, VIOLET, smoothstep(-0.2, 1.0, d.y) * 0.5);
  c *= 0.30 + 0.85 * pow(max(0.5 + 0.5 * d.y, 0.0), 1.4);
  c += PINK * pow(max(dot(d, normalize(vec3(-0.6, 0.35, 0.7))), 0.0), 24.0) * 1.6;
  c += CYAN * pow(max(dot(d, normalize(vec3(0.7, -0.2, 0.6))), 0.0), 18.0) * 1.1;
  return c;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
  vec2 m = (u_mouse - 0.5 * u_res) / u_res.y;
  float t = u_time * 0.06;

  // parallax toward the cursor, then warp the domain twice for filaments
  vec2 q = uv + m * 0.07;
  vec2 w = vec2(fbm(q * 1.6 + t), fbm(q * 1.6 + vec2(5.2, 1.3) - t));
  float f = fbm(q * 2.2 + w * 1.4 + vec2(0.0, t * 1.5));

  // thin bright thread along the ridge of the field, with a soft halo
  float ridge = abs(f - 0.5);
  float core = smoothstep(0.020, 0.0, ridge);
  float halo = smoothstep(0.09, 0.0, ridge) * 0.16;

  // large slow mask so the field breathes instead of filling the frame
  float mask = smoothstep(0.30, 0.72, fbm(q * 0.9 - t * 0.5));

  // two slow-drifting light volumes
  float g1 = exp(-3.5 * length(uv - vec2(-0.45 + 0.09 * sin(t * 3.0), 0.16)));
  float g2 = exp(-4.0 * length(uv - vec2(0.52 + 0.09 * cos(t * 2.3), -0.22)));

  vec3 pink = PINK;
  vec3 cyan = CYAN;
  vec3 violet = VIOLET;

  // hue splits across the frame so pink and cyan are both always present —
  // summing them per-pixel would just desaturate to white
  vec3 tint = mix(pink, cyan, smoothstep(-0.45, 0.45, uv.x + 0.3 * sin(t * 0.7) + 0.4 * (f - 0.5)));

  // the hero copy lives left-of-centre, vertically middle — hold the field back
  // there so the wordmark and buttons always read cleanly
  float leftness = 1.0 - smoothstep(-0.55, 0.45, uv.x);
  float centreness = exp(-pow(uv.y / 0.34, 2.0));
  float textSafe = 1.0 - 0.62 * leftness * centreness;

  vec3 col = vec3(0.0);
  col += tint * (core * 0.55 + halo) * mask * textSafe;
  col += violet * (g1 * 0.24 + g2 * 0.20);
  col += cyan * g2 * 0.10;

  col += hash(gl_FragCoord.xy + fract(u_time)) * 0.018;
  col *= smoothstep(1.35, 0.2, length(uv));
  col *= u_gain;

  if (u_object > 0.5) {
    // park the ring right of the copy on wide screens, centre it on narrow ones
    float wide = step(1.15, u_res.x / u_res.y);
    vec2 sp = uv - vec2(mix(0.0, 0.40, wide), mix(0.16, 0.02, wide));

    vec3 ro = vec3(0.0, 0.0, 3.0);
    vec3 rd = normalize(vec3(sp * 1.05, -1.7));
    // a little orbit toward the cursor
    mat3 orbit = rotY(m.x * 0.22) * rotX(-m.y * 0.16);
    ro = orbit * ro;
    rd = orbit * rd;

    float tt = u_time * 0.28;
    float dist = 0.0;
    float glow = 0.0;
    float hit = 0.0;
    float id = 0.0;

    for (int i = 0; i < 56; i++) {
      vec3 p = ro + rd * dist;
      vec2 s = map(p, tt);
      // accumulate proximity for a neon halo — also hides the edge aliasing
      glow += 0.016 / (0.045 + abs(s.x) * 9.0);
      if (s.x < 0.0016) {
        hit = 1.0;
        id = s.y;
        break;
      }
      dist += s.x * 0.92;
      if (dist > 6.0) break;
    }

    vec3 obj = vec3(0.0);
    if (hit > 0.5) {
      vec3 p = ro + rd * dist;
      vec3 n = mapNormal(p, tt);
      float fres = pow(1.0 - max(dot(n, -rd), 0.0), 3.5);
      vec3 refl = env(reflect(rd, n));
      // ring reads as chrome, the gem inside as tinted glass
      obj = refl * mix(0.55, 0.62, id) + env(n) * mix(0.10, 0.16, id);
      obj += mix(CYAN, PINK, id) * fres * 1.15;
      // the gem glows from within rather than just reflecting
      obj += mix(vec3(0.0), mix(VIOLET, PINK, 0.35), id) * (0.22 + 0.5 * fres);
      obj *= 1.0 - 0.35 * smoothstep(2.4, 4.2, dist);
    }

    vec3 halo = mix(VIOLET, CYAN, 0.4) * glow * 0.16;
    col += halo * u_gain;
    col = mix(col, obj, hit * 0.95);
  }

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn("[ShaderField]", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function ShaderField({
  object = false,
  gain = 1,
  className = "",
}: {
  /** Raymarch the chrome ring — home hero only; it's the expensive half. */
  object?: boolean;
  /** Overall intensity; interior pages run dimmer so copy stays dominant. */
  gain?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    // preserveDrawingBuffer: without it the buffer is cleared after each composite,
    // and an empty buffer under mix-blend-mode:screen paints the band white
    const opts = { alpha: false, antialias: false, preserveDrawingBuffer: true };
    /** No shader is fine; a blank blended canvas is not — hide it. */
    const disable = () => {
      canvas.style.display = "none";
    };

    const gl = (canvas.getContext("webgl2", opts) ??
      canvas.getContext("webgl", opts)) as WebGLRenderingContext | null;
    if (!gl) {
      disable();
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) {
      disable();
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      disable();
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("[ShaderField]", gl.getProgramInfoLog(program));
      disable();
      return;
    }
    gl.useProgram(program);

    // one oversized triangle covering the viewport
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_res");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uTime = gl.getUniformLocation(program, "u_time");

    // the ring is the costly half — skip it on phones, where it would also be
    // hidden behind the copy anyway
    const wantsObject = object && window.innerWidth >= 768;
    gl.uniform1f(gl.getUniformLocation(program, "u_object"), wantsObject ? 1 : 0);
    gl.uniform1f(gl.getUniformLocation(program, "u_gain"), gain);

    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let raf = 0;
    let visible = true;
    let lastTime = 12;

    const resize = () => {
      // capped DPR — the field is soft, so extra pixels buy nothing, and the
      // raymarch cost scales with every one of them
      const dpr = Math.min(window.devicePixelRatio || 1, wantsObject ? 1.25 : 1.5);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      mouse.x = target.x = canvas.width * 0.5;
      mouse.y = target.y = canvas.height * 0.5;
      // resizing wipes the buffer — repaint now so it is never left empty
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uTime, lastTime);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const dpr = canvas.width / Math.max(1, r.width);
      target.x = (e.clientX - r.left) * dpr;
      target.y = (r.height - (e.clientY - r.top)) * dpr;
    };

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      mouse.x += (target.x - mouse.x) * 0.045;
      mouse.y += (target.y - mouse.y) * 0.045;
      lastTime = t * 0.001;
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uTime, lastTime);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    resize();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      // one static frame — still atmospheric, no animation. preserveDrawingBuffer
      // keeps it on screen instead of blanking on the next composite.
      lastTime = 12;
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uTime, lastTime);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    } else {
      raf = requestAnimationFrame(frame);
      window.addEventListener("pointermove", onMove, { passive: true });
    }

    // a lost context leaves an empty buffer behind, which is exactly the state
    // that washes the band white under screen blending
    const onLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(raf);
      disable();
    };
    canvas.addEventListener("webglcontextlost", onLost);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // stop drawing when the hero scrolls away or the tab is hidden
    const io = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting && !document.hidden;
    });
    io.observe(canvas);
    const onVisibility = () => {
      visible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("webglcontextlost", onLost);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      ro.disconnect();
      io.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [object, gain]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full mix-blend-screen ${className}`}
    />
  );
}
