import { assetUrl, versionAssets } from "@/lib/assets";
import { nextPlan as nextPlanContent } from "./content";

const nextPlan = versionAssets(nextPlanContent);

type Item = (typeof nextPlan.items)[number];

function PlanCard({ item, className, reveal = true }: { item: Item; className: string; reveal?: boolean }) {
  return (
    <article className={`prin-card prin-card--photo ${className}`} {...(reveal ? { "data-reveal-item": "true" } : {})}>
      <img className="prin-card__bg" src={item.image} alt={item.alt} loading="lazy" decoding="async" style={{ objectPosition: item.focus }} />
      <div className="prin-card__scrim" aria-hidden="true" />
      <span className="knp__tag">{item.tag}</span>
      <span className="prin-card__dot" aria-hidden="true" />
      <div className="prin-card__stack">
        <h3 className="prin-card__title">{item.title}</h3>
        <p className="prin-card__body">{item.body}</p>
      </div>
    </article>
  );
}

/**
 * "Rencana berikutnya" on the template's principles bento, same sizes as
 * the original: tall card left (400px), card + 92px olive strip on the
 * right, wide 300px card below. All three cards are photo cards
 * (render + scrim + light text).
 */
export function KropsNextPlan() {
  const [ground, air, sensor] = nextPlan.items;
  return (
    <section className="prin" id="rencana" data-nav-mode="secondary" data-reveal-section="true">
      <div className="prin__inner">
        <aside className="prin__intro">
          <span className="prin__pill-slot" data-reveal-item="true">
            <span className="pill pill--light">
              <span className="pill__dot" aria-hidden="true" />
              {nextPlan.pill}
            </span>
          </span>
          <h2 className="prin__title" data-line-reveal="true">
            {nextPlan.title}
          </h2>
          <p className="knp__lede" data-reveal-item="true">
            {nextPlan.lede}
          </p>
        </aside>
        <div className="prin__cards">
          <div className="prin__row prin__row--pair">
            <PlanCard item={ground} className="knp-card--ground" />
            <div className="prin-card-group" data-reveal-item="true">
              <PlanCard item={air} className="knp-card--air" reveal={false} />
              <div className="prin-card prin-card--strip" aria-hidden="true">
                <img src={assetUrl("/assets/img/card-strip-olive.webp")} alt="" loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
          <PlanCard item={sensor} className="prin-card--wide" />
        </div>
      </div>
    </section>
  );
}
