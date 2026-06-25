<template>
  <div class="comparatives-superlatives">
    <div class="comparatives-superlatives__header">
      <h1>Comparativos y Superlativos</h1>
      <p class="subtitle">Expresión de comparación y grado en Benga</p>
    </div>

    <!-- Overview -->
    <section class="comparatives-superlatives__overview">
      <p>
        Los adjetivos en Benga carecen de los grados de comparación tradicionales. Sin embargo, 
        los objetos se comparan usando una variedad de formas: circunlocución, entonación particular, 
        énfasis consabido, y especialmente las palabras <span class="bengaform">kebaka</span> (sobresalir) 
        y <span class="bengaform">ña</span> (exceder).
      </p>
    </section>

    <!-- Key Words Section -->
    <section class="comparatives-superlatives__keywords">
      <h2>Palabras Clave</h2>
      <div class="keywords-grid">
        <div class="keyword-card" v-for="(kw, idx) in keyWords" :key="`kw-${idx}`">
          <div class="keyword-bengaform">{{ kw.bengaForm }}</div>
          <div class="keyword-meaning">{{ kw.spanishMeaning }}</div>
        </div>
      </div>
    </section>

    <!-- Comparatives -->
    <section class="comparatives-superlatives__comparatives">
      <h2>Comparativos</h2>
      <p class="usage-note">
        Se utilizan para comparar dos o más objetos, principalmente con las palabras 
        <span class="bengaform">kebaka</span> (sobresalir) y <span class="bengaform">ña</span> (exceder).
      </p>
      <div class="examples-container">
        <div class="example-card" v-for="(comp, idx) in comparatives" :key="`comp-${idx}`">
          <div class="example-card__spanish">
            <strong>{{ comp.spanishMeaning }}</strong>
          </div>
          <div class="example-card__construction">
            <div class="construction-row">
              <span class="label">Palabras:</span>
              <span class="bengaform">{{ comp.phrases.palabras }}</span>
            </div>
            <div class="construction-row">
              <span class="label">Pronunciación:</span>
              <span class="bengaform">{{ comp.phrases.pronunciacion }}</span>
            </div>
            <div class="construction-row">
              <span class="label">Literal:</span>
              <span class="translation">{{ comp.phrases.traduccionLiteral }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Superlatives -->
    <section class="comparatives-superlatives__superlatives">
      <h2>Superlativos</h2>
      <p class="usage-note">
        Se utilizan para expresar el grado máximo de una cualidad entre varios objetos.
      </p>
      <div class="examples-container">
        <div class="example-card" v-for="(sup, idx) in superlatives" :key="`sup-${idx}`">
          <div class="example-card__spanish">
            <strong>{{ sup.spanishMeaning }}</strong>
          </div>
          <div class="example-card__construction">
            <div class="construction-row">
              <span class="label">Palabras:</span>
              <span class="bengaform">{{ sup.phrases.palabras }}</span>
            </div>
            <div class="construction-row">
              <span class="label">Pronunciación:</span>
              <span class="bengaform">{{ sup.phrases.pronunciacion }}</span>
            </div>
            <div class="construction-row">
              <span class="label">Literal:</span>
              <span class="translation">{{ sup.phrases.traduccionLiteral }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Alternative Form with 'va' -->
    <section class="comparatives-superlatives__alternative">
      <h2>Forma Alternativa (usando 'va')</h2>
      <div class="alternative-content">
        <p class="alt-description">
          Hay una forma más sencilla y acomodada al castellano: usar <span class="bengaform">va</span> 
          en sentido de "más". Esta forma se acomoda principalmente con quienes han aprendido 
          inglés, francés, etc.
        </p>
        <div class="alt-examples">
          <div class="alt-example" v-for="(ex, idx) in alternativeForm.examples" :key="`alt-${idx}`">
            <span class="spanish-meaning">{{ ex.spanishMeaning }}</span>
            <span class="bengaform-alt">{{ ex.bengaForm }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Additional Expressions -->
    <section class="comparatives-superlatives__expressions">
      <h2>Expresiones Adicionales</h2>
      <div class="expressions-list">
        <div class="expression-item" v-for="(expr, idx) in expressions" :key="`expr-${idx}`">
          <div class="expression-spanish">{{ expr.spanishMeaning }}</div>
          <div class="expression-benga">{{ expr.bengaForm }}</div>
        </div>
      </div>
    </section>

    <!-- Important Notes -->
    <section class="comparatives-superlatives__notes">
      <h2>Notas Importantes</h2>
      <div class="notes-container">
        <div class="note-item" v-for="(note, idx) in notes" :key="`note-${idx}`">
          <span class="note-icon">✓</span>
          <span class="note-text">{{ note }}</span>
        </div>
      </div>
    </section>

    <!-- Linguistic Context -->
    <section class="comparatives-superlatives__context">
      <h2>Contexto Lingüístico</h2>
      <div class="context-content">
        <h3>¿Por qué no hay grados de comparación tradicionales?</h3>
        <p>
          En la lengua Benga, los comparativos y superlativos funcionan a través de estrategias 
          más contextuales que formales. El uso de entonación, énfasis y circunlocuciones es 
          fundamental para la comunicación efectiva. Los Bengas se valen de la entonación 
          peculiar y del énfasis consabido para indicar los extremos en calidad y cantidad.
        </p>
        <p>
          Esto demuestra una característica importante de la lengua: la importancia de la 
          "viva voz" en la comunicación del significado, donde elementos prosódicos son 
          cruciales para la comprensión total.
        </p>
      </div>
    </section>

    <!-- Navigation -->
    <div class="comparatives-superlatives__navigation">
      <router-link to="/capitulo-3/adjetivos-invariables" class="nav-button nav-button--back">
        ← Adjetivos Invariables
      </router-link>
      <router-link to="/capitulo-3" class="nav-button nav-button--index">
        Índice del Capítulo
      </router-link>
      <router-link to="/capitulo-3/numerales-ordinales" class="nav-button nav-button--next">
        Siguiente: Numerales →
      </router-link>
    </div>
  </div>
</template>

<script>
import comparativesData from '@/data/chapter-3/comparatives-superlatives.json';

export default {
  name: 'ComparativesSuperlativesSection',
  data() {
    return {
      keyWords: [],
      comparatives: [],
      superlatives: [],
      alternativeForm: {},
      expressions: [],
      notes: []
    }
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.keyWords = comparativesData.keyWords;
      this.comparatives = comparativesData.comparatives;
      this.superlatives = comparativesData.superlatives;
      this.alternativeForm = comparativesData.alternativeForm;
      this.expressions = comparativesData.expressions;
      this.notes = comparativesData.notes;
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables';
@import '@/styles/mixins';

.comparatives-superlatives {
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

      .bengaform {
        color: $color-primary;
        font-weight: 600;
      }
    }
  }

  &__keywords,
  &__comparatives,
  &__superlatives,
  &__alternative,
  &__expressions {
    margin-bottom: 3rem;

    h2 {
      font-size: 1.6rem;
      color: $color-heading-dark;
      margin-bottom: 1.5rem;
    }
  }

  &__notes,
  &__context {
    background: #f0f7ff;
    padding: 2rem;
    border-radius: $border-radius-base;
    border-left: 4px solid $color-primary;
    margin-bottom: 2.5rem;

    h2 {
      font-size: 1.6rem;
      color: $color-primary;
      margin-bottom: 1.5rem;
    }
  }
}

.keywords-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.keyword-card {
  @include card-base;
  padding: 1.5rem;
  text-align: center;
  border-top: 3px solid $color-primary;

  .keyword-bengaform {
    color: $color-primary;
    font-weight: 600;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }

  .keyword-meaning {
    color: $color-text-primary;
    line-height: 1.6;
  }
}

.usage-note {
  background: #fff8e1;
  padding: 1rem;
  border-left: 3px solid #ffc107;
  margin-bottom: 1.5rem;
  color: #856404;
  line-height: 1.6;

  .bengaform {
    color: $color-primary;
    font-weight: 600;
  }
}

.examples-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.example-card {
  @include card-base;
  padding: 1.5rem;
  border-left: 4px solid $color-primary;

  &__spanish {
    font-size: 1.1rem;
    color: $color-text-primary;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid $color-primary;

    strong {
      color: $color-heading-dark;
    }
  }

  &__construction {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
}

.construction-row {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 1rem;
  align-items: flex-start;

  .label {
    font-weight: 600;
    color: $color-text-secondary;
  }

  .bengaform {
    color: $color-primary;
    font-weight: 600;
    background-color: #f9f9f9;
    padding: 0.5rem;
    border-radius: 4px;
  }

  .translation {
    color: $color-text-primary;
    font-style: italic;
  }
}

.alternative-content {
  background: white;
  padding: 2rem;
  border-radius: $border-radius-base;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  .alt-description {
    color: $color-text-primary;
    line-height: 1.8;
    margin-bottom: 1.5rem;

    .bengaform {
      color: $color-primary;
      font-weight: 600;
    }
  }
}

.alt-examples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.alt-example {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 4px;
  border-left: 3px solid $color-primary;

  .spanish-meaning {
    color: $color-heading-dark;
    font-weight: 600;
  }

  .bengaform-alt {
    color: $color-primary;
    font-weight: 600;
  }
}

.expressions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.expression-item {
  display: grid;
  grid-template-columns: 1fr 250px;
  gap: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 4px;
  border-bottom: 1px solid #e0e0e0;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }

  .expression-spanish {
    color: $color-text-primary;
    line-height: 1.6;
  }

  .expression-benga {
    color: $color-primary;
    font-weight: 600;
    background-color: #f9f9f9;
    padding: 0.75rem;
    border-radius: 4px;
    text-align: right;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;

    .expression-benga {
      text-align: left;
    }
  }
}

.notes-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.note-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  background: rgba(255, 255, 255, 0.5);
  padding: 1rem;
  border-radius: 4px;

  .note-icon {
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

  .note-text {
    color: $color-text-primary;
    line-height: 1.6;
    padding-top: 0.1rem;
  }
}

.context-content {
  background: rgba(255, 255, 255, 0.5);
  padding: 1.5rem;
  border-radius: 4px;

  h3 {
    color: $color-primary;
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }

  p {
    color: $color-text-primary;
    line-height: 1.8;
    margin-bottom: 1rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.comparatives-superlatives__navigation {
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
