<template>
  <div class="noun-class noun-class--3">
    <div class="noun-class__header">
      <h1>Tercera Clase Nominal</h1>
      <p class="subtitle">u / mú → me / mi</p>
    </div>

    <section class="noun-class__pattern">
      <h2>Patrón de Transformación</h2>
      <div class="pattern-box">
        <div class="pattern-item">
          <span class="pattern-label">Singular:</span>
          <span class="pattern-value singular">u- / mú-</span>
        </div>
        <div class="pattern-arrow">→</div>
        <div class="pattern-item">
          <span class="pattern-label">Plural:</span>
          <span class="pattern-value plural">me- / mi-</span>
        </div>
      </div>
      <p class="pattern-description">La clase 3 usa prefijos de plural con variantes me- y mi- según el caso inicial del sustantivo.</p>
    </section>

    <section class="noun-class__examples">
      <h2>Ejemplos con u-</h2>
      <div class="examples-grid">
        <div class="example-card" v-for="(example, idx) in uExamples" :key="`u-${idx}`">
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

    <section class="noun-class__variants">
      <h2>Ejemplos con mú- / mu-</h2>
      <div class="examples-grid">
        <div class="example-card" v-for="(example, idx) in muExamples" :key="`mu-${idx}`">
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
          <h4>Prefijos plurales variables</h4>
          <p>La clase 3 presenta una alternancia entre me- y mi- según la raíz nominal.</p>
        </div>
        <div class="concept-item">
          <h4>Raíces con u-</h4>
          <p>Los nombres con u- / w- tienden a pasar a me- en plural.</p>
        </div>
        <div class="concept-item">
          <h4>Raíces con mú-</h4>
          <p>Los nombres con mú- / mu- se refuerzan con mi- como marca plural.</p>
        </div>
      </div>
    </section>

    <section class="noun-class__practice">
      <h2>Para Practicar</h2>
      <ol class="practice-list">
        <li>Identifica si la palabra pertenece a la variante u- o mu-.</li>
        <li>Intenta transformar cada singular al plural sin mirar la respuesta.</li>
        <li>Comparte los ejemplos con adjuntos para reforzar la concordancia.</li>
      </ol>
    </section>

    <section class="noun-class__nav">
      <router-link to="/capitulo-2/clase-2" class="nav-link prev">← Clase 2</router-link>
      <router-link to="/capitulo-2/clase-4" class="nav-link next">Cuarta Clase →</router-link>
    </section>
  </div>
</template>

<script>
import BengaWord from '@/components/content/BengaWord.vue'

const LIVING_DICTIONARY_BASE = 'https://livingdictionaries.app/benga/entry'

export default {
  name: 'NounClass3',
  components: {
    BengaWord
  },
  data() {
    return {
      uExamples: [
        {
          singular: { word: 'Woaha', audio: 'woaha', meaning: 'Costado' },
          plural: { word: 'Mebaha', audio: 'mebaha', meaning: 'Costados' }
        },
        {
          singular: { word: 'Woanga', audio: 'woanga', meaning: 'Nuez' },
          plural: { word: 'Mebanga', audio: 'mebanga', meaning: 'Nueces' }
        },
        {
          singular: { word: 'Wháki', audio: 'whaki', meaning: 'Hacha' },
          plural: { word: 'Mebáki', audio: 'mebaki', meaning: 'Hachas' }
        },
        {
          singular: { word: 'Whéngé', audio: 'whenge', meaning: 'Calle' },
          plural: { word: 'Mehéngé', audio: 'mehenge', meaning: 'Calles' }
        },
        {
          singular: { word: 'Whingi', audio: 'whingi', meaning: 'Gato salvaje' },
          plural: { word: 'Mehingi', audio: 'mehingi', meaning: 'Gatos salvajes' }
        }
      ],
      muExamples: [
        {
          singular: { word: 'Múadi', audio: 'muadi', meaning: 'Hembra' },
          plural: { word: 'Miadi', audio: 'miadi', meaning: 'Hembras' }
        },
        {
          singular: { word: 'Múako', audio: 'muako', meaning: 'Confianza' },
          plural: { word: 'Miako', audio: 'miako', meaning: 'Confianzas' }
        },
        {
          singular: { word: 'Maalika', audio: 'maalika', meaning: 'Vihuela' },
          plural: { word: 'Mialika', audio: 'mialika', meaning: 'Vihuelas' }
        },
        {
          singular: { word: 'Maanga', audio: 'maanga', meaning: 'Rebaño' },
          plural: { word: 'Mianga', audio: 'mianga', meaning: 'Rebaños' }
        },
        {
          singular: { word: 'Múéngi', audio: 'muengi', meaning: 'Extranjero' },
          plural: { word: 'Miéngi', audio: 'miengi', meaning: 'Extranjeros' }
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
    document.title = 'Tercera Clase Nominal | Portal Benga'
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
