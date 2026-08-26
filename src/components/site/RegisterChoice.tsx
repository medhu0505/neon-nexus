import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Tilt } from "./Tilt";
import { School, User, X } from "lucide-react";

const options = [
  {
    to: "/register/individual" as const,
    icon: User,
    label: "register as individual",
    body: "Entering solo? Pick your events and we'll slot you into a team on the floor.",
  },
  {
    to: "/register/school" as const,
    icon: School,
    label: "register as school / team",
    body: "Entering as a school team? One entry covers the teacher in charge and every member.",
  },
];

/** The two entry paths — shared by the modal and the /register landing page. */
export function RegisterOptions({ onPick }: { onPick?: () => void }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {options.map((o) => (
        <Tilt key={o.to} max={6}>
          <Link
            to={o.to}
            onClick={onPick}
            className="glow-card group block h-full rounded-xl p-6 text-left"
          >
            <o.icon className="h-5 w-5 text-secondary" />
            <h3 className="mt-4 font-mono text-sm uppercase tracking-[0.2em] text-primary">
              {o.label}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{o.body}</p>
            <p className="mt-5 font-mono text-xs uppercase tracking-[0.2em] text-secondary">
              continue →
            </p>
          </Link>
        </Tilt>
      ))}
    </div>
  );
}

export function RegisterChoiceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Choose a registration type"
      className="fixed inset-0 z-[100] flex items-center justify-center px-5"
    >
      <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" onClick={onClose} />
      <div className="noise relative w-full max-w-2xl border border-border/70 bg-card/95 p-7 shadow-[var(--glow-primary)]">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-primary"
        >
          <X className="h-4 w-4" />
        </button>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-secondary">// enrolment</p>
        <h2 className="mt-3 text-2xl font-bold md:text-3xl">How are you entering?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Pick a path — you can always add more events later.
        </p>
        <div className="mt-7">
          <RegisterOptions onPick={onClose} />
        </div>
      </div>
    </div>
  );
}

/** Button that opens the individual / school choice modal. */
export function RegisterNowButton({
  className,
  children = "register now",
}: {
  className?: string;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={`glitch ${className ?? ""}`}>
        {children}
      </button>
      <RegisterChoiceModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
