/**
 * Jump links of the dictionary forms: openCard('audio') opens the card with that id (FormCard
 * listens) and scrolls to it. Used by the checklist at the top of the word form.
 */
export const OPEN_CARD_EVENT = 'ld-open-card'

export function openCard(id) {
  window.dispatchEvent(new CustomEvent(OPEN_CARD_EVENT, { detail: id }))
  setTimeout(() => {
    const element = document.getElementById(id)
    if (!element) return
    window.scrollTo({
      top: element.getBoundingClientRect().top + window.scrollY - 80,
      behavior: 'smooth'
    })
    element.querySelector('button, input, select, textarea')?.focus({ preventScroll: true })
  }, 50)
}
