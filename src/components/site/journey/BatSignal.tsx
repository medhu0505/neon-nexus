/**
 * A "bat signal" projected from a rooftop: a rotating conic light cone in
 * screen blend mode with the QUANTUM V2.0 wordmark skewed into the haze.
 */
export function BatSignal({ dim = 0 }: { dim?: number }) {
  const opacity = Math.max(0, 1 - dim);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 left-[18%] z-10 h-[78vh] w-[46vw] min-w-[320px]"
      style={{ opacity, transition: "opacity 120ms linear" }}
    >
      {/* light cone */}
      <div
        className="absolute bottom-0 left-1/2 h-full w-[130%]"
        style={{
          mixBlendMode: "screen",
          clipPath: "polygon(48% 100%, 52% 100%, 100% 0%, 0% 0%)",
          background:
            "conic-gradient(from 200deg at 50% 100%, transparent 0deg, oklch(0.79 0.134 211 / 26%) 14deg, oklch(0.7 0.194 4 / 20%) 26deg, transparent 42deg)",
          filter: "blur(6px)",
          transformOrigin: "50% 100%",
          animation: "signal-sweep 9s ease-in-out infinite alternate, signal-flicker 3.4s infinite",
        }}
      />
      {/* projected wordmark, skewed into the haze */}
      <div
        className="absolute left-1/2 top-[14%] w-full -translate-x-1/2 text-center"
        style={{
          mixBlendMode: "screen",
          transform: "translateX(-50%) perspective(700px) rotateX(28deg) skewX(-7deg)",
          filter: "blur(0.6px) drop-shadow(0 0 26px oklch(0.79 0.134 211 / 45%))",
          animation: "signal-flicker 4.2s infinite",
        }}
      >
        <span className="wordmark block text-[clamp(2.5rem,7vw,6rem)] leading-[0.85] tracking-tight">
          QUANTUM
        </span>
        <span className="outline-text block text-[clamp(1.6rem,4.4vw,3.6rem)] leading-[0.9]">
          V2.0
        </span>
      </div>
      {/* rooftop lamp glow */}
      <div
        className="absolute bottom-0 left-1/2 h-24 w-24 -translate-x-1/2 translate-y-1/3 rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.95 0.08 211 / 65%) 0%, transparent 70%)",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}