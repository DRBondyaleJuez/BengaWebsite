<template>
  <div class="consonants-section">
    <!-- Introduction -->
    <ContentSection 
      id="consonants-intro"
      :title="$t('chapters.chapter1.sections.consonants')"
    >
      <p class="consonants-section__intro">
        {{ sectionData.introduction[$i18n.locale] || sectionData.introduction.es }}
      </p>
    </ContentSection>

    <!-- Simple Consonants -->
    <ContentSection 
      id="simple-consonants"
      :title="$t('content.simpleConsonants') || 'Consonantes Simples'"
    >
      <div class="consonants-section__consonants-grid">
        <div
          v-for="consonant in sectionData.simpleConsonants"
          :key="consonant.consonant"
          class="consonants-section__consonant-card"
        >
          <div class="consonants-section__consonant-header">
            <span class="consonants-section__consonant-label">
              {{ consonant.consonant }}
            </span>
          </div>

          <p class="consonants-section__sounds-like">
            <strong>{{ $t('content.soundsLike') }}:</strong><br>
            {{ consonant.soundsLike[$i18n.locale] || consonant.soundsLike.es }}
          </p>

          <div v-if="consonant.specialNote" class="consonants-section__special-note">
            <p class="consonants-section__note-text">
              <strong>{{ $t('content.note') }}:</strong>
              {{ consonant.specialNote[$i18n.locale] || consonant.specialNote.es }}
            </p>
          </div>
        </div>
      </div>
    </ContentSection>

    <!-- Consonant Combinations -->
    <ContentSection 
      id="consonant-combinations"
      :title="$t('content.consonantCombinations') || 'Combinaciones de Consonantes'"
    >
      <!-- Combination Rule Note -->
      <div class="consonants-section__rule-box">
        <BaseIcon name="info" />
        <div class="consonants-section__rule-content">
          <p class="consonants-section__rule-text">
            {{ sectionData.combinationNote[$i18n.locale] || sectionData.combinationNote.es }}
          </p>
        </div>
      </div>

      <!-- Each Combination Type -->
      <div 
        v-for="combination in sectionData.consonantCombinations"
        :key="combination.combination"
        class="consonants-section__combination-section"
      >
        <h3 class="consonants-section__combination-title">
          {{ combination.combination }}
        </h3>

        <p class="consonants-section__combination-pronunciation">
          <strong>{{ $t('content.pronunciation') }}:</strong><br>
          {{ combination.pronunciation[$i18n.locale] || combination.pronunciation.es }}
        </p>

        <div class="consonants-section__examples-grid">
          <div
            v-for="example in combination.examples"
            :key="example.word"
            class="consonants-section__example-item"
          >
            <BengaWord
              :word="example.word"
              :audio-id="example.audioId"
              :meaning="example.meaning"
              :dictionary-url="getDictionaryUrl(example.word)"
              block
            />
          </div>
        </div>
      </div>
    </ContentSection>

    <!-- Navigation -->
    <nav class="consonants-section__nav">
      <router-link 
        to="/capitulo-1/triptongos" 
        class="consonants-section__nav-link consonants-section__nav-link--prev"
      >
        ← {{ $t('chapters.chapter1.sections.triphthongs') }}
      </router-link>
      <router-link 
        to="/capitulo-1" 
        class="consonants-section__nav-link consonants-section__nav-link--next"
      >
        {{ $t('chapters.chapter1.title') }} →
      </router-link>
    </nav>
  </div>
</template>

<script>
import ContentSection from '@/components/content/ContentSection.vue'
import BengaWord from '@/components/content/BengaWord.vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
import consonantsData from '@/data/chapter-1/consonants.json'

const LIVING_DICTIONARY_BASE = 'https://livingdictionaries.app/benga/entry'

export default {
  name: 'ConsonantsSection',
  components: {
    ContentSection,
    BengaWord,
    BaseIcon
  },
  data() {
    return {
      sectionData: consonantsData
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

.consonants-section {
  padding: $spacing-xl 0;

  &__intro {
    @include body-text;
    font-size: $font-size-lg;
    color: $color-text-secondary;
    margin-bottom: $spacing-lg;
  }

  &__consonants-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: $spacing-lg;

    @include respond-below('sm') {
      grid-template-columns: 1fr;
    }
  }

  &__consonant-card {
    padding: $spacing-lg;
    background: $color-surface-alt;
    border-radius: 12px;
    border: 2px solid $color-accent-dark;
    transition: all $transition-base;

    &:hover {
      box-shadow: 0 8px 16px rgba($color-accent-dark, 0.15);
      border-color: $color-accent;
      transform: translateY(-2px);
    }
  }

  &__consonant-header {
    margin-bottom: $spacing-lg;
  }

  &__consonant-label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    background: $color-accent;
    color: $color-primary;
    border-radius: 10px;
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    font-family: $font-family-benga;
  }

  &__sounds-like {
    @include body-text;
    font-size: $font-size-sm;
    margin-bottom: $spacing-md;
    line-height: $line-height-base;

    strong {
      color: $color-accent-dark;
    }
  }

  &__special-note {
    border-top: 1px solid rgba($color-accent-dark, 0.2);
    padding-top: $spacing-md;
  }

  &__note-text {
    @include body-text;
    font-size: $font-size-xs;
    margin: 0;
    line-height: $line-height-loose;
    color: $color-text-primary;
  }

  &__rule-box {
    display: flex;
    gap: $spacing-md;
    padding: $spacing-lg;
    background: rgba($color-accent, 0.1);
    border-left: 4px solid $color-accent;
    border-radius: 8px;
    margin-bottom: $spacing-xl;
  }

  &__rule-content {
    flex: 1;
  }

  &__rule-text {
    @include body-text;
    font-size: $font-size-sm;
    margin: 0;
    line-height: $line-height-loose;
  }

  &__combination-section {
    padding: $spacing-lg;
    background: $color-surface;
    border-left: 4px solid $color-secondary;
    border-radius: 8px;
    margin-bottom: $spacing-lg;
  }

  &__combination-title {
    @include heading-style;
    font-size: $font-size-xl;
    margin: 0 0 $spacing-md 0;
    color: $color-secondary;
    font-family: $font-family-benga;
  }

  &__combination-pronunciation {
    @include body-text;
    font-size: $font-size-sm;
    margin-bottom: $spacing-lg;
    padding: $spacing-md;
    background: rgba($color-secondary, 0.05);
    border-radius: 6px;

    strong {
      color: $color-secondary;
    }
  }

  &__examples-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: $spacing-md;
  }

  &__example-item {
    padding: $spacing-md;
    background: $color-surface-alt;
    border-radius: 6px;
    border: 1px solid $border-color;
  }

  &__guide-section {
    margin-top: $spacing-xl;
  }

  &__guide-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: $spacing-lg;

    @include respond-below('sm') {
      grid-template-columns: 1fr;
    }
  }

  &__guide-item {
    padding: $spacing-lg;
    background: $color-surface-alt;
    border-radius: 8px;
    border-left: 4px solid $color-primary;

    h4 {
      @include heading-style;
      font-size: $font-size-lg;
      margin: 0 0 $spacing-md 0;
      color: $color-primary;
    }

    p {
      @include body-text;
      font-size: $font-size-sm;
      margin: 0;
      line-height: $line-height-loose;
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
    background: $color-accent;
    color: $color-primary;
    text-decoration: none;
    border-radius: 8px;
    font-weight: $font-weight-semibold;
    transition: all $transition-base;
    border: 2px solid $color-accent;

    &:hover {
      background: $color-accent-dark;
      border-color: $color-accent-dark;
      color: $color-text-inverse;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba($color-accent, 0.3);
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
