# My Cadet — Character Creator

The wardrobe now has three independent appearance slots in addition to character skins:

- **Hair:** Skin Signature, Classic Sweep, Comet Curls, Rocket Spikes, Silver Scholar, Ice Blue Flow.
- **Eyes:** Classic Eyes, Bright Eyes, Confident Look, Sleepy Explorer, Starry Eyes.
- **Expressions:** Happy Smile, Big Grin, Surprised, Curious, Calm Focus.

## How it works

- The selected skin controls face colors and any signature features such as the Old Astronaut beard or Scientist glasses.
- Hair, eye style and expression are separate cosmetic slots. They can be purchased and equipped independently.
- The free defaults are `hair_skin_default`, `eyes_classic`, and `expression_smile`.
- The current selections are stored in the existing local save under `equipped` and are migrated automatically for older saves.
- The same selected appearance is used by the full cadet SVG and wardrobe thumbnails.

## Manual acceptance test

1. Open My Cadet and choose Hair, Eyes and Expressions in the wardrobe tabs.
2. Preview the starter options; buy one affordable option in each category and equip it.
3. Confirm the large avatar changes immediately after each equip.
4. Refresh the page and confirm the three choices remain equipped.
5. Switch to Old Astronaut and Scientist skins; confirm their signature beard/glasses remain visible with Skin Signature hair.
6. Select a different hair style, then return to Skin Signature and confirm the skin's original hairstyle returns.
7. Reset the look and confirm all three appearance slots return to their free defaults.
