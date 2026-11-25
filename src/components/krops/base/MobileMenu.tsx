import { nav, site, social } from "../content";

export function MobileMenu() {
  return (
    <div id="mobile-menu" className="nav-mobile" role="dialog" aria-modal="true" aria-label="Menu" aria-hidden="true" data-nav-mobile="" data-lenis-prevent="">
      <div className="nav-mobile__inner">
        <div className="nav-mobile__main">
          <nav className="nav-mobile__links" aria-label="Bagian halaman">
            {nav.links.map((l) => (
              <a key={l.href} href={l.href} className="nav-mobile__link" data-nav-mobile-link="">
                {l.label}
              </a>
            ))}
          </nav>
          {" "}
          <a href="#contact" className="nav-mobile__cta" data-nav-mobile-link="">
            <span className="nav-mobile__cta-label">
              Hubungi kami
            </span>
            {" "}
            <span className="nav-mobile__cta-arrow" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3.33 8H12.67M8 12.67L12.67 8L8 3.33" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </div>
        {" "}
        <footer className="nav-mobile__footer">
          <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="nav-mobile__foot-link">
            LinkedIn
          </a>
          {" "}
          <div className="nav-mobile__foot-row">
            <span className="nav-mobile__copyright">
              <span className="nav-mobile__copyright-c">
                {"© "}
              </span>
              2026 {site.company}
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
