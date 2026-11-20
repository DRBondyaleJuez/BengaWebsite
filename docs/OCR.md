# The improved OCR of the book

`public/downloads/IMPROVED-salvado-y-cos-gramatica-benga.pdf` is the original scan with a **new
invisible text layer**: every word sits on top of the printed word, so you can search
(Ctrl+F), select and copy text, and `pdftotext` reads it.

```
original PDF ──► page image (3x) ──► Tesseract (spa + Latin, 3 layouts) ──► accent fixes ──► new text layer
                                                                              │
                                                    docs/ocr/ocr-doubts.csv ◄─┘ (words it is not sure about)
```

## What is better, what is not

- **Benga letters.** The book prints Benga words in italics with `â ē ū`. The old text layer had
  **none** of them (it turned them into `á`, `d`, `ñ`…). The new layer has `â ē ū` in about
  3 000 words, e.g. *Yâkâ*, *Yēkē*, *Ebokūedi*.
- **Known words are spelled right.** Every OCR word that matches a Benga word of the site
  (word registry + lexicon, ~900 words) once accents are ignored gets the site's spelling;
  Spanish words with a wrong accent are fixed with Tesseract's Spanish dictionary.
- **Spanish text is about as good as before.** The scan is small (966 × 1354 px per page),
  so the OCR still misreads some letters. Unusual and damaged words stay wrong.
- **Not checked by a person.** Use it to *find* things; check the scan before copying a word
  into the site (AGENTS.md → Source of Truth).

## The rules that change OCR words (`correct_word` in `scripts/ocr-pdf.py`)

| Rule | Example |
|---|---|
| Letters that never appear in the book are replaced | `Yahħo` → `Yaho` |
| Known Spanish word (or old spelling: `á`, `ó`, `fué`, `dió`…) stays | `Acción` |
| Known Benga word gets the site's spelling | `Ebokuedi` → `Ebokūedi` |
| Spanish word with a wrong accent is fixed | `Acciôn` → `Acción` |
| Unknown word with `á é ú` and none of `c q r x z ñ í ó` (letters Benga never uses) is taken as Benga | `Yákú` → `Yâkū`, but `Adviértase` stays |

The last rule is a guess: those words are in the doubts list when Tesseract was unsure.

## The doubts list

`docs/ocr/ocr-doubts.csv` (opens in Excel): one row per word with confidence below 60 % that is
neither a known Spanish nor a known Benga word. Columns: `pdf_page`, `ocr_read` (what Tesseract
saw), `written_in_pdf` (after the rules), `confidence`, `kind`. Sort by page and check the ones
in the section you are working on.

## Correcting the doubts: `/admin/ocr`

During `npm run serve`, open <http://localhost:8080/admin/ocr> (it doesn't exist on the
published site):

- Filter by PDF page, type («probablemente benga» / «desconocida»), status or text.
- Click the **page number** of a word: the PDF page opens on the right with that word framed
  in red (other doubtful words of the page in yellow). Zoom with − / +.
- Type the right form in **Corrección** (buttons `â ē ū Â Ē Ū` write those letters at the
  cursor) and a **Comentario** if useful, then **Guardar cambios**.
- Corrections are saved in `docs/ocr/ocr-corrections.json` (key = word id, e.g. `p19-w156`).
  To put them into the PDF's text layer: `python scripts/ocr-pdf.py --reuse` (seconds; it reuses
  the saved OCR in `.ocr-cache/`). If the PDF is open in a viewer (Windows locks it), the new PDF
  is written to `.ocr-cache/` instead: close the viewer and run the command again.

`docs/ocr/ocr-doubts.csv` now also has the word `id` and its box on the page (`x0 y0 x1 y1`,
points from the top-left corner), which is how the page finds the word.

## Running it again

Do this after the lexicon grows (more known words → better spelling), or to tune the rules.

1. Install once:
   - Tesseract 5: `winget install UB-Mannheim.TesseractOCR`
   - Models from [tessdata_best](https://github.com/tesseract-ocr/tessdata_best) into
     `C:\Users\<you>\tessdata`: `spa.traineddata` and `script/Latin.traineddata`
     (Latin is the one that knows `â ē ū`). Copy `configs` and `tessconfigs` from
     `C:\Program Files\Tesseract-OCR\tessdata` into the same folder.
   - `pip install pymupdf`
2. `python scripts/ocr-pdf.py` (about 20 minutes) or `python scripts/ocr-pdf.py --pages 9,16`
   to test a few pages (writes `*-TEST` files; delete them afterwards).
3. Compare a few pages with the scan before committing the new PDF.
