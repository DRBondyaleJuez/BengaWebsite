/**
 * What the word form and the sentence form share: a working copy of the record (`draft`) next to
 * the record as last loaded or saved (`saved`), change detection, saving with the 409 message,
 * and the unsaved-changes guard (beforeunload here; the router guards must be written in the
 * component itself because vue-router ignores guards that come from mixins):
 *
 *   beforeRouteLeave() { return this.confirmLeave() }
 *   beforeRouteUpdate() { return this.confirmLeave() }
 *
 * The component provides `sendRecord(draft)` (→ the saved record from the server).
 */
import { toast } from '@/components/admin/toast'
import { setField, canonicalJson } from '@/utils/dictionaryPaths'
import { acceptSuggestion, rejectSuggestion } from '@/utils/dictionarySuggestions'

export const LEAVE_QUESTION = 'Hay cambios sin guardar en esta ficha. ¿Salir y perderlos?'
const clone = (value) => JSON.parse(JSON.stringify(value))

export default {
  data() {
    return {
      loading: true,
      loadError: '',
      draft: null,
      // the record as last loaded or saved (only compared and copied)
      saved: null,
      saving: false,
      actionError: '',
      errorDetails: [],
      conflict: ''
    }
  },
  computed: {
    dirty() {
      return (
        Boolean(this.draft && this.saved) && canonicalJson(this.draft) !== canonicalJson(this.saved)
      )
    }
  },
  created() {
    window.addEventListener('beforeunload', this.warnBeforeUnload)
  },
  beforeUnmount() {
    window.removeEventListener('beforeunload', this.warnBeforeUnload)
  },
  methods: {
    warnBeforeUnload(event) {
      if (!this.dirty) return
      event.preventDefault()
      event.returnValue = ''
    },
    /** For the router guards: false cancels the navigation. */
    confirmLeave() {
      if (this.dirty && !window.confirm(LEAVE_QUESTION)) return false
      return true
    },
    resetMessages() {
      this.loadError = ''
      this.actionError = ''
      this.errorDetails = []
      this.conflict = ''
    },
    adoptRecord(record) {
      this.saved = clone(record)
      this.draft = clone(record)
    },
    /** Server-side changes to some fields (links, media) without touching the user's edits. */
    adoptServerFields(fresh, apply) {
      apply(this.draft, fresh)
      apply(this.saved, fresh)
      this.draft.sync = clone(fresh.sync)
      this.saved.sync = clone(fresh.sync)
    },
    discard() {
      if (this.dirty && !window.confirm('¿Descartar los cambios sin guardar?')) return
      this.adoptRecord(this.saved)
    },
    set(path, value) {
      setField(this.draft, this.saved, path, value)
    },
    /** Suggestions: accepting changes the draft only («Guardar» saves it); both leave a history line. */
    onAcceptSuggestion(id, value) {
      try {
        acceptSuggestion(this.draft, this.saved, id, value)
        toast('Sugerencia aplicada a la ficha: pulsa «Guardar» para conservarla', {
          type: 'success'
        })
      } catch (error) {
        toast(error.message, { type: 'error' })
      }
    },
    onRejectSuggestion(id) {
      try {
        rejectSuggestion(this.draft, id)
      } catch (error) {
        toast(error.message, { type: 'error' })
      }
    },
    async save() {
      this.saving = true
      this.actionError = ''
      this.errorDetails = []
      try {
        this.adoptRecord(await this.sendRecord(this.draft))
        this.conflict = ''
        toast('Guardado en la copia local (aún no enviado al diccionario)', { type: 'success' })
      } catch (error) {
        if (error.status === 409) this.conflict = error.message
        else this.showError(error)
      } finally {
        this.saving = false
      }
    },
    showError(error) {
      this.actionError = error.message
      this.errorDetails = (error.details || []).map((detail) =>
        typeof detail === 'string' ? detail : JSON.stringify(detail)
      )
    }
  }
}
