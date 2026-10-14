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
        Cada adjetivo de este tipo podría tener hasta 7 formas diferentes, dependiendo de la clase nominal del sustantivo al que se refiere.
        Por ello, cuando nos refiramos a alguna traducción usaremos una de estas formas para simplificar la explicación, pero es importante recordar que cada adjetivo de este tipo puede variar según la clase nominal del sustantivo.
        Las reglas de declinación son generales, pero puede haber alguna excepción debido a facilitar la pronunciación.
      </p>
    </section>

    <!-- Class Examples -->
    <section class="regular-adjectives__classes">
      <h2>Flexión por Clases Nominales</h2>
      <p class="section-intro">
        Veamos cómo se declina el adjetivo <strong class="bengaform">būamu</strong> (bueno)
        para concordar con un sustantivo de cada clase. La sílaba
        <span class="highlight-legend">resaltada</span> es la que marca la concordancia
        con el sustantivo.
      </p>
      <div class="classes-container">
        <div class="class-example" v-for="classEx in classes" :key="`class-${classEx.classId}`">
          <div class="class-example__header">
            <h3>{{ classEx.classType }}</h3>
            <span class="class-label">Clase {{ classEx.classId }}</span>
          </div>

          <div class="class-example__rules">
            <div class="rule">
              <span class="rule__label">Regla del nombre</span>
              <p class="rule__text">{{ classEx.nounClassRule }}</p>
              <router-link class="rule__link" :to="`/capitulo-2/clase-${classEx.classId}`">
                Repasar Clase {{ classEx.classId }} →
              </router-link>
            </div>
            <div class="rule rule--adjective">
              <span class="rule__label">Regla del adjetivo</span>
              <p class="rule__text">{{ classEx.adjectiveClassRule }}</p>
            </div>
          </div>

          <div class="class-example__pattern">
            <div class="pattern-row">
              <span class="label">Singular:</span>
              <BengaWord
                :word="classEx.singular.bengaForm"
                :audio-id="classEx.singular.audioId"
                :highlight-prefix="classEx.singular.highlight"
              />
            </div>
            <div class="pattern-arrow">↓</div>
            <div class="pattern-row">
              <span class="label">Plural:</span>
              <BengaWord
                :word="classEx.plural.bengaForm"
                :audio-id="classEx.plural.audioId"
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
      <h2>Adjetivos Comunes y sus Variaciones</h2>
      <div class="variations-note">
        <p>
          <strong>Nota:</strong> Con pocas excepciones, todos los adjetivos varían concordando con el sustantivo 
          de su respectiva clase. El adjetivo 'būamu' (bueno) toma todas estas formas para concordar con nombres de cada clase.
          Pulsa el icono de audio para escuchar cada combinación de nombre y adjetivo.
        </p>
      </div>

      <div class="adjectives-list">
        <div class="adjective-group" v-for="(adjective, idx) in adjectiveGroups" :key="`adj-${idx}`">
          <div class="adjective-group__meaning">
            <strong>{{ adjective.meaning }}</strong>
            <span class="adjective-group__root">
              Raíz: <span class="bengaform">{{ adjective.bengaRoot }}</span>
            </span>
          </div>
          <div class="adjective-group__forms">
            <div class="form-pair" v-for="pair in adjective.pairs" :key="`pair-${pair.classId}`">
              <span class="form-pair__label">{{ pair.label }}</span>
              <div class="form-item">
                <span class="form-number">Sg</span>
                <BengaWord
                  :word="pair.singular.bengaForm"
                  :audio-id="pair.singular.audioId"
                  :highlight-prefix="pair.singular.prefix"
                />
              </div>
              <div class="form-item">
                <span class="form-number">Pl</span>
                <BengaWord
                  :word="pair.plural.bengaForm"
                  :audio-id="pair.plural.audioId"
                  :highlight-prefix="pair.plural.prefix"
                />
              </div>
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
          El adjetivo <span class="bengaform">būamu</span> (bueno) se flexiona así según la clase del sustantivo:
        </p>
        <div class="concordance-table">
          <div class="table-header">
            <div>Clase</div>
            <div>Singular</div>
            <div>Plural</div>
            <div>Significado</div>
          </div>
          <div class="table-body">
            <div class="table-row" v-for="classEx in classes" :key="`concord-${classEx.classId}`">
              <div class="cell class-id">{{ classEx.classId }}</div>
              <div class="cell">
                <BengaWord
                  :word="classEx.singular.bengaForm"
                  :audio-id="classEx.singular.audioId"
                  :highlight-prefix="classEx.singular.highlight"
                />
              </div>
              <div class="cell">
                <BengaWord
                  :word="classEx.plural.bengaForm"
                  :audio-id="classEx.plural.audioId"
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
import BengaWord from '@/components/content/BengaWord.vue';

const CLASS_PREFIXES = {
  1: { sg: 'e', pl: 'be' },
  2: { sg: 'i', pl: 'ma' },
  3: { sg: 'u', pl: 'me' },
  4: { sg: 'bo', pl: 'me' },
  5: { sg: 'u', pl: 'ba' },
  6: { sg: 'vi', pl: 'lo' },
  7: { sg: 'e', pl: 'i' }
};

export default {
  name: 'RegularAdjectivesSection',
  components: {
    BengaWord
  },
  data() {
    return {
      classes: [],
      commonAdjectives: [],
      notes: [],
      classPrefixes: CLASS_PREFIXES
    }
  },
  mounted() {
    this.loadData();
  },
  computed: {
    adjectiveGroups() {
      return this.commonAdjectives.map(adjective => ({
        meaning: adjective.meaning,
        bengaRoot: adjective.bengaRoot,
        pairs: [1, 2, 3, 4, 5, 6, 7].map(classId => {
          const sgKey = `class${classId}_sg`;
          const plKey = `class${classId}_pl`;
          const singular = adjective.inflections[sgKey] || {};
          const plural = adjective.inflections[plKey] || {};
          return {
            classId,
            label: `Clase ${classId}`,
            singular: { ...singular, prefix: this.inflectionPrefix(sgKey) },
            plural: { ...plural, prefix: this.inflectionPrefix(plKey) }
          };
        })
      }));
    }
  },
  methods: {
    loadData() {
      this.classes = regularAdjectivesData.classes;
      this.commonAdjectives = regularAdjectivesData.commonAdjectivesByMeaning;
      this.notes = regularAdjectivesData.notes;
    },
    inflectionPrefix(key) {
      const match = /^class(\d+)_(sg|pl)$/.exec(key);
      if (!match) return null;
      const rule = this.classPrefixes[Number(match[1])];
      return rule ? rule[match[2]] : null;
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
