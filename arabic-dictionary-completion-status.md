# Arabic dictionary expansion — status

This update adds reviewed Arabic entries for all 15 mission titles and subtitles, mission activity titles, lesson headings, core astronomy vocabulary, planet names, and common planet fact labels. It preserves English source strings so switching back to English remains reliable.

## Important coverage boundary

This is not a claim that every sentence in every lesson, quiz, hint, explanation, simulation, and generated message has been translated. Long lesson paragraphs and many quiz stems/options/explanations remain English until individually translated and scientifically reviewed. Unknown strings intentionally remain in English rather than receiving guessed machine translations. The automated tests verify the named mission and lesson-heading coverage, not complete sentence-level translation.

## Validation

- `npm test`: 62 tests passed.
- `npm run check`: syntax passed for 26 JavaScript files.
- Browser-level visual QA is still required.
