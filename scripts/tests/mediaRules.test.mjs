/** Tests for src/utils/mediaRules.js. Run: npm test */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  mediaExtension,
  validateMedia,
  contentTypeOf,
  isPendingMediaName,
  mediaUrlFor,
  isPendingMedia
} from '../../src/utils/mediaRules.js'

test('mediaExtension accepts only the extensions of the kind', () => {
  assert.equal(mediaExtension('toma.WAV', 'audio'), 'wav')
  assert.equal(mediaExtension('foto.jpg', 'audio'), null)
  assert.equal(mediaExtension('foto.JPG', 'photo'), 'jpg')
  assert.equal(mediaExtension('sin-extension', 'audio'), null)
  assert.equal(mediaExtension('virus.exe', 'photo'), null)
})

test('validateMedia: kind, format, empty and size', () => {
  const MB = 1024 * 1024
  assert.equal(validateMedia({ kind: 'audio', fileName: 'a.mp3', size: 1000 }), null)
  assert.match(validateMedia({ kind: 'video', fileName: 'a.mp4', size: 1 }), /desconocido/)
  assert.match(validateMedia({ kind: 'audio', fileName: 'a.txt', size: 1 }), /Formato/)
  assert.match(validateMedia({ kind: 'audio', fileName: 'a.mp3', size: 0 }), /vacío/)
  assert.match(validateMedia({ kind: 'audio', fileName: 'a.mp3', size: 25 * MB + 1 }), /25 MB/)
  assert.equal(validateMedia({ kind: 'audio', fileName: 'a.mp3', size: 25 * MB }), null)
  assert.match(validateMedia({ kind: 'photo', fileName: 'a.png', size: 10 * MB + 1 }), /10 MB/)
})

test('contentTypeOf and isPendingMediaName', () => {
  assert.equal(contentTypeOf('x.webm'), 'audio/webm')
  assert.equal(contentTypeOf('x.PNG'), 'image/png')
  assert.equal(contentTypeOf('x.zzz'), 'application/octet-stream')
  const id = '4bb65904-2bfe-43b8-9f14-bf0980a78089'
  assert.ok(isPendingMediaName(`${id}.wav`))
  assert.ok(!isPendingMediaName('../secret.wav'))
  assert.ok(!isPendingMediaName(`${id}/../x.wav`))
  assert.ok(!isPendingMediaName('..%2f..%2fx.wav'))
  assert.ok(!isPendingMediaName('.env'))
})

test('mediaUrlFor: Cloudinary, then Living Dictionaries, then the local file', () => {
  const bases = { cloudinaryBase: 'https://c/x', ldMediaBase: 'https://m', localBase: '/local' }
  assert.equal(
    mediaUrlFor({ cloudinary: 'ele', storagePath: 'a/b.wav' }, bases),
    'https://c/x/ele.mp3'
  )
  assert.equal(
    mediaUrlFor({ cloudinary: null, storagePath: 'a/b.wav' }, bases),
    'https://m/a/b.wav'
  )
  assert.equal(
    mediaUrlFor({ storagePath: null, pendingFile: 'ld-sync/pending-media/u.webm' }, bases),
    '/local/u.webm'
  )
  assert.equal(mediaUrlFor({ id: 'x' }, bases), null)
  assert.equal(mediaUrlFor(null, bases), null)
})

test('isPendingMedia', () => {
  assert.ok(isPendingMedia({ storagePath: null, pendingFile: 'f' }))
  assert.ok(!isPendingMedia({ storagePath: 'p', pendingFile: 'f' }))
  assert.ok(!isPendingMedia({ storagePath: 'p' }))
})
