import { useEffect, useRef } from "react";

/**
 * Custom cursor — both unseen.co and lusion.co replace the pointer with a small
 * blended ring that swells over anything interactive. It reads as "this whole
 * page is one canvas" rather than a document.
 *
 * Two layers: a dot that tracks the pointer exactly, and a ring that lags
 * behind it. Only enabled for real mouse input, so touch is untouched.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    // fine pointer only — no custom cursor on touch, and honour reduced motion
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.body.classList.add("has-custom-cursor");

    const pos = { x: innerWidth / 2, y: innerHeight / 2 };
    const ringPos = { ...pos };
    let raf = 0;
    let hot = false;

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      const el = e.target as Element | null;
      const nowHot = !!el?.closest?.("a, button, input, textarea, select, [role='menuitem']");
      if (nowHot !== hot) {
        hot = nowHot;
        ring.style.width = hot ? "44px" : "26px";
        ring.style.height = hot ? "44px" : "26px";
        ring.style.backgroundColor = hot ? "oklch(0.79 0.134 211 / 18%)" : "transparent";
      }
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      ringPos.x += (pos.x - ringPos.x) * 0.18;
      ringPos.y += (pos.y - ringPos.y) * 0.18;
      dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
    };

    const onLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };
    const onEnter = () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="cursor-dot h-1.5 w-1.5 border-0 bg-secondary"
        style={{ opacity: 0 }}
      />
      <div ref={ringRef} aria-hidden="true" className="cursor-dot h-6 w-6" style={{ opacity: 0 }} />
    </>
  );
}
