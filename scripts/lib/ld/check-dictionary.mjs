/**
 * Checks of the dictionary workspace (src/data/dictionary), part of `npm run validate`
 * (task L1.4). Called by validateContent() in scripts/lib/validate.mjs with its `add` function.
 *
 * Levels: wrong structure or broken links between records → error; unknown vocabulary codes,
 * site links that point nowhere → warning; spelling remarks → info (the dictionary's spelling
 * belongs to its community and is never corrected by rule, REVIEW-LOG R-037/R-040).
 */
const FILES = {
  entries: 'src/data/dictionary/entries.json',
  sentences: 'src/data/dictionary/sentences.json',
  base: 'src/data/dictionary/base.json'
}
const NON_BENGA_LETTERS = /[cqrxzñ]/i
const SPANISH_ACCENTS = /[áéíóú]/i

/**
 * @param {object} dictionary { entries?, sentences?, base?, vocab: { pos, domains, relations, review } (Sets) }
 * @param {object} context    { registryWords, add, schemaCheck }
 */
export function checkDictionary(dictionary, { registryWords = {}, add, schemaCheck }) {
  const { entries: entriesFile, sentences: sentencesFile, base, vocab } = dictionary
  if (!entriesFile && !sentencesFile) return { entries: 0, sentences: 0 }
  const err = (file, where, message, fix) => add('error', 'dictionary', file, where, message, fix)
  const warn = (file, where, message, fix) =>
    add('warning', 'dictionary', file, where, message, fix)
  const note = (file, where, message, fix) => add('info', 'dictionary', file, where, message, fix)

  if (entriesFile) schemaCheck('dictionary', FILES.entries, entriesFile)
  if (sentencesFile) schemaCheck('dictionary', FILES.sentences, sentencesFile)
  if (base) schemaCheck('dictionary', FILES.base, base)

  const entries = entriesFile?.entries || {}
  const sentences = sentencesFile?.sentences || {}

  // ids: key = record id, sense ids unique
  const senseOwner = new Map()
  for (const [key, entry] of Object.entries(entries)) {
    if (entry.id !== key)
      err(FILES.entries, `entries.${key}`, `Key and id differ ("${entry.id}")`, 'Use the id as key')
    for (const sense of entry.senses || []) {
      if (senseOwner.has(sense.id)) {
        err(
          FILES.entries,
          `entries.${key}.senses`,
          `Sense id ${sense.id} is also used by «${senseOwner.get(sense.id)}»`,
          'Each sense needs its own id'
        )
      } else senseOwner.set(sense.id, entry.lexeme)
    }
  }
  for (const [key, sentence] of Object.entries(sentences)) {
    if (sentence.id !== key)
      err(
        FILES.sentences,
        `sentences.${key}`,
        `Key and id differ ("${sentence.id}")`,
        'Use the id as key'
      )
  }

  // references between records
  for (const [key, entry] of Object.entries(entries)) {
    const where = `entries.${key} («${entry.lexeme}»)`
    for (const sense of entry.senses || []) {
      for (const id of sense.sentenceIds || []) {
        if (!sentences[id])
          err(
            FILES.entries,
            where,
            `Example sentence ${id} doesn't exist`,
            'Remove the link or pull again'
          )
      }
      for (const code of sense.partsOfSpeech || []) {
        if (vocab?.pos && !vocab.pos.has(code))
          warn(
            FILES.entries,
            where,
            `Unknown part of speech "${code}"`,
            'Use a code of vocab/parts-of-speech.json'
          )
      }
      for (const domain of sense.semanticDomains || []) {
        if (vocab?.domains && !vocab.domains.has(domain))
          warn(
            FILES.entries,
            where,
            `Unknown semantic domain "${domain}"`,
            'Use a key of vocab/semantic-domains.json'
          )
      }
    }
    for (const relation of entry.relations || []) {
      if (!entries[relation.to])
        err(
          FILES.entries,
          where,
          `Related entry ${relation.to} doesn't exist`,
          'Remove the relation or pull again'
        )
      if (
        vocab?.relations &&
        !relation.type.startsWith('custom:') &&
        !vocab.relations.has(relation.type)
      )
        warn(
          FILES.entries,
          where,
          `Unknown relation type "${relation.type}"`,
          'See vocab/relation-types.json'
        )
    }
    if (entry.review && vocab?.review && !vocab.review.has(entry.review.category))
      warn(
        FILES.entries,
        where,
        `Unknown review category "${entry.review.category}"`,
        'See vocab/review-categories.json'
      )
    for (const siteKey of entry.siteKeys || []) {
      if (!registryWords[siteKey])
        warn(
          FILES.entries,
          where,
          `Site word "${siteKey}" is not in word-registry.json`,
          'Run npm run ld:link'
        )
    }
    for (const [field, text] of [
      ['lexeme', entry.lexeme],
      ...(entry.senses || []).map((s) => ['pluralForm', s.pluralForm])
    ]) {
      if (!text) continue
      const remarks = []
      if (NON_BENGA_LETTERS.test(text)) remarks.push('c/q/r/x/z/ñ')
      if (SPANISH_ACCENTS.test(text)) remarks.push('á é í ó ú')
      if (remarks.length)
        note(
          FILES.entries,
          `${where} ${field}`,
          `«${text}» has ${remarks.join(' and ')}`,
          'Check with a speaker; never corrected automatically'
        )
    }
  }
  for (const [key, sentence] of Object.entries(sentences)) {
    const where = `sentences.${key} («${sentence.text}»)`
    for (const id of sentence.senseIds || []) {
      if (!senseOwner.has(id))
        err(
          FILES.sentences,
          where,
          `Linked sense ${id} doesn't exist`,
          'Remove the link or pull again'
        )
    }
    const remarks = []
    if (NON_BENGA_LETTERS.test(sentence.text)) remarks.push('c/q/r/x/z/ñ')
    if (SPANISH_ACCENTS.test(sentence.text)) remarks.push('á é í ó ú')
    if (remarks.length)
      note(
        FILES.sentences,
        where,
        `Has ${remarks.join(' and ')}`,
        'Check with a speaker; never corrected automatically'
      )
  }

  // registry ↔ workspace
  for (const [key, word] of Object.entries(registryWords)) {
    if (word.livingDictionaryId && !entries[word.livingDictionaryId]) {
      warn(
        'src/data/lexicon/word-registry.json',
        `words.${key}`,
        `livingDictionaryId ${word.livingDictionaryId} is not in the dictionary workspace`,
        'Pull again (npm run ld:pull) or clear the id'
      )
    }
  }
  return { entries: Object.keys(entries).length, sentences: Object.keys(sentences).length }
}
