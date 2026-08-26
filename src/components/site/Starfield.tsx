import { useEffect, useRef } from "react";

/**
 * Fixed starfield behind the whole site. Three depth layers that drift with the
 * cursor for parallax, plus a slow twinkle. Canvas 2D — cheap enough to leave
 * running on every page.
 */

type Star = {
  x: number;
  y: number;
  r: number;
  depth: number;
  phase: number;
  speed: number;
  hue: string;
};

const HUES = [
  "255, 255, 255",
  "255, 255, 255",
  "255, 255, 255",
  "150, 230, 255", // cyan
  "255, 150, 200", // pink
  "190, 160, 255", // violet
];

export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stars: Star[] = [];
    let raf = 0;
    let w = 0;
    let h = 0;
    const pointer = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // density scales with area so laptops and phones look the same
      const count = Math.round((w * h) / 5200);
      stars = Array.from({ length: count }, () => {
        const depth = Math.random();
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.35 + depth * 1.15,
          depth,
          phase: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 1.1,
          hue: HUES[Math.floor(Math.random() * HUES.length)]!,
        };
      });
    };

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      eased.x += (pointer.x - eased.x) * 0.04;
      eased.y += (pointer.y - eased.y) * 0.04;
      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        // nearer stars shift further — parallax
        const px = s.x + eased.x * (6 + s.depth * 22);
        const py = s.y + eased.y * (6 + s.depth * 22);
        const twinkle = 0.45 + 0.55 * Math.sin(t * 0.001 * s.speed + s.phase);
        const alpha = (0.16 + s.depth * 0.55) * twinkle;

        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.hue}, ${alpha.toFixed(3)})`;
        ctx.fill();

        // the brightest few get a soft bloom
        if (s.depth > 0.88) {
          ctx.beginPath();
          ctx.arc(px, py, s.r * 4.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${s.hue}, ${(alpha * 0.12).toFixed(3)})`;
          ctx.fill();
        }
      }
    };

    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    build();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      draw(0);
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
      window.addEventListener("pointermove", onMove, { passive: true });
    }
    window.addEventListener("resize", build);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", build);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
