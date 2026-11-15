/** Injectable feature boundary; no private DOM or cross-feature state mutation. */
export function createAstroFeature({ pip, talk }) {
  if (!pip) throw new TypeError("Astro tutor service is required");
  return Object.freeze({ ask: question => pip.ask?.(question), toggle: force => pip.toggle?.(force), talk: text => talk?.say?.(text), stop: () => talk?.stop?.() });
}
