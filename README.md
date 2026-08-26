# Neon Nexus Challenge

A dark cyberpunk 3-page website for an inter-school tech/hacking competition (working title **INTERSCHOOL CTF 2026**). Built for the hacker-club aesthetic — near-black background, neon green/cyan accents, monospace headings, glitch-hover nav, glowing card borders, scroll-reveal animations, and a faint code-rain hero.

## Stack

- [TanStack Start](https://tanstack.com/start) (React + TypeScript)
- Vite + Tailwind CSS
- Supabase (auth / data) — configured via `.env` (see `.env.example`)
- Deploys to Netlify

## Local dev

```bash
bun install
cp .env.example .env   # fill in your Supabase keys
bun run dev
```

## Notes

- This project was scaffolded with [Lovable](https://lovable.dev); subsequent edits live here in git.
- Environment files (`.env`) are git-ignored — never commit secrets.

> Placeholder copy/branding will be swapped for the real event before launch.
