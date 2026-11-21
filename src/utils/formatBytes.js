/**
 * A size in bytes as text people read: 1536 → "1.5 KB", 5242880 → "5 MB".
 * Pure (tests: scripts/tests/formatBytes.test.mjs).
 *
 * @param {number|null} bytes
 * @returns {string}
 */
export function formatBytes(bytes) {
  if (typeof bytes !== 'number' || !Number.isFinite(bytes) || bytes < 0) return '—'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let value = bytes
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit++
  }
  const text = unit === 0 ? String(value) : String(Math.round(value * 10) / 10)
  return `${text} ${units[unit]}`
}
