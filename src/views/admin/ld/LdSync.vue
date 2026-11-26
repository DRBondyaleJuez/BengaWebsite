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

    <!-- ---- Enviar cambios ------------------------------------------------------------------- -->
    <section id="enviar" class="ld-sync__card">
      <h2>
        ⬆️ Enviar cambios
        <InfoTip
          text="Envía solo los campos que cambiaste aquí desde la última lectura. Antes pregunta a Living Dictionaries qué cambió allí: esas palabras esperan a que las traigas. Después vuelve a leer cada palabra enviada para comprobarla."
        />
      </h2>
      <p class="ld-sync__muted">
        Como mucho {{ pushPreview?.limit ?? 10 }} registros por envío. Las marcas «Necesita
        revisión» solo se envían si marcaste «Enviar esta marca» en la ficha. Los audios van aparte
        (fase L6).
      </p>
      <div class="ld-sync__buttons">
        <button type="button" class="ld-sync__button" :disabled="busy" @click="previewPush">
          Ver qué se enviaría
        </button>
        <button
          v-if="pushPreview"
          type="button"
          class="ld-sync__button ld-sync__button--primary"
          :disabled="busy || !pushCount"
          @click="confirmPush = true"
        >
          Enviar {{ pushCount }} registros
        </button>
      </div>
      <p v-if="progress.push" class="ld-sync__progress" role="status">{{ progress.push }}</p>
      <p v-if="pushPreview?.more" class="ld-sync__muted">
        {{ pushPreview.more }} más quedan para el siguiente envío.
      </p>
      <SyncPreview v-if="pushPreview" :preview="pushPreview" direction="push" />
      <div v-if="pushResult" class="ld-sync__result">
        <h3>Resultado del envío</h3>
        <ul>
          <li
            v-for="(item, index) in pushResult.items"
            :key="index"
            :class="`ld-sync__result-item ld-sync__result-item--${item.status}`"
          >
            {{ item.status === 'ok' ? '✓' : '✗' }} <strong>{{ item.word }}</strong> ·
            {{ operationLabel(item.operation) }}
            <template v-if="item.fields?.length"> ({{ item.fields.join(', ') }})</template>
            <template v-if="item.message">: {{ item.message }}</template>
          </li>
        </ul>
      </div>
    </section>

    <AdminModal v-model:open="confirmPush" title="Enviar a Living Dictionaries">
      <p>
        Se enviarán <strong>{{ pushCount }}</strong> registros a
        <strong>livingdictionaries.app/benga</strong>: {{ pushPreview?.counts.create || 0 }} nuevos
        y {{ pushPreview?.counts.update || 0 }}
        cambiados.
      </p>
      <p>Cada palabra se vuelve a leer después para comprobar que quedó bien.</p>
      <template #footer>
        <button type="button" class="ld-sync__link" @click="confirmPush = false">Cancelar</button>
        <button type="button" class="ld-sync__button ld-sync__button--primary" @click="applyPush">
          Enviar ahora
        </button>
      </template>
    </AdminModal>

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
const OPERATIONS = {
  create: 'creada',
  update: 'cambios enviados',
  verify: 'comprobada',
  relation: 'relación',
  photo: 'imagen',
  delete: 'borrado',
  updated: 'actualizada',
  added: 'añadida',
  removed: 'quitada',
  conflicts: 'en conflicto'
}
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
      pushPreview: null,
      pushResult: null,
      confirmPush: false,
      deletions: false,
      progress: { pull: '', push: '' }
    }
  },
  computed: {
    pushCount() {
      if (!this.pushPreview) return 0
      const counts = this.pushPreview.counts
      return (counts.create || 0) + (counts.update || 0) + (this.deletions ? counts.delete || 0 : 0)
    },
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
    operationLabel: (operation) => OPERATIONS[operation] || operation,
    async previewPush() {
      this.pushResult = null
      const run = await this.run('push', 'check', { deletions: this.deletions })
      this.pushPreview = run?.status === 'done' ? run.preview : null
    },
    async applyPush() {
      this.confirmPush = false
      const run = await this.run('push', 'apply', { deletions: this.deletions })
      this.pushPreview = null
      if (!run) return
      this.pushResult = run
      const failed = run.totals.failed || 0
      toast(
        failed
          ? `Envío terminado con ${failed} errores: míralos abajo y en el historial`
          : 'Envío terminado y comprobado',
        { type: failed ? 'error' : 'success', timeout: 8000 }
      )
    },
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

  &__result {
    margin-top: $spacing-md;

    h3 {
      margin: 0 0 $spacing-xs;
      font-size: $font-size-base;
    }

    ul {
      margin: 0;
      padding-left: $spacing-md;
      font-size: $font-size-sm;
    }
  }

  &__result-item--failed {
    color: $color-error;
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
