/**
 * Search, filters and sorting of the dictionary admin tables (/admin/living-dictionary).
 * Pure functions (no imports), shared with the tests in scripts/tests/dictionaryFilters.test.mjs.
 *
 * Filters come from the page URL, so a filtered list can be bookmarked or linked from the Panel:
 *   ?q=arbol&tol=1&pos=n,v&dom=1.4&nc=7&audio=no&ejemplo=si&falta=fr,pos&revision=si
 *    &estado=local-changes,new&web=no&sugerencias=si&orden=az&pagina=2
 */

/** Lower case, no accents, NFC: "Árbol" → "arbol", "Hāngā" → "hanga". */
export function plain(text) {
  return String(text ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

/** Edit distance with transpositions (Damerau–Levenshtein, optimal string alignment). */
export function editDistance(a, b, max = Infinity) {
  if (a === b) return 0
  if (Math.abs(a.length - b.length) > max) return max + 1
  let previous2 = []
  let previous = Array.from({ length: b.length + 1 }, (_, j) => j)
  for (let i = 1; i <= a.length; i++) {
    const current = [i]
    let rowMin = i
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      let value = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + cost)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        value = Math.min(value, previous2[j - 2] + 1)
      }
      current[j] = value
      rowMin = Math.min(rowMin, value)
    }
    if (rowMin > max) return max + 1
    previous2 = previous
    previous = current
  }
  return previous[b.length]
}

/**
 * Does `query` match `text`? Every word of the query must be found in the text, as part of a
 * word (substring) or, with tolerance > 0, as a whole word with at most `tolerance` typos
 *  (1 typo from 4 letters, 2 from 7, 3 from 10; shorter words must match exactly).
 */
export function matchesText(text, query, tolerance = 0) {
  const words = plain(query).split(/\s+/).filter(Boolean)
  if (!words.length) return true
  const haystack = plain(text)
  const tokens = haystack.split(/[^\p{L}\p{N}]+/u).filter(Boolean)
  return words.every((word) => {
    if (haystack.includes(word)) return true
    if (tolerance <= 0 || word.length < 3) return false
    const allowed = Math.min(tolerance, Math.floor((word.length - 1) / 3)) // 4+ letters: 1, 7+: 2, 10+: 3
    return tokens.some((token) => editDistance(token, word, allowed) <= allowed)
  })
}

const list = (value) =>
  String(value ?? '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)

/** Route query → filter object (unknown values are ignored). */
export function filtersFromQuery(query = {}) {
  const yesNo = (value) => (value === 'si' || value === 'no' ? value : '')
  const tolerance = Number(query.tol)
  return {
    q: String(query.q ?? ''),
    tol: Number.isInteger(tolerance) && tolerance >= 0 && tolerance <= 3 ? tolerance : 1,
    pos: list(query.pos),
    dom: list(query.dom),
    nc: list(query.nc),
    audio: yesNo(query.audio),
    ejemplo: yesNo(query.ejemplo),
    falta: list(query.falta),
    revision: query.revision ? String(query.revision) : '',
    estado: list(query.estado),
    web: yesNo(query.web),
    sugerencias: yesNo(query.sugerencias),
    orden: ['az', 'za', 'recientes', 'revision'].includes(query.orden) ? query.orden : 'az',
    pagina: Math.max(1, Number.parseInt(query.pagina, 10) || 1)
  }
}

/** Filter object → route query (only what differs from the defaults). */
export function queryFromFilters(filters) {
  const query = {}
  for (const [key, value] of Object.entries(filters)) {
    if (Array.isArray(value)) {
      if (value.length) query[key] = value.join(',')
    } else if (key === 'tol') {
      if (value !== 1) query.tol = String(value)
    } else if (key === 'orden') {
      if (value !== 'az') query.orden = value
    } else if (key === 'pagina') {
      if (value > 1) query.pagina = String(value)
    } else if (value) query[key] = String(value)
  }
  return query
}

/** How many filters are active (for the "Filtros (3)" badge). Text search and order excluded. */
export function activeFilterCount(filters) {
  return ['pos', 'dom', 'nc', 'falta', 'estado']
    .map((key) => filters[key].length)
    .concat(
      ['audio', 'ejemplo', 'revision', 'web', 'sugerencias'].map((key) => (filters[key] ? 1 : 0))
    )
    .reduce((sum, count) => sum + count, 0)
}

/** Everything a table row needs from a workspace entry. */
export function entryRow(entry) {
  const senses = entry.senses || []
  const gloss = (lang) =>
    senses
      .map((sense) => sense.glosses?.[lang])
      .filter(Boolean)
      .join(' · ')
  return {
    id: entry.id,
    lexeme: entry.lexeme,
    homograph: entry.homograph || '',
    es: gloss('es'),
    en: gloss('en'),
    fr: gloss('fr'),
    pos: [...new Set(senses.flatMap((sense) => sense.partsOfSpeech || []))],
    domains: [...new Set(senses.flatMap((sense) => sense.semanticDomains || []))],
    nounClasses: [...new Set(senses.map((sense) => sense.nounClass).filter(Boolean))],
    plural: senses
      .map((sense) => sense.pluralForm)
      .filter(Boolean)
      .join(' · '),
    senseCount: senses.length,
    audioCount: (entry.audio || []).length,
    exampleCount: senses.reduce((n, sense) => n + (sense.sentenceIds || []).length, 0),
    missing: {
      es: senses.some((sense) => !sense.glosses?.es),
      en: senses.some((sense) => !sense.glosses?.en),
      fr: senses.some((sense) => !sense.glosses?.fr),
      pos: senses.some((sense) => !(sense.partsOfSpeech || []).length),
      dominio: senses.some((sense) => !(sense.semanticDomains || []).length)
    },
    review: entry.review || null,
    suggestions: (entry.suggestions || []).length,
    state: entry.sync?.state || 'synced',
    linked: (entry.siteKeys || []).length > 0,
    siteKeys: entry.siteKeys || [],
    updatedAt: entry.sync?.ldUpdatedAt || ''
  }
}

const yes = (flag, condition) => !flag || (flag === 'si') === condition

/** Keeps the rows that pass every active filter. */
export function filterRows(rows, filters) {
  return rows.filter((row) => {
    if (filters.q) {
      const text = [row.lexeme, row.es, row.en, row.fr, row.plural].join(' ')
      if (!matchesText(text, filters.q, filters.tol)) return false
    }
    if (filters.pos.length && !filters.pos.some((code) => row.pos.includes(code))) return false
    if (filters.dom.length && !filters.dom.some((key) => row.domains.includes(key))) return false
    if (filters.nc.length) {
      const classes = row.nounClasses.length ? row.nounClasses : ['ninguna']
      if (!filters.nc.some((value) => classes.includes(value))) return false
    }
    if (!yes(filters.audio, row.audioCount > 0)) return false
    if (!yes(filters.ejemplo, row.exampleCount > 0)) return false
    if (filters.falta.length && !filters.falta.some((key) => row.missing[key])) return false
    if (filters.revision) {
      if (filters.revision === 'no' ? row.review : !row.review) return false
      if (!['si', 'no'].includes(filters.revision) && row.review.category !== filters.revision) {
        return false
      }
    }
    if (filters.estado.length && !filters.estado.includes(row.state)) return false
    if (!yes(filters.web, row.linked)) return false
    if (!yes(filters.sugerencias, row.suggestions > 0)) return false
    return true
  })
}

const collator = new Intl.Collator('es', { sensitivity: 'base', numeric: true })

/** Sorts rows: az / za by headword, recientes = changed here first, revision = to review first. */
export function sortRows(rows, order = 'az') {
  const byWord = (a, b) =>
    collator.compare(a.lexeme, b.lexeme) || collator.compare(a.homograph, b.homograph)
  const changed = (row) =>
    ['conflict', 'error', 'local-changes', 'new'].includes(row.state) ? 0 : 1
  const sorted = [...rows]
  if (order === 'za') sorted.sort((a, b) => byWord(b, a))
  else if (order === 'recientes') sorted.sort((a, b) => changed(a) - changed(b) || byWord(a, b))
  else if (order === 'revision') {
    sorted.sort((a, b) => Number(!a.review) - Number(!b.review) || byWord(a, b))
  } else sorted.sort(byWord)
  return sorted
}

/** One page of rows. */
export function paginate(rows, page, size = 50) {
  const pages = Math.max(1, Math.ceil(rows.length / size))
  const current = Math.min(Math.max(1, page), pages)
  return { rows: rows.slice((current - 1) * size, current * size), page: current, pages }
}
