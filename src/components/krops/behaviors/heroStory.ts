import { gsap, ScrollTrigger } from "./gsap";
import { clamp, prefersReducedMotion, rafThrottle, whenIdle } from "./shared";

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutQuad = (t: number) => 1 - Math.pow(1 - t, 2);
const range = (v: number, a: number, b: number) => clamp((v - a) / (b - a));

/**
 * The 500vh hero: a clip-path mask opens from the center on load, the video
 * card then grows to full-bleed as you scroll, the FX layer fades, a circular
 * aperture closes around the "Our response" copy and its characters light up.
 */
export function initHeroStory(): void {
  const hero = document.querySelector<HTMLElement>("[data-hero-story]");
  if (!hero || hero.dataset.hsInitialized === "1") return;
  hero.dataset.hsInitialized = "1";

  const small = window.matchMedia?.("(max-width: 540px)").matches ?? false;
  const inset = small ? 8 : 16;
  const radius = small ? 22 : 24;

  if (prefersReducedMotion()) {
    hero.style.setProperty("--mask-inset", `${inset}px`);
    hero.style.setProperty("--mask-radius", `${radius}px`);
    hero.style.setProperty("--clip-radius", "9999px");
    hero.classList.add("is-hs-intro-done", "is-hs-ready");
    document.dispatchEvent(new CustomEvent("krops:hero-intro-done"));
    return;
  }

  hero.style.setProperty("--mask-inset", "50%");
  hero.style.setProperty("--mask-radius", "50%");
  hero.style.setProperty("--clip-radius", "9999px");

  let introDone = false;
  const preloaderDone = new Promise<void>((resolve) => {
    if (!document.getElementById("krops-preloader")) return resolve();
    document.addEventListener("krops:preloader-done", () => resolve(), { once: true });
  });
  const fontsReady = document.fonts?.ready ?? Promise.resolve();

  const chars = Array.from(document.querySelectorAll<HTMLElement>("[data-response-text] .hs__char"));
  const last: Record<string, string> = {};
  const setVar = (name: string, value: string) => {
    if (last[name] === value) return;
    last[name] = value;
    hero.style.setProperty(name, value);
  };

  const update = () => {
    const r = hero.getBoundingClientRect();
    const scrollable = r.height - window.innerHeight;
    const p = scrollable > 0 ? clamp(-r.top / scrollable) : 0;
    const grow = easeOutCubic(range(p, 0, 0.15));
    const fx = 1 - easeOutCubic(range(p, 0.15, 0.55));
    const response = easeOutCubic(range(p, 0.75, 0.85));
    if (chars.length) {
      const lit = Math.round(easeOutCubic(range(p, 0.9, 1)) * chars.length);
      chars.forEach((c, i) => {
        const on = i < lit;
        if (on !== c.classList.contains("is-lit")) c.classList.toggle("is-lit", on);
      });
    }
    if (introDone) {
      setVar("--mask-inset", `${(inset * (1 - grow)).toFixed(1)}px`);
      setVar("--mask-radius", `${(radius * (1 - grow)).toFixed(1)}px`);
    }
    setVar("--fx-opacity", fx.toFixed(3));
    setVar("--response-opacity", response.toFixed(3));
    setVar("--response-y", `${(60 * (1 - response)).toFixed(1)}px`);
  };
  const schedule = rafThrottle(update);
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  requestAnimationFrame(update);

  Promise.all([fontsReady, preloaderDone]).then(() => {
    const apertureMin = small ? 100 : 200;
    const half = Math.max(window.innerWidth, window.innerHeight) / 2;
    gsap.set(hero, { "--mask-inset": `${half}px`, "--mask-radius": `${half}px`, "--clip-radius": "9999px" });
    hero.classList.add("is-hs-ready");

    const OPEN = 9999;
    let lastClip = "";
    const createApertureTrigger = () =>
      ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
        onUpdate: (self) => {
          const p = self.progress;
          let px: number;
          if (p < 0.75) px = OPEN;
          else if (p < 0.9) px = OPEN - (OPEN - apertureMin) * easeOutQuad((p - 0.75) / 0.15);
          else px = apertureMin;
          const v = `${px.toFixed(1)}px`;
          if (v !== lastClip) {
            lastClip = v;
            hero.style.setProperty("--clip-radius", v);
          }
        },
      });

    gsap
      .timeline({
        onComplete: () => {
          introDone = true;
          hero.classList.add("is-hs-intro-done");
          document.dispatchEvent(new CustomEvent("krops:hero-intro-done"));
          createApertureTrigger();
          ScrollTrigger.refresh();
          requestAnimationFrame(update);
        },
      })
      .to(hero, { "--mask-inset": `${inset}px`, "--mask-radius": `${radius}px`, duration: 1.8, ease: "expo.out" });

    let t: number | undefined;
    window.addEventListener(
      "resize",
      () => {
        window.clearTimeout(t);
        t = window.setTimeout(() => ScrollTrigger.refresh(), 200);
      },
      { passive: true },
    );
  });

  // Both video layers start together once each can play.
  const videos = [
    document.querySelector<HTMLVideoElement>("[data-hs-video-base]"),
    document.querySelector<HTMLVideoElement>("[data-hs-video-fx]"),
  ].filter((v): v is HTMLVideoElement => !!v);
  let ready = 0;
  const playAll = () => {
    videos.forEach((v) => {
      try {
        v.currentTime = 0;
      } catch {
        /* ignore */
      }
      v.play().catch(() => {});
    });
    hero.style.setProperty("--video-opacity", "1");
  };
  videos.forEach((v) => {
    v.muted = true;
    const onReady = () => {
      if (v.dataset.hsReady === "1") return;
      v.dataset.hsReady = "1";
      ready += 1;
      if (ready >= videos.length) playAll();
    };
    v.addEventListener("loadeddata", onReady, { once: true });
    v.addEventListener("canplay", onReady, { once: true });
    v.addEventListener("canplaythrough", onReady, { once: true });
  });
  // Data saver / very slow links keep the poster frame only: no video bytes.
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (conn?.saveData || /(^|-)2g$/.test(conn?.effectiveType ?? "")) return;

  const attachSources = () =>
    videos.forEach((v) => {
      const src = pickSource(v);
      if (!src || v.getAttribute("src")) return;
      v.preload = "auto";
      v.src = src;
      v.load();
    });
  whenIdle(attachSources, 1500, 150);

  // Don't decode a 15 s loop nobody can see: pause when the hero is off
  // screen or the tab is hidden, resume when it comes back.
  let heroVisible = true;
  const syncPlayback = () =>
    videos.forEach((v) => {
      if (v.dataset.hsReady !== "1") return;
      if (heroVisible && !document.hidden) v.play().catch(() => {});
      else v.pause();
    });
  new IntersectionObserver(
    (entries) => {
      heroVisible = entries.some((e) => e.isIntersecting);
      syncPlayback();
    },
    { threshold: 0 },
  ).observe(hero);
  document.addEventListener("visibilitychange", syncPlayback);
}

type VideoSource = { src: string; type: string; media?: string };

/**
 * First `data-sources` entry whose media query matches and whose codec this
 * browser can decode (e.g. HEVC on Safari / hardware-capable Chrome, H.264
 * elsewhere); falls back to `data-src`.
 */
export function pickSource(v: HTMLVideoElement): string | undefined {
  let list: VideoSource[] = [];
  try {
    list = JSON.parse(v.dataset.sources ?? "[]") as VideoSource[];
  } catch {
    /* malformed: use data-src */
  }
  const hit = list.find((s) => (!s.media || window.matchMedia(s.media).matches) && v.canPlayType(s.type) !== "");
  return hit?.src ?? v.dataset.src;
}
