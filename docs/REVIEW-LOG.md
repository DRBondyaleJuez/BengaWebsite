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
| [R-030](#r-030) | 🟢 | R-018 | Vite 8 is available (Vite 7 today) | Phase 9 |
| [R-031](#r-031) | 🟢 | review fixes | On phones some pages are wider than the screen (pattern box) | any time |
| [R-032](#r-032) | 🟢 | 4.1 | Chapter-1 index: long vowels written «á, é y ü» | any time |
| [R-033](#r-033) | 🟢 | 4.1 | Chapter-1 index: outdated or odd wording | any time |
| [R-034](#r-034) | 🟡 | 4.1 | Numerals and comparatives: Benga words with Spanish accents / OCR errors | 6.0a |
| [R-035](#r-035) | 🔴 | 4.4 | English and French translations are an AI draft | review |
| [R-036](#r-036) | 🟢 | L0.1 | Living Dictionary is private: site links do not open for visitors | L9.4 |
| [R-037](#r-037) | 🟡 | L0.1 | Book lexicon vs Living Dictionary: link and compare, never overwrite | L1.3 |
| [R-038](#r-038) | 🟡 | L0.1 | Noun class written in many formats in the dictionary | L7.8 |
| [R-039](#r-039) | 🟢 | L0.1 | Speakers: duplicate «Utati Bondjale/Bondyale Oko» and «test» | L0.4 |
| [R-040](#r-040) | 🟡 | L0.1 | Duplicated or misplaced senses in current entries (Tombo, Sânâ…) | L7.8 |
| [R-041](#r-041) | 🟢 | L0.1 | Send Claude review flags to the LD review queue? | L4.7 |
| [R-042](#r-042) | 🟡 | L0.1 | Which recording plays when a word has several | L6.1 |
| [R-043](#r-043) | 🟢 | L0.1 | Cloudinary file exists: keep or replace with the dictionary recording | L6.1 |
| [R-044](#r-044) | 🟢 | L0.1 | Sync logs in git or local only | L5.4 |
| [R-045](#r-045) | 🟢 | L0.1 | How to mark book words sent to the dictionary | L7.4 |
| [R-046](#r-046) | ⚪ | L0.1 | Phonetic transcription conventions (/ /, [ ], tone) | L8.1 |
| [R-047](#r-047) | 🟢 | L0.1 | Browser WebM recordings and the dictionary | L6.2 |
| [R-048](#r-048) | 🔴 | L5.3 | Raise the 10-records-per-push limit for the big sync | big sync |
| [R-049](#r-049) | 🔴 | L5.3 | 13 entries still have the old noun-class wording in LD | big sync |
| [R-050](#r-050) | 🔴 | L5.3 | Hanga: the plural was renamed too | big sync |
| [R-051](#r-051) | 🔴 | L5.3 | What the API cannot remove (tags, dialects, citations, sentence links) | big sync |
| [R-052](#r-052) | 🔴 | L5.3 | LD's import-audit script is not available to us | big sync |

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
- **Resolution:** 2026-11-20 · Developer will review the words later. Built the tool for it: `/admin/ocr` (only during `npm run serve`): filters, a correction field with `â ē ū Â Ē Ū` buttons, a comment field, and the PDF page shown beside the list with the word framed (click its page number). Corrections are saved in `docs/ocr/ocr-corrections.json` and applied to the improved PDF with `python scripts/ocr-pdf.py --reuse` (docs/OCR.md). First correction: R-029. · commit `feat(admin): /admin/ocr to review the OCR doubts beside the PDF page (R-023, R-029)` · 2026-11-20 · Added «No es una palabra» (discard): the word leaves the text layer and the doubts list. · commit `feat(admin): mark OCR doubts as «not a word» in /admin/ocr`


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
- **Status:** 🟢 Resolved
- **Found in:** R-018 (upgrading ESLint and vue-router)
- **Where:** `package.json` (`vite` ^7.3.8, `@vitejs/plugin-vue` 6) · `vite.config.mjs`
- **Doubt:** Vite 8 (new bundler, Rolldown) is the current major. R-018 only covered ESLint, vue-router and vue-i18n, so I didn't change the build tool in the same step.
- **Suggestion:** Upgrade in Phase 9 (or any time) on its own branch: `npm install -D vite@8`, then build, compare every page and check `npm run preview`.
- **Resolution:** 2026-11-26 · Upgraded to Vite 8.3.8 (@vitejs/plugin-vue 6 already supports it); package.json now has "type": "module", which also removed the config-loader and Node module-type warnings. Build, tests, lint, validate and dev server checked. · commit `build: upgrade to vite 8`

### R-031
**On phones some pages are wider than the screen (pattern box)**
- **Status:** 🟢 Resolved
- **Found in:** final check of the review-log fixes (420 px wide); already like this before (same in the baseline taken at the start)
- **Where:** `/capitulo-2/clase-2` and other noun classes · `src/components/blocks/PatternBox.vue` (`.pattern-box`: two big `pattern-value` boxes side by side, 1.8 rem monospace, `padding 2rem`)
- **Doubt:** At 420 px the page content needs ~452 px, so the phone browser zooms the whole page out a little and the right edge looks cut (header language menu, «ma-» box).
- **Suggestion:** In `PatternBox`, below 576 px stack the two boxes (arrow ↓) or reduce the font size and padding; then check every page at 375 px for anything else wider than the screen.
- **Resolution:** 2026-11-26 · Root cause: no global box-sizing, so wrappers with width 100% + padding were wider than the screen. Added `box-sizing: border-box` globally; below 992 px (menu folded into the header button) the main area and the page wrappers use less side padding (`--page-gutter`); the pattern box stacks singular above plural on phones. Checked all 26 pages at 900 and 375 px: no horizontal overflow. · commit `fix(responsive): keep pages within narrow screens and centre them`

---

### R-032
**Chapter-1 index: the long vowels are written «á, é y ü»**
- **Status:** 🟢 Resolved
- **Found in:** 4.1 (moving the chapter-1 texts into `es.json`)
- **Where:** `src/locales/es.json` → `pages.chapter1Index.soloVocalesEU` (shown at `/capitulo-1`, «Vocales» card)
- **Doubt:** The text says «Solo las vocales á, é y ü son "largas" (marca da con acento)». The site's vowel inventory is `a, â, e, ē, i, o, u, ū`, so the letters should be `â, ē, ū`; «marca da» is a typo for «marcadas». The English and French translations copy the same letters.
- **Suggestion:** Change it to «Solo las vocales â, ē y ū …» (and check that the «largas» explanation matches the book), then update `en.json` / `fr.json` too.
- **Resolution:** 2026-11-26 · Developer confirmed: «Solo las vocales â, ē y ū son "largas" (marcadas con acento)», es/en/fr. · commit `fix(ch1): correct the long vowels and outdated texts of the chapter-1 index`

---

### R-033
**Chapter-1 index: outdated or odd wording**
- **Status:** 🟢 Resolved
- **Found in:** 4.1 / 4.4
- **Where:** `src/locales/es.json` → `pages.chapter1Index.capitulo2Proximamente` («Capítulo 2 Próximamente», but chapter 2 exists), `…conectaPatronesBuscaSimilitudes` («una mental map»: English words in the Spanish text), `…letraFuncionaTantoComo` («patrones silábicos y de estrés»: in Spanish «acento» is the usual word)
- **Doubt:** These texts were in the page before Phase 4; they were moved and translated as they are.
- **Suggestion:** «Siguiente: Capítulo 2» with a link, «un mapa mental», «patrones silábicos y de acento». Change es, en and fr together.
- **Resolution:** 2026-11-26 · Applied: «Siguiente: Capítulo 2» is now a link to /capitulo-2 (key `siguienteCapitulo2`), «un mapa mental», «patrones silábicos y de acento». · same commit as R-032

---

### R-034
**Numerals and comparatives: Benga words with Spanish accents or OCR errors**
- **Status:** 🟡 In progress
- **Found in:** 4.1 (chapter-3 data files moved to `{ es }` texts)
- **Where:** `src/data/chapter-3/numerals-ordinals.json` (e.g. `Páka`), `src/data/chapter-3/comparatives-superlatives.json` (`ña`, which uses a letter Benga does not have)
- **Doubt:** These Benga forms come from the old OCR (`á` instead of `â`, `ñ`) and are not shown with `BengaWord`. The translations keep them unchanged, as Benga words are never translated.
- **Suggestion:** Fix them against the scan when the numerals are reworked (roadmap task 6.0a); the en/fr texts that quote them must be changed at the same time (`npm run i18n:report` does not see such changes, search for the word).
- **Resolution:** 2026-11-26 · Developer: «Páka» is «Pâkâ» and «ña» is probably «ūa». Fixed everywhere (numerals data incl. compounds and the en/fr texts quoting them, comparatives data and page). Other old-OCR forms of these two pages (e.g. «tékae», «Vepúlas») stay for task 6.0a, which redoes the numerals page from the improved OCR. · commit `fix(ch3): spell Pâkâ and ūa in the numeral and comparative pages`

---

### R-035
**English and French translations are an AI draft**
- **Status:** 🔴 Open
- **Found in:** 4.4 / 4.5
- **Where:** `src/locales/en.json`, `src/locales/fr.json`, the `en` / `fr` fields of every data file; status table in `docs/TRANSLATIONS.md`
- **Doubt:** All English and French texts were translated by AI from the Spanish (one translation per unique Spanish text, so the same phrase is translated the same way everywhere). No human has checked them yet. Old Spanish glosses of the book (19th century) may have been misunderstood; the doubtful ones are in `docs/translations/doubts.json` and are highlighted in `/admin/translations`.
- **Suggestion:** A fluent speaker reviews the texts in `/admin/translations` (edit, tick «Resuelta» on resolved doubts, save) and ticks each part in the status table of `docs/TRANSLATIONS.md`. Start with the interface (`locales`) and the noun glosses (`lexicon/nouns.json`).
- **Resolution:** 2026-11-26 · Postponed by the developer. Remind them, together with the other pending checks (OCR doubts, R-040, R-042), before Phase 6 and when they ask what is left.

---

### R-036
**The Benga Living Dictionary is private, so the site's dictionary links don't open for visitors**
- **Status:** 🟢 Resolved
- **Found in:** L0.1 (read-only check of the dictionary, 2026-11-25)
- **Where:** `GET /api/v1/dictionaries/benga` → `"public": false` · `src/config/external.js` (`LIVING_DICTIONARY_ENTRY`) · every «Ver en Living Dictionary» link of `BengaWord`
- **Doubt:** A private dictionary can only be read by its editors. Visitors who click a dictionary link on the website probably get a sign-in or "private" page. The API cannot change this setting (`public` is not writable on purpose); a manager does it on the dictionary's settings, possibly with the Living Dictionaries team.
- **Suggestion:** Needs your decision: make the dictionary public when you feel its content is ready (then roadmap L9.4), or hide the dictionary links on the public site until then. Check the link while signed out to confirm.
- **Resolution:** 2026-11-26 · Developer checked in a private window: the exact entry link opens the word page even though the dictionary is private. Links stay. The dictionary will be made public when it is more complete. Nothing to change now.

---

### R-037
**Two records of Benga words: the book lexicon and the Living Dictionary**
- **Status:** 🟡 In progress
- **Found in:** L0.1
- **Where:** `src/data/lexicon/nouns.json`, `adjectives.json` (book, Salvado y Cos 1891) · `src/data/dictionary/*.json` (planned, copy of the Living Dictionary) · e.g. LD `Hāngā` vs book `Hângâ`
- **Doubt:** The same word can have a different spelling or meaning in the book (1891) and in the community's dictionary. If one automatically overwrote the other, the site would either stop showing the book faithfully or the dictionary would get old spellings.
- **Suggestion:** Keep both, linked word by word through the word registry. Differences are shown side by side (form card «En la web», report of L1.3) and only change when you decide. The dictionary's spelling is the one used for audio of dictionary words; the book pages keep the book's spelling.
- **Resolution:** 2026-11-26 · Policy agreed (link and compare, never overwrite). Developer: the flag is «Hanga» without accents; the book's «Hângâ» is probably another word. Done locally: the dictionary entry «Hāngā» is renamed «Hanga» in the workspace (sent only after review in the push of L5.3), the registry no longer links the book's «Hângâ» to it (note added), and the sentence «Hāngā ya mboka…» has a local review question. Open: what «Hângâ» means in the book. · commit `feat(dictionary): normalise noun classes and add local review notes`

---

### R-038
**Noun class is written in many different ways in the dictionary**
- **Status:** 🟡 In progress
- **Found in:** L0.1
- **Where:** Living Dictionary field «Clase de sustantivos»: `1ª Clase`, `1a clase`, `1era Clase`, `2e Classe`, `7a clase, 7e classe`, `3a`, `5a Classe Nominal`, `7e,`, `7e classe ( Anuncia a la vez el singular y el plural)`, and for the adjective `Ndiba` the whole paradigm `1ª: Endiba, 2ª: Jandiba, …`
- **Doubt:** Filters and the website can't use the class reliably. The API guide says the manager's house style must be respected, so changing it is your decision.
- **Suggestion:** One format, just the number `1`–`7` (the form shows «1ª clase» and the help text). Notes like «anuncia a la vez el singular y el plural» move to the entry's notes; the adjective paradigm moves to notes or to the plural/variant fields. Applied in L7.8 after you approve the list.
- **Resolution:** 2026-11-26 · Agreed: noun class = just the number. Applied locally to every noun (extra text moved to the notes); sent after review in L5.3. Open: «Ndiba» may be only the noun «profundidad»; how adjectives go into the dictionary (variable adjectives change with the noun class, invariable ones with singular/plural or not at all) needs a separate discussion before L7.4. Ndiba has a local review question. · same commit as R-037

---

### R-039
**Speakers: a possible duplicate and a test speaker**
- **Status:** 🟢 Resolved
- **Found in:** L0.1
- **Where:** `GET /api/v1/dictionaries/benga/speakers`: «Utati Bondjale Oko» (3 recordings) and «Utati Bondyale Oko» (0), same decade and birthplace; «test» (0 recordings)
- **Doubt:** They look like the same person written two ways (dj/dy), and a leftover test record. Speakers appear on the dictionary's public contributors page.
- **Suggestion:** Confirm the right spelling; then merge the duplicate into it (`POST …/speakers/{id}/merge`) and delete «test» (only possible because it has no recordings). Default speaker for new audio: Upango Bondyale Oko (your instruction, 2026-11-25).
- **Resolution:** 2026-11-26 · Corrected by the developer in the dictionary (speakers now: Upango Bondyale Oko, Utati Bondjale Oko, Uyombo Makendengue Evita); workspace pulled again.

---

### R-040
**Current dictionary entries that look duplicated or misplaced**
- **Status:** 🟡 In progress
- **Found in:** L0.1
- **Where:** Living Dictionary entries `Tombo` (senses: Inyección; Aguja; Aguja again; one empty sense), `Sânâ` (Domingo) and `sânâ` (Semana) as two entries, `Akeva` (Gracias) as noun class 7 «sustantivo», `Ijoka` (Jugar, verbo) with a noun-class note, `Mbolo` (Hola) with plural `Mbolouani`
- **Doubt:** Some may be deliberate (separate recordings, different speakers), others mistakes. The guide warns not to merge by rule.
- **Suggestion:** Go through this list in the admin (L7.8) and decide each one: delete the empty and repeated sense of `Tombo`; decide whether `Sânâ`/`sânâ` are one word with two meanings or two words (homograph numbers); check `Akeva`'s part of speech (interjection?).
- **Resolution:** 2026-11-26 · Developer will organise them: Tombo and Sânâ look like one word with two senses each; Akeva may need two senses (noun and interjection). Local review notes added to those entries (filter «Necesita revisión» in the admin). · same commit as R-037

---

### R-041
**Should Claude's review flags also go to the dictionary's review queue?**
- **Status:** 🟢 Resolved
- **Found in:** L0.1
- **Where:** entry field `review` (Living Dictionaries «Needs review» queue) · planned local flag «Necesita revisión»
- **Doubt:** The LD queue is visible only to editors on their website but is included in the public snapshot file. Mirroring every doubt there helps other editors; keeping them local keeps the dictionary clean.
- **Suggestion:** Keep all flags locally; send to LD only the ones you mark «enviar a LD» (questions an editor on their website could answer). Notes always written as plain questions with no personal data.
- **Resolution:** 2026-11-26 · Review flags stay local (`sendToLd: false` by default).

---

### R-042
**Which recording plays on the website when a word has several?**
- **Status:** 🟡 In progress
- **Found in:** L0.1
- **Where:** 13 entries have 2–4 recordings (e.g. `Oba` 4, `Tombo` 4, `Ndabo` 3), often one per meaning or per speaker
- **Doubt:** The website's audio key is one file per word (`toAudioId`), so only one can be the main one.
- **Suggestion:** Main = recording by Upango Bondyale Oko if there is one, else the oldest; the others are copied as alternates (`<key>~2`) for a future "otra voz" button. Homographs with different meanings may need their own keys.
- **Resolution:** 2026-11-26 · Cause: before sentences existed in the dictionary, example audio was attached to the entry. Target: one audio for the word, maybe one for the plural, and each sentence with its own audio. Local review notes on the 13 words with several recordings; the developer will reorganise them. Until then L6.1 copies only words with one recording, or the one the developer marks.

---

### R-043
**Cloudinary file already exists: keep it or replace it with the dictionary's recording?**
- **Status:** 🟢 Resolved
- **Found in:** L0.1
- **Where:** Cloudinary folders `benga-words` / `benga-sentences`; recordings made in `/admin/audios` vs copies from the dictionary (L6.1)
- **Doubt:** A word could get one recording made on the site and another in the dictionary.
- **Suggestion:** Never replace automatically: the copy run lists these words and you choose per word. In future, record in the dictionary flow (forms / «Grabar») so there is one origin.
- **Resolution:** 2026-11-26 · Recordings are made only in Living Dictionaries or in the bridge, never for a word that already has audio in LD. Cloudinary is a copy: when an LD recording changes (new audio id or file), L6.1 replaces the same Cloudinary file. Roadmap L6.1 updated.

---

### R-044
**Sync logs: keep them in git or only on this computer?**
- **Status:** 🟢 Resolved
- **Found in:** L0.1
- **Where:** planned `ld-sync/runs/*.json`
- **Doubt:** In git they are a permanent history but add many files; local-only is lighter but is lost if the folder is deleted.
- **Suggestion:** Local (git-ignored), keeping the last 200 runs; the workspace files themselves are in git, so content history is never lost.
- **Resolution:** 2026-11-26 · No logs in git: ld-sync/ (sync logs, reports), ld-import/, *.log and logs/ are git-ignored. Logs are read at the moment of the sync.

---

### R-045
**How to mark the book's words when they go into the dictionary**
- **Status:** 🟢 Resolved
- **Found in:** L0.1 (task L7.4)
- **Where:** ~460 words of `nouns.json` / `adjectives.json` not in the Living Dictionary
- **Doubt:** They come from an 1891 grammar written by a Spanish missionary: some spellings or meanings may be old or not used today. Visitors of the dictionary should know where a word comes from.
- **Suggestion:** Citation `salvado-y-cos-1891` + page on every entry (shown in «Fuentes»), plus a tag «Salvado y Cos 1891» so they can be filtered. Words a speaker confirms lose the tag or get a note. Send in batches of ~50 you approve.
- **Resolution:** 2026-11-26 · Agreed (citation + tag «Salvado y Cos 1891»). Source created on the dictionary: slug `salvado-y-cos-1891`, type grammar. · commit `feat(ld): register the book as a source on the dictionary`

---

### R-046
**Phonetic transcription conventions**
- **Status:** ⚪ Not needed now
- **Found in:** L0.1 (phase L8)
- **Where:** entry field «Fonético» (`phonetic`)
- **Doubt:** Write phonemic `/…/` or phonetic `[…]`? Mark tone (Benga is a tonal Bantu language) and with which symbols (á à or ˥ ˩)? Who validates the rules?
- **Suggestion:** Start phonemic `/…/` without tone from the spelling rules (L8.1), add tone only after the experiment (L8.4) and a check with a linguist or a fluent speaker who knows the tones.
- **Resolution:** 2026-11-26 · Postponed to phase L8: decided when the phonetics program exists. The phonetic field is optional.

---

### R-047
**Browser recordings are WebM: does the dictionary accept them?**
- **Status:** 🟢 Resolved
- **Found in:** L0.1 (task L6.2)
- **Where:** recorder of `/admin/audios` (WebM/Opus) · `POST …/entries/{id}/audio` (format list not documented; existing files are WAV)
- **Doubt:** If WebM is refused or doesn't play in every browser, recordings need converting first.
- **Suggestion:** Test with one recording on a test entry; if needed convert to WAV in the browser (no extra software) before sending.
- **Resolution:** 2026-11-26 · Existing dictionary audio is WAV, so browser recordings (WebM) are converted to WAV in the browser before sending (task L6.2).

---

### R-048
**Raise the 10-records-per-push limit for the big sync**
- **Status:** 🔴 Open
- **Found in:** L5.3
- **Where:** `src/config/ld.js` → `LD_LIMITS.recordsPerPush`
- **Doubt:** You asked to send at most 10 words while the bridge is tried out, so every «Enviar cambios» stops at 10 records (the rest wait for the next run). For the big sync that means many runs.
- **Suggestion:** When translations, OCR and word doubts are ready, raise it to 200 (one batch; the client still pauses between requests) and do one preview first.
- **Resolution:**

---

### R-049
**13 entries still have the old noun-class wording in LD**
- **Status:** 🔴 Open
- **Found in:** L5.3 (live test, 2026-11-27)
- **Where:** `/admin/living-dictionary/sincronizacion` → «Ver qué se enviaría»: Akeva, Mbolo, Mbute, Monda, Mūana, Na, Ndabo, Ndiba, Ndoba, Paia, sânâ, Tombo (2 entries)
- **Doubt:** The live test sent 10 entries (Beja, Dina, Dyango, Eko, Ele, Enâ, Epape, Hanga, Ijoka, Majoka), all verified by reading them back. The other 13 still have the reduced noun class only locally. Akeva, Tombo and sânâ also have open questions (R-040).
- **Suggestion:** Send them with the big sync, after R-040 is decided.
- **Resolution:**

---

### R-050
**Hanga: the plural was renamed too**
- **Status:** 🔴 Open
- **Found in:** L5.3 (live test)
- **Where:** entry Hanga (flag) in LD: `plural_form` `Hāngā → Hanga`, same as the headword (R-037)
- **Doubt:** Following R-037 ("the flag is Hanga") the plural form was renamed together with the headword. Class 7 words keep the same form in the plural, so this looks right, but it was not asked explicitly.
- **Suggestion:** Confirm, or say the plural form to use; it is a one-field change in the form.
- **Resolution:**

---

### R-051
**What the API cannot remove (tags, dialects, citations, sentence links)**
- **Status:** 🔴 Open
- **Found in:** L5.3
- **Where:** `scripts/lib/ld/push.mjs` (`ADDITIVE` fields)
- **Doubt:** A Living Dictionaries PATCH only adds tags, dialects, citations and example-sentence links; it never removes them. If you remove one in the admin, the push shows a warning («solo se puede en la web de LD») and the entry stays "con cambios" until it is removed there by hand. There are DELETE routes for tags and dialects (by their LD id) that the bridge does not use yet.
- **Suggestion:** Remove them on the LD website for now; if it happens often, add the tag/dialect unlink routes (needs their ids from the snapshot).
- **Resolution:**

---

### R-052
**LD's import-audit script is not available to us**
- **Status:** 🔴 Open
- **Found in:** L5.3 (reading LD's importing guide)
- **Where:** https://livingdictionaries.app/api/v1/guides/importing (steps 1.3 and 2.1)
- **Doubt:** The guide asks big imports to run `scripts/import-audit/audit.py` from LD's own tooling before the first write. That tool is not in the public API. Our own checks (`npm run validate`, the push preview, per-item results, read-back verification) cover the same points for small batches.
- **Suggestion:** Before the big sync, ask the LD team through their feedback form whether the audit is expected for an editor pushing edits (not a file import), and where to get it.
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
