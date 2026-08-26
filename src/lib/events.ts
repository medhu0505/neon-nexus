export type QuantumEvent = {
  slug: string;
  name: string;
  tagline: string;
  format: string;
  description: string;
  rules: string[];
  timing: string;
  eligibility: string;
};

export const events: QuantumEvent[] = [
  {
    slug: "quiz",
    name: "Quiz",
    tagline: "Sports & Pop Culture",
    format: "Solo or team of 2",
    description:
      "A rapid-fire trivia showdown across sports, music, film and internet culture. Preliminary written round narrows the field, followed by a buzzer stage on stage.",
    rules: [
      "Placeholder: prelims are written, top 6 teams advance.",
      "Placeholder: no phones or external devices during any round.",
      "Placeholder: negative marking applies on the buzzer round.",
      "Placeholder: quizmaster's decision is final.",
    ],
    timing: "Placeholder — Day 1, 10:00 to 12:00",
    eligibility: "Placeholder — open to classes 9 to 12, two entries per school",
  },
  {
    slug: "film-making",
    name: "Film Making",
    tagline: "Short-form video challenge",
    format: "Team of 3–5",
    description:
      "Shoot, cut and deliver a short film against a theme revealed at the start of the window. Judged on story, craft and edit discipline.",
    rules: [
      "Placeholder: maximum runtime of 5 minutes including credits.",
      "Placeholder: all footage must be shot during the event window.",
      "Placeholder: royalty-free audio only.",
      "Placeholder: submit as MP4 before the deadline.",
    ],
    timing: "Placeholder — Day 1, 09:30 to 17:30",
    eligibility: "Placeholder — one team per school, own equipment required",
  },
  {
    slug: "ad-shoot",
    name: "Ad Shoot",
    tagline: "Create and pitch a mock campaign",
    format: "Team of 2–4",
    description:
      "Build a mock advertising campaign for a product handed to you on the spot, then pitch the concept, script and visuals to the panel.",
    rules: [
      "Placeholder: product brief is revealed 3 hours before pitching.",
      "Placeholder: ad spot must run under 90 seconds.",
      "Placeholder: pitch deck limited to 6 slides.",
      "Placeholder: no real brand logos may be used.",
    ],
    timing: "Placeholder — Day 1, 11:00 to 16:00",
    eligibility: "Placeholder — open to classes 8 to 12",
  },
  {
    slug: "surprise",
    name: "Surprise",
    tagline: "Mystery challenge, revealed day-of",
    format: "Announced on the day",
    description:
      "A wildcard event. The brief, the team size and the scoring are all sealed until the moment it opens. Come with a flexible crew.",
    rules: [
      "Placeholder: full rules are handed out at the venue.",
      "Placeholder: team composition may be reshuffled by organisers.",
      "Placeholder: no preparation material is permitted.",
    ],
    timing: "Placeholder — Day 2, slot announced on the day",
    eligibility: "Placeholder — open to all registered participants",
  },
  {
    slug: "online-gaming",
    name: "Online Gaming",
    tagline: "Competitive gaming bracket",
    format: "Solo or squad",
    description:
      "A knockout bracket across the announced title list. Seeded qualifiers feed into a stage-lit grand final with live commentary.",
    rules: [
      "Placeholder: title list published one week before the event.",
      "Placeholder: single-elimination bracket, finals are best of three.",
      "Placeholder: any form of cheating means immediate removal.",
      "Placeholder: peripherals may be brought by participants.",
    ],
    timing: "Placeholder — Day 2, 10:00 to 15:00",
    eligibility: "Placeholder — classes 9 to 12, max two squads per school",
  },
  {
    slug: "pitch",
    name: "Pitch",
    tagline: "Present an idea to the judges",
    format: "Team of 2–3",
    description:
      "Take an idea or product from napkin to panel. Judged on originality, feasibility, and how well you handle the questions that follow.",
    rules: [
      "Placeholder: 6 minute pitch plus 4 minutes of Q&A.",
      "Placeholder: slides optional, prototypes welcome.",
      "Placeholder: ideas must be the team's own work.",
      "Placeholder: judges may cut the pitch at time.",
    ],
    timing: "Placeholder — Day 2, 12:00 to 16:00",
    eligibility: "Placeholder — open to classes 9 to 12",
  },
];

export const getEvent = (slug: string) => events.find((e) => e.slug === slug);