import { SkySection } from "./SkySection";
import { CityShowcaseSection } from "./CityShowcaseSection";
import { AboutSection } from "./AboutSection";
import { CrystalTeamSection } from "./CrystalTeamSection";
import { TrafficFaqSection } from "./TrafficFaqSection";
import { PlazaSection } from "./PlazaSection";

/**
 * The homepage as one continuous descent: night sky → boulevard of events →
 * what Quantum is → crystal atrium (team) → traffic lanes (FAQ) → plaza (CTA).
 */
export function CyberCityJourney() {
  return (
    <>
      <SkySection />
      <CityShowcaseSection />
      <AboutSection />
      <CrystalTeamSection />
      <TrafficFaqSection />
      <PlazaSection />
    </>
  );
}
