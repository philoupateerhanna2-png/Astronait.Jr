/** Injectable feature boundary; no private DOM or cross-feature state mutation. */
export function createCadetShopFeature({ shop, app }) {
  if (!shop || !app) throw new TypeError("shop and app are required");
  return Object.freeze({ look: () => ({ ...shop.look() }), find: id => shop.find(id), buy: id => app.buyItem(id), equip: id => app.equipItem(id), ownedCount: () => shop.ownedCount() });
}
