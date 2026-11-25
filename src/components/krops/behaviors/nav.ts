import { getLenis, isSafari, rafThrottle } from "./shared";

const NAV_PROBE_Y = 72;

/** Switches nav colors to match the section under it (`data-nav-mode`). */
function initNavMode(): void {
  const nav = document.querySelector<HTMLElement>("[data-nav]");
  const sections = document.querySelectorAll<HTMLElement>("[data-nav-mode]");
  if (!nav || !sections.length) return;

  const update = () => {
    let hit = document.elementFromPoint(1, NAV_PROBE_Y)?.closest<HTMLElement>("[data-nav-mode]") ?? null;
    if (!hit) {
      let covering: HTMLElement | null = null;
      let lastAbove: HTMLElement | null = null;
      for (const s of sections) {
        const r = s.getBoundingClientRect();
        if (r.top <= NAV_PROBE_Y && r.bottom > NAV_PROBE_Y) covering = s;
        if (r.top <= NAV_PROBE_Y) lastAbove = s;
      }
      hit = covering ?? lastAbove;
    }
    const mode = hit?.getAttribute("data-nav-mode");
    if (mode && nav.dataset.mode !== mode) nav.dataset.mode = mode;
  };
  const schedule = rafThrottle(update);
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  update();
}

/** Burger menu: circular reveal from the burger's center. */
function initMobileMenu(): void {
  const burger = document.querySelector<HTMLElement>("[data-nav-burger]");
  const menu = document.querySelector<HTMLElement>("[data-nav-mobile]");
  if (!burger || !menu) return;
  const links = Array.from(menu.querySelectorAll<HTMLElement>("[data-nav-mobile-link]"));

  const placeOrigin = () => {
    const b = burger.getBoundingClientRect();
    const m = menu.getBoundingClientRect();
    if (!b.width || !m.width) return;
    menu.style.setProperty("--menu-cx", `${b.left + b.width / 2 - m.left}px`);
    menu.style.setProperty("--menu-cy", `${b.top + b.height / 2 - m.top}px`);
  };
  const setOpen = (open: boolean) => {
    if (open) placeOrigin();
    menu.dataset.open = String(open);
    menu.setAttribute("aria-hidden", String(!open));
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.documentElement.classList.toggle("nav-mobile-open", open);
    if (open) getLenis()?.stop();
    else getLenis()?.start();
  };

  placeOrigin();
  window.addEventListener("resize", placeOrigin, { passive: true });
  burger.addEventListener("click", () => setOpen(menu.dataset.open !== "true"));
  links.forEach((l) => l.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.dataset.open === "true") setOpen(false);
  });
  window.matchMedia("(min-width: 1025px)").addEventListener?.("change", (e) => {
    if (e.matches) setOpen(false);
  });
}

/**
 * Safari can't run the CSS goo filter on the pills, so the source draws the
 * pill silhouettes into an SVG and hides the connectors next to the hovered pill.
 */
function initSafariGoo(): void {
  if (!isSafari()) return;
  const shapes = document.querySelector<SVGSVGElement>("[data-nav-goo-shapes]");
  const group = document.querySelector<HTMLElement>(".nav-pills.nav-goo");
  if (!shapes || !group) return;
  const pills = Array.from(group.querySelectorAll<HTMLElement>(".nav-pill"));
  const pillRects = Array.from(shapes.querySelectorAll<SVGRectElement>("[data-nav-shape-pill]"));
  const connectors = Array.from(shapes.querySelectorAll<SVGRectElement>("[data-nav-shape-connector]"));
  const OVERLAP = 10;
  const set = (el: Element, attrs: Record<string, number | string>) =>
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, String(v)));

  const layout = () => {
    const g = group.getBoundingClientRect();
    const rects = pills.map((p) => p.getBoundingClientRect());
    const w = Math.max(1, Math.round(g.width));
    const h = Math.max(1, Math.round(g.height));
    set(shapes, { viewBox: `0 0 ${w} ${h}`, width: w, height: h });
    pills.forEach((_, i) => {
      const shape = pillRects[i];
      if (!shape) return;
      const r = rects[i];
      set(shape, { x: r.left - g.left, y: r.top - g.top, width: r.width, height: r.height, rx: r.height / 2, ry: r.height / 2 });
    });
    for (let i = 0; i < pills.length; i++) {
      const c = connectors[i];
      if (!c) continue;
      const a = rects[i];
      const b = rects[i + 1];
      if (!a || !b) {
        set(c, { width: 0, height: 0 });
        continue;
      }
      const x = a.right - g.left - OVERLAP;
      const width = b.left - g.left + OVERLAP - x;
      set(c, { x, y: a.top - g.top, width: Math.max(0, width), height: Math.max(0, a.height), rx: 4, ry: 4 });
    }
  };
  layout();
  let t: number | undefined;
  window.addEventListener(
    "resize",
    () => {
      window.clearTimeout(t);
      t = window.setTimeout(layout, 80);
    },
    { passive: true },
  );
  document.fonts?.ready.then(() => requestAnimationFrame(layout));

  const setActive = (idx: number | null) => {
    connectors.forEach((c, i) => {
      if (idx !== null && (i === idx - 1 || i === idx)) c.setAttribute("data-nav-hidden", "");
      else c.removeAttribute("data-nav-hidden");
    });
    if (idx === null) delete group.dataset.navActiveIdx;
    else group.dataset.navActiveIdx = String(idx);
  };
  pills.forEach((p, i) => {
    p.addEventListener("pointerenter", () => setActive(i));
    p.addEventListener("pointerleave", () => setActive(null));
    p.addEventListener("focus", () => setActive(i));
    p.addEventListener("blur", () => setActive(null));
  });
}

export function initNav(): void {
  initNavMode();
  initMobileMenu();
  initSafariGoo();
}
