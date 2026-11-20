"""
Redo the OCR of Salvado y Cos's grammar and write a searchable copy:

    public/downloads/salvado-y-cos-gramatica-benga.pdf            (original scan + old OCR text)
        │  1. render each page (3x the scan size, grey)
        │  2. Tesseract 5, models spa + Latin (Latin knows â ē ū), with word positions + confidence
        │  3. fix accents with two word lists (see correct_word)
        │  4. replace the old invisible text layer by the new one, word by word, on the same spot
        ▼
    public/downloads/IMPROVED-salvado-y-cos-gramatica-benga.pdf   (same images, new text layer)
    docs/ocr/ocr-doubts.csv                                       (words the OCR is not sure about)
    docs/ocr/ocr-corrections.json  ← corrections typed in /admin/ocr; applied to the text layer

Run:   python scripts/ocr-pdf.py                 (all pages, ~20 min: 3 layout modes per page)
       python scripts/ocr-pdf.py --reuse         (seconds: reuse the saved OCR, e.g. after corrections)
       python scripts/ocr-pdf.py --pages 9,16    (PDF pages to test; writes to the scratch name *-TEST.pdf)

Needs (see docs/OCR.md): Tesseract 5 (UB-Mannheim build), spa.traineddata + Latin.traineddata from
tessdata_best in the folder TESSDATA_PREFIX points to (default C:/Users/<you>/tessdata), PyMuPDF.

Why the corrections: the book prints Benga words in italics with â ē ū and Spanish with á é í ó ú,
but the scan is small (966 px wide), so the OCR often confuses â/á/a, ē/é/e, ū/ú/u.
"""

import argparse
import csv
import json
import os
import re
import subprocess
import sys
import tempfile
import unicodedata
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import pymupdf

sys.stdout.reconfigure(encoding="utf-8")  # Windows console: print â ē ū and arrows

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "public/downloads/salvado-y-cos-gramatica-benga.pdf"
TARGET = ROOT / "public/downloads/IMPROVED-salvado-y-cos-gramatica-benga.pdf"
DOUBTS = ROOT / "docs/ocr/ocr-doubts.csv"
CACHE = ROOT / ".ocr-cache/words.json"
# Corrections typed by a person in /admin/ocr (npm run serve): { "corrections": { "p19-w156": {…} } }
CORRECTIONS = ROOT / "docs/ocr/ocr-corrections.json"  # raw OCR per page (git-ignored): --reuse skips Tesseract
TESSERACT = Path(os.environ.get("TESSERACT", "C:/Program Files/Tesseract-OCR/tesseract.exe"))
TESSDATA = Path(os.environ.get("TESSDATA_PREFIX", Path.home() / "tessdata"))
FONT_FILE = "C:/Windows/Fonts/arial.ttf"  # has â ē ū; the text is invisible, only searchable
DPI = 216  # the scan is 72 dpi-sized (966 x 1354 pt = 966 x 1354 px): 3x helps Tesseract
LOW_CONFIDENCE = 60  # below this (0-100) a word goes to the doubts list

# Characters the Latin model sometimes invents that never occur in this book.
JUNK = str.maketrans({"ħ": "h", "ı": "i", "ų": "u", "đ": "d", "ł": "l", "ŀ": "l", "ſ": "s"})
# 19th-century Spanish spellings missing from the modern dictionary («pertenecen á la clase», «fué»).
OLD_SPANISH = {"á", "é", "ó", "ú", "fué", "dió", "vió", "fuí", "ví", "dí", "pié", "piés", "fé"}
PUNCTUATION = re.compile(r"^([^\w]*)(.*?)([^\w]*)$", re.UNICODE)


def plain(word):
    """'Ebokūedi' → 'ebokuedi': lower case without accents (to compare spellings)."""
    decomposed = unicodedata.normalize("NFD", word.lower())
    return "".join(c for c in decomposed if not unicodedata.combining(c))


def same_case(word, model):
    """Writes `word` with the capitalisation of `model` (OCR 'EBOKUEDI' stays upper case)."""
    if model.isupper() and len(model) > 1:
        return word.upper()
    if model[:1].isupper():
        return word[:1].upper() + word[1:]
    return word


# ── Word lists ──────────────────────────────────────────────────────────────


def benga_words():
    """Every Benga spelling the site knows (word registry + lexicon files), keyed by plain form."""
    words = set()
    lexicon = ROOT / "src/data/lexicon"
    registry = json.loads((lexicon / "word-registry.json").read_text("utf8"))["words"]
    words.update(entry["word"] for entry in registry.values())
    for file in lexicon.glob("*.json"):
        if file.name in ("word-registry.json", "word-usage.json"):
            continue
        for entry in json.loads(file.read_text("utf8"))["entries"].values():
            for form in ("singular", "plural"):
                if entry.get(form):
                    words.add(entry[form]["word"])
            if entry.get("word"):
                words.add(entry["word"])
    by_plain = {}
    for phrase in words:
        for word in phrase.split():  # "Pēki Pēki" → two words
            by_plain.setdefault(plain(word), set()).add(word.lower())
    # Only spellings that are unambiguous once accents are removed.
    return {key: spellings.pop() for key, spellings in by_plain.items() if len(spellings) == 1}


def spanish_words(work):
    """Tesseract's Spanish dictionary (≈180 000 words) as {plain form: spelling}, exact set."""
    unpacked = work / "spa."
    subprocess.run(
        [str(TESSERACT.parent / "combine_tessdata.exe"), "-u", str(TESSDATA / "spa.traineddata"), str(unpacked)],
        check=True,
        capture_output=True,
    )
    wordlist = work / "spa-words.txt"
    subprocess.run(
        [
            str(TESSERACT.parent / "dawg2wordlist.exe"),
            str(work / "spa.lstm-unicharset"),
            str(work / "spa.lstm-word-dawg"),
            str(wordlist),
        ],
        check=True,
        capture_output=True,
    )
    exact = {line.strip().lower() for line in wordlist.read_text("utf8").splitlines() if line.strip()}
    by_plain = {}
    for word in exact:
        by_plain.setdefault(plain(word), set()).add(word)
    unique = {key: spellings.pop() for key, spellings in by_plain.items() if len(spellings) == 1}
    return exact, unique


def correct_word(text, benga, spanish_exact, spanish_unique):
    """
    Returns (corrected text, how) for one OCR word. Rules, in order:
      1. drop impossible letters (ħ → h …)
      2. a known Spanish word (or old spelling like «á», «fué») stays 'Acción' → 'Acción'
      3. a known Benga word gets the site's spelling (accents)       'Ebokuedi' → 'Ebokūedi'
      4. a Spanish word with wrong accents gets them fixed            'Acciôn' → 'Acción'
      5. an unknown word with á é ú and no Spanish-only letter (c q r x z ñ í ó) is Benga:
         á é ú → â ē ū                                              'Yákú' → 'Yâkū'
    """
    text = text.translate(JUNK)
    lead, core, tail = PUNCTUATION.match(text).groups()
    if not core or not any(c.isalpha() for c in core):
        return text, ""
    low = core.lower()
    key = plain(core)
    if low in spanish_exact or low in OLD_SPANISH or len(core) == 1:
        return text, "spanish"
    if key in benga and len(key) > 2:
        fixed = same_case(benga[key], core)
        return lead + fixed + tail, ("benga-fixed" if fixed != core else "benga")
    if key in spanish_unique and len(key) > 2:
        fixed = same_case(spanish_unique[key], core)
        return lead + fixed + tail, ("spanish-fixed" if fixed != core else "spanish")
    # Benga has no c q r x z ñ and never í ó (AGENTS.md → Benga Orthography): then it's Spanish.
    if re.search("[áéúÁÉÚ]", core) and not re.search("[cqrxzñíóCQRXZÑÍÓ]", core):
        fixed = core.translate(str.maketrans("áéúÁÉÚ", "âēūÂĒŪ"))
        return lead + fixed + tail, "benga-accent"
    return text, "unknown"


# ── OCR ─────────────────────────────────────────────────────────────────────


# Tesseract page-layout modes: 3 = automatic (best for prose), 4 = one column of lines,
# 6 = one block (best for tables like «Singular. Plural. Significado.»).
LAYOUT_MODES = ("3", "4", "6")


def run_tesseract(image_path, psm):
    """One Tesseract run. Returns words: dict(text, conf, x0, y0, x1, y1, line) in pixels."""
    env = dict(os.environ, TESSDATA_PREFIX=str(TESSDATA), OMP_THREAD_LIMIT="1")
    result = subprocess.run(
        [str(TESSERACT), str(image_path), "stdout", "-l", "spa+Latin", "--psm", psm, "tsv"],
        capture_output=True,
        env=env,
        check=True,
    )
    words = []
    lines = result.stdout.decode("utf8").splitlines()
    for row in csv.DictReader(lines, delimiter="	", quoting=csv.QUOTE_NONE):
        text = (row.get("text") or "").strip()
        if row["level"] != "5" or not text:
            continue
        x, y, w, h = (int(row[k]) for k in ("left", "top", "width", "height"))
        line = (row["block_num"], row["par_num"], row["line_num"])
        words.append(dict(text=text, conf=float(row["conf"]), x0=x, y0=y, x1=x + w, y1=y + h, line=line))
    return words


def ocr_page(image_path, known):
    """
    Reads a page with every layout mode and keeps the reading with the most known words
    (Spanish dictionary or Benga words of the site): tables and prose need different modes.
    """

    def score(words):
        cores = (plain(PUNCTUATION.match(word["text"]).group(2)) for word in words)
        return sum(core in known for core in cores)

    return max((run_tesseract(image_path, psm) for psm in LAYOUT_MODES), key=score)


def write_text_layer(page, words, font, scale):
    """Removes the old OCR text and writes the new words invisibly (render mode 3) on their spot."""
    page.add_redact_annot(page.rect)
    page.apply_redactions(
        images=pymupdf.PDF_REDACT_IMAGE_NONE,
        graphics=pymupdf.PDF_REDACT_LINE_ART_NONE,
        text=pymupdf.PDF_REDACT_TEXT_REMOVE,
    )
    page.insert_font(fontname="ocr", fontbuffer=font.buffer)
    # One font size per line (the line's median height), so selections look even. A stain or a
    # stray mark can make a box very tall: cap the size at 1.5x the page's normal text height.
    def median(values):
        values = sorted(values)
        return values[len(values) // 2] if values else 10

    page_height = median([word["y1"] - word["y0"] for word in words])
    line_height = {}
    for word in words:
        line_height.setdefault(word["line"], []).append(word["y1"] - word["y0"])
    for word in words:
        height = min(median(line_height[word["line"]]), page_height * 1.5)
        # Tesseract's box goes from the top of accents to the bottom of descenders (≈1.3 em),
        # so 0.75 of it keeps neighbouring lines from overlapping (copying stays line by line).
        size = max(4.0, height * scale * 0.75)
        x0, y1, x1 = word["x0"] * scale, word["y1"] * scale, word["x1"] * scale
        natural = font.text_length(word["text"], fontsize=size)
        stretch = (x1 - x0) / natural if natural else 1
        origin = pymupdf.Point(x0, y1 - size * 0.25)  # baseline a bit above the box bottom
        page.insert_text(
            origin,
            word["text"] + " ",
            fontname="ocr",
            fontsize=size,
            render_mode=3,
            morph=(origin, pymupdf.Matrix(stretch, 1)),
        )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--pages", help="PDF page numbers to test, e.g. 9,16 (1-based)")
    parser.add_argument("--reuse", action="store_true", help="reuse .ocr-cache (only rewrite the layer)")
    args = parser.parse_args()

    for needed in (TESSERACT, TESSDATA / "spa.traineddata", TESSDATA / "Latin.traineddata"):
        if not needed.exists():
            sys.exit(f"Missing {needed} (see docs/OCR.md)")

    source = pymupdf.open(SOURCE)
    numbers = (
        [int(n) - 1 for n in args.pages.split(",")] if args.pages else list(range(source.page_count))
    )
    target = TARGET.with_name(TARGET.stem + "-TEST.pdf") if args.pages else TARGET

    with tempfile.TemporaryDirectory() as tmp:
        work = Path(tmp)
        benga = benga_words()
        spanish_exact, spanish_unique = spanish_words(work)
        print(f"Word lists: {len(benga)} Benga, {len(spanish_exact)} Spanish")

        cached = json.loads(CACHE.read_text("utf8")) if args.reuse and CACHE.exists() else {}
        images = {}
        for n in numbers:
            if str(n) in cached:
                continue
            images[n] = work / f"page-{n + 1:03}.png"
            source[n].get_pixmap(dpi=DPI, colorspace=pymupdf.csGRAY).save(images[n])

        with ThreadPoolExecutor(max_workers=os.cpu_count() or 4) as pool:
            # Known words, without accents, to choose the best layout mode of each page.
            known = {plain(word) for word in spanish_exact} | set(benga) | OLD_SPANISH
            read = lambda n: ocr_page(images[n], known)  # noqa: E731
            todo = [n for n in numbers if str(n) not in cached]
            results = dict(zip(todo, pool.map(read, todo)))
        for n in numbers:
            if str(n) in cached:
                results[n] = [dict(word, line=tuple(word["line"])) for word in cached[str(n)]]
        if not args.pages:
            CACHE.parent.mkdir(exist_ok=True)
            CACHE.write_text(json.dumps({str(n): results[n] for n in numbers}), "utf8")

    font = pymupdf.Font(fontfile=FONT_FILE)
    scale = 72 / DPI
    corrections = (
        json.loads(CORRECTIONS.read_text("utf8")).get("corrections", {}) if CORRECTIONS.exists() else {}
    )
    doubts, counts = [], {}
    for n in numbers:
        kept = []  # the words that go into the text layer (not the discarded ones)
        for index, word in enumerate(results[n]):
            # Stable id of the word: PDF page + its position in the OCR output (from the cache)
            word_id = f"p{n + 1}-w{index}"
            word["ocr"] = word["text"]
            word["text"], how = correct_word(word["text"], benga, spanish_exact, spanish_unique)
            doubtful = how in ("unknown", "benga-accent") and word["conf"] < LOW_CONFIDENCE
            correction = corrections.get(word_id) or {}
            if correction.get("discard"):  # "not a word" in /admin/ocr: drop it everywhere
                counts["discarded"] = counts.get("discarded", 0) + 1
                continue
            kept.append(word)
            fixed = correction.get("correction", "").strip()
            if fixed:  # a person's correction always wins
                word["text"] = fixed
                how = "manual"
            counts[how] = counts.get(how, 0) + 1
            if doubtful:
                box = [round(word[k] * scale, 1) for k in ("x0", "y0", "x1", "y1")]
                doubts.append([word_id, n + 1, word["ocr"], word["text"], round(word["conf"]), how, *box])
        write_text_layer(source[n], kept, font, scale)

    if args.pages:  # keep only the tested pages in the test file
        source.select(numbers)
    source.subset_fonts()  # embed only the letters used (keeps the file ~ the original size)
    save_options = dict(garbage=4, deflate=True, deflate_images=False, use_objstms=1, clean=True)
    try:
        source.save(target, **save_options)
    except Exception as error:  # Windows: the PDF is open in a viewer (Foxit, Edge…) and locked
        pending = CACHE.parent / target.name
        pending.parent.mkdir(exist_ok=True)
        source.save(pending, **save_options)
        print(f"! Could not replace {target.relative_to(ROOT)} ({error.__class__.__name__}): is it open")
        print(f"  in a PDF viewer? Saved to {pending.relative_to(ROOT)}; close the viewer and run")
        print("  python scripts/ocr-pdf.py --reuse again.")
        target = pending

    DOUBTS.parent.mkdir(parents=True, exist_ok=True)
    doubts_file = DOUBTS.with_name("ocr-doubts-TEST.csv") if args.pages else DOUBTS
    with open(doubts_file, "w", newline="", encoding="utf-8-sig") as handle:
        writer = csv.writer(handle)
        # x0…y1: the word's box on the PDF page, in points from the top-left corner (for /admin/ocr)
        writer.writerow(
            ["id", "pdf_page", "ocr_read", "written_in_pdf", "confidence", "kind", "x0", "y0", "x1", "y1"]
        )
        writer.writerows(doubts)

    total = sum(counts.values())
    print(f"Pages: {len(numbers)}  words: {total}")
    for how, count in sorted(counts.items(), key=lambda item: -item[1]):
        print(f"  {how or 'no letters'}: {count}")
    print(f"Doubtful words: {len(doubts)} → {doubts_file.relative_to(ROOT)}")
    print(f"Wrote {target.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
