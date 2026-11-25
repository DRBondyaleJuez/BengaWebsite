# Sending words to the Living Dictionary (proposal + how-to)

Goal: give the tool **a spreadsheet and a folder of labelled audio files**, and it creates the
Benga words in [livingdictionaries.app/benga](https://livingdictionaries.app/benga) with their
translation, part of speech, semantic field, noun class, plural, example sentence and recordings,
without typing them one by one in the website.

## 1. Is it possible? Yes

Living Dictionaries has an official **Write API** (`https://livingdictionaries.app/api/v1`) that
"can do anything a human editor can": create entries, senses, example sentences, upload audio
for a word or a sentence, set speakers and sources. Findings (checked 2026-11-24):

| Question                        | Answer                                                                                                                                                                                                                                                      |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Who can give access?            | A **manager** of the Benga dictionary. On `https://livingdictionaries.app/benga/agents` they create an **API key** (`ldk_…`), _read_ or _read & write_.                                                                                                     |
| What can the key do?            | Only that one dictionary. It can be deleted on the same page at any time.                                                                                                                                                                                   |
| Words, translations, categories | Yes: `lexeme`, glosses per language (`es`, `en`, `fr`), parts of speech (`n`, `v`, `adj`…), semantic domains (keys like `5.3`), noun class, plural, notes, sources.                                                                                        |
| Example sentences               | Yes, inside the meaning, with translations.                                                                                                                                                                                                                 |
| Audio                           | Yes, one call per file (max 25 MB), for a word or for a sentence. **Every recording must name a speaker** (a real person registered in the dictionary) **or a source**; the API refuses invented placeholder speakers, and so does this tool.               |
| Duplicates                      | Each entry gets a fixed id calculated from the word, so sending the same sheet twice creates nothing new.                                                                                                                                                  |
| Other routes                    | (a) The website's _Import_ page: upload a spreadsheet and the Living Dictionaries team imports it for you (slower, they ask questions). (b) Typing each word in the website. The API route is the only one that also uploads the audio files automatically. |

Their guide for importers ([/api/v1/guides/importing](https://livingdictionaries.app/api/v1/guides/importing))
insists on checking the data **before** writing, showing a human preview, never overwriting
someone's existing entries, and keeping every batch traceable. The tool below follows that.

## 2. How the MVP works

```
 your folder                         npm run ld:import -- <folder>            npm run ld:import -- <folder> --send
┌──────────────────────┐            ┌──────────────────────────────┐          ┌───────────────────────────────────┐
│ palabras.csv         │──reads───► │ checks every row             │──ok────► │ checks speakers, languages, source │
│ epokolo.mp3          │            │ ld-import/preview.html  ◄─── │ you look │ skips words already in the dict.   │
│ bokolo-bokolo.mp3 …  │            │ ld-import/payload.json       │  at it   │ sends entries (batches of 200)     │
└──────────────────────┘            │ nothing is sent              │          │ uploads each audio                 │
                                    └──────────────────────────────┘          │ writes ld-import/ledger.json       │
                                                                              │ links the words in word-registry   │
                                                                              └───────────────────────────────────┘
```

1. **Prepare a folder** with one spreadsheet and the audio files it names. In Excel: _File → Save
   as → CSV UTF-8 (comma delimited)_. Columns in section 3; example:
   `scripts/imports/living-dictionary/ejemplo/` (its audio files are only test beeps: never send it).
2. **Check:** `npm run ld:import -- "C:\path\to\folder"`. It prints the problems and writes
   `ld-import/preview.html` in the folder: open it, read every card, listen to the audio.
   Errors (red) block sending; warnings (yellow) are things to look at.
3. **Send:** add `--send`. Before writing anything it checks the key, the dictionary's
   translation languages, that every speaker exists and that the citation source exists. Then:
   - a word that **already exists** in the dictionary is **not touched** (listed at the end);
   - new words are created in batches, tagged with a batch label (`benga-portal-<date>`) so the
     Living Dictionaries team can find or undo the whole batch;
   - each audio is uploaded to its word or to its example sentence, with its speaker;
   - `ld-import/ledger.json` records what was sent: if the run stops (no internet), run the same
     command again and it continues where it stopped;
   - the site's `word-registry.json` gets the dictionary id of each word, so the word's
     dictionary link on the website opens its exact entry (existing ids are never replaced).

## 3. Spreadsheet columns

Only `word` and one translation are required. Column names must be exactly these (any order).

| Column                                 | What goes in it                                                                                                                                      | Example                 |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `word`                                 | The Benga word or phrase, with â ē ū                                                                                                                 | `Epokolo`               |
| `homograph`                            | Only for two different words spelled the same: `1`, `2`…                                                                                             |                         |
| `plural`                               | Plural form                                                                                                                                          | `Bepokolo`              |
| `gloss_es`, `gloss_en`, `gloss_fr`     | Translation in each language                                                                                                                         | `Sombrero`              |
| `part_of_speech`                       | Code or name, Spanish or English: `n`/`sustantivo`, `v`/`verbo`, `adj`/`adjetivo`, `adv`, `pro`, `prep`, `conj`, `int`, `num`, `phr`/`frase`… Several: `n; adj` | `sustantivo`            |
| `semantic_domain`                      | Key or name (Spanish or English) from the list in section 4. Several: `5.3; 1.4`                                                                     | `Ropa y adornos` or `5.4` |
| `noun_class`                           | Benga noun class                                                                                                                                     | `1`                     |
| `example`                              | Example sentence in Benga                                                                                                                            | `Bokolo bokolo`         |
| `example_es`, `example_en`, `example_fr` | Its translation                                                                                                                                    | `Muy duro`              |
| `audio`                                | File name of the word's recording, in the folder                                                                                                     | `epokolo.mp3`           |
| `example_audio`                        | File name of the sentence's recording                                                                                                                | `bokolo-bokolo.mp3`     |
| `speaker`                              | Name of the speaker, **exactly as registered in the dictionary** (create them first on the dictionary's contributors page)                         | `Ana Mba`               |
| `notes`                                | Free note shown on the entry                                                                                                                         |                         |
| `book_page`                            | Page of the Salvado y Cos book (used with `--cite`)                                                                                                  | `14`                    |

Audio formats: mp3, wav, m4a, ogg, webm, flac (max 25 MB). Naming the files with the site's audio
id (`epokolo.mp3`, `ek_a_i-ebe.mp3`) keeps them consistent with Cloudinary, but any name works
because the sheet says which file belongs to which word.

Checks made on every row: the word exists and has a translation; letters that are not Benga
(`c q r x z ñ`) or Spanish accents (`á é ú` instead of `â ē ū`); unknown part of speech or
semantic field (sent as free text, with a warning); audio files exist, are audio and are not too
big; the same word twice without a homograph number.

## 4. Semantic fields (Living Dictionaries list)

Write the key or the name. The full list with English and Spanish names is `SEMANTIC_DOMAINS` in
`scripts/lib/living-dictionary.mjs`. Main groups: `1` Universe and nature (`1.4` plants, `1.5`
animals, `1.7` birds, `1.8` fish…), `2` People (`2.1` body parts, `2.6` kinship…), `3` Language
and mind, `4` Names, `5` Daily life (`5.1` household, `5.3` food, `5.4` clothing, `5.11` hunting
and fishing…), `6` Physical actions (`6.5` states and characteristics), `7` Quantities (`7.1`
numerals), `8` Time, `9` Location and directions, `10` Grammar.

## 5. Setting up access (once)

1. A manager of the Benga dictionary opens `https://livingdictionaries.app/benga/agents` and
   creates a **read & write** key.
2. Add it to `.env.local` in the project root (git-ignored, never committed; paste it there
   yourself rather than in a chat):

   ```
   LD_API_KEY=ldk_...
   LD_DICTIONARY_ID=benga
   ```

3. Register the speakers on the dictionary (real people who agreed to appear; name, age range,
   place). The tool looks them up by name and never creates them.
4. Optional, to cite the book: create a source in the dictionary (e.g. slug `salvado-y-cos-1891`)
   and send with `--cite salvado-y-cos-1891`; `book_page` becomes "p. 14".
5. **First real test:** a sheet with 2–3 words. Check them on the website, then send the rest.

If something goes wrong: the key can be deleted on the Agents page; every entry of a run has the
batch label printed at the end, which the Living Dictionaries team can use to find or remove it.

## 6. Proposed next steps (to build together)

| Step                              | What                                                                                                                                                                                                                    |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A. MVP (done)**                 | `npm run ld:import`: CSV + audio folder → checks → preview → send, resumable, linked back to the site.                                                                                                                  |
| B. Admin page                     | `/admin/living-dictionary` (dev only, like `/admin/audios`): choose the folder, edit rows in a table, preview and «Enviar» button, progress bar.                                                                         |
| C. Excel directly                 | Read `.xlsx` without saving as CSV (needs a library such as `exceljs`).                                                                                                                                                 |
| D. Read the dictionary            | Download the whole dictionary (the API offers a SQLite snapshot) to fill every `livingDictionaryId` automatically and to show in `/admin/palabras` which site words are missing from the dictionary.                   |
| E. Send the site's own words      | Turn `lexicon/nouns.json` and `adjectives.json` (≈460 words of the book, with es/en/fr meanings, class, plural, book page) into a sheet for this tool, cited to Salvado y Cos. Needs care with words the dictionary already has. |
| F. Reuse audio                    | Send the recordings made in `/admin/audios` (Cloudinary) to the matching dictionary entries in the same run.                                                                                                            |
| G. Play dictionary audio on site  | Use recordings made in the dictionary on the website (idea, 2026-11-25). See section 7.                                                                                                                                  |

## 7. Idea: play the dictionary's audio on the website

Checked in the API docs on 2026-11-25:

- Every read call needs the `ldk_…` key. An audio comes back as a `storage_path`. The file is
  fetched with `GET /api/v1/dictionaries/{id}/media/{storage_path}`, which also needs the key and
  then redirects to the file in storage. A page's `<audio>` tag cannot send the key, and the key
  must never be in the website's code (anyone could read it). So the site **cannot point straight
  at the API**.
- The public snapshot (`https://snapshots.livingdictionaries.app/dictionaries/{id}.db.gz`, no key)
  lists the audio rows but has no file URLs.
- The docs don't say whether the storage address the redirect lands on is public and permanent.
  The audio format and any limit on reusing the files elsewhere aren't stated either. The
  dictionary asks to credit the dictionary and the Living Tongues Institute and to link back,
  because the recordings are of real named people.

Possible designs, to decide once there is a key to test with:

1. **Copy at build time (recommended).** A script (`npm run ld:pull-audio`) runs on the
   developer's computer with the key, downloads each linked word's audio and uploads it to
   Cloudinary under the word's audio id. The registry is then marked `recorded`. The site keeps
   using Cloudinary (fast, mp3, no key in the browser), and the dictionary becomes the place
   where recordings are made. The credit line would name the speaker.
2. **Store the storage address.** If the redirect target turns out to be public and permanent, the
   script saves that address in the registry (e.g. an `audioUrl` field) and `getAudioUrl()`
   uses it. That means no second copy, but it depends on Living Dictionaries' storage never
   changing.
3. **A server in between** that adds the key. This doesn't work for a static site, so it isn't
   an option today.

Sources: [Living Dictionaries API](https://livingdictionaries.app/api/v1),
[importing guide](https://livingdictionaries.app/api/v1/guides/importing),
[media guide](https://livingdictionaries.app/api/v1/guides/media),
[API basics](https://livingdictionaries.app/api/v1/guides/api-basics),
[llms.txt](https://livingdictionaries.app/llms.txt),
[semantic domains](https://github.com/livingtongues/living-dictionaries/blob/main/site/src/lib/mappings/semantic-domains.ts).
