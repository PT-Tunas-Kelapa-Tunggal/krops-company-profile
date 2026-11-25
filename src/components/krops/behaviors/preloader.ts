const SEEN_KEY = "krops.preloaderSeen";
const SHOW_MS = 900;
const EXIT_MS = 720;

const done = () => document.dispatchEvent(new CustomEvent("krops:preloader-done"));

/** Logo splash shown once per browser session, then `krops:preloader-done`. */
export function initPreloader(): void {
  const el = document.getElementById("krops-preloader");
  if (!el) return;

  let seen = false;
  try {
    seen = !!sessionStorage.getItem(SEEN_KEY);
  } catch {
    /* storage blocked: show it */
  }
  if (seen) {
    el.remove();
    requestAnimationFrame(done);
    return;
  }

  const html = document.documentElement;
  const body = document.body;
  const prevOverflow = body.style.overflow;
  body.style.overflow = "hidden";
  html.style.overflow = "hidden";
  requestAnimationFrame(() => {
    el.dataset.state = "showing";
  });
  window.setTimeout(() => {
    el.dataset.state = "exiting";
    body.style.overflow = prevOverflow;
    html.style.overflow = "";
    window.setTimeout(() => {
      el.remove();
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* ignore */
      }
      done();
    }, EXIT_MS);
  }, SHOW_MS);
}
