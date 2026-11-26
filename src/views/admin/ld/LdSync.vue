<template>
  <section class="ld-sync">
    <p v-if="running" class="ld-sync__running" role="status">
      ⏳ Hay una sincronización en curso ({{ kindLabel(running.kind) }},
      {{ modeLabel(running.mode) }}). Espera a que termine.
    </p>

    <!-- ---- Traer de LD ---------------------------------------------------------------------- -->
    <section id="traer" class="ld-sync__card">
      <h2>
        ⬇️ Traer de Living Dictionaries
        <InfoTip
          text="Lee el diccionario desde su copia pública (una sola descarga, sin clave) y trae lo que cambió allí. Tus cambios sin enviar se conservan; si un mismo campo cambió aquí y allí, queda en conflicto para que elijas."
        />
      </h2>
      <p class="ld-sync__muted">
        La copia pública puede ir hasta unos 30 minutos por detrás del diccionario.
      </p>
      <div class="ld-sync__buttons">
        <button
          type="button"
          class="ld-sync__button"
          :disabled="busy"
          @click="run('pull', 'check')"
        >
          Ver qué cambiaría
        </button>
        <button
          v-if="pullPreview"
          type="button"
          class="ld-sync__button ld-sync__button--primary"
          :disabled="busy || !pullChanges"
          @click="confirmPull = true"
        >
          Aplicar {{ pullChanges }} cambios
        </button>
        <label class="ld-sync__check">
          <input v-model="fresh" type="checkbox" :disabled="busy" />
          Descargar de nuevo (si no, se usa la copia de hace menos de 10 min)
        </label>
      </div>
      <p v-if="progress.pull" class="ld-sync__progress" role="status">{{ progress.pull }}</p>
      <SyncPreview v-if="pullPreview" :preview="pullPreview" direction="pull" />
    </section>

    <AdminModal v-model:open="confirmPull" title="Traer cambios de Living Dictionaries">
      <p>
        Se actualizarán <strong>{{ pullChanges }}</strong> registros de la copia local con lo que
        cambió en Living Dictionaries. Tus cambios sin enviar no se pierden.
      </p>
      <p v-if="pullPreview?.counts.conflict">
        ⚠ {{ pullPreview.counts.conflict }} quedarán en conflicto: los resolverás en su ficha.
      </p>
      <template #footer>
        <button type="button" class="ld-sync__link" @click="confirmPull = false">Cancelar</button>
        <button type="button" class="ld-sync__button ld-sync__button--primary" @click="applyPull">
          Traer cambios
        </button>
      </template>
    </AdminModal>
  </section>
</template>

<script>
/**
 * /admin/living-dictionary/sincronizacion (tasks L5.2–L5.6): «Traer de LD», «Enviar cambios»,
 * history of runs and errors. Each action starts the matching npm script (ld:pull, ld:push,
 * ld:undo) through /__dev/ld/sync and follows its run log; nothing happens without a click.
 */
import InfoTip from '@/components/admin/InfoTip.vue'
import AdminModal from '@/components/admin/AdminModal.vue'
import { toast } from '@/components/admin/toast'
import SyncPreview from './SyncPreview.vue'
import { getSyncStatus, startSync, waitForRun } from './ldApi'

const KINDS = { pull: 'traer de LD', push: 'enviar cambios', undo: 'deshacer un envío' }
const MODES = { check: 'vista previa', apply: 'aplicando' }
/** Statuses of a pull preview that change the local copy. */
const PULL_CHANGES = ['new-in-ld', 'changed-in-ld', 'both-changed', 'conflict', 'deleted-in-ld']

export default {
  name: 'LdSync',
  components: { InfoTip, AdminModal, SyncPreview },
  data() {
    return {
      running: null,
      busy: false,
      fresh: false,
      pullPreview: null,
      confirmPull: false,
      progress: { pull: '' }
    }
  },
  computed: {
    pullChanges() {
      if (!this.pullPreview) return 0
      return PULL_CHANGES.reduce((n, status) => n + (this.pullPreview.counts[status] || 0), 0)
    }
  },
  async mounted() {
    this.running = await getSyncStatus().catch(() => null)
  },
  methods: {
    kindLabel: (kind) => KINDS[kind] || kind,
    modeLabel: (mode) => MODES[mode] || mode,
    /** Starts a run and waits for it; returns the final run (or null on error). */
    async run(kind, mode, options = {}) {
      this.busy = true
      const key = kind
      this.progress[key] = mode === 'check' ? 'Preparando la vista previa…' : 'Trabajando…'
      try {
        const runId = await startSync(kind, mode, { fresh: this.fresh, ...options })
        this.running = { runId, kind, mode }
        const run = await waitForRun(runId, (state) => {
          const { done, total } = state.progress
          if (total) this.progress[key] = `${done} de ${total}…`
        })
        this.progress[key] = ''
        if (run.status !== 'done') {
          toast(run.error?.message || 'La sincronización no terminó', {
            type: 'error',
            timeout: 10000
          })
        }
        if (kind === 'pull') this.pullPreview = mode === 'check' ? run.preview : null
        return run
      } catch (error) {
        this.progress[key] = ''
        toast(error.message, { type: 'error', timeout: 8000 })
        return null
      } finally {
        this.busy = false
        this.running = null
      }
    },
    async applyPull() {
      this.confirmPull = false
      const run = await this.run('pull', 'apply')
      if (run?.status === 'done') {
        const count = (operation) => run.items.filter((item) => item.operation === operation).length
        toast(
          `Traído: ${count('updated')} actualizadas, ${count('added')} nuevas, ${count('removed')} quitadas, ${count('conflicts')} en conflicto`,
          { type: 'success', timeout: 8000 }
        )
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.ld-sync {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;

  &__card {
    padding: $spacing-md $spacing-lg;
    background: $color-surface;
    border-radius: $border-radius-md;
    box-shadow: $shadow-sm;

    @include respond-below(sm) {
      padding: $spacing-md $spacing-sm;
    }

    h2 {
      display: flex;
      align-items: center;
      gap: $spacing-xs;
      margin: 0 0 $spacing-sm;
      font-size: $font-size-xl;
      color: $color-primary-dark;
    }
  }

  &__muted {
    color: $color-text-muted;
    font-size: $font-size-sm;
  }

  &__running {
    margin: 0;
    padding: $spacing-sm $spacing-md;
    background: rgba($color-primary, 0.1);
    border-radius: $border-radius-sm;
  }

  &__buttons {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: $spacing-sm;
    margin: $spacing-sm 0;
  }

  &__button {
    padding: $spacing-xs $spacing-md;
    background: $color-surface;
    border: 1px solid $color-primary;
    border-radius: $border-radius-sm;
    color: $color-primary-dark;
    font-size: $font-size-base;
    cursor: pointer;

    &:hover:not(:disabled) {
      background: rgba($color-primary, 0.1);
    }

    &--primary {
      background: $color-primary;
      color: $color-text-inverse;

      &:hover:not(:disabled) {
        background: $color-primary-dark;
      }
    }

    &--danger {
      background: $color-error;
      border-color: $color-error;
      color: $color-text-inverse;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__check {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    font-size: $font-size-sm;
  }

  &__progress {
    font-weight: $font-weight-semibold;
  }

  &__link {
    background: none;
    border: none;
    color: $color-primary-dark;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
