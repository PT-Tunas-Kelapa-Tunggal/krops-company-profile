import { versionAssets } from "@/lib/assets";
import { how as howContent } from "./content";

const how = versionAssets(howContent);

/**
 * "Cara kerja Krops": pinned 5-step timeline. Scroll progress picks the
 * active step (phone screen, title + caption, rail node); see
 * ./behaviors/howItWorks.ts. Base layout: src/styles/how-it-works.css
 * (scoped under `.bh`), Krops overrides in src/styles/krops.css.
 */
export function KropsHow() {
  const n = how.steps.length;
  return (
    <div className="bh">
      <section
        className="section section--white how"
        id="how"
        data-steps={n}
        data-nav-mode="primary"
        aria-label={how.title}
      >
        <div className="how__sticky">
          <div className="boxwrap how__grid">
            <div className="how__rail" aria-hidden="true">
              <span className="how__rail-fill" />
              {how.steps.map((_, i) => (
                <span key={i} className={i === 0 ? "how__node is-active" : "how__node"}>
                  <b>{String(i + 1).padStart(2, "0")}</b>
                </span>
              ))}
            </div>
            <div className="how__label reveal">
              <h2>{how.title}</h2>
            </div>
            <div className="how__device">
              {how.steps.map((s, i) => (
                <img
                  key={s.image}
                  className={i === 0 ? "how__shot is-active" : "how__shot"}
                  src={s.image}
                  width={637}
                  height={1300}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  alt={s.alt}
                />
              ))}
            </div>
            <ol className="how__titles">
              {how.steps.map((s, i) => (
                <li key={s.title} className={i === 0 ? "how-phase is-active" : "how-phase"}>
                  <div className="how-phase__text">
                    <h3>{s.title}</h3>
                    <p className="how-phase__cap">{s.caption}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}
