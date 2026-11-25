"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { TeamMember } from "./content";

const ArrowUpRight = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.5 10.5L10.5 3.5M10.5 3.5H4.5M10.5 3.5V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Chevron = ({ dir }: { dir: "left" | "right" }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d={dir === "left" ? "M10 3L5 8l5 5" : "M6 3l5 5-5 5"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function MemberCard({ m, index, total }: { m: TeamMember; index: number; total: number }) {
  const body = (
    <>
      <div className="team-member__portrait">
        <img src={m.image} alt={m.name} width={880} height={1000} loading="lazy" decoding="async" />
      </div>
      <div className="team-member__meta">
        <div className="team-member__meta-header">
          <p className="team-member__role">{m.role}</p>
          {m.linkedin ? (
            <span className="team-member__arrow" aria-hidden="true">
              <ArrowUpRight />
            </span>
          ) : null}
        </div>
        <p className="team-member__name">{m.name}</p>
        {m.bio ? <p className="team-member__bio">{m.bio}</p> : null}
      </div>
    </>
  );
  const slideProps = {
    className: "kteam__slide",
    role: "group",
    "aria-roledescription": "slide",
    "aria-label": `${index + 1} dari ${total}`,
  } as const;
  return (
    <div {...slideProps}>
      {m.linkedin ? (
        <a className="team-member" href={m.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} di LinkedIn`}>
          {body}
        </a>
      ) : (
        <article className="team-member">{body}</article>
      )}
    </div>
  );
}

/**
 * Team carousel: a native scroll-snap track (so touch swipe and trackpads
 * work for free) driven by arrows, dots and a 2-second autoplay that pages
 * forward by one "view" (2 people on wide screens, 1 on phones) and wraps
 * to the start. Autoplay pauses on hover, keyboard focus, touch, when the
 * carousel is off screen or the tab is hidden, via the pause button, and is
 * off entirely for reduced-motion users.
 */
export function TeamCarousel({ members, label, autoplayMs }: { members: TeamMember[]; label: string; autoplayMs: number }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(Math.ceil(members.length / 2));
  const [paused, setPaused] = useState(false); // user pressed pause
  const [held, setHeld] = useState(false); // hover / focus / touch
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  const resumeTimer = useRef<number | undefined>(undefined);

  /** Geometry from the rendered layout (slide width + gap, per view). */
  const metrics = useCallback(() => {
    const track = trackRef.current;
    if (!track) return null;
    const slides = track.querySelectorAll<HTMLElement>(".kteam__slide");
    if (slides.length < 2) return null;
    const step = slides[1].offsetLeft - slides[0].offsetLeft;
    const perView = Math.max(1, Math.round((track.clientWidth + 1) / step));
    const maxScroll = track.scrollWidth - track.clientWidth;
    return { track, step, perView, maxScroll, pageCount: Math.ceil(slides.length / perView) };
  }, []);

  // While a button/autoplay scroll animates, the dot already shows the
  // target page; ignore the intermediate scroll positions until it settles.
  const animating = useRef(false);
  const settleTimer = useRef<number | undefined>(undefined);

  const goTo = useCallback(
    (p: number) => {
      const m = metrics();
      if (!m) return;
      const target = ((p % m.pageCount) + m.pageCount) % m.pageCount;
      animating.current = true;
      window.clearTimeout(settleTimer.current);
      settleTimer.current = window.setTimeout(() => (animating.current = false), 900);
      m.track.scrollTo({ left: Math.min(target * m.perView * m.step, m.maxScroll), behavior: reduced ? "auto" : "smooth" });
      setPage(target);
    },
    [metrics, reduced],
  );

  // Keep page count / current page in sync with layout and manual scrolling.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const sync = () => {
      const m = metrics();
      if (!m) return;
      setPages(m.pageCount);
      if (animating.current) return;
      const atEnd = track.scrollLeft >= m.maxScroll - 2;
      setPage(atEnd ? m.pageCount - 1 : Math.round(track.scrollLeft / (m.perView * m.step)));
    };
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(sync);
    };
    sync();
    track.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(track);
    return () => {
      track.removeEventListener("scroll", onScroll);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [metrics]);

  // Visibility + reduced motion
  useEffect(() => {
    const track = trackRef.current;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMq = () => setReduced(mq.matches);
    onMq();
    mq.addEventListener("change", onMq);
    // (A hidden tab is handled in the autoplay tick via document.hidden.)
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.4 });
    if (track) io.observe(track);
    return () => {
      mq.removeEventListener("change", onMq);
      io.disconnect();
    };
  }, []);

  // Autoplay: a steady tick every `autoplayMs`. The current page is read
  // from a ref so page updates during the smooth scroll don't restart the
  // timer (which would stretch the rhythm by the scroll duration).
  const pageRef = useRef(page);
  useEffect(() => {
    pageRef.current = page;
  }, [page]);
  const running = !paused && !held && visible && !reduced;
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      if (!document.hidden) goTo(pageRef.current + 1);
    }, autoplayMs);
    return () => window.clearInterval(id);
  }, [running, goTo, autoplayMs]);

  // Touch: hold autoplay while swiping and for a few seconds after.
  const holdAfterTouch = () => {
    setHeld(true);
    window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => setHeld(false), 5000);
  };
  useEffect(
    () => () => {
      window.clearTimeout(resumeTimer.current);
      window.clearTimeout(settleTimer.current);
    },
    [],
  );

  return (
    <div
      className="kteam"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setHeld(false);
      }}
      onTouchStart={holdAfterTouch}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") goTo(page + 1);
        if (e.key === "ArrowLeft") goTo(page - 1);
      }}
    >
      <div className="kteam__track" ref={trackRef} aria-live={running ? "off" : "polite"}>
        {members.map((m, i) => (
          <MemberCard key={m.image} m={m} index={i} total={members.length} />
        ))}
      </div>

      <div className="kteam__controls">
        <div className="kteam__dots" role="group" aria-label="Pilih halaman">
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              type="button"
              className={i === page ? "kteam__dot is-active" : "kteam__dot"}
              aria-label={`Halaman ${i + 1} dari ${pages}`}
              aria-current={i === page ? "true" : undefined}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
        <div className="kteam__buttons">
          <button
            type="button"
            className="kteam__btn kteam__btn--toggle"
            aria-label={paused ? "Putar otomatis" : "Jeda putar otomatis"}
            aria-pressed={paused}
            onClick={() => setPaused((p) => !p)}
            hidden={reduced}
          >
            {paused ? (
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M4 2.5v9l7.5-4.5z" fill="currentColor" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M4 2.5h2v9H4zM8 2.5h2v9H8z" fill="currentColor" />
              </svg>
            )}
          </button>
          <button type="button" className="kteam__btn" aria-label="Sebelumnya" onClick={() => goTo(page - 1)}>
            <Chevron dir="left" />
          </button>
          <button type="button" className="kteam__btn" aria-label="Berikutnya" onClick={() => goTo(page + 1)}>
            <Chevron dir="right" />
          </button>
        </div>
      </div>
    </div>
  );
}
