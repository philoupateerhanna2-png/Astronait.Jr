# My Cadet page refresh

## What changed

- Rebuilt My Cadet as a command-center dashboard with a profile card, rank progress, stars, mission/world/trophy counters and a next-mission action.
- Added a complete equipment loadout summary and a one-click reset to starter equipment. Resetting the look does not remove purchased items or stars.
- Added wardrobe search, ownership/affordability filters and recommended, price and rarity sorting.
- Improved empty states and locked-item feedback.
- Hardened rendering against obsolete or invalid equipped cosmetic IDs in older local saves. Invalid slot IDs are displayed using the slot's starter item rather than crashing the page.
- Fixed the avatar renderer's missing data-module imports for suit and visor catalogues, which could throw during My Cadet rendering.
- Added a dedicated character-skin category with nine face/complexion and fictional alien-style skins, a free starter skin, unlock prices, rarity, previews and equip support.
- The selected skin is shown on the astronaut avatar through the helmet visor and is included in the equipment loadout. Existing saves are migrated to the free starter skin automatically.
- Moved catalogue filtering/sorting into the pure `js/features/cadet-catalog.js` module.

## Interaction notes

- Buying and equipping continue to use the existing Shop and Store APIs.
- Search and filter state is in-memory UI state; it does not change the user's save data.
- The reset action changes equipped slots only. It leaves owned cosmetics, mission history and star balances unchanged.
- This is still a local browser prototype. The displayed stars and purchases are not server-authoritative until the planned backend is deployed.

## Validation

- `npm test`: 29 tests pass, including skin catalogue and avatar-renderer tests.
- `npm run check`: syntax checks pass for 24 JavaScript files.
- Browser-level interaction could not be completed in this environment; run the manual test below before release.

## Manual browser test

1. Start the site with `python -m http.server 8000` from the project folder.
2. Open `http://localhost:8000` and enter as guest or use a demo account.
3. Complete the cadet setup if prompted, then open **My Cadet**.
4. Confirm the avatar, rank, stats, loadout and wardrobe appear.
5. Open My Cadet and confirm the Skins category is selected by default. Preview Moonlight, Sandstone, Mint Martian and Nebula Violet; unlock an affordable skin, apply it, and confirm the avatar face and loadout update. Search for `nebula`, switch categories, and test each filter and sort order.
6. Buy an affordable item, equip an owned item, then reset to the starter outfit. Confirm stars and owned items remain unchanged by the reset.
7. Test at desktop and mobile widths. Confirm no errors appear in the browser console.
