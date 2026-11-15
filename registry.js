import { createProgressFeature } from "./progress.js";
import { createMissionsFeature } from "./missions.js";
import { createPlanetsFeature } from "./planets.js";
import { createCadetShopFeature } from "./cadet-shop.js";
import { createTrophiesFeature } from "./trophies.js";
import { createAstroFeature } from "./astro.js";
import { createCinemaFeature } from "./cinema.js";
import { createLabFeature } from "./lab.js";
import { createContactAboutFeature } from "./contact-about.js";

export function registerFeatures(runtime, app) {
  if (!runtime || !app) return null;
  const services = {
    store: runtime.Store, progress: runtime.Progress, session: runtime.Session,
    stages: runtime.STAGES, planets: runtime.PLANETS, sun: runtime.SUN_INFO,
    shop: runtime.Shop, trophies: runtime.Trophies, pip: runtime.Pip,
    talk: runtime.Talk, extra: window.AstroExtra
  };
  const features = Object.freeze({
    progress: createProgressFeature(services),
    missions: createMissionsFeature({ app, session: services.session, stages: services.stages, store: services.store }),
    planets: createPlanetsFeature({ app, planets: services.planets, sun: services.sun }),
    cadetShop: createCadetShopFeature({ shop: services.shop, app }),
    trophies: createTrophiesFeature({ trophies: services.trophies }),
    astro: createAstroFeature({ pip: services.pip, talk: services.talk }),
    cinema: services.extra ? createCinemaFeature({ extra: services.extra }) : null,
    lab: services.extra ? createLabFeature({ extra: services.extra }) : null,
    contactAbout: createContactAboutFeature({ app, extra: services.extra })
  });
  window.AstroFeatures = features;
  window.dispatchEvent(new CustomEvent("astro:features-ready", { detail: features }));
  return features;
}
