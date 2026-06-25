<template>
  <div class="invariable-adjectives">
    <div class="invariable-adjectives__header">
      <h1>Adjetivos Invariables</h1>
      <p class="subtitle">Formas fijas que no cambian</p>
    </div>

    <!-- Overview -->
    <section class="invariable-adjectives__overview">
      <p>
        Los adjetivos invariables no varían y se usan del mismo modo en unión con los nombres que califican, 
        sin experimentar cambio alguno en su única y simple forma. Estos adjetivos no tienen número, género ni clasificación.
      </p>
    </section>

    <!-- Characteristics -->
    <section class="invariable-adjectives__characteristics">
      <h2>Características</h2>
      <div class="characteristics-grid">
        <div class="char-card" v-for="(char, idx) in characteristics" :key="`char-${idx}`">
          <span class="char-icon">✓</span>
          <p>{{ char }}</p>
        </div>
      </div>
    </section>

    <!-- Adjectives List -->
    <section class="invariable-adjectives__list">
      <h2>Adjetivos Invariables</h2>
      <div class="adjectives-grid">
        <div class="adjective-card" v-for="(adj, idx) in adjectives" :key="`adj-${idx}`">
          <div class="adjective-card__bengaform">
            {{ adj.bengaForm }}
          </div>
          <div class="adjective-card__meaning">
            {{ adj.spanishMeaning }}
          </div>
        </div>
      </div>
    </section>

    <!-- Usage Examples -->
    <section class="invariable-adjectives__examples">
      <h2>Ejemplos de Uso</h2>
      <div class="examples-container">
        <div class="example-item" v-for="(example, idx) in examples" :key="`ex-${idx}`">
          <div class="example-item__bengaform">
            <span class="bengaform">{{ example.bengaSentence }}</span>
          </div>
          <div class="example-item__translation">
            <strong>Traducción:</strong> {{ example.spanishTranslation }}
          </div>
          <div class="example-item__explanation">
            <strong>Explicación:</strong> {{ example.explanation }}
          </div>
        </div>
      </div>
    </section>

    <!-- Important Notes -->
    <section class="invariable-adjectives__notes">
      <h2>Puntos Importantes</h2>
      <div class="notes-container">
        <div class="note-item" v-for="(note, idx) in characteristics" :key="`note-${idx}`">
          <span class="note-number">{{ idx + 1 }}</span>
          <span class="note-text">{{ note }}</span>
        </div>
      </div>
    </section>

    <!-- Comparison Table -->
    <section class="invariable-adjectives__comparison">
      <h2>Variables vs Invariables</h2>
      <div class="comparison-table">
        <div class="table-row header">
          <div class="cell">Aspecto</div>
          <div class="cell">Adjetivos Variables</div>
          <div class="cell">Adjetivos Invariables</div>
        </div>
        <div class="table-row">
          <div class="cell"><strong>Cambio de forma</strong></div>
          <div class="cell">Sí, según la clase del sustantivo</div>
          <div class="cell">No, forma fija</div>
        </div>
        <div class="table-row">
          <div class="cell"><strong>Número</strong></div>
          <div class="cell">Singular y Plural</div>
          <div class="cell">Sin distinción</div>
        </div>
        <div class="table-row">
          <div class="cell"><strong>Género</strong></div>
          <div class="cell">Sin distinción (como todos en Benga)</div>
          <div class="cell">Sin distinción</div>
        </div>
        <div class="table-row">
          <div class="cell"><strong>Concordancia</strong></div>
          <div class="cell">Obligatoria con el sustantivo</div>
          <div class="cell">No aplica</div>
        </div>
        <div class="table-row">
          <div class="cell"><strong>Ejemplo</strong></div>
          <div class="cell">eyamu (bueno), beyamu, iyamu...</div>
          <div class="cell">bokolo (duro), tanana (blanco)</div>
        </div>
      </div>
    </section>

    <!-- Navigation -->
    <div class="invariable-adjectives__navigation">
      <router-link to="/capitulo-3/adjetivos-regulares" class="nav-button nav-button--back">
        ← Adjetivos Regulares
      </router-link>
      <router-link to="/capitulo-3" class="nav-button nav-button--index">
        Índice del Capítulo
      </router-link>
      <router-link to="/capitulo-3/comparativos-superlativos" class="nav-button nav-button--next">
        Siguiente: Comparativos →
      </router-link>
    </div>
  </div>
</template>

<script>
import invariableAdjectivesData from '@/data/chapter-3/invariable-adjectives.json';

export default {
  name: 'IrregularAdjectivesSection',
  data() {
    return {
      adjectives: [],
      examples: [],
      characteristics: []
    }
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.adjectives = invariableAdjectivesData.adjectives;
      this.examples = invariableAdjectivesData.examples;
      this.characteristics = invariableAdjectivesData.characteristics;
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables';
@import '@/styles/mixins';

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
    color: $color-primary;
    font-weight: 600;
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

    .bengaform {
      color: $color-primary;
      font-weight: 600;
      font-size: 1.05rem;
    }
  }

  &__translation {
    margin-bottom: 0.75rem;
    color: $color-text-primary;
    line-height: 1.6;

    strong {
      color: $color-heading-dark;
    }
  }

  &__explanation {
    color: $color-text-secondary;
    font-style: italic;

    strong {
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

  &:nth-child(odd) {
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

.invariable-adjectives__navigation {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.nav-button {
  @include button-base;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: $border-radius-base;
  transition: all $transition-base;
  text-align: center;

  &--back, &--index {
    background-color: #f0f0f0;
    color: $color-text-primary;

    &:hover {
      background-color: #e0e0e0;
    }
  }

  &--next {
    background-color: $color-primary;
    color: white;

    &:hover {
      background-color: $color-primary-dark;
    }
  }
}
</style>
