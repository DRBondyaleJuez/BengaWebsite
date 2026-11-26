// toast.js - tiny reactive store for toast messages (shown by ToastHost.vue).
//
// API:   toast(message, { type = 'info', timeout = 4000 })  -> id
//        dismissToast(id)
//        toasts   (reactive array, read by ToastHost)
// Types: 'success' | 'error' | 'info' | 'warning'. timeout 0 = stays until closed.
//
// Usage:
//   import { toast } from '@/components/admin/toast'
//   toast('Guardado', { type: 'success' })
import { reactive } from 'vue'

export const toasts = reactive([])
let nextId = 1

export function dismissToast(id) {
  const i = toasts.findIndex((t) => t.id === id)
  if (i !== -1) toasts.splice(i, 1)
}

export function toast(message, { type = 'info', timeout = 4000 } = {}) {
  const id = nextId++
  toasts.push({ id, message, type })
  if (timeout > 0) setTimeout(() => dismissToast(id), timeout)
  return id
}
