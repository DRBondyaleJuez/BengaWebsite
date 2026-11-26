/** Tests for src/utils/dictionarySuggestions.js. Run: npm test */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  suggestionProblem,
  acceptSuggestion,
  rejectSuggestion,
  parseEditedValue,
  editableText,
  fieldLabel
} from '../../src/utils/dictionarySuggestions.js'

const clone = (value) => JSON.parse(JSON.stringify(value))
const entry = () => ({
  id: 'e1',
  lexeme: 'Ele',
  senses: [{ id: 's1', glosses: { es: 'Árbol' }, partsOfSpeech: ['n'] }],
  suggestions: [
    {
      id: 'g1',
      field: 'senses[0].glosses.fr',
      value: 'Arbre',
      reason: 'del español',
      by: 'claude'
    },
    { id: 'p1', field: 'senses[0].partsOfSpeech', value: ['n', 'v'] },
    { id: 'x1', field: 'senses[3].glosses.fr', value: 'Zzz' }
  ]
})
const NOW = { at: '2026-11-27T10:00:00.000Z', by: 'human' }

test('accepting writes the value, logs the history line and removes the suggestion', () => {
  const saved = entry()
  const draft = clone(saved)
  const line = acceptSuggestion(draft, saved, 'g1', 'Arbre', NOW)
  assert.equal(draft.senses[0].glosses.fr, 'Arbre')
  assert.deepEqual(line, {
    at: NOW.at,
    field: 'senses[0].glosses.fr',
    from: null,
    to: 'Arbre',
    by: 'human',
    action: 'accepted-suggestion'
  })
  assert.deepEqual(draft.history, [line])
  assert.deepEqual(
    draft.suggestions.map((s) => s.id),
    ['p1', 'x1']
  )
})

test('edit and accept writes the edited value, not the proposed one', () => {
  const saved = entry()
  const draft = clone(saved)
  acceptSuggestion(draft, saved, 'g1', 'Arbre (m.)', NOW)
  assert.equal(draft.senses[0].glosses.fr, 'Arbre (m.)')
  assert.equal(draft.history[0].to, 'Arbre (m.)')
})

test('accepting a list replaces the old one and keeps what it was in `from`', () => {
  const saved = entry()
  const draft = clone(saved)
  const line = acceptSuggestion(draft, saved, 'p1', ['n', 'v'], NOW)
  assert.deepEqual(draft.senses[0].partsOfSpeech, ['n', 'v'])
  assert.deepEqual(line.from, ['n'])
})

test('rejecting leaves the field alone and logs the proposal as not applied', () => {
  const draft = entry()
  const line = rejectSuggestion(draft, 'g1', NOW)
  assert.equal(draft.senses[0].glosses.fr, undefined)
  assert.equal(line.action, 'rejected-suggestion')
  assert.equal(line.to, 'Arbre')
  assert.deepEqual(
    draft.suggestions.map((s) => s.id),
    ['p1', 'x1']
  )
  assert.equal(draft.history.length, 1)
})

test('a suggestion for a sense that no longer exists is refused', () => {
  const saved = entry()
  const draft = clone(saved)
  assert.match(suggestionProblem(draft, 'senses[3].glosses.fr'), /ya no existe/)
  assert.throws(() => acceptSuggestion(draft, saved, 'x1', 'Zzz', NOW), /ya no existe/)
  assert.equal(draft.senses.length, 1)
  assert.match(suggestionProblem(draft, 'senses[x]'), /no es válida/)
  assert.equal(suggestionProblem(draft, 'senses[0].glosses.fr'), null)
  assert.equal(suggestionProblem(draft, 'lexeme'), null)
  // it can still be rejected
  assert.equal(rejectSuggestion(draft, 'x1', NOW).from, null)
})

test('an unknown suggestion id throws', () => {
  assert.throws(() => acceptSuggestion(entry(), entry(), 'nope', 'x'), /ya no existe/)
  assert.throws(() => rejectSuggestion(entry(), 'nope'), /ya no existe/)
})

test('edited text becomes a value of the same shape', () => {
  assert.deepEqual(parseEditedValue('n, v ,', ['n']), ['n', 'v'])
  assert.equal(parseEditedValue('Arbre', 'Arbol'), 'Arbre')
  assert.deepEqual(parseEditedValue('{"a":1}', { a: 2 }), { a: 1 })
  assert.equal(editableText(['n', 'v']), 'n, v')
  assert.equal(editableText('x'), 'x')
  assert.equal(editableText(null), '')
})

test('fieldLabel names the field in Spanish', () => {
  assert.equal(fieldLabel('senses[0].glosses.fr'), 'Sentido 1 · Traducción (francés)')
  assert.equal(fieldLabel('senses[1].partsOfSpeech'), 'Sentido 2 · Categoría gramatical')
  assert.equal(fieldLabel('translations.en'), 'Traducción (inglés)')
  assert.equal(fieldLabel('lexeme'), 'Palabra')
  assert.equal(fieldLabel('weird.thing'), 'weird · thing')
  assert.equal(fieldLabel('a['), 'a[')
})
