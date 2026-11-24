import type { Metadata, Viewport } from "next";
import { hero as heroContent, site } from "@/components/krops/content";
import { themeBootScript } from "@/components/krops/behaviors/theme";
import { assetUrl, stylesheetUrl, versionAssets } from "@/lib/assets";

const hero = versionAssets(heroContent);

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  applicationName: "Krops",
  keywords: [
    "dosis pupuk sawit",
    "pemupukan kelapa sawit",
    "pupuk sawit per pohon",
    "pemetaan drone kebun sawit",
    "aplikasi petani sawit",
    "petani sawit swadaya",
  ],
  icons: { icon: [{ url: assetUrl("/assets/logo/krops-logomark-orange.svg"), type: "image/svg+xml" }] },
  openGraph: {
    title: site.title,
    description: site.description,
    type: "website",
    locale: "id_ID",
    siteName: "Krops",
    images: [{ url: assetUrl("/assets/img/hero-map-1200.webp"), width: 1200, height: 750, alt: "Peta kebun sawit dengan kondisi setiap pohon dari drone Krops" }],
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
  appLinks: { ios: { url: "https://apps.apple.com/id/app/krops-oil-palm-agritech/id6829691522", app_store_id: "6829691522" } },
  other: { "apple-itunes-app": "app-id=6829691522" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#101113" },
  ],
};

// Runs before first paint, like the source's head script: tags Safari (its
// CSS swaps the goo filters) and stops scroll restoration so the hero intro
// always starts from the top.
const prePaint = `(function(){var ua=navigator.userAgent;if(/^((?!chrome|android).)*safari/i.test(ua)){document.documentElement.classList.add('is-safari');}if('scrollRestoration' in history)history.scrollRestoration='manual';})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: prePaint }} />
        {/* Light/dark theme before first paint (no flash). */}
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        {/* Stylesheets come from src/styles via app/css/[file]/route.ts (not
            Next's CSS pipeline: Lightning CSS would rewrite some rules, e.g.
            drop unprefixed backdrop-filter). Order matters: krops.css last. */}
        <link rel="stylesheet" href={stylesheetUrl("base")} />
        <link rel="stylesheet" href={stylesheetUrl("how-it-works")} />
        <link rel="stylesheet" href={stylesheetUrl("krops")} />
        <link rel="preload" href={assetUrl("/assets/fonts/KropsType-Variable.woff2")} as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href={assetUrl("/assets/fonts/Geist-Variable.woff2")} as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href={assetUrl("/assets/fonts/GeistMono-Variable.woff2")} as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" as="image" href={assetUrl("/assets/logo/krops-lockup-oranye.svg")} fetchPriority="high" type="image/svg+xml" />
        {/* LCP: the hero poster (first video frame). The colour map below it
            only shows once the video fades on scroll, so it is not preloaded. */}
        <link rel="preload" as="image" href={hero.video.poster.portrait} media={hero.video.portraitMedia} fetchPriority="high" type="image/webp" />
        <link rel="preload" as="image" href={hero.video.poster.landscape} media={`not all and ${hero.video.portraitMedia}`} fetchPriority="high" type="image/webp" />
      </head>
      <body>{children}</body>
    </html>
  );
}
