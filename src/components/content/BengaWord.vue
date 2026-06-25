<template>
  <span class="benga-word" :class="{ 'benga-word--block': block }">
    <span class="benga-word__text">{{ word }}</span>
    
    <button
      v-if="audioId"
      class="benga-word__audio-btn"
      @click="playAudio"
      :aria-label="$t('audio.play') + ': ' + word"
      :disabled="isLoading"
    >
      <BaseIcon :name="isPlaying ? 'pause' : 'volume'" />
    </button>
    
    <span v-else class="benga-word__audio-pending" :title="$t('audio.unavailable')">
      <BaseIcon name="volume-muted" />
    </span>

    <a
      v-if="dictionaryUrl"
      :href="dictionaryUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="benga-word__dict-link"
      :title="$t('dictionary.linkTitle')"
    >
      <BaseIcon name="external-link" />
    </a>

    <span v-if="meaning && showMeaning" class="benga-word__meaning">
      ({{ meaning }})
    </span>

    <audio
      v-if="audioId"
      ref="audioElement"
      @ended="isPlaying = false"
      @error="handleAudioError"
      preload="none"
    />
  </span>
</template>

<script>
import BaseIcon from '@/components/common/BaseIcon.vue'

//const CLOUDINARY_BASE = '[res.cloudinary.com](https://res.cloudinary.com/YOUR_CLOUD_NAME/video/upload)'
const CLOUDINARY_BASE = 'https://res.cloudinary.com/dp5rofjyx/video/upload/v1780354084'

export default {
  name: 'BengaWord',
  components: {
    BaseIcon
  },
  props: {
    word: {
      type: String,
      required: true
    },
    audioId: {
      type: String,
      default: null
    },
    meaning: {
      type: String,
      default: null
    },
    dictionaryUrl: {
      type: String,
      default: null
    },
    showMeaning: {
      type: Boolean,
      default: true
    },
    block: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isPlaying: false,
      isLoading: false,
      hasError: false
    }
  },
  computed: {
    audioSrc() {
      if (!this.audioId) return null
      //return `${CLOUDINARY_BASE}/benga-audio/${this.audioId}.mp3`
      return `${CLOUDINARY_BASE}/${this.audioId}.mp3`
    }
  },
  methods: {
    async playAudio() {
      const el = this.$refs.audioElement
      if (!el) return

      // Lazily assign src so load events don't fire on render
      if (!el.src) {
        const src = this.audioSrc
        if (!src) return
        el.src = src
      }

      if (this.isPlaying) {
        el.pause()
        this.isPlaying = false
        return
      }

      this.isLoading = true
      try {
        await el.play()
        this.isPlaying = true
      } catch (error) {
        console.error('Audio playback failed:', error)
        this.hasError = true
      } finally {
        this.isLoading = false
      }
    },
    handleAudioError() {
      this.isLoading = false
      this.hasError = true
      console.warn(`Audio unavailable for: ${this.word}`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/mixins';

.benga-word {
  display: inline-flex;
  align-items: center;
  gap: $spacing-xs;
  flex-wrap: wrap;

  &--block {
    display: flex;
    padding: $spacing-sm $spacing-md;
    background-color: $color-benga-word-bg;
    border-radius: $border-radius-sm;
    margin: $spacing-xs 0;
  }

  &__text {
    @include benga-word-style;
    font-size: 1.1em;
  }

  &__audio-btn {
    @include flex-center;
    width: 24px;
    height: 24px;
    padding: 0;
    background: $color-primary;
    color: $color-text-inverse;
    border: none;
    border-radius: $border-radius-full;
    cursor: pointer;
    transition: all $transition-fast;
    @include focus-ring;

    &:hover:not(:disabled) {
      background: $color-primary-dark;
      transform: scale(1.1);
    }

    &:disabled {
      opacity: 0.5;
      cursor: wait;
    }

    svg {
      width: 14px;
      height: 14px;
    }
  }

  &__audio-pending {
    @include flex-center;
    width: 24px;
    height: 24px;
    color: $color-text-muted;
    opacity: 0.5;

    svg {
      width: 14px;
      height: 14px;
    }
  }

  &__dict-link {
    @include flex-center;
    width: 20px;
    height: 20px;
    color: $color-text-muted;
    transition: color $transition-fast;
    @include focus-ring;

    &:hover {
      color: $color-primary;
    }

    svg {
      width: 12px;
      height: 12px;
    }
  }

  &__meaning {
    color: $color-text-secondary;
    font-size: 0.9em;
    font-style: normal;
  }
}
</style>
