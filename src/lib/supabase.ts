import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Backend for the two registration forms. Project: "Quantum" (Supabase).
 *
 * The key here is the publishable/anon key — it is meant to be public and is
 * safe in client bundles. Every table it can reach is insert-only for the
 * public role (see the `create_registration_tables` migration), so a visitor
 * can submit a registration but can never read, edit or delete any row,
 * including their own. Organizers read submissions from the Supabase
 * dashboard, which uses the service role and bypasses RLS.
 *
 * Values come from env vars so the project can be swapped without touching
 * code; see .env.example for what to set locally, netlify.toml for the
 * Netlify build, and vercel.json for the Vercel build.
 */
const url = import.meta.env["VITE_SUPABASE_URL"];
const publishableKey = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];

let client: SupabaseClient | null = null;

/**
 * Lazy on purpose: this used to throw at module scope, which crashed the
 * *entire route* into the app's error boundary on any deploy target missing
 * the env vars (this happened for real — Vercel's project was never given
 * them, since they'd only been added to netlify.toml and the local .env, and
 * the whole /register/individual and /register/school pages went blank).
 *
 * Deferring the check to submit time means a misconfigured deploy still
 * renders the page and every other route fine; only an actual submit
 * attempt fails, and it fails into the form's own error state instead of
 * taking down the page.
 */
function getClient(): SupabaseClient {
  if (client) return client;
  if (!url || !publishableKey) {
    throw new Error(
      "Registration is temporarily unavailable — missing Supabase configuration. Please try again shortly or contact the organizers.",
    );
  }
  client = createClient(url, publishableKey);
  return client;
}

export type IndividualRegistration = {
  name: string;
  class: string;
  school: string;
  phone: string;
  email: string;
  event_slug: string;
  other_events: string | null;
};

export type SchoolRegistration = {
  school_name: string;
  teacher_in_charge: string;
  class: string;
  phone: string;
  email: string;
  event_slug: string;
  team_members: string | null;
};

export async function submitIndividualRegistration(row: IndividualRegistration) {
  const { error } = await getClient().from("individual_registrations").insert(row);
  if (error) throw error;
}

export async function submitSchoolRegistration(row: SchoolRegistration) {
  const { error } = await getClient().from("school_registrations").insert(row);
  if (error) throw error;
}
