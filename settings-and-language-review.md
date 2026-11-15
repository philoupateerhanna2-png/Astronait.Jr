# Settings and language system review

## Delivered
- Settings now includes explicit Light/Dark appearance choices and English/Arabic language choices.
- The top-bar theme shortcut and settings appearance choices use the same `AstroTheme` controller.
- Theme selection persists in `localStorage` under `astronaut-jr-theme` and updates `aria-pressed` state on every theme control.
- Language selection is available in the top bar and settings. It persists under `aj-lang`, updates the document `lang` and `dir`, and synchronizes all language buttons.
- Settings choices are responsive and have visible keyboard focus.

## Language-system review and correction
- The previous language module described an online translation fallback, but it did not call a translation service. Its queue only looked up old local cache values.
- Removed reliance on legacy `aj-ar-cache` / `aj-ar-cache-v2` entries. Old, potentially unreviewed translations are no longer applied.
- Arabic is now deliberately offline-first and dictionary-based. Unknown strings remain in English instead of being replaced with stale or unverified text.
- Added reviewed Arabic translations for the new settings labels.
- The settings panel explains that some lesson/activity text may remain in English until reviewed translations are added.

## Known limitations / next review items
- The dictionary is not yet a complete translation of every mission, quiz, planet fact, modal, dynamic notification, and accessibility label. Do not describe Arabic as 100% complete.
- Mixed Arabic/English technical terms, numbers, and inline direction need a full RTL visual pass on desktop and mobile.
- Text embedded in images, canvas drawings, and third-party simulations may not follow the app language.
- Browser-level manual checks are still required for dynamic views, auth overlays, and screen-reader announcements.

## Manual acceptance checklist
1. Change language from the header, then from Settings; both controls should show the same selected state.
2. Refresh and verify the selected language is restored.
3. Verify Arabic sets RTL and English restores LTR.
4. Change theme from the header and from Settings; both controls should synchronize.
5. Refresh and verify theme is restored.
6. Check missions, planet details, My Cadet, store, quizzes, modals, and toast messages in both languages and themes.
