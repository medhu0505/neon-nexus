import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-card/40">
      <div className="overflow-hidden border-b border-border/50 py-6">
        <div className="marquee-track" aria-hidden="true">
          {[0, 1].map((n) => (
            <span
              key={n}
              className="outline-text display-face whitespace-nowrap px-6 text-5xl uppercase md:text-7xl"
            >
              Quantum V2.0 · Explore · Compete · Create ·{" "}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 font-mono text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>
          <span className="wordmark text-base">QUANTUM</span> v2.0 — inter-school tech &amp; culture
          fest <span className="caret text-secondary">_</span>
        </p>
        <div className="flex gap-6">
          <Link to="/events" className="glitch hover:text-primary">
            events
          </Link>
          <Link to="/register" className="glitch hover:text-primary">
            register
          </Link>
          <a href="mailto:quantum@example.org" className="glitch hover:text-primary">
            quantum@example.org
          </a>
        </div>
        <p className="text-muted-foreground/60">draft build // placeholder branding</p>
      </div>
    </footer>
  );
}
