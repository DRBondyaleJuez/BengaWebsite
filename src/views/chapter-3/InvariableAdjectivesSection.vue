<template>
  <div class="invariable-adjectives">
    <div class="invariable-adjectives__header">
      <h1>{{ $t('pages.invariableAdjectives.adjetivosInvariables') }}</h1>
      <p class="subtitle">{{ $t('pages.invariableAdjectives.formasFijasNoCambian') }}</p>
    </div>

    <!-- Overview -->
    <section class="invariable-adjectives__overview">
      <p>
        {{ $t('pages.invariableAdjectives.adjetivosInvariablesNoVarian') }}
      </p>
    </section>

    <!-- Characteristics -->
    <section class="invariable-adjectives__characteristics">
      <h2>{{ $t('pages.invariableAdjectives.caracteristicas') }}</h2>
      <div class="characteristics-grid">
        <div class="char-card" v-for="(char, idx) in characteristics" :key="`char-${idx}`">
          <span class="char-icon">✓</span>
          <p>{{ char }}</p>
        </div>
      </div>
    </section>

    <!-- Adjectives List -->
    <section class="invariable-adjectives__list">
      <h2>{{ $t('pages.invariableAdjectives.adjetivosInvariables') }}</h2>
      <CardGrid :items="adjectives" class="adjectives-grid" key-prefix="adj" v-slot="{ item: adj }">
        <div class="adjective-card">
          <div class="adjective-card__bengaform">
            <BengaWord :word="adj.word" />
          </div>
          <div class="adjective-card__meaning">
            {{ $localized(adj.meaning) }}
          </div>
        </div>
      </CardGrid>
    </section>

    <!-- Usage Examples -->
    <section class="invariable-adjectives__examples">
      <h2>{{ $t('pages.invariableAdjectives.ejemplosUso') }}</h2>
      <p class="section-intro">
        {{ $t('pages.invariableAdjectives.escuchaCadaEjemploPulsando') }}
      </p>
      <div class="examples-container">
        <div class="example-item" v-for="(example, idx) in examples" :key="`ex-${idx}`">
          <div class="example-item__bengaform">
            <BengaWord :word="example.bengaSentence" />
          </div>
          <div
            class="example-item__translation"
            v-html="
              $t('pages.invariableAdjectives.traduccion', {
                spanishTranslation: example.spanishTranslation
              })
            "
          ></div>
          <div
            class="example-item__explanation"
            v-html="
              $t('pages.invariableAdjectives.explicacion', { explanation: example.explanation })
            "
          ></div>
        </div>
      </div>
    </section>

    <!-- Important Notes -->
    <section class="invariable-adjectives__notes">
      <h2>{{ $t('pages.invariableAdjectives.puntosImportantes') }}</h2>
      <div class="notes-container">
        <div class="note-item" v-for="(note, idx) in characteristics" :key="`note-${idx}`">
          <span class="note-number">{{ idx + 1 }}</span>
          <span class="note-text">{{ note }}</span>
        </div>
      </div>
    </section>

    <!-- Comparison Table -->
    <section class="invariable-adjectives__comparison">
      <h2>{{ $t('pages.invariableAdjectives.variablesVsInvariables') }}</h2>
      <div class="comparison-table">
        <div class="table-row header">
          <div class="cell">{{ $t('pages.invariableAdjectives.aspecto') }}</div>
          <div class="cell">{{ $t('pages.invariableAdjectives.adjetivosVariables') }}</div>
          <div class="cell">{{ $t('pages.invariableAdjectives.adjetivosInvariables') }}</div>
        </div>
        <div class="table-row">
          <div class="cell" v-html="$t('pages.invariableAdjectives.cambioForma')"></div>
          <div class="cell">{{ $t('pages.invariableAdjectives.siSegunClaseSustantivo') }}</div>
          <div class="cell">{{ $t('pages.invariableAdjectives.noFormaFija') }}</div>
        </div>
        <div class="table-row">
          <div class="cell" v-html="$t('pages.invariableAdjectives.numero')"></div>
          <div class="cell">{{ $t('pages.invariableAdjectives.singularPlural') }}</div>
          <div class="cell">{{ $t('pages.invariableAdjectives.sinDistincion') }}</div>
        </div>
        <div class="table-row">
          <div class="cell" v-html="$t('pages.invariableAdjectives.genero')"></div>
          <div class="cell">{{ $t('pages.invariableAdjectives.sinDistincionComoTodos') }}</div>
          <div class="cell">{{ $t('pages.invariableAdjectives.sinDistincion') }}</div>
        </div>
        <div class="table-row">
          <div class="cell" v-html="$t('pages.invariableAdjectives.concordancia')"></div>
          <div class="cell">{{ $t('pages.invariableAdjectives.obligatoriaConSustantivo') }}</div>
          <div class="cell">{{ $t('pages.invariableAdjectives.noAplica') }}</div>
        </div>
        <div class="table-row">
          <div class="cell" v-html="$t('pages.invariableAdjectives.ejemplo')"></div>
          <div class="cell">{{ $t('pages.invariableAdjectives.eyamuBuenoBeyamuIyamu') }}</div>
          <div class="cell">{{ $t('pages.invariableAdjectives.bokoloDuroTananaBlanco') }}</div>
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
import invariableAdjectivesData from '@/data/chapter-3/invariable-adjectives.json'
import BengaWord from '@/components/content/BengaWord.vue'
import { getAdjectives } from '@/services/adjectives'

export default {
  name: 'InvariableAdjectivesSection',
  components: {
    CardGrid,
    SectionNavFooter,
    BengaWord
  },
  data() {
    return {
      adjectives: [],
      examples: [],
      characteristics: []
    }
  },
  watch: {
    // switching language reloads the texts
    '$i18n.locale': 'loadData'
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      // The texts of the data file in the visitor's language (Benga words unchanged)
      const data = localizeDeep(invariableAdjectivesData, this.$i18n.locale)
      // The list comes from the lexicon (lexicon/adjectives.json, kind "invariable")
      this.adjectives = getAdjectives({ kind: 'invariable' })
      this.examples = data.examples
      this.characteristics = data.characteristics
    }
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.invariable-adjectives {
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
      margin: 0;
    }
  }

  &__characteristics {
    margin-bottom: 3rem;

    h2 {
      font-size: 1.6rem;
      color: $color-heading-dark;
      margin-bottom: 1.5rem;
    }
  }

  &__list {
    margin-bottom: 3rem;

    h2 {
      font-size: 1.6rem;
      color: $color-heading-dark;
      margin-bottom: 1.5rem;
    }
  }

  &__examples {
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

  &__notes {
    background: #f0f7ff;
    padding: 2rem;
    border-radius: $border-radius-base;
    margin-bottom: 2.5rem;
    border-left: 4px solid $color-primary;

    h2 {
      font-size: 1.4rem;
      color: $color-primary;
      margin-bottom: 1.5rem;
    }
  }

  &__comparison {
    margin-bottom: 2.5rem;

    h2 {
      font-size: 1.6rem;
      color: $color-heading-dark;
      margin-bottom: 1.5rem;
    }
  }
}

.characteristics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;

  .char-card:last-child {
    @include respond-to('md') {
      grid-column: span 2;
    }
  }
}

.char-card {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  background: white;
  padding: 1.5rem;
  border-radius: $border-radius-base;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  .char-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    min-width: 1.5rem;
    border-radius: 50%;
    background-color: $color-primary;
    color: white;
    font-weight: bold;
    font-size: 0.9rem;
  }

  p {
    color: $color-text-primary;
    line-height: 1.6;
    margin: 0;
  }
}

.adjectives-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.adjective-card {
  @include card-base;
  padding: 1.5rem;
  text-align: center;
  transition: all $transition-base;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba($color-primary, 0.1);
  }

  &__bengaform {
    font-size: 1.1rem;
    margin-bottom: 0.75rem;
  }

  &__meaning {
    color: $color-text-primary;
    font-size: 0.95rem;
    line-height: 1.5;
  }
}

.examples-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.example-item {
  @include card-base;
  padding: 1.5rem;
  border-left: 4px solid $color-primary;

  &__bengaform {
    background: #f9f9f9;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    font-size: 1.05rem;
  }

  &__translation {
    margin-bottom: 0.75rem;
    color: $color-text-primary;
    line-height: 1.6;

    :deep(strong) {
      color: $color-heading-dark;
    }
  }

  &__explanation {
    color: $color-text-secondary;
    font-style: italic;

    :deep(strong) {
      color: $color-text-primary;
      font-style: normal;
    }
  }
}

.notes-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.note-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  color: $color-text-primary;

  .note-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.8rem;
    height: 1.8rem;
    min-width: 1.8rem;
    border-radius: 50%;
    background-color: $color-primary;
    color: white;
    font-weight: bold;
    font-size: 0.9rem;
  }

  .note-text {
    line-height: 1.6;
    padding-top: 0.2rem;
  }
}

.comparison-table {
  background: white;
  border-radius: $border-radius-base;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0;
  border-bottom: 1px solid #e0e0e0;

  &.header {
    background-color: $color-primary;
    color: white;
    font-weight: 600;

    .cell {
      padding: 1rem;
    }
  }

  &:nth-child(odd):not(.header) {
    background-color: #f9f9f9;
  }

  .cell {
    padding: 1rem;
    display: flex;
    align-items: center;

    @media (max-width: 768px) {
      padding: 0.75rem;
      font-size: 0.9rem;
    }
  }
}
</style>
