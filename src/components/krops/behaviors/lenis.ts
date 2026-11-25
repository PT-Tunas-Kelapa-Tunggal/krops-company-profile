import Lenis from "lenis";
import { ScrollTrigger } from "./gsap";
import { getLenis, isSafari, onLoadIdle, prefersReducedMotion, setLenis } from "./shared";

/**
 * Smooth wheel scrolling (Chromium/Firefox only, like the source — Safari
 * already has native inertia and its goo filters fight Lenis).
 */
export function initLenis(): void {
  if (isSafari() || prefersReducedMotion() || getLenis()) return;
  onLoadIdle(() => {
    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: { offset: 0 },
    });
    setLenis(lenis);
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    lenis.on("scroll", () => ScrollTrigger.update());
    document.dispatchEvent(new CustomEvent("lenis:ready", { detail: { lenis } }));
  }, 1500);
}
