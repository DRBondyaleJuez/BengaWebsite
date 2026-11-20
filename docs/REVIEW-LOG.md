# Review Log — doubts and things to check

Open questions that came up while working on roadmap tasks.
Go through them every few tasks, decide, and fill in **Resolution**.

**Status:** 🔴 Open · 🟡 In progress · 🟢 Resolved · ⚪ Won't fix / not needed

## Summary

| ID | Status | Found in | Topic | Decide by |
|----|--------|----------|-------|-----------|
| [R-001](#r-001) | 🟢 | 0.3 | Diphthong `ūa` listed twice (one is probably `ūâ`) | done |
| [R-002](#r-002) | 🟢 | 0.1 | `context/AGENTS.md` is an old duplicate | any time |
| [R-003](#r-003) | 🟢 | 0.1 | Rest of AGENTS.md is out of date | done |
| [R-004](#r-004) | 🟢 | Roadmap | Roadmap lives in git-ignored `context/` | any time |
| [R-005](#r-005) | 🟢 | 0.2 | Unused chapter-2 JSON files kept | done |
| [R-006](#r-006) | 🟢 | 0.2 | `ExampleTable.vue` is not used by any page | done |
| [R-007](#r-007) | 🟢 | Roadmap | Verb names in Phase 6 come from damaged OCR | done |
| [R-008](#r-008) | 🟢 | Audit | Living Dictionary links may not open an entry | task 0.5 |
| [R-009](#r-009) | 🟢 | 0.2 | Browser-support data is out of date (build warning) | done |
| [R-010](#r-010) | 🟢 | 0.4 | PDF link written by hand in 4 files, and breaks if the site is hosted in a sub-folder | task 0.5 |
| [R-011](#r-011) | 🟢 | 0.5 | No audio file is found on Cloudinary — every play button fails | done |
| [R-012](#r-012) | 🟢 | 0.5 | `VerbalNouns.vue` builds audio ids with its own function | done |
| [R-013](#r-013) | 🟢 | words | Class 2 page (`/capitulo-2/clase-2`) is completely blank | done |
| [R-014](#r-014) | 🟢 | words | 16 hand-typed audio ids have different letters than their word: possible content errors | done |
| [R-015](#r-015) | 🟢 | words | `Itánde` / `Matánde` written with a Spanish accent | done |
| [R-016](#r-016) | 🟢 | words | Vue warnings on the chapter 1 index (object used as list key) | done |
| [R-017](#r-017) | 🟢 | 1.1 | Styles use Sass features that Sass 3 will remove (warnings silenced) | done |
| [R-018](#r-018) | 🟢 | 1.2 | Newer major versions exist for ESLint, vue-router and vue-i18n | done |
| [R-019](#r-019) | 🟢 | 2.2 | 4 Spanish interface keys missing: the raw key text is shown | done |
| [R-020](#r-020) | 🟢 | 2.1 | Page table for the noun classes in AGENTS.md doesn't match the PDF | done |
| [R-021](#r-021) | 🟢 | 2.4.2 | Chapter-2 nouns that don't match the book text | done |
| [R-022](#r-022) | 🟢 | 2.6 | Chapter-1 and chapter-3 section files need the block renderer (Phase 3); numerals page not checked | done |
| [R-023](#r-023) | 🟡 | OCR | 2 882 words of the new OCR the computer is not sure about | little by little (per chapter, Phase 6) — use /admin/ocr |
| [R-024](#r-024) | 🟢 | 3.5, 3.7 | Links to pages that don't exist (chapter-3 intro, diphthongs) | done (check) |
| [R-025](#r-025) | 🟢 | 3.6 | Browser-tab title showed the previous page's title | done (check) |
| [R-026](#r-026) | 🟢 | 3.2 | The sidebar covers the left edge of the content on medium screens | done |
| [R-027](#r-027) | 🟢 | 3.4 | Class 2 page shows «Conceptos Clave» twice | done |
| [R-028](#r-028) | ⚪ | 3.7 | Alphabet page and chapter-3 pages are not section files yet | done |
| [R-029](#r-029) | 🟢 | 3.5 | Chapter-3 introduction: `ña` uses ñ, and small Spanish typos | done |
| [R-030](#r-030) | 🔴 | R-018 | Vite 8 is available (Vite 7 today) | Phase 9 |
| [R-031](#r-031) | 🔴 | review fixes | On phones some pages are wider than the screen (pattern box) | any time |

---

## Entries

### R-001
**Diphthong `ūa` listed twice — the second one is probably `ūâ`**
- **Status:** 🟢 Resolved
- **Found in:** 0.3 (browser console: `Duplicate keys detected: 'ūa'`)
- **Where:** `src/data/chapter-1/diphthongs.json` lines 73 and 103 · page `/capitulo-1/diptongos` · book p. 10 (PDF p. 10), "Los simples son…"
- **Doubt:** The book lists two different diphthongs: `úa` ("como púas", *múana*) and `úá` ("ua en guano", *úáúá* = aprisa). The JSON wrote both as `ūa`.
- **Suggestion:** Following the accent rule `á → â`, change the second entry to `ūâ` and its example to `ūâūâ` with audioId `_u_a_u_a_`. Check the scan by eye first.
- **Resolution:** 2026-11-11 · Developer confirmed: the first is `ūa`, the second `ūâ`. In `src/data/chapter-1/diphthongs.json` the second entry is now `ūâ` with example `ūâūâ` (aprisa, pronto), and its Spanish "Suena como" changed from "ua como en 'guano'" (wrong sound, per the developer) to "uo como en 'cuota'". Registry: new key `_u_a_u_a_`, old unused `_u_a_u_a` removed. Still to review in Phase 4 (translations): the English ("wa in wand") and French ("oua dans guano") descriptions of this sound. · commit `fix(ch1): correct the ūâ diphthong and its example`

### R-002
**`context/AGENTS.md` is an old duplicate**
- **Status:** 🟢 Resolved
- **Found in:** 0.1
- **Where:** `context/AGENTS.md` vs `AGENTS.md` (root)
- **Doubt:** The root file is now the real one and has newer edits. Two copies will drift apart.
- **Suggestion:** Delete `context/AGENTS.md`.
- **Resolution:** 2026-11-11 · Deleted `context/AGENTS.md` after comparing it line by line with the root file: the only extra content was the original planned folder tree, now kept in AGENTS.md → "Planned pieces from the original plan". · commit `docs: apply review-log decisions R-002 to R-007`

### R-003
**Rest of AGENTS.md is out of date**
- **Status:** 🟢 Resolved
- **Found in:** 0.1
- **Where:** `AGENTS.md` → "Tech Stack", "3. Implementation Plan", "4. Key Implementation Files"
- **Doubt:** These sections describe the old week-by-week plan and a sample `package.json` that differs from the real one. An AI may follow them instead of the roadmap.
- **Suggestion:** In task 1.4, replace them with the real tech stack and a short pointer to the roadmap.
- **Resolution:** 2026-11-11 · Replaced "3. Implementation Plan" and "4. Key Implementation Files" with a short "Roadmap and Workflow" section that points to docs/ROADMAP.md, plus the list of planned pieces. The Vue version line stays until Phase 1 (task 1.4). · commit `docs: apply review-log decisions R-002 to R-007`

### R-004
**The roadmap lives in git-ignored `context/`**
- **Status:** 🟢 Resolved
- **Found in:** Roadmap (after the files were moved)
- **Where:** `context/ROADMAP.md`, `context/WORKING-WITH-AI.md`
- **Doubt:** Git doesn't track these files, so there's no history or backup. The roadmap prompts also say `docs/ROADMAP.md`.
- **Suggestion:** Either move them back to `docs/` (tracked, so the checkboxes are saved), or keep them private and say "read context/ROADMAP.md" when starting a task.
- **Resolution:** 2026-11-11 · The developer moved ROADMAP.md and WORKING-WITH-AI.md back to `docs/` (tracked by git). · no code change

### R-005
**Unused chapter-2 JSON files kept**
- **Status:** 🟢 Resolved
- **Found in:** 0.2
- **Where:** `src/data/chapter-2/class-1.json … class-7.json`, `nouns-intro.json`, `irregular-nouns.json`, `verbal-nouns.json`
- **Doubt:** No page imports them. `class-N.json` has known wrong glosses, and `class-1.json` is not even valid JSON (missing `,` after line 131; found in 0.6, so it's listed in `.prettierignore` until deleted). Do any of them hold text that isn't in the `.vue` pages, such as extra notes or examples?
- **Suggestion:** In task 2.4, compare them with the pages and keep anything useful, then delete them in 2.4.3.
- **Resolution:** 2026-11-11 · Developer: keep them for now; clean them up when the site becomes multilingual (Phase 4), since they contain `es/en/fr` text that may help. Still open. · 2026-11-20 · Developer: remove them. The ten `src/data/chapter-2/*.json` files are deleted (their content lives in `lexicon/nouns.json` and `sections/ch-2/`); `collect-words` no longer needs an ignore list. · commit `chore(data): remove stale chapter-2 class files (R-005)`

### R-006
**`ExampleTable.vue` is not used by any page**
- **Status:** 🟢 Resolved
- **Found in:** 0.2
- **Where:** `src/components/content/ExampleTable.vue`
- **Doubt:** It was kept as a future building block, but it might not fit the new blocks design.
- **Suggestion:** Decide in task 3.3: reuse it as the table block, or delete it.
- **Resolution:** 2026-11-11 · Developer: it was only a personal template. Deleted `src/components/content/ExampleTable.vue`. · commit `chore: remove ExampleTable template component`

### R-007
**Verb names in Phase 6 come from damaged OCR**
- **Status:** 🟢 Resolved
- **Found in:** Roadmap (table of contents, PDF last pages)
- **Where:** ROADMAP Phase 6, rows 6.6 and 6.7: *kalaka, tandaka, yenika, vomuabidi, valaka, vaka, paka, yalaka*
- **Doubt:** The table of contents OCR reads e.g. `Tánddká`, `Yénik2`, `Vomualbidi`. The exact spelling and accents are unknown.
- **Suggestion:** Check each one against its chapter page when starting that Phase 6 task.
- **Resolution:** 2026-11-11 · Developer hasn't reviewed the verbs chapters yet; check the spellings together when Phase 6 reaches chapters 5–8. Still open. · 2026-11-20 · Checked against the improved OCR (PDF chapter headings and table of contents). The book has **five** regular conjugations, not four: 1ª -ka *kalaka* hablar (PDF 52), 2ª -kâ *tândâkâ* amar (PDF 60), 3ª -kē *yēnikē* ver (PDF 71), 4ª -kidē *vomuakidē* castigar (PDF 78, the roadmap said `vomuabidi`), 5ª -kiya *tamūakiya* mirar (PDF 88; the ū is the OCR's most frequent reading). Irregular: *valaka* ir (94), *vaka* venir (99), *pâkâ* llegar (102), *yalakē* poder (105); impersonal *naka* llover (113); *diyaka* ser (40). ROADMAP rows 6.6-6.8 and the lexicon schema (`conjugation` 1-5) are updated. Each spelling is still checked against the scan when its Phase 6 task starts (Phase 6 recipe; `/admin/ocr`). · commit `docs: verb names from the improved OCR; five conjugations (R-007)`

### R-008
**Living Dictionary links may not open an entry**
- **Status:** 🟢 Resolved
- **Found in:** Audit
- **Where:** `getDictionaryUrl()` in chapter-2 views → `https://livingdictionaries.app/benga/entry/<word>`
- **Doubt:** Living Dictionaries usually identifies entries by an internal id, not by the word, so these links may lead to a "not found" page.
- **Suggestion:** Test a few links in task 0.5. If they fail, link to the dictionary's search instead, or hide the icon.
- **Resolution:** 2026-11-09 · Confirmed: `/benga/entry/epokolo` shows "This entry doesn't exist" (404). All word links now open the dictionary's search with the word typed in (`/benga/entries?q={"query":"epokolo"}`), built by `getDictionaryUrl()` in `src/utils/dictionaryUrl.js`. Note: the online Benga dictionary has very few entries so far, so most searches show "No matching entries" — but no more 404s. · commit `refactor(config): centralise external URLs`
  **Follow-up 2026-11-11** (developer asked for one unified, scalable place for these ids): each word's Living Dictionary id now lives in `src/data/lexicon/word-registry.json`. With an id the link opens the exact entry (`…/benga/entry/<id>`); without one it falls back to the search. Ids can be added at `/admin/palabras` (paste the entry URL), in bulk with `npm run words:import -- list.csv`, or by giving Claude a list. First import: the dictionary's 17 entries (`scripts/imports/living-dictionary-2026-11-11.csv`), 11 of which match words on the site.

### R-009
**Browser-support data is out of date**
- **Status:** 🟢 Resolved
- **Found in:** 0.2 (lint/build output: "caniuse-lite is 7 months old")
- **Where:** `package-lock.json`
- **Doubt:** Harmless warning; it only affects which old browsers the build targets.
- **Suggestion:** Run `npx update-browserslist-db@latest` in its own commit (`chore: update browserslist database`), or let Phase 1 handle it.
- **Resolution:** 2026-11-11 · Ran `npx update-browserslist-db@latest`: only `package-lock.json` changed, "No target browser changes", and the build warning is gone. · commit `chore: update browserslist database`

### R-010
**PDF link written by hand in 4 files, and breaks if the site is hosted in a sub-folder**
- **Status:** 🟢 Resolved
- **Found in:** 0.4
- **Where:** `href="/downloads/salvado-y-cos-gramatica-benga.pdf"` in `AppSidebar.vue:24`, `AppFooter.vue:38`, `AboutAuthor.vue:160`, `ResourcesPage.vue:28`
- **Doubt:** The links work now. But the path starts with `/`, so it only works when the site is at the root of a domain. On e.g. GitHub Pages (`user.github.io/benga/`) it would 404. Renaming the file also means 4 edits.
- **Suggestion:** In task 0.5, add `BOOK_PDF_URL = process.env.BASE_URL + 'downloads/salvado-y-cos-gramatica-benga.pdf'` to `src/config/external.js` and use it in all 4 places. (Minor: `AboutAuthor.vue:164` has a fallback text `|| 'Descargar PDF Completo'` that never shows; remove it then.)
- **Resolution:** 2026-11-09 · Done as suggested: `BOOK_PDF_URL` in `src/config/external.js` (uses `BASE_URL`), used by all 4 links; dead fallback text removed. · commit `refactor(config): centralise external URLs`

### R-011
**No audio file is found on Cloudinary — every play button fails**
- **Status:** 🟢 Resolved
- **Found in:** 0.5 (clicking the first play button on `/capitulo-2/clase-1`)
- **Where:** `CLOUDINARY_BASE` in `src/config/external.js` · Cloudinary account `dp5rofjyx`
- **Doubt:** `…/video/upload/v1780354084/ejanganangobo.mp3` returns 404. So do `epokolo`, `en_a_`, `ek_a_i`, `bobe`, `a`, with or without the `v1780354084` version and with or without a `benga-audio/` folder. Either no recordings are uploaded yet, or they are stored under other names, folders or resource types. This was already the case before task 0.5 (same URL).
- **Suggestion:** Open the Cloudinary Media Library and check one uploaded file's real URL (folder, `video` vs `raw`, file name). Then either fix `CLOUDINARY_BASE` (one line now) or plan uploads in Phase 5. Until then the site shows buttons that don't play; task 3.1 (audio manifest) will hide them for missing files.
- **Resolution:** 2026-11-11 · Developer: Cloudinary is an empty placeholder for now. Built the **word registry** (`src/data/lexicon/word-registry.json`, guide `docs/WORD-REGISTRY.md`): each word has an `audio` state (`missing`/`recorded`) and `BengaWord` shows a play button **only** for recorded words, so no more buttons that fail. When recordings are uploaded as `<key>.mp3`, mark them `recorded` at `/admin/palabras` or with `npm run words:import`. Automatic sync from Cloudinary = roadmap 5.2. · commits `feat(words): add the word registry…`, `feat(words): link BengaWord audio and dictionary…`, `feat(admin): add a dev-only word registry editor`

### R-012
**`VerbalNouns.vue` builds audio ids with its own function**
- **Status:** 🟢 Resolved
- **Found in:** 0.5
- **Where:** `makeAudioId()` in `src/views/chapter-2/VerbalNouns.vue` (methods)
- **Doubt:** It's a second, private copy of the audio-id rule. It may differ from the AGENTS.md rule (e.g. adjacent accented vowels, multi-word forms).
- **Suggestion:** In task 2.2, replace it with the shared `toAudioId()` and compare the ids it produced for every verbal noun.
- **Resolution:** 2026-11-11 · `makeAudioId()` deleted. There is now ONE rule, `toAudioId()` in `src/utils/audioId.js` (with tests), used by the site and the scripts; pages no longer pass audio ids at all (63 hand-typed `:audio-id` bindings removed), the key is computed from the word. · commits `feat(words): add the shared word-key rule with tests`, `feat(words): link BengaWord audio and dictionary to the word registry`

### R-013
**Class 2 page (`/capitulo-2/clase-2`) is completely blank**
- **Status:** 🟢 Resolved
- **Found in:** word registry work (2026-11-11), page check of all routes; already broken before that work (checked on the previous commit)
- **Where:** `src/views/chapter-2/NounClass2.vue`, the "líquidos" section (`liquidExamples`) and the "sexta clase" exception section (`classSixExample`)
- **Doubt:** The template expects every example to have `singular` and `plural`, but the 6 `liquidExamples` (Mavule, Manyângâ, Maku, Makândâ, Makiya, Miba) are single words, so Vue stops with `Cannot read properties of undefined (reading 'word')` and shows nothing. `classSixExample` is used by the template but doesn't exist in `data()`.
- **Suggestion:** Show the liquids as single words (they only have a plural form?) with a small template change, and either add the class-6 examples from the book (PDF p. 10–11) or remove that section. Needs your decision on the content; the code fix is small.
- **Resolution:** 2026-11-12 · Two template bugs, no content missing. (1) The liquids (Mavule, Manyângâ, Maku, Makândâ, Makiya, Miba) are now shown as single plural cards with the existing "Solo plural" badge style, as the book says they aren't used in the singular. (2) The class-6 exception section kept, as the developer asked; its data already existed as `classSixExamples` but the template read `classSixExample`. Its 3 pairs match the book (PDF p. 11, OCR `JInáni`/`Tboko`/`Tkadada` = `Inâni`/`Iboko`/`Ikadada`, confirmed by the plurals `Lonáni`/`Loboko`/`Lokadada` and by `iboko` in the book's sentences). The page renders again (98 words). · commit `fix(ch2): show class 2 again (plural-only liquids, class-6 exception)`

### R-014
**16 hand-typed audio ids have different letters than their word (possible content errors)**
- **Status:** 🟢 Resolved
- **Found in:** word registry work (`npm run words:sync` report)
- **Where:** the old `audio`/`audioId` fields next to these words (the site ignores those fields now):

  | Word shown on the page | Old typed id | File(s) |
  |---|---|---|
  | kalaka | test | alphabet.json, AlphabetSection.vue |
  | tânâdkâ | tanodku | alphabet.json, AlphabetSection.vue |
  | ndēmbē | nd_e_emb_e_ | consonants.json, ConsonantsSection.vue |
  | ngūae | ngu_u_a_e | triphthongs.json, TriphthongsSection.vue |
  | Mamya | mumya | noun-practice-deck.json, NounClass2.vue |
  | Maso | muso | noun-practice-deck.json, NounClass2.vue |
  | Miongo | mingo | noun-practice-deck.json, NounClass4.vue |
  | Būayē | b_u_any_e_ | noun-practice-deck.json, NounClass4.vue |
  | Mbalanga | malanga | noun-practice-deck.json, NounClass7.vue |
  | Ndonda | ndonga | noun-practice-deck.json, NounClass7.vue |
  | Nganga | nuega | noun-practice-deck.json, NounClass7.vue |
  | Nganiyango | aniyango | noun-practice-deck.json, NounClass7.vue |
  | Ngejangeja | gejangeja | noun-practice-deck.json, NounClass7.vue |
  | Ngonga | ngonda | noun-practice-deck.json, NounClass7.vue |
  | Ngūanjangūanja | ngaanjangaanja | IrregularNouns.vue |
  | Maka | mala | IrregularNouns.vue |

- **Doubt:** Most are typing slips in the id, but some may mean the **word** is wrong: e.g. `tânâdkâ` looks like `tândâkâ` (amar, as in VerbalNouns); AGENTS.md mentions `Ndonga` in the class-7 list, yet the page shows `Ndonda` (and `Ngonga`/`ngonda` look swapped); `Maka`/`mala`; `Būayē`/`b_u_any_e_` (`Būanyē`?).
- **Suggestion:** Check each word against the book page; correct the word where needed, then run `npm run words:sync`. The old id fields disappear in Phase 2 anyway. (Another 23 differ only in accent marking, e.g. `yâkâ`/`yaka`: no content doubt.)
- **Resolution:** 2026-11-12 · Developer confirmed 15 of the 16: the words are right and the ids were wrong (`test` was a Cloudinary connection test), except `tânâdkâ`, which is corrected to **`tândâkâ`** (amar, as in VerbalNouns). Old ids aligned with the rule in alphabet, consonants, triphthongs, the practice deck, NounClass2/4/7 and IrregularNouns (30 fields). `Ndonga` (Confianza) already existed next to `Ndonda` (Cosecha, siega) with id `ndonga`, so nothing was added. Registry: unused `tânâdkâ` entry removed. `Nganga` (Médico, class 7): the book's OCR reads "Nuega"; developer confirmed **`Nganga`**, id corrected to `nganga` (NounClass7 + practice deck). No old id now differs from its word in letters, only 23 in accent marking (no content doubt; removed in Phase 2). · commits `fix(content): correct audio ids and tândâkâ (R-014)`, `fix(content): correct the Nganga audio id (R-014)`

### R-015
**`Itánde` / `Matánde` written with a Spanish accent**
- **Status:** 🟢 Resolved
- **Found in:** word registry work (orthography warning of `npm run words:sync`)
- **Where:** `src/views/chapter-2/NounClass2.vue` and `src/data/chapter-2/noun-practice-deck.json`; `VerbalNouns.vue` writes `itânde`
- **Doubt:** By the orthography rule `á → â`, these should be `Itânde` / `Matânde`. Today they are two different keys from `itânde`, so a recording or dictionary id would have to be entered twice.
- **Suggestion:** Change to `Itânde` / `Matânde` in both files and run `npm run words:sync`.
- **Resolution:** 2026-11-12 · Developer: the correct forms are **`Itândē`** (amor) and **`Matândē`** (amores), keys `it_a_nd_e_` / `mat_a_nd_e_`. Changed in NounClass2.vue, the practice deck and VerbalNouns.vue (`itânde` → `itândē`, also in the summary example `Tândâkâ → itândē`). Registry: new keys added, old `it_a_nde` / `mat_a_nde` removed. `words:sync` now reports no orthography warnings and no spelling variants. · commit `fix(content): spell Itândē and Matândē (R-015)`

### R-016
**Vue warnings on the chapter 1 index (object used as list key)**
- **Status:** 🟢 Resolved
- **Found in:** word registry work (console while checking all routes)
- **Where:** `src/views/chapter-1/ChapterOneIndex.vue`, a `v-for` whose `:key` is an object
- **Doubt:** Vue warns "Avoid using non-primitive value as key" and "Duplicate keys detected: '[object Object]'". The page displays fine, but list updates can misbehave.
- **Suggestion:** Use a string id or the index as `:key`. Small fix; can go with Phase 3 or any chapter-1 task.
- **Resolution:** 2026-11-12 · The learning-outcomes list used each outcome object (`{ es, en }`) as its `:key`; it now uses `outcome-<index>` (the list is static). Checked in a fresh tab: `/capitulo-1` shows its 5 outcomes and the console has no warnings. · commit `fix(ch1): use string keys for the learning outcomes list (R-016)`

### R-017
**Styles use Sass features that Sass 3 will remove (warnings silenced)**
- **Status:** 🟢 Resolved
- **Found in:** 1.1 (first Vite build printed Sass deprecation warnings; vue-cli showed the `@import` one too)
- **Where:** every `<style lang="scss">` (`@import '@/styles/variables'`), `src/styles/main.scss`, `src/styles/_mixins.scss` / `_variables.scss` (`darken()`, `lighten()`, global `map-get` etc.); silenced in `vite.config.mjs` → `silenceDeprecations`
- **Doubt:** Nothing is broken today, but Dart Sass 3 will remove `@import`, global built-in functions and `darken()`/`lighten()`. When Sass 3 arrives, the build will fail until this is changed.
- **Suggestion:** In Phase 3, when styles move into shared block components: switch `@import` to `@use '@/styles/variables' as *`, use `sass:color` / `sass:map` functions (`color.adjust($c, $lightness: -10%)`), then remove `silenceDeprecations` from `vite.config.mjs`.
- **Resolution:** 2026-11-20 · All styles use `@use '@/styles/…' as *` and `sass:color` (`darken()` → `color.adjust(…, $lightness: -N%)`); `vite.config.mjs` no longer silences deprecations and the build prints none. Every page compared before/after at 1280 px and 420 px: identical. · commit `refactor(styles): move Sass to @use and sass:color (R-017)`


### R-018
**Newer major versions exist for ESLint, vue-router and vue-i18n**
- **Status:** 🟢 Resolved
- **Found in:** 1.2 (choosing package versions)
- **Where:** `package.json`: `eslint` 7 (no longer maintained) with `eslint-plugin-vue` 9; `vue-router` 4.6 (5.x exists); `vue-i18n` 11.4 (12 is in alpha)
- **Doubt:** For the upgrade I chose the versions with the best-known, stable API, to change as little as possible at once. ESLint 7 still works but gets no fixes; ESLint 9 needs a new config file (`eslint.config.js`, "flat config").
- **Suggestion:** In Phase 9 (quality and CI): upgrade ESLint to 9 with a flat config, then check whether vue-router 5 / vue-i18n 12 bring anything useful before moving.
- **Resolution:** 2026-11-20 · ESLint 7 → 10 with `eslint-plugin-vue` 10 and a flat config (`eslint.config.mjs`); `npm run lint` now also checks `scripts/` and the config files (5 small findings fixed). vue-router 4.6 → 5.5. vue-i18n stays 11 (11.4.23; 12 is not stable). Every page identical, tests/validate/build OK. Vite 8 is a separate decision: R-030. · commit `build: upgrade to ESLint 10 and vue-router 5 (R-018)`


### R-019
**4 Spanish interface keys missing: the raw key text is shown**
- **Status:** 🟢 Resolved
- **Found in:** 2.2 (console warnings while testing the language switch; also true before Vue 3)
- **Where:** `src/locales/es.json` has no `accessibility` group, but `App.vue:5` uses `accessibility.skipToContent`, `AppHeader.vue:7` `accessibility.openMenu`, `AppSidebar.vue:11` `accessibility.closeMenu`, `LanguageSwitcher.vue:7` `accessibility.selectLanguage`
- **Doubt:** The "skip to content" link (visible when navigating with the keyboard) and the screen-reader labels of the menu and language buttons read the key itself, e.g. "accessibility.skipToContent". The browser console also fills with "[intlify] Not found …" warnings (most are the expected missing en/fr translations).
- **Suggestion:** Add to `es.json`: `"accessibility": { "skipToContent": "Saltar al contenido", "openMenu": "Abrir menú", "closeMenu": "Cerrar menú", "selectLanguage": "Seleccionar idioma" }` (and en/fr in Phase 4). Task 4.3's coverage report will catch the rest.
- **Resolution:** 2026-11-13 · Added the `accessibility` group to `src/locales/es.json` (Saltar al contenido, Abrir menú, Cerrar menú, Seleccionar idioma). Checked in the browser: the skip link and the three aria-labels show Spanish, no raw key remains in the page and the console no longer warns about them. English/French versions come with Phase 4 (until then they fall back to Spanish). · commit `fix: add missing Spanish accessibility texts and correct the noun page table (R-019, R-020)`

### R-020
**Page table for the noun classes in AGENTS.md doesn't match the PDF**
- **Status:** 🟢 Resolved
- **Found in:** 2.1 (writing `source.pdfPage` for the schema examples)
- **Where:** AGENTS.md → "Source of Truth" table (class 1 = book 9-10 / PDF 9-10, class 2 = 10-11 / 10-11, …) · `public/downloads/salvado-y-cos-gramatica-benga.pdf`
- **Doubt:** Checked with `pdftotext -f N -l N`: PDF page 8 is printed page **14** and starts the class 1 list (*Epokolo*); PDF page 9 is printed **15** and starts «SEGUNDA CLASE»; PDF page 10 is printed **16** (class 2 «di» examples, exceptions, liquids, class-6 exception) and starts «TERCERA CLASE». So printed page = PDF page + 6, as AGENTS.md already says for chapter 3 (PDF 18 = book 24), but the noun-class table lists other numbers in both columns.
- **Suggestion:** In task 2.4 (when every noun gets its `source.pdfPage`), rebuild the whole table from the PDF and fix AGENTS.md. The schema examples already use the verified PDF pages (Epokolo p. 8, Dyoba and Miba p. 10).
- **Resolution:** 2026-11-13 · Rebuilt the AGENTS.md table from the PDF with `pdftotext` page by page: class 1 printed 14-15 / PDF 8-9, class 2 15-16 / 9-10, class 3 16-17 / 10-11, class 4 17-18 / 11-12, class 5 18 / 12, class 6 18-19 / 12-13, class 7 19-20 / 13-14, irregular nouns 20 / 14, verbal nouns 20-21 / 14-15 (printed = PDF + 6). Also corrected the class-7 column note: the left column of PDF 13 ends with `Ndomina` (not `Ndumba`); `Ndonga … Ndumba` and `Nyuñi … Nyênjê` are at the top of PDF 14. · commit `fix: add missing Spanish accessibility texts and correct the noun page table (R-019, R-020)`

### R-021
**Chapter-2 nouns that don't match the book text**
- **Status:** 🟢 Resolved
- **Found in:** 2.4.2 (comparing `src/data/lexicon/nouns.json` with `pdftotext` of PDF pages 8-17)
- **Where:** `src/data/lexicon/nouns.json` (and the same words in `src/views/chapter-2/*.vue` and the practice deck) · book PDF pages 8-17 (printed 14-23)
- **Doubt:** 119 of 437 words are not printed exactly like that in the OCR text. I checked each against its closest match: most are only OCR damage (`ū` read as `ñ`/`a`/`n`, `â` as `d`/`á`, `k` as `x`). These look like real differences:

  | Word on the site | Book (OCR) | PDF | Question |
  |---|---|---|---|
  | `Mbūa` = Perro (class 7) | `Mora. Perro.`; in the examples of PDF 31: `Mbua tákadi…` (perros) | 13, 31 | AGENTS.md says the word is `Mba`. The book itself writes `Mbua`, so I think the site is right and AGENTS.md is wrong. Keep `Mbūa` and fix AGENTS.md? |
  | `Nyuūē` = Cabello blanco (class 7) | `Nyuñi. Cabello blanco, ó canas` | 14 | `ñ` is usually an OCR'd `ū`, but the last letter reads `i`: `Nyuūi`? |
  | `Yâkâ` / `Biâkâ` = Medicina (class 1, y-variants) | `Yáki. Biákd. Medicina supersticiosa.` | 9 | Singular `Yâki` or `Yâkâ`? The book's meaning is «Medicina supersticiosa». |
  | `Dindē` / `Mandē` = Ñame, tubérculo (class 2) | `Dinds: ¡ Manda. … tubérculo` | 10 | Plural `Mandē` or `Mandâ`? |
  | `Ngândâ` = Habas (class 7) | `Ngúnda. Habas.` | 13 | The OCR reads `ú`, but the list is alphabetical and the word sits among the `Nga-` words, so `Ngândâ` is probably right. Confirm. |
  | `Evelse` = Hueso (deck only) | `Eee: meso.` (unreadable) | 17 | `ls` is an unusual cluster. Check the scan. |

  Also: the 158 words that only exist in the practice deck (they come from the book's «Vocabulario», PDF 15-17) were never shown on a page, so nobody has compared them with the book; 59 of them are not found exactly in the OCR text. The full list: `node scripts/extract-ch2.mjs` (section "Not found in the PDF text").
- **Suggestion:** Decide the six rows (look at the scan of each PDF page). The deck words can be reviewed little by little in the practice game. Corrections go into `nouns.json` with `"editorial": { "status": "corrected", "bookText": "…" }` and into the page that shows the word.
- **Resolution:** 2026-11-16 · Developer decided: `Mbūa` = Perro (AGENTS.md said `Mba`: fixed), `Nyuūē` = Cabello blanco, o canas (unchanged), `Yâkâ` / `Biâkâ` = «Medicina supersticiosa» (the scan prints `Yâkâ`, so only the meaning changed, on `NounClass1.vue` and in `nouns.json`), `Dindē` / `Mandē` = «Ñame, tubérculo» (lower-case t, `NounClass2.vue` + `nouns.json`), `Ngândâ` = Habas and `Evelse` = Hueso (unchanged). The practice-deck words were reviewed by the developer earlier; later checks can use the new searchable PDF (R-023). · commit `fix(content): apply R-021 decisions`

### R-022
**Chapter-1 and chapter-3 section files need the block renderer (Phase 3); numerals page not checked**
- **Status:** 🟢 Resolved
- **Found in:** 2.6 (converting chapters 1 and 3 to the content schemas)
- **Where:** `src/data/chapter-1/*.json` + `src/views/chapter-1/*Section.vue` · `src/data/chapter-3/*.json` + `src/views/chapter-3/*.vue` · `src/data/schemas/section.schema.json` · ROADMAP 2.6 and 3.5
- **Doubt:**
  1. Task 2.6 asks to move these pages to **section files** (blocks) with identical looks. The chapter-1 pages are custom designs (vowel chart, «suena como» cards, special letters) that the current block types can only hold as generic tables, and nothing can draw a section file yet: the block components and `SectionPage` are tasks 3.3 and 3.5. Writing section files now would create a second, unused copy of every text (the pages keep reading the old files).
  2. What was done in 2.6: `src/data/lexicon/adjectives.json` (23 adjectives: `būamu` with its seven class forms, `bobe`, `bonene`, `bohole`, `bovindo`, and the 18 invariable ones), validated. The chapter-3 pages still show their own copies, as the noun pages do.
  3. The numerals page (`numerals-ordinals.json`) writes Benga with Spanish accents (`Páka`, `Dyom na páka`, `Páka páka`, `Mbusiha mbuúha`…) and shows numbers without `BengaWord`, so `npm run validate` and the word registry don't see them.
- **Suggestion:** (1) Move "chapter 1 and chapter-3 section files" into Phase 3, right after task 3.5, so each page is converted together with the blocks that draw it (possibly adding block types such as `sound-list` for vowels/diphthongs). (3) Decide the Benga spelling of the numerals (`Páka` → `Pâka`?) and show them with `BengaWord`; the numerals can then join `adjectives.json` (`kind: "numeral"`).
- **Resolution:** 2026-11-16 · Developer agreed: chapter-1 and chapter-3 section files moved to new roadmap task 3.7 (after `SectionPage`). The numerals page was work in progress before the refactor and will be redone from the improved OCR: new task 6.0a. Correct spelling for one is `Pâkâ` (uno); the words on PDF p. 20 are the Benga numbers. · commit `fix(content): apply R-021 decisions`

### R-023
**2 882 words of the new OCR the computer is not sure about**
- **Status:** 🟡 In progress
- **Found in:** OCR (new text layer: `public/downloads/IMPROVED-salvado-y-cos-gramatica-benga.pdf`, `scripts/ocr-pdf.py`, guide `docs/OCR.md`)
- **Where:** full list in `docs/ocr/ocr-doubts.csv` (opens in Excel: `pdf_page`, `ocr_read`, `written_in_pdf`, `confidence`, `kind`). Per part of the book: chapter 2 nouns (PDF 8-17) 87 words, chapter 3 adjectives and numerals (PDF 18-20) 64, the rest mostly verb tables and phrases (PDF 21-45 have the most).
- **Doubt:** The scan is small (966 px wide), so Tesseract is unsure of some words. Listed: every word with confidence below 60 % that is neither a known Spanish word nor a known Benga word of the site. Two kinds:
  - `benga-accent` (1 154): unknown word with `á é ú` and no Spanish-only letter, written in the PDF as Benga `â ē ū` (e.g. `Ngúnda.` → `Ngūnda.`; the right word is `Ngândâ`, R-021). Probably Benga, accents uncertain.
  - `unknown` (1 728): left as read, often damaged (`Tirpedo.` = *Torpedo*, `Bralo.` = *Bialo*, `Jkogo.` = *Ikogo*: the OCR reads the italic capital `I` as `J`/`T`).
  
  Examples from PDF p. 9: `Bralo`, `Binmbe`, `Yzjá` (= *Yējâ*), `Makeéliné` (= *Makēlinē*), `Jtúndé` (= *Itândē*). Also known: the OCR often confuses `â` and `ū` on the noun lists (`Yákú` for *Yâkâ*).
- **Suggestion:** Don't go through the whole list now. When a roadmap task works on a section (Phase 6 recipe, numerals task 6.0a), filter the CSV by its PDF pages and check those words against the scan. Each word added to the lexicon also improves the next OCR run (`python scripts/ocr-pdf.py --reuse` re-applies the rules in seconds).
- **Resolution:** 2026-11-20 · Developer will review the words later. Built the tool for it: `/admin/ocr` (only during `npm run serve`): filters, a correction field with `â ē ū Â Ē Ū` buttons, a comment field, and the PDF page shown beside the list with the word framed (click its page number). Corrections are saved in `docs/ocr/ocr-corrections.json` and applied to the improved PDF with `python scripts/ocr-pdf.py --reuse` (docs/OCR.md). First correction: R-029. · commit `feat(admin): /admin/ocr to review the OCR doubts beside the PDF page (R-023, R-029)`


### R-024
**Links to pages that don't exist (chapter-3 intro, diphthongs)**
- **Status:** 🟢 Resolved (please check)
- **Found in:** 3.5 and 3.7 (moving the pages to section files)
- **Where:** `/capitulo-3/introduccion` → «Secciones del Capítulo», four «Aprende más →» links · `/capitulo-1/diptongos` → button «← Alfabeto»
- **Doubt:** The chapter-3 links went to `/capitulo-3/variable-adjectives`, `/invariable-adjectives`, `/comparatives-superlatives`, `/numeral-adjectives`, and the diphthongs button to `/capitulo-1/vocales`. None of these addresses exists, so visitors landed on the home page.
- **Suggestion:** Point them to the real pages.
- **Resolution:** 2026-11-17 · Fixed while moving the content: `/capitulo-3/adjetivos-regulares`, `/adjetivos-invariables`, `/comparativos-superlativos`, `/numerales-ordinales`, and `/capitulo-1/alfabeto` (in `sections/ch-3/adjectives-intro.json` and `sections/ch-1/diphthongs.json`). Nothing visible changed except where the links go. · commits `feat(sections): add generic block-based section page`, `refactor(ch1): move diphthongs and triphthongs to section files`

### R-025
**Browser-tab title showed the previous page's title**
- **Status:** 🟢 Resolved (please check)
- **Found in:** 3.6 (the page comparison also compares the tab title)
- **Where:** pages that don't set `document.title`: the chapter-1 sections, the chapter-3 index and sections (e.g. `/capitulo-3/numerales-ordinales` showed «Nombres Derivados | Portal Benga»)
- **Doubt:** The tab title kept whatever the previous page had set.
- **Suggestion:** Fall back to the section's sidebar title.
- **Resolution:** 2026-11-17 · `App.vue` sets «<sidebar title> | Portal Benga» on every route change (from `chapters-index.json`); pages that set their own title still win. Left as is: when a chapter-1 section is opened directly by URL, the chapter index page (`ChapterOneIndex.vue`) sets «Capítulo 1: Lecciones Preliminares» after it. · commit `refactor(router): generate routes from chapters index`

### R-026
**The sidebar covers the left edge of the content on medium screens**
- **Status:** 🟢 Resolved
- **Found in:** 3.2 (screenshots at 1280 px wide)
- **Where:** `src/App.vue` (`.app__main`: centred with `margin: 0 auto`) and `src/components/layout/AppSidebar.vue` (`position: fixed`, 280 px wide)
- **Doubt:** The content is centred in the whole window and doesn't leave room for the fixed sidebar, so between roughly 900 and 1500 px wide the sidebar hides the first ~130 px of every page (e.g. the start of the chapter-3 texts). Same before this phase (it dates from the first commit).
- **Suggestion:** Give `.app__main` a left margin equal to the sidebar width when the sidebar is fixed (desktop), or centre it in the remaining space. A one-file CSS fix; it changes how every page sits, so check it on a few widths.
- **Resolution:** 2026-11-20 · From 992 px the page body and footer leave the sidebar's 280 px free and centre the content in the remaining space; below 992 px the sidebar stays hidden behind the header's menu button (as before). · commit `fix(layout): keep the content clear of the fixed sidebar (R-026)`


### R-027
**Class 2 page shows «Conceptos Clave» twice**
- **Status:** 🟢 Resolved
- **Found in:** 3.4 (generating `sections/ch-2/class-2.json` from the old page)
- **Where:** `src/data/sections/ch-2/class-2.json` (two `heading` blocks with `id: concepts`, the same three cards) · `/capitulo-2/clase-2`
- **Doubt:** The same three concept cards appear before «Excepciones» and again after the class-6 exception. It was like this in the old `NounClass2.vue`; I kept it so the page stays identical.
- **Suggestion:** Delete the second «Conceptos Clave» heading and its `concepts` block (the one after `class-six`).
- **Resolution:** 2026-11-20 · Developer: delete it. The second «Conceptos Clave» (after the class-6 exception) is removed from `sections/ch-2/class-2.json`. · commit `fix(content): remove duplicated class-2 concepts; ūa and accents in chapter-3 intro (R-027, R-029)`


### R-028
**Alphabet page and chapter-3 pages are not section files yet**
- **Status:** ⚪ Won't do now
- **Found in:** 3.7
- **Where:** `src/views/chapter-1/AlphabetSection.vue` + `src/data/chapter-1/alphabet.json` · `src/views/chapter-3/RegularAdjectivesSection.vue`, `InvariableAdjectivesSection.vue`, `ComparativesSuperlativesSection.vue` (+ their `chapter-3/*.json`)
- **Doubt:** Task 3.7 asked for these pages as section files. Done: diphthongs, triphthongs, consonants (section files) and the two adjective pages now read the lexicon. Not done: the alphabet page has six designs used nowhere else (letter list, vowel tags, vowel cards with a «larga» badge, the special letter y with word groups, note cards); as section files they would need six single-use block types. The chapter-3 pages are in the same situation (inflection cards, concordance tables, comparison tables).
- **Suggestion:** Keep them as page components for now (they already take their words from the lexicon where it matters) and convert each one when its chapter is reviewed in Phase 6 (6.1 chapter 1, 6.3 chapter 3), so the new blocks are designed together with the new content. Alternatively I can convert them now, at the cost of ~10 new block components.
- **Resolution:** 2026-11-20 · Developer: fine as custom pages. Convert a part only if it turns out to be reusable as a component elsewhere.


### R-029
**Chapter-3 introduction: `ña` uses ñ, and small Spanish typos**
- **Status:** 🟢 Resolved
- **Found in:** 3.5 (moving the text to `sections/ch-3/adjectives-intro.json`)
- **Where:** `src/data/sections/ch-3/adjectives-intro.json` · `/capitulo-3/introduccion`
- **Doubt:** «Comparativos y Superlativos» says the Benga use «palabras específicas como 'kebaka' (sobresalir) y 'ña' (exceder)»: `ñ` is not a Benga letter (AGENTS.md → Orthography), so `ña` is probably an OCR reading of another word. Also «en este capitulo» (capítulo) and «se apoyaran» (apoyarán) in the overview paragraph.
- **Suggestion:** Check `ña` in the comparatives section of the book (PDF ~p. 19, now searchable in the IMPROVED PDF) and fix the two accents.
- **Resolution:** · 2026-11-20 · Developer: `ña` is really `ūa`. Fixed in `sections/ch-3/adjectives-intro.json` (with «capítulo», «apoyarán») and added as the first OCR correction (`p19-w156` in `docs/ocr/ocr-corrections.json`, PDF p. 19). · commits `fix(content): …(R-027, R-029)` and `feat(admin): …(R-023, R-029)`

### R-030
**Vite 8 is available (Vite 7 today)**
- **Status:** 🔴 Open
- **Found in:** R-018 (upgrading ESLint and vue-router)
- **Where:** `package.json` (`vite` ^7.3.8, `@vitejs/plugin-vue` 6) · `vite.config.mjs`
- **Doubt:** Vite 8 (new bundler, Rolldown) is the current major. R-018 only covered ESLint, vue-router and vue-i18n, so I didn't change the build tool in the same step.
- **Suggestion:** Upgrade in Phase 9 (or any time) on its own branch: `npm install -D vite@8`, then build, compare every page and check `npm run preview`.
- **Resolution:**

### R-031
**On phones some pages are wider than the screen (pattern box)**
- **Status:** 🔴 Open
- **Found in:** final check of the review-log fixes (420 px wide); already like this before (same in the baseline taken at the start)
- **Where:** `/capitulo-2/clase-2` and other noun classes · `src/components/blocks/PatternBox.vue` (`.pattern-box`: two big `pattern-value` boxes side by side, 1.8 rem monospace, `padding 2rem`)
- **Doubt:** At 420 px the page content needs ~452 px, so the phone browser zooms the whole page out a little and the right edge looks cut (header language menu, «ma-» box).
- **Suggestion:** In `PatternBox`, below 576 px stack the two boxes (arrow ↓) or reduce the font size and padding; then check every page at 375 px for anything else wider than the screen.
- **Resolution:**

---

## Template (copy for a new entry)

```markdown
### R-0XX
**Short title of the doubt**
- **Status:** 🔴 Open
- **Found in:** <task number>
- **Where:** <file:line · page URL · book page>
- **Doubt:** <what is unclear or looks wrong>
- **Suggestion:** <proposed fix, or "needs your decision">
- **Resolution:** <date · what was decided · commit>
```

When resolving: change the status in **both** the entry and the Summary table.
