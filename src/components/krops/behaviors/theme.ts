export const THEME_KEY = "krops.theme";
export type Theme = "light" | "dark";

/**
 * Inline <head> script (runs before first paint, so there is no flash of
 * the wrong theme): the stored choice wins, otherwise the system setting.
 * Kept as a string so the layout can inline it.
 */
export const themeBootScript = `(function(){try{var t=localStorage.getItem('${THEME_KEY}');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='light';}})();`;

const current = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

function apply(theme: Theme, toggles: HTMLElement[]) {
  document.documentElement.dataset.theme = theme;
  const label = theme === "dark" ? "Ganti ke mode terang" : "Ganti ke mode gelap";
  toggles.forEach((b) => {
    b.setAttribute("aria-label", label);
    b.setAttribute("aria-pressed", String(theme === "dark"));
  });
}

/**
 * Nav toggle: flips light/dark and remembers the choice. Until the visitor
 * picks one, the page follows the OS setting live.
 */
export function initThemeToggle(): void {
  const toggles = Array.from(document.querySelectorAll<HTMLElement>("[data-theme-toggle]"));
  apply(current(), toggles);

  const stored = () => {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch {
      return null;
    }
  };

  const set = (theme: Theme) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    if (doc.startViewTransition && !reduce) doc.startViewTransition(() => apply(theme, toggles));
    else apply(theme, toggles);
  };

  toggles.forEach((btn) =>
    btn.addEventListener("click", () => {
      const next: Theme = current() === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        /* private mode: still switch for this page view */
      }
      set(next);
    }),
  );

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!stored()) set(e.matches ? "dark" : "light");
  });
}
