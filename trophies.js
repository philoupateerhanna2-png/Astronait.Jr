/** Injectable feature boundary; no private DOM or cross-feature state mutation. */
export function createTrophiesFeature({ trophies }) {
  if (!trophies) throw new TypeError("trophies service is required");
  return Object.freeze({ check: () => trophies.check(), has: id => trophies.has(id), earnedCount: () => trophies.earnedCount() });
}
