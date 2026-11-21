# Audio guide: recording, naming, uploading

How a Benga word or phrase gets its pronunciation on the site. No recordings exist yet; this is the
process for making them.

```
word-registry.json ──► npm run audio:checklist ──► docs/audio/recording-checklist.csv
                                                              │  speaker records
   site ◄── word-registry.json ◄── npm run audio:sync ◄── Cloudinary ◄── upload <audioId>.mp3
        (play button appears)     (audio: "recorded")
```

## 1. What to record

1. Run `npm run words:sync` so every word on the site is in the registry.
2. Run `npm run audio:checklist`. It writes `docs/audio/recording-checklist.csv` (open it in Excel or
   Google Sheets). Columns:

   | Column     | Meaning                                                                          |
   | ---------- | -------------------------------------------------------------------------------- |
   | `word`     | The word or phrase as the site spells it                                         |
   | `audioId`  | **The file name to record** (without `.mp3`)                                     |
   | `type`     | `word` or `phrase` (a phrase has several words, e.g. an example sentence)       |
   | `meaning`  | Spanish meaning, when the word is a lexicon entry                                |
   | `bookPage` | PDF page of the book (printed page = PDF page + 6)                               |
   | `usedIn`   | Files where the word appears                                                     |
   | `recorded` | `yes` / `no`; rows still to record come first                                    |

Words that appear on no page yet (`usedIn` empty) can be left for later.

## 2. Format and naming

- **Format:** MP3, mono, 44.1 kHz, about 128 kbps. One word or phrase per file, with a short
  silence (about 0.2 s) at each end and no background noise.
- **Name:** `<audioId>.mp3`, exactly the `audioId` of the checklist, e.g. `Whâki` → `wh_a_ki.mp3`,
  `Ekâi ebe` → `ek_a_i-ebe.mp3`. Never type it by hand: copy it from the CSV. The rule is
  `toAudioId()` in `src/utils/audioId.js` (see AGENTS.md → «Audio ID Convention»).
- **Folders:** single words go to `ndowe-audios/benga-audios/benga-words`, phrases and sentences
  to `ndowe-audios/benga-audios/benga-sentences` (set in `.env.local`). The account uses
  Cloudinary's _dynamic folders_, so the folder is not part of the file's address: every recording
  is played from `CLOUDINARY_BASE/<audioId>.mp3` (`src/config/external.js`), whatever its folder.
  Cloudinary stores audio as resource type _video_.
- **Phrases:** same rule; the whole sentence is one file. The site shows a play button for a phrase
  exactly like for a word (task 5.4).

## 3. Upload and publish

1. Upload the files to Cloudinary (Media Library → Upload; keep the file names, do not let
   Cloudinary add random suffixes: _Unique filename_ on, _Overwrite_ on).
2. Create `.env.local` (git-ignored, **never commit it**) with the keys of the Cloudinary
   dashboard → _API Keys_:

   ```
   CLOUDINARY_CLOUD_NAME=dp5rofjyx
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   CLOUDINARY_WORDS_FOLDER=ndowe-audios/benga-audios/benga-words
   CLOUDINARY_SENTENCES_FOLDER=ndowe-audios/benga-audios/benga-sentences
   ```

   (`CLOUDINARY_URL=cloudinary://<key>:<secret>@dp5rofjyx` works instead of the first three.)
   These variables do not start with `VITE_`, so Vite never puts them in the website: only the
   npm scripts and the dev server read them. If the secret is ever exposed, create a new key in
   Cloudinary (Settings → API Keys), delete the old one and update `.env.local`.

3. Run `npm run audio:sync`. It lists the files in Cloudinary and sets `"audio": "recorded"` in
   `src/data/lexicon/word-registry.json` for each word that has one. It also tells you about files
   that match no word (usually a typo in the file name).
   - `npm run audio:sync -- --check` only reports.
   - `npm run audio:sync -- --unmark` also sets words whose file disappeared back to `missing`.
   - `npm run audio:sync -- --list names.txt` uses a text file of names instead of Cloudinary.
4. Run `npm run validate`, then commit `word-registry.json` (`feat(audio): add recordings of …`).

Only words marked `recorded` get a play button, so the site never links to a missing file.

## 3b. The easy way: /admin/audios

While `npm run serve` is running, open **http://localhost:8080/admin/audios** (it does not exist in
the published site). With the three Cloudinary keys in `.env.local` (step 3.2) it:

- lists every word and phrase and checks which have a file in Cloudinary (and whether the
  registry agrees; «Marcar como grabadas las que ya están» fixes the registry in one click),
- plays the file of each word,
- **records** a word with the microphone (allow it in the browser), lets you listen to the take,
  and **uploads** it under the word's audio id, replacing an older one; or uploads an audio file
  you already have (**Subir archivo**). The word is marked `recorded` automatically,
- shows the space used: the size of the audio files and the account storage and credits Cloudinary
  reports (it cannot measure one folder on its own).

The browser records WebM/Opus (Safari: MP4); Cloudinary stores it and converts it to MP3 when the
site asks for `<audioId>.mp3`, so no editing is needed. The key and secret stay on this computer:
the page talks to the dev server (`scripts/lib/audio-admin.mjs`), which talks to Cloudinary.

## 4. Replacing a recording

Upload the new file with the **same name** and _Overwrite_ on. Cloudinary caches files: if the old
sound is still played, upload with a new name instead (e.g. `epokolo-2.mp3`), put that name in the
word's `audioFile` field (at `/admin/palabras`) and commit.

A word that must use a file with a different name (for example one recorded for a variant
spelling) also uses `audioFile`.

## 5. Playing

`BengaWord` plays the file through the single shared player (`src/services/audioPlayer.js`): only
one sound plays at a time. Example tables have a «play all» button that plays their words one after
another (task 5.4).
