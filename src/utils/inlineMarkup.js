/**
 * The only formatting allowed inside a text of a section file: **bold**.
 *
 *   inlineMarkup('los adjetivos constan de **número** y <b>x</b>')
 *   → 'los adjetivos constan de <strong>número</strong> y &lt;b&gt;x&lt;/b&gt;'
 *
 * Everything else is escaped, so a content file can never inject HTML into the page.
 * Used with v-html in src/views/SectionPage.vue. Tests: scripts/tests/inlineMarkup.test.mjs
 */
const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }

export function inlineMarkup(text) {
  const escaped = String(text ?? '').replace(/[&<>"']/g, (char) => ESCAPES[char])
  return escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
}
