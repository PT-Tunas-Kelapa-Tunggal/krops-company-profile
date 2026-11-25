import { pickSource } from "./heroStory";

/**
 * Pauses the Krops tech visual's scan loop while the section is off screen
 * (CSS runs it only on `.ktv.is-visible`).
 */
export function initKropsTech(): void {
  const visual = document.querySelector<HTMLElement>(".ktv");
  if (!visual || !("IntersectionObserver" in window)) return;
  new IntersectionObserver(
    (entries) => entries.forEach((e) => visual.classList.toggle("is-visible", e.isIntersecting)),
    { threshold: 0.1 },
  ).observe(visual);
}

/**
 * "Untuk siapa" field video: poster first; the video source (HEVC/H.264,
 * small/large) is attached only when the section nears the viewport, plays
 * while visible and pauses off screen or in a hidden tab. Data Saver, 2G
 * and reduced-motion visitors keep the poster.
 */
export function initKropsBuiltForVideo(): void {
  const video = document.querySelector<HTMLVideoElement>("[data-kbf-video]");
  if (!video || !("IntersectionObserver" in window)) return;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (conn?.saveData || /(^|-)2g$/.test(conn?.effectiveType ?? "")) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  video.muted = true;
  video.addEventListener("playing", () => video.classList.add("is-playing"), { once: true });
  let inView = false;
  const sync = () => {
    if (inView && !document.hidden) video.play().catch(() => {});
    else video.pause();
  };
  new IntersectionObserver(
    (entries) => {
      for (const e of entries) inView = e.isIntersecting;
      if (inView && !video.getAttribute("src")) {
        const src = pickSource(video);
        if (src) {
          video.preload = "auto";
          video.src = src;
        }
      }
      sync();
    },
    { rootMargin: "25% 0px 25% 0px", threshold: 0 },
  ).observe(video);
  document.addEventListener("visibilitychange", sync);
}
