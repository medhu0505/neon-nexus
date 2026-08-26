import { Reveal } from "@/components/site/Reveal";
import { Tilt } from "@/components/site/Tilt";

const highlights = [
  {
    title: "six formats",
    body: "From rapid-fire trivia to a full short-film shoot — six independent events, each with its own panel and scoring.",
  },
  {
    title: "live scoreboard",
    body: "Real-time school standings across every event, with a final-hour freeze that keeps the ending unreadable.",
  },
  {
    title: "school first",
    body: "Built for students entering their first fest — clear briefs, on-floor coordinators and no entry fee.",
  },
];

/** Street-level interlude — what Quantum actually is. */
export function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-28">
      <Reveal>
        <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
          what is quantum?
        </p>
        <h2 className="mt-5 text-4xl font-bold uppercase leading-[0.95] md:text-6xl">
          <span className="block text-foreground">Where ideas</span>
          <span className="wordmark block">collide.</span>
        </h2>
        <p className="mt-8 max-w-2xl text-muted-foreground">
          Quantum is a student-run inter-school fest, running as Quantum v2.0. Teams from across
          the city go head-to-head across six creative and competitive events, all run and judged
          on the day.
        </p>
      </Reveal>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {highlights.map((h, i) => (
          <Reveal key={h.title} delay={i * 90}>
            <Tilt className="h-full">
              <article className="glow-card h-full rounded-xl p-7">
                <h3 className="text-xl font-bold tracking-tight text-primary">{h.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{h.body}</p>
              </article>
            </Tilt>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
