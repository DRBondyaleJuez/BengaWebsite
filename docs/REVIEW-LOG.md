# Review Log — doubts and things to check

Open questions that came up while working on roadmap tasks.
Go through them every few tasks, decide, and fill in **Resolution**.

**Status:** 🔴 Open · 🟡 In progress · 🟢 Resolved · ⚪ Won't fix / not needed

## Summary

| ID | Status | Found in | Topic | Decide by |
|----|--------|----------|-------|-----------|
| [R-001](#r-001) | 🔴 | 0.3 | Diphthong `ūa` listed twice (one is probably `ūâ`) | any time |
| [R-002](#r-002) | 🟢 | 0.1 | `context/AGENTS.md` is an old duplicate | any time |
| [R-003](#r-003) | 🟢 | 0.1 | Rest of AGENTS.md is out of date | done |
| [R-004](#r-004) | 🟢 | Roadmap | Roadmap lives in git-ignored `context/` | any time |
| [R-005](#r-005) | 🔴 | 0.2 | Unused chapter-2 JSON files kept | Phase 4 (i18n) |
| [R-006](#r-006) | 🟢 | 0.2 | `ExampleTable.vue` is not used by any page | done |
| [R-007](#r-007) | 🔴 | Roadmap | Verb names in Phase 6 come from damaged OCR | Phase 6 (verbs) |
| [R-008](#r-008) | 🟢 | Audit | Living Dictionary links may not open an entry | task 0.5 |
| [R-009](#r-009) | 🟢 | 0.2 | Browser-support data is out of date (build warning) | done |
| [R-010](#r-010) | 🟢 | 0.4 | PDF link written by hand in 4 files, and breaks if the site is hosted in a sub-folder | task 0.5 |
| [R-011](#r-011) | 🔴 | 0.5 | No audio file is found on Cloudinary — every play button fails | Phase 5 (or sooner) |
| [R-012](#r-012) | 🔴 | 0.5 | `VerbalNouns.vue` builds audio ids with its own function | task 2.2 |

---

## Entries

### R-001
**Diphthong `ūa` listed twice — the second one is probably `ūâ`**
- **Status:** 🔴 Open
- **Found in:** 0.3 (browser console: `Duplicate keys detected: 'ūa'`)
- **Where:** `src/data/chapter-1/diphthongs.json` lines 73 and 103 · page `/capitulo-1/diptongos` · book p. 10 (PDF p. 10), "Los simples son…"
- **Doubt:** The book lists two different diphthongs: `úa` ("como púas", *múana*) and `úá` ("ua en guano", *úáúá* = aprisa). The JSON wrote both as `ūa`.
- **Suggestion:** Following the accent rule `á → â`, change the second entry to `ūâ` and its example to `ūâūâ` with audioId `_u_a_u_a_`. Check the scan by eye first.
- **Resolution:** _(date · what was decided · commit)_

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
- **Status:** 🔴 Open
- **Found in:** 0.2
- **Where:** `src/data/chapter-2/class-1.json … class-7.json`, `nouns-intro.json`, `irregular-nouns.json`, `verbal-nouns.json`
- **Doubt:** No page imports them. `class-N.json` has known wrong glosses, and `class-1.json` is not even valid JSON (missing `,` after line 131; found in 0.6, so it's listed in `.prettierignore` until deleted). Do any of them hold text that isn't in the `.vue` pages, such as extra notes or examples?
- **Suggestion:** In task 2.4, compare them with the pages and keep anything useful, then delete them in 2.4.3.
- **Resolution:** 2026-11-11 · Developer: keep them for now; clean them up when the site becomes multilingual (Phase 4), since they contain `es/en/fr` text that may help. Still open.

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
- **Status:** 🔴 Open
- **Found in:** Roadmap (table of contents, PDF last pages)
- **Where:** ROADMAP Phase 6, rows 6.6 and 6.7: *kalaka, tandaka, yenika, vomuabidi, valaka, vaka, paka, yalaka*
- **Doubt:** The table of contents OCR reads e.g. `Tánddká`, `Yénik2`, `Vomualbidi`. The exact spelling and accents are unknown.
- **Suggestion:** Check each one against its chapter page when starting that Phase 6 task.
- **Resolution:** 2026-11-11 · Developer hasn't reviewed the verbs chapters yet; check the spellings together when Phase 6 reaches chapters 5–8. Still open.

### R-008
**Living Dictionary links may not open an entry**
- **Status:** 🟢 Resolved
- **Found in:** Audit
- **Where:** `getDictionaryUrl()` in chapter-2 views → `https://livingdictionaries.app/benga/entry/<word>`
- **Doubt:** Living Dictionaries usually identifies entries by an internal id, not by the word, so these links may lead to a "not found" page.
- **Suggestion:** Test a few links in task 0.5. If they fail, link to the dictionary's search instead, or hide the icon.
- **Resolution:** 2026-11-09 · Confirmed: `/benga/entry/epokolo` shows "This entry doesn't exist" (404). All word links now open the dictionary's search with the word typed in (`/benga/entries?q={"query":"epokolo"}`), built by `getDictionaryUrl()` in `src/utils/dictionaryUrl.js`. Note: the online Benga dictionary has very few entries so far, so most searches show "No matching entries" — but no more 404s. · commit `refactor(config): centralise external URLs`

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
- **Status:** 🔴 Open
- **Found in:** 0.5 (clicking the first play button on `/capitulo-2/clase-1`)
- **Where:** `CLOUDINARY_BASE` in `src/config/external.js` · Cloudinary account `dp5rofjyx`
- **Doubt:** `…/video/upload/v1780354084/ejanganangobo.mp3` returns 404. So do `epokolo`, `en_a_`, `ek_a_i`, `bobe`, `a`, with or without the `v1780354084` version and with or without a `benga-audio/` folder. Either no recordings are uploaded yet, or they are stored under other names, folders or resource types. This was already the case before task 0.5 (same URL).
- **Suggestion:** Open the Cloudinary Media Library and check one uploaded file's real URL (folder, `video` vs `raw`, file name). Then either fix `CLOUDINARY_BASE` (one line now) or plan uploads in Phase 5. Until then the site shows buttons that don't play; task 3.1 (audio manifest) will hide them for missing files.
- **Resolution:**

### R-012
**`VerbalNouns.vue` builds audio ids with its own function**
- **Status:** 🔴 Open
- **Found in:** 0.5
- **Where:** `makeAudioId()` in `src/views/chapter-2/VerbalNouns.vue` (methods)
- **Doubt:** It's a second, private copy of the audio-id rule. It may differ from the AGENTS.md rule (e.g. adjacent accented vowels, multi-word forms).
- **Suggestion:** In task 2.2, replace it with the shared `toAudioId()` and compare the ids it produced for every verbal noun.
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
