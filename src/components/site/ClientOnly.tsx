import { useEffect, useState, type ReactNode } from "react";

/**
 * Renders children only after hydration. The R3F canvas touches WebGL, which
 * does not exist during SSR, so the 3D scene must mount client-side only.
 */
export function ClientOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return <>{ready ? children : fallback}</>;
}
