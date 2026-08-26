// Netlify's dashboard build settings ("dist/client", "bun run build") kept
// overriding netlify.toml's committed command/publish values in this repo's
// actual deploy logs, and that UI is not reachable from here to fix directly.
//
// Rather than depend on which config wins, make the build succeed under BOTH
// publish paths: this script runs after `vite build` and mirrors the real
// output (dist/) into dist/client/ as well, so a publish directory of either
// "dist" or "dist/client" finds a complete site.
import { cpSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
const distClient = join(dist, "client");

if (!existsSync(dist)) {
  console.warn("[postbuild-netlify-compat] dist/ not found, skipping — did the build run?");
  process.exit(0);
}

mkdirSync(distClient, { recursive: true });

for (const entry of readdirSync(dist)) {
  if (entry === "client") continue; // don't copy dist/client into itself
  cpSync(join(dist, entry), join(distClient, entry), { recursive: true });
}

console.log("[postbuild-netlify-compat] mirrored dist/ -> dist/client/ for Netlify compatibility");
