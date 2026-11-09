# Review Log — doubts and things to check

Open questions that came up while working on roadmap tasks.
Go through them every few tasks, decide, and fill in **Resolution**.

**Status:** 🔴 Open · 🟡 In progress · 🟢 Resolved · ⚪ Won't fix / not needed

## Summary

| ID | Status | Found in | Topic | Decide by |
|----|--------|----------|-------|-----------|
| [R-001](#r-001) | 🔴 | 0.3 | Diphthong `ūa` listed twice (one is probably `ūâ`) | any time |
| [R-002](#r-002) | 🔴 | 0.1 | `context/AGENTS.md` is an old duplicate | any time |
| [R-003](#r-003) | 🔴 | 0.1 | Rest of AGENTS.md is out of date | task 1.4 |
| [R-004](#r-004) | 🔴 | Roadmap | Roadmap lives in git-ignored `context/` | any time |
| [R-005](#r-005) | 🔴 | 0.2 | Unused chapter-2 JSON files kept | task 2.4.3 |
| [R-006](#r-006) | 🔴 | 0.2 | `ExampleTable.vue` is not used by any page | task 3.3 |
| [R-007](#r-007) | 🔴 | Roadmap | Verb names in Phase 6 come from damaged OCR | Phase 6 |
| [R-008](#r-008) | 🔴 | Audit | Living Dictionary links may not open an entry | task 0.5 |
| [R-009](#r-009) | 🔴 | 0.2 | Browser-support data is out of date (build warning) | task 0.6 or Phase 1 |

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
- **Status:** 🔴 Open
- **Found in:** 0.1
- **Where:** `context/AGENTS.md` vs `AGENTS.md` (root)
- **Doubt:** The root file is now the real one and has newer edits. Two copies will drift apart.
- **Suggestion:** Delete `context/AGENTS.md`.
- **Resolution:**

### R-003
**Rest of AGENTS.md is out of date**
- **Status:** 🔴 Open
- **Found in:** 0.1
- **Where:** `AGENTS.md` → "Tech Stack", "3. Implementation Plan", "4. Key Implementation Files"
- **Doubt:** These sections describe the old week-by-week plan and a sample `package.json` that differs from the real one. An AI may follow them instead of the roadmap.
- **Suggestion:** In task 1.4, replace them with the real tech stack and a short pointer to the roadmap.
- **Resolution:**

### R-004
**The roadmap lives in git-ignored `context/`**
- **Status:** 🔴 Open
- **Found in:** Roadmap (after the files were moved)
- **Where:** `context/ROADMAP.md`, `context/WORKING-WITH-AI.md`
- **Doubt:** Git doesn't track these files, so there's no history or backup. The roadmap prompts also say `docs/ROADMAP.md`.
- **Suggestion:** Either move them back to `docs/` (tracked, so the checkboxes are saved), or keep them private and say "read context/ROADMAP.md" when starting a task.
- **Resolution:**

### R-005
**Unused chapter-2 JSON files kept**
- **Status:** 🔴 Open
- **Found in:** 0.2
- **Where:** `src/data/chapter-2/class-1.json … class-7.json`, `nouns-intro.json`, `irregular-nouns.json`, `verbal-nouns.json`
- **Doubt:** No page imports them. `class-N.json` has known wrong glosses. Do any of them hold text that isn't in the `.vue` pages, such as extra notes or examples?
- **Suggestion:** In task 2.4, compare them with the pages and keep anything useful, then delete them in 2.4.3.
- **Resolution:**

### R-006
**`ExampleTable.vue` is not used by any page**
- **Status:** 🔴 Open
- **Found in:** 0.2
- **Where:** `src/components/content/ExampleTable.vue`
- **Doubt:** It was kept as a future building block, but it might not fit the new blocks design.
- **Suggestion:** Decide in task 3.3: reuse it as the table block, or delete it.
- **Resolution:**

### R-007
**Verb names in Phase 6 come from damaged OCR**
- **Status:** 🔴 Open
- **Found in:** Roadmap (table of contents, PDF last pages)
- **Where:** ROADMAP Phase 6, rows 6.6 and 6.7: *kalaka, tandaka, yenika, vomuabidi, valaka, vaka, paka, yalaka*
- **Doubt:** The table of contents OCR reads e.g. `Tánddká`, `Yénik2`, `Vomualbidi`. The exact spelling and accents are unknown.
- **Suggestion:** Check each one against its chapter page when starting that Phase 6 task.
- **Resolution:**

### R-008
**Living Dictionary links may not open an entry**
- **Status:** 🔴 Open
- **Found in:** Audit
- **Where:** `getDictionaryUrl()` in chapter-2 views → `https://livingdictionaries.app/benga/entry/<word>`
- **Doubt:** Living Dictionaries usually identifies entries by an internal id, not by the word, so these links may lead to a "not found" page.
- **Suggestion:** Test a few links in task 0.5. If they fail, link to the dictionary's search instead, or hide the icon.
- **Resolution:**

### R-009
**Browser-support data is out of date**
- **Status:** 🔴 Open
- **Found in:** 0.2 (lint/build output: "caniuse-lite is 7 months old")
- **Where:** `package-lock.json`
- **Doubt:** Harmless warning; it only affects which old browsers the build targets.
- **Suggestion:** Run `npx update-browserslist-db@latest` in its own commit (`chore: update browserslist database`), or let Phase 1 handle it.
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
