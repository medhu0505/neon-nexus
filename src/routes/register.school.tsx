import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { Field, SelectField, TextArea } from "@/components/site/Field";
import { events } from "@/lib/events";
import { submitSchoolRegistration } from "@/lib/supabase";

export const Route = createFileRoute("/register/school")({
  head: () => ({
    meta: [
      { title: "Register a School — Quantum v2.0" },
      {
        name: "description",
        content:
          "Register your school contingent for Quantum v2.0 across Quiz, Film Making, Ad Shoot, Surprise, Online Gaming and Pitch. Entry rules and eligibility.",
      },
      { property: "og:title", content: "Register a School — Quantum v2.0" },
      {
        property: "og:description",
        content: "Free entry for all participating schools across six events.",
      },
      { property: "og:url", content: "/register/school" },
    ],
    links: [{ rel: "canonical", href: "/register/school" }],
  }),
  component: SchoolPage,
});

const eventOptions = events.map((e) => ({ value: e.slug, label: e.name }));

const rules = [
  "Team sizes vary by event — check the event page before entering.",
  "All members of a team must be from the same school.",
  "One accompanying teacher or coordinator per school.",
  "Entries may be capped per school if slots fill up.",
  "Judges' decisions are final across every event.",
];

type Status = "idle" | "submitting" | "sent" | "error";

function SchoolPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("submitting");
    setErrorMessage("");
    try {
      await submitSchoolRegistration({
        school_name: String(data.get("school_name") ?? "").trim(),
        teacher_in_charge: String(data.get("teacher_in_charge") ?? "").trim(),
        class: String(data.get("class") ?? "").trim(),
        phone: String(data.get("phone") ?? "").trim(),
        email: String(data.get("email") ?? "").trim(),
        event_slug: String(data.get("event_slug") ?? ""),
        team_members: String(data.get("team_members") ?? "").trim() || null,
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
            // school entry
          </p>
          <h1 className="mt-4 text-4xl font-bold md:text-5xl">
            Register your <span className="wordmark">school</span>
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
                <Field
                  name="school_name"
                  label="school_name"
                  placeholder="Placeholder Public School"
                />
                <Field
                  name="teacher_in_charge"
                  label="teacher_in_charge"
                  placeholder="Ms. Placeholder"
                />
                <Field name="class" label="class" placeholder="11-B" />
                <Field name="phone" label="phone_no" type="tel" placeholder="+91 90000 00000" />
                <Field
                  name="email"
                  label="email"
                  type="email"
                  placeholder="coordinator@school.edu"
                />
                <SelectField name="event_slug" label="event" options={eventOptions} />
              </div>
              <div className="mt-5">
                <TextArea
                  name="team_members"
                  label="team_members"
                  placeholder={"One participant per line — name, class, event"}
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
              <h2 className="font-mono text-lg text-secondary">rules.md</h2>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                {rules.map((r) => (
                  <li key={r} className="flex gap-3">
                    <span className="font-mono text-primary">›</span>
                    {r}
                  </li>
                ))}
              </ul>
              <p className="mt-6 font-mono text-xs text-muted-foreground">
                entering on your own?{" "}
                <Link to="/register/individual" className="glitch text-primary">
                  register as an individual →
                </Link>
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
