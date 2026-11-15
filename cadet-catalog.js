/** Pure catalogue filtering/sorting for the My Cadet wardrobe. */
export function filterCadetItems(items, options = {}) {
  const list = Array.isArray(items) ? items : [];
  const owned = new Set(Array.isArray(options.ownedIds) ? options.ownedIds : []);
  const stars = Number.isFinite(Number(options.stars)) ? Number(options.stars) : 0;
  const query = String(options.query || "").trim().toLowerCase();
  const filter = ["all", "owned", "available", "locked"].includes(options.filter) ? options.filter : "all";
  const sort = ["recommended", "price-low", "price-high", "rarity"].includes(options.sort) ? options.sort : "recommended";
  const rarityOrder = ["common", "rare", "epic", "legendary"];
  const equippedId = options.equippedId || "";

  return list.filter(item => {
    const isOwned = owned.has(item.id);
    const affordable = stars >= Number(item.price || 0);
    const searchable = `${item.name || ""} ${item.desc || ""} ${item.rarity || ""}`.toLowerCase();
    const matchesQuery = !query || searchable.includes(query);
    const matchesFilter = filter === "owned" ? isOwned
      : filter === "available" ? (!isOwned && affordable)
      : filter === "locked" ? (!isOwned && !affordable) : true;
    return matchesQuery && matchesFilter;
  }).slice().sort((a, b) => {
    const ap = Number(a.price || 0), bp = Number(b.price || 0);
    if (sort === "price-low") return ap - bp || String(a.name).localeCompare(String(b.name));
    if (sort === "price-high") return bp - ap || String(a.name).localeCompare(String(b.name));
    if (sort === "rarity") return rarityOrder.indexOf(a.rarity || "common") - rarityOrder.indexOf(b.rarity || "common") || ap - bp;
    const score = item => item.id === equippedId ? 0 : owned.has(item.id) ? 1 : stars >= Number(item.price || 0) ? 2 : 3;
    return score(a) - score(b) || ap - bp;
  });
}
