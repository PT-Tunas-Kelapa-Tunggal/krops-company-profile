import { versionAssets } from "@/lib/assets";
import { builtFor as builtForContent } from "./content";

const builtFor = versionAssets(builtForContent);
import { LiquidButton } from "./LiquidButton";

// Scoped-style attributes from the ported stylesheet (Astro component id).
const B = { "data-astro-cid-zuw4alt4": "" };

const Connector = () => (
  <svg viewBox="0 0 30 22" width="30" height="22" preserveAspectRatio="none" {...B}>
    <path
      d="M27.8769 0C33.1915 7.65694e-05 24.3002 3.76945 21.9917 8.78072C21.6739 9.47057 21.6093 10.2404 21.6093 10.9999C21.6093 11.7589 21.6738 12.5282 21.9912 13.2176C24.2985 18.2297 33.192 21.9999 27.8769 22C23.2962 22 19.3717 19.1997 17.7177 15.2178C17.2028 13.9783 16.0868 13 14.7446 13C13.4023 13 12.2864 13.9783 11.7715 15.2178C10.1174 19.1997 6.1929 22 1.61225 22C-4.46288 22 8.58784 17.0751 8.58784 11C8.58782 4.92487 -4.46288 0 1.61225 0C6.1929 3.11605e-05 10.1174 2.80032 11.7715 6.78216C12.2864 8.02172 13.4023 9 14.7446 9C16.0868 9 17.2028 8.02173 17.7177 6.78217C19.3717 2.80031 23.2962 0 27.8769 0Z"
      fill="currentColor"
      {...B}
    />
  </svg>
);

/**
 * "Untuk siapa": [4:3 field video | one explanation card]. The card covers
 * all three audiences (no tabs). Video loading: ./behavior.ts ›
 * initKropsBuiltForVideo.
 */
export function KropsBuiltFor() {
  const v = builtFor.video;
  return (
    <section id="built-for" className="builtfor" data-nav-mode="primary" data-reveal-section="" {...B}>
      <div className="builtfor__inner" {...B}>
        <h2 className="builtfor__title" data-line-reveal="" {...B}>
          {builtFor.title}
        </h2>
        <div className="kbf__grid" data-reveal-item="">
          <figure className="kbf__media">
            <picture className="kbf__poster">
              <source media={v.smallMedia} srcSet={v.poster.small} type="image/webp" />
              <img src={v.poster.large} alt="" width={1280} height={960} loading="lazy" decoding="async" />
            </picture>
            <video
              className="kbf__video"
              data-kbf-video=""
              data-sources={JSON.stringify(v.sources.map((s) => ({ ...s, media: s.media === "small" ? v.smallMedia : s.media })))}
              muted
              loop
              playsInline
              preload="none"
              disablePictureInPicture
              aria-label={v.label}
            />
          </figure>
          <div className="builtfor__col builtfor__col--copy kbf__copy" {...B}>
            <article className="benefits" {...B}>
              <div className="benefits__pills" aria-hidden="true" {...B}>
                <span className="benefits__pill" {...B}>
                  {builtFor.pill}
                </span>
                <span className="benefits__pill-connector" {...B}>
                  <Connector />
                </span>
                <span className="benefits__pill benefits__pill--context" {...B}>
                  {builtFor.context}
                </span>
              </div>
              <h3 className="benefits__title" {...B}>
                {builtFor.heading}
              </h3>
              <ul className="benefits__list" {...B}>
                {builtFor.points.map((p) => (
                  <li className="benefits__row kbf__row" key={p.who} {...B}>
                    <span className="kbf__who">{p.who}</span>
                    <span>{p.text}</span>
                  </li>
                ))}
              </ul>
            </article>
            <article className="book-cta kbf__ctas" {...B}>
              {builtFor.ctas.map((c) => (
                <LiquidButton key={c.label} label={c.label} href={c.href} external={c.external} accent={c.accent} />
              ))}
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
