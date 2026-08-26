import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";

/**
 * Route-change wipe — lusion.co keeps a dedicated `canvas#transition-overlay`
 * on top of everything and paints a transition into it between pages, so
 * navigation feels like one continuous piece rather than a document swap.
 *
 * Same idea in CSS: a full-screen panel sweeps up over the outgoing page and
 * off the top of the incoming one, keyed on the resolved pathname.
 */
export function RouteTransition() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [wipeKey, setWipeKey] = useState<string | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // skip the very first paint — only wipe on an actual navigation
    setWipeKey((prev) => (prev === null ? "" : pathname + ":" + Date.now()));
  }, [pathname]);

  if (!wipeKey) return null;

  return (
    <div
      key={wipeKey}
      aria-hidden="true"
      className="route-wipe pointer-events-none fixed inset-0 z-[150]"
    />
  );
}
