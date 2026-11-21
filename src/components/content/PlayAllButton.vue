<template>
  <button
    v-if="urls.length"
    type="button"
    class="play-all"
    :aria-pressed="running ? 'true' : 'false'"
    @click="playAll(urls)"
  >
    <BaseIcon :name="running ? 'pause' : 'play'" />
    <span>{{ running ? $t('audio.stopAll') : $t('audio.playAll', { count: urls.length }) }}</span>
  </button>
</template>

<script>
import BaseIcon from '@/components/common/BaseIcon.vue'
import { getAudioUrl } from '@/services/wordLinks'
import { audioState, playAll } from '@/services/audioPlayer'
import { playableUrls } from '@/utils/playQueue'

/**
 * «Escuchar todo»: plays the recordings of a list of words (or phrases) one after another.
 *
 *   <PlayAllButton :words="['Epokolo', 'Bepokolo']" />
 *
 * Words without a recording are skipped; with none recorded the button is not shown at all
 * (so it appears by itself as recordings are added, see docs/AUDIO-GUIDE.md).
 */
export default {
  name: 'PlayAllButton',
  components: { BaseIcon },
  props: {
    /** The Benga words or phrases, in the order to play them. */
    words: { type: Array, required: true }
  },
  computed: {
    urls() {
      return playableUrls(this.words, getAudioUrl)
    },
    running() {
      return audioState.queue.length > 0 && audioState.queue.join() === this.urls.join()
    }
  },
  methods: { playAll }
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.play-all {
  display: inline-flex;
  align-items: center;
  gap: $spacing-xs;
  margin-bottom: $spacing-md;
  padding: $spacing-xs $spacing-md;
  background: $color-primary;
  color: $color-text-inverse;
  border: none;
  border-radius: $border-radius-full;
  cursor: pointer;
  transition: background $transition-fast;
  @include focus-ring;

  &:hover {
    background: $color-primary-dark;
  }

  svg {
    width: 16px;
    height: 16px;
  }
}
</style>
