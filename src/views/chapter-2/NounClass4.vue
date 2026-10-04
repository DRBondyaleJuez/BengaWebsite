<template>
  <div class="noun-class noun-class--4">
    <div class="noun-class__header">
      <h1>Cuarta Clase Nominal</h1>
      <p class="subtitle">bo / bū → mi</p>
    </div>

    <section class="noun-class__pattern">
      <h2>Patrón de Transformación</h2>
      <div class="pattern-box">
        <div class="pattern-item">
          <span class="pattern-label">Singular:</span>
          <span class="pattern-value singular">bo- / bū-</span>
        </div>
        <div class="pattern-arrow">→</div>
        <div class="pattern-item">
          <span class="pattern-label">Plural:</span>
          <span class="pattern-value plural">mi-</span>
        </div>
      </div>
      <p class="pattern-description">Los nombres de la cuarta clase toman el prefijo mi- al pasar al plural.</p>
    </section>

    <section class="noun-class__examples">
      <h2>Ejemplos con bo-</h2>
      <div class="examples-grid">
        <div class="example-card" v-for="(example, idx) in boExamples" :key="`bo-${idx}`">
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
      <h2>Ejemplos con bū-</h2>
      <div class="examples-grid">
        <div class="example-card" v-for="(example, idx) in buExamples" :key="`ba-${idx}`">
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
          <h4>Prefijo mi-</h4>
          <p>La marca plural más característica de esta clase es mi-.</p>
        </div>
        <div class="concept-item">
          <h4>Raíces bo-/bū-</h4>
          <p>La raíz singular puede empezar con bo- o bū- antes de emerger en plural.</p>
        </div>
        <div class="concept-item">
          <h4>Uso práctico</h4>
          <p>Los nombres aparecen con el plural marcado de manera clara y regular.</p>
        </div>
      </div>
    </section>

    <section class="noun-class__exceptions">
      <h2>Excepciones</h2>
      <p class="section-note">Bolohi forma su plural, melohi, con me- en lugar de mi-. Buūha, día, pertenece a esta clase en el singular, pero su plural, ūhi, es irregular y toma todos sus adjetivos según la formación del plural de la segunda clase.</p>
      <div class="examples-grid">
        <div class="example-card" v-for="(example, idx) in exceptionExamples" :key="`exc-${idx}`">
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

    <section class="noun-class__practice">
      <h2>Para Practicar</h2>
      <ol class="practice-list">
        <li>Repite el cambio bo-/bū- → mi- con los ejemplos.</li>
        <li>Forma una frase oral con uno de los sustantivos en singular.</li>
        <li>Luego repite la misma frase en plural con el mismo patrón.</li>
      </ol>
    </section>

    <section class="noun-class__nav">
      <router-link to="/capitulo-2/clase-3" class="nav-link prev">← Clase 3</router-link>
      <router-link to="/capitulo-2/clase-5" class="nav-link next">Quinta Clase →</router-link>
    </section>
  </div>
</template>

<script>
import BengaWord from '@/components/content/BengaWord.vue'

const LIVING_DICTIONARY_BASE = 'https://livingdictionaries.app/benga/entry'

export default {
  name: 'NounClass4',
  components: {
    BengaWord
  },
  data() {
    return {
      boExamples: [
        {
          singular: { word: 'Bobako', audio: 'bobako', meaning: 'Vaina, funda' },
          plural: { word: 'Mibako', audio: 'mibako', meaning: 'Vainas, fundas' }
        },
        {
          singular: { word: 'Bobâbu', audio: 'bob_a_bu', meaning: 'Blandura' },
          plural: { word: 'Mibâbu', audio: 'mib_a_bu', meaning: 'Blanduras' }
        },
        {
          singular: { word: 'Boho', audio: 'boho', meaning: 'Cara, frente' },
          plural: { word: 'Mioho', audio: 'mioho', meaning: 'Caras, frentes' }
        },
        {
          singular: { word: 'Bojoūa', audio: 'bojo_u_a', meaning: 'Mentira' },
          plural: { word: 'Mijoūa', audio: 'mijo_u_a', meaning: 'Mentiras' }
        },
        {
          singular: { word: 'Bongo', audio: 'bongo', meaning: 'Espina, punta' },
          plural: { word: 'Miongo', audio: 'mingo', meaning: 'Espinas, puntas' }
        },
        {
          singular: { word: 'Bonyamo', audio: 'bonyamo', meaning: 'Miseria, pobreza' },
          plural: { word: 'Mingomo', audio: 'mingomo', meaning: 'Miserias, pobrezas' }
        },
        {
          singular: { word: 'Bova', audio: 'bova', meaning: 'Don, regalo' },
          plural: { word: 'Miva', audio: 'miva', meaning: 'Dones, regalos' }
        },
        {
          singular: { word: 'Bokâ', audio: 'bok_a_', meaning: 'Estación lluviosa' },
          plural: { word: 'Miokâ', audio: 'miok_a_', meaning: 'Estaciones lluviosas' }
        }
      ],
      buExamples: [
        {
          singular: { word: 'Būalo', audio: 'b_u_alo', meaning: 'Canoa' },
          plural: { word: 'Mialo', audio: 'mialo', meaning: 'Canoas' }
        },
        {
          singular: { word: 'Būanga', audio: 'b_u_anga', meaning: 'Campana supersticiosa' },
          plural: { word: 'Mianga', audio: 'mianga', meaning: 'Campanas supersticiosas' }
        },
        {
          singular: { word: 'Būayē', audio: 'b_u_any_e_', meaning: 'Violencia' },
          plural: { word: 'Miayē', audio: 'miay_e_', meaning: 'Violencias' }
        },
        {
          singular: { word: 'Būe', audio: 'b_u_e', meaning: 'Luz' },
          plural: { word: 'Mie', audio: 'mie', meaning: 'Luces' }
        },
        {
          singular: { word: 'Būeka', audio: 'b_u_eka', meaning: 'Odio' },
          plural: { word: 'Mieka', audio: 'mieka', meaning: 'Odios' }
        }
      ],
      exceptionExamples: [
        {
          singular: { word: 'Bolohi', audio: 'bolohi', meaning: 'Naranja' },
          plural: { word: 'Melohi', audio: 'melohi', meaning: 'Naranjas' }
        },
        {
          singular: { word: 'Buūha', audio: 'b_u_u_h_a', meaning: 'Día' },
          plural: { word: 'ūhi', audio: '_u_hi', meaning: 'Días' }
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
    document.title = 'Cuarta Clase Nominal | Portal Benga'
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

  .section-note {
    margin: 0 0 $spacing-lg;
    padding: $spacing-md;
    background: #FFFDE7;
    border-left: 4px solid $color-accent;
    color: $color-text-secondary;
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
  &__variants,
  &__exceptions {
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

    .example-note {
      margin: $spacing-lg 0 0;
      color: $color-text-secondary;
      font-size: 0.9rem;
      font-style: italic;
      text-align: center;
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
