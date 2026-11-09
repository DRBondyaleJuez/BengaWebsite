/**
 * External addresses used by the site, kept in ONE place.
 *
 * If a provider changes (new Cloudinary account, new dictionary site,
 * PDF renamed), edit this file only — every component imports from here.
 */

/**
 * Cloudinary folder that holds the pronunciation recordings.
 * An audio file is loaded from `${CLOUDINARY_BASE}/${audioId}.mp3`.
 *
 * Can be overridden without touching code by creating a `.env.local` file:
 *   VUE_APP_CLOUDINARY_BASE=https://res.cloudinary.com/<cloud>/video/upload
 * (vue-cli only exposes variables that start with VUE_APP_.)
 */
export const CLOUDINARY_BASE =
  process.env.VUE_APP_CLOUDINARY_BASE ||
  'https://res.cloudinary.com/dp5rofjyx/video/upload/v1780354084'

/** Home page of the Benga Living Dictionary (community dictionary). */
export const LIVING_DICTIONARY_HOME = 'https://livingdictionaries.app/benga'

/**
 * Search page of the Living Dictionary. Entries are identified by internal
 * ids, not by the word, so we link to a search instead of an entry page.
 * Used by `getDictionaryUrl()` in `src/utils/dictionaryUrl.js`.
 */
export const LIVING_DICTIONARY_SEARCH = `${LIVING_DICTIONARY_HOME}/entries`

/**
 * The Salvado y Cos grammar PDF (file in `public/downloads/`).
 * BASE_URL is the folder the site is published in ('/' by default), so the
 * link keeps working if the site is hosted in a sub-folder.
 */
export const BOOK_PDF_URL = `${process.env.BASE_URL}downloads/salvado-y-cos-gramatica-benga.pdf`
