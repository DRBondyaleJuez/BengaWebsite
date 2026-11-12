/**
 * External addresses used by the site, kept in ONE place.
 *
 * If a provider changes (new Cloudinary account, new dictionary site,
 * PDF renamed), edit this file only — every component imports from here.
 */

/**
 * Cloudinary folder that holds the pronunciation recordings.
 * A recording is loaded from `${CLOUDINARY_BASE}/<word key>.mp3` (see src/services/wordLinks.js).
 *
 * Can be overridden without touching code by creating a `.env.local` file:
 *   VITE_CLOUDINARY_BASE=https://res.cloudinary.com/<cloud>/video/upload
 * (Vite only exposes variables that start with VITE_.)
 */
export const CLOUDINARY_BASE =
  import.meta.env.VITE_CLOUDINARY_BASE ||
  'https://res.cloudinary.com/dp5rofjyx/video/upload/v1780354084'

/** Home page of the Benga Living Dictionary (community dictionary). */
export const LIVING_DICTIONARY_HOME = 'https://livingdictionaries.app/benga'

/**
 * Living Dictionary pages used by `getDictionaryUrl()` in `src/services/wordLinks.js`:
 *   - ENTRY:  one word's page, …/entry/<livingDictionaryId>  (ids are stored in the word registry)
 *   - SEARCH: search page, used when a word has no id yet
 */
export const LIVING_DICTIONARY_ENTRY = `${LIVING_DICTIONARY_HOME}/entry`
export const LIVING_DICTIONARY_SEARCH = `${LIVING_DICTIONARY_HOME}/entries`

/**
 * The Salvado y Cos grammar PDF (file in `public/downloads/`).
 * BASE_URL is the folder the site is published in ('/' by default), so the
 * link keeps working if the site is hosted in a sub-folder.
 */
export const BOOK_PDF_URL = `${import.meta.env.BASE_URL}downloads/salvado-y-cos-gramatica-benga.pdf`
