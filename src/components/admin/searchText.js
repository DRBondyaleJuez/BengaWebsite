// searchText.js - helper for the admin selects: lower-case text without accents, so that
// "arbol" finds "Árbol". Used by ChipSelect.vue and TreeSelect.vue.
//
// Usage:  normalizeText('Árbol') === 'arbol'
export function normalizeText(text) {
  return String(text == null ? '' : text)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}
