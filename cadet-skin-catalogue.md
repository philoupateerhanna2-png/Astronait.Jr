# My Cadet character skins

Character skins are defined in `js/data/cosmetics.js` in the `SKINS` array.
Each skin has a stable `id`, display `name`, `price`, `rarity`, `desc`, and `colors`.
Optional `features` customize the character rendered inside the helmet:

- `hair`: `silver_swept`, `white_curly`, `brown_tuft`, or `dark_curls`
- `glasses`: `round` or `rectangular`
- `beard`: a color value
- `mustache`: a color value

The vector avatar and shop thumbnail render these features in `js/features/art.js`.
New entries should use unique IDs, positive prices for unlockable skins, and valid six-digit hex face colors.

## Added character skins

| Skin | Price | Character details |
|---|---:|---|
| Old Astronaut | 80 stars | Silver swept hair, silver beard and moustache |
| Scientist Junior | 120 stars | Brown hair and round glasses |
| Scientist Pro | 160 stars | Silver hair and rectangular glasses |
| Professor Nova | 260 stars | White curly hair, beard, moustache and round glasses |
| Field Scientist | 300 stars | Dark curls and round glasses |

All are cosmetic-only; they do not change mission scores, roles, or rewards.
