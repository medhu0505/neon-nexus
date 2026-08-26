import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { RegisterNowButton } from "./RegisterChoice";

/**
 * No bar — two floating controls, the way lusion.co floats its UI over a
 * full-page canvas: the wordmark (which opens the menu) top-left, and the
 * register pill top-right. The wordmark uses mix-blend-mode: difference so it
 * inverts against whatever scrolls underneath instead of needing a backdrop.
 */

const links = [
  { to: "/", label: "home" },
  { to: "/", label: "about", hash: "about" },
  { to: "/events", label: "events" },
  { to: "/", label: "team", hash: "team" },
  { to: "/", label: "faq", hash: "faq" },
  { to: "/register", label: "register" },
] as const satisfies readonly { to: string; label: string; hash?: string }[];

/** `exactOptionalPropertyTypes` forbids passing `hash={undefined}`, so spread it instead. */
const hashProp = (l: (typeof links)[number]) => ("hash" in l ? { hash: l.hash } : {});

export function Nav() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      {/* wordmark + menu */}
      <div
        ref={menuRef}
        className="fixed left-4 top-4 z-50 md:left-7 md:top-6"
        data-nav-floating="wordmark"
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={open}
          className="glitch display-face flex items-center gap-2 px-2 py-1 text-lg tracking-[0.16em] mix-blend-difference"
        >
          <span className="font-bold text-white">QUANTUM</span>
          <span className="text-white/70">V2.0</span>
          <span className="ml-1 font-mono text-[9px] normal-case tracking-[0.18em] text-white/50">
            click me
          </span>
          <span
            className={`ml-1 inline-block text-xs text-white/70 transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          >
            ▾
          </span>
        </button>

        {open && (
          <div
            role="menu"
            className="glass-pane absolute left-0 top-full mt-4 w-56 overflow-hidden rounded-2xl py-2 shadow-[var(--glow-primary)]"
          >
            {links.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                {...hashProp(l)}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
              >
                <span className="text-secondary">›</span> {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* register */}
      <div className="fixed right-4 top-4 z-50 md:right-7 md:top-6">
        <RegisterNowButton className="glitch pill border border-secondary/70 bg-background/40 px-6 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-secondary backdrop-blur-md hover:border-secondary hover:shadow-[var(--glow-secondary)]">
          register
        </RegisterNowButton>
      </div>
    </>
  );
}
