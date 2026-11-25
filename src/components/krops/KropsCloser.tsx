import { assetUrl } from "@/lib/assets";
import { closer, site } from "./content";
import { LiquidButton } from "./LiquidButton";

/**
 * Footer on the template's "closer" (background image, CTA block, link row,
 * copyright, giant wordmark), with Krops copy and links.
 */
export function KropsCloser() {
  return (
    <section className="closer">
      <div className="closer__bg" aria-hidden="true">
        <img className="closer__bg-img" src={assetUrl("/assets/img/footer-bg.webp")} alt="" loading="lazy" decoding="async" />
        <div className="closer__bg-shade" />
      </div>
      <div className="closer__inner">
        <div className="closer__cta-block">
          <span className="pill pill--light" data-astro-cid-2qeywk4b="">
            <span className="pill__dot" aria-hidden="true" data-astro-cid-2qeywk4b="" />
            {closer.pill}
          </span>
          <h2 className="closer__title" data-line-reveal="">
            {closer.title}
          </h2>
          <div className="kcl__ctas">
            {closer.ctas.map((c) => (
              <LiquidButton key={c.label} label={c.label} href={c.href} external={c.external} accent={c.accent} />
            ))}
          </div>
        </div>
        <div className="closer__meta">
          <nav className="closer__links" aria-label="Navigasi footer">
            {closer.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-btn"
                {...("external" in l && l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <span className="text-btn__label">{l.label}</span>
              </a>
            ))}
          </nav>
          <p className="closer__copyright">
            <span className="closer__copyright-c">© </span>
            2026 {site.company}
          </p>
        </div>
        <div className="closer__wordmark" aria-hidden="true">
          <span className="closer__wordmark-mask" />
        </div>
      </div>
    </section>
  );
}
