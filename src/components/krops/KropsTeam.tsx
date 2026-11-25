import { versionAssets } from "@/lib/assets";
import { team as teamContent } from "./content";

const team = versionAssets(teamContent);
import { LiquidButton } from "./LiquidButton";
import { TeamCarousel } from "./TeamCarousel";

// Scoped-style attributes from the ported stylesheet (Astro component ids).
const T = { "data-astro-cid-th3xyikx": "" };
const PILL = { "data-astro-cid-2qeywk4b": "" };

/**
 * "Tim kami" on the template's team section (same card, intro column and
 * scroll inset), with the two fixed member cards replaced by a carousel of
 * all eight people that spans the remaining columns.
 */
export function KropsTeam() {
  return (
    <section id="team" className="team" data-nav-mode="primary" data-team-scroll="" data-reveal-section="" {...T}>
      <div className="team__card" {...T}>
        <div className="team__inner" {...T}>
          <div className="team__grid" {...T}>
            <div className="team__intro" {...T}>
              <div className="team__intro-top" {...T}>
                <span className="team__pill-slot" data-reveal-item="" {...T}>
                  <span className="pill pill--base" {...PILL}>
                    <span className="pill__dot" aria-hidden="true" {...PILL} />
                    {team.pill}
                  </span>
                </span>
                <h2 className="team__title" data-line-reveal="" {...T}>
                  {team.title}
                </h2>
              </div>
              <div className="team__intro-bottom" {...T}>
                <div className="team__blurb" data-reveal-item="" {...T}>
                  <p {...T}>{team.blurb}</p>
                </div>
                <span className="team__cta-slot" data-reveal-item="" {...T}>
                  <LiquidButton label={team.cta.label} href={team.cta.href} />
                </span>
              </div>
            </div>
            <div className="team__carousel" data-reveal-item="">
              <TeamCarousel members={team.members} label={team.carouselLabel} autoplayMs={team.autoplayMs} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
