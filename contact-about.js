/** Injectable feature boundary; no private DOM or cross-feature state mutation. */
export function createContactAboutFeature({ app, extra }) {
  if (!app) throw new TypeError("app is required");
  return Object.freeze({ openContact: () => extra?.showExtra ? extra.showExtra("contact") : app.go("contact"), openAbout: () => extra?.showExtra ? extra.showExtra("about") : app.go("about") });
}
