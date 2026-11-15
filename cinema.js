/** Injectable feature boundary; no private DOM or cross-feature state mutation. */
export function createCinemaFeature({ extra }) {
  if (!extra) throw new TypeError("AstroExtra service is required");
  return Object.freeze({ open: () => extra.showExtra?.("cinema"), play: id => extra.playCinema?.(id), filter: category => extra.filterCinema?.(category), quiz: id => extra.quizVideo?.(id) });
}
