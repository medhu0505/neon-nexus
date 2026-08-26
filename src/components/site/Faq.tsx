import { useState } from "react";
import { faqs } from "@/lib/faq";
import { Reveal } from "./Reveal";

/** Accordion of frequently asked questions. Content lives in src/lib/faq.ts. */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <Reveal key={f.q} delay={i * 50}>
            <div className="glow-card h-full overflow-hidden rounded-xl">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="display-face text-base tracking-[0.02em] text-foreground">
                  {f.q}
                </span>
                <span
                  className={`mt-0.5 shrink-0 font-mono text-secondary transition-transform duration-300 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-300 ease-out"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </div>
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
