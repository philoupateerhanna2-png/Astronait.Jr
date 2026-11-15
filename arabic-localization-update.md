# Arabic localization update

The supplied `Astronaut_Jr_Arabic_Dictionary_Expansion.zip` is a full Astronaut Jr project archive containing the offline English-to-Arabic dictionary in `js/features/language.js`, not a separate translation-only document. Its reviewed Arabic entries are the translation source for the interface. The current project retains the expanded dictionary entries already added to the working project.

## Improvements in this update

- Arabic direction and language are selected before the first page paint using the saved `aj-lang` preference, reducing the initial LTR/RTL flash.
- The Arabic layout now has dedicated Arabic-friendly typography, line-height, right-aligned lesson and quiz content, RTL navigation/form handling, and mirrored cadet dashboard elements.
- English remains LTR and the language switch still rebuilds the page from original source templates, preserving the English experience.
- RTL styling isolates formulas, code, numeric values, email addresses, and URLs so they remain readable in their natural direction.

## Translation coverage boundary

The supplied archive's dictionary does not contain Arabic translations for every user-facing sentence in every mission. It covers the translated interface labels and many mission names/headings, but long lesson paragraphs, many quiz questions/options/explanations, and some dynamically generated simulation messages remain English unless an exact reviewed dictionary entry exists. Unknown text is intentionally left unchanged rather than guessed. Therefore this update improves the Arabic presentation and applies the supplied dictionary, but it does **not** claim complete sentence-by-sentence Arabic localization.
