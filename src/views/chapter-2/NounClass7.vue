<template>
  <div class="noun-class noun-class--7">
    <div class="noun-class__header">
      <h1>Séptima Clase Nominal</h1>
      <p class="subtitle">Singular = Plural</p>
    </div>

    <section class="noun-class__pattern">
      <h2>Patrón de Transformación</h2>
      <div class="pattern-box">
        <div class="pattern-item">
          <span class="pattern-label">Singular:</span>
          <span class="pattern-value singular">fala / tuma</span>
        </div>
        <div class="pattern-arrow">→</div>
        <div class="pattern-item">
          <span class="pattern-label">Plural:</span>
          <span class="pattern-value plural">fala / tuma</span>
        </div>
      </div>
      <p class="pattern-description">Esta clase es invariable: la forma singular y plural coinciden, y el número se interpreta por el contexto o por los adjuntos que acompañan al sustantivo.</p>
    </section>

    <section class="noun-class__examples">
      <h2>Ejemplos (algunos de 100+)</h2>
      <div class="examples-grid">
        <div class="example-card" v-for="(word, idx) in words" :key="`word-${idx}`">
          <div class="example-singular">
            <BengaWord
              :word="word.word"
              :meaning="word.meaning"
              :dictionary-url="getDictionaryUrl(word.word)"
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
          <h4>Invariable</h4>
          <p>En esta clase, la forma del nombre no cambia entre singular y plural.</p>
        </div>
        <div class="concept-item">
          <h4>Contexto gramatical</h4>
          <p>El número se infiere por los modificadores, los adjetivos o el contexto de la frase.</p>
        </div>
        <div class="concept-item">
          <h4>Gran grupo</h4>
          <p>La mayoría de las palabras que comienzan con consonante o con doble consonante entran aquí.</p>
        </div>
      </div>
    </section>

    <section class="noun-class__practice">
      <h2>Para Practicar</h2>
      <ol class="practice-list">
        <li>Observa que la forma del nombre no cambia entre singular y plural.</li>
        <li>Busca el número por el adjetivo o por el contexto en la oración.</li>
        <li>Memoriza ejemplos comunes para reconocer la clase rápidamente.</li>
      </ol>
    </section>

    <section class="noun-class__nav">
      <router-link to="/capitulo-2/clase-6" class="nav-link prev">← Clase 6</router-link>
      <router-link to="/capitulo-2/irregulares" class="nav-link next">Irregulares →</router-link>
    </section>
  </div>
</template>

<script>
import BengaWord from '@/components/content/BengaWord.vue'

const LIVING_DICTIONARY_BASE = 'https://livingdictionaries.app/benga/entry'

export default {
  name: 'NounClass7',
  components: {
    BengaWord
  },
  data() {
    return {
      words: [
        { word: 'Fala', meaning: 'cristal' },
        { word: 'Fato', meaning: 'cosa' },
        { word: 'Fula', meaning: 'hilo' },
        { word: 'Jangá', meaning: 'atadura' },
        { word: 'Jonda', meaning: 'escarabajo' },
        { word: 'Jumba', meaning: 'río pequeño' },
        { word: 'Kabala', meaning: 'pollo' },
        { word: 'Kata', meaning: 'palma' },
        { word: 'Kono', meaning: 'casa' },
        { word: 'Kuma', meaning: 'terreno' },
        { word: 'Paha', meaning: 'lugar' },
        { word: 'Panga', meaning: 'pieza' },
        { word: 'Tagulu', meaning: 'sombra' },
        { word: 'Tina', meaning: 'lodo' },
        { word: 'Tito', meaning: 'tipo' },
        { word: 'Toko', meaning: 'piedra' },
        { word: 'Tolongo', meaning: 'senda' },
        { word: 'Tombo', meaning: 'ronco' },
        { word: 'Tongo', meaning: 'hacha' },
        { word: 'Tudi', meaning: 'fruta' },
        { word: 'Tuma', meaning: 'hoja' },
        { word: 'Penge', meaning: 'cuerda' },
        { word: 'Pani', meaning: 'yuca' },
        { word: 'Paro', meaning: 'palmera' },
        { word: 'Sago', meaning: 'corteza' },
        { word: 'Sango', meaning: 'árbol' },
        { word: 'Sikulu', meaning: 'arco' },
        { word: 'Ngabo', meaning: 'madera' },
        { word: 'Ngaho', meaning: 'fruto' },
        { word: 'Ngama', meaning: 'mar' },
        { word: 'Ngandi', meaning: 'lago' },
        { word: 'Ngani', meaning: 'día' },
        { word: 'Ngúmbi', meaning: 'pescado' },
        { word: 'Njadi', meaning: 'nuez' },
        { word: 'Ndabo', meaning: 'varón' },
        { word: 'Ndaga', meaning: 'ropa' },
        { word: 'Ndolo', meaning: 'cabello' },
        { word: 'Mora', meaning: 'pueblo' },
        { word: 'Mbanja', meaning: 'madera' },
        { word: 'Mbángá', meaning: 'sangre' },
        { word: 'Mota', meaning: 'lomo' },
        { word: 'Hapi', meaning: 'ramita' },
        { word: 'Hoñe', meaning: 'pato' },
        { word: 'Poke', meaning: 'pelea' },
        { word: 'Poti', meaning: 'maíz' },
        { word: 'Pudi', meaning: 'memoria' },
        { word: 'Páisi', meaning: 'campo' }
      ]
    }
  },
  methods: {
    getDictionaryUrl(word) {
      return `${LIVING_DICTIONARY_BASE}/${word.toLowerCase()}`
    }
  },
  created() {
    document.title = 'Séptima Clase Nominal | Portal Benga'
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
