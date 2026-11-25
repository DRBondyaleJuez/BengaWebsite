/**
 * Non-secret settings of the Living Dictionary bridge (docs/LD-ROADMAP.md). Imported by Node
 * scripts AND the admin pages, so plain values only (no import.meta). The API key is NOT here:
 * it stays in .env.local (LD_API_KEY) and is only read by Node code.
 */

/** Dictionary id on livingdictionaries.app (also the snapshot file name). */
export const LD_DICTIONARY_ID = 'benga'

/**
 * Speaker used for new recordings unless another one is chosen (developer's instruction,
 * 2026-11-25). Real person registered on the dictionary's contributors page.
 */
export const LD_DEFAULT_SPEAKER = {
  id: '024ea143-a828-4ab7-ac73-9bcbb7e15d75',
  name: 'Upango Bondyale Oko'
}

/**
 * The book as a citation source. Created on the dictionary by `npm run ld:source -- --create`
 * (task L0.4); entries taken from the book cite it with the page as locator ("p. 14").
 */
export const LD_BOOK_SOURCE = {
  slug: 'salvado-y-cos-1891',
  abbreviation: 'Salvadó y Cos 1891',
  author: 'Francisco Salvadó y Cos',
  year: '1891',
  citation:
    'Salvadó y Cos, Francisco (1891). Colección de apuntes preliminares sobre la lengua benga ó bea: introducción á una gramática de este idioma que se habla en la isla de Corisco, pueblos de su bahía é islas adyacentes. Madrid: Imprenta de A. Pérez Dubrull.',
  type: 'book',
  license: 'Public domain'
}

/** Prefix of the `import_id` stamped on every push (a private tag in LD, used to undo a batch). */
export const LD_IMPORT_PREFIX = 'benga-portal'

/** Our own limits on top of the client's pauses (docs/LD-ROADMAP.md section 4). */
export const LD_LIMITS = {
  batchSize: 200,
  mediaPerRun: 100
}
