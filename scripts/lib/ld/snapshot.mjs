/**
 * Living Dictionaries snapshot (SQLite) → workspace records (dictionary.schema.json, LD fields
 * only). Reading is read-only and never "corrects" Benga text: values are copied as they are,
 * only empty strings are dropped (an empty translation means "no translation").
 *
 * openSnapshot(bytes) needs Node's built-in SQLite (run node with --experimental-sqlite on
 * Node 22). readSnapshot(db) is pure: any object with prepare(sql).all() works (tests use a fake).
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

/** Writes the bytes to a temporary file and opens it read-only. Call close() when done. */
export async function openSnapshot(bytes) {
  const { DatabaseSync } = await import('node:sqlite')
  const file = path.join(os.tmpdir(), `ld-snapshot-${process.pid}-${Date.now()}.db`)
  fs.writeFileSync(file, bytes)
  const db = new DatabaseSync(file, { readOnly: true })
  return {
    db,
    close() {
      db.close()
      fs.rmSync(file, { force: true })
    }
  }
}

const parse = (value) => {
  if (value === null || value === undefined || value === '') return null
  if (typeof value !== 'string') return value
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

/** { default: 'x', es: '' } → { default: 'x' }; nothing left → null. A plain string stays. */
export function cleanMulti(value) {
  const parsed = parse(value)
  if (parsed === null) return null
  if (typeof parsed === 'string') return parsed.trim() ? parsed : null
  const result = {}
  for (const [key, text] of Object.entries(parsed)) {
    if (typeof text === 'string' && text.trim() !== '') result[key] = text
  }
  return Object.keys(result).length ? result : null
}

/** The vernacular form of a multi-text ({ default: 'Ele' } → 'Ele'). */
export function vernacular(value) {
  const multi = cleanMulti(value)
  if (multi === null) return null
  if (typeof multi === 'string') return multi
  return multi.default ?? Object.values(multi)[0] ?? null
}

/** Gloss-language part of a multi-text (no `default`). */
function glossOnly(value) {
  const multi = cleanMulti(value)
  if (multi === null || typeof multi === 'string') return multi === null ? null : { es: multi }
  const rest = { ...multi }
  delete rest.default
  return Object.keys(rest).length ? rest : null
}

const list = (value) => {
  const parsed = parse(value)
  if (parsed === null) return []
  return (Array.isArray(parsed) ? parsed : [parsed]).filter((item) => item !== null && item !== '')
}

const text = (value) => (value === null || value === undefined || value === '' ? null : value)

const citations = (value) =>
  list(value)
    .filter((item) => item && item.slug)
    .map((item) =>
      item.locator ? { slug: item.slug, locator: item.locator } : { slug: item.slug }
    )

function group(rows, key) {
  const map = new Map()
  for (const row of rows) {
    if (!map.has(row[key])) map.set(row[key], [])
    map.get(row[key]).push(row)
  }
  return map
}

/**
 * @returns {{ entries: Record<string, object>, sentences: Record<string, object>, speakers: object[] }}
 */
export function readSnapshot(db) {
  const all = (sql) => db.prepare(sql).all()
  const has = (table) =>
    all(`SELECT name FROM sqlite_master WHERE type = 'table' AND name = '${table}'`).length > 0
  const rows = (table, sql) => (has(table) ? all(sql) : [])

  const speakersOf = group(
    rows('audio_speakers', 'SELECT audio_id, speaker_id FROM audio_speakers'),
    'audio_id'
  )
  const audioRow = (row) => {
    const audio = {
      id: row.id,
      storagePath: row.storage_path,
      speakerIds: (speakersOf.get(row.id) || []).map((link) => link.speaker_id)
    }
    if (row.source) audio.source = row.source
    if (row.clip_start_ms !== null && row.clip_start_ms !== undefined) {
      audio.clipStartMs = row.clip_start_ms
      audio.clipEndMs = row.clip_end_ms
    }
    return audio
  }
  const audio = rows(
    'audio',
    'SELECT id, entry_id, sentence_id, storage_path, source, clip_start_ms, clip_end_ms FROM audio ORDER BY created_at, id'
  )
  const audioByEntry = group(
    audio.filter((row) => row.entry_id),
    'entry_id'
  )
  const audioBySentence = group(
    audio.filter((row) => row.sentence_id),
    'sentence_id'
  )

  const sentenceLinks = rows(
    'senses_in_sentences',
    'SELECT sense_id, sentence_id FROM senses_in_sentences ORDER BY created_at, id'
  )
  const sentencesBySense = group(sentenceLinks, 'sense_id')
  const sensesBySentence = group(sentenceLinks, 'sentence_id')

  const photos = new Map(rows('photos', 'SELECT * FROM photos').map((row) => [row.id, row]))
  const photosBySense = group(
    rows('sense_photos', 'SELECT sense_id, photo_id FROM sense_photos'),
    'sense_id'
  )

  const names = (table, link, key) => {
    const byId = new Map(rows(table, `SELECT id, name FROM ${table}`).map((row) => [row.id, row]))
    const links = group(rows(link, `SELECT entry_id, ${key} FROM ${link}`), 'entry_id')
    return (entryId) =>
      (links.get(entryId) || [])
        .map((row) => byId.get(row[key]))
        .filter((row) => row && !row.private)
        .map((row) => vernacular(row.name) ?? row.name)
  }
  const dialectsOf = names('dialects', 'entry_dialects', 'dialect_id')
  const tagRows = new Map(
    rows('tags', 'SELECT id, name, private FROM tags').map((row) => [row.id, row])
  )
  const tagLinks = group(rows('entry_tags', 'SELECT entry_id, tag_id FROM entry_tags'), 'entry_id')
  const tagsOf = (entryId) =>
    (tagLinks.get(entryId) || [])
      .map((row) => tagRows.get(row.tag_id))
      .filter((tag) => tag && !tag.private) // private tags = import batches, not content
      .map((tag) => tag.name)

  const relationsByEntry = group(
    rows('entry_relationships', 'SELECT * FROM entry_relationships ORDER BY created_at, id'),
    'from_entry_id'
  )

  const sensesByEntry = group(
    rows('senses', 'SELECT * FROM senses ORDER BY created_at, id'),
    'entry_id'
  )

  const entries = {}
  for (const row of rows('entries', 'SELECT * FROM entries ORDER BY created_at, id')) {
    const lexeme = vernacular(row.lexeme)
    if (!lexeme) continue
    const senses = (sensesByEntry.get(row.id) || []).map((sense) => {
      const result = {
        id: sense.id,
        glosses: glossOnly(sense.glosses),
        definition: glossOnly(sense.definition),
        partsOfSpeech: list(sense.parts_of_speech),
        semanticDomains: list(sense.semantic_domains).map(String),
        writeInDomains: list(sense.write_in_semantic_domains),
        nounClass: text(sense.noun_class),
        pluralForm: vernacular(sense.plural_form),
        variant: vernacular(sense.variant),
        conceptId: text(sense.concept_id),
        citations: citations(sense.citations),
        sentenceIds: (sentencesBySense.get(sense.id) || []).map((link) => link.sentence_id),
        photos: (photosBySense.get(sense.id) || [])
          .map((link) => photos.get(link.photo_id))
          .filter(Boolean)
          .map((photo) => ({
            id: photo.id,
            storagePath: photo.storage_path,
            source: text(photo.source),
            photographer: text(photo.photographer)
          }))
      }
      return result
    })
    if (!senses.length) continue // LD always has one; a snapshot without any is incomplete
    const review = parse(row.review)
    entries[row.id] = {
      id: row.id,
      lexeme,
      homograph: text(row.homograph),
      phonetic: text(row.phonetic),
      interlinearization: text(row.interlinearization),
      morphology: text(row.morphology),
      toneClass: text(row.tone_class),
      notes: cleanMulti(row.notes) === null ? null : glossOrDefault(row.notes),
      linguisticHistory:
        cleanMulti(row.linguistic_history) === null ? null : glossOrDefault(row.linguistic_history),
      scientificNames: list(row.scientific_names),
      dialects: dialectsOf(row.id),
      tags: tagsOf(row.id),
      citations: citations(row.citations),
      senses,
      audio: (audioByEntry.get(row.id) || []).map(audioRow),
      relations: (relationsByEntry.get(row.id) || []).map((relation) => ({
        id: relation.id,
        type: relation.type || `custom:${relation.custom_type_id}`,
        to: relation.to_entry_id,
        fromSense: text(relation.from_sense_id),
        toSense: text(relation.to_sense_id)
      })),
      ldReview:
        review && review.category
          ? { category: review.category, note: review.note || '', by: 'ld' }
          : null,
      // newest change of the entry or any of its senses (a sense edit does not touch the entry row)
      updatedAt: latest([
        row.updated_at,
        ...(sensesByEntry.get(row.id) || []).map((s) => s.updated_at)
      ])
    }
  }

  const sentences = {}
  for (const row of rows('sentences', 'SELECT * FROM sentences ORDER BY created_at, id')) {
    const sentenceText = vernacular(row.text)
    if (!sentenceText) continue
    const meta = parse(row.translation_meta) || {}
    const translationStatus = {}
    for (const [lang, value] of Object.entries(meta)) {
      const status = typeof value === 'string' ? value : value?.status
      if (['es', 'en', 'fr'].includes(lang) && status) translationStatus[lang] = status
    }
    sentences[row.id] = {
      id: row.id,
      text: sentenceText,
      translations: glossOnly(row.translation),
      translationStatus,
      speakerId: text(row.speaker_id),
      citations: citations(row.citations),
      audio: (audioBySentence.get(row.id) || []).map(audioRow),
      senseIds: (sensesBySentence.get(row.id) || []).map((link) => link.sense_id),
      textId: text(row.text_id),
      updatedAt: row.updated_at
    }
  }

  const speakers = rows(
    'speakers',
    'SELECT id, name, decade, gender, birthplace FROM speakers ORDER BY name'
  )
  return { entries, sentences, speakers: speakers.map((row) => ({ ...row })) }
}

/** The newest of several ISO dates (null when there is none). */
export function latest(dates) {
  const valid = dates.filter(Boolean)
  return valid.length ? valid.reduce((a, b) => (Date.parse(b) > Date.parse(a) ? b : a)) : null
}

/** Notes may be markdown in one language or keyed by language; keep es/en/fr/default. */
function glossOrDefault(value) {
  const multi = cleanMulti(value)
  return typeof multi === 'string' ? { es: multi } : multi
}
