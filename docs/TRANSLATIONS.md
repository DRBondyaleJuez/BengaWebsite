# Translations (Spanish → English, French)

The site is written in **Spanish** (the language of Salvado y Cos's grammar) and translated into
**English** and **French**. The visitor picks the language in the header; the choice is remembered
in the browser (`localStorage`, key `app-language`) and sets `<html lang>`.

**Only Spanish is translated. Benga words are never translated**: `Ekâi`, `Bova`, `Pēki Pēki`,
prefixes like `be-` or `ma-` stay exactly as they are in every language, because they are what the
site teaches.

## 1. Where the texts live

There are two kinds of text, kept in two kinds of file.

### a) Interface and page texts → `src/locales/es.json`, `en.json`, `fr.json`

Buttons, menus, headings and the explanatory paragraphs of the hand-made pages (home, author,
resources, the chapter index pages, the alphabet, the chapter-3 pages…).

The three files have **the same keys in the same order**; only the text after the colon changes:

```jsonc
// es.json                                   // en.json
"content": {                                 "content": {
  "singular": "Singular",                      "singular": "Singular",
  "pluralOnly": "Solo plural",                 "pluralOnly": "Plural only",
```

Groups of keys:

| Group | What it holds |
|---|---|
| `app`, `nav`, `accessibility`, `chapters`, `content` | Shared interface: header, menu, sidebar, words used on many pages |
| `pages.<page>.<key>` | Texts of one page, in the order they appear (e.g. `pages.verbalNouns.…`) |
| `components.<component>.<key>` | Texts of one shared component (footer, chapter navigation…) |

Key names are short versions of the Spanish text (`pages.chapter1Index.capitulo2Proximamente`), so
you can find a text by searching for its words. In the page templates a text appears as
`$t('pages.home.welcome')`.

Special signs inside a message:

| You see | Meaning | Translate? |
|---|---|---|
| `{number}`, `{name}`, `{letter}` | Filled in by the page (e.g. `Clase {number}` → «Clase 3») | Keep exactly, move it where the language needs it |
| `<strong>…</strong>`, `<em>…</em>`, `<br>` | Bold, italics, line break | Keep the tags, translate the words between them |
| `{'@'}` | A literal `@` (the `@` alone has a special meaning for vue-i18n) | Keep |

### b) Content → the data files in `src/data/`

The meanings of the Benga words (`lexicon/nouns.json`, `lexicon/adjectives.json`), the section
files (`sections/ch-N/*.json`) and the chapter data (`chapter-1/`, `chapter-2/`, `chapter-3/`,
`author-info.json`). Every visitor text is an object with one entry per language; Benga words are
plain strings next to it:

```json
"epokolo": {
  "singular": { "word": "Epokolo" },
  "plural":   { "word": "Bepokolo" },
  "meaning":       { "es": "Sombrero",  "en": "Hat",  "fr": "Chapeau" },
  "meaningPlural": { "es": "Sombreros", "en": "Hats", "fr": "Chapeaux" }
}
```

`word` is Benga (not translated); `meaning` is Spanish with its translations.

## 2. What the visitor sees when a translation is missing

The Spanish text. Nothing breaks: a missing key in `en.json` or a missing `"en"` in a data file
just falls back to Spanish (`fallbackLocale: 'es'` in `src/main.js`; `$localized()` and
`localizeDeep()` in `src/utils/localized.js` for the data).

## 3. How to check what is translated

```
npm run i18n:report            # summary per language and per file
npm run i18n:report -- --all   # every missing text, with its key or its place in the file
```

It also reports keys whose `{parameters}` differ from Spanish (a typo there would show «{numero}»
on the page) and keys that exist only in `en.json` / `fr.json` (left over, can be deleted).

## 4. How to change or add a text

- **Fix a translation:** edit the `en` / `fr` text (locale file or data file). Nothing else to do.
- **Change a Spanish text:** change it in Spanish **and** update `en` and `fr`, otherwise they keep
  saying the old thing (the report cannot notice that a translation is outdated).
- **New interface text:** add the key to `es.json`, use `$t('…')` in the page, then add the same key
  to `en.json` and `fr.json`. Run `npm run i18n:report`.
- **New content text:** write `{ "es": "…" }` in the data file and add `"en"` and `"fr"` when you
  can. Run `npm run i18n:report` and `npm run validate`.
- **Never** put a Benga word inside `{ "es": … }` to "translate" it, and never translate the
  Benga fields (`word`, `bengaForm`, `bengaSentence`, `imperative`, …).

## 5. Review status

The English and French texts are a **first draft made by AI** (November 2026, roadmap tasks 4.4
and 4.5). Each unique Spanish text was translated once and reused everywhere, so the same phrase
reads the same on every page. A human who knows the language should review them; tick a row when
it is reviewed and note who did it (REVIEW-LOG R-035).

| Part | English | French |
|---|---|---|
| Interface and pages (`src/locales/*.json`) | ☐ draft | ☐ draft |
| Noun meanings (`lexicon/nouns.json`) | ☐ draft | ☐ draft |
| Adjective meanings (`lexicon/adjectives.json`) | ☐ draft | ☐ draft |
| Chapter 1 (`sections/ch-1`, `chapter-1/alphabet.json`) | ☐ draft | ☐ draft |
| Chapter 2 (`sections/ch-2`, `chapter-2/*.json`) | ☐ draft | ☐ draft |
| Chapter 3 (`sections/ch-3`, `chapter-3/*.json`) | ☐ draft | ☐ draft |
| Author page (`author-info.json`) | ☐ draft | ☐ draft |

### Doubtful translations

Spanish glosses that were hard to translate (old words, possible OCR errors). Check them first.

- «vara» → rod / bâton (could be "staff" or "measuring rod").
- «banco, margen» (diphthong example) → bank, margin / banc, bord: which sense of «banco» (river bank or bench)?
- «cabellos» → hair / cheveux.
- «úe en 'acentiúe'»: the Spanish looks like a typo for «acentúe» (fix the Spanish too).
- «Patrón Variant:» mixes Spanish and English in the Spanish text → "Variant Pattern" / «Schéma variant».
- «Ubapami, portador» → bearer / porteur.
- «Cambia si cambia la clase del sustantivo al cambiar de género»: awkward Spanish, translated literally.
- Imperatives of the verbal nouns («ama tú», «edifica tú»…) → "love (you)" / « aime (toi) »: literal, a reviewer may prefer "love!" / « aime ! ».
- «edificio» → building / édifice (or « bâtiment »).
- «adjuntos» (words that agree with the noun) → adjuncts / adjoints: a linguist may prefer "agreeing words" / « mots accordés ».
- Sentences split around bold words (chapter-3 index, regular adjectives page): the pieces keep the Spanish word order; read them on the page.
- Class headings spelled differently in different places (`u-/mú-` vs `u-/mū-`, `bo-/ba-` vs `bo-/bū-`): Spanish source to check, the translations copy them.
- Noun *vi_a_* «Sueño» → Dream / Rêve (could be "sleep" / « sommeil »).
- Noun *m_u_anga* «Rebaño, huerto»: «huerto» → garden / jardin (vegetable garden / potager?).
- Adjective *kopia* «Prieto, avaro»: «prieto» → tight / serré (old Spanish «prieto» also means "dark"; next to «avaro» it means "stingy").
- Nouns «Torpedo» (*dimya*: probably the electric ray fish, not the weapon) and «Nigua» (*diso*: chigoe flea / chique).
- Noun «Vihuela» (*m_u_alika*): an old Spanish guitar-like instrument, kept as "vihuela".
- Noun «Despensero» (*tyoli*) → steward / intendant.
- Noun «Diente de marfil» (*wbango*) → ivory tusk / défense d'ivoire.
- Nouns «Bote» (boat or jar?) and «Cajón» (box or drawer?).
- Noun «Temor (clase de)» → Fear (a kind of) / Crainte (une sorte de).
- «Timpano, oido» (missing accents in the Spanish: «Tímpano, oído») → Eardrum, ear.
- «Harpa» (old spelling of «arpa») → harp / harpe.
- «Pólvoras» (*pita*) → gunpowders / poudres.
- «Tiempo, estación» (*egombe*): time or weather? → time, season.
- Odd pairs of meanings, possibly OCR errors in the Spanish: «Tarea, hierba», «Respeto, arco» (*epambo*), «Timón, abanico», «Vidriado, loza», «Cera, capa», «Hato, racimo». Translated literally.
- «Cardialgía, dolor» (*etema*) → cardialgia / cardialgie.
- «Sed» / «Sedes» (*ev_e_l_e_*) → thirst / thirsts.
- Consonants page: the comparisons with sounds of Spanish (hueso, huevo, Huesca…) and of English/French words were kept as examples; check that they still make sense to an English or French reader.
- «Reloj de caja» → case clock / horloge à caisse (longcase clock?).
- «Diligencia» → diligence (care) or stagecoach?
- «Licor, caña» → liquor, cane spirit / liqueur, eau-de-vie de canne.
- «sereno» (alphabet, *y* as a vowel) → serene / serein (could be night watchman or night dew).
- Alphabet: «Matuta é Ibia» vs «Ibiya» in the sentence above it (Spanish source to check).

### Things that stay in Spanish on purpose

- Book titles and the author's name: «Gramática de la lengua Benga», Salvado y Cos.
- References to Spanish spelling ("pronounced as the Spanish *j*"): the book explains Benga sounds
  through Spanish, and the translations keep that comparison instead of inventing an English or
  French one.
- The downloadable PDF is the original Spanish book.
