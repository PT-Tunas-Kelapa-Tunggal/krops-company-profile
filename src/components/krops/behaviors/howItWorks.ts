/**
 * Behaviour for the "Cara kerja" section: scroll progress
 * through the pinned section picks the active step (phone screenshot,
 * title, caption, rail node) and grows the rail fill; the heading fades in
 * via `.reveal` → `.in`.
 */
export function initHowItWorks(): void {
  const how = document.querySelector<HTMLElement>(".bh #how");
  if (!how) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
  );
  how.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  const shots = Array.from(how.querySelectorAll<HTMLElement>(".how__shot"));
  const titles = Array.from(how.querySelectorAll<HTMLElement>(".how__titles .how-phase"));
  const caps = Array.from(how.querySelectorAll<HTMLElement>(".how__captions .how-cap"));
  const nodes = Array.from(how.querySelectorAll<HTMLElement>(".how__node"));
  const rail = how.querySelector<HTMLElement>(".how__rail");
  const fill = how.querySelector<HTMLElement>(".how__rail-fill");
  const count = titles.length;
  const NODE = 26; // matches `.how__node b` size in the CSS
  let current = -1;

  const setActive = (i: number) => {
    if (i === current) return;
    current = i;
    shots.forEach((c, idx) => {
      const on = idx === i;
      c.classList.toggle("is-active", on);
      if (c instanceof HTMLVideoElement) {
        if (on && !reduce) {
          c.muted = true;
          c.play().catch(() => {});
        } else {
          c.pause();
          if (!on) c.currentTime = 0;
        }
      }
    });
    [titles, caps].forEach((list) =>
      list.forEach((t, idx) => {
        t.classList.toggle("is-active", idx === i);
        t.classList.toggle("is-past", idx < i);
      }),
    );
    nodes.forEach((n, idx) => {
      n.classList.toggle("is-active", idx === i);
      n.classList.toggle("is-done", idx < i);
    });
  };

  // The line reaches each node exactly as that step activates.
  const setFill = (p: number) => {
    if (!fill || !rail || count < 2) return;
    const frac = Math.min(1, (p * count) / (count - 1));
    fill.style.height = `${frac * (rail.offsetHeight - NODE)}px`;
  };

  const update = () => {
    const rect = how.getBoundingClientRect();
    const scrollable = how.offsetHeight - window.innerHeight;
    const p = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
    setActive(Math.min(count - 1, Math.floor(p * count)));
    setFill(p);
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", () => {
    current = -1;
    update();
  });
}
