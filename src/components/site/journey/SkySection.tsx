import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { RegisterNowButton } from "@/components/site/RegisterChoice";
import { CodeRain } from "@/components/site/CodeRain";
import { InteractiveMoon } from "./InteractiveMoon";
import { BatSignal } from "./BatSignal";
import { mapRange, useSectionScroll } from "./useJourney";

/**
 * Section 0 — the night sky above the city. Nebula plate, 2D moon, bat signal
 * and the fest copy. Scrolling out descends toward the skyline so the city
 * section reads as a continuation rather than a new page.
 */
export function SkySection() {
  const ref = useRef<HTMLDivElement>(null);
  const { progress } = useSectionScroll(ref);

  const moonOpacity = mapRange(progress, 0.15, 0.85, 1, 0);
  const moonShift = mapRange(progress, 0, 1, 0, -160);
  const moonScale = mapRange(progress, 0, 1, 1, 0.82);
  const cityRise = mapRange(progress, 0, 1, 0, -140);
  const cityScale = mapRange(progress, 0, 1, 1, 1.25);
  const copyOpacity = mapRange(progress, 0.05, 0.4, 1, 0);

  return (
    <section ref={ref} className="relative h-[190vh]" aria-label="Quantum v2.0 — the night sky">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* nebula plate */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(/images/moon-nebula.jpg)",
            opacity: mapRange(progress, 0.3, 1, 1, 0.25),
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,transparent_25%,var(--background)_92%)]" />
        <CodeRain />
        <div className="grid-drift pointer-events-none absolute inset-0 opacity-40" />
        <div className="noise pointer-events-none absolute inset-0" />

        {/* moon, upper-right */}
        <div
          className="pointer-events-none absolute right-[4vw] top-[6vh] w-[38vw] max-w-[520px] min-w-[220px]"
          style={{
            opacity: moonOpacity,
            transform: `translate3d(${-moonShift * 0.35}px, ${moonShift}px, 0) scale(${moonScale})`,
          }}
        >
          <div className="pointer-events-auto">
            <InteractiveMoon />
          </div>
        </div>

        <BatSignal dim={mapRange(progress, 0.1, 0.6, 0, 1)} />

        {/* city silhouette rising toward the camera */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[46vh] bg-bottom bg-no-repeat"
          style={{
            backgroundImage: "url(/images/cyber-city.png)",
            backgroundSize: "cover",
            transform: `translate3d(0, ${cityRise}px, 0) scale(${cityScale})`,
            transformOrigin: "50% 100%",
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[24vh] bg-gradient-to-t from-background to-transparent" />

        {/* copy */}
        <div
          className="relative z-30 mx-auto flex h-full max-w-6xl flex-col justify-center px-5"
          style={{ opacity: copyOpacity }}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
            Air Force Bal Bharati School <span className="text-secondary">·</span> inter-school
            event
          </p>
          <h1 className="mt-7 leading-[0.82]">
            <span className="wordmark rgb-split block text-6xl md:text-[8.5rem]">QUANTUM</span>
            <span className="outline-text block text-5xl md:text-[7rem]">V2.0</span>
          </h1>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground">
            Two days. Six events. One stage. Quiz, film, advertising, gaming, pitching — and one
            challenge nobody sees coming.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <RegisterNowButton className="pill-solid px-8 py-3.5 font-mono text-xs uppercase tracking-[0.25em]" />
            <Link
              to="/events"
              className="glitch pill border border-border/80 px-8 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-foreground hover:border-secondary/70 hover:shadow-[var(--glow-secondary)]"
            >
              explore events
            </Link>
          </div>
          <div className="mt-14 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground/70">
            <span className="scroll-cue inline-block">↓</span> descend into the city
          </div>
        </div>
      </div>
    </section>
  );
}