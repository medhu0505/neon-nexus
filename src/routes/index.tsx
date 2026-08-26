import { createFileRoute } from "@tanstack/react-router";
import { CyberCityJourney } from "@/components/site/journey/CyberCityJourney";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Quantum v2.0 — Inter-School Tech & Culture Fest" },
      {
        name: "description",
        content:
          "Quantum v2.0 — the inter-school fest with six events: Quiz, Film Making, Ad Shoot, Surprise, Online Gaming and Pitch. Free entry, live scoring, one stage.",
      },
      { property: "og:title", content: "Quantum v2.0" },
      {
        property: "og:description",
        content: "Six events. One stage. The inter-school fest returns as Quantum v2.0.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return <CyberCityJourney />;
}
