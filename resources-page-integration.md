# Resources page integration

- Added a Resources tab to the primary navigation and a matching `view-resources` page.
- Integrated the three supplied categories: NASA resources, educational research and quality standards, and development/testing tools.
- Kept the supplied destination URLs and added `rel="noopener noreferrer"` to external links.
- Restyled the content with the existing Astronaut Jr design tokens so it works with the app's light/dark themes and responsive layout.
- Added reviewed Arabic translations for the page headings, link labels, and descriptions. English remains the source language; the translation system intentionally leaves unknown text unchanged.
- Added regression tests for navigation, page content, safe external-link attributes, and Arabic dictionary coverage.

## Verification

- `npm test`: 42 tests passed.
- `npm run check`: syntax check passed for 25 JavaScript files.
- Manual browser interaction testing was not performed as part of this integration.
