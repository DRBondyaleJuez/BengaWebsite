/**
 * Tests for src/utils/inlineMarkup.js (the **bold** rule of section-file texts). Run: npm test
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { inlineMarkup } from '../../src/utils/inlineMarkup.js'

test('**text** becomes bold', () => {
  assert.equal(
    inlineMarkup('constan de **número** y **clasificación**'),
    'constan de <strong>número</strong> y <strong>clasificación</strong>'
  )
})

test('HTML in content is shown as text, never run', () => {
  assert.equal(inlineMarkup('<img src=x onerror=alert(1)>'), '&lt;img src=x onerror=alert(1)&gt;')
  assert.equal(inlineMarkup('«Jâmbi» & "Joba"'), '«Jâmbi» &amp; &quot;Joba&quot;')
})

test('empty or missing text gives an empty string', () => {
  assert.equal(inlineMarkup(''), '')
  assert.equal(inlineMarkup(null), '')
})
