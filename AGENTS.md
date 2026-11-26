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
- **Framework**: Vue 3 (Options API), vue-router 5, vue-i18n 11. Exact versions: `package.json`
- **Build tool / dev server**: Vite (`vite.config.mjs`); `npm run serve` → http://localhost:8080, `npm run build` → `dist/`, `npm run preview` serves `dist/` on port 8081
- **Environment variables**: read with `import.meta.env` (`BASE_URL`, `DEV`, and custom ones that must start with `VITE_`); never `process.env` in `src/`
- **Styling**: SCSS with BEM methodology, common imports
- **IDE**: VSCode with GitHub Copilot
- **Media Storage**: Cloudinary (audio files)
- **Images**: Wikimedia Commons, Unsplash
- **Internationalization**: vue-i18n in composition mode with `globalInjection` (set up in `src/main.js`): use `$t('key')` and `$i18n.locale` in components. Spanish is the source; English and French exist for chapters 1-3 (see "Translations" below)
- **Linting**: ESLint 10 + `eslint-plugin-vue` 10 (`flat/essential`), flat config in `eslint.config.mjs`; `npm run lint` checks `src/`, `scripts/` and the config files

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
- Every chapter page ends with `<SectionNavFooter />` (no props): ← previous · next → from `chapters-index.json` as one path through the book, so the last section of a chapter leads to the next chapter. Don't hand-write footer navigation.
- Chapter and section routes are generated from `src/data/chapters-index.json` (each section has `component` = a page in `src/views`, or `sectionFile` = a section file). Never add a chapter route by hand in `src/router/index.js`. The browser-tab title falls back to the section's `titleKey` (`App.vue`).
- In the browser console the app is at `document.getElementById('app').__vue_app__` (Vue 2's `__vue__` no longer exists).

### Noun Class Page Format
- The seven noun classes are ONE page, `src/views/chapter-2/NounClassPage.vue`, drawn from `src/data/sections/ch-2/class-N.json` (the router passes `section: 'class-N'`). To change a class page, edit its JSON; to change how something looks, edit the block component in `src/components/blocks/` — every class changes together. Guide: `docs/CONTENT-GUIDE.md` → "How a page groups the blocks".
- Page structure: green gradient `noun-class__header`, then one `<section class="noun-class__<id>">` per `heading` block (`pattern`, `examples`, `variants`, `concordance`, `concepts`, `exceptions`, `liquids`, `class-six`, `practice`), then the shared `SectionNavFooter`.
- Example cards take lexicon ids (`"entries": ["epokolo"]`) from `lexicon/nouns.json`; never copy words or meanings into the section file. Exceptions go in an `exceptions` part: a note right after the heading (yellow `.section-note`), the examples, and optionally a `"variant": "small"` note (`.example-note`).
- Keep BEM naming and the shared blocks; don't restyle one class on its own.
- Lists of word cards (not practice exercises) use `CardGrid` (`ExampleGrid` already does): when the cards would fill more than two rows, only the first row shows, with a «Ver todas (N)» button.

### Source of Truth: Salvado y Cos Grammar
- The authoritative text is `public/downloads/salvado-y-cos-gramatica-benga.pdf` (a searchable scan, so its text layer has OCR damage; it is also the file visitors download from the site's "Descargar PDF" links). Book page numbers are offset from PDF page numbers; map them before extracting:

  In this part of the book **printed page = PDF page + 6** (e.g. PDF 8 = printed 14; chapter 3: PDF 18 = printed 24). The PDF page is what `pdftotext -f/-l` and PDF viewers use; the printed page is the number on the scan and in the book's table of contents. Verified with `pdftotext` (REVIEW-LOG R-020):

  | Noun class | Printed pages | PDF pages | Content file |
  |---|---|---|---|
  | 1 | 14-15 | 8-9 | `sections/ch-2/class-1.json` |
  | 2 (incl. exceptions, liquids, class-6 exception) | 15-16 | 9-10 | `sections/ch-2/class-2.json` |
  | 3 | 16-17 | 10-11 | `sections/ch-2/class-3.json` |
  | 4 | 17-18 | 11-12 | `sections/ch-2/class-4.json` |
  | 5 | 18 | 12 | `sections/ch-2/class-5.json` |
  | 6 | 18-19 | 12-13 | `sections/ch-2/class-6.json` |
  | 7 | 19-20 | 13-14 | `sections/ch-2/class-7.json` |
  | Irregular nouns (§ 7, § 8) | 20 | 14 | `IrregularNouns.vue` |
  | Verbal nouns | 20-21 | 14-15 | `VerbalNouns.vue` |

  Each class starts part-way down a page, so a class's last page is usually the next class's first page. The class-7 list is printed in two columns that continue across the page break: on PDF page 13 the left column runs `Fala, francés` … `Ndomina, tío materno` and the right column `Penge, ulcera` … `Njadi, primogénito`; the top of PDF page 14 continues both, left `Ndonga, confianza` … `Ndumba, huésped` and right `Nyuñi, cabello blanco` … `Nyênjê, cangrejo`. The book's noun vocabulary («VOCABULARIO») starts on PDF page 15.

- **Extract text from `IMPROVED-salvado-y-cos-gramatica-benga.pdf`** (new OCR with `â ē ū`, Benga words of the site spelled right; doubtful words in `docs/ocr/ocr-doubts.csv`, see docs/OCR.md and REVIEW-LOG R-023). It is still machine OCR: always check doubtful words against the scan. The original PDF stays the cited source and the visitors' download.
- Extract with `pdftotext -enc UTF-8 -layout -f <first> -l <last> <pdf> out.txt`. When a row looks garbled (e.g. `Whdki` for `Whâki`, `Medambu` for `Medumbu`, `mija` for `Mijona`), re-run with `pdftotext -bbox` and use the `xMin` coordinates to work out which column each token belongs to, then reconstruct the form from the class's plural rule.
- When the OCR damage cannot be resolved (check the scan itself: e.g. render the page with PyMuPDF and look at it), **omit the entry and say so** in a visible `.section-note` / `.example-note` rather than inventing a headword; leave an unreadable gloss as `meaning: null` instead of guessing a translation. Cross-check doubtful headwords against the book's own `Vocabulario` section (`grep` the extracted text) before reconstructing — e.g. the class-7 `Mora. Perro.` is really `Mbūa. Perro.` (the book writes `Mbua` for «perros» in its examples, PDF p. 31; confirmed by the developer, REVIEW-LOG R-021). Watch for words that legitimately appear in two classes with different spellings: `Ndâlâ, sueño, desvario` (class 7) is not the same as `Vid. Lid. sueño` (class 6).

### Translations (Spanish → English, French)
- Human guide: `docs/TRANSLATIONS.md` (where texts live, special signs, review status, doubtful translations).
- **Only Spanish is translated. Benga words are never translated**, not even inside a sentence; Benga fields (`word`, `bengaForm`, `bengaSentence`, `imperative`, …) stay plain strings.
- Interface and custom-page texts: `src/locales/es.json`, `en.json`, `fr.json` with the **same keys in the same order**. Groups: shared (`app`, `nav`, `accessibility`, `chapters`, `content`), `pages.<page>.<key>`, `components.<component>.<key>`. Key names are camelCase slugs of the Spanish text. Never hard-code Spanish in a template or a prop default: add the key to all three files.
- Messages may contain `{param}`, HTML (rendered with `v-html="$t(key)"`; style `strong`/`em` inside them with `:deep(strong)`) and literal `{'@'}`. Keep them identical in every language.
- Content texts: `{ "es": …, "en": …, "fr": … }` in the data files. Show one with `$localized(text)`, or translate a whole file in `loadData()` with `localizeDeep(data, this.$i18n.locale)` (`src/utils/localized.js`) plus `watch: { '$i18n.locale': 'loadData' }`.
- The chosen language is saved in `localStorage` (`app-language`) and sets `<html lang>` (`src/main.js`); `App.vue` updates the tab title on a language change.
- The developer reviews and edits translations at `/admin/translations` (dev-only, `npm run serve`): every text with its Benga word, es/en/fr, page link and book page; saves through `scripts/lib/translations-save.mjs`. Doubtful translations are in `docs/translations/doubts.json` (tied to the Spanish text, resolved from that page); add a doubt there instead of a list in the docs.
- When changing a Spanish text, update `en` and `fr` too. After adding texts run `npm run i18n:report` (`--all` lists every missing text). The en/fr texts are an AI draft until reviewed (REVIEW-LOG R-035).

### Benga Orthography Rules
- The Benga vowel inventory is `a, â, e, ē, i, o, u, ū`. The book itself prints Benga words in italics with `â`, `ē`, `ū` (seen on the scan, e.g. *Yâkâ*, *Yēkē*, *Ebokūedi*), but the old OCR text layer of the PDF turned them into `á`, `é`, `ú` (or `d`, `a`, `ñ`…). So in OCR'd text `á → â`, `é → ē`, `ú → ū` when the word is Benga. `IMPROVED-salvado-y-cos-gramatica-benga.pdf` already has a text layer with `â ē ū` (see docs/OCR.md). Leave Spanish text in the `meaning` fields untouched. Consecutive accented vowels are kept (`Múéngi` → `Mūēngi`).
- `c`, `q`, `r`, `x`, `z` and `ñ` are not consonants in benga. Any letter similar has to be another letter.
- Accent marks are significant for pronunciation, so a wrong accent changes the taught word, not just its look.

### External URLs
- Never hard-code an external address (Cloudinary, Living Dictionary, the book PDF) in a component. Import it from `src/config/external.js`.
- Never build a word's audio URL or dictionary link in a page. Use `src/services/wordLinks.js` (`getAudioUrl(word)`, `getDictionaryUrl(word)`, `getWordEntry(word)`); `BengaWord` already does this for its own word. The URL rules themselves are pure functions in `src/utils/linkRules.js` (tested); change them there.

### Content Model (lexicon, sections, exercises)
- Rules: JSON Schemas in `src/data/schemas/` (`common`, `lexicon`, `section`, `exercise`, `chapters-index`), with correct examples in `src/data/schemas/examples/`. Human guide with recipes: `docs/CONTENT-GUIDE.md`.
- **Lexicon** (`src/data/lexicon/<kind>.json`; `nouns.json` exists since task 2.4): every Benga word once, as `{ "entries": { <id>: entry } }`. The id is `toAudioId(base form)` (singular for nouns, else `word`), plus `~2` for homonyms. Entries never contain audio ids or links.
- **Sections** (`src/data/sections/ch-N/*.json`; noun classes 1-7 since task 3.4): one page = `title` + ordered `blocks` (`heading`, `paragraph`, `pattern`, `examples`, `table`, `note`, `concepts`, `practice`, `conjugation`, `dialogue`, `vocabulary`). Blocks refer to lexicon entries by id instead of copying words.
- Every visitor-facing text is `{ "es": …, "en"?: …, "fr"?: … }` (Spanish required). Benga words are plain strings.
- Show such texts in templates with `$localized(text)` (global, defined in `src/main.js`; rule in `src/utils/localized.js`). Never write `text[$i18n.locale] || text.es` again.
- Unreadable meaning → `"meaning": null`; corrections or additions → `"editorial": { "status": "corrected" | "added", ... }` (never silently change book content).
- When changing a schema: update its example, `docs/CONTENT-GUIDE.md` and the tests in `scripts/tests/schemas.test.mjs`, then run `npm test`.
- `npm run validate` checks all content (schemas, ids, references, registry, orthography). Its checks are in `scripts/lib/validate.mjs`, each with a test in `scripts/tests/validate.test.mjs`; add a test when adding a check.
- **Nouns:** `src/data/lexicon/nouns.json` is the source of truth: the noun-class pages and the practice game read it. Only the irregular and verbal noun pages still have their own copies, in `src/data/chapter-2/irregular-nouns.json` and `verbal-nouns.json`, so a correction to one of their words goes into **both** `nouns.json` and that file. `scripts/extract-ch2.mjs` was a one-time migration; don't run it again.
- Until content is migrated (tasks 2.4-2.6, Phase 3), the existing chapter files keep their old shapes; don't mix the two in one file.

### Word Registry (audio and dictionary links)
- **Single source:** `src/data/lexicon/word-registry.json` holds one entry per Benga word key: `word`, `livingDictionaryId`, `audio` (`missing` | `recorded`), `audioFile` (only when the Cloudinary file name differs from the key), `notes`. Human guide: `docs/WORD-REGISTRY.md`.
- Pages pass only the **word** (or a lexicon `entry` + `form`) to `BengaWord`. The component computes the key, looks it up in the registry, shows a play button only for `"audio": "recorded"`, and links to the exact Living Dictionary entry when `livingDictionaryId` is set (otherwise to the dictionary search). Don't pass `dictionary-url` (only `:dictionary-url="null"` to hide the link).
- After adding or changing Benga content, run `npm run words:sync` and then `npm run validate` (must end with 0 errors; warnings are fixed or logged in the review log). It adds new words and never overwrites existing entries. Then fix anything its report lists, or log it in `docs/REVIEW-LOG.md`. `npm run words:check` reports without writing.
- Bulk links (dictionary ids, recorded audio) are imported with `npm run words:import -- file.csv` (columns `word` or `key`, plus `livingDictionaryId`, `audio`, `audioFile`, `notes`; an empty cell changes nothing). Keep imported lists in `scripts/imports/`.
- `src/data/lexicon/word-usage.json` is generated; never edit it.
- OCR doubts are corrected at `/admin/ocr` (same dev-only mechanism); corrections go to `docs/ocr/ocr-corrections.json` and into the improved PDF with `python scripts/ocr-pdf.py --reuse` (docs/OCR.md).
- **Audio pipeline** (guide: `docs/AUDIO-GUIDE.md`): `npm run audio:checklist` writes `docs/audio/recording-checklist.csv` (what to record); after uploading to Cloudinary `npm run audio:sync` marks the words `recorded` (needs `.env.local` with the Cloudinary keys, never committed). Sentences are recorded like words (same key rule). `/admin/audios` (dev-only) lists the words, checks Cloudinary, plays, records and uploads audio and shows the space used (`scripts/lib/audio-admin.mjs`, `cloudinary.mjs`; endpoints `/__dev/audio/*` in `vite.config.mjs`). `PlayAllButton` plays a list of words in order through `playAll()` of the shared player; it is hidden until at least one of its words is recorded.
- **Living Dictionary import** (guide: `docs/LIVING-DICTIONARY-IMPORT.md`): `npm run ld:import -- <folder>` checks a CSV + audio folder and writes a preview; `--send` writes to livingdictionaries.app through its Write API (`LD_API_KEY=ldk_…`, `LD_DICTIONARY_ID` in `.env.local`), never overwrites existing entries, never invents speakers, resumes from `ld-import/ledger.json` and fills `livingDictionaryId` in the registry. Logic in `scripts/lib/living-dictionary.mjs` (tested).

### Living Dictionary Bridge (plan: `docs/LD-ROADMAP.md`, phases L0–L9)
- `/admin/living-dictionary` (dev-only, planned) controls the Benga dictionary on livingdictionaries.app (id `benga`). Before any LD task read the roadmap's sections 3 (responsible use) and 4 (sync rules), and the API front door `https://livingdictionaries.app/api/v1` → the guide for the job.
- The key (`LD_API_KEY` in `.env.local`) is used only by Node code (scripts, Vite dev endpoints). Never in `src/` code that reaches the browser, never printed.
- Syncs are manual only (button or `npm run ld:*`): bulk reads come from the public snapshot, writes go in throttled batches, only changed fields are sent, every push has an `import_id`, and every run is logged.
- **Never invent Benga** (words, forms, sentences) for the dictionary. Claude adds *suggestions* (translations of glosses, part of speech, domain, noun class, scientific names, relations, transcriptions) plus a review flag with a plain-language question; a human accepts them. AI translations of example sentences go up with `translation_meta: machine`.
- Never overwrite or "tidy" the dictionary's existing wording, spelling or diacritics by rule: list the case in `docs/REVIEW-LOG.md` and let the developer decide.
- Audio is attributed to a real registered speaker: default **Upango Bondyale Oko**, others only when the developer says so. Words from the book cite source `salvado-y-cos-1891` with the page.
- The book lexicon (`lexicon/*.json`) and the dictionary workspace (`src/data/dictionary/`, planned) are linked through `word-registry.json` and compared, never overwritten automatically (REVIEW-LOG R-037).
- Audio from the dictionary is copied to Cloudinary (remote-URL upload, key = `toAudioId`) so the website keeps playing from Cloudinary; the public LD media URL is not used directly on the site.
- The audio → IPA tool lives in a separate folder `../benga-phonetics` (Python); spelling → IPA rules may live in `src/utils/`.
- Living Dictionary commands: `npm run ld:pull` («Traer de LD»: snapshot → `src/data/dictionary/`, merges LD changes, keeps yours, marks conflicts; `ld:pull:check` previews), `npm run ld:push` («Enviar cambios»: only changed fields, read back to verify, at most `LD_LIMITS.recordsPerPush` records; `ld:push:check` previews; deletions only with `--deletions`), `npm run ld:undo -- <import_id>` (deletes the entries a push created; `--check` first, then `--confirm <count>`), `npm run ld:link` (dictionary ↔ word-registry links, report in `ld-sync/link-report.md`), `npm run ld:source` (book source; `--create` only after the developer approves). Every request to LD goes through `scripts/lib/ld/client.mjs`; every run is logged in `ld-sync/runs/` (git-ignored) and shown at `/admin/living-dictionary/sincronizacion`.
- In Windows PowerShell `npm run x -- --flag` drops the `--`: use the `:check` scripts or `node scripts/ld-push.mjs --flag`.
- Sync logic: `scripts/lib/ld/diff.mjs` (three-way comparison by field path; NFC), `pull.mjs` (merge; snapshot records older than base are ignored because the snapshot lags ~30 min), `push.mjs` (plan, payloads, run, verification), `sync-api.mjs` (the admin starts the scripts as child processes; edits get 423 while a run writes), `runlog.mjs`. Field names in Spanish: `src/utils/ldFieldLabels.js`; error help: `src/utils/ldErrorHelp.js`.
- Forms (phase L4, guide: `docs/CONTENT-GUIDE.md` §8): `…/entrada/:id` and `…/oracion/:id`. New recordings and pictures are stored as «pendiente de enviar» (`storagePath: null` + `pendingFile` in `ld-sync/pending-media/`, git-ignored) through `POST /__dev/ld/*/:id/media`; phase L6 sends them. Their URLs come from `src/services/ldMedia.js` (addresses in `src/config/external.js`: `LD_MEDIA_BASE`, `LD_PENDING_MEDIA_BASE`). Accepting a suggestion always leaves a line in the record's local `history`.
- The developer can edit the registry at `/admin/palabras`, which only exists during `npm run serve` and saves through a local-only endpoint defined in `vite.config.mjs` (plugin `word-registry-endpoint`).

### Audio ID (word key) Convention
- The key is computed by `toAudioId(word)` in `src/utils/audioId.js` (tests in `scripts/tests/audioId.test.mjs`, run `npm test`). It is the registry key and the Cloudinary file name: `${CLOUDINARY_BASE}/${key}.mp3`.
- Rule: `word.toLowerCase()`, replace **every** accented letter with `_` + its plain letter + `_`, join several words (or a hyphenated form) with `-`, drop punctuation.
- Examples: `Whâki → wh_a_ki`, `Mabē → mab_e_`, `Mūadi → m_u_adi`, `Mūēngi → m_u_e_ngi`, `Pēki Pēki → p_e_ki-p_e_ki`, `Ekâi ebe → ek_a_i-ebe`. Two adjacent accented vowels produce a single underscore; that is expected, not a typo. `Hāngā` and `Hângâ` give the same key.
- **Never type an audio id by hand** and never add new `audio` / `audioId` / `<name>AudioId` fields to data. The fields still present in data files and `.vue` `data()` blocks are legacy: the site ignores them, and they are removed when content moves to the lexicon (roadmap Phase 2). `words:sync` lists the ones that differ from the rule, because some reveal content doubts.

### Chapter 3 Variable Adjectives
- The source of truth for `src/data/chapter-3/regular-adjectives.json` is the "Adjetivos variables" table on PDF page 18 (book page 24). The four common adjectives are `bobe` (malo), `bonene` (grande), `bohole` (pequeño) and `bovindo` (negro); each is cited by its class-4 form, so the stem to which the class prefix is added is the root minus `bo-` (`bobe → -be`, `bonene → -nene`, `bohole → -hole`, `bovindo → -vindo`).
- Concordance prefixes are identical for every variable adjective: class 1 `e-/be-`, class 2 `i-/ma-`, class 3 `u-/me-`, class 4 `bo-/me-`, class 5 `u-/ba-`, class 6 `vi-/lo-`, class 7 `e-/i-`. The same example nouns are reused per class (`Ekâi`, `Ilutu`, `Utē`, `Bova`, `Mondi`, `Viho`, `Ndo`) and their plural forms.
- The adjectives themselves (word, meaning, stem, irregular `forms`) live in `src/data/lexicon/adjectives.json`. `regular-adjectives.json` only lists which ones to show (`commonAdjectives`: lexicon ids) and the example noun of each class (`exampleNouns`); the page builds every «noun + adjective» phrase with `inflect()` from `src/utils/concord.js` (class prefix + stem, tested in `scripts/tests/concord.test.mjs`). Never type those phrases by hand; `words:sync` computes them the same way.
- The `classes[]` array uses `{ bengaForm, spanishTranslation, audioId }` for `singular`/`plural`, plus a `highlight` field. The `audioId` fields are legacy (see "Audio ID Convention").
- The `classes[]` examples inflect `būamu` (bueno). Because the radical changes with a linking **y** (`būamu → eyamu`, `maiyamu`, `beyamu`, …), each `singular`/`plural` object carries an explicit `highlight` string that includes that `y` (e.g. `ey`, `bey`, `iy`, `maiy`, `uy`, `mey`, `boy`, `baiy`, `viy`, `loy`). Use it as the `highlight-prefix` so the whole modified syllable is highlighted, not just the bare class prefix.
- `BengaWord` accepts an optional `highlight-prefix` prop. When set, it splits `word` on spaces and underlines/colours that prefix at the start of the **last** token, which is how the conjugated syllable of the adjective is emphasised. Reuse it instead of hand-rolling highlighting.
- In `RegularAdjectivesSection.vue` the `adjective-group__forms` grid is **two columns** (one on narrow screens), and each `.form-pair` groups one class's singular and plural forms together.

### Chapter 3 Invariable Adjectives
- The "Adjetivos invariables" list (PDF page 18, book page 24) is in `src/data/lexicon/adjectives.json` (`kind: "invariable"`); `InvariableAdjectivesSection.vue` reads it with `getAdjectives({ kind: 'invariable' })` (`src/services/adjectives.js`). `src/data/chapter-3/invariable-adjectives.json` keeps only the page texts (overview, examples, characteristics).
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
│       ├── salvado-y-cos-gramatica-benga.pdf            # Source of truth (see below) + public download
│       └── IMPROVED-salvado-y-cos-gramatica-benga.pdf   # Same scan, new searchable text layer with â ē ū (docs/OCR.md)
├── src/
│   ├── main.js                  # App entry: Vue, router, vue-i18n, global styles
│   ├── App.vue                  # Shell: header, sidebar, <router-view>, footer
│   ├── router/
│   │   └── index.js             # Fixed routes + chapter routes GENERATED from data/chapters-index.json
│   ├── config/
│   │   └── external.js          # ALL external URLs: Cloudinary, Living Dictionary, book PDF
│   │   └── ld.js                # Living Dictionary bridge settings (dictionary id, default speaker, book source); no secrets
│   ├── utils/                   # Pure helpers (no imports) shared with scripts/, each with tests
│   │   ├── audioId.js           # toAudioId(word): THE word-key rule
│   │   ├── localized.js         # localized(text, locale): pick a language, fall back to es ($localized)
│   │   ├── linkRules.js         # how audio / Living Dictionary URLs are built
│   │   ├── inlineMarkup.js      # **bold** in section-file texts, everything else escaped
│   │   ├── concord.js           # CONCORD_PREFIXES + inflect(): class prefix + stem of variable adjectives
│   │   ├── csv.js               # parseCsv(): CSV text → objects (Excel/Python CSV, BOM, quotes)
│   │   ├── translationRows.js   # every translatable text as a row (benga, es/en/fr, page, book page): /admin/translations
│   │   ├── dictionaryPaths.js   # getPath / setPath / setField / canonicalJson: edit a dictionary record by path (forms, suggestions)
│   │   ├── dictionaryForm.js    # noun classes, emptySense, findSimilar («Ya existe»), insertAt (word form rules)
│   │   ├── dictionarySuggestions.js  # accept / reject a suggestion, fieldLabel (+ history line)
│   │   ├── dictionaryChecks.js  # orthography warnings, completeness checklist, book gloss and pages of a word («En la web»)
│   │   └── mediaRules.js        # accepted audio / photo files, sizes, where a recording is played from
│   ├── services/
│   │   ├── wordLinks.js         # word → registry entry → audio URL / dictionary link
│   │   ├── audioPlayer.js       # ONE shared player: play(url) / stop() / audioState (never new Audio() in a page)
│   │   ├── ldMedia.js           # ldMediaUrl(media): Cloudinary copy → LD media host → local pending file (dictionary admin)
│   │   ├── nouns.js             # getNouns({ nounClass, withBothForms }) from lexicon/nouns.json
│   │   └── adjectives.js        # getAdjectives({ kind }), getAdjective(id), inflect() from lexicon/adjectives.json
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
│   │   ├── schemas/             # JSON Schemas = the rules for content files (+ examples/)
│   │   ├── dictionary/          # Workspace = local copy of the Living Dictionary (npm run ld:pull; docs/CONTENT-GUIDE.md §8)
│   │   │   ├── entries.json, sentences.json   # edited by /admin/living-dictionary (planned UI) via /__dev/ld/*
│   │   │   ├── base.json        # GENERATED: the dictionary as last read (detects local changes)
│   │   │   └── vocab/           # parts of speech, semantic domains, relation types, review categories (Spanish labels)
│   │   ├── lexicon/
│   │   │   ├── adjectives.json     # Chapter-3 adjectives (lexicon schema): the adjective pages read it
│   │   │   ├── nouns.json          # Chapter-2 nouns (lexicon schema): source of truth since task 2.5
│   │   │   ├── word-registry.json  # One entry per Benga word: dictionary id, audio state, notes
│   │   │   └── word-usage.json     # GENERATED by words:sync (spellings + files per word)
│   │   ├── sections/
│   │   │   ├── ch-1/diphthongs.json, triphthongs.json, consonants.json   # "layout": "lesson"
│   │   │   ├── ch-2/class-1.json … class-7.json   # Noun-class pages (section schema, words by lexicon id)
│   │   │   └── ch-3/adjectives-intro.json          # Drawn by SectionPage.vue
│   │   ├── chapters-index.json  # THE list of chapters/sections: sidebar, routes, prev/next buttons
│   │   ├── author-info.json     # AboutAuthor page content
│   │   ├── chapter-1/           # alphabet.json (the other chapter-1 pages are section files now)
│   │   ├── chapter-2/           # irregular-nouns.json, verbal-nouns.json: words + { es, en, fr } texts of those pages
│   │   └── chapter-3/           # regular-adjectives, invariable-adjectives, comparatives-superlatives,
│   │                            # numerals-ordinals (.json): page texts of the chapter-3 pages
│   ├── components/
│   │   ├── common/
│   │   │   └── BaseIcon.vue     # Inline SVG icons by name
│   │   ├── layout/
│   │   │   ├── AppHeader.vue
│   │   │   ├── AppFooter.vue
│   │   ├── AdminNav.vue         # bar linking the /admin pages (shown by App.vue; add new admin pages here)
│   │   │   └── AppSidebar.vue
│   │   ├── navigation/
│   │   │   ├── ChapterNav.vue
│   │   │   └── LanguageSwitcher.vue
│   │   ├── content/
│   │   │   ├── BengaWord.vue    # Benga word + audio button + dictionary link + highlight
│   │   │   └── ContentSection.vue
│   │   ├── blocks/              # Page building blocks (one per section-file block type), see each file's header
│   │   │   ├── PatternBox.vue, ExampleGrid.vue, NoteBox.vue, TableBlock.vue
│   │   │   ├── CardGrid.vue     # word-card grid: first row + «Ver todas» when it would fill > 2 rows
│   │   │   ├── ConceptList.vue, ConceptCards.vue, PracticeList.vue, CheckList.vue
│   │   │   ├── SoundCards.vue, SoundGroups.vue   # chapter-1 sounds
│   │   │   └── SectionLinks.vue, SectionNavFooter.vue
│   │   └── interactive/         # (planned) QuizCard, FlashCard...
│   └── views/
│       ├── SectionPage.vue      # Any page made only from a section file (data/sections/**)
│       ├── HomePage.vue
│       ├── AboutAuthor.vue
│       ├── ResourcesPage.vue
│       ├── chapter-1/
│       │   ├── ChapterOneIndex.vue
│       │   └── AlphabetSection.vue   # still a custom page (REVIEW-LOG R-028)
│       ├── chapter-2/
│       │   ├── ChapterTwoIndex.vue
│       │   ├── NounsIntro.vue
│       │   ├── NounClassPage.vue   # The 7 noun classes, drawn from data/sections/ch-2/class-N.json
│       │   ├── IrregularNouns.vue
│       │   ├── VerbalNouns.vue
│       │   └── NounPracticeGame.vue
│       ├── admin/
│       │   ├── WordRegistryAdmin.vue   # /admin/palabras, dev-only (npm run serve)
│       │   ├── OcrReviewAdmin.vue      # /admin/ocr, dev-only: correct OCR doubts with the PDF page beside
│       │   ├── TranslationsAdmin.vue   # /admin/translations, dev-only: edit every text (benga, es, en, fr), resolve doubts
│       │   └── ld/                     # /admin/living-dictionary (dev-only): LdLayout, LdPanel, LdEntries, LdSentences + the forms
│       │       ├── EntryForm.vue       # entrada/:id and /nueva: word form (cards in form/)
│       │       ├── SentenceForm.vue    # oracion/:id and /nueva: sentence form
│       │       ├── ldApi.js, vocab.js  # calls to /__dev/ld/* and the vocabularies with Spanish labels
│       │       └── form/               # FormCard, formMixin, SymbolInput (â ē ū + IPA), WordCard, SenseCard, AudioCard, ExamplesCard,
│       │                               # MoreFieldsCard, RelationsCard, ImagesCard, ReviewCard, WebCard, ChecklistBar, FormBar…
│       └── chapter-3/
│           ├── ChapterThreeIndex.vue
│           ├── RegularAdjectivesSection.vue
│           ├── InvariableAdjectivesSection.vue
│           ├── ComparativesSuperlativesSection.vue
│           └── NumeralOrdinalAdjectivesSection.vue
├── docs/                        # ROADMAP, LD-ROADMAP, LIVING-DICTIONARY-IMPORT, AUDIO-GUIDE, REVIEW-LOG, WORKING-WITH-AI, WORD-REGISTRY, CONTENT-GUIDE, TRANSLATIONS, OCR (+ ocr/ocr-doubts.csv, ocr/ocr-corrections.json, translations/doubts.json)
├── scripts/                     # Node tools: ld-pull / ld-link / ld-source / ld-import (Living Dictionary; logic in lib/ld/: client, snapshot, workspace, link, vocab, check-dictionary, admin-api, diff, pull, push, sync-api, runlog), ld-push / ld-undo, validate-data, words-sync, words-import, ld-import (Living Dictionary), i18n-report (translation coverage), lib/translations-save.mjs (writer of /admin/translations), extract-ch2 (one-time, task 2.4), ocr-pdf.py (Python: new OCR of the book), lib/ (schemas.mjs, validate.mjs, …), tests/, imports/
├── context/                     # Git-ignored: private prompts and notes
├── package.json                 # Scripts (serve, build, preview, lint, format, test, words:*)
├── eslint.config.mjs            # ESLint rules (flat config)
├── .prettierrc.json / .prettierignore   # Code formatting rules (npm run format)
├── .editorconfig                # Basic editor settings (indent, charset, final newline)
├── package-lock.json
├── vite.config.mjs              # Vite: Vue plugin, '@' alias, port 8080, dev-only save endpoints (/admin pages)
├── jsconfig.json                # '@' -> src alias for the editor
├── README.md
└── AGENTS.md                    # This file
```

## Roadmap and Workflow
- **The plan:** `docs/ROADMAP.md` lists every phase, task and subtask with a prompt and a commit name; `docs/LD-ROADMAP.md` does the same for the Living Dictionary bridge (phases L0–L9). Tick a task's box when it is committed. This replaces the old week-by-week plan.
- **Doubts and decisions:** `docs/REVIEW-LOG.md` (see "Review Log" above).
- **How to work with the AI:** `docs/WORKING-WITH-AI.md`.
- **Commits:** Conventional Commits, `type(area): summary` (`feat`, `fix`, `refactor`, `docs`, `chore`, `style`, `build`, `test`), one task or subtask per commit, on a branch per phase.
- **Versions:** `package.json` is the source of truth for dependencies. ESLint 10 and vue-router 5 since R-018; Vite 8 since R-030. `package.json` has `"type": "module"`: every `.js` file is an ES module.

### Planned pieces from the original plan (not built yet)
Kept so the original intentions are not lost; the roadmap phase that covers each is in brackets.
- `PageLayout`, `BaseButton`, `BaseCard` → reusable blocks [later, when a page needs them] (`SectionNav` = `blocks/SectionNavFooter.vue`)
- `QuizCard`, `FlashCard` (`components/interactive/`) → exercise engine [Phase 8]
- `VowelChart` interactive vowel chart for chapter 1 [Phase 8]
- SVG icon files `audio-play.svg`, `audio-pause.svg`, `external-link.svg` (icons are currently inline in `BaseIcon.vue`) [Phase 3, optional]
- `data/vocabulary/master-wordlist.json` → now `src/data/lexicon/word-registry.json`, extended into the full lexicon in [Phase 2]
- `data/chapter-1/vowels.json` (vowel data separate from the alphabet) [Phase 2]
