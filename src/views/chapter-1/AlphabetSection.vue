<template>
  <div class="alphabet-section">
    <!-- Introduction -->
    <ContentSection 
      id="alphabet-intro"
      :title="$t('chapters.chapter1.sections.alphabet')"
    >
      <p class="alphabet-section__intro">
        {{ sectionData.introduction[$i18n.locale] || sectionData.introduction.es }}
      </p>
    </ContentSection>

    <!-- Letters List -->
    <ContentSection 
      id="alphabet-letters"
      :title="$t('content.lettersList') || 'Lista de Letras'"
    >
      <div class="alphabet-section__letters-container">
        <p class="alphabet-section__letters">
          {{ sectionData.lettersList[$i18n.locale] || sectionData.lettersList.es }}
        </p>
        <p class="alphabet-section__note-inline">
          <strong>{{ $t('content.totalLetters') || 'Total' }}:</strong> {{ $t('content.twentyThreeLetters') || '23 letras' }}
        </p>
      </div>

      <div class="alphabet-section__missing">
        <BaseIcon name="info" />
        <div class="alphabet-section__missing-content">
          <p class="alphabet-section__missing-title">
            {{ $t('content.missingConsonants') || 'Consonantes ausentes' }}
          </p>
          <p>
            {{ sectionData.consonantsDescription[$i18n.locale] || sectionData.consonantsDescription.es }}
          </p>
        </div>
      </div>
    </ContentSection>

    <!-- Vowels Overview -->
    <ContentSection 
      id="alphabet-vowels-overview"
      :title="$t('content.vowelSounds') || 'Sonidos Vocales'"
    >
      <p class="alphabet-section__vowels-info">
        {{ sectionData.vowelsInfo[$i18n.locale] || sectionData.vowelsInfo.es }}
      </p>

      <div class="alphabet-section__vowel-tags">
        <span 
          v-for="vowel in sectionData.vowels" 
          :key="vowel.benga"
          class="alphabet-section__vowel-tag"
          :class="{ 'alphabet-section__vowel-tag--long': vowel.isLong }"
        >
          {{ vowel.benga }}
        </span>
      </div>

      <div class="alphabet-section__clarity-note">
        <p class="alphabet-section__note-text">
          <strong>{{ $t('content.note') }}:</strong>
          {{ sectionData.notes.clarityNote[$i18n.locale] || sectionData.notes.clarityNote.es }}
        </p>
      </div>
    </ContentSection>

    <!-- Vowels Detail -->
    <ContentSection 
      id="alphabet-vowels-detail"
      :title="$t('content.vowelPronunciation') || 'Pronunciación de Vocales'"
      class="alphabet-section__vowels-section"
    >
      <div class="alphabet-section__vowels-grid">
        <div
          v-for="vowel in sectionData.vowels"
          :key="vowel.benga"
          class="alphabet-section__vowel-card"
        >
          <div class="alphabet-section__vowel-header">
            <span class="alphabet-section__vowel-letter">{{ vowel.benga }}</span>
            <span v-if="vowel.isLong" class="alphabet-section__vowel-badge">
              {{ $t('content.long') || 'larga' }}
            </span>
          </div>

          <p class="alphabet-section__sounds-like">
            <strong>{{ $t('content.soundsLike') }}:</strong><br>
            {{ vowel.soundsLike[$i18n.locale] || vowel.soundsLike.es }}
          </p>

          <div class="alphabet-section__vowel-examples">
            <p class="alphabet-section__examples-label">{{ $t('content.examples') }}:</p>
            <div
              v-for="example in vowel.examples"
              :key="example.word"
              class="alphabet-section__example-item"
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

    <!-- Special Letter: Y -->
    <ContentSection
      v-for="specialLetter in sectionData.specialLetters"
      :key="`special-${specialLetter.letter}`"
      :id="`letter-${specialLetter.letter}`"
      :title="`La letra '${specialLetter.letter}' como vocal y consonante`"
      class="alphabet-section__special"
    >
      <p class="alphabet-section__special-description">
        {{ specialLetter.description[$i18n.locale] || specialLetter.description.es }}
      </p>

      <div class="alphabet-section__special-examples">
        <div
          v-for="(exampleGroup, index) in specialLetter.examples"
          :key="index"
          class="alphabet-section__special-group"
        >
          <h4 class="alphabet-section__special-group-title">
            {{ exampleGroup.label }}
          </h4>

          <div class="alphabet-section__word-grid">
            <div
              v-for="example in exampleGroup.words"
              :key="example.word"
              class="alphabet-section__word-item"
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
      </div>
    </ContentSection>

    <!-- Important Notes -->
    <ContentSection 
      id="alphabet-notes"
      :title="$t('content.importantNotes') || 'Notas Importantes'"
      class="alphabet-section__notes-section"
    >
      <div class="alphabet-section__notes-list">
        <div class="alphabet-section__note-item">
          <h4>{{ $t('content.elision') || 'Elisión' }}</h4>
          <p>
            {{ sectionData.notes.elisionNote[$i18n.locale] || sectionData.notes.elisionNote.es }}
          </p>
        </div>

        <div class="alphabet-section__note-item">
          <h4>{{ $t('content.pronunciation') || 'Pronunciación' }}</h4>
          <p>
            {{ sectionData.notes.pronunciationNote[$i18n.locale] || sectionData.notes.pronunciationNote.es }}
          </p>
        </div>
      </div>
    </ContentSection>

    <!-- Navigation -->
    <nav class="alphabet-section__nav">
      <router-link 
        to="/capitulo-1" 
        class="alphabet-section__nav-link alphabet-section__nav-link--prev"
      >
        ← {{ $t('chapters.chapter1.title') }}
      </router-link>
      <router-link 
        to="/capitulo-1/diptongos" 
        class="alphabet-section__nav-link alphabet-section__nav-link--next"
      >
        {{ $t('chapters.chapter1.sections.diphthongs') }} →
      </router-link>
    </nav>
  </div>
</template>

<script>
import ContentSection from '@/components/content/ContentSection.vue'
import BengaWord from '@/components/content/BengaWord.vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
import alphabetData from '@/data/chapter-1/alphabet.json'

const LIVING_DICTIONARY_BASE = 'https://livingdictionaries.app/benga/entry'

export default {
  name: 'AlphabetSection',
  components: {
    ContentSection,
    BengaWord,
    BaseIcon
  },
  data() {
    return {
      sectionData: alphabetData
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

.alphabet-section {
  padding: $spacing-xl 0;

  &__intro {
    @include body-text;
    font-size: $font-size-lg;
    color: $color-text-secondary;
    margin-bottom: $spacing-lg;
  }

  &__letters-container {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
  }

  &__letters {
    @include benga-word-style;
    font-size: $font-size-xl;
    letter-spacing: 0.15em;
    background: $color-benga-word-bg;
    padding: $spacing-lg;
    border-radius: 8px;
    border-left: 4px solid $color-benga-word;
    line-height: $line-height-loose;
    margin: 0;
  }

  &__note-inline {
    @include body-text;
    font-size: $font-size-sm;
    color: $color-text-muted;
    margin: 0;
  }

  &__missing {
    display: flex;
    gap: $spacing-md;
    padding: $spacing-lg;
    background: rgba($color-warning, 0.05);
    border-radius: 8px;
    border-left: 4px solid $color-warning;

    @include respond-below('sm') {
      flex-direction: column;
    }
  }

  &__missing-content {
    flex: 1;
  }

  &__missing-title {
    @include heading-style;
    font-size: $font-size-base;
    margin: 0 0 $spacing-sm 0;
    color: $color-text-primary;
  }

  &__missing-content p {
    margin: 0;
    @include body-text;
    font-size: $font-size-sm;
  }

  &__vowels-info {
    @include body-text;
    font-size: $font-size-lg;
    margin-bottom: $spacing-lg;
    padding: $spacing-lg;
    background: $color-surface-alt;
    border-radius: 8px;
  }

  &__vowel-tags {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-md;
    margin-bottom: $spacing-lg;
  }

  &__vowel-tag {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 48px;
    height: 48px;
    background: $color-primary-light;
    color: $color-text-inverse;
    border-radius: 8px;
    font-weight: $font-weight-bold;
    font-size: $font-size-base;
    font-family: $font-family-benga;
    transition: all $transition-base;

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 8px rgba($color-primary, 0.3);
    }

    &--long {
      background: $color-accent;
      color: $color-primary;
    }
  }

  &__clarity-note {
    padding: $spacing-lg;
    background: rgba($color-info, 0.05);
    border-left: 4px solid $color-info;
    border-radius: 8px;
  }

  &__note-text {
    @include body-text;
    font-size: $font-size-sm;
    margin: 0;
    line-height: $line-height-loose;
  }

  &__special {
    margin-top: $spacing-xl;
  }

  &__special-description {
    @include body-text;
    margin-bottom: $spacing-lg;
    padding: $spacing-lg;
    background: $color-surface-alt;
    border-radius: 8px;
    line-height: $line-height-loose;
  }

  &__special-examples {
    display: flex;
    flex-direction: column;
    gap: $spacing-xl;
  }

  &__special-group {
    background: $color-surface-alt;
    padding: $spacing-lg;
    border-radius: 8px;
  }

  &__special-group-title {
    @include heading-style;
    font-size: $font-size-lg;
    margin: 0 0 $spacing-lg 0;
    color: $color-primary;
  }

  &__word-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: $spacing-md;

    @include respond-below('sm') {
      grid-template-columns: 1fr;
    }
  }

  &__word-item {
    padding: $spacing-md;
    background: $color-surface;
    border-radius: 6px;
    border: 1px solid $border-color;
  }

  &__vowels-section {
    margin-top: $spacing-xl;
  }

  &__vowels-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: $spacing-lg;

    @include respond-below('sm') {
      grid-template-columns: 1fr;
    }
  }

  &__vowel-card {
    padding: $spacing-lg;
    background: $color-surface-alt;
    border-radius: 12px;
    border: 2px solid $color-primary-light;
    transition: all $transition-base;

    &:hover {
      box-shadow: 0 8px 16px rgba($color-primary, 0.15);
      border-color: $color-primary;
    }
  }

  &__vowel-header {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    margin-bottom: $spacing-md;
  }

  &__vowel-letter {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    background: $color-primary;
    color: $color-text-inverse;
    border-radius: 10px;
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    font-family: $font-family-benga;
  }

  &__vowel-badge {
    display: inline-block;
    padding: $spacing-xs $spacing-sm;
    background: $color-accent;
    color: $color-primary;
    border-radius: 20px;
    font-size: $font-size-xs;
    font-weight: $font-weight-semibold;
    text-transform: uppercase;
    letter-spacing: 0.05em;
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

  &__vowel-examples {
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

  &__notes-section {
    margin-top: $spacing-xl;
  }

  &__notes-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: $spacing-lg;

    @include respond-below('sm') {
      grid-template-columns: 1fr;
    }
  }

  &__note-item {
    padding: $spacing-lg;
    background: $color-surface-alt;
    border-radius: 8px;
    border-left: 4px solid $color-secondary;

    h4 {
      @include heading-style;
      font-size: $font-size-lg;
      margin: 0 0 $spacing-md 0;
      color: $color-secondary;
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
