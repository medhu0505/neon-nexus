import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./useJourney";

/** Served straight from /public — no bundler import needed. */
const moonSrc = "/images/moon.png";

/**
 * A purely 2D moon: one high-resolution image plus stacked ghost copies for the
 * hover glitch. No R3F / Three.js — the moon must never spin up a WebGL scene.
 *
 * - pointer parallax is written straight to a ref transform (no per-frame state)
 * - hover toggles a single class; all glitch animation lives in styles.css
 * - reduced motion keeps a static RGB offset only
 */
export function InteractiveMoon({ className = "" }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [glitching, setGlitching] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 34;
      ty = (e.clientY / window.innerHeight - 0.5) * 22;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const tick = () => {
      raf = 0;
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      const el = wrapRef.current;
      if (el) {
        el.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0) scale(${(
          1 + Math.abs(cx) * 0.0006
        ).toFixed(4)})`;
      }
      if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);

  return (
    <div ref={wrapRef} className={className} style={{ willChange: "transform" }}>
      <div
        className={`moon-2d ${glitching ? "is-glitching" : ""}`}
        onPointerEnter={() => setGlitching(true)}
        onPointerLeave={() => setGlitching(false)}
        style={{
          filter: "drop-shadow(0 0 60px oklch(0.79 0.134 211 / 22%))",
          animation: reduced ? undefined : "moon-float 11s ease-in-out infinite",
        }}
      >
        <img
          src={moonSrc}
          alt="A full moon hanging over the Quantum city skyline"
          width={1024}
          height={1024}
          className="moon-base relative z-10"
          draggable={false}
        />
        <img
          src={moonSrc}
          alt=""
          aria-hidden="true"
          width={1024}
          height={1024}
          className="moon-ghost moon-ghost-cyan"
          style={{ filter: "sepia(1) hue-rotate(140deg) saturate(6)" }}
          draggable={false}
        />
        <img
          src={moonSrc}
          alt=""
          aria-hidden="true"
          width={1024}
          height={1024}
          className="moon-ghost moon-ghost-magenta"
          style={{ filter: "sepia(1) hue-rotate(280deg) saturate(6)" }}
          draggable={false}
        />
        <div className="moon-scanlines" aria-hidden="true" />
      </div>
    </div>
  );
}