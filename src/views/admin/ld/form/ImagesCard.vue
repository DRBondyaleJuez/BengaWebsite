<!--
  ImagesCard - card «Imagen» of the word form (closed, optional): pictures of each sense, up to
  10 MB each (jpg, png, webp, gif). A new picture is saved locally as «pendiente de enviar»
  (sent with the rest of the changes). Thumbnails come from the Living Dictionaries media host,
  or from the local file while it is pending.
  Props: senses (read only), savedSenseIds (senses that exist on the server),
         upload (async function(payload) → true when saved), remove (async function(mediaId)), busy
-->
<template>
  <FormCard
    id="card-imagen"
    title="Imagen"
    :open="false"
    :badge="total ? String(total) : ''"
    :summary="total ? `${total} imagen(es)` : 'Sin imágenes (opcional)'"
  >
    <section v-for="(sense, index) in senses" :key="sense.id" class="images__sense">
      <h3 class="images__title">
        Sentido {{ index + 1 }}<span v-if="sense.glosses?.es"> · {{ sense.glosses.es }}</span>
      </h3>
      <p v-if="!savedSenseIds.includes(sense.id)" class="ld-help">
        Guarda la palabra para poder añadir imágenes a este sentido.
      </p>
      <template v-else>
        <ul v-if="sense.photos?.length" class="images__list">
          <li v-for="photo in sense.photos" :key="photo.id" class="images__item">
            <img
              v-if="urlOf(photo)"
              :src="urlOf(photo)"
              :alt="`Imagen del sentido ${index + 1}`"
              class="images__thumb"
              loading="lazy"
            />
            <span class="images__info">
              <small v-if="photo.photographer">Foto: {{ photo.photographer }}</small>
              <small v-if="photo.source">Fuente: {{ photo.source }}</small>
              <span v-if="isPending(photo)" class="images__badge">pendiente de enviar</span>
            </span>
            <button
              v-if="isPending(photo)"
              type="button"
              class="ld-btn ld-btn--danger"
              :disabled="busy"
              @click="remove(photo.id)"
            >
              Quitar
            </button>
          </li>
        </ul>
        <p v-else class="ld-help">Sin imágenes en este sentido.</p>

        <div class="ld-grid images__add">
          <label class="ld-field">
            Quién la hizo <small>(opcional)</small>
            <input v-model="photographer" />
          </label>
          <label class="ld-field">
            Fuente o licencia <small>(opcional)</small>
            <input v-model="source" />
          </label>
          <label class="ld-field">
            Archivo de imagen
            <input
              type="file"
              :accept="accept"
              :disabled="busy || sending"
              @change="pick($event, sense.id)"
            />
          </label>
        </div>
      </template>
    </section>
    <p v-if="message" class="images__message" role="alert">{{ message }}</p>
  </FormCard>
</template>

<script>
import FormCard from './FormCard.vue'
import { ldMediaUrl } from '@/services/ldMedia'
import { isPendingMedia, validateMedia, MEDIA_EXTENSIONS } from '@/utils/mediaRules'
import { toBase64 } from '../ldApi'

export default {
  name: 'ImagesCard',
  components: { FormCard },
  props: {
    senses: { type: Array, required: true },
    savedSenseIds: { type: Array, default: () => [] },
    upload: { type: Function, required: true },
    remove: { type: Function, required: true },
    busy: { type: Boolean, default: false }
  },
  data() {
    return {
      accept: MEDIA_EXTENSIONS.photo.map((ext) => `.${ext}`).join(','),
      photographer: '',
      source: '',
      sending: false,
      message: ''
    }
  },
  computed: {
    total() {
      return this.senses.reduce((sum, sense) => sum + (sense.photos || []).length, 0)
    }
  },
  methods: {
    urlOf: (photo) => ldMediaUrl(photo),
    isPending: isPendingMedia,
    async pick(event, senseId) {
      const [file] = event.target.files
      event.target.value = ''
      if (!file) return
      const problem = validateMedia({ kind: 'photo', fileName: file.name, size: file.size })
      this.message = problem || ''
      if (problem) return
      this.sending = true
      try {
        const saved = await this.upload({
          kind: 'photo',
          senseId,
          fileName: file.name,
          dataBase64: await toBase64(file),
          photographer: this.photographer.trim() || undefined,
          source: this.source.trim() || undefined
        })
        if (saved) {
          this.photographer = ''
          this.source = ''
        }
      } catch (error) {
        this.message = error.message
      } finally {
        this.sending = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.images {
  &__sense {
    margin-bottom: $spacing-lg;
  }

  &__title {
    margin: 0 0 $spacing-sm;
    font-size: $font-size-base;
    color: $color-text-secondary;
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-md;
    margin: 0 0 $spacing-md;
    padding: 0;
    list-style: none;
  }

  &__item {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
    width: 9rem;
  }

  &__thumb {
    width: 9rem;
    height: 9rem;
    object-fit: cover;
    border: 1px solid $border-color;
    border-radius: $border-radius-sm;
  }

  &__info {
    display: flex;
    flex-direction: column;
    font-size: $font-size-xs;
    overflow-wrap: anywhere;
  }

  &__badge {
    align-self: flex-start;
    padding: 0 $spacing-sm;
    background: rgba($color-warning, 0.25);
    border-radius: $border-radius-full;
    color: #7a5800;
  }

  &__message {
    color: $color-error;
    font-size: $font-size-sm;
  }
}
</style>
