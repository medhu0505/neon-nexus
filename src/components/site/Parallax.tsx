import { useEffect, useRef, type ReactNode } from "react";

/**
 * Scroll-linked parallax — the trick every one of the reference sites leans on
 * (locomotive on coreisus, GSAP ScrollTrigger on ncrypt): map scroll position
 * to a transform so layers move at different rates and the page reads as depth
 * rather than a flat scroll.
 *
 * Runs off a single rAF-throttled scroll listener and writes only transform, so
 * it never triggers layout.
 */
export function Parallax({
  children,
  speed = 0.2,
  fade = false,
  className = "",
}: {
  children: ReactNode;
  /** Fraction of scroll distance to shift by. Positive lags, negative leads. */
  speed?: number;
  /** Fade out as the element leaves the viewport. */
  fade?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let queued = false;

    const apply = () => {
      queued = false;
      const r = el.getBoundingClientRect();
      // 0 when the element is centred, ±1 at a viewport away
      const progress = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      el.style.transform = `translate3d(0, ${(progress * speed * 100).toFixed(2)}px, 0)`;
      if (fade) {
        el.style.opacity = String(Math.max(0, Math.min(1, 1 - Math.abs(progress) * 0.9)));
      }
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      raf = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [speed, fade]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
