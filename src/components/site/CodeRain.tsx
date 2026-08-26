import { useEffect, useRef } from "react";

/** Faint canvas code-rain used behind the hero. */
export function CodeRain() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const chars = "01</>{}[]#$_ABCDEF0123456789";
    let cols = 0;
    let drops: number[] = [];
    let raf = 0;
    let last = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / 16);
      drops = Array.from({ length: cols }, () => Math.random() * -40);
    };

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < 70) return;
      last = t;
      const { width, height } = canvas.getBoundingClientRect();
      ctx.fillStyle = "rgba(10, 6, 18, 0.16)";
      ctx.fillRect(0, 0, width, height);
      ctx.font = "13px 'JetBrains Mono', monospace";
      for (let i = 0; i < cols; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)] ?? "0";
        const y = (drops[i] ?? 0) * 16;
        ctx.fillStyle =
          Math.random() > 0.9
            ? "rgba(34,211,238,0.35)"
            : Math.random() > 0.5
              ? "rgba(236,72,153,0.3)"
              : "rgba(139,92,246,0.3)";
        ctx.fillText(char, i * 16, y);
        if (y > height && Math.random() > 0.975) drops[i] = 0;
        drops[i] = (drops[i] ?? 0) + 1;
      }
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
    />
  );
}