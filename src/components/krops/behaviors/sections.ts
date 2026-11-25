import { clamp, prefersReducedMotion, rafThrottle } from "./shared";

/** Vertical progress bar shown while the hero story is on screen. */
export function initScrollProgress(): void {
  const bar = document.querySelector<HTMLElement>("[data-scroll-progress]");
  const stories = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll-story]"));
  const nav = document.querySelector<HTMLElement>("[data-nav]");
  if (!bar || !stories.length) return;

  const docBox = (el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    const top = r.top + window.scrollY;
    return { top, bottom: top + r.height };
  };
  const update = () => {
    const start = docBox(stories[0]).top;
    const end = docBox(stories[stories.length - 1]).bottom;
    const probe = window.scrollY + window.innerHeight * 0.5;
    const active = probe >= start && probe <= end;
    bar.dataset.active = active ? "true" : "false";
    if (nav) bar.dataset.mode = nav.dataset.mode ?? "light";
    if (active) bar.style.setProperty("--sp-progress", `${((probe - start) / Math.max(1, end - start)) * 100}%`);
  };
  const schedule = rafThrottle(update);
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  if (nav) new MutationObserver(update).observe(nav, { attributes: true, attributeFilter: ["data-mode"] });
  requestAnimationFrame(update);
}

/** Team card insets/rounds its corners as it scrolls up the viewport. */
export function initTeamScroll(): void {
  const section = document.querySelector<HTMLElement>("[data-team-scroll]");
  const card = section?.querySelector<HTMLElement>(".team__card");
  if (!section || !card || prefersReducedMotion()) return;

  const easeOutQuad = (t: number) => 1 - Math.pow(1 - t, 2);
  const START = 1;
  const END = 0.5;
  const update = () => {
    const vh = window.innerHeight;
    const bottom = card.getBoundingClientRect().bottom;
    const p = easeOutQuad(clamp((START * vh - bottom) / ((START - END) * vh)));
    section.style.setProperty("--team-inset", `${p * 16}px`);
    section.style.setProperty("--team-radius", `${p * 24}px`);
  };
  const schedule = rafThrottle(update);
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  requestAnimationFrame(update);
}
