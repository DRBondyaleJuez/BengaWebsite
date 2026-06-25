<template>
  <div class="diphthongs-section">
    <!-- Introduction -->
    <ContentSection 
      id="diphthongs-intro"
      :title="$t('chapters.chapter1.sections.diphthongs')"
    >
      <p class="diphthongs-section__intro">
        {{ sectionData.introduction[$i18n.locale] || sectionData.introduction.es }}
      </p>
    </ContentSection>

    <!-- Simple Diphthongs Grid -->
    <ContentSection id="simple-diphthongs">
      <div class="diphthongs-section__grid">
        <div
          v-for="diphthong in sectionData.simpleDiphthongs"
          :key="diphthong.diphthong"
          class="diphthongs-section__card"
        >
          <div class="diphthongs-section__card-header">
            <span class="diphthongs-section__diphthong-label">
              {{ diphthong.diphthong }}
            </span>
          </div>

          <p class="diphthongs-section__sounds-like">
            <strong>{{ $t('content.soundsLike') }}:</strong><br>
            {{ diphthong.soundsLike[$i18n.locale] || diphthong.soundsLike.es }}
          </p>

          <div v-if="diphthong.examples.length > 0" class="diphthongs-section__examples">
            <p class="diphthongs-section__examples-label">{{ $t('content.examples') }}:</p>
            <div
              v-for="example in diphthong.examples"
              :key="example.word"
              class="diphthongs-section__example-item"
            >
              <BengaWord
                :word="example.word"
                :audio-id="example.audioId"
                :meaning="example.meaning"
                :dictionary-url="getDictionaryUrl(example.word)"
              />
            </div>
          </div>
        </div>
      </div>
    </ContentSection>

    <!-- Navigation -->
    <nav class="diphthongs-section__nav">
      <router-link 
        to="/capitulo-1/vocales" 
        class="diphthongs-section__nav-link diphthongs-section__nav-link--prev"
      >
        ← {{ $t('chapters.chapter1.sections.alphabet') }}
      </router-link>
      <router-link 
        to="/capitulo-1/triptongos" 
        class="diphthongs-section__nav-link diphthongs-section__nav-link--next"
      >
        {{ $t('chapters.chapter1.sections.triphthongs') }} →
      </router-link>
    </nav>
  </div>
</template>

<script>
import ContentSection from '@/components/content/ContentSection.vue'
import BengaWord from '@/components/content/BengaWord.vue'
import diphthongsData from '@/data/chapter-1/diphthongs.json'

const LIVING_DICTIONARY_BASE = 'https://livingdictionaries.app/benga/entry'

export default {
  name: 'DipthongsSection',
  components: {
    ContentSection,
    BengaWord
  },
  data() {
    return {
      sectionData: diphthongsData
    }
  },
  methods: {
    getDictionaryUrl(word) {
      return `${LIVING_DICTIONARY_BASE}/${word.toLowerCase()}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/mixins';

.diphthongs-section {
  padding: $spacing-xl 0;

  &__intro {
    @include body-text;
    font-size: $font-size-lg;
    color: $color-text-secondary;
    margin-bottom: $spacing-lg;
  }

  &__note {
    display: flex;
    gap: $spacing-md;
    padding: $spacing-lg;
    background: rgba($color-info, 0.05);
    border-left: 4px solid $color-info;
    border-radius: 8px;
    margin-top: $spacing-lg;

    p {
      @include body-text;
      font-size: $font-size-sm;
      margin: 0;
      line-height: $line-height-loose;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: $spacing-lg;

    @include respond-below('sm') {
      grid-template-columns: 1fr;
    }
  }

  &__card {
    padding: $spacing-lg;
    background: $color-surface-alt;
    border-radius: 12px;
    border: 2px solid $color-primary-light;
    transition: all $transition-base;

    &:hover {
      box-shadow: 0 8px 16px rgba($color-primary, 0.15);
      border-color: $color-primary;
      transform: translateY(-2px);
    }
  }

  &__card-header {
    margin-bottom: $spacing-lg;
  }

  &__diphthong-label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    background: $color-primary;
    color: $color-text-inverse;
    border-radius: 12px;
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    font-family: $font-family-benga;
    letter-spacing: 0.1em;
  }

  &__sounds-like {
    @include body-text;
    font-size: $font-size-sm;
    margin-bottom: $spacing-md;
    line-height: $line-height-base;

    strong {
      color: $color-primary;
    }
  }

  &__examples {
    border-top: 1px solid rgba($color-primary, 0.2);
    padding-top: $spacing-md;
  }

  &__examples-label {
    @include heading-style;
    font-size: $font-size-sm;
    margin: 0 0 $spacing-sm 0;
    color: $color-primary;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__example-item {
    margin-bottom: $spacing-sm;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__nav {
    display: flex;
    justify-content: space-between;
    gap: $spacing-lg;
    margin-top: $spacing-xl;
    padding-top: $spacing-lg;
    border-top: 2px solid $border-color;

    @include respond-below('sm') {
      flex-direction: column;
    }
  }

  &__nav-link {
    display: inline-flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-md $spacing-lg;
    background: $color-primary;
    color: $color-text-inverse;
    text-decoration: none;
    border-radius: 8px;
    font-weight: $font-weight-semibold;
    transition: all $transition-base;
    border: 2px solid $color-primary;

    &:hover {
      background: $color-primary-dark;
      border-color: $color-primary-dark;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba($color-primary, 0.3);
    }

    &--prev {
      justify-self: flex-start;

      @include respond-below('sm') {
        justify-self: auto;
      }
    }

    &--next {
      justify-self: flex-end;

      @include respond-below('sm') {
        justify-self: auto;
      }
    }
  }
}
</style>
