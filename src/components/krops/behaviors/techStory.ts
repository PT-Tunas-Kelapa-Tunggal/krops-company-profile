import { gsap, ScrollTrigger } from "./gsap";
import { onLoadIdle, prefersReducedMotion } from "./shared";

const NAV_OFFSET = 96;
const CHAPTER_BOUNDARY = 0.5;

/**
 * Technology section: CSS-sticky visual with two chapters ("Genetic Payload",
 * "Target Recognition"). Scroll progress fills each chapter's bar and drives
 * the breadcrumb tabs; clicking a crumb scrolls to that chapter.
 */
function init(): void {
  const story = document.querySelector<HTMLElement>("[data-tech-story]");
  const pin = story?.querySelector("[data-tech-pin]");
  const visual = story?.querySelector("[data-story-visual]");
  const chaptersRoot = story?.querySelector("[data-chapters]");
  const chapters = story ? Array.from(story.querySelectorAll<HTMLElement>(".chapter")) : [];
  const fills = story ? Array.from(story.querySelectorAll<HTMLElement>("[data-progress-fill]")) : [];
  const crumbs = story ? Array.from(story.querySelectorAll<HTMLElement>(".crumb[data-tab-target]")) : [];
  const precisionTarget = document.querySelector<HTMLElement>("[data-precision-target]");

  if (!story || !pin || !chaptersRoot || chapters.length < 2 || prefersReducedMotion()) return;

  let activeIdx = -1;
  const setChapter = (idx: number) => {
    if (idx === activeIdx) return;
    activeIdx = idx;
    chapters.forEach((el, i) => el.classList.toggle("is-active", i === idx));
    // Lets the (Krops) visual follow the chapter in CSS.
    story.dataset.activeChapter = String(idx);
  };
  const setCrumb = (tab: string) => {
    crumbs.forEach((btn) => {
      const on = btn.dataset.tabTarget === tab;
      btn.classList.toggle("crumb--active", on);
      btn.classList.toggle("crumb--muted", !on);
      btn.setAttribute("aria-selected", String(on));
    });
  };

  story.classList.add("is-story-ready");
  gsap.set(fills, { height: "0%" });

  // Lazy-attach the ~10MB video only when the story nears the viewport.
  if (visual instanceof HTMLVideoElement) {
    visual.muted = true;
    new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const pending = visual.getAttribute("data-src");
            if (pending) {
              visual.src = pending;
              visual.removeAttribute("data-src");
            }
            visual.play().catch(() => {});
          } else {
            visual.pause();
          }
        }
      },
      { rootMargin: "100% 0px 100% 0px", threshold: 0 },
    ).observe(story);
  }

  const main = ScrollTrigger.create({
    trigger: story,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const p = self.progress;
      if (p < CHAPTER_BOUNDARY) {
        if (fills[0]) fills[0].style.height = `${(p / CHAPTER_BOUNDARY) * 100}%`;
        if (fills[1]) fills[1].style.height = "0%";
        setChapter(0);
        setCrumb("payload");
      } else {
        if (fills[0]) fills[0].style.height = "100%";
        if (fills[1]) fills[1].style.height = `${((p - CHAPTER_BOUNDARY) / (1 - CHAPTER_BOUNDARY)) * 100}%`;
        setChapter(1);
        setCrumb("targeting");
      }
    },
  });

  if (precisionTarget) {
    ScrollTrigger.create({
      trigger: precisionTarget,
      start: `top top+=${NAV_OFFSET + 80}`,
      end: "bottom top",
      onToggle: (self) => {
        if (self.isActive) setCrumb("precision");
      },
    });
  }

  const scrollToTab = (tab: string) => {
    if (tab === "precision") {
      if (!precisionTarget) return;
      const y = window.scrollY + precisionTarget.getBoundingClientRect().top - NAV_OFFSET;
      window.scrollTo({ top: y, behavior: "smooth" });
      return;
    }
    const y = tab === "targeting" ? main.start + (main.end - main.start) * CHAPTER_BOUNDARY + 1 : main.start;
    window.scrollTo({ top: y, behavior: "smooth" });
  };
  crumbs.forEach((btn) =>
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tabTarget;
      if (tab) scrollToTab(tab);
    }),
  );

  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
}

export function initTechStory(): void {
  onLoadIdle(init, 2000);
}
