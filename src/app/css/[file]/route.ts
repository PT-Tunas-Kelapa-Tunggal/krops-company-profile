import { STYLESHEETS, type Stylesheet, stylesheet } from "@/lib/assets";

/**
 * Serves src/styles/<name>.css as /css/<name>.css with every asset URL
 * versioned (see src/lib/assets.ts). Rendered at build time; caching
 * headers come from next.config.ts.
 */
export const dynamic = "force-static";

export function generateStaticParams() {
  return STYLESHEETS.map((name) => ({ file: `${name}.css` }));
}

export async function GET(_req: Request, ctx: { params: Promise<{ file: string }> }) {
  const { file } = await ctx.params;
  const name = file.replace(/\.css$/, "") as Stylesheet;
  if (!STYLESHEETS.includes(name)) return new Response("Not found", { status: 404 });
  return new Response(stylesheet(name), { headers: { "Content-Type": "text/css; charset=utf-8" } });
}
