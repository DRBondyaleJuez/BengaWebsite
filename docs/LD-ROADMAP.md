# Living Dictionary Bridge — Roadmap

> A second track next to [ROADMAP.md](ROADMAP.md) (the book). It builds a control centre at
> `/admin/living-dictionary` for the Benga dictionary on
> [livingdictionaries.app/benga](https://livingdictionaries.app/benga). From there you can see,
> add, correct, record and sync words and sentences, Claude can help fill them in, and the
> website uses the same words and audio.
>
> Phases are called **L0 … L9** so they never get confused with the book's phases 0–10. How to
> use it is the same as for ROADMAP.md: work top to bottom, paste the **Prompt** to start a
> task, use the **Commit** name when it's done, tick the box. Doubts go into
> [REVIEW-LOG.md](REVIEW-LOG.md) (R-036 to R-047 come from this plan).
>
> Written 2026-11-25 after reading the Living Dictionaries API guides and making a read-only
> check of the dictionary (details in section 2).

---

## 1. What we are building (the picture)

```
                 ┌────────────────────────── /admin/living-dictionary (dev only) ──────────────────────────┐
                 │  Panel   Entradas (table)   Oraciones (table)   Ficha (form)   Sincronización   Grabar  │
                 └───────────────┬───────────────────────────────────────────────┬─────────────────────────┘
                                 │ /__dev/ld/* (Vite dev server, loopback only,   │
                                 │  holds the LD key and Cloudinary keys)         │
          ┌──────────────────────▼───────────────────────┐                       │
          │ src/data/dictionary/  ← THE WORKSPACE (git)  │                       │
          │   entries.json   sentences.json              │   Claude sessions     │
          │   base.json (last state read from LD)        │◄── write suggestions ─┤ (translations, POS,
          │   review flags, Claude suggestions, links    │    (never final)      │  domains, relations…)
          └───────┬──────────────────────┬───────────────┘                       │
        pull ▲    │ push (only changes)  │ links                                 │
 snapshot    │    ▼                      ▼                                       │
 (1 request) │  livingdictionaries   src/data/lexicon/word-registry.json ◄── site pages (BengaWord)
             │  API (key, throttled)     livingDictionaryId · audio · audioFile
             │        │                          ▲
             │        │ audio (public media URL) │ marks "recorded"
             │        ▼                          │
             └──── Cloudinary (benga-words / benga-sentences, mp3 delivery) ──► the website plays it
```

Principles:

1. **One workspace, two mirrors.** Everything you edit lands in `src/data/dictionary/*.json`
   (in git, so every change has history and can be undone). Living Dictionaries and the website
   are both fed from it. The website's book lexicon (`nouns.json`, `adjectives.json`) stays the
   record of *the book*. The workspace is the record of *the living dictionary*. They are
   **linked word by word, compared and never overwritten automatically** (R-037).
2. **Manual syncs only.** Nothing contacts Living Dictionaries or Cloudinary unless you press a
   button (or run a command). There is no polling and there are no schedules.
3. **Only changes travel.** A push sends only the fields you changed since the last pull. A pull
   brings only what changed in the dictionary. Both directions are shown as a preview first.
4. **Claude suggests, a human decides.** Claude's work arrives as *suggestions* with a reason.
   Any doubt is a **"Necesita revisión"** flag with a plain-language note. Nothing invented
   ever reaches the dictionary as fact (section 3).
5. **The keys never leave your computer.** The admin only runs with `npm run serve`. The
   browser talks to local `/__dev/ld/*` endpoints, which hold the keys from `.env.local`.

## 2. What the API and the dictionary look like today (checked 2026-11-25)

### The API can do everything we need

| Need | API (`https://livingdictionaries.app/api/v1`) |
|---|---|
| Read everything at once | Public **SQLite snapshot** `snapshots.livingdictionaries.app/dictionaries/benga.db.gz` (80 KB today, no key, rebuilt ≤ 30 min after an edit). The guides say to use this instead of paging the API. |
| Read recent changes | `GET …/entries?updated_since=<ISO>` · single entry `GET …/entries/{id}` |
| Create words | `POST …/entries` (≤ 1000 per request, our own uuid5 ids → re-sending never duplicates) |
| Change words | `PATCH …/entries/{id}` (field merge) · `POST …/entries/batch-update` (≤ 1000, retry-safe) |
| Senses / sentences | inside the entry · `PATCH/DELETE …/sentences/{id}` · `DELETE …/senses/{id}` |
| Review queue | `review: { category, note }` on an entry, editor-only ("Needs review" filter in their site); `null` clears it |
| Machine-translation mark | sentence translations carry `translation_meta` = `machine` / `reviewed` / `published` |
| Audio | `POST …/entries/{id}/audio`, `…/sentences/{id}/audio` (file or `{url}`; ≤ 25 MB; speaker **or** source required) |
| Photos | `POST …/senses/{id}/photos` (≤ 10 MB) |
| Relations | `POST …/relationships`: `synonym, antonym, see_also, spelling_variant, dialectal_variant, homophone, hypernym/hyponym, holonym/meronym, derived_from/root_of, borrowed_from/loaned_to, cognate` + custom types |
| Fields of an entry | lexeme, homograph, **phonetic**, interlinearization, morphology, notes, linguistic_history, **scientific_names**, tone_class, dialects, tags, citations (source + page), places, etymologies |
| Fields of a sense | glosses (es/en/fr), definition, **parts_of_speech** (the 90 codes of your list), **semantic_domains** (your list), write-in domains, **noun_class**, plural_form, variant, example sentences, photos |
| Undo a batch | every push has an `import_id` → `POST …/entries/batch-delete` (dry run + confirm) |
| Talk to the LD team | `POST …/feedback` |

The guides publish no rate limit. We set our own (section 4).

### The Benga dictionary today

| Item | Value |
|---|---|
| Entries / senses / sentences | 27 / 34 / 33 |
| Audio | 54 files (41 words, 13 sentences), all **WAV** (~0.9 MB each). 5 words and 20 sentences have none |
| Speakers | Upango Bondyale Oko (31 audios), Uyombo Makendengue Evita (20), Utati Bondjale Oko (3), **Utati Bondyale Oko** (0, duplicate?), **test** (0) → R-039 |
| Gloss languages | en, es, fr |
| Sources | none registered (Salvado y Cos must be created before we cite it) |
| Visibility | **`public: false`**: visitors of the website can't open its entries → R-036 |
| Noun class field | free text in many shapes: `1ª Clase`, `1era Clase`, `2e Classe`, `7a clase, 7e classe`, `3a`, even a whole adjective paradigm → R-038 |
| Possible duplicates | `Tombo` has two "Aguja/Needle" senses and one empty sense; `Sânâ` and `sânâ` are separate entries → R-040 |
| Site ↔ dictionary | 908 words in the site registry, 17 linked to an entry; ~460 book words aren't in the dictionary yet |
| Audio files | public at `https://media.livingdictionaries.app/benga/audio/<id>.wav` (the API's media route redirects there; no key needed for the file itself) |

## 3. Responsible use (rules for every task)

These come from the API guides. They are not optional.

- **Never invent Benga.** No AI-made words, forms or sentences enter the dictionary. The
  importing guide declines "invented or generated vocabulary". Claude may draft *translations
  of Spanish glosses*, *metadata* (part of speech, domain, noun class, scientific name,
  relations) and *transcriptions*, always as suggestions with a review flag, from attested
  words only (book, recordings, speakers).
- **The manager's curation is the record.** The dictionary already has content made by people.
  Add to it, never overwrite their wording without you agreeing, and never "tidy" spelling or
  diacritics by rule (R-038, R-040).
- **Real speakers only.** Audio is attributed to a registered speaker (default **Upango Bondyale
  Oko**, id `024ea143-…`) or to a source. No placeholder people.
- **Cite the book.** Words taken from Salvado y Cos carry the citation `salvado-y-cos-1891` plus
  the page.
- **Review notes are not secret.** The `review` note is hidden in their website but travels in
  the public snapshot file. Write it as a plain question about the word, with no personal data.
- **Machine translation is labelled.** Example-sentence translations made by Claude go up as
  `translation_meta: machine` until a person reviews them.
- **Be gentle with their servers** (section 4). If something seems missing or broken, use
  `POST …/feedback` to ask the LD team rather than working around it.

## 4. Sync rules (how we avoid being a burden or getting blocked)

| Rule | Value |
|---|---|
| Who starts a sync | Only you: a button in the admin or an `npm run ld:*` command |
| Reading in bulk | 1 snapshot download, then compare locally. Never page through all entries |
| Reading a few | `?lexeme=…&match=exact`, `GET …/entries/{id}`, `?updated_since=` |
| Writing | Batches (`POST …/entries`, `batch-update`, relationships) of ≤ 200. One request at a time, ≥ 0.5 s apart |
| Media | One file at a time, ≥ 1 s apart, at most 100 files per run (configurable) |
| Errors | `429`/`5xx` → wait (`Retry-After` or 2 s, 4 s, 8 s…, max 5 tries). 3 failures in a row → stop the run and log it |
| Identity | `User-Agent: benga-portal-ld-bridge/<version>` (no personal data) |
| Safety | `redirect: 'error'` on writes, results length must match the batch, ledger file so a run resumes, `import_id` on every push |
| Cloudinary | Uploads use the **remote-URL upload** (Cloudinary fetches the file itself: 1 request, no download through your computer). Listing uses the Admin API sparingly (its limit is per hour). Credits used are shown before a big run |

## 5. The data model (workspace files)

`src/data/dictionary/entries.json` (shape; final schema in L1.1):

```jsonc
{
  "entries": {
    "1820bdc3-…": {                       // the Living Dictionary id (ours = uuid5 for new ones)
      "lexeme": "Ele", "homograph": null, "phonetic": null,
      "scientificNames": [], "notes": { "es": "…" }, "morphology": null, "toneClass": null,
      "citations": [{ "slug": "salvado-y-cos-1891", "locator": "p. 14" }],
      "senses": [{
        "id": "…", "glosses": { "es": "Árbol", "en": "Tree", "fr": "Arbre" },
        "partsOfSpeech": ["n"], "semanticDomains": ["1.4", "5.2"], "nounClass": "1",
        "pluralForm": "Bele", "sentenceIds": ["…"]
      }],
      "audio": [{ "id": "…", "storagePath": "benga/audio/….wav", "speakerId": "024ea143-…",
                  "cloudinary": "ele" }],
      "relations": [{ "type": "synonym", "to": "…" }],
      "siteKeys": ["ele"],                                    // word-registry keys it feeds
      "review": { "category": "uncertain_noun_class", "note": "…?", "by": "claude", "at": "2026-…" },
      "suggestions": [{ "field": "senses[0].glosses.fr", "value": "…", "reason": "…",
                        "by": "claude", "at": "…" }],
      "sync": { "state": "synced | local-changes | new | conflict | error", "ldUpdatedAt": "…",
                "lastError": null }
    }
  }
}
```

- `base.json` = the last state read from Living Dictionaries, per entry and sentence. Comparing
  **base ↔ workspace** gives *your* changes, and **base ↔ new snapshot** gives *their* changes.
  When both changed the same field, that's a **conflict**, shown side by side.
- `sentences.json`: text, translations `{es,en,fr}` + `translationStatus`, linked senses, audio,
  same `review` / `suggestions` / `sync`.
- `src/data/dictionary/vocab/`: the lists with Spanish labels and help texts: parts of speech
  (your 90 values ↔ LD codes), semantic domains, relation types, review categories.
- Sync logs: `ld-sync/runs/<date>-<kind>.json` (git-ignored, R-044) with every item's result and
  error category. The admin's Sincronización page reads them.
- `word-registry.json` stays the hinge for the website. A link step fills `livingDictionaryId`,
  `audio: recorded` and `audioFile` from the workspace, so `BengaWord` keeps working unchanged.

Error categories used in logs, badges and filters: `auth`, `validation`, `not_found`,
`conflict`, `duplicate`, `rate_limited`, `network`, `server`, `media_too_big`,
`media_format`, `speaker_missing`, `source_missing`, `cloudinary`, `unknown`.

Review categories (small fixed list, same in our UI and in LD's queue): `missing_gloss`,
`uncertain_gloss`, `uncertain_pos`, `uncertain_domain`, `uncertain_noun_class`,
`uncertain_spelling`, `possible_duplicate`, `audio_issue`, `needs_example`, `other`.

## 6. The admin (what you will see)

| Page | Route | What it does |
|---|---|---|
| **Panel** | `/admin/living-dictionary` | Counts (entries, sentences, with/without audio, needs review, local changes, conflicts, sync errors), last pull/push, big buttons *Traer de LD*, *Enviar cambios*, *Copiar audios a Cloudinary*, and "what to do next" cards ("12 palabras sin traducción al francés") |
| **Entradas** | `…/entradas` | Table or list view; search with and without accents and typo tolerance; filters in a side panel (part of speech, domain, noun class, audio yes/no, example yes/no, missing es/en/fr, needs review + category, sync state, speaker, linked to the website, source); sorting; column chooser; URL keeps the filters; bulk actions; **+ Añadir palabra** |
| **Oraciones** | `…/oraciones` | Same for sentences (missing translation, machine-translated, audio, linked word) + **+ Añadir oración** |
| **Ficha de palabra** | `…/entrada/:id`, `…/entrada/nueva` | Form with collapsible cards: Palabra · Sentidos (one card per meaning) · Audio · Ejemplos · Más campos · Relaciones · Imagen · Revisión y sugerencias · En la web · Sincronización. Duplicate warning while typing a new word. Tooltips on every field ("¿Qué es la clase nominal?") |
| **Ficha de oración** | `…/oracion/:id`, `…/oracion/nueva` | Benga text, translations with status, audio, linked words |
| **Sincronización** | `…/sincronizacion` | Preview → run → progress bar; history of runs; errors grouped by category with links to the words; retry failed only |
| **Grabar** | `…/grabar` | Recording session for elders (L6.5): huge word, one big button, listen, keep or repeat, next |
| **Importar carpeta** | `…/importar` | The existing `ld:import` (CSV + audio folder) with a progress tracker |

Design: same colours as the site, cards and chips, dropdowns for long lists (90 parts of speech
in groups, domains as a tree with search), tooltips (ⓘ) explaining fields in Spanish,
confirmation dialogs before anything is sent, toasts for results, keyboard friendly, big
targets.

---

## Phase L0 — Decisions and foundations

Branch: `feat/ld-foundations`

- [x] **L0.1 Roadmap, rules and doubts** *(done 2026-11-25)*
  - **Commit:** `docs(ld): add the living dictionary bridge roadmap`
- [ ] **L0.2 A polite API client**
  - **Why:** every later task talks to LD; throttling, retries, logging and the key must live in one place.
  - **Prompt:** "Task L0.2: read docs/LD-ROADMAP.md sections 3–4. Move the LD client out of `scripts/lib/living-dictionary.mjs` into `scripts/lib/ld/client.mjs` with: request queue (one at a time, min interval per kind), retries with backoff and `Retry-After`, stop after 3 consecutive failures, `redirect: 'error'` on writes, User-Agent with version, an `onEvent` hook that the sync log will use, and read helpers `dictionary()`, `entry(id)`, `findEntries()`, `changedSince()`, `downloadSnapshot()`. Keep `ld:import` working. Tests with a fake fetch, no real calls."
  - **Commit:** `refactor(ld): add a throttled living dictionary client`
- [ ] **L0.3 Vocabularies with Spanish labels**
  - **Why:** the form shows your Spanish lists; LD stores codes.
  - **Prompt:** "Task L0.3: create `src/data/dictionary/vocab/parts-of-speech.json` (the 90 LD codes with the exact Spanish labels from my list, English name and a one-line Spanish help text, grouped: sustantivos, verbos, pronombres, …), `semantic-domains.json` (keys + my Spanish names + English, as a tree), `relation-types.json` (LD slugs + Spanish labels and help from the 'Entradas relacionadas' texts) and `review-categories.json`. Make `living-dictionary.mjs` read them instead of its own tables. Tests: every code unique, every label found, my 90 values all mapped."
  - **Commit:** `feat(ld): add part-of-speech, domain and relation vocabularies`
- [ ] **L0.4 Register the book as a source and set the default speaker** *(writes to LD: you approve first)*
  - **Prompt:** "Task L0.4: show me the source record you would create for Salvado y Cos (slug `salvado-y-cos-1891`, title, year, author, link to the PDF) and, once I approve, create it with `POST …/sources`. Add `LD_DEFAULT_SPEAKER` (Upango Bondyale Oko's id) to `src/config/ld.js` (non-secret settings: dictionary id, default speaker, limits). Log both in REVIEW-LOG R-039."
  - **Commit:** `feat(ld): register the book source and default speaker`

## Phase L1 — The workspace (local copy of the dictionary)

Branch: `feat/ld-workspace`

- [ ] **L1.1 Schemas for entries and sentences**
  - **Prompt:** "Task L1.1: write JSON Schemas `dictionary-entry` and `dictionary-sentence` in `src/data/schemas/` following docs/LD-ROADMAP.md section 5 (fields of LD + review, suggestions, siteKeys, sync). Examples in `schemas/examples/`, tests in `schemas.test.mjs`, a section in CONTENT-GUIDE.md. Benga fields are plain strings; translations are { es, en, fr }."
  - **Commit:** `feat(schemas): add dictionary entry and sentence schemas`
- [ ] **L1.2 First pull from the snapshot**
  - **Prompt:** "Task L1.2: `npm run ld:pull` downloads the snapshot (no key), reads it read-only (node:sqlite or sql.js, tell me which and why) and writes `src/data/dictionary/entries.json`, `sentences.json` and `base.json`. Keep the dictionary's wording exactly (NFC, no accent changes). Print a report: counts, entries without gloss per language, without audio, duplicates by spelling. Don't change anything in LD."
  - **Commit:** `feat(ld): pull the dictionary into a local workspace`
- [ ] **L1.3 Link the workspace with the website's words**
  - **Prompt:** "Task L1.3: match workspace entries to word-registry keys with `toAudioId` (exact spelling, then case-insensitive, then 'same word without accents' only as a suggestion with review). Fill `siteKeys` and the registry's `livingDictionaryId` only when empty. Report: LD words not on the site, site words not in LD (grouped by lexicon file and class), spelling differences (e.g. `Hāngā` in LD vs `Hângâ` in the book) → REVIEW-LOG, never auto-fix."
  - **Commit:** `feat(ld): link dictionary entries to the site's word registry`
- [ ] **L1.4 Validation**
  - **Prompt:** "Task L1.4: add the workspace to `npm run validate`: schema, unique ids, sentence links exist, POS/domain codes known, Benga orthography warnings (never errors) on lexemes and sentences, registry links point to real entries. A test per check in `validate.test.mjs`."
  - **Commit:** `feat(validate): check the dictionary workspace`

## Phase L2 — Local endpoints for the admin

Branch: `feat/ld-admin-api`

- [ ] **L2.1 Read/write endpoints**
  - **Prompt:** "Task L2.1: add `/__dev/ld/*` to vite.config.mjs (serve only, loopback only), logic in `scripts/lib/ld/workspace.mjs`: list/get/save entry and sentence, create with uuid5 id, delete local-only (never in LD here), atomic file writes, a version number per record so two tabs can't overwrite each other (409). Saving marks `sync.state = local-changes`. Tests without the server."
  - **Commit:** `feat(ld): add local endpoints to read and edit the workspace`
- [ ] **L2.2 Keep the site in step on every save**
  - **Why:** you asked that the site's files stay up to date when a word changes.
  - **Prompt:** "Task L2.2: after each save, update the registry links of that entry (livingDictionaryId, audio state) and regenerate `word-usage.json` only if needed. Never touch nouns.json/adjectives.json: if the gloss of a linked book word differs, show it in the form's 'En la web' card instead."
  - **Commit:** `feat(ld): keep the word registry in sync with workspace edits`

## Phase L3 — Admin shell and tables

Branch: `feat/ld-admin-ui`

- [ ] **L3.1 Admin UI kit**
  - **Prompt:** "Task L3.1: create small reusable admin components in `src/components/admin/`: DataTable (sortable, sticky header, row click), FilterPanel, ChipSelect (multi-select with search and groups), TreeSelect (domains), InfoTip (ⓘ tooltip, keyboard accessible), Modal, Drawer, Toast, StatusBadge, EmptyState. Style with the site variables, BEM. Show them on a hidden `/admin/living-dictionary/kit` page for me to try."
  - **Commit:** `feat(admin): add reusable admin ui components`
- [ ] **L3.2 Routes, navigation and Panel**
  - **Prompt:** "Task L3.2: add the `/admin/living-dictionary` route group (dev only, like the other admin pages), a 'Living Dictionary' entry in AdminNav, and the Panel page from LD-ROADMAP section 6 (counts, last syncs, next-step cards). Buttons for syncs are disabled placeholders until phase L5/L6."
  - **Commit:** `feat(admin): add the living dictionary panel`
- [ ] **L3.3 Entries table**
  - **Prompt:** "Task L3.3: `…/entradas`: list and table views (like the LD screenshots, but cleaner), search ignoring accents and case with typo tolerance 0–3, all filters of section 6 with counts, sort A–Z / recently changed / needs review first, column chooser, pagination 50, filters saved in the URL. Badges: needs review (orange), local changes (blue), conflict/error (red), no audio. Clicking a row opens the form."
  - **Commit:** `feat(admin): add the dictionary entries table`
- [ ] **L3.4 Sentences table**
  - **Commit:** `feat(admin): add the dictionary sentences table`
- [ ] **L3.5 Bulk actions**
  - **Prompt:** "Task L3.5: select rows → mark/clear review, add a semantic domain, set part of speech, add a tag, export selection as CSV (for printing word lists for recording sessions). Confirmation dialog shows how many words change."
  - **Commit:** `feat(admin): add bulk actions to the dictionary tables`

## Phase L4 — Word and sentence forms

Branch: `feat/ld-forms`

- [ ] **L4.1 Word form: headword and senses**
  - **Prompt:** "Task L4.1: `…/entrada/:id` and `/nueva`. Card 'Palabra' (lexeme with â ē ū buttons, homograph, phonetic with an IPA keyboard popover). Card per sense: glosses es/en/fr, parts of speech (ChipSelect, groups, Spanish labels, tooltip help), semantic domains (TreeSelect), noun class (select 1–7 + 'otra' with free text, help explaining the classes with link to the site pages), plural, variant, definition. 'Añadir sentido' button. Unsaved-changes guard. While typing a new lexeme, warn 'Ya existe' with links."
  - **Commit:** `feat(admin): add the dictionary word form`
- [ ] **L4.2 Example sentences in the form + sentence form**
  - **Commit:** `feat(admin): add example sentences and the sentence form`
- [ ] **L4.3 'Más campos' card**
  - **Prompt:** "Task L4.3: collapsed card with notes (markdown), morphology, interlinearization, scientific names, tone class, dialects, tags, citations (source + page, default the book). Only filled fields show when collapsed."
  - **Commit:** `feat(admin): add optional dictionary fields`
- [ ] **L4.4 Relations**
  - **Prompt:** "Task L4.4: card 'Relaciones': search another entry, choose a type with the Spanish explanations from the 'Entradas relacionadas' panel, optional sense on each side, list with remove. Stored in the workspace; sent in L5.3."
  - **Commit:** `feat(admin): add word relations`
- [ ] **L4.5 Audio card**
  - **Prompt:** "Task L4.5: list the entry's recordings (play from Cloudinary if copied, else from the LD media URL), speaker shown; record (reuse /admin/audios recorder) or upload a file; speaker dropdown preselected with the default speaker. New audio is saved locally as 'pendiente de enviar' (sent in L6.2). Same card on the sentence form."
  - **Commit:** `feat(admin): add the audio card to the dictionary forms`
- [ ] **L4.6 Image card** (collapsed, optional, per sense, ≤ 10 MB, sent in L5.3)
  - **Commit:** `feat(admin): add optional images to senses`
- [ ] **L4.7 Review and suggestions card**
  - **Prompt:** "Task L4.7: card 'Revisión': flag 'Necesita revisión' with category and note (who and when). Suggestions from Claude listed with field, proposed value, reason: buttons Aceptar / Editar y aceptar / Rechazar. Accepting writes the field and keeps a small history line. Filter in the tables: 'Sugerencias pendientes'."
  - **Commit:** `feat(admin): add review flags and suggestions to the forms`
- [ ] **L4.8 Form checks and 'En la web' card**
  - **Prompt:** "Task L4.8: a checklist at the top of the form (gloss es/en/fr, part of speech, domain, audio, example) with jump links; orthography warnings; card 'En la web' showing the linked site words, the pages that use them, the book gloss vs dictionary gloss side by side."
  - **Commit:** `feat(admin): add completeness checks and site links to the form`

## Phase L5 — Sync with Living Dictionaries

Branch: `feat/ld-sync`

- [ ] **L5.1 Change detection (three-way)**
  - **Prompt:** "Task L5.1: `scripts/lib/ld/diff.mjs`: compare base, workspace and a fresh LD state per field (lexeme, glosses per language, POS, domains, …, sentences, relations, review). Output a changeset: new, changed (field list), deleted-locally, changed-in-LD, conflicts. Pure functions with many tests (multi-language overlay, arrays replaced, senses matched by id)."
  - **Commit:** `feat(ld): detect local and remote changes per field`
- [ ] **L5.2 Pull with merge**
  - **Prompt:** "Task L5.2: 'Traer de LD' (button + `npm run ld:pull`): download the snapshot, compute the changeset, preview modal (what will update locally, conflicts), apply on confirm: remote-only changes update the workspace and base, conflicts are marked and kept for you. Log the run."
  - **Commit:** `feat(ld): pull dictionary changes with conflict detection`
- [ ] **L5.3 Push only changes**
  - **Prompt:** "Task L5.3: 'Enviar cambios' (button + `npm run ld:push`): preview grouped by word (exact fields, before → after), then: new entries via POST (batches ≤ 200, import_id `benga-portal-<date>`), changes via batch-update, sentences, relations, review flags, images; check each result, re-read the changed entries through the API to verify, update base. Words with errors get `sync.state=error` + message. Never deletes in LD in this task."
  - **Commit:** `feat(ld): push local changes to the living dictionary`
- [ ] **L5.4 Sync log, error categories and UI**
  - **Prompt:** "Task L5.4: write every run to `ld-sync/runs/*.json` (items with word, operation, status, HTTP code, error category, message). Page `…/sincronizacion`: runs list with totals, errors grouped by category with explanation and suggested fix in Spanish, links to words, 'Reintentar fallidos'. Table filter 'Con errores de sincronización'."
  - **Commit:** `feat(admin): add the sync history and error report`
- [ ] **L5.5 Conflict resolution**
  - **Prompt:** "Task L5.5: in the form, a conflict shows both values with the differences highlighted and buttons 'Usar la de LD' / 'Usar la mía' / 'Editar'."
  - **Commit:** `feat(admin): resolve sync conflicts side by side`
- [ ] **L5.6 Deletions and undo** *(always with your confirmation)*
  - **Prompt:** "Task L5.6: deleting a word/sense/sentence that exists in LD becomes a pending deletion shown in red in the push preview with a second confirmation. 'Deshacer un envío' uses batch-delete by import_id with dry run (count) + confirm."
  - **Commit:** `feat(ld): support deletions and undoing a push`

## Phase L6 — Audio bridge

Branch: `feat/ld-audio`

- [ ] **L6.1 Copy LD audio to Cloudinary**
  - **Prompt:** "Task L6.1: 'Copiar audios a Cloudinary' (button + `npm run ld:audio`): for each LD audio not yet copied (ledger by LD audio id), upload to Cloudinary by remote URL (media.livingdictionaries.app link from the API redirect) as `<key>` in benga-words or benga-sentences (key = toAudioId of the word/sentence), so it's delivered as `<key>.mp3`. Several recordings of one word: the primary rule from R-042, others kept as alternates. Never overwrite an existing Cloudinary file without asking (R-043). Throttled, max per run, shows Cloudinary credits first. Updates registry `audio: recorded` + `audioFile`. Log every item."
  - **Commit:** `feat(audio): copy living dictionary recordings to cloudinary`
- [ ] **L6.2 Send new recordings to LD and Cloudinary**
  - **Prompt:** "Task L6.2: audios recorded or uploaded in the forms (pending) are sent on push: to LD (`…/audio` with speaker, uuid5 id) and to Cloudinary. Convert browser recordings (webm) to a format LD accepts if needed (R-047). Log."
  - **Commit:** `feat(audio): upload new recordings to the dictionary and cloudinary`
- [ ] **L6.3 Audio health view**
  - **Prompt:** "Task L6.3: in Sincronización, an 'Audio' tab: LD audio not on Cloudinary, Cloudinary audio not in LD (from /admin/audios), words with several recordings, broken links. Buttons to fix each group."
  - **Commit:** `feat(admin): add an audio sync health view`
- [ ] **L6.4 Folder upload with progress**
  - **Prompt:** "Task L6.4: page `…/importar`: choose a folder already in the project (or path), run the `ld:import` checks, show the preview, send with a progress bar and per-file status; the run appears in the sync history."
  - **Commit:** `feat(admin): track folder imports in the admin`
- [ ] **L6.5 Recording session for elders**
  - **Why:** the speakers find the LD interface hard; you sit next to them and they only speak.
  - **Prompt:** "Task L6.5: `…/grabar`: choose a list (filter 'sin audio', a domain, a printed CSV), speaker. Full-screen: the Benga word huge, Spanish gloss below, one big round button (or space bar) to record, auto-stop on silence, play back, 'Bien → siguiente' / 'Repetir'. Saves as pending audio on the entry. Works with a tablet."
  - **Commit:** `feat(admin): add a simple recording session mode`

## Phase L7 — Claude-assisted content

Branch: `content/ld-<topic>` (one per task). How it works: you ask in a session ("Task L7.2,
French glosses for domain 5.3"). Claude writes **suggestions** into the workspace with
`npm run ld:suggest`, you accept or reject them in the forms (L4.7), then you push (L5.3).

- [ ] **L7.1 Task tooling**
  - **Prompt:** "Task L7.1: `npm run ld:tasks -- <kind> [filters]` lists the work (e.g. missing-gloss-fr, missing-pos, missing-domain, missing-noun-class, sentences-without-translation) as a JSON file for a Claude session; `npm run ld:suggest -- file.json` adds suggestions (validated against the vocab) without overwriting fields. Document in docs/LD-BRIDGE-GUIDE.md."
  - **Commit:** `feat(ld): add task export and suggestion import for assisted editing`
- [ ] **L7.2 Translations of glosses (es → en, fr)**: suggestions from the Spanish gloss and the book's meaning; senses with several meanings → suggestion "split into senses".
  - **Commit:** `feat(dictionary): suggest english and french glosses`
- [ ] **L7.3 Part of speech, semantic domain, noun class**: from the book lexicon (class known there) and the meaning; any doubt → review flag with question.
  - **Commit:** `feat(dictionary): suggest parts of speech, domains and noun classes`
- [ ] **L7.4 Book words into the dictionary** *(the big one: ~460 words, in batches of ~50 you approve)*
  - **Prompt:** "Task L7.4.N: take lexicon words of <class/file> missing from LD, build workspace entries (book spelling, es/en/fr meaning, class, plural, citation `salvado-y-cos-1891` + page, tag per R-045), check overlap with existing entries by meaning (homograph guard), show me the batch preview, then push."
  - **Commit:** `feat(dictionary): add class N nouns from the book`
- [ ] **L7.5 The site's Benga sentences into the dictionary**: example sentences from chapters 2–3 with es/en/fr (machine status for AI translations), linked to their words.
  - **Commit:** `feat(dictionary): add example sentences from the book`
- [ ] **L7.6 Scientific names** for plants and animals (domains 1.4–1.10), with review flag when not certain.
  - **Commit:** `feat(dictionary): suggest scientific names for plants and animals`
- [ ] **L7.7 Relations** (synonyms, antonyms, part-of, derived words, singular/plural pairs if wanted), always as suggestions.
  - **Commit:** `feat(dictionary): suggest relations between words`
- [ ] **L7.8 Cleanup of the current entries** *(only what you approve: R-038, R-040)*: noun class format, duplicate/empty senses, `Sânâ`/`sânâ`, adjective paradigm moved out of the noun class field.
  - **Commit:** `feat(dictionary): tidy noun classes and duplicate senses`

## Phase L8 — Phonetic transcription (IPA)

Recommendation: **two layers, a separate Python project for the audio part.**

| Layer | What | Where | Reliability |
|---|---|---|---|
| A. Spelling → IPA rules | Benga spelling is close to its sounds. Rules from chapter 1 (vowels, diphthongs, consonant combinations) give a *phonemic* transcription `/…/` instantly for every word | this repo, `src/utils/bengaIpa.js` (tested) | Good for consonants and vowels once you validate the rules, **no tone** |
| B. Audio → IPA | A pretrained universal phone recognizer listens to the recording: [Allosaurus](https://github.com/pbilk/allosaurus) (pip, offline, ~2000 languages) or [ZIPA](https://aclanthology.org/2025.acl-long.961) (2025, better accuracy) | sibling folder `../benga-phonetics` (Python, own git repo; heavy ML libraries stay out of the website) with a CLI and a tiny local HTTP service | A second opinion: useful to catch where speech differs from the spelling; makes mistakes, especially with tone |
| C. Tone (experimental) | Pitch curve per syllable (Praat/Parselmouth) → suggested high/low marks | `../benga-phonetics` | Research; only with your checking |

The admin shows A and B side by side with differences highlighted. You choose; the result goes
to the entry's `phonetic` field. Online APIs that return IPA from audio exist only as general
speech services that don't know Benga, so a local model is cheaper, private and no worse.

- [ ] **L8.0 Spike (decide with numbers)**
  - **Prompt:** "Task L8.0: in `../benga-phonetics`, try Allosaurus and ZIPA on 20 Benga recordings (copied from Cloudinary/LD) against my reference transcriptions of the same words; report a phone error rate per tool, run time on my PC, install size. Recommend one. No changes to the website repo."
  - **Commit (in benga-phonetics):** `feat: evaluate phone recognizers on benga recordings`
- [ ] **L8.1 Spelling → IPA rules**
  - **Prompt:** "Task L8.1: from the chapter-1 sections (vowels, diphthongs, triphthongs, consonants) propose a rule table Benga letter(s) → IPA for my approval; then write `src/utils/bengaIpa.js` + tests (every example word of chapter 1). Output phonemic `/…/`."
  - **Commit:** `feat(phonetics): add benga spelling to ipa rules`
- [ ] **L8.2 Audio → IPA service** (`../benga-phonetics`, CLI `benga-ipa file.wav`, local HTTP `127.0.0.1:<port>`, inventory restricted to the approved Benga sounds)
  - **Commit (in benga-phonetics):** `feat: transcribe benga recordings to ipa`
- [ ] **L8.3 Admin integration**: "Sugerir fonética" button in the form; after each new recording the suggestion is created automatically (as a suggestion, never final).
  - **Commit:** `feat(admin): suggest phonetic transcriptions`
- [ ] **L8.4 Tone experiment** (optional)
  - **Commit (in benga-phonetics):** `feat: suggest tone marks from pitch`

## Phase L9 — Polish

Branch: `chore/ld-polish`

- [ ] **L9.1 Guide** `docs/LD-BRIDGE-GUIDE.md` (how to use each page, with screenshots) and README/AGENTS updates — `docs(ld): add the living dictionary bridge guide`
- [ ] **L9.2 Accessibility and keyboard pass** on the admin — `fix(admin): improve accessibility of the dictionary pages`
- [ ] **L9.3 End-to-end rehearsal**: pull → edit 3 words → record → push → audio copy → website plays it; written checklist — `test(ld): add an end-to-end sync checklist`
- [ ] **L9.4 Public side** (if R-036 is solved): dictionary links on the site go to the exact entry; "Grabado por …" credit under audio played from the dictionary — `feat(site): credit dictionary recordings`

---

## 7. Order and size

```
L0 ─► L1 ─► L2 ─► L3 ─► L4 ─► L5 ─► L6 ─► L9
                         │            ▲
                         └─► L7 (needs L4.7 + L5.3) ─┘
L8.0 can start any time (separate folder); L8.3 needs L4.
```

A sensible first milestone (about 3–4 sessions): **L0 + L1 + L6.1** gets every existing
dictionary recording playing on the website and the site's words linked, before any UI work.

## 8. Same repository or a new one?

**This repository** for the bridge. It reads and writes the same files as the website
(word registry, lexicon, `toAudioId`, Cloudinary code, `/admin` pattern, validation). Splitting
it off would mean copying those files between two repositories and keeping them in step, which
is exactly the problem we're trying to solve. To keep it tidy: logic in `scripts/lib/ld/`,
pages in `src/views/admin/ld/`, data in `src/data/dictionary/`. The admin never reaches the
published site (as today).

**A separate folder `../benga-phonetics`** for the audio → IPA part: Python, large ML libraries,
experimental. It talks to the admin through a local command or port, so the website repo stays
light.

Reconsider a separate app only if **other people** (not you on your computer) must use the
admin online. Then it needs a server, logins and a database (book roadmap Phase 10), and that
is a different project.

## 9. Recommendations for inputting words

1. **Record in sessions, type later.** Use the recording mode (L6.5) with a printed or on-screen
   list; you add the glosses afterwards in the table. That's less tiring for the speakers.
2. **Fill by column, not by word.** Filter "sin francés", fill 30 French glosses in a row
   (Claude drafts them), then "sin dominio", etc. The table + bulk actions make this quick.
3. **One meaning = one sense.** When a word has two unrelated translations (Oba: cielo /
   arriba), keep them as senses of one entry if it's the same word, separate entries with
   homograph numbers if they are different words. When unsure, flag `possible_duplicate`.
4. **Decide the noun-class format once** (R-038) and let the form only offer that format.
5. **Pull before a work session, push at the end.** That keeps conflicts rare.
6. **Small pushes.** 20–50 words per push, then a look at the dictionary's website. The undo
   button exists, but the best undo is a small batch.
