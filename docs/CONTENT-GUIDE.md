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
| `src/data/schemas/*.schema.json` | **the rules** each file must follow | only when the model changes |

**Why split lexicon and registry?** The lexicon describes *words* (Epokolo and Bepokolo are
one noun). The registry describes *sounds and links* (each form has its own recording).
One noun → one lexicon entry → two registry keys (`epokolo`, `bepokolo`).

---

## 2. Shared pieces (`common.schema.json`)

### Translated text — `{ "es": …, "en": …, "fr": … }`

Every text a visitor reads is an object with one value per language. **Spanish is required**;
English and French are added in Phase 4. If a language is missing, the site shows Spanish
(helper `localized()` in `src/utils/localized.js`, task 2.2).

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
  "nounClass": 1,                          // 1-7, or "irregular"
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
- Upper-case ids, noun class 8, conjugation 5, a text without `es`, unknown fields.

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
| `pattern` | prefix change box | `from`, `to` | `{ "type": "pattern", "from": "e-", "to": "be-" }` |
| `examples` | word cards | `entries` (lexicon ids) **or** `items` | `{ "type": "examples", "entries": ["epokolo"] }` |
| `table` | a table | `columns`, `rows` | cell = `"text"`, `{ "es": … }` or `{ "benga": "Epokolo eyamu" }` |
| `note` | highlighted box | `variant`, `text` | variants: `info`, `exception`, `warning`, `teacher`, `culture`, `modern-usage` |
| `concepts` | concept cards | `items` [{title, text}] | «Conceptos Clave» |
| `practice` | numbered tips | `items` [text] | «Para Practicar» |
| `conjugation` | verb table | `verb`, `voice`, `polarity`, `tenses` | see `examples/section-verb-kalaka.example.json` |
| `dialogue` | phrases + translation | `lines` [{benga, translation}] | fraseología, saludos |
| `vocabulary` | word list | `entries` (lexicon ids) | «Vocabulario» pages |

`examples.layout`: `pairs` (singular + plural, default), `single`, `plural-only` (badge «Solo plural»).
Every block may also have `id` (anchor), `source` and `editorial`.

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
4. Add the section to `src/data/chapters-index.json` (and its title key to `src/locales/es.json`).
5. Run the checks: `npm test`, `npm run words:sync`, then open the page.

### Correct or amplify the book

- Fix a word or text: change it and add `"editorial": { "status": "corrected", "bookText": "…", "note": {…} }`.
- Add teaching material: a `note` block with `variant: "teacher"` (or `culture`, `modern-usage`)
  and `"editorial": { "status": "added" }`.

---

## 7. Checking files

| Command | Checks |
|---|---|
| `npm test` | the schemas compile, the examples follow them, `chapters-index.json` follows its schema, typical mistakes are rejected |
| `npm run words:check` | every Benga word on the site is in the word registry |
| *(task 2.3)* `npm run validate` | **all** content files against the schemas, plus ids = word keys, references point to existing entries, orthography |

The schemas live in `src/data/schemas/`; correct example files are in `src/data/schemas/examples/`.
In VS Code you can hover a field in a schema to read its description.
