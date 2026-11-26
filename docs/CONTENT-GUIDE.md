# Content Guide — how the book's content is stored

This guide explains the **content model**: the shape of the files that hold the Benga
content, and how to add a word, a section or an exercise.

> **Status (task 2.1):** the shapes below are defined and tested (`src/data/schemas/`), but the
> current pages still use their old files. Content moves into the new shapes step by step:
> nouns in task 2.4, chapters 1 and 3 in task 2.6, pages drawn from section files in Phase 3.
> New chapters (Phase 6) are written directly in the new shapes.

---

## 1. The big picture

Every piece of information lives in **one** place. The other places refer to it.

```
                ┌───────────────────────────────┐
                │  lexicon/<kind>.json           │  every Benga word ONCE:
                │  "epokolo": { noun, class 1,   │  forms, grammar, meaning {es,en,fr}
                │    Epokolo / Bepokolo,         │
                │    meaning: Sombrero }         │
                └──────▲───────────────▲─────────┘
     refers by id      │               │      refers by id / filter
┌──────────────────────┴───┐   ┌───────┴──────────────────────┐
│ sections/ch-2/class-1.json│   │ exercises/ch2-pluralize.json │
│ title + ordered blocks:   │   │ "pluralize every class-1     │
│ pattern, examples [ids],  │   │  noun, 10 per round"         │
│ table, note, practice…    │   └──────────────────────────────┘
└───────────────────────────┘
                │ every Benga word shown on a page
                ▼
     word key (src/utils/audioId.js)  "Epokolo" → epokolo
                │
                ▼
┌───────────────────────────────────┐
│ lexicon/word-registry.json         │  links of every word FORM:
│ "epokolo": { livingDictionaryId,   │  audio recorded?, dictionary id
│              audio: "missing" }    │  (docs/WORD-REGISTRY.md)
└───────────────────────────────────┘
```

| File | Holds | Edited by |
|---|---|---|
| `src/data/lexicon/<kind>.json` (nouns, adjectives, verbs, other) | each word's forms, grammar, meaning | you / Claude, from the book |
| `src/data/sections/ch-N/<name>.json` | the text of one page, as blocks | you / Claude, from the book |
| `src/data/exercises/<id>.json` | exercises for a section | you / Claude |
| `src/data/chapters-index.json` | chapter and section list (menu) | when a section is added |
| `src/data/lexicon/word-registry.json` | audio + dictionary links per word form | admin page / CSV import |
| `src/data/schemas/*.schema.json` | **the rules** each file must follow (incl. `word-registry.schema.json`) | only when the model changes |

**Why split lexicon and registry?** The lexicon describes *words* (Epokolo and Bepokolo are
one noun). The registry describes *sounds and links* (each form has its own recording).
One noun → one lexicon entry → two registry keys (`epokolo`, `bepokolo`).

---

## 2. Shared pieces (`common.schema.json`)

### Translated text — `{ "es": …, "en": …, "fr": … }`

Every text a visitor reads is an object with one value per language. **Spanish is required**;
English and French are filled in for chapters 1-3 (Phase 4). If a language is missing, the site shows Spanish. How translations work and how to review them: `docs/TRANSLATIONS.md`; what is missing: `npm run i18n:report`.

In a component template, show such a text with **`$localized(...)`**: it picks the visitor's
language, falls back to Spanish, and updates by itself when the language changes.

```html
<p>{{ $localized(sectionData.introduction) }}</p>
<!-- not: {{ sectionData.introduction[$i18n.locale] || sectionData.introduction.es }} -->
```

(The rule itself is `localized()` in `src/utils/localized.js`, with tests.) A page that reads a whole data file in `loadData()` can instead translate it at once with `localizeDeep(data, this.$i18n.locale)` and reload it with `watch: { '$i18n.locale': 'loadData' }` (see the chapter-3 pages).

```json
"meaning": { "es": "Sombrero", "en": "Hat", "fr": "Chapeau" }
```

Benga words are **not** translated text: they are plain strings (`"Epokolo"`), written with
the Benga vowels `a â e ē i o u ū`.

### Where it is in the book — `source`

```json
"source": { "bookPage": 24, "pdfPage": 18, "note": "right column" }
```

Pages can be a number or a range (`"9-10"`). The printed page and the PDF page often differ.

### Original, corrected or added — `editorial`

This lets the site **improve the book** while staying honest about what the book says.

| `status` | Meaning | Extra fields |
|---|---|---|
| `original` | As printed in the book (the default when missing) | — |
| `corrected` | The site fixes the book | `bookText` = what the book printed; `note` = why |
| `added` | New content, not in the book | `note` (optional) |

```json
"editorial": {
  "status": "corrected",
  "bookText": "úaúa",
  "note": { "es": "El libro imprime «úaúa»; la grafía benga actual es «ūâūâ»." },
  "reviewLog": "R-001"
}
```

---

## 3. The lexicon (`lexicon.schema.json`)

A lexicon file is `{ "entries": { <id>: <entry>, … } }`.

**The id** is the word key of the entry's base form, the same rule as audio ids:
`Epokolo → epokolo`, `Enâ → en_a_`, `Pēki Pēki → p_e_ki-p_e_ki`.
Base form = singular for nouns (plural if there is no singular), otherwise `word`.
Two different words written the same way get `~2`, `~3`: `jaka` (comer), `jaka~2` (auxiliar).

### Noun

```json
"epokolo": {
  "type": "noun",
  "nounClass": 1,                          // 1-7, "irregular", or null if the book doesn't say
  "singular": { "word": "Epokolo" },
  "plural":   { "word": "Bepokolo" },
  "meaning":       { "es": "Sombrero" },
  "meaningPlural": { "es": "Sombreros" },  // optional
  "source": { "pdfPage": 8 }
}
```

- **Only plural** (liquids): `"singular": null`. Only singular: `"plural": null`. Never both.
- **Spelling ≠ sound:** `"singular": { "word": "Dyoba", "pronunciation": { "es": "Joba" } }`
- **Unreadable meaning** in the scan: `"meaning": null`. Never guess (AGENTS.md).

### Adjective

```json
"bobe":   { "type": "adjective", "kind": "variable",   "word": "bobe", "stem": "-be", "meaning": { "es": "malo" } },
"b_u_amu": { "type": "adjective", "kind": "variable", "word": "būamu",
            "forms": { "1": { "singular": "eyamu", "plural": "beyamu", "highlight": "ey" } },
            "meaning": { "es": "bueno" } },
"p_e_ki-p_e_ki": { "type": "adjective", "kind": "invariable", "word": "Pēki Pēki", "meaning": { "es": "Perpetuo, constante" } }
```

`kind`: `variable` | `invariable` | `numeral` | `ordinal`. `forms` is only needed where the plain
prefix rule doesn't apply.

### Verb

```json
"kalaka": { "type": "verb", "word": "kalaka", "conjugation": 1, "meaning": { "es": "hablar" } }
```

Optional: `irregular`, `impersonal`, `auxiliary` (true/false). The conjugation **tables** go in
a section file (block `conjugation`), because they are page content.

### Other words

`type`: `pronoun`, `adverb`, `preposition`, `conjunction`, `interjection`, `numeral`,
`particle`, `phrase`, with `word` and `meaning`.

### Optional fields for every entry

`source`, `editorial`, `tags` (e.g. `["liquid", "plural-only"]`, used for filters and exercises),
`notes` (internal, not shown).

### Not allowed (the tests check this)

- `audioId` or any audio field: audio is found from the word (docs/WORD-REGISTRY.md).
- Upper-case ids, noun class 8, conjugation 6, a text without `es`, unknown fields.

---

## 4. Sections (`section.schema.json`)

A section is one page: `id`, `chapter`, `title`, optional `subtitle` / `source` / `editorial`,
and **`blocks`**, the page content from top to bottom.

```
sections/ch-2/class-1.json                     what the visitor sees
┌─────────────────────────────────┐            ┌───────────────────────────────┐
│ title: Primera Clase Nominal    │ ─────────► │  PRIMERA CLASE NOMINAL        │
│ blocks:                         │            │                               │
│  1 pattern   e- → be-           │ ─────────► │   [ e- ]  →  [ be- ]           │
│  2 examples  [epokolo, en_a_]   │ ─────────► │   Epokolo 🔇 │ Bepokolo 🔇     │
│  3 table     concordancia       │ ─────────► │   Singular │ Epokolo eyamu │…  │
│  4 note      info               │ ─────────► │   ℹ La forma del adjetivo…     │
│  5 practice  …                  │ ─────────► │   1. Cubre la columna plural… │
└─────────────────────────────────┘            └───────────────────────────────┘
```

### Block types

| `type` | Shows | Required fields | Example |
|---|---|---|---|
| `heading` | a heading | `text`, optional `level` 2/3 | `{ "type": "heading", "text": { "es": "Excepciones" } }` |
| `paragraph` | text | `text` | `{ "type": "paragraph", "text": { "es": "…" } }` |
| `pattern` | prefix change box | `from`, `to` (optional `compact`) | `{ "type": "pattern", "from": "e-", "to": "be-" }` |
| `examples` | word cards | `entries` (lexicon ids) **or** `items` | `{ "type": "examples", "entries": ["epokolo"] }` |
| `table` | a table | `columns`, `rows` | cell = `"text"`, `{ "es": … }` or `{ "benga": "Epokolo eyamu" }` |
| `note` | highlighted box | `variant`, `text` | variants: `info`, `exception`, `warning`, `teacher`, `culture`, `modern-usage`, `small` |
| `concepts` | concept cards | `items` [{title, text}] | «Conceptos Clave» |
| `practice` | numbered tips | `items` [text] | «Para Practicar» |
| `conjugation` | verb table | `verb`, `voice`, `polarity`, `tenses` | see `examples/section-verb-kalaka.example.json` |
| `dialogue` | phrases + translation | `lines` [{benga, translation}] | fraseología, saludos |
| `vocabulary` | word list | `entries` (lexicon ids) | «Vocabulario» pages |
| `links` | numbered «go to» list | `items` [{title, text, to}] | «Secciones del Capítulo» |
| `checklist` | points with ✓ | `items` [text] | «Puntos Clave a Recordar» |
| `sounds` | one card per sound | `items` [{label, soundsLike, note?, examples?}], `color`, `labelSize` | diphthongs, triphthongs, consonants |
| `soundGroups` | letter group + pronunciation + examples | `items` [{label, pronunciation, examples}] | consonant combinations |

`examples.layout`: `pairs` (singular + plural, default), `single`, `plural-only` (badge «Solo plural»).
Every block may also have `id` (anchor), `source` and `editorial`.

### Which page draws a section file

- `src/views/chapter-2/NounClassPage.vue`: the noun classes (`sections/ch-2/class-N.json`), green noun-class frame.
- `src/views/SectionPage.vue`: any other section (first one: `sections/ch-3/adjectives-intro.json`).
  A `heading` may have `"style": "box"` (grey box) or `"highlight"` (light-blue box) for its part.
  Paragraph texts may use `**bold**` (nothing else: HTML is shown as text).
  `"look": "cards"` on `concepts` gives white cards with an `example` per item.
- `"layout": "lesson"` (chapter 1) draws the parts as underlined sections with no page title on top
  (the first heading is the title) and coloured buttons at the bottom (`"color"`: `primary`,
  `secondary`, `accent`). Notes in a lesson: `info` (blue box), `important` (yellow box),
  `rule` (yellow box with space below). A `heading` without `text` makes a part with no title.
- The route is generated from `chapters-index.json` (`"sectionFile"`); a file with
  `"layout": "noun-class"` is drawn by NounClassPage.vue.

### How a page groups the blocks (noun classes: `NounClassPage.vue`)

Each `heading` starts a new part of the page; the blocks after it go inside that part,
until the next `heading`. The heading's `id` names the part (`examples` → `noun-class__examples`,
`practice` → the grey practice box).

```
{ "type": "heading", "id": "exceptions", "text": { "es": "Excepciones" } }   ┐
{ "type": "note", "variant": "info", "text": … }       yellow box at the top  │ one part
{ "type": "examples", "entries": ["bolohi"] }           word cards            │
{ "type": "note", "variant": "small", "text": … }      small grey line below  ┘
```

- A note right after its heading is a yellow box on top; a later note (e.g. after a table) is a
  yellow box below the content; `"variant": "small"` is the small grey line.
- `"compact": true` on a `pattern` draws the small variant box (`[y-] → [bi-]`).
- `{count}` in a heading becomes the number of words of that part's `examples` block.
- The two buttons at the bottom of every page (`SectionNavFooter`) are automatic: previous and
  next page in `chapters-index.json`, read as one path through the book (chapter index page, its
  sections, then the next chapter), with the sidebar titles as labels. Nothing to write in the file.

---

## 5. Exercises (`exercise.schema.json`)

```json
{
  "id": "ch2-pluralize-class-1",
  "section": "ch2-noun-class-1",
  "kind": "fill-in",                    // multiple-choice | flashcard | fill-in | matching
  "title": { "es": "Forma el plural (primera clase)" },
  "generator": { "ask": "pluralize", "filter": { "type": "noun", "nounClass": 1 }, "count": 10 }
}
```

Use a **generator** (questions built from the lexicon, so new words get exercises automatically)
**or** hand-written **items** (`[{ "prompt": "Epokolo", "answer": "Bepokolo" }]`), not both.

---

## 6. Recipes

### Add a word

1. Find it in the book; note the PDF page.
2. Open the lexicon file of its kind (e.g. `src/data/lexicon/nouns.json`).
3. Compute its id: `toAudioId("Ndonda")` → `ndonda` (the admin page and `words:sync` show keys too).
4. Add the entry (copy an example above) with `meaning.es` and `source`.
5. Run `npm run words:sync` (it adds the forms to the word registry), then `npm test`.

### Add a section of the book

1. Extract the pages: `pdftotext -layout -f <first> -l <last> public/downloads/salvado-y-cos-gramatica-benga.pdf out.txt`
2. Add every new word to the lexicon first (recipe above). Log unreadable words in `docs/REVIEW-LOG.md`.
3. Create `src/data/sections/ch-N/<name>.json` with the blocks in book order.
4. Add the section to `src/data/chapters-index.json` with `"sectionFile": "sections/ch-N/<name>.json"` (and its title key to `src/locales/es.json`). That one line creates the route, the sidebar entry and the previous/next buttons; no code to change.
5. Run the checks: `npm test`, `npm run words:sync`, then open the page.

### Correct or amplify the book

- Fix a word or text: change it and add `"editorial": { "status": "corrected", "bookText": "…", "note": {…} }`.
- Add teaching material: a `note` block with `variant: "teacher"` (or `culture`, `modern-usage`)
  and `"editorial": { "status": "added" }`.

---

## 7. Checking files

| Command | Checks |
|---|---|
| **`npm run validate`** | **all** content: every file against its schema, ids, references, word registry, Benga spelling, old audio ids |
| `npm test` | the rules themselves work (schemas, helpers, the validator's checks) |
| `npm run words:check` | every Benga word on the site is in the word registry |

Run `npm run validate` after **every** content change. It reads `chapters-index.json`, the word
registry, every lexicon file (`src/data/lexicon/*.json`), section (`src/data/sections/**`) and
exercise file (`src/data/exercises/*.json`), and the Benga words on the current pages.

### Reading the report

```
✓ Files follow their rules (src/data/schemas)          ← group with no problems
✗ Ids are correct and unique (1)                        ← group with problems (count)
  ✗ src/data/lexicon/nouns.json → entries.ndonga        ← file → place in the file
      Id "ndonga" doesn't match its word "Ndonda" (expected "ndonda")
      Fix: Rename the entry to "ndonda" (ids are computed with toAudioId)
⚠ Benga spelling … (1)
  ⚠ src/data/lexicon/other.json → entries.roka
      "Roka" contains R (not a Benga letter)
ℹ Hand-typed audio ids left in old page data (21)

✗ 1 error(s), 1 warning(s), 21 note(s)
```

| Mark | Level | What to do |
|---|---|---|
| ✗ | **error** | Must be fixed. The command fails (exit code 1), so it can block a commit or a publish later (roadmap 9.2). |
| ⚠ | **warning** | Probably wrong: a human checks it against the book, then fixes it or logs it in `docs/REVIEW-LOG.md`. |
| ℹ | **note** | Known, harmless leftovers (old hand-typed audio ids). They disappear when content moves to the lexicon. |

Long groups show 10 lines; `npm run validate -- --all` shows everything.

### What is checked

| Group | Checks |
|---|---|
| Files follow their rules | each file against its schema; files that aren't valid JSON (with the position of the mistake) |
| Ids | lexicon id = word key of its base word; no id in two lexicon files; `~2` homonyms have a first word; unique section / exercise ids; no repeated section id or URL in the chapter index |
| References | section blocks (`examples`, `vocabulary`, `conjugation`) only use lexicon ids that exist; exercises belong to an existing section; `sectionFile` / `component` in the chapter index exist |
| Word registry | its schema; each key still matches its word; `audioFile` only on recorded words |
| Benga spelling | in the lexicon, sections and current pages: `c q r x z ñ` and the Spanish accents `á é í ó ú` |
| Old audio ids | typed ids next to words in old page data that differ from the rule |
| Dictionary workspace | schema of `src/data/dictionary/*.json`, links between entries, senses and sentences (errors), unknown part-of-speech / domain codes and site links (warnings), Spanish accents or non-Benga letters (notes only: the dictionary's spelling is never corrected by rule) |

The schemas live in `src/data/schemas/`; correct example files are in `src/data/schemas/examples/`.
In VS Code you can hover a field in a schema to read its description.

## 8. The dictionary workspace (`dictionary.schema.json`)

A local copy of the Benga Living Dictionary that the admin `/admin/living-dictionary` edits and
syncs (plan: [LD-ROADMAP.md](LD-ROADMAP.md)). It is separate from the book lexicon above: the two
are linked word by word through the word registry and never overwrite each other.

| File | `kind` | What it holds |
|---|---|---|
| `src/data/dictionary/entries.json` | `entries` | every dictionary word: `lexeme`, `senses` (glosses es/en/fr, `partsOfSpeech`, `semanticDomains`, `nounClass`, `pluralForm`, `sentenceIds`…), `audio`, `relations`, plus local fields `siteKeys`, `review`, `suggestions`, `sync` |
| `src/data/dictionary/sentences.json` | `sentences` | example sentences: `text` (Benga), `translations`, `translationStatus` (`machine` / `reviewed` / `published`), `audio`, `senseIds` + the same local fields |
| `src/data/dictionary/base.json` | `base` | the dictionary exactly as last read (no local fields): comparing it with the workspace shows what you changed |
| `src/data/dictionary/vocab/*.json` | — | lists with Spanish labels: parts of speech, semantic domains, relation types, review categories |

Rules:

- Keys are the Living Dictionaries ids (UUID). New words get a fixed id (uuid5), so sending them
  twice never duplicates them.
- Benga text is copied exactly as the dictionary has it: never "corrected" by a rule. Doubts go in
  `review` (a plain question) or in `docs/REVIEW-LOG.md`.
- Claude's proposals go in `suggestions` and only become values when a person accepts them.
- `sync.state`: `synced` · `local-changes` · `new` · `conflict` · `error`.
- Example: `src/data/schemas/examples/dictionary-entries.example.json`.

### The forms (phase L4)

Click a row of the tables (the filters stay in «Volver») or «Añadir palabra» / «Añadir oración»:

| Route (under `/admin/living-dictionary`) | Page | Cards |
|---|---|---|
| `entrada/:id`, `entrada/nueva` | `views/admin/ld/EntryForm.vue` | checklist · Palabra · one Sentido per meaning · Audio · Ejemplos · Más campos · Relaciones · Imagen · Revisión y sugerencias · En la web |
| `oracion/:id`, `oracion/nueva` | `views/admin/ld/SentenceForm.vue` | Oración · Traducciones (with status) · Audio · Palabras (linked senses) · Citas · Revisión y sugerencias |

How they work (cards are in `views/admin/ld/form/`, all collapsible):

- The page edits a copy of the record (`draft`, `form/formMixin.js`); a card never changes its props,
  it sends `set(path, value)` (paths like `senses[0].glosses.fr`, `src/utils/dictionaryPaths.js`).
  Saving is a PUT with the record's `sync.version` (409 → «Recarga»). Leaving with unsaved changes
  asks first.
- **Examples** and **audio / pictures** are saved at once, because they are records (or files) of
  their own: linking a sentence saves the *sentence* (the server keeps `sense.sentenceIds` and
  `sentence.senseIds` in step) and the form re-reads the links.
- **New audio / pictures** go through `POST /__dev/ld/entries|sentences/:id/media`
  (`{ kind, senseId?, fileName, dataBase64, speakerId?, … }`; audio ≤ 25 MB, photos ≤ 10 MB, rules in
  `src/utils/mediaRules.js`). The file is kept in `ld-sync/pending-media/<uuid>.<ext>` (git-ignored)
  and the record gets an item with `storagePath: null` and `pendingFile`, shown as «pendiente de
  enviar». Phase L6 sends them. Only pending items can be removed here. Playback: Cloudinary
  (`audio.cloudinary`) → `LD_MEDIA_BASE/<storagePath>` → the local file (`GET /__dev/ld/pending-media/<file>`).
- **Suggestions** (`entry.suggestions`: `{ id, field, value, reason, by, at }`): Aceptar writes `value`
  at `field` in the form and a line in the local `history` (`{ at, field, from, to, by: 'human',
  action: 'accepted-suggestion' }`); Rechazar logs `rejected-suggestion` (its `to` is the proposal
  that was NOT applied). Logic: `src/utils/dictionarySuggestions.js`.
- **Checks** (`src/utils/dictionaryChecks.js`): the checklist at the top, orthography warnings (letters
  `c q r x z ñ` and `á é í ó ú` in the headword, plural, variant and sentence text: warnings only,
  never corrected), and the read-only card «En la web» (site words from `siteKeys`, the pages that
  use them from `word-usage.json`, book gloss from `lexicon/nouns.json` / `adjectives.json` next to
  the dictionary's).
