/**
 * Character differences between two short texts (a dictionary field), to highlight them side by
 * side in a conflict: diffText('Hāngā', 'Hanga') → parts of `same`, `del` (only in a) and `ins`
 * (only in b). Plain LCS: fine for words and sentences; long texts fall back to "all changed".
 * Pure, no imports (tested in scripts/tests/textDiff.test.mjs).
 */
export function diffText(a = '', b = '') {
  const x = [...String(a ?? '').normalize('NFC')]
  const y = [...String(b ?? '').normalize('NFC')]
  if (x.length * y.length > 250000) {
    return [
      ...(x.length ? [{ type: 'del', text: x.join('') }] : []),
      ...(y.length ? [{ type: 'ins', text: y.join('') }] : [])
    ]
  }
  // lengths of the longest common subsequence of every pair of suffixes
  const table = Array.from({ length: x.length + 1 }, () => new Array(y.length + 1).fill(0))
  for (let i = x.length - 1; i >= 0; i -= 1) {
    for (let j = y.length - 1; j >= 0; j -= 1) {
      table[i][j] =
        x[i] === y[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1])
    }
  }
  const parts = []
  const push = (type, char) => {
    const last = parts[parts.length - 1]
    if (last && last.type === type) last.text += char
    else parts.push({ type, text: char })
  }
  let i = 0
  let j = 0
  while (i < x.length && j < y.length) {
    if (x[i] === y[j]) {
      push('same', x[i])
      i += 1
      j += 1
    } else if (table[i + 1][j] >= table[i][j + 1]) {
      push('del', x[i])
      i += 1
    } else {
      push('ins', y[j])
      j += 1
    }
  }
  while (i < x.length) push('del', x[i++])
  while (j < y.length) push('ins', y[j++])
  return parts
}
