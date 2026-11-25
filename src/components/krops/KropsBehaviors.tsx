"use client";

import { useEffect } from "react";
import { initHowItWorks } from "./behaviors/howItWorks";
import { initKropsBuiltForVideo, initKropsTech } from "./behaviors/sectionMedia";
import { initThemeToggle } from "./behaviors/theme";
import { initContactModal } from "./behaviors/contactModal";
import { initHeroStory } from "./behaviors/heroStory";
import { initLenis } from "./behaviors/lenis";
import { initNav } from "./behaviors/nav";
import { initPreloader } from "./behaviors/preloader";
import { initReveal } from "./behaviors/reveal";
import { initScrollProgress, initTeamScroll } from "./behaviors/sections";
import { initTechStory } from "./behaviors/techStory";

// The page is static markup enhanced in place (as on the source site). Each
// initializer attaches page-lifetime listeners, so run them exactly once —
// React's dev double-mount must not attach them twice.
let started = false;

export function KropsBehaviors() {
  useEffect(() => {
    if (started) return;
    started = true;
    // Same order as the source's scripts.
    initThemeToggle();
    initPreloader();
    initReveal();
    initNav();
    initScrollProgress();
    initHeroStory();
    initTechStory(); // drives the Krops "Teknologi" chapters
    initKropsTech();
    initHowItWorks(); // "Cara kerja" 5-step timeline
    initKropsBuiltForVideo();
    initTeamScroll();
    initContactModal();
    initLenis();
  }, []);
  return null;
}
