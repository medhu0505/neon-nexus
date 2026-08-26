import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { ClientOnly } from "@/components/site/ClientOnly";
import { Faq } from "@/components/site/Faq";
import { Reveal } from "@/components/site/Reveal";
import { AerialHighwayTraffic } from "./CityShowcase";
import { usePrefersReducedMotion, useSectionScroll } from "./useJourney";

/**
 * Section 3 — aerial traffic lanes streaming behind the FAQ.
 */
export function TrafficFaqSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { near } = useSectionScroll(ref);
  const reduced = usePrefersReducedMotion();

  return (
    <section id="faq" ref={ref} className="noise relative scroll-mt-24 overflow-hidden py-28">
      {!reduced && (
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <ClientOnly>
            {near ? (
              <Canvas camera={{ position: [0, 30, 60], fov: 60 }} dpr={[1, 1.5]} gl={{ antialias: false }}>
                <ambientLight intensity={0.6} />
                <AerialHighwayTraffic count={16} spread={200} />
              </Canvas>
            ) : null}
          </ClientOnly>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_50%,transparent_20%,var(--background)_85%)]" />

      <div className="relative mx-auto max-w-6xl px-5">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
            traffic lanes
          </p>
          <h2 className="mt-5 text-4xl font-bold uppercase leading-[0.95] md:text-6xl">
            <span className="block text-foreground">Frequently asked</span>
            <span className="wordmark block">questions.</span>
          </h2>
        </Reveal>
        <div className="mt-12">
          <Faq />
        </div>
      </div>
    </section>
  );
}
