/** Injectable feature boundary; no private DOM or cross-feature state mutation. */
export function createProgressFeature({ progress, store }) {
  if (!progress || !store) throw new TypeError("progress and store services are required");
  return Object.freeze({
    snapshot: () => ({ completed: store.state?.completed?.slice?.() || [], nextStage: progress.nextStage?.() || null, rank: progress.rank?.() || null }),
    isDone: id => !!progress.isDone(id),
    unlocked: id => !!progress.unlocked(id)
  });
}
