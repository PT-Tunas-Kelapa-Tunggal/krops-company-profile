import { createHash } from "node:crypto";
import { readFileSync, statSync } from "node:fs";
import path from "node:path";

/**
 * Content-hash versioning for everything under public/assets and the
 * stylesheets in src/styles.
 *
 * Every URL the page emits gets `?v=<hash of the file>`. Replacing a file
 * (even under the same name) changes its hash, so browsers fetch the new
 * one immediately, while unchanged files can be cached for a year
 * (see next.config.ts). Hashes are memoised by mtime+size, so `next dev`
 * picks up a replaced file on the next reload.
 */

const PUBLIC = path.join(process.cwd(), "public");
const STYLES = path.join(process.cwd(), "src", "styles");
const cache = new Map<string, { key: string; hash: string }>();

function hashFile(file: string): string | null {
  try {
    const st = statSync(file);
    const key = `${st.mtimeMs}:${st.size}`;
    const hit = cache.get(file);
    if (hit?.key === key) return hit.hash;
    const hash = createHash("sha256").update(readFileSync(file)).digest("hex").slice(0, 10);
    cache.set(file, { key, hash });
    return hash;
  } catch {
    return null;
  }
}

/** "/assets/img/x.webp" -> "/assets/img/x.webp?v=1a2b3c4d5e" (unchanged if not a local asset). */
export function assetUrl(url: string): string {
  if (!url.startsWith("/assets/") || url.includes("?")) return url;
  const hash = hashFile(path.join(PUBLIC, url));
  return hash ? `${url}?v=${hash}` : url;
}

/** Deep-copies a content object, versioning every "/assets/…" string in it (also inside strings like `url(/assets/…)`). */
export function versionAssets<T>(value: T): T {
  if (typeof value === "string") return value.replace(/\/assets\/[^\s"'()?,]+/g, (m) => assetUrl(m)) as T;
  if (Array.isArray(value)) return value.map((v) => versionAssets(v)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, versionAssets(v)])) as T;
  }
  return value;
}

export const STYLESHEETS = ["base", "how-it-works", "krops"] as const;
export type Stylesheet = (typeof STYLESHEETS)[number];

/** Stylesheet source with every url(/assets/…) versioned. */
export function stylesheet(name: Stylesheet): string {
  const css = readFileSync(path.join(STYLES, `${name}.css`), "utf8");
  return css.replace(/url\((["']?)(\/assets\/[^"')?]+)\1\)/g, (_, q: string, url: string) => `url(${q}${assetUrl(url)}${q})`);
}

/** "/css/<name>.css?v=<hash of the rewritten stylesheet>". */
export function stylesheetUrl(name: Stylesheet): string {
  const hash = createHash("sha256").update(stylesheet(name)).digest("hex").slice(0, 10);
  return `/css/${name}.css?v=${hash}`;
}
