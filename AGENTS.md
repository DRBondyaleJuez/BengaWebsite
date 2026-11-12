# AGENTS.md - Benga Language Learning Portal

> Single source of instructions for AI assistants (Claude, Copilot) working on this repo.
> Record every lasting project decision here so future sessions follow it.

## Review Log (doubts and things to check)
- Every doubt, suspected error or open decision found while working on a task goes into `docs/REVIEW-LOG.md`, not only into the chat. This includes content (OCR readings, accents, glosses), code (bugs noticed outside the task's scope) and decisions the developer must make.
- Add an entry with the next free `R-0XX` id, using the template at the bottom of that file: **Found in** (roadmap task number), **Where** (file:line, page URL, book page), **Doubt**, **Suggestion**. Add a matching row to the Summary table with status 🔴.
- Don't fix out-of-scope issues silently: log them and keep the current task's commit focused.
- Before starting a task, check the log for open entries that the task's "Decide by" column points to. Raise them with the developer.
- When an entry is resolved, set 🟢 (or ⚪) in both the entry and the Summary table, and fill in **Resolution** with the date, what was decided and the commit.

## Project Overview
A Vue 3 educational website teaching the Benga language (Ndowe language family) based on Salvado y Cos's historical grammar book. The platform transforms 19th-century linguistic documentation into an interactive digital learning experience with audio pronunciation support.

## Tech Stack
- **Framework**: Vue 3 (Options API), vue-router 4, vue-i18n 11. Exact versions: `package.json`
- **Build tool / dev server**: Vite (`vite.config.mjs`); `npm run serve` → http://localhost:8080, `npm run build` → `dist/`, `npm run preview` serves `dist/` on port 8081
- **Environment variables**: read with `import.meta.env` (`BASE_URL`, `DEV`, and custom ones that must start with `VITE_`); never `process.env` in `src/`
- **Styling**: SCSS with BEM methodology, common imports
- **IDE**: VSCode with GitHub Copilot
- **Media Storage**: Cloudinary (audio files)
- **Images**: Wikimedia Commons, Unsplash
- **Internationalization**: vue-i18n in composition mode with `globalInjection` (set up in `src/main.js`): use `$t('key')` and `$i18n.locale` in components. Spanish first, then French/English
- **Linting**: ESLint 7 + `eslint-plugin-vue` (`plugin:vue/vue3-essential`), config in `package.json`; `npm run lint`

## Architecture Principles

### Component Structure
- Use Single File Components (.vue) with `<template>`, `<script>`, `<style scoped>`
- Prefer Options API (data, methods, computed, props)
- Extract reusable patterns into generic components with slots
- Keep components focused: one primary responsibility per component
- Declare the events a component sends in `emits` (e.g. `emits: ['close']`)

### Vue 3 Reminders (things that worked differently in Vue 2)
- The app is mounted **inside** `<div id="app">` of `index.html`; don't give the root element of `App.vue` an `id="app"`.
- Lifecycle: use `beforeUnmount` / `unmounted` (not `beforeDestroy` / `destroyed`).
- Transitions: classes are `*-enter-from` / `*-leave-from` (not `*-enter` / `*-leave`).
- `router-link` has no `tag` prop: to make a non-link element clickable use `<router-link v-slot="{ navigate }" to="…" custom>` around it (see `NounsIntro.vue`), and give it `role="link"`, `tabindex="0"` and `@keydown.enter="navigate"`.
- Unknown URLs are caught by `path: '/:pathMatch(.*)*'` in `src/router/index.js`.
- In the browser console the app is at `document.getElementById('app').__vue_app__` (Vue 2's `__vue__` no longer exists).

### Noun Class Page Format
- All noun-class view pages should follow the same structural pattern as the first reference component: a root container using the `noun-class` BEM block, then sections ordered as `__header`, `__pattern`, `__examples`, `__variants`, `__concepts`, `__practice`, and `__nav`.
- The class pages should remain visually aligned with `NounClass1.vue` as the reference standard: green gradient header, centered pattern transformation box, example cards with a singular/plural split, clearly styled section headings, and a consistent two-button navigation footer.
- Reuse the same SCSS patterns from the first noun-class component: `@import '@/styles/variables'; @import '@/styles/mixins';`, BEM naming, `pattern-box`, `example-card`, `concept-item`, and responsive layout rules via `@include respond-below('md')`.
- Avoid the old shorthand classes like `nc`, `h`, `pb`, `eg`, `b` and instead use the full `noun-class` BEM naming system across all noun-class pages. This keeps them consistent and easier to maintain.
- The goal is visual similarity across all chapter-2 nominal-class views, so changes to spacing, color, typography, and card styling should be applied uniformly rather than re-designed per page.
- When a class has exceptions, add a dedicated `noun-class__exceptions` section styled with `.section-note` (and `.example-note` when a clarifying remark is needed), and include its BEM selector in the shared `&__examples, &__variants, &__exceptions` SCSS block so the cards look identical to the main ones.

### Source of Truth: Salvado y Cos Grammar
- The authoritative text is `public/downloads/salvado-y-cos-gramatica-benga.pdf` (a searchable scan, so its text layer has OCR damage; it is also the file visitors download from the site's "Descargar PDF" links). Book page numbers are offset from PDF page numbers; map them before extracting:

  | Noun class | Book pages | PDF pages | Component |
  |---|---|---|---|
  | 1 | 9-10 | 9-10 | `NounClass1.vue` |
  | 2 | 10-11 | 10-11 | `NounClass2.vue` |
  | 3 | 11 | 11 | `NounClass3.vue` |
  | 4 | 11-12 | 11-12 | `NounClass4.vue` |
  | 5 | 12 | 12 | `NounClass5.vue` |
  | 6 | 12-13 | 12-13 | `NounClass6.vue` |
  | 7 | 13 | 13-14 | `NounClass7.vue` |
  | Irregular nouns (§ 7, § 8) | 14 | 14 | `IrregularNouns.vue` |
  | Verbal nouns | 14-15 | 14-15 | `VerbalNouns.vue` |

  The class-7 list runs over two printed pages: the left column of PDF page 13 ends with `Ndumba, huésped`, and the right column of the same page continues with `Penge, ulcera` through `Njadi, primogénito`; `Ndonga` to `Nyênjê` are at the top of PDF page 14.

- Extract with `pdftotext -layout -f <first> -l <last> <pdf> out.txt`. When a row looks garbled (e.g. `Whdki` for `Whâki`, `Medambu` for `Medumbu`, `mija` for `Mijona`), re-run with `pdftotext -bbox` and use the `xMin` coordinates to work out which column each token belongs to, then reconstruct the form from the class's plural rule.
- **Never trust `src/data/chapter-2/class-N.json` for content.** Those files are not imported by any view and many of their Spanish glosses contradict the book (e.g. `class-3.json` says `woaha` = "fuego", the book says "Costado, lado"). The `.vue` `data()` blocks hold the real content.
- When the OCR damage cannot be resolved (no tesseract available, and page images cannot be inspected), **omit the entry and say so** in a visible `.section-note` / `.example-note` rather than inventing a headword; leave an unreadable gloss as `meaning: null` instead of guessing a translation. Cross-check doubtful headwords against the book's own `Vocabulario` section (`grep` the extracted text) before reconstructing — e.g. the class-7 `Mora. Perro.` is really `Mba. Perro.` (`Mba` is "perro" throughout the vocabulary). Watch for words that legitimately appear in two classes with different spellings: `Ndâlâ, sueño, desvario` (class 7) is not the same as `Vid. Lid. sueño` (class 6).

### Benga Orthography Rules
- The Benga vowel inventory is `a, â, e, ē, i, o, u, ū`. The book was printed with Spanish-style accents, so `á → â`, `é → ē`, `ú → ū` when the word is Benga. Leave Spanish text in the `meaning` fields untouched. Consecutive accented vowels are kept (`Múéngi` → `Mūēngi`).
- `c`, `q`, `r`, `x`, `z` and `ñ` are not consonants in benga. Any letter similar has to be another letter.
- Accent marks are significant for pronunciation, so a wrong accent changes the taught word, not just its look.

### External URLs
- Never hard-code an external address (Cloudinary, Living Dictionary, the book PDF) in a component. Import it from `src/config/external.js`.
- Never build a word's audio URL or dictionary link in a page. Use `src/services/wordLinks.js` (`getAudioUrl(word)`, `getDictionaryUrl(word)`, `getWordEntry(word)`); `BengaWord` already does this for its own word.

### Word Registry (audio and dictionary links)
- **Single source:** `src/data/lexicon/word-registry.json` holds one entry per Benga word key: `word`, `livingDictionaryId`, `audio` (`missing` | `recorded`), `audioFile` (only when the Cloudinary file name differs from the key), `notes`. Human guide: `docs/WORD-REGISTRY.md`.
- Pages pass only the **word** to `BengaWord`. The component computes the key, looks it up in the registry, shows a play button only for `"audio": "recorded"`, and links to the exact Living Dictionary entry when `livingDictionaryId` is set (otherwise to the dictionary search).
- After adding or changing Benga content, run `npm run words:sync`. It adds new words and never overwrites existing entries. Then fix anything its report lists, or log it in `docs/REVIEW-LOG.md`. `npm run words:check` reports without writing.
- Bulk links (dictionary ids, recorded audio) are imported with `npm run words:import -- file.csv` (columns `word` or `key`, plus `livingDictionaryId`, `audio`, `audioFile`, `notes`; an empty cell changes nothing). Keep imported lists in `scripts/imports/`.
- `src/data/lexicon/word-usage.json` is generated; never edit it.
- The developer can edit the registry at `/admin/palabras`, which only exists during `npm run serve` and saves through a local-only endpoint defined in `vite.config.mjs` (plugin `word-registry-endpoint`).

### Audio ID (word key) Convention
- The key is computed by `toAudioId(word)` in `src/utils/audioId.js` (tests in `scripts/tests/audioId.test.mjs`, run `npm test`). It is the registry key and the Cloudinary file name: `${CLOUDINARY_BASE}/${key}.mp3`.
- Rule: `word.toLowerCase()`, replace **every** accented letter with `_` + its plain letter + `_`, join several words (or a hyphenated form) with `-`, drop punctuation.
- Examples: `Whâki → wh_a_ki`, `Mabē → mab_e_`, `Mūadi → m_u_adi`, `Mūēngi → m_u_e_ngi`, `Pēki Pēki → p_e_ki-p_e_ki`, `Ekâi ebe → ek_a_i-ebe`. Two adjacent accented vowels produce a single underscore; that is expected, not a typo. `Hāngā` and `Hângâ` give the same key.
- **Never type an audio id by hand** and never add new `audio` / `audioId` / `<name>AudioId` fields to data. The fields still present in data files and `.vue` `data()` blocks are legacy: the site ignores them, and they are removed when content moves to the lexicon (roadmap Phase 2). `words:sync` lists the ones that differ from the rule, because some reveal content doubts.

### Chapter 3 Variable Adjectives
- The source of truth for `src/data/chapter-3/regular-adjectives.json` is the "Adjetivos variables" table on PDF page 18 (book page 24). The four common adjectives are `bobe` (malo), `bonene` (grande), `bohole` (pequeño) and `bovindo` (negro); each is cited by its class-4 form, so the stem to which the class prefix is added is the root minus `bo-` (`bobe → -be`, `bonene → -nene`, `bohole → -hole`, `bovindo → -vindo`).
- Concordance prefixes are identical for every variable adjective: class 1 `e-/be-`, class 2 `i-/ma-`, class 3 `u-/me-`, class 4 `bo-/me-`, class 5 `u-/ba-`, class 6 `vi-/lo-`, class 7 `e-/i-`. The same example nouns are reused per class (`Ekâi`, `Ilutu`, `Utē`, `Bova`, `Mondi`, `Viho`, `Ndo`) and their plural forms.
- In `commonAdjectivesByMeaning`, every inflection is an object `{ "bengaForm": "Noun adjective", "audioId": … }`. The `classes[]` array uses the same `{ bengaForm, spanishTranslation, audioId }` shape for `singular`/`plural`, plus a `highlight` field. The `audioId` fields are legacy (see "Audio ID Convention"); the key of `Ekâi ebe` is computed automatically as `ek_a_i-ebe`.
- The `classes[]` examples inflect `būamu` (bueno). Because the radical changes with a linking **y** (`būamu → eyamu`, `maiyamu`, `beyamu`, …), each `singular`/`plural` object carries an explicit `highlight` string that includes that `y` (e.g. `ey`, `bey`, `iy`, `maiy`, `uy`, `mey`, `boy`, `baiy`, `viy`, `loy`). Use it as the `highlight-prefix` so the whole modified syllable is highlighted, not just the bare class prefix.
- `BengaWord` accepts an optional `highlight-prefix` prop. When set, it splits `word` on spaces and underlines/colours that prefix at the start of the **last** token, which is how the conjugated syllable of the adjective is emphasised. Reuse it instead of hand-rolling highlighting.
- In `RegularAdjectivesSection.vue` the `adjective-group__forms` grid is **two columns** (one on narrow screens), and each `.form-pair` groups one class's singular and plural forms together.

### Chapter 3 Invariable Adjectives
- The source of truth for `src/data/chapter-3/invariable-adjectives.json` is the "Adjetivos invariables" list on PDF page 18 (book page 24); it feeds `InvariableAdjectivesSection.vue`.
- Every invariable adjective and every usage example is shown with `BengaWord`, because the language is mainly oral; their keys (and future recordings) come from the word itself, e.g. `Pēki Pēki → p_e_ki-p_e_ki`, `Bokolo bokolo → bokolo-bokolo`, `De de de → de-de-de`. The `audioId` fields in the JSON are legacy.
- Invariable adjectives normally do **not** begin with the variable-adjective declension syllables (`e`, `be`, `i`, `ma`, `u`, `me`, `bo`, `ba`, `vi`, `lo`), although there are exceptions (e.g. `Bokolo`). This is the fifth entry in `characteristics` and is rendered both in the characteristics cards and the "Puntos Importantes" notes.
- The `comparison-table` header row (`.table-row.header`) must be excluded from the zebra-striping rule — use `&:nth-child(odd):not(.header)` — otherwise its `#f9f9f9` background overrides the primary-colour header and the white text becomes illegible.

### File Naming Conventions
- **Components**: PascalCase (e.g., `AudioPlayer.vue`, `ChapterNav.vue`)
- **Views/Pages**: PascalCase with descriptive names (e.g., `ChapterAlphabet.vue`)
- **Composables/Utilities**: camelCase (e.g., `useAudio.js`, `formatWord.js`)
- **SCSS**: kebab-case partials with underscore prefix (e.g., `_variables.scss`)
- **Data files**: kebab-case JSON (e.g., `chapter-1-alphabet.json`)

### Code Formatting
- Formatting is automatic: Prettier (`.prettierrc.json`) with single quotes, no semicolons, no trailing commas, 100-character lines. Run `npm run format` before committing; `npm run format:check` only reports.
- Markdown files, `public/`, and files listed in `.prettierignore` are not formatted.
- Keep formatting-only changes in their own commit (`style: ...`) so content and logic changes stay easy to review.

### SCSS Guidelines
```scss
// Use BEM naming
.block {
  &__element {
    &--modifier {}
  }
}

// Import order in components
@import '@/styles/variables';
@import '@/styles/mixins';
```

## Project Structure
Real layout of the repo (keep this tree up to date when files are added, moved or removed).
Items marked `(planned)` do not exist yet.

```
benga-grammar-website/
├── index.html                   # Entry page (Vite): <div id="app"> + /src/main.js
├── public/                      # Copied as-is to the site root
│   ├── favicon.ico
│   └── downloads/
│       └── salvado-y-cos-gramatica-benga.pdf   # Source of truth (see below) + public download
├── src/
│   ├── main.js                  # App entry: Vue, router, vue-i18n, global styles
│   ├── App.vue                  # Shell: header, sidebar, <router-view>, footer
│   ├── router/
│   │   └── index.js             # Route definitions (Spanish URLs, lazy-loaded views)
│   ├── config/
│   │   └── external.js          # ALL external URLs: Cloudinary, Living Dictionary, book PDF
│   ├── utils/
│   │   └── audioId.js           # toAudioId(word): THE word-key rule (no imports; shared with scripts/)
│   ├── services/
│   │   └── wordLinks.js         # word → registry entry → audio URL / dictionary link
│   ├── assets/
│   │   └── images/
│   │       ├── logo.png
│   │       ├── salvado-y-cos-portrait.png
│   │       └── equatorial-guinea-map.png
│   ├── styles/                  # Imported in components as '@/styles/...'
│   │   ├── main.scss            # Global styles & imports
│   │   ├── _variables.scss      # Colors, fonts, spacing, breakpoints
│   │   └── _mixins.scss         # respond-below, flex-center, focus-ring, benga-word-style...
│   ├── locales/                 # UI strings only
│   │   ├── es.json              # Spanish (primary)
│   │   ├── en.json              # English (only nav/app keys so far)
│   │   └── fr.json              # French (only nav/app keys so far)
│   ├── data/
│   │   ├── lexicon/
│   │   │   ├── word-registry.json  # One entry per Benga word: dictionary id, audio state, notes
│   │   │   └── word-usage.json     # GENERATED by words:sync (spellings + files per word)
│   │   ├── chapters-index.json  # Sidebar/navigation metadata
│   │   ├── author-info.json     # AboutAuthor page content
│   │   ├── chapter-1/           # alphabet, diphthongs, triphthongs, consonants (.json)
│   │   ├── chapter-2/
│   │   │   ├── class-1.json … class-7.json   # STALE, not imported (see Source of Truth)
│   │   │   ├── nouns-intro.json, irregular-nouns.json, verbal-nouns.json   # Not imported either; keep for Phase 2 cross-checks
│   │   │   └── noun-practice-deck.json       # Deck used by NounPracticeGame.vue
│   │   └── chapter-3/           # adjectives-intro, regular-adjectives, invariable-adjectives,
│   │                            # comparatives-superlatives, numerals-ordinals (.json)
│   ├── components/
│   │   ├── common/
│   │   │   └── BaseIcon.vue     # Inline SVG icons by name
│   │   ├── layout/
│   │   │   ├── AppHeader.vue
│   │   │   ├── AppFooter.vue
│   │   │   └── AppSidebar.vue
│   │   ├── navigation/
│   │   │   ├── ChapterNav.vue
│   │   │   └── LanguageSwitcher.vue
│   │   ├── content/
│   │   │   ├── BengaWord.vue    # Benga word + audio button + dictionary link + highlight
│   │   │   └── ContentSection.vue
│   │   └── interactive/         # (planned) QuizCard, FlashCard...
│   └── views/
│       ├── HomePage.vue
│       ├── AboutAuthor.vue
│       ├── ResourcesPage.vue
│       ├── chapter-1/
│       │   ├── ChapterOneIndex.vue
│       │   ├── AlphabetSection.vue
│       │   ├── DiphthongsSection.vue
│       │   ├── TriphthongsSection.vue
│       │   └── ConsonantsSection.vue
│       ├── chapter-2/
│       │   ├── ChapterTwoIndex.vue
│       │   ├── NounsIntro.vue
│       │   ├── NounClass1.vue … NounClass7.vue   # Content lives in each data() block
│       │   ├── IrregularNouns.vue
│       │   ├── VerbalNouns.vue
│       │   └── NounPracticeGame.vue
│       ├── admin/
│       │   └── WordRegistryAdmin.vue   # /admin/palabras, dev-only (npm run serve)
│       └── chapter-3/
│           ├── ChapterThreeIndex.vue
│           ├── AdjectivesIntro.vue
│           ├── RegularAdjectivesSection.vue
│           ├── InvariableAdjectivesSection.vue
│           ├── ComparativesSuperlativesSection.vue
│           └── NumeralOrdinalAdjectivesSection.vue
├── docs/                        # ROADMAP, REVIEW-LOG, WORKING-WITH-AI, WORD-REGISTRY
├── scripts/                     # Node tools: words-sync, words-import, lib/, tests/, imports/
├── context/                     # Git-ignored: private prompts and notes
├── package.json                 # Scripts (serve, build, preview, lint, format, test, words:*) + ESLint config
├── .prettierrc.json / .prettierignore   # Code formatting rules (npm run format)
├── .editorconfig                # Basic editor settings (indent, charset, final newline)
├── package-lock.json
├── vite.config.mjs              # Vite: Vue plugin, '@' alias, Sass options, port 8080, dev-only save endpoint
├── jsconfig.json                # '@' -> src alias for the editor
├── README.md
└── AGENTS.md                    # This file
```

## Roadmap and Workflow
- **The plan:** `docs/ROADMAP.md` lists every phase, task and subtask with a prompt and a commit name. Tick a task's box when it is committed. This replaces the old week-by-week plan.
- **Doubts and decisions:** `docs/REVIEW-LOG.md` (see "Review Log" above).
- **How to work with the AI:** `docs/WORKING-WITH-AI.md`.
- **Commits:** Conventional Commits, `type(area): summary` (`feat`, `fix`, `refactor`, `docs`, `chore`, `style`, `build`, `test`), one task or subtask per commit, on a branch per phase.
- **Versions:** `package.json` is the source of truth for dependencies. Phase 1 (Vite + Vue 3) is done; newer majors of ESLint, vue-router and vue-i18n are tracked in REVIEW-LOG R-018.

### Planned pieces from the original plan (not built yet)
Kept so the original intentions are not lost; the roadmap phase that covers each is in brackets.
- `PageLayout`, `SectionNav`, `BaseButton`, `BaseCard` → reusable blocks [Phase 3]
- `AudioPlayer` → shared audio player service [task 3.1]
- `NounClassCard` → generic noun-class page [task 3.4]
- `QuizCard`, `FlashCard` (`components/interactive/`) → exercise engine [Phase 8]
- `VowelChart` interactive vowel chart for chapter 1 [Phase 8]
- SVG icon files `audio-play.svg`, `audio-pause.svg`, `external-link.svg` (icons are currently inline in `BaseIcon.vue`) [Phase 3, optional]
- `data/vocabulary/master-wordlist.json` → now `src/data/lexicon/word-registry.json`, extended into the full lexicon in [Phase 2]
- `data/chapter-1/vowels.json` (vowel data separate from the alphabet) [Phase 2]
