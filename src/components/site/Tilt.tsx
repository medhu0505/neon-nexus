import { useRef, type ReactNode } from "react";

/**
 * Pointer-tracked 3D tilt with a moving sheen — the cheap way to get real
 * depth on a flat card (lusion/unseen both lean on parallax-under-cursor
 * rather than actual geometry for their grid items).
 *
 * Writes --rx/--ry/--px/--py on the element; the CSS utilities read them.
 */
export function Tilt({
  children,
  max = 7,
  className = "",
}: {
  children: ReactNode;
  /** Maximum rotation in degrees on each axis. */
  max?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${(px - 0.5) * 2 * max}deg`);
    el.style.setProperty("--rx", `${(0.5 - py) * 2 * max}deg`);
    el.style.setProperty("--px", `${px * 100}%`);
    el.style.setProperty("--py", `${py * 100}%`);
    el.style.setProperty("--sheen", "1");
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--sheen", "0");
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={`tilt-3d relative ${className}`}
    >
      {children}
      <span
        aria-hidden="true"
        className="tilt-sheen pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ opacity: "var(--sheen, 0)" }}
      />
    </div>
  );
}
