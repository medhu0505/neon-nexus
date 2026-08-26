import { useEffect, useState, type RefObject } from "react";

export type SectionScroll = {
  /** 0 → 1 across the section's scrollable travel. */
  progress: number;
  /** True when the section is close enough to the viewport to mount 3D. */
  near: boolean;
};

/**
 * Tracks a tall scroll container's progress with a passive scroll listener and
 * a single rAF per frame. State only updates on meaningful change so React
 * doesn't re-render on every pixel.
 */
export function useSectionScroll(ref: RefObject<HTMLElement | null>): SectionScroll {
  const [state, setState] = useState<SectionScroll>({ progress: 0, near: false });

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const travel = Math.max(1, r.height - vh);
      const progress = Math.min(1, Math.max(0, -r.top / travel));
      const near = r.top < vh * 1.25 && r.bottom > -vh * 0.5;
      setState((prev) =>
        prev.near === near && Math.abs(prev.progress - progress) < 0.0015
          ? prev
          : { progress, near },
      );
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref]);

  return state;
}

/** Reads the user's reduced-motion preference (SSR-safe, false until mounted). */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mql.matches);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);
  return reduced;
}

/** Maps `value` from [inMin,inMax] into [outMin,outMax], clamped. */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) {
  const t = Math.min(1, Math.max(0, (value - inMin) / (inMax - inMin || 1)));
  return outMin + (outMax - outMin) * t;
}