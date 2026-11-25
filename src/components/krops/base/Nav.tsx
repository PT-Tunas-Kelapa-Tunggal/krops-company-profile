import { nav } from "../content";

const BRICK =
  "M36.0074 0.06C36.0074 0.10 36.04 0.12 36.08 0.12C36.70 0.04 37.34 0 37.98 0C38.85 0 39.45 0.07 39.83 0.21C44.08 1.80 36.01 7.87 36.01 12.40V19.60C36.01 24.13 44.08 30.20 39.83 31.79C39.45 31.93 38.85 32 37.98 32C37.34 32 36.70 31.96 36.08 31.88C36.04 31.88 36.01 31.90 36.01 31.94C36.01 31.97 35.98 32 35.95 32H4.97C4.93 32 4.90 31.97 4.90 31.93C4.90 31.89 4.86 31.86 4.82 31.86C4.15 31.95 3.48 32 2.79 32C2.22 32 1.78 31.97 1.43 31.91C-3.20 31.10 4.90 24.26 4.90 19.55V12.45C4.90 7.74 -3.20 0.90 1.43 0.09C1.78 0.03 2.22 0 2.79 0C3.48 0 4.15 0.05 4.82 0.14C4.86 0.14 4.90 0.11 4.90 0.07C4.90 0.03 4.93 0 4.97 0H35.95C35.98 0 36.01 0.03 36.01 0.06Z";
const WAIST =
  "M37.4745 0C43.8266 0 35.83 3.91728 31.231 9.53111C29.9935 11.0416 31.2122 13 33.1649 13C34.6745 13 35.8983 14.2238 35.8983 15.7334V16.2666C35.8983 17.7762 34.6745 19 33.1648 19C31.2122 19 29.9935 20.9584 31.231 22.4689C35.83 28.0827 43.8266 32 37.4745 32C30.6686 32 24.8848 27.5037 22.775 21.2415C22.3464 19.9693 21.2198 19 19.8773 19C18.5348 19 17.4082 19.9693 16.9796 21.2415C14.8698 27.5036 9.08592 31.9999 2.28013 32C-4.12715 32 4.50855 28.0143 9.31244 22.3222C10.5204 20.8909 9.36705 19 7.49416 19C6.0605 19 4.8983 17.8378 4.8983 16.4041V15.5959C4.8983 14.1622 6.0605 13 7.49416 13C9.36704 13 10.5204 11.1091 9.31243 9.67781C4.50854 3.9857 -4.12714 0 2.28013 0C9.08591 9.61819e-05 14.8698 4.49638 16.9796 10.7585C17.4082 12.0307 18.5348 13 19.8773 13C21.2198 13 22.3464 12.0307 22.775 10.7585C24.8848 4.49634 30.6686 2.15193e-05 37.4745 0Z";

const CtaArrow = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 6H9.5M6 9.5L9.5 6L6 2.5" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Top bar: logo, gooey pill links (from `nav` in content.ts), theme toggle,
 * CTA and the mobile burger. The pill/connector markup and data-* hooks are
 * what behaviors/nav.ts and base.css expect.
 */
export function Nav() {
  const links = nav.links;
  return (
    <nav className="nav-root" data-mode="dark" data-nav="">
      <div className="nav-inner">
        <a href="/" className="nav-logo" aria-label={nav.homeLabel}>
          <span className="nav-logo__mark" aria-hidden="true" />
          <span className="nav-logo__wordmark" aria-hidden="true" />
        </a>{" "}
        <div className="nav-clusters">
          <div className="nav-pills nav-goo">
            <svg className="nav-goo-shapes" data-nav-goo-shapes="" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
              <g data-nav-goo-group="">
                {links.map((_, i) => (
                  <rect key={`p${i}`} data-nav-shape-pill="" data-nav-shape-idx={i} />
                ))}
                {links.map((_, i) => (
                  <rect key={`c${i}`} data-nav-shape-connector="" data-nav-shape-idx={i} />
                ))}
              </g>
            </svg>{" "}
            {links.map((l, i) => (
              <span
                key={l.href}
                className={["nav-pill-slot", i === 0 && "nav-pill-slot--first", i === links.length - 1 && "nav-pill-slot--last"]
                  .filter(Boolean)
                  .join(" ")}
              >
                <a href={l.href} className="nav-pill">
                  <span className="nav-pill__label">{l.label}</span>
                </a>{" "}
                <span className="nav-pill__connector" aria-hidden="true">
                  <svg viewBox="0 0 42 32" width="41" height="32" preserveAspectRatio="none">
                    <path className="nav-pill__connector-brick" d={BRICK} fill="currentColor" />
                    <path className="nav-pill__connector-waist" d={WAIST} fill="currentColor" />
                  </svg>
                </span>
              </span>
            ))}
          </div>{" "}
          {/* Light/dark switch (Krops); wired up in krops/theme.ts */}
          <button type="button" className="nav-theme" data-theme-toggle="" aria-label="Ganti ke mode gelap" suppressHydrationWarning>
            <svg
              className="nav-theme__icon nav-theme__icon--moon"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M13.5 9.6A5.75 5.75 0 0 1 6.4 2.5a5.75 5.75 0 1 0 7.1 7.1Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            <svg className="nav-theme__icon nav-theme__icon--sun" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M8 1.5v1.3M8 13.2v1.3M1.5 8h1.3M13.2 8h1.3M3.4 3.4l.9.9M11.7 11.7l.9.9M3.4 12.6l.9-.9M11.7 4.3l.9-.9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>{" "}
          <div className="nav-cta-slot">
            <span className="liquid-btn-wrap">
              <a href={nav.cta.href} className="liquid-btn liquid-btn--small nav-cta" aria-label={nav.cta.label}>
                <span className="liquid-btn__blob" aria-hidden="true">
                  <span className="liquid-btn__pill">
                    <span className="liquid-btn__pill-sizer">{nav.cta.label}</span>
                  </span>{" "}
                  <span className="liquid-btn__circle">
                    <span className="liquid-btn__circle-icon" aria-hidden="true">
                      <CtaArrow />
                    </span>
                  </span>
                </span>{" "}
                <span className="liquid-btn__overlay">
                  <span className="liquid-btn__label" data-liquid-label="">
                    {nav.cta.label}
                  </span>{" "}
                  <span className="liquid-btn__arrow-icon" aria-hidden="true">
                    <CtaArrow />
                  </span>
                </span>
              </a>
            </span>
          </div>{" "}
          <button
            type="button"
            className="nav-burger"
            aria-label="Open menu"
            aria-controls="mobile-menu"
            aria-expanded="false"
            data-nav-burger=""
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path className="nav-burger__h" d="M1.5 7H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path className="nav-burger__v" d="M7 1.5V12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
