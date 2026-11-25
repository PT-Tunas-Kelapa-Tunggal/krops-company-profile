import { versionAssets } from "@/lib/assets";
import { tech as techContent } from "./content";

const tech = versionAssets(techContent);

const fmt = (v: number) => v.toFixed(2).replace(".", ",");

/** Small connector notch between capability cards (from the template). */
const Connector = () => (
  <span className="cap-card__connector" aria-hidden="true">
    <svg className="cap-card__conn-svg" viewBox="0 0 11 18" width="11" height="18" preserveAspectRatio="none">
      <path
        d="M11 18H10.9082C10.9678 17.6757 11 17.3416 11 17C11 13.9624 8.53757 11.5 5.5 11.5C2.46243 11.5 0 13.9624 0 17C0 17.3416 0.0322085 17.6757 0.0917969 18H0V0C0 3.03757 2.46243 5.5 5.5 5.5C8.53757 5.5 11 3.03757 11 0V18Z"
        fill="currentColor"
      />
    </svg>
  </span>
);

/**
 * Krops visual in the template's video slot (same box, same masks): the
 * drone orthomosaic in the "subject" position and three canopy close-ups in
 * the circle column. It follows the active chapter (set as
 * `data-active-chapter` on .tech__story by behaviors/techStory.ts):
 *  0 "Deteksi" — an orange line keeps scanning raw photo → AI detection
 *  1 "Warna"   — detection stays fully revealed; circles get an orange ring
 *  Each circle is captioned with its VARI value and health label.
 */
function TechVisual() {
  const v = tech.visual;
  return (
    <div className="tech__video ktv" data-story-visual="true" aria-hidden="true">
      <div className="ktv__ortho">
        <img className="ktv__layer" src={v.raw} width={1400} height={1195} alt="" loading="lazy" decoding="async" />
        <img className="ktv__layer ktv__detect" src={v.detect} width={1400} height={1195} alt="" loading="lazy" decoding="async" />
        <span className="ktv__line" />
      </div>
      <div className="ktv__trees">
        {v.trees.map((t, i) => (
          <div className="ktv__tree" key={t.image} style={{ ["--i" as string]: i }}>
            <img src={t.image} width={520} height={520} alt="" loading="lazy" decoding="async" />
            <span className="ktv__cap">
              <span className="ktv__cap-value">
                <span className="ktv__cap-k">VARI</span> {fmt(t.value)}
              </span>
              <span className="ktv__cap-label">{t.label}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * "Teknologi" on the template's pinned story: crumbs, two scroll-driven
 * chapters with progress rails, then the platform panel with 5 cards.
 * Scroll logic: ./behaviors/techStory.ts.
 */
export function KropsTech() {
  const [c1, c2] = tech.chapters;
  const p = tech.platform;
  return (
    <section className="tech" id="technology" data-nav-mode="primary">
      <div className="tech__story" data-tech-story="true" data-active-chapter="0">
        <div className="tech__story-inner">
          <div className="tech__pin" data-tech-pin="true">
            <div className="tech__video-wrap">
              <TechVisual />
            </div>{" "}
            <nav className="tech__crumbs" aria-label="Tahapan teknologi">
              <div className="tech__crumbs-inner" role="tablist">
                <div className="tech__crumb-group">
                  <button className="crumb crumb--active" type="button" role="tab" aria-selected="true" data-tab-target="payload">
                    {tech.crumbs.a}
                  </button>{" "}
                  <span className="crumb crumb--plain" aria-hidden="true">
                    +
                  </span>{" "}
                  <button className="crumb crumb--muted" type="button" role="tab" aria-selected="false" data-tab-target="targeting">
                    {tech.crumbs.b}
                  </button>
                </div>{" "}
                <span className="crumb crumb--plain" aria-hidden="true">
                  →
                </span>{" "}
                <button className="crumb crumb--muted" type="button" role="tab" aria-selected="false" data-tab-target="precision">
                  {tech.crumbs.result}
                </button>
              </div>
            </nav>{" "}
            <div className="tech__grid">
              <div className="tech__aside">
                <div className="tech__intro">
                  <span className="tech__pill">
                    <span className="tech__pill-dot" aria-hidden="true" /> {tech.pill}
                  </span>{" "}
                  <h2 className="tech__title" data-line-reveal="">
                    {tech.title}
                  </h2>
                </div>{" "}
                <div className="tech__chapters" data-chapters="true">
                  {[c1, c2].map((c, i) => (
                    <article key={c.key} className={i === 0 ? "chapter is-active" : "chapter"} data-chapter={c.key}>
                      <div className="chapter__rail" aria-hidden="true">
                        <div className="chapter__rail-fill" data-progress-fill="true" />
                      </div>{" "}
                      <div className="chapter__body">
                        <h3 className="chapter__title">{c.title}</h3>{" "}
                        <div className="chapter__text-collapse">
                          <p className="chapter__text">{c.text}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
      <div className="tech__panel tech__panel--platform" data-reveal-section="true" data-precision-target="true" data-nav-mode="secondary" id="dosis-per-pohon">
        <div className="tech__platform-inner">
          <div className="tech__intro-block">
            <div className="tech__left-col">
              <div className="tech__intro">
                <span className="tech__pill tech__pill--white" data-reveal-item="true">
                  <span className="tech__pill-dot" aria-hidden="true" /> {p.pill}
                </span>{" "}
                <h2 className="tech__title" data-line-reveal="">
                  {p.title}
                </h2>
              </div>{" "}
              <div className="platform-blurb" data-reveal-item="true">
                <div className="platform-blurb__rail" aria-hidden="true">
                  <div className="platform-blurb__rail-fill" />
                </div>{" "}
                <div className="platform-blurb__body">
                  <p className="platform-blurb__text">{p.blurb}</p>{" "}
                  <p className="platform-blurb__text platform-blurb__text--extra">{p.extra}</p>
                </div>
              </div>
            </div>{" "}
            <div className="capability-cards" data-reveal-item="true">
              {p.cards.map((text, i) => (
                <article className="cap-card" key={text}>
                  <span className="cap-card__num">{String(i + 1).padStart(2, "0")}</span>{" "}
                  <p className="cap-card__text">{text}</p>{" "}
                  <Connector />
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
