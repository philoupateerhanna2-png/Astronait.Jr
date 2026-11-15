/** Injectable feature boundary; no private DOM or cross-feature state mutation. */
export function createLabFeature({ extra }) {
  if (!extra) throw new TypeError("AstroExtra service is required");
  return Object.freeze({ open: () => extra.showExtra?.("lab"), daily: () => extra.daily?.(), discovery: id => extra.discovery?.(id), puzzle: id => extra.puzzle?.(id), startLander: () => extra.startLander?.() });
}
