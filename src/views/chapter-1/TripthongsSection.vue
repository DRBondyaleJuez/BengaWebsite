<template>
  <div class="triphthongs-section">
    <!-- Introduction -->
    <ContentSection 
      id="triphthongs-intro"
      :title="$t('chapters.chapter1.sections.triphthongs')"
    >
      <p class="triphthongs-section__intro">
        {{ sectionData.introduction[$i18n.locale] || sectionData.introduction.es }}
      </p>
      <div class="triphthongs-section__note">
        <BaseIcon name="info" />
        <p>{{ sectionData.note[$i18n.locale] || sectionData.note.es }}</p>
      </div>
    </ContentSection>

    <!-- Triphthongs Grid -->
    <ContentSection 
      id="triphthongs-list"
      :title="$t('content.triphthongs') || 'Triptongos'"
    >
      <div class="triphthongs-section__grid">
        <div
          v-for="triphthong in sectionData.triphthongs"
          :key="triphthong.triphthong"
          class="triphthongs-section__card"
        >
          <div class="triphthongs-section__card-header">
            <span class="triphthongs-section__triphthong-label">
              {{ triphthong.triphthong }}
            </span>
          </div>

          <p class="triphthongs-section__sounds-like">
            <strong>{{ $t('content.soundsLike') }}:</strong><br>
            {{ triphthong.soundsLike[$i18n.locale] || triphthong.soundsLike.es }}
          </p>

          <div v-if="triphthong.examples.length > 0" class="triphthongs-section__examples">
            <p class="triphthongs-section__examples-label">{{ $t('content.examples') }}:</p>
            <div
              v-for="example in triphthong.examples"
              :key="example.word"
              class="triphthongs-section__example-item"
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

    <!-- Verb Conjugation Note -->
    <ContentSection 
      id="triphthongs-note"
      :title="$t('content.importantNote') || 'Nota Importante'"
    >
      <div class="triphthongs-section__info-box">
        <BaseIcon name="info" />
        <div class="triphthongs-section__info-content">
          <p class="triphthongs-section__info-text">
            {{ sectionData.verbConjugationNote[$i18n.locale] || sectionData.verbConjugationNote.es }}
          </p>
        </div>
      </div>
    </ContentSection>

    <!-- Navigation -->
    <nav class="triphthongs-section__nav">
      <router-link 
        to="/capitulo-1/diptongos" 
        class="triphthongs-section__nav-link triphthongs-section__nav-link--prev"
      >
        ← {{ $t('chapters.chapter1.sections.diphthongs') }}
      </router-link>
      <router-link 
        to="/capitulo-1/consonantes" 
        class="triphthongs-section__nav-link triphthongs-section__nav-link--next"
      >
        {{ $t('chapters.chapter1.sections.consonants') }} →
      </router-link>
    </nav>
  </div>
</template>

<script>
import ContentSection from '@/components/content/ContentSection.vue'
import BengaWord from '@/components/content/BengaWord.vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
import triphthongsData from '@/data/chapter-1/triphthongs.json'

const LIVING_DICTIONARY_BASE = 'https://livingdictionaries.app/benga/entry'

export default {
  name: 'TripthongsSection',
  components: {
    ContentSection,
    BengaWord,
    BaseIcon
  },
  data() {
    return {
      sectionData: triphthongsData
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

.triphthongs-section {
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
    border: 2px solid $color-secondary-light;
    transition: all $transition-base;

    &:hover {
      box-shadow: 0 8px 16px rgba($color-secondary, 0.15);
      border-color: $color-secondary;
      transform: translateY(-2px);
    }
  }

  &__card-header {
    margin-bottom: $spacing-lg;
  }

  &__triphthong-label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 80px;
    height: 72px;
    background: $color-secondary;
    color: $color-text-inverse;
    border-radius: 12px;
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    font-family: $font-family-benga;
    letter-spacing: 0.05em;
    padding: 0 $spacing-md;
    text-align: center;
  }

  &__sounds-like {
    @include body-text;
    font-size: $font-size-sm;
    margin-bottom: $spacing-md;
    line-height: $line-height-base;

    strong {
      color: $color-secondary;
    }
  }

  &__examples {
    border-top: 1px solid rgba($color-secondary, 0.2);
    padding-top: $spacing-md;
  }

  &__examples-label {
    @include heading-style;
    font-size: $font-size-sm;
    margin: 0 0 $spacing-sm 0;
    color: $color-secondary;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__example-item {
    margin-bottom: $spacing-sm;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__info-box {
    display: flex;
    gap: $spacing-md;
    padding: $spacing-lg;
    background: rgba($color-accent, 0.08);
    border-left: 4px solid $color-accent;
    border-radius: 8px;
  }

  &__info-content {
    flex: 1;
  }

  &__info-text {
    @include body-text;
    font-size: $font-size-sm;
    margin: 0;
    line-height: $line-height-loose;
    color: $color-text-primary;
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
    background: $color-secondary;
    color: $color-text-inverse;
    text-decoration: none;
    border-radius: 8px;
    font-weight: $font-weight-semibold;
    transition: all $transition-base;
    border: 2px solid $color-secondary;

    &:hover {
      background: $color-secondary-dark;
      border-color: $color-secondary-dark;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba($color-secondary, 0.3);
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
