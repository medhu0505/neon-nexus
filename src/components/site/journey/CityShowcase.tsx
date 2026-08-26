import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useNavigate } from "@tanstack/react-router";
import { useMemo, useRef } from "react";
import type { Group, PerspectiveCamera } from "three";
import { events } from "@/lib/events";

const SPACING = 26;
const NEON = ["#ff2d95", "#a855f7", "#22d3ee", "#ff2d95", "#a855f7", "#22d3ee"];

export const CITY_STATS = [
  { value: "48", label: "teams" },
  { value: "6", label: "events" },
  { value: "₹2L", label: "prize pool" },
  { value: "2d", label: "runtime" },
];

function Building({
  index,
  active,
  onHover,
}: {
  index: number;
  active: boolean;
  onHover: (i: number | null) => void;
}) {
  const e = events[index]!;
  const navigate = useNavigate();
  const side = index % 2 === 0 ? -1 : 1;
  const x = side * 15;
  const z = -index * SPACING;
  const height = 34 + ((index * 7) % 22);
  const color = NEON[index % NEON.length]!;

  return (
    <group position={[x, 0, z]}>
      <mesh
        position={[0, height / 2, 0]}
        onPointerOver={(ev) => {
          ev.stopPropagation();
          onHover(index);
        }}
        onPointerOut={() => onHover(null)}
        onClick={(ev) => {
          ev.stopPropagation();
          void navigate({ to: "/events/$slug", params: { slug: e.slug } });
        }}
      >
        <boxGeometry args={[11, height, 11]} />
        <meshStandardMaterial
          color="#0a0612"
          emissive={color}
          emissiveIntensity={active ? 0.5 : 0.16}
          roughness={0.5}
          metalness={0.6}
        />
      </mesh>

      {/* neon edge strips */}
      {[-5.6, 5.6].map((sx) => (
        <mesh key={sx} position={[sx, height / 2, 5.6]}>
          <boxGeometry args={[0.35, height * 0.94, 0.35]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={active ? 3.4 : 1.6}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* holographic event sign */}
      <Html
        center
        distanceFactor={34}
        position={[side * -6.5, height + 5, 0]}
        style={{ pointerEvents: "none" }}
      >
        <div
          className={`glass-pane whitespace-nowrap rounded-md px-4 py-2 text-center transition-opacity duration-300 ${
            active ? "opacity-100" : "opacity-60"
          }`}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-secondary">
            0{index + 1}
          </p>
          <p className="display-face text-lg uppercase tracking-[0.08em] text-foreground">
            {e.name}
          </p>
        </div>
      </Html>
    </group>
  );
}

function StatBillboard({ index }: { index: number }) {
  const s = CITY_STATS[index]!;
  const side = index % 2 === 0 ? 1 : -1;
  const z = -index * SPACING - SPACING / 2;
  return (
    <Html center distanceFactor={40} position={[side * 20, 26 + index * 3, z]}>
      <div className="holo-scan glass-pane rounded-md px-5 py-3 text-center">
        <p className="font-mono text-3xl font-bold text-primary">{s.value}</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          {s.label}
        </p>
      </div>
    </Html>
  );
}

/** Aerial traffic streaks — reused by the FAQ section's traffic lanes. */
export function AerialHighwayTraffic({ count = 14, spread = 180 }: { count?: number; spread?: number }) {
  const ref = useRef<Group>(null);
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: ((i * 37) % 60) - 30,
        y: 20 + ((i * 13) % 34),
        speed: 14 + ((i * 7) % 18),
        offset: (i * spread) / count,
        color: NEON[i % NEON.length]!,
      })),
    [count, spread],
  );

  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    g.children.forEach((child, i) => {
      const s = seeds[i]!;
      const t = (state.clock.elapsedTime * s.speed + s.offset) % spread;
      child.position.z = 30 - t;
    });
  });

  return (
    <group ref={ref}>
      {seeds.map((s, i) => (
        <mesh key={i} position={[s.x, s.y, 0]}>
          <boxGeometry args={[0.5, 0.3, 5]} />
          <meshStandardMaterial
            color={s.color}
            emissive={s.color}
            emissiveIntensity={2.6}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function CityCamera({ progressRef }: { progressRef: { current: number } }) {
  useFrame(({ camera }) => {
    const p = progressRef.current;
    const cam = camera as PerspectiveCamera;
    // descend from the skyline into the boulevard, then travel down it
    const descend = Math.min(1, p / 0.12);
    const travel = Math.max(0, (p - 0.06) / 0.94);
    cam.position.set(
      Math.sin(travel * 3.1) * 2.2,
      70 - descend * 62,
      30 - travel * (events.length * SPACING),
    );
    cam.lookAt(0, 12 - descend * 4, cam.position.z - 40);
  });
  return null;
}

export function CityScene({
  progressRef,
  active,
  setHover,
  bloom,
}: {
  progressRef: { current: number };
  active: number;
  setHover: (i: number | null) => void;
  bloom: boolean;
}) {
  return (
    <>
      <CityCamera progressRef={progressRef} />
      <fog attach="fog" args={["#0a0612", 30, 190]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 40, 10]} intensity={0.5} color="#c084fc" />

      {/* boulevard */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -events.length * SPACING * 0.5]}>
        <planeGeometry args={[26, events.length * SPACING + 120]} />
        <meshStandardMaterial color="#0d0818" roughness={0.35} metalness={0.7} />
      </mesh>

      {events.map((e, i) => (
        <Building key={e.slug} index={i} active={active === i} onHover={setHover} />
      ))}
      {CITY_STATS.map((s, i) => (
        <StatBillboard key={s.label} index={i} />
      ))}

      <AerialHighwayTraffic count={12} spread={events.length * SPACING} />

      {bloom && (
        <EffectComposer>
          <Bloom intensity={0.7} luminanceThreshold={0.55} luminanceSmoothing={0.3} mipmapBlur />
        </EffectComposer>
      )}
    </>
  );
}

export function CityCanvas(props: {
  progressRef: { current: number };
  active: number;
  setHover: (i: number | null) => void;
  bloom: boolean;
}) {
  return (
    <Canvas
      camera={{ position: [0, 70, 30], fov: 55 }}
      dpr={[1, 1.75]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
    >
      <CityScene {...props} />
    </Canvas>
  );
}