import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { getEvent } from "@/lib/events";

export const Route = createFileRoute("/events/$slug")({
  loader: ({ params }) => {
    const event = getEvent(params.slug);
    if (!event) throw notFound();
    return { event };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Event unavailable — Quantum v2.0" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { event } = loaderData;
    const title = `${event.name} — Quantum v2.0`;
    return {
      meta: [
        { title },
        { name: "description", content: event.description },
        { property: "og:title", content: title },
        { property: "og:description", content: event.description },
        { property: "og:url", content: `/events/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/events/${params.slug}` }],
    };
  },
  component: EventDetail,
});

function EventDetail() {
  const { event } = Route.useLoaderData();

  return (
    <>
      <PageHero>
        <Reveal>
          <Link
            to="/events"
            className="glitch font-mono text-xs uppercase tracking-[0.3em] text-secondary"
          >
            ← all events
          </Link>
          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
            <span className="wordmark">{event.name}</span>
          </h1>
          <p className="mt-3 font-mono text-sm text-muted-foreground">{event.tagline}</p>
          <span className="mt-5 inline-block border border-primary/60 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
            {event.format}
          </span>
          <div className="dashed-motif mt-8 w-full max-w-2xl" />
          <p className="mt-8 max-w-2xl leading-relaxed text-muted-foreground">
            {event.description}
          </p>
        </Reveal>
      </PageHero>

      <div className="mx-auto max-w-4xl px-5 py-20">
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal>
            <div className="glow-card h-full rounded-md p-7">
              <h2 className="font-mono text-lg text-secondary">rules</h2>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                {event.rules.map((r) => (
                  <li key={r} className="flex gap-3">
                    <span className="font-mono text-primary">›</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <div className="glow-card h-full rounded-md p-7">
              <h2 className="font-mono text-lg text-secondary">details</h2>
              <dl className="mt-4 space-y-5 text-sm">
                <div>
                  <dt className="font-mono text-xs uppercase tracking-widest text-secondary">
                    timing
                  </dt>
                  <dd className="mt-1 text-muted-foreground">{event.timing}</dd>
                </div>
                <div>
                  <dt className="font-mono text-xs uppercase tracking-widest text-secondary">
                    eligibility
                  </dt>
                  <dd className="mt-1 text-muted-foreground">{event.eligibility}</dd>
                </div>
              </dl>
            </div>
          </Reveal>
        </div>

        <Reveal delay={140}>
          <Link
            to="/register"
            className="glitch mt-10 inline-block border border-primary bg-primary/10 px-8 py-3 font-mono text-xs uppercase tracking-[0.25em] text-primary transition-shadow hover:shadow-[var(--glow-primary)]"
          >
            register for this event
          </Link>
        </Reveal>
      </div>
    </>
  );
}
