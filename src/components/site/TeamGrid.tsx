import { initials, team } from "@/lib/team";
import { Reveal } from "./Reveal";

/**
 * "Meet the team" — each member is a holographic disc: a rotating conic ring,
 * a scan sweep and a soft projection glow. Drops in a photo when one is set,
 * otherwise shows initials.
 *
 * Edit the roster in `src/lib/team.ts`.
 */
export function TeamGrid() {
  return (
    <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {team.map((m, i) => (
        <Reveal key={`${m.name}-${m.role}`} delay={i * 70}>
          <figure className="group flex flex-col items-center text-center">
            <div className="holo-disc relative grid h-36 w-36 place-items-center rounded-full md:h-40 md:w-40">
              {/* scan sweep — the clip has to be a parent, since an element's
                  own overflow can't clip its own transform */}
              <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
                <span className="holo-scan absolute inset-x-0 h-1/3" />
              </span>

              {m.photo ? (
                <img
                  src={m.photo}
                  alt={m.name}
                  className="h-[86%] w-[86%] rounded-full object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                />
              ) : (
                <span className="display-face text-3xl tracking-[0.1em] text-secondary/80">
                  {initials(m.name) || "?"}
                </span>
              )}
            </div>

            {/* projection base */}
            <span className="mt-3 block h-px w-24 bg-gradient-to-r from-transparent via-secondary/60 to-transparent" />

            <figcaption className="mt-5">
              <p className="display-face text-lg tracking-[0.08em] text-foreground">{m.name}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                {m.role}
              </p>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}
