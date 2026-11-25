import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };

type LineRevealOptions = { duration?: number; stagger?: number; ease?: string; delay?: number };

/** Masked line-by-line rise used for headings marked `data-line-reveal`. */
export function lineReveal(el: HTMLElement, opts: LineRevealOptions = {}): void {
  if (el.dataset.lineRevealDone === "true" || el.dataset.lineRevealStarted === "true") return;
  el.dataset.lineRevealStarted = "true";
  // Split only once web fonts are in: lines measured in a fallback font keep
  // their breaks, so a wider display face (Krops Type) would overflow them.
  const fonts = document.fonts;
  if (fonts && fonts.status !== "loaded") fonts.ready.then(() => splitAndReveal(el, opts));
  else splitAndReveal(el, opts);
}

function splitAndReveal(el: HTMLElement, opts: LineRevealOptions): void {
  const split = new SplitText(el, { type: "lines", linesClass: "hs-split-line", mask: "lines" });
  gsap.set(split.lines, { yPercent: 110 });
  el.dataset.lineRevealDone = "true";
  gsap.set(el, { opacity: 1 });
  gsap.to(split.lines, {
    yPercent: 0,
    duration: opts.duration ?? 0.9,
    stagger: opts.stagger ?? 0.09,
    ease: opts.ease ?? "power3.out",
    delay: opts.delay ?? 0,
    onComplete: () => {
      gsap.set(split.lines, { clearProps: "transform,willChange" });
    },
  });
  let t: number | undefined;
  window.addEventListener(
    "resize",
    () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        try {
          split.revert();
        } catch {
          /* already reverted */
        }
        new SplitText(el, { type: "lines", linesClass: "hs-split-line", mask: "lines" });
      }, 250);
    },
    { passive: true },
  );
}
