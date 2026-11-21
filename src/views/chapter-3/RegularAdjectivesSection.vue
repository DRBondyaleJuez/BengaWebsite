<template>
  <div class="regular-adjectives">
    <div class="regular-adjectives__header">
      <h1>{{ $t('pages.regularAdjectives.adjetivosVariablesRegulares') }}</h1>
      <p class="subtitle">{{ $t('pages.regularAdjectives.flexionSegunClaseNominal') }}</p>
    </div>

    <!-- Overview -->
    <section class="regular-adjectives__overview">
      <p>
        {{ $t('pages.regularAdjectives.adjetivosVariablesTomanSu') }}
      </p>
    </section>

    <!-- Class Examples -->
    <section class="regular-adjectives__classes">
      <h2>{{ $t('pages.regularAdjectives.flexionPorClasesNominales') }}</h2>
      <p class="section-intro">
        {{ $t('pages.regularAdjectives.veamosComoSeDeclina') }}
        <strong class="bengaform">{{ $t('pages.regularAdjectives.buamu') }}</strong>
        {{ $t('pages.regularAdjectives.buenoParaConcordarCon') }}
        <span class="highlight-legend">resaltada</span>
        {{ $t('pages.regularAdjectives.esMarcaConcordanciaCon') }}
      </p>
      <div class="classes-container">
        <div class="class-example" v-for="classEx in classes" :key="`class-${classEx.classId}`">
          <div class="class-example__header">
            <h3>{{ classEx.classType }}</h3>
            <span class="class-label">{{
              $t('pages.regularAdjectives.clase', { classId: classEx.classId })
            }}</span>
          </div>

          <div class="class-example__rules">
            <div class="rule">
              <span class="rule__label">{{ $t('pages.regularAdjectives.reglaNombre') }}</span>
              <p class="rule__text">{{ classEx.nounClassRule }}</p>
              <router-link class="rule__link" :to="`/capitulo-2/clase-${classEx.classId}`">
                {{ $t('pages.regularAdjectives.repasarClase', { classId: classEx.classId }) }}
              </router-link>
            </div>
            <div class="rule rule--adjective">
              <span class="rule__label">{{ $t('pages.regularAdjectives.reglaAdjetivo') }}</span>
              <p class="rule__text">{{ classEx.adjectiveClassRule }}</p>
            </div>
          </div>

          <div class="class-example__pattern">
            <div class="pattern-row">
              <span class="label">{{ $t('pages.regularAdjectives.singular') }}</span>
              <BengaWord
                :word="classEx.singular.bengaForm"
                :highlight-prefix="classEx.singular.highlight"
              />
            </div>
            <div class="pattern-arrow">↓</div>
            <div class="pattern-row">
              <span class="label">{{ $t('pages.regularAdjectives.plural') }}</span>
              <BengaWord
                :word="classEx.plural.bengaForm"
                :highlight-prefix="classEx.plural.highlight"
              />
            </div>
          </div>

          <div class="class-example__meaning">
            <span class="bengaform-meaning">{{ classEx.singular.spanishTranslation }}</span>
            <span class="separator">→</span>
            <span class="bengaform-meaning">{{ classEx.plural.spanishTranslation }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Adjective Variations Table -->
    <section class="regular-adjectives__variations">
      <h2>{{ $t('pages.regularAdjectives.adjetivosComunesSusVariaciones') }}</h2>
      <div class="variations-note">
        <p v-html="$t('pages.regularAdjectives.notaConPocasExcepciones')"></p>
      </div>

      <div class="adjectives-list">
        <div
          class="adjective-group"
          v-for="(adjective, idx) in adjectiveGroups"
          :key="`adj-${idx}`"
        >
          <div class="adjective-group__meaning">
            <strong>{{ adjective.meaning }}</strong>
            <span class="adjective-group__root">
              {{ $t('pages.regularAdjectives.raiz') }}
              <span class="bengaform">{{ adjective.bengaRoot }}</span>
            </span>
          </div>
          <CardGrid
            :items="adjective.pairs"
            class="adjective-group__forms"
            key-prefix="pair"
            v-slot="{ item: pair }"
          >
            <div class="form-pair">
              <span class="form-pair__label">{{ pair.label }}</span>
              <div class="form-item">
                <span class="form-number">Sg</span>
                <BengaWord
                  :word="pair.singular.bengaForm"
                  :highlight-prefix="pair.singular.prefix"
                />
              </div>
              <div class="form-item">
                <span class="form-number">Pl</span>
                <BengaWord :word="pair.plural.bengaForm" :highlight-prefix="pair.plural.prefix" />
              </div>
            </div>
          </CardGrid>
        </div>
      </div>
    </section>

    <!-- Concordance Example -->
    <section class="regular-adjectives__concordance">
      <h2>{{ $t('pages.regularAdjectives.ejemploConcordancia') }}</h2>
      <div class="concordance-example">
        <p class="description">
          {{ $t('pages.regularAdjectives.adjetivo') }}
          <span class="bengaform">{{ $t('pages.regularAdjectives.buamu') }}</span>
          {{ $t('pages.regularAdjectives.buenoSeFlexionaAsi') }}
        </p>
        <div class="concordance-table">
          <div class="table-header">
            <div>{{ $t('pages.regularAdjectives.clase2') }}</div>
            <div>{{ $t('pages.regularAdjectives.singular2') }}</div>
            <div>{{ $t('pages.regularAdjectives.plural2') }}</div>
            <div>{{ $t('pages.regularAdjectives.significado') }}</div>
          </div>
          <div class="table-body">
            <div class="table-row" v-for="classEx in classes" :key="`concord-${classEx.classId}`">
              <div class="cell class-id">{{ classEx.classId }}</div>
              <div class="cell">
                <BengaWord
                  :word="classEx.singular.bengaForm"
                  :highlight-prefix="classEx.singular.highlight"
                />
              </div>
              <div class="cell">
                <BengaWord
                  :word="classEx.plural.bengaForm"
                  :highlight-prefix="classEx.plural.highlight"
                />
              </div>
              <div class="cell cell--meaning">
                {{ classEx.singular.spanishTranslation }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Key Points -->
    <section class="regular-adjectives__keypoints">
      <h2>{{ $t('pages.regularAdjectives.puntosClave') }}</h2>
      <div class="keypoints-list">
        <div class="keypoint-item" v-for="(note, idx) in notes" :key="`note-${idx}`">
          <span class="keypoint-icon">→</span>
          <span>{{ note }}</span>
        </div>
      </div>
    </section>

    <SectionNavFooter />
  </div>
</template>

<script>
import CardGrid from '@/components/blocks/CardGrid.vue'
import SectionNavFooter from '@/components/blocks/SectionNavFooter.vue'
import { localizeDeep } from '@/utils/localized'
import regularAdjectivesData from '@/data/chapter-3/regular-adjectives.json'
import BengaWord from '@/components/content/BengaWord.vue'
import { CONCORD_PREFIXES, getAdjective, inflect } from '@/services/adjectives'

export default {
  name: 'RegularAdjectivesSection',
  components: {
    CardGrid,
    SectionNavFooter,
    BengaWord
  },
  data() {
    return {
      classes: [],
      notes: []
    }
  },
  watch: {
    // switching language reloads the texts
    '$i18n.locale': 'loadData'
  },
  mounted() {
    this.loadData()
  },
  computed: {
    /**
     * The "Adjetivos Comunes" cards, built from the lexicon (lexicon/adjectives.json):
     * example noun of each class + the adjective's form for that class (prefix + stem).
     */
    adjectiveGroups() {
      const nouns = regularAdjectivesData.exampleNouns
      return regularAdjectivesData.commonAdjectives.map((id) => {
        const adjective = getAdjective(id)
        return {
          meaning: this.$localized(adjective.meaning),
          bengaRoot: adjective.word,
          pairs: [1, 2, 3, 4, 5, 6, 7].map((classId) => ({
            classId,
            label: this.$t('pages.regularAdjectives.classLabel', { number: classId }),
            singular: {
              bengaForm: `${nouns[classId].singular} ${inflect(adjective, classId, 'singular')}`,
              prefix: CONCORD_PREFIXES[classId].singular
            },
            plural: {
              bengaForm: `${nouns[classId].plural} ${inflect(adjective, classId, 'plural')}`,
              prefix: CONCORD_PREFIXES[classId].plural
            }
          }))
        }
      })
    }
  },
  methods: {
    loadData() {
      // The texts of the data file in the visitor's language (Benga words unchanged)
      const data = localizeDeep(regularAdjectivesData, this.$i18n.locale)
      this.classes = data.classes
      this.notes = data.notes
    }
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.regular-adjectives {
  @include page-container;

  &__header {
    text-align: center;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 2px solid $color-primary;

    h1 {
      font-size: 2.2rem;
      color: $color-primary;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      font-size: 1rem;
      color: $color-text-secondary;
    }
  }

  &__overview {
    background: $color-background-light;
    padding: 1.5rem;
    border-radius: $border-radius-base;
    margin-bottom: 2.5rem;
    border-left: 4px solid $color-primary;

    p {
      color: $color-text-primary;
      line-height: 1.8;
    }
  }

  &__classes {
    margin-bottom: 3rem;

    h2 {
      font-size: 1.6rem;
      color: $color-heading-dark;
      margin-bottom: 1.5rem;
    }

    .section-intro {
      color: $color-text-secondary;
      line-height: 1.7;
      margin-bottom: 1.5rem;
    }
  }
}

.highlight-legend {
  color: $color-secondary;
  font-weight: $font-weight-bold;
  text-decoration: underline;
  text-decoration-color: $color-accent;
  text-decoration-thickness: 2px;
  text-underline-offset: 2px;
}

.bengaform {
  @include benga-word-style;
  font-weight: $font-weight-bold;
}

.classes-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.class-example {
  @include card-base;
  padding: 1.5rem;
  border-top: 3px solid $color-primary;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #e0e0e0;

    h3 {
      color: $color-primary;
      font-size: 1.1rem;
      margin: 0;
    }
  }

  &__rules {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  &__pattern {
    background: #f9f9f9;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
  }

  &__meaning {
    font-size: 0.95rem;
    color: $color-text-secondary;
    text-align: center;

    .bengaform-meaning {
      display: inline-block;
      padding: 0.25rem 0.5rem;
    }

    .separator {
      margin: 0 0.5rem;
    }
  }
}

.rule {
  background: #f0f7ff;
  border-left: 3px solid $color-primary;
  border-radius: 4px;
  padding: 0.6rem 0.75rem;

  &--adjective {
    background: #fffde7;
    border-left-color: $color-accent;
  }

  &__label {
    display: block;
    font-size: 0.72rem;
    font-weight: $font-weight-bold;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: $color-text-muted;
    margin-bottom: 0.25rem;
  }

  &__text {
    margin: 0;
    font-size: 0.88rem;
    line-height: 1.5;
    color: $color-text-primary;
  }

  &__link {
    display: inline-block;
    margin-top: 0.4rem;
    font-size: 0.82rem;
    font-weight: $font-weight-semibold;
    color: $color-primary;
    transition: color $transition-fast;

    &:hover {
      color: $color-primary-dark;
      text-decoration: underline;
    }
  }
}

.class-label {
  font-size: 0.85rem;
  background-color: #f0f0f0;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  color: $color-text-secondary;
}

.pattern-row {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.5rem;

  .label {
    font-weight: 600;
    color: $color-text-secondary;
    min-width: 70px;
  }
}

.pattern-arrow {
  text-align: center;
  color: $color-primary;
  font-weight: bold;
  margin: 0.5rem 0;
}

.regular-adjectives__variations {
  margin-bottom: 3rem;

  h2 {
    font-size: 1.6rem;
    color: $color-heading-dark;
    margin-bottom: 1rem;
  }
}

.variations-note {
  background: #fff3cd;
  padding: 1rem;
  border-radius: $border-radius-base;
  margin-bottom: 1.5rem;
  border-left: 4px solid #ffc107;

  p {
    margin: 0;
    color: #856404;
    line-height: 1.6;
  }
}

.adjectives-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.adjective-group {
  @include card-base;
  padding: 1.5rem;

  &__meaning {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
    font-size: 1.1rem;
    color: $color-primary;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid $color-primary;
  }

  &__root {
    font-size: 0.9rem;
    color: $color-text-secondary;
    font-weight: $font-weight-normal;
  }

  &__forms {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem 1.5rem;

    @include respond-below('md') {
      grid-template-columns: 1fr;
    }
  }
}

.form-pair {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0.75rem 0.9rem;
  background: $color-background-light;
  border-radius: 4px;
  border-left: 3px solid $color-primary;

  &__label {
    font-size: 0.72rem;
    font-weight: $font-weight-bold;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: $color-text-muted;
    margin-bottom: 0.15rem;
  }
}

.form-item {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;

  .form-number {
    font-size: 0.75rem;
    font-weight: $font-weight-semibold;
    color: $color-text-secondary;
    min-width: 22px;
    text-transform: uppercase;
  }
}

.regular-adjectives__concordance {
  background: $color-background-light;
  padding: 2rem;
  border-radius: $border-radius-base;
  margin-bottom: 2.5rem;
  border-left: 4px solid $color-primary;

  h2 {
    font-size: 1.6rem;
    color: $color-heading-dark;
    margin-bottom: 1.5rem;
  }

  .description {
    margin-bottom: 1.5rem;
    color: $color-text-primary;
    line-height: 1.6;
  }
}

.concordance-table {
  background: white;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.table-header {
  display: grid;
  grid-template-columns: 70px 1fr 1fr 1fr;
  gap: 0;
  background-color: $color-primary;
  color: white;
  font-weight: 600;
  padding: 1rem;

  div {
    padding: 0.75rem;
  }
}

.table-body {
  display: flex;
  flex-direction: column;
}

.table-row {
  display: grid;
  grid-template-columns: 70px 1fr 1fr 1fr;
  gap: 0;
  border-bottom: 1px solid #e0e0e0;
  padding: 1rem;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }

  &:nth-child(odd) {
    background-color: #f9f9f9;
  }
}

.cell {
  padding: 0.5rem;

  &.class-id {
    font-weight: 600;
    color: $color-primary;
  }

  &--meaning {
    color: $color-text-secondary;
    font-size: 0.95rem;
  }
}

.regular-adjectives__keypoints {
  background: #f0f7ff;
  padding: 2rem;
  border-radius: $border-radius-base;
  margin-bottom: 2rem;
  border-left: 4px solid $color-primary;

  h2 {
    font-size: 1.4rem;
    color: $color-primary;
    margin-bottom: 1.5rem;
  }
}

.keypoints-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.keypoint-item {
  display: flex;
  gap: 1rem;
  color: $color-text-primary;
  line-height: 1.6;

  .keypoint-icon {
    color: $color-primary;
    font-weight: bold;
    min-width: fit-content;
  }
}

@media (max-width: 768px) {
  .table-header,
  .table-row {
    grid-template-columns: 50px 1fr 1fr;

    div:last-child {
      display: none;
    }
  }
}
</style>
