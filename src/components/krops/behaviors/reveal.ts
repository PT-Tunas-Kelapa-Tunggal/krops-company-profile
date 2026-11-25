import { gsap, lineReveal } from "./gsap";
import { getLenis, prefersReducedMotion } from "./shared";

const clearInline = (el: HTMLElement, attr: string) => {
  el.removeAttribute(attr);
  el.style.transform = "";
  el.style.opacity = "";
  el.style.willChange = "";
};

/**
 * Page intro + on-scroll reveals. Locks scrolling until the hero intro has
 * played, then fades the nav in and staggers the hero copy; sections marked
 * `data-reveal-section` stagger their `data-reveal-item`s when they enter.
 */
export function initReveal(): void {
  const reduced = prefersReducedMotion();
  const html = document.documentElement;
  const staticNav = !!document.querySelector("[data-reveal-static-nav]");
  const nav = document.querySelector<HTMLElement>("[data-nav]");
  const mobileNav = document.querySelector<HTMLElement>("[data-nav-mobile]");

  if (nav && !reduced && !staticNav) nav.setAttribute("data-reveal-nav", "pending");
  if (mobileNav && !reduced && !staticNav) mobileNav.setAttribute("data-reveal-nav", "pending");
  window.scrollTo(0, 0);

  html.classList.add("reveal-locked");
  const stopLenisWhileLocked = () => {
    if (html.classList.contains("reveal-locked")) getLenis()?.stop();
  };
  stopLenisWhileLocked();
  document.addEventListener("lenis:ready", stopLenisWhileLocked, { once: true });

  let completed = false;
  const complete = () => {
    if (completed) return;
    completed = true;
    html.classList.remove("reveal-locked");
    html.classList.add("reveal-complete");
    getLenis()?.start();
    document.dispatchEvent(new CustomEvent("krops:reveal-complete"));
  };

  // Safety net if the preloader never reports back.
  const fallback = window.setTimeout(() => {
    html.classList.add("reveal-ready");
    complete();
  }, 4000);

  const playIntro = () => {
    window.clearTimeout(fallback);
    html.classList.remove("reveal-ready");
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-hero-intro-item]"));

    if (reduced) {
      nav?.removeAttribute("data-reveal-nav");
      mobileNav?.removeAttribute("data-reveal-nav");
      gsap.set([nav, mobileNav, ...items].filter(Boolean), { clearProps: "opacity,transform,willChange" });
      complete();
      return;
    }

    const fadeItems = items.filter((el) => !el.hasAttribute("data-line-reveal"));
    const lineItems = items.filter((el) => el.hasAttribute("data-line-reveal"));
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      if (nav && !staticNav) {
        nav.removeAttribute("data-reveal-nav");
        gsap.fromTo(nav, { opacity: 0, y: -28 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", clearProps: "willChange,transform" });
      }
      if (mobileNav && !staticNav) {
        mobileNav.removeAttribute("data-reveal-nav");
        gsap.fromTo(mobileNav, { opacity: 0 }, { opacity: 1, duration: 0.4, delay: 0.3, clearProps: "opacity,willChange" });
      }
      lineItems.forEach((el, i) => {
        el.removeAttribute("data-hero-intro-item");
        el.style.opacity = "";
        lineReveal(el, { delay: i * 0.05, duration: 1, stagger: 0.09 });
      });
      if (fadeItems.length) {
        gsap.fromTo(
          fadeItems,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
            delay: 0.25,
            onComplete: () => {
              fadeItems.forEach((el) => clearInline(el, "data-hero-intro-item"));
              complete();
            },
          },
        );
      } else {
        window.setTimeout(complete, 1200);
      }
    };
    document.addEventListener("krops:hero-intro-done", start, { once: true });
    window.setTimeout(start, 4000);
  };

  let introQueued = false;
  const queueIntro = () => {
    if (introQueued) return;
    introQueued = true;
    playIntro();
  };
  document.addEventListener("krops:preloader-done", queueIntro, { once: true });
  if (!document.getElementById("krops-preloader")) requestAnimationFrame(queueIntro);

  if (reduced || !("IntersectionObserver" in window)) return;

  const sections = document.querySelectorAll<HTMLElement>("[data-reveal-section]");
  if (sections.length) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const section = entry.target as HTMLElement;
          io.unobserve(section);
          const items = Array.from(section.querySelectorAll<HTMLElement>("[data-reveal-item]"));
          section
            .querySelectorAll<HTMLElement>("[data-line-reveal]")
            .forEach((el, i) => lineReveal(el, { delay: i * 0.05, duration: 0.9, stagger: 0.09 }));
          if (!items.length) continue;
          items.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
          gsap.fromTo(
            items,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 1.1,
              ease: "expo.out",
              delay: 0.15,
              stagger: 0.08,
              onComplete: () => items.forEach((el) => clearInline(el, "data-reveal-item")),
            },
          );
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0 },
    );
    sections.forEach((s) => io.observe(s));
  }

  const loose = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal-item], [data-line-reveal]")).filter(
    (el) => !el.closest("[data-reveal-section]") && !el.closest("[data-hero-story]"),
  );
  if (loose.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          io.unobserve(el);
          if (el.hasAttribute("data-line-reveal")) {
            lineReveal(el, { duration: 0.9, stagger: 0.09 });
          } else {
            gsap.fromTo(
              el,
              { opacity: 0, y: 40 },
              { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", onComplete: () => clearInline(el, "data-reveal-item") },
            );
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0 },
    );
    loose.forEach((el) => io.observe(el));
  }
}
