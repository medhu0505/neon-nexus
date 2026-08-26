import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { Field, SelectField, TextArea } from "@/components/site/Field";
import { events } from "@/lib/events";
import { submitIndividualRegistration } from "@/lib/supabase";

export const Route = createFileRoute("/register/individual")({
  head: () => ({
    meta: [
      { title: "Register as an Individual — Quantum v2.0" },
      {
        name: "description",
        content:
          "Enter Quantum v2.0 solo. Pick your events and get slotted into a team on the day — free entry for every participating student.",
      },
      { property: "og:title", content: "Register as an Individual — Quantum v2.0" },
      {
        property: "og:description",
        content: "Solo entry for Quantum v2.0 — pick your events and we'll do the rest.",
      },
      { property: "og:url", content: "/register/individual" },
    ],
    links: [{ rel: "canonical", href: "/register/individual" }],
  }),
  component: IndividualPage,
});

const eventOptions = events.map((e) => ({ value: e.slug, label: e.name }));

const notes = [
  "Solo entrants are placed into teams on the morning of the event.",
  "You may pick a second event as long as the timings don't clash.",
  "Carry your school ID — it's checked at the registration desk.",
  "No entry fee. Lunch and refreshments are provided.",
];

type Status = "idle" | "submitting" | "sent" | "error";

function IndividualPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("submitting");
    setErrorMessage("");
    try {
      await submitIndividualRegistration({
        name: String(data.get("name") ?? "").trim(),
        class: String(data.get("class") ?? "").trim(),
        school: String(data.get("school") ?? "").trim(),
        phone: String(data.get("phone") ?? "").trim(),
        email: String(data.get("email") ?? "").trim(),
        event_slug: String(data.get("event_slug") ?? ""),
        other_events: String(data.get("other_events") ?? "").trim() || null,
      });
      form.reset();
      setStatus("sent");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage("Something went wrong sending that — check your connection and try again.");
    }
  }

  return (
    <>
      <PageHero>
        <Reveal>
          <Link
            to="/register"
            className="glitch font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary"
          >
            ← back to options
          </Link>
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-secondary">
            // individual entry
          </p>
          <h1 className="mt-4 text-4xl font-bold md:text-5xl">
            Register as an <span className="wordmark">individual</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Fill this in and we'll have your entry on file — final scheduling details follow once
            the event date is confirmed.
          </p>
        </Reveal>
      </PageHero>

      <div className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <form onSubmit={handleSubmit} className="glow-card rounded-md p-7">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field name="name" label="name" placeholder="A. Student" />
                <Field name="class" label="class" placeholder="11-B" />
                <Field name="school" label="school" placeholder="Placeholder Public School" />
                <Field name="phone" label="phone_no" type="tel" placeholder="+91 90000 00000" />
                <Field name="email" label="email" type="email" placeholder="student@school.edu" />
                <SelectField name="event_slug" label="event" options={eventOptions} />
              </div>
              <div className="mt-5">
                <TextArea
                  name="other_events"
                  label="other_events"
                  placeholder="Any additional events you want to enter, one per line"
                  rows={3}
                />
              </div>
              {status === "error" && (
                <p className="mt-4 font-mono text-xs text-destructive">{errorMessage}</p>
              )}
              <button
                type="submit"
                disabled={status === "submitting" || status === "sent"}
                className="glitch mt-6 w-full border border-primary bg-primary/10 px-5 py-3 font-mono text-xs uppercase tracking-[0.25em] text-primary transition-shadow hover:shadow-[var(--glow-primary)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "sent"
                  ? "// received — we'll be in touch"
                  : status === "submitting"
                    ? "sending…"
                    : "submit registration"}
              </button>
            </form>
          </Reveal>

          <Reveal delay={80}>
            <div className="glow-card rounded-md p-7">
              <h2 className="font-mono text-lg text-secondary">solo_notes.md</h2>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                {notes.map((n) => (
                  <li key={n} className="flex gap-3">
                    <span className="font-mono text-primary">›</span>
                    {n}
                  </li>
                ))}
              </ul>
              <p className="mt-6 font-mono text-xs text-muted-foreground">
                bringing a whole contingent?{" "}
                <Link to="/register/school" className="glitch text-primary">
                  register your school →
                </Link>
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
