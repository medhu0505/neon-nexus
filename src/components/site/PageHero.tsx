import type { ReactNode } from "react";
import { ShaderField } from "./ShaderField";

/**
 * Header band for interior pages — the same shader field as the home hero, run
 * dimmer and without the raymarched ring, so every page shares the atmosphere
 * without competing with its own copy.
 */
export function PageHero({ children }: { children: ReactNode }) {
  return (
    <section className="noise relative overflow-hidden border-b border-border/60">
      <ShaderField gain={0.5} />
      <div className="grid-drift pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute left-5 top-8 h-12 w-12 border-l border-t border-dashed border-secondary/25" />
      {/* pt clears the floating wordmark / register controls */}
      <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-32 md:pb-24 md:pt-36">
        {children}
      </div>
    </section>
  );
}
