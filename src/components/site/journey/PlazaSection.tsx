import { RegisterNowButton } from "@/components/site/RegisterChoice";
import { Reveal } from "@/components/site/Reveal";

/**
 * Section 4 — the plaza at the end of the boulevard. Final call to register.
 */
export function PlazaSection() {
  return (
    <section className="noise relative overflow-hidden border-t border-border/60">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_100%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_70%)]" />
      <div className="grid-drift pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-6xl px-5 py-28 text-center">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
            the plaza
          </p>
          <h2 className="mt-5 text-4xl font-bold uppercase leading-[0.95] md:text-6xl">
            <span className="text-foreground">Explore. </span>
            <span className="wordmark">Compete. Create.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Registration is free and open to every participating school. Bring a crew and a
            stubborn streak.
          </p>
          <RegisterNowButton className="pill-solid mt-10 inline-block px-10 py-4 font-mono text-xs uppercase tracking-[0.25em]" />
        </Reveal>
      </div>
    </section>
  );
}
