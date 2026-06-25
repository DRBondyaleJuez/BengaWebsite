<template>
  <div class="regular-adjectives">
    <div class="regular-adjectives__header">
      <h1>Adjetivos Variables (Regulares)</h1>
      <p class="subtitle">Flexión según clase nominal</p>
    </div>

    <!-- Overview -->
    <section class="regular-adjectives__overview">
      <p>
        Los adjetivos variables toman su forma correspondiente a singular y plural, 
        concordando en clasificación con los nombres que califican. Cada adjetivo varía 
        según la clase del sustantivo que modifica.
      </p>
    </section>

    <!-- Class Examples -->
    <section class="regular-adjectives__classes">
      <h2>Flexión por Clases Nominales</h2>
      <div class="classes-container">
        <div class="class-example" v-for="classEx in classes" :key="`class-${classEx.classId}`">
          <div class="class-example__header">
            <h3>{{ classEx.classType }}</h3>
            <span class="class-label">Clase {{ classEx.classId }}</span>
          </div>

          <div class="class-example__pattern">
            <div class="pattern-row">
              <span class="label">Singular:</span>
              <span class="bengaform">{{ classEx.singular.bengaForm }}</span>
            </div>
            <div class="pattern-arrow">↓</div>
            <div class="pattern-row">
              <span class="label">Plural:</span>
              <span class="bengaform">{{ classEx.plural.bengaForm }}</span>
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
      <h2>Adjetivos Comunes y sus Variaciones</h2>
      <div class="variations-note">
        <p>
          <strong>Nota:</strong> Con pocas excepciones, todos los adjetivos varían concordando con el sustantivo 
          de su respectiva clase. El adjetivo 'bamu' (bueno) toma todas estas formas para concordar con nombres de cada clase.
        </p>
      </div>

      <div class="adjectives-list">
        <div class="adjective-group" v-for="(adjective, idx) in commonAdjectives" :key="`adj-${idx}`">
          <div class="adjective-group__meaning">
            <strong>{{ adjective.meaning }}</strong>
          </div>
          <div class="adjective-group__forms">
            <div class="form-item" v-for="(form, key) in adjective.inflections" :key="`form-${key}`">
              <span class="form-label">{{ formatClassLabel(key) }}:</span>
              <span class="bengaform">{{ form }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Concordance Example -->
    <section class="regular-adjectives__concordance">
      <h2>Ejemplo de Concordancia</h2>
      <div class="concordance-example">
        <p class="description">
          El adjetivo <span class="bengaform">bamu</span> (bueno) se flexiona así según la clase del sustantivo:
        </p>
        <div class="concordance-table">
          <div class="table-header">
            <div>Clase</div>
            <div>Nombre</div>
            <div>Adjetivo</div>
            <div>Significado</div>
          </div>
          <div class="table-body">
            <div class="table-row" v-for="classEx in classes" :key="`concord-${classEx.classId}`">
              <div class="cell class-id">{{ classEx.classId }}</div>
              <div class="cell">
                <span class="bengaform">{{ classEx.nounExample }}</span>
              </div>
              <div class="cell">
                <span class="bengaform">{{ classEx.adjectiveExample }}</span>
              </div>
              <div class="cell">
                {{ classEx.singular.spanishTranslation }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Key Points -->
    <section class="regular-adjectives__keypoints">
      <h2>Puntos Clave</h2>
      <div class="keypoints-list">
        <div class="keypoint-item" v-for="(note, idx) in notes" :key="`note-${idx}`">
          <span class="keypoint-icon">→</span>
          <span>{{ note }}</span>
        </div>
      </div>
    </section>

    <!-- Navigation -->
    <div class="regular-adjectives__navigation">
      <router-link to="/capitulo-3/introduccion" class="nav-button nav-button--back">
        ← Introducción
      </router-link>
      <router-link to="/capitulo-3" class="nav-button nav-button--index">
        Índice del Capítulo
      </router-link>
      <router-link to="/capitulo-3/adjetivos-invariables" class="nav-button nav-button--next">
        Siguiente: Invariables →
      </router-link>
    </div>
  </div>
</template>

<script>
import regularAdjectivesData from '@/data/chapter-3/regular-adjectives.json';

export default {
  name: 'RegularAdjectivesSection',
  data() {
    return {
      classes: [],
      commonAdjectives: [],
      notes: []
    }
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.classes = regularAdjectivesData.classes;
      this.commonAdjectives = regularAdjectivesData.commonAdjectivesByMeaning;
      this.notes = regularAdjectivesData.notes;
    },
    formatClassLabel(key) {
      const labels = {
        'class1_sg': 'Clase 1 (Sg)',
        'class1_pl': 'Clase 1 (Pl)',
        'class2_sg': 'Clase 2 (Sg)',
        'class2_pl': 'Clase 2 (Pl)',
        'class3_sg': 'Clase 3 (Sg)',
        'class3_pl': 'Clase 3 (Pl)',
        'class4_sg': 'Clase 4 (Sg)',
        'class4_pl': 'Clase 4 (Pl)',
        'class5_sg': 'Clase 5 (Sg)',
        'class5_pl': 'Clase 5 (Pl)',
        'class6_sg': 'Clase 6 (Sg)',
        'class6_pl': 'Clase 6 (Pl)',
        'class7_sg': 'Clase 7 (Sg)',
        'class7_pl': 'Clase 7 (Pl)',
        'note': 'Nota'
      };
      return labels[key] || key;
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables';
@import '@/styles/mixins';

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
  }
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
  margin-bottom: 0.5rem;

  .label {
    font-weight: 600;
    color: $color-text-secondary;
    min-width: 70px;
  }

  .bengaform {
    color: $color-primary;
    font-weight: 600;
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
    font-size: 1.1rem;
    color: $color-primary;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid $color-primary;
  }

  &__forms {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
}

.form-item {
  display: flex;
  gap: 0.5rem;

  .form-label {
    color: $color-text-secondary;
    font-weight: 600;
    min-width: 100px;
  }

  .bengaform {
    color: $color-primary;
    font-weight: 600;
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
  grid-template-columns: 80px 150px 150px 1fr;
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
  grid-template-columns: 80px 150px 150px 1fr;
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

  .bengaform {
    color: $color-primary;
    font-weight: 600;
  }

  &.class-id {
    font-weight: 600;
    color: $color-primary;
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

.regular-adjectives__navigation {
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
