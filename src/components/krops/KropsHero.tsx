import { Fragment } from "react";
import { versionAssets } from "@/lib/assets";
import { hero as heroContent } from "./content";

const hero = versionAssets(heroContent);
import { LiquidButton } from "./LiquidButton";

// Scoped-style attributes from the ported stylesheet (Astro component ids).
const HS = { "data-astro-cid-dd44gz66": "" };
const PILL = { "data-astro-cid-2qeywk4b": "" };
const TXT = { "data-astro-cid-c2ksfy3a": "" };

function Pill({ label }: { label: string }) {
  return (
    <span className="pill pill--base" {...PILL}>
      <span className="pill__dot" aria-hidden="true" {...PILL} />
      {label}
    </span>
  );
}

/** Splits text into word/char spans; scroll progress "lights" chars in order. */
function LitText({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <p className="hs__response-text" data-response-text="" {...TXT}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="hs__word" {...TXT}>
            {Array.from(word).map((ch, j) => (
              <span key={j} className="hs__char" {...TXT}>
                {ch}
              </span>
            ))}
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </p>
  );
}

/**
 * Krops hero on the template's 500vh scroll story:
 * 1. intro: drone footage in a rounded card + headline, proof, CTAs
 * 2. scroll: the card grows full-bleed and the footage fades into the
 *    per-tree colour map underneath (`.hs__bg`, set in krops.css)
 * 3. the "problem" card passes over it
 * 4. an aperture closes around "Solusi kami" while its letters light up.
 */
export function KropsHero() {
  return (
    <section className="hs" data-hero-story="" data-hero-mask="" data-scroll-story="" data-nav-mode="dark" {...HS}>
      <div className="hs__pin" {...HS}>
        <div className="hs__canvas" aria-hidden="true" {...HS}>
          <div className="hs__media" data-hs-media="" {...HS}>
            <div className="hs__bg" {...HS} />
            {/* First frame of the video, shown instantly (and kept on
                Save-Data / reduced motion) so the hero is never blank while
                the video streams in; fades with the video on scroll. */}
            <picture className="hs__poster">
              <source media={hero.video.portraitMedia} srcSet={hero.video.poster.portrait} type="image/webp" />
              <img src={hero.video.poster.landscape} alt="" width={1280} height={720} fetchPriority="high" decoding="async" />
            </picture>
            <video
              className="hs__video hs__video--fx"
              data-hs-video-fx=""
              data-sources={JSON.stringify(
                hero.video.sources.map((s) => ({ ...s, media: s.media === "portrait" ? hero.video.portraitMedia : s.media })),
              )}
              muted
              loop
              playsInline
              preload="none"
              disablePictureInPicture
              disableRemotePlayback
              {...HS}
            />
          </div>
          <div className="hs__aperture" aria-hidden="true" {...HS} />
          <div className="hs__tint" {...HS} />
          <div className="hs__vignette" {...HS} />
        </div>
        <div className="hs__phase hs__phase--response" data-phase="response" {...HS}>
          <div className="hs__container hs__container--response" {...HS}>
            <div className="hs__response" {...HS}>
              <Pill label={hero.response.label} />{" "}
              <LitText text={hero.response.body} />
            </div>
          </div>
        </div>
      </div>

      <div className="hs__intro-frame" data-hero-intro-frame="" {...HS}>
        <div className="hs__container hs__container--hero" {...HS}>
          <div className="hs__phase-inner hs__phase-inner--stack" data-hero-intro="" {...HS}>
            <div className="hs__backedby" data-hero-intro-item="" {...HS}>
              <span className="hs__mono" {...HS}>
                {hero.proof.label}
              </span>{" "}
              <span className="hs__backedby-item" {...HS}>
                <span className="hs__proof-dot" aria-hidden="true" />
                <span className="hs__mono" {...HS}>
                  {hero.proof.value}
                </span>
              </span>
            </div>{" "}
            <a href={hero.news.href} className="hs__news" data-hero-intro-item="" {...HS}>
              <span className="hs__news-tag" {...HS}>
                {hero.news.tag}
              </span>{" "}
              <span className="hs__news-text" {...HS}>
                {hero.news.text}
              </span>{" "}
              <span className="hs__news-arrow" aria-hidden="true" {...HS}>
                →
              </span>
            </a>{" "}
            <h1 className="hs__headline" data-hero-intro-item="" data-line-reveal="" {...HS}>
              {hero.headline}
            </h1>{" "}
            <div className="hs__cta" data-hero-intro-item="" {...HS}>
              <LiquidButton label={hero.primaryCta.label} href={hero.primaryCta.href} />{" "}
              <LiquidButton label={hero.accentCta.label} href={hero.accentCta.href} accent external />
            </div>
          </div>
        </div>
      </div>

      <div className="hs__problem-frame" data-hero-problem-frame="" data-reveal-section="" {...HS}>
        <div className="hs__container hs__container--problem" {...HS}>
          <article className="hs__problem-card" data-reveal-item="" {...HS}>
            <Pill label={hero.problem.label} />{" "}
            <p className="hs__problem-body" {...HS}>
              {hero.problem.body}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
