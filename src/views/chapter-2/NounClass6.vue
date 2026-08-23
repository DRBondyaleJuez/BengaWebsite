<template>
  <div class="noun-class noun-class--6">
    <div class="noun-class__header">
      <h1>Sexta Clase Nominal</h1>
      <p class="subtitle">v → l</p>
    </div>

    <section class="noun-class__pattern">
      <h2>Patrón de Transformación</h2>
      <div class="pattern-box">
        <div class="pattern-item">
          <span class="pattern-label">Singular:</span>
          <span class="pattern-value singular">v-</span>
        </div>
        <div class="pattern-arrow">→</div>
        <div class="pattern-item">
          <span class="pattern-label">Plural:</span>
          <span class="pattern-value plural">l-</span>
        </div>
      </div>
      <p class="pattern-description">La sexta clase muestra un cambio consonántico por el cual la fricativa inicial cambia al plural por l-.</p>
    </section>

    <section class="noun-class__examples">
      <h2>Ejemplos Principales</h2>
      <div class="examples-grid">
        <div class="example-card" v-for="(example, idx) in examples" :key="`ex-${idx}`">
          <div class="example-singular">
            <BengaWord
              :word="example.singular.word"
              :audio-id="example.singular.audio"
              :meaning="example.singular.meaning"
              :dictionary-url="getDictionaryUrl(example.singular.word)"
              block
            />
          </div>
          <div class="example-plural">
            <BengaWord
              :word="example.plural.word"
              :audio-id="example.plural.audio"
              :meaning="example.plural.meaning"
              :dictionary-url="getDictionaryUrl(example.plural.word)"
              block
            />
          </div>
        </div>
      </div>
    </section>

    <section class="noun-class__concepts">
      <h2>Conceptos Clave</h2>
      <div class="concepts-list">
        <div class="concept-item">
          <h4>Cambio consonántico</h4>
          <p>La clase 6 es especialmente interesante porque el cambio ocurre en la consonante inicial.</p>
        </div>
        <div class="concept-item">
          <h4>v → l</h4>
          <p>El patrón v- en singular se transforma por l- en plural con cierta regularidad.</p>
        </div>
        <div class="concept-item">
          <h4>Observación</h4>
          <p>Algunos ejemplos muestran alternancias adicionales dentro de la raíz, pero la lógica principal es clara.</p>
        </div>
      </div>
    </section>

    <section class="noun-class__practice">
      <h2>Para Practicar</h2>
      <ol class="practice-list">
        <li>Identifica la consonante inicial de cada sustantivo y luego busca el plural.</li>
        <li>Prueba sustituir v- por l- antes de mirar la respuesta.</li>
        <li>Repite los ejemplos orales para acostumbrarte a la forma plural.</li>
      </ol>
    </section>

    <section class="noun-class__nav">
      <router-link to="/capitulo-2/clase-5" class="nav-link prev">← Clase 5</router-link>
      <router-link to="/capitulo-2/clase-7" class="nav-link next">Séptima Clase →</router-link>
    </section>
  </div>
</template>

<script>
import BengaWord from '@/components/content/BengaWord.vue'

const LIVING_DICTIONARY_BASE = 'https://livingdictionaries.app/benga/entry'

export default {
  name: 'NounClass6',
  components: {
    BengaWord
  },
  data() {
    return {
      examples: [
        {
          singular: { word: 'Veya', audio: 'veya', meaning: 'Fuego' },
          plural: { word: 'Leya', audio: 'leya', meaning: 'Fuegos' }
        },
        {
          singular: { word: 'Vio', audio: 'vio', meaning: 'Nariz' },
          plural: { word: 'Lijo', audio: 'lijo', meaning: 'Narices' }
        },
        {
          singular: { word: 'Vid', audio: 'vid', meaning: 'Sueño' },
          plural: { word: 'Lid', audio: 'lid', meaning: 'Sueños' }
        },
        {
          singular: { word: 'Viho', audio: 'viho', meaning: 'Río' },
          plural: { word: 'Liho', audio: 'liho', meaning: 'Ríos' }
        },
        {
          singular: { word: 'Vitña', audio: 'vitna', meaning: 'Vela' },
          plural: { word: 'Litña', audio: 'litna', meaning: 'Velas' }
        },
        {
          singular: { word: 'Viyonda', audio: 'viyonda', meaning: 'Estación seca' },
          plural: { word: 'Loyonda', audio: 'loyonda', meaning: 'Estaciones secas' }
        },
        {
          singular: { word: 'Viyembo', audio: 'viyembo', meaning: 'Himno' },
          plural: { word: 'Lembo', audio: 'lembo', meaning: 'Himnos' }
        }
      ]
    }
  },
  methods: {
    getDictionaryUrl(word) {
      return `${LIVING_DICTIONARY_BASE}/${word.toLowerCase()}`
    }
  },
  created() {
    document.title = 'Sexta Clase Nominal | Portal Benga'
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables';
@import '@/styles/mixins';

.noun-class {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: $spacing-lg;

  &__header {
    background: linear-gradient(135deg, #2D5A27 0%, #4A7C4E 100%);
    color: white;
    padding: 2.5rem $spacing-lg;
    border-radius: $border-radius;
    margin-bottom: $spacing-xl;
    text-align: center;

    h1 {
      margin: 0 0 $spacing-sm 0;
      font-size: 2rem;
      font-family: $font-heading;
    }

    .subtitle {
      margin: 0;
      opacity: 0.95;
      font-size: 1.1rem;
    }
  }

  section {
    margin-bottom: $spacing-xl;

    h2 {
      color: $color-primary;
      margin-top: 0;
      margin-bottom: $spacing-lg;
      font-size: 1.5rem;
      border-bottom: 2px solid $color-accent;
      padding-bottom: $spacing-md;
    }
  }

  &__pattern {
    .pattern-box {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: $spacing-lg;
      background: $color-surface-light;
      padding: 2rem;
      border-radius: $border-radius;
      margin-bottom: $spacing-md;

      .pattern-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: $spacing-sm;

        .pattern-label {
          font-weight: bold;
          color: $color-text-secondary;
          font-size: 0.9rem;
        }

        .pattern-value {
          font-size: 1.8rem;
          font-weight: bold;
          font-family: $font-mono;
          padding: $spacing-md $spacing-lg;
          border-radius: $border-radius;

          &.singular {
            background: #E8F5E9;
            color: #1B5E20;
          }

          &.plural {
            background: #FFF3E0;
            color: #E65100;
          }
        }
      }

      .pattern-arrow {
        font-size: 2rem;
        color: $color-accent;
        font-weight: bold;
      }
    }

    .pattern-description {
      text-align: center;
      color: $color-text-secondary;
      font-style: italic;
    }
  }

  &__examples,
  &__variants {
    .examples-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: $spacing-md;
    }

    .example-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: $border-radius;
      padding: $spacing-md;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      &:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        transform: translateY(-2px);
      }

      .example-singular {
        .benga-word--block {
          background: #E8F5E9;
        }

        :deep(.benga-word__text) {
          color: #1B5E20;
        }
      }

      .example-plural {
        .benga-word--block {
          background: #FFF3E0;
        }

        :deep(.benga-word__text) {
          color: #E65100;
        }
      }

      :deep(.benga-word__meaning) {
        max-width: 100%;
        min-width: 50%;
        flex: 1;
      }
    }
  }

  &__concepts {
    .concepts-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: $spacing-lg;

      .concept-item {
        background: linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 100%);
        padding: $spacing-lg;
        border-radius: $border-radius;
        border-left: 4px solid $color-primary;

        h4 {
          margin: 0 0 $spacing-sm 0;
          color: $color-primary;
        }

        p {
          margin: 0;
          color: $color-text-secondary;
          font-size: 0.95rem;
        }
      }
    }
  }

  &__practice {
    background: $color-surface-light;
    padding: $spacing-lg;
    border-radius: $border-radius;

    .practice-list {
      margin: 0;
      padding-left: $spacing-lg;

      li {
        margin-bottom: $spacing-md;
        line-height: 1.6;
      }
    }
  }

  &__nav {
    display: flex;
    justify-content: space-between;
    gap: $spacing-lg;
    margin-top: $spacing-xl;

    .nav-link {
      flex: 1;
      padding: $spacing-md $spacing-lg;
      background: $color-primary;
      color: white;
      text-decoration: none;
      border-radius: $border-radius;
      text-align: center;
      transition: all 0.3s ease;
      font-weight: bold;

      &:hover {
        background: darken($color-primary, 10%);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      }

      &.prev {
        background: $color-secondary;

        &:hover {
          background: darken($color-secondary, 10%);
        }
      }
    }
  }

  @include respond-below('md') {
    padding: $spacing-md;

    &__header {
      padding: 1.5rem $spacing-md;

      h1 {
        font-size: 1.5rem;
      }

      .subtitle {
        font-size: 1rem;
      }
    }

    &__nav {
      flex-direction: column;

      .nav-link {
        text-align: center;
      }
    }
  }
}
</style>
