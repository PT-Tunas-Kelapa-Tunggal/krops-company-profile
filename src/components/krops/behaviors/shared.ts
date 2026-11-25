import type Lenis from "lenis";

/** The page's Lenis instance once booted (nav, modal and reveal pause it). */
let lenisInstance: Lenis | undefined;
export const getLenis = (): Lenis | undefined => lenisInstance;
export const setLenis = (l: Lenis): void => {
  lenisInstance = l;
};

export const prefersReducedMotion = (): boolean =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

export const isSafari = (): boolean =>
  document.documentElement.classList.contains("is-safari");

export const clamp = (v: number, min = 0, max = 1): number =>
  Math.max(min, Math.min(max, v));

/** Coalesces scroll/resize bursts into one call per animation frame. */
export function rafThrottle(fn: () => void): () => void {
  let queued = false;
  return () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      fn();
    });
  };
}

export function whenIdle(fn: () => void, timeout: number, fallbackMs = 200): void {
  if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(fn, { timeout });
  else window.setTimeout(fn, fallbackMs);
}

/** Runs `fn` once the window has loaded and the browser is idle (source pattern). */
export function onLoadIdle(fn: () => void, timeout: number): void {
  const start = () => whenIdle(fn, timeout);
  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
}
