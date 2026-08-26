import { Reveal } from "@/components/site/Reveal";
import { TeamGrid } from "@/components/site/TeamGrid";

/**
 * Section 2 — the crystal atrium. Holographic team discs suspended in a
 * refracted, quiet pocket of the city.
 */
export function CrystalTeamSection() {
  return (
    <section
      id="team"
      className="noise relative scroll-mt-24 overflow-hidden border-y border-border/60 py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_10%,color-mix(in_oklab,var(--secondary)_16%,transparent),transparent_70%)]" />
      <div className="grid-drift pointer-events-none absolute inset-0 opacity-30" />
      <div className="pointer-events-none absolute left-6 top-8 h-14 w-14 border-l border-t border-dashed border-secondary/25" />
      <div className="pointer-events-none absolute bottom-8 right-6 h-14 w-14 border-b border-r border-dashed border-primary/25" />

      <div className="relative mx-auto max-w-6xl px-5">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
            the crystal atrium
          </p>
          <h2 className="mt-5 text-4xl font-bold uppercase leading-[0.95] md:text-6xl">
            <span className="block text-foreground">The people</span>
            <span className="wordmark block">behind it.</span>
          </h2>
          <p className="mt-8 max-w-2xl text-muted-foreground">
            The students and staff running Quantum V2.0 on the day.
          </p>
        </Reveal>
        <div className="mt-16">
          <TeamGrid />
        </div>
      </div>
    </section>
  );
}
