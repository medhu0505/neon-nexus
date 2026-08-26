/**
 * The team shown in the "meet the team" section.
 *
 * EDIT THIS FILE to change the team — it is the only place these names live.
 * - `name` and `role` are shown under each hologram.
 * - `photo` is optional. Leave it out (or empty) and the member renders as a
 *   holographic disc with their initials. To add a photo, drop the image in
 *   `public/team/` and set `photo: "/team/their-file.jpg"`.
 */

export type TeamMember = {
  name: string;
  role: string;
  photo?: string;
};

export const team: TeamMember[] = [
  { name: "Name Placeholder", role: "Event Head" },
  { name: "Name Placeholder", role: "Co-ordinator" },
  { name: "Name Placeholder", role: "Creative Lead" },
  { name: "Name Placeholder", role: "Tech Lead" },
  { name: "Name Placeholder", role: "Logistics" },
  { name: "Name Placeholder", role: "Outreach" },
];

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
