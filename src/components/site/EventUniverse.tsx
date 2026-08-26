import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { events } from "@/lib/events";

/**
 * The six events as a solar system: Quantum V2.0 is the sun, each event is a
 * planet on its own orbit, seen from above.
 *
 * Mechanics: a full-size wrapper per planet spins around the centre; the planet
 * sits at the top of that wrapper (`top: 50% - radius`), so the spin sweeps it
 * around a circle. The planet then counter-spins at the same rate so its label
 * stays upright. Offsets are percentages of the container HEIGHT (via
 * aspect-square rings) so orbits stay circular in a wide box.
 *
 * Hovering a planet pauses its orbit and lights up its ring.
 */

/**
 * Radii are % of container height from the centre, so the outermost orbit must
 * stay under 50% minus room for the planet disc and the label beneath it —
 * otherwise the outer planet (Pitch) is clipped at the top and bottom of its
 * orbit. 40% leaves that headroom.
 */
/**
 * radius is % of container height from the centre.
 *
 * Two hard constraints:
 *  - the innermost orbit must clear the sun. The sun is 64px across, so its
 *    radius is ~6% of a 550px stage; anything under ~13% puts a planet inside
 *    the star, which is what made this look broken.
 *  - the outermost must stay under ~42% so the planet and its label never
 *    clip the top or bottom of the frame.
 */
const PLANETS = [
  { radius: 15, seconds: 28, size: 11, tint: "oklch(0.79 0.134 211)" },
  { radius: 20, seconds: 40, size: 15, tint: "oklch(0.7 0.194 4)" },
  { radius: 25, seconds: 55, size: 12, tint: "oklch(0.61 0.219 293)" },
  { radius: 30, seconds: 72, size: 17, tint: "oklch(0.79 0.134 211)" },
  { radius: 35, seconds: 92, size: 13, tint: "oklch(0.7 0.194 4)" },
  { radius: 40, seconds: 112, size: 16, tint: "oklch(0.61 0.219 293)" },
];

export function EventUniverse() {
  const [active, setActive] = useState<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const planets = events.slice(0, PLANETS.length);

  // the whole system tilts a few degrees toward the cursor for depth
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--sys-ry", `${((e.clientX - r.left) / r.width - 0.5) * 14}deg`);
      el.style.setProperty("--sys-rx", `${-((e.clientY - r.top) / r.height - 0.5) * 11}deg`);
    };
    const reset = () => {
      el.style.setProperty("--sys-ry", "0deg");
      el.style.setProperty("--sys-rx", "0deg");
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
    };
  }, []);

  return (
    <div className="glass-pane relative overflow-hidden rounded-3xl">
      <div className="grid-drift pointer-events-none absolute inset-0 opacity-40" />

      <div
        ref={stageRef}
        className="relative aspect-square w-full sm:aspect-[4/3] lg:aspect-[16/9]"
        style={{
          transform:
            "perspective(1200px) rotateX(var(--sys-rx, 0deg)) rotateY(var(--sys-ry, 0deg))",
          transition: "transform 0.15s ease-out",
        }}
      >
        {/* orbit rings — square boxes sized off the container height */}
        {PLANETS.map((p, i) => (
          <div
            key={`orbit-${planets[i]?.slug ?? i}`}
            className="pointer-events-none absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border transition-colors duration-200"
            style={{
              height: `${p.radius * 2}%`,
              borderColor:
                active === i ? "oklch(0.79 0.134 211 / 55%)" : "oklch(0.61 0.219 293 / 22%)",
            }}
          />
        ))}

        {planets.map((e, i) => {
          const p = PLANETS[i]!;
          const on = active === i;
          const spin = {
            animationName: "orbit-spin",
            animationDuration: `${p.seconds}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationDelay: `-${(p.seconds / PLANETS.length) * i}s`,
            animationPlayState: on ? ("paused" as const) : ("running" as const),
          };

          return (
            <div key={e.slug} className="pointer-events-none absolute inset-0" style={spin}>
              <div className="absolute left-1/2" style={{ top: `${50 - p.radius}%` }}>
                {/* counter-spin keeps the disc and label upright */}
                <div style={{ ...spin, animationDirection: "reverse" }}>
                  <Link
                    to="/events/$slug"
                    params={{ slug: e.slug }}
                    onMouseEnter={() => setActive(i)}
                    onMouseLeave={() => setActive((v) => (v === i ? null : v))}
                    onFocus={() => setActive(i)}
                    onBlur={() => setActive(null)}
                    className={`pointer-events-auto absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 ${
                      // labels sit beside the planet and alternate sides, so
                      // two planets on neighbouring orbits never overlap text
                      i % 2 === 0 ? "flex-row" : "flex-row-reverse"
                    }`}
                  >
                    <span
                      className="block rounded-full transition-all duration-200"
                      style={{
                        width: on ? p.size * 1.7 : p.size,
                        height: on ? p.size * 1.7 : p.size,
                        background: `radial-gradient(circle at 34% 30%, oklch(0.98 0.02 300), ${p.tint} 58%, oklch(0.35 0.1 300))`,
                        boxShadow: `0 0 ${on ? 34 : 16}px ${p.tint}`,
                      }}
                    />
                    <span
                      className={`display-face whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] uppercase tracking-[0.16em] transition-all duration-200 md:text-xs ${
                        on
                          ? "bg-background/80 text-foreground"
                          : "bg-background/30 text-muted-foreground/80"
                      }`}
                    >
                      {e.name}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {/* the sun */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="sun-core block h-12 w-12 rounded-full md:h-16 md:w-16" />
        </div>
      </div>

      <div className="relative flex min-h-16 flex-wrap items-center justify-between gap-3 border-t border-border/50 px-6 py-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          <span className="text-secondary">Quantum V2.0</span>
          {active === null ? " · select a planet" : ` · ${planets[active]!.tagline}`}
        </p>
        <Link
          to="/events"
          className="glitch font-mono text-[11px] uppercase tracking-[0.25em] text-secondary"
        >
          view all events →
        </Link>
      </div>
    </div>
  );
}
