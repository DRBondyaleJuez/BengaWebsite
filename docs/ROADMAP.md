# Benga Grammar Website — Development Roadmap

> How to use this file: work **top to bottom**. Each task has
> **Why** (the problem), **Prompt** (paste it to Claude to start the task) and
> **Commit** (the message to use when the task is done).
> Tick the box `[x]` when a task is committed.
>
> Commit names follow *Conventional Commits*: `type(area): what changed`
> — `feat` = new feature, `fix` = bug fix, `refactor` = same behaviour, cleaner code,
> `docs` = documentation, `chore` = housekeeping, `build` = tooling, `test` = tests.

---

## 0. Where the project is today (audit, 2026-11-08)

### What already works well
- Chapters 1–3 have pages, routes, a sidebar and a reusable `BengaWord` component with audio + highlight.
- `AGENTS.md` captures real expert knowledge (orthography, audio-id rule, page mapping). Keep it.
- `npm run lint` passes with no errors.

### Problems found

| # | Problem | Where | Effect |
|---|---------|-------|--------|
| P1 | The same nouns are stored **3 times** in 3 different shapes | `NounClassN.vue` `data()`, `data/chapter-2/class-N.json` (stale, wrong glosses), `noun-practice-deck.json` | A correction must be made in 3 places; they already disagree |
| P2 | Chapter 2 keeps content **inside the .vue files**; chapters 1 & 3 use JSON | `src/views/chapter-2/*.vue` | Two ways of doing the same thing; editing content means editing code |
| P3 | Seven noun-class pages are near-copies (440–870 lines each) | `NounClass1-7.vue` | A design change = 7 edits |
| P4 | Data shapes differ: `{word, audio, meaning}` vs `{bengaForm, spanishTranslation, audioId}` vs `{singular, singularAudioId, translation}` | ch2 views / ch3 JSON / practice deck | Components can't be reused across chapters |
| P5 | Audio ids are typed by hand | every data file | A typo = silent 404, button shows but plays nothing |
| P6 | Translations: only shell UI uses `$t()`. Chapter 2 & 3 pages are 100% hard-coded Spanish. `en.json`/`fr.json` have 13 lines | `src/views/**`, `src/locales/*` | French/English impossible without rewriting every page |
| P7 | External URLs copied in 14 files (`LIVING_DICTIONARY_BASE`), Cloudinary URL hard-coded with a version number | views, `BengaWord.vue` | Changing provider = 15 edits |
| P8 | Routes (`router/index.js`) and sidebar (`chapters-index.json`) list the same sections separately | both files | Adding a section = 3 edits (route, index, locale) |
| P9 | "Download PDF" links to `/downloads/salvado-y-cos-gramatica-benga.pdf`, which doesn't exist | `ResourcesPage.vue:28` | Broken link |
| P10 | `AGENTS.md` was deleted from the repo root and `context/` is git-ignored | git status | The AI rules are no longer versioned; a fresh checkout loses them. `instructions.md` is an older duplicate |
| P11 | Leftovers and typos: `HelloWorld.vue`, `src/assets/logo.png` (duplicate), 4 empty SCSS partials, `DipthongsSection`, `TripthongsSection`, `ConsonantsSections`, `IrregularAdjectivesSection` (it shows *invariable* adjectives) | various | Confusing for you and for AI |
| P12 | Vue 2 reached end-of-life on 31 Dec 2023 (no more security fixes); vue-cli is in maintenance mode | `package.json` | Libraries will stop supporting it; best to upgrade while the code is small |
| P13 | No tests, no data validation, no deployment | — | Errors are found by eye only |

### How much of the book is done

```
Book (≈150 pages)
├── Prólogo + Prenotandos ............ ✗ not started
├── Cap. 1  Lecciones preliminares ... ◐ alphabet, diphthongs, triphthongs, consonants
│                                        ✗ síncopa, vocabulario
├── Cap. 2  Nombre substantivo ....... ◐ 7 classes, irregular, verbal, practice game
│                                        ✗ vocabulario de substantivos
├── Cap. 3  Nombre adjetivo .......... ◐ variable, invariable, comparatives, numerals
│                                        ✗ repetición, ejercicios (tiempo, edad), fraseología, vocabulario
├── Cap. 4  Pronombres ............... ✗
├── Cap. 5  Verbo (auxiliares, ser, haber) ✗
├── Cap. 6  Verbos regulares (4 conjugaciones, ≈50 pages — the biggest) ✗
├── Cap. 7  Verbos irregulares ....... ✗
├── Cap. 8  Verbos impersonales ...... ✗
├── Cap. 9  Adverbios ................ ✗
├── Cap. 10 Preposición, conjunción, interjección ✗
├── Apéndice (saludos) ............... ✗
└── Fe de erratas .................... ✗ (to apply as corrections)
```
Roughly **20 % of the book** is online. The remaining 80 % is why the structure must be fixed first: every problem above would be multiplied by 7 chapters.

---

## Do we need a SQL / NoSQL database?

**Not now.** Recommendation: keep content as **JSON files in git** ("a database made of files"), add validation, and only add a real database when a feature needs *users writing data*.

| Need | JSON in git (now) | Real database (later) |
|---|---|---|
| ~3 000 words, read-only for visitors | ✅ perfect | overkill |
| You are the only editor | ✅ git history = undo + change log | — |
| Free hosting, works offline, fast | ✅ static site | needs a server/service |
| Community uploads audio | ✗ | ✅ needed |
| Teacher/student accounts, shared progress | ✗ | ✅ needed |
| Non-developers edit content in a web form | ◐ possible with a git-based CMS | ✅ |

The JSON files will be designed like database tables (each word has an `id`, sections refer to words by `id`), so moving to a database later (Phase 10) is a copy, not a rewrite.

```
              TODAY                                   TARGET
 NounClass1.vue  ─ words + text + design      lexicon/nouns.json  ── every word ONCE
 class-1.json    ─ words (stale)                     ▲ ▲ ▲
 practice-deck   ─ words again                       │ │ └── exercises/*.json (refer by id)
                                                     │ └──── sections/*.json  (text + list of ids)
                                                     └────── audio-manifest.json (which ids are recorded)
```

---

## Target architecture

```
 Salvado y Cos PDF
        │  extract (pdftotext) + check by you
        ▼
 src/data/                     ← CONTENT ("the database"), edited by you
   lexicon/*.json                every Benga word once, with meaning {es,en,fr}
   sections/ch-N/*.json          text blocks + ids of the words to show
   exercises/*.json
   audio-manifest.json
        │
        ▼
 src/utils/ + src/services/    ← LOGIC, written once, tested
   toAudioId(word)  dictionaryUrl(word)  localized(field)  audioPlayer
        │
        ▼
 src/components/blocks/        ← LEGO PIECES
   PatternBox  ExampleGrid  NoteBox  ConceptList  ConjugationTable  QuizCard …
        │
        ▼
 src/views/                    ← THIN PAGES (or one generic page) that assemble blocks
        ▲
 src/data/chapters-index.json  ← ONE list that builds routes + sidebar + prev/next buttons
```

Target folder structure:

```
src/
├── config/            external.js (Cloudinary, Living Dictionary, PDF path)
├── utils/             audioId.js, dictionaryUrl.js, localized.js  (+ *.spec.js tests)
├── services/          audioPlayer.js
├── data/
│   ├── chapters-index.json
│   ├── lexicon/       nouns.json, adjectives.json, verbs.json, …
│   ├── sections/      ch-1/ … ch-10/, front-matter/, appendix/
│   ├── exercises/
│   ├── audio-manifest.json
│   └── schemas/       *.schema.json  (rules the validator checks)
├── components/
│   ├── common/  layout/  navigation/
│   ├── content/       BengaWord, AudioButton, EditorialNote, SourceRef
│   ├── blocks/        PatternBox, ExampleGrid, ExampleTable, NoteBox, ConceptList, PracticeList, ConjugationTable, Dialogue
│   └── interactive/   QuizCard, FlashCard, FillInPlural, MatchingGame
├── views/             HomePage, AboutAuthor, ResourcesPage, DictionaryPage, SectionPage (generic), chapter-*/ (special pages only)
└── locales/           es.json, en.json, fr.json   (UI words only — content translations live in data/)
scripts/               validate-data.js, audio-checklist.js, extract-pages.sh
docs/                  ROADMAP.md, WORKING-WITH-AI.md, CONTENT-GUIDE.md
```

---

## Phase 0 — Housekeeping (no visible change, makes everything else safer)

Branch: `chore/housekeeping`

- [x] **0.1 Put the AI rules back under version control**
  - **Why:** P10. `AGENTS.md` is how every AI session learns your rules.
  - **Prompt:** "Task 0.1: restore `AGENTS.md` to the repo root from `context/AGENTS.md`, merge anything still useful from `instructions.md` into it, delete `instructions.md`, and update the project-structure section to match the real folders (`src/styles`, not `src/assets/styles`). Keep `context/` ignored for my private prompts."
  - **Commit:** `docs: restore AGENTS.md as the single source of AI instructions`

- [x] **0.2 Remove unused files**
  - **Why:** P11. Dead files confuse readers.
  - **Prompt:** "Task 0.2: find files not imported anywhere (start with `HelloWorld.vue`, `src/assets/logo.png`, the empty SCSS partials). Show me the list and why each is unused before deleting."
  - **Commit:** `chore: remove unused scaffold files`

- [x] **0.3 Rename misspelled view files**
  - **Why:** P11. `IrregularAdjectivesSection` actually shows *invariable* adjectives.
  - **Prompt:** "Task 0.3: rename `DipthongsSection`→`DiphthongsSection`, `TripthongsSection`→`TriphthongsSection`, `ConsonantsSections`→`ConsonantsSection`, `IrregularAdjectivesSection`→`InvariableAdjectivesSection` using `git mv`, update router, component `name`s and AGENTS.md. URLs must not change."
  - **Commit:** `refactor: rename view files to match their content`

- [x] **0.4 Fix the PDF download**
  - **Why:** P9.
  - **Prompt:** "Task 0.4: make the 'Descargar PDF' link work. Move the PDF to `public/downloads/` (one copy only, keep git history with `git mv`), update every reference, and update AGENTS.md's source-of-truth path."
  - **Commit:** `fix(resources): serve the grammar PDF for download`

- [x] **0.5 One config file for external URLs**
  - **Why:** P7.
  - **Prompt:** "Task 0.5: create `src/config/external.js` exporting `CLOUDINARY_BASE`, `LIVING_DICTIONARY_BASE` and `BOOK_PDF_URL` (Cloudinary read from `.env` with a default). Replace the 14 copies in views and the one in `BengaWord.vue`. Also check in the browser whether a Living Dictionary link like `/benga/entry/epokolo` actually opens an entry, and tell me."
  - **Commit:** `refactor(config): centralise external URLs`

- [x] **0.6 Formatting rules**
  - **Why:** files mix `'` and `"`, `;` and no `;` — noisy diffs.
  - **Prompt:** "Task 0.6: add Prettier + `.editorconfig` matching the current majority style (single quotes, no semicolons), add `npm run format`, run it once in its own commit."
  - **Commit:** `chore: add prettier and format the codebase`

---

## Phase 1 — Upgrade the platform (decision point)

Branch: `build/vue3-vite`. **Decide first:** upgrade now (recommended — the code is small, Options API stays exactly the same) or stay on Vue 2.7 and skip this phase.

- [ ] **1.1 Replace vue-cli with Vite**
  - **Prompt:** "Task 1.1: explain in simple terms what changes when moving from vue-cli to Vite, then migrate: `vite.config.js` with the `@` alias and SCSS, move `index.html` to the root, `npm run dev/build/preview`. Keep Vue 2.7 for this step so only one thing changes at a time."
  - **Commit:** `build: migrate from vue-cli to vite`

- [ ] **1.2 Upgrade to Vue 3 + vue-router 4 + vue-i18n 9 (Options API kept)**
  - **Prompt:** "Task 1.2: upgrade to Vue 3, vue-router 4 and vue-i18n 9 in legacy mode so `$t()` keeps working. Fix breaking changes (`createApp`, catch-all route `/:pathMatch(.*)*`, scrollBehavior `top`, any `$listeners`/`.sync`). List each breaking change you fixed."
  - **Commit:** `feat!: upgrade to vue 3, vue-router 4 and vue-i18n 9`

- [ ] **1.3 Smoke-test every page**
  - **Prompt:** "Task 1.3: start the dev server and open every route in the browser; report console errors and visual breakage, then fix them."
  - **Commit:** `fix: resolve regressions after vue 3 upgrade`

- [ ] **1.4 Update AGENTS.md tech stack**
  - **Commit:** `docs: update tech stack to vue 3 and vite`

---

## Phase 2 — The content model ("the database made of files")

Branch: `refactor/content-model`. This is the most important phase.

- [ ] **2.1 Design the data shapes (schemas)**
  - **Why:** P1, P4. One shape for every word, everywhere.
  - Example of the target lexicon entry:
    ```json
    {
      "id": "epokolo",
      "type": "noun",
      "nounClass": 1,
      "singular": { "word": "Epokolo" },
      "plural":   { "word": "Bepokolo" },
      "meaning":  { "es": "Sombrero", "en": "Hat", "fr": "Chapeau" },
      "source":   { "bookPage": 9, "pdfPage": 9 },
      "editorial": { "status": "original", "note": null }
    }
    ```
    `audioId` is **not** written — it's computed from `word` (fixes P5). An optional `"audioId"` override exists for exceptions.
    `editorial.status` is `original` | `corrected` | `added` (lets the site improve the book while showing what the book said).
  - **Prompt:** "Task 2.1: propose JSON Schemas in `src/data/schemas/` for: lexicon entry (noun, adjective, verb, other), section file (a list of typed blocks: paragraph, rule, pattern, examples, table, note, conjugation, dialogue), exercise, and chapters-index. Explain each field with an example before writing files. Write `docs/CONTENT-GUIDE.md` describing how I add a word or a section."
  - **Commit:** `docs(data): define content schemas and content guide`

- [ ] **2.2 Helper functions with tests**
  - **Done early (2026-11-11, word registry):** `toAudioId` + tests (`npm test`, Node's built-in runner instead of Vitest) and the dictionary link (`src/services/wordLinks.js`). Still to do: `localized.js`.
  - **Prompt:** "Task 2.2: create `src/utils/audioId.js` (`toAudioId(word)` implementing the AGENTS.md rule, multi-word joined with `-`), `src/utils/dictionaryUrl.js`, `src/utils/localized.js` (`localized(field, locale)` falls back to `es`). Add Vitest and unit tests using the AGENTS.md examples (`Whâki → wh_a_ki`, `Mūēngi → m_u_e_ngi`, `Pēki Pēki → p_e_ki-p_e_ki`). Comment each function for a beginner."
  - **Commit:** `feat(utils): add audioId, dictionary-link and localization helpers with tests`

- [ ] **2.3 Content validator script**
  - **Done early (2026-11-11, word registry):** `npm run words:sync/check` already reports orthography problems and hand-typed audio ids; extend it here instead of starting from scratch.
  - **Why:** P13. Catches mistakes before you see them in the browser.
  - **Prompt:** "Task 2.3: write `scripts/validate-data.js` (`npm run validate`) that checks all JSON against the schemas and reports, in plain Spanish/English: duplicate ids, sections referring to missing ids, Benga words containing `c q r x z ñ` or Spanish accents `á é ú`, explicit `audioId` that differs from `toAudioId(word)`. Run it on the current data and show me the report — don't fix data yet."
  - **Commit:** `feat(scripts): add content validator`

- [ ] **2.4 Build the noun lexicon from the real source**
  - **Why:** P1, P2. AGENTS.md: the `.vue` `data()` blocks hold the real content, `class-N.json` must not be trusted.
  - Subtasks (one commit each so you can review class by class):
    - [ ] 2.4.1 Script `scripts/extract-ch2.js` that reads `NounClass1-7.vue`, `IrregularNouns.vue`, `VerbalNouns.vue` data and writes `lexicon/nouns.json` — **Commit:** `feat(scripts): extract chapter-2 nouns from views`
    - [ ] 2.4.2 Review diff against the PDF for each class (I list doubtful entries; you decide) — **Commit:** `fix(content): correct chapter-2 nouns against the book`
    - [ ] 2.4.3 Delete stale `class-N.json` — **Commit:** `chore(data): remove stale chapter-2 class files` *(postponed to Phase 4: the developer wants to keep them until the site is multilingual, see REVIEW-LOG R-005)*
  - **Prompt:** "Task 2.4.x: (see subtask). Never invent a headword; mark unreadable OCR with `meaning: null` and an editorial note."

- [ ] **2.5 Practice deck built from the lexicon**
  - **Prompt:** "Task 2.5: make `NounPracticeGame.vue` build its deck from `lexicon/nouns.json` (filter by class) and delete `noun-practice-deck.json` (3 800 lines). The game must behave exactly as before."
  - **Commit:** `refactor(practice): build practice deck from the lexicon`

- [ ] **2.6 Convert chapters 1 and 3 data to the same shapes**
  - Subtasks: 2.6.1 chapter 1 (`alphabet`, `diphthongs`, `triphthongs`, `consonants`) · 2.6.2 chapter 3 adjectives → `lexicon/adjectives.json` + section files.
  - **Prompt:** "Task 2.6.x: convert `src/data/chapter-N/*.json` to the schemas from 2.1. Pages must look identical — compare before/after screenshots."
  - **Commits:** `refactor(data): move chapter-1 content to the common schema` · `refactor(data): move chapter-3 adjectives to the lexicon`

---

## Phase 3 — Reusable building blocks (pages built from data)

Branch: `refactor/blocks`

- [ ] **3.1 Shared audio player service**
  - **Done early (2026-11-11, word registry):** the "audio manifest" is the `audio` field of `word-registry.json`; `BengaWord` already hides the play button for words not recorded. Still to do: one shared player that stops the previous sound.
  - **Why:** today each `BengaWord` has its own `<audio>`; two can play at once, and missing files fail silently.
  - **Prompt:** "Task 3.1: create `src/services/audioPlayer.js` — one shared Audio object, stops the previous sound, exposes play/stop/state; reads `audio-manifest.json` to know which ids exist. Refactor `BengaWord` to use it and to show the 'pending' icon for ids not in the manifest. Add a `TODO(5.2)` where the manifest will be auto-generated."
  - **Commit:** `feat(audio): add shared audio player service`

- [ ] **3.2 `BengaWord` accepts a lexicon entry**
  - **Done early (2026-11-11, word registry):** `BengaWord` computes key, audio and dictionary link from `word` alone. Still to do: `lang="bng"`, and showing dictionary links on pages that don't pass `dictionary-url` yet (chapter 3).
  - **Prompt:** "Task 3.2: let `BengaWord` take either `word` or an `entry` prop (+ `form: 'singular'|'plural'`), computing audioId and dictionary link itself. Add `lang=\"bng\"` (ISO code for Benga) on the word for screen readers. Keep old props working."
  - **Commit:** `feat(benga-word): accept lexicon entries and compute audio ids`

- [ ] **3.3 Block components**
  - Subtasks, one commit each: `PatternBox`, `ExampleGrid` (singular/plural cards), `NoteBox` (`.section-note`), `ConceptList`, `PracticeList`, `SectionNavFooter` (prev/next from chapters-index).
  - **Prompt:** "Task 3.3.x: extract `<name>` from `NounClass1.vue` (the visual reference) into `src/components/blocks/<Name>.vue` with props + slots, BEM, `@include respond-below('md')`. Use it in NounClass1 only; page must look identical."
  - **Commit:** `feat(blocks): add <Name> component`

- [ ] **3.4 One generic noun-class page**
  - **Why:** P3 — 7 files × ~550 lines → 1 file + 7 JSON files.
  - Subtasks: 3.4.1 create `NounClassPage.vue` reading `sections/ch-2/class-N.json`; 3.4.2–3.4.8 switch class 1…7 one at a time and delete the old file.
  - **Prompt:** "Task 3.4.N: migrate noun class N to `NounClassPage` + `sections/ch-2/class-N.json` (exceptions section included). Compare old and new page side by side before deleting `NounClassN.vue`."
  - **Commits:** `feat(ch2): add generic noun class page` · `refactor(ch2): migrate noun class N to generic page`

- [ ] **3.5 Generic `SectionPage` (block renderer)**
  - **Why:** new book sections should need **only a JSON file**.
  - **Prompt:** "Task 3.5: create `SectionPage.vue` that renders the `blocks` array of a section file, mapping each block `type` to a block component. Unknown types show a visible warning in dev. Migrate one simple page (Síncopa or Adjectives intro) as proof."
  - **Commit:** `feat(sections): add generic block-based section page`

- [ ] **3.6 Routes and sidebar from one list**
  - **Why:** P8.
  - **Prompt:** "Task 3.6: generate routes from `chapters-index.json` (each section names either a `component` or a `sectionFile`), so the sidebar, routes and prev/next buttons share one source. Keep all current URLs."
  - **Commit:** `refactor(router): generate routes from chapters index`

---

## Phase 4 — Translations (es → en → fr)

Branch: `feat/i18n`. Rule: **UI words** (buttons, headings that repeat) go in `locales/*.json`; **content** (meanings, explanations) lives in the data as `{ "es": …, "en": …, "fr": … }`.

```
"Reproducir pronunciación"  → locales/es.json   (same on every page)
"Sombrero" (meaning of Epokolo) → lexicon/nouns.json → meaning.es
```

- [ ] **4.1 Move hard-coded UI text into locales** — one commit per chapter.
  - **Prompt:** "Task 4.1.N: replace hard-coded Spanish UI text in chapter N views/blocks with `$t()` keys, grouped by component in `es.json`. Content text must go to the section JSON instead."
  - **Commit:** `feat(i18n): externalise chapter N interface text`
- [ ] **4.2 Remember the chosen language** (localStorage + `<html lang>`)
  - **Commit:** `feat(i18n): persist selected language`
- [ ] **4.3 Translation-coverage report** (`npm run i18n:report` — missing keys / missing `en`/`fr` meanings)
  - **Commit:** `feat(scripts): add translation coverage report`
- [ ] **4.4 English translation** — AI draft marked `"reviewed": false`, you review.
  - **Commit:** `feat(i18n): add english translation for chapters 1-3`
- [ ] **4.5 French translation** — same process.
  - **Commit:** `feat(i18n): add french translation for chapters 1-3`

---

## Phase 5 — Audio pipeline

Branch: `feat/audio-pipeline`

```
 lexicon ──► npm run audio:checklist ──► recording-checklist.csv ──► speaker records
                                                                          │
   site ◄── audio-manifest.json ◄── npm run audio:sync ◄── Cloudinary ◄───┘ upload <audioId>.mp3
```

- [ ] **5.1 Recording checklist** — CSV with word, audioId, meaning, book page, recorded yes/no.
  - **Done early (2026-11-11, word registry):** `/admin/palabras` → filter *Audio pendiente* → *Exportar CSV* already gives this list (without meaning and page).
  - **Prompt:** "Task 5.1: write `scripts/audio-checklist.js` producing `recording-checklist.csv` from all lexicon + example sentences."
  - **Commit:** `feat(scripts): generate audio recording checklist`
- [ ] **5.2 Manifest sync from Cloudinary** — uses API key in `.env.local` (never committed).
  - **Note:** the "manifest" is now `word-registry.json` (`audio: recorded`). This task becomes a script that lists the Cloudinary files and marks matching keys as recorded via the same writer as `words:import`.
  - **Commit:** `feat(scripts): sync audio manifest from cloudinary`
- [ ] **5.3 Audio guide** in `docs/AUDIO-GUIDE.md` (format mp3 mono 44.1 kHz, naming = audioId, folder, how to replace a recording).
  - **Commit:** `docs(audio): document recording and upload process`
- [ ] **5.4 Sentence audio and "play all"** for example tables.
  - **Commit:** `feat(audio): support sentence audio and play-all`

---

## Phase 6 — Complete the book

Branch per chapter: `content/ch-N`. Each section follows the same recipe:

```
1 extract pages (pdftotext)  →  2 clean OCR (you check doubtful words)  →  3 write JSON
→  4 npm run validate  →  5 view in browser  →  6 you compare with the book  →  7 commit
```

Generic prompt: *"Task 6.X.Y: add section '<name>' of chapter N (book pp. A–B). Extract the PDF pages, list doubtful OCR readings for me to decide, then create the lexicon entries and section file. Never invent words."*

| Task | Section(s) | New component needed | Commit |
|---|---|---|---|
| 6.0 | Prólogo, Prenotandos | — | `feat(front-matter): add prologue and prenotandos` |
| 6.1 | Cap. 1: combinación de consonantes (check), síncopa, vocabulario | `VocabularyList` | `feat(ch1): add syncope and vocabulary` |
| 6.2 | Cap. 2: vocabulario de substantivos | — | `feat(ch2): add noun vocabulary` |
| 6.3 | Cap. 3: inflexiones de numerales, adjetivos de repetición, ejercicio del tiempo, la edad, fraseología, vocabulario | `Dialogue` (phrase ↔ translation) | `feat(ch3): add <section>` |
| 6.4 | Cap. 4: pronombres personales, posesivos, relativos, interrogativos, tabla nombres-adjetivos-pronombres, definidos, indefinidos, reflexivos, recíprocos, ejercicios | `ConcordanceTable` | `feat(ch4): add <section>` |
| 6.5 | Cap. 5: nociones, especies, voces/modos/tiempos, auxiliares, *diyaka* (ser), haber, ejercicios | `ConjugationTable` | `feat(ch5): add <section>` |
| 6.6 | Cap. 6: verbos regulares — 4 conjugaciones (*kalaka, tandaka, yenika, vomuabidi*), voz activa/pasiva, afirmativa/negativa, listas de verbos | reuse `ConjugationTable` | `feat(ch6): add <conjugation>` |
| 6.7 | Cap. 7: irregulares (*valaka, vaka, paka, yalaka*…), contracciones | — | `feat(ch7): add <verb>` |
| 6.8 | Cap. 8: impersonales (*naka*…) | — | `feat(ch8): add impersonal verbs` |
| 6.9 | Cap. 9: adverbios (lugar, modo, tiempo, cantidad, afirmación, negación, interrogación, duda, comparación) | — | `feat(ch9): add <type> adverbs` |
| 6.10 | Cap. 10: preposición, conjunción, interjección | — | `feat(ch10): add <part>` |
| 6.11 | Apéndice: saludos | `Dialogue` | `feat(appendix): add greetings` |
| 6.12 | Fe de erratas → apply as `editorial.status: corrected` | — | `fix(content): apply the book's errata` |

> Verb spellings above come from the OCR'd table of contents and must be checked against the pages.

---

## Phase 7 — Editorial layer: correct and amplify the book

Branch: `feat/editorial`

- [ ] **7.1 `EditorialNote` + status badges** — "Corregido" shows what the book said and why it changed; "Añadido" marks content not in the book.
  - **Commit:** `feat(editorial): show corrections and additions with notes`
- [ ] **7.2 `SourceRef`** — "Libro p. 24" link opening the PDF at the right page (`#page=18`).
  - **Commit:** `feat(editorial): link content to the book page`
- [ ] **7.3 Teaching supplements** — block types `teacher-note`, `culture-note`, `modern-usage`.
  - **Commit:** `feat(sections): add teaching supplement blocks`
- [ ] **7.4 Corrections page** listing every `corrected` item (generated).
  - **Commit:** `feat(editorial): add corrections log page`

---

## Phase 8 — Interaction and teaching tools

Branch: `feat/interactive`

- [ ] **8.1 Exercise engine** — exercises defined in JSON; components `QuizCard`, `FlashCard`, `FillInPlural`, `MatchingGame`.
  - **Commit:** `feat(exercises): add json-driven exercise engine` (+ one `feat(exercises): add <Type>` per component)
- [ ] **8.2 Auto-generated exercises per section** from the lexicon (e.g. "pluralise class 3").
  - **Commit:** `feat(exercises): generate exercises from the lexicon`
- [ ] **8.3 Progress tracking** in the browser (localStorage; no accounts yet).
  - **Commit:** `feat(progress): track visited sections and scores locally`
- [ ] **8.4 Dictionary page** — search, filter by class/part of speech/chapter, audio.
  - **Note:** start from `/admin/palabras` (search, filters, audio test) as a model for the public version.
  - **Commit:** `feat(dictionary): add searchable lexicon page`
- [ ] **8.5 Site search** (Fuse.js over lexicon + section text).
  - **Commit:** `feat(search): add site-wide search`
- [ ] **8.6 Printable worksheets** (print CSS).
  - **Commit:** `feat(print): add printable worksheet styles`
- [ ] **8.7 Interactive vowel chart** for chapter 1 (click a vowel, hear it, see example words) — from the original plan.
  - **Commit:** `feat(ch1): add interactive vowel chart`

---

## Phase 9 — Quality and publishing

- [ ] **9.1 Component tests** for `BengaWord`, blocks, exercises — `test: add component tests for <name>`
- [ ] **9.2 GitHub Actions**: lint + validate + test + build on every push — `ci: run lint, validation, tests and build`
- [ ] **9.3 Accessibility audit** (keyboard, contrast, aria, `lang`) — `fix(a11y): <issue>`
- [ ] **9.4 Mobile audit** — `fix(responsive): <issue>`
- [ ] **9.5 Deploy** (Netlify / Vercel / GitHub Pages, SPA fallback for history mode) — `ci: deploy to <host>`
- [ ] **9.6 SEO**: per-page titles/meta, sitemap — `feat(seo): add page metadata and sitemap`

---

## Phase 10 — Only when needed: a real backend

Triggers: community audio uploads, teacher/student accounts, editors who don't use git.

| Step | Option | Why |
|---|---|---|
| 10.1 | **Decap CMS** (git-based) | web forms to edit the same JSON files; no database, no server |
| 10.2 | **Supabase** (PostgreSQL + storage + auth) | accounts, uploads, shared progress |

Because `lexicon` entries already have `id`s and sections refer to them by `id`, each JSON file maps to a table:

```
lexicon/nouns.json   →  table words        (id, type, noun_class, singular, plural, …)
meaning {es,en,fr}   →  table translations (word_id, locale, text)
sections/*.json      →  table sections + blocks (section_id, order, type, data)
audio-manifest.json  →  table recordings   (audio_id, url, speaker, approved)
```

Commits: `feat(cms): add decap cms for content editing` · `feat(backend): add supabase for audio contributions`
