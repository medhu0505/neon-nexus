import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ClientOnly } from "@/components/site/ClientOnly";
import { events } from "@/lib/events";
import { CityCanvas, CITY_STATS } from "./CityShowcase";
import { usePrefersReducedMotion, useSectionScroll } from "./useJourney";

/**
 * Section 1 — the boulevard. A tall scroll container drives a sticky WebGL
 * flythrough past one building per event. Reduced motion / no-WebGL users get
 * a plain card list with the same links.
 */
export function CityShowcaseSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { progress, near } = useSectionScroll(ref);
  const reduced = usePrefersReducedMotion();
  const [hover, setHover] = useState<number | null>(null);

  const progressRef = useRef(0);
  progressRef.current = progress;

  const auto = Math.min(events.length - 1, Math.floor(progress * events.length));
  const active = hover ?? auto;

  if (reduced) return <CityFallback />;

  return (
    <section
      ref={ref}
      className="relative"
      style={{ height: `${events.length * 90 + 60}vh` }}
      aria-label="Event boulevard"
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-background">
        <ClientOnly fallback={<div className="h-full w-full bg-background" />}>
          {near ? (
            <CityCanvas
              progressRef={progressRef}
              active={active}
              setHover={setHover}
              bloom={!reduced}
            />
          ) : null}
        </ClientOnly>

        <div className="noise pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

        {/* HUD */}
        <div className="pointer-events-none absolute inset-x-0 bottom-10 z-10 mx-auto max-w-6xl px-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
            the event universe
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2 className="wordmark text-4xl uppercase leading-none md:text-6xl">
                {events[active]!.name}
              </h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                {events[active]!.tagline} · {events[active]!.format}
              </p>
            </div>
            <div className="pointer-events-auto flex gap-3">
              <Link
                to="/events/$slug"
                params={{ slug: events[active]!.slug }}
                className="pill-solid px-6 py-3 font-mono text-xs uppercase tracking-[0.25em]"
              >
                open event
              </Link>
              <Link
                to="/events"
                className="glitch pill border border-border/80 px-6 py-3 font-mono text-xs uppercase tracking-[0.25em] text-foreground hover:border-secondary/70"
              >
                all events
              </Link>
            </div>
          </div>
          <div className="mt-5 h-px w-full bg-border/60">
            <div
              className="h-px bg-primary transition-[width] duration-150"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function CityFallback() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24" aria-label="Events">
      <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
        the event universe
      </p>
      <h2 className="wordmark mt-5 text-4xl uppercase md:text-6xl">Six formats.</h2>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {events.map((e) => (
          <Link
            key={e.slug}
            to="/events/$slug"
            params={{ slug: e.slug }}
            className="glow-card rounded-xl p-7"
          >
            <h3 className="text-xl font-bold text-primary">{e.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{e.tagline}</p>
          </Link>
        ))}
      </div>
      <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
        {CITY_STATS.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-mono text-3xl font-bold text-primary">{s.value}</p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
