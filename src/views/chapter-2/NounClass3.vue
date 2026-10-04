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

    <section class="noun-class__exceptions">
      <h2>Excepciones</h2>
      <p class="section-note">Estos nombres de la clase 3 no siguen el cambio regular me- / mi- en el plural.</p>
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
      <p class="example-note">Mola pertenece a esta clase solo en lo que atañe al plural: su forma singular es una palabra distinta.</p>
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
          singular: { word: 'Wbaha', audio: 'wbaha', meaning: 'Costado, lado' },
          plural: { word: 'Mebaha', audio: 'mebaha', meaning: 'Costados, lados' }
        },
        {
          singular: { word: 'Wbalani', audio: 'wbalani', meaning: 'Conquistador' },
          plural: { word: 'Mebalani', audio: 'mebalani', meaning: 'Conquistadores' }
        },
        {
          singular: { word: 'Wbanga', audio: 'wbanga', meaning: 'Nuez' },
          plural: { word: 'Mebanga', audio: 'mebanga', meaning: 'Nueces' }
        },
        {
          singular: { word: 'Wbango', audio: 'wbango', meaning: 'Diente de marfil' },
          plural: { word: 'Mebango', audio: 'mebango', meaning: 'Dientes de marfil' }
        },
        {
          singular: { word: 'Wbâki', audio: 'wb_a_ki', meaning: 'Hacha, destral' },
          plural: { word: 'Mebâki', audio: 'meb_a_ki', meaning: 'Hachas, destrales' }
        },
        {
          singular: { word: 'Wbândâ', audio: 'wb_a_nd_a_', meaning: 'Tiro de fusil' },
          plural: { word: 'Mebândâ', audio: 'meb_a_nd_a_', meaning: 'Tiros de fusil' }
        },
        {
          singular: { word: 'Wbendi', audio: 'wbendi', meaning: 'Adulador' },
          plural: { word: 'Mebendi', audio: 'mebendi', meaning: 'Aduladores' }
        },
        {
          singular: { word: 'Wbēdi', audio: 'wb_e_di', meaning: 'Enfermedad' },
          plural: { word: 'Mebēdi', audio: 'meb_e_di', meaning: 'Enfermedades' }
        },
        {
          singular: { word: 'Wbulubulu', audio: 'wbulubulu', meaning: 'Polvo' },
          plural: { word: 'Mebulubulu', audio: 'mebulubulu', meaning: 'Polvos' }
        },
        {
          singular: { word: 'Wbūa', audio: 'wb_u_a', meaning: 'La mañana' },
          plural: { word: 'Mebūa', audio: 'meb_u_a', meaning: 'Las mañanas' }
        },
        {
          singular: { word: 'Wdâmbē', audio: 'wd_a_mb_e_', meaning: 'Oveja' },
          plural: { word: 'Medâmbē', audio: 'med_a_mb_e_', meaning: 'Ovejas' }
        },
        {
          singular: { word: 'Wdumbu', audio: 'wdumbu', meaning: null },
          plural: { word: 'Medumbu', audio: 'medumbu', meaning: null }
        },
        {
          singular: { word: 'Wgangano', audio: 'wgangano', meaning: 'Compañerismo' },
          plural: { word: 'Megangano', audio: 'megangano', meaning: 'Compañerismos' }
        },
        {
          singular: { word: 'Wgulu', audio: 'wgulu', meaning: 'Cuerda' },
          plural: { word: 'Megulu', audio: 'megulu', meaning: 'Cuerdas' }
        },
        {
          singular: { word: 'Whâ', audio: 'wh_a_', meaning: 'Pipa' },
          plural: { word: 'Mehâ', audio: 'meh_a_', meaning: 'Pipas' }
        },
        {
          singular: { word: 'Whēkē', audio: 'wh_e_k_e_', meaning: 'Playa del mar' },
          plural: { word: 'Mehēkē', audio: 'meh_e_k_e_', meaning: 'Playas del mar' }
        },
        {
          singular: { word: 'Whēngē', audio: 'wh_e_ng_e_', meaning: 'Calle' },
          plural: { word: 'Mehēngē', audio: 'meh_e_ng_e_', meaning: 'Calles' }
        },
        {
          singular: { word: 'Whiha', audio: 'whiha', meaning: 'Nervio, vena' },
          plural: { word: 'Mehiha', audio: 'mehiha', meaning: 'Nervios, venas' }
        },
        {
          singular: { word: 'Whinganakano', audio: 'whinganakano', meaning: 'Cadena' },
          plural: { word: 'Mehinganakano', audio: 'mehinganakano', meaning: 'Cadenas' }
        },
        {
          singular: { word: 'Whingi', audio: 'whingi', meaning: 'Gato salvaje' },
          plural: { word: 'Mehingi', audio: 'mehingi', meaning: 'Gatos salvajes' }
        }
      ],
      muExamples: [
        {
          singular: { word: 'Mūadi', audio: 'm_u_adi', meaning: 'Hembra' },
          plural: { word: 'Miadi', audio: 'miadi', meaning: 'Hembras' }
        },
        {
          singular: { word: 'Mūahi', audio: 'm_u_ahi', meaning: 'Erizo, peine de adorno' },
          plural: { word: 'Miahi', audio: 'miahi', meaning: 'Erizos, peines de adorno' }
        },
        {
          singular: { word: 'Mūako', audio: 'm_u_ako', meaning: 'Confianza' },
          plural: { word: 'Miako', audio: 'miako', meaning: 'Confianzas' }
        },
        {
          singular: { word: 'Mūalika', audio: 'm_u_alika', meaning: 'Vihuela' },
          plural: { word: 'Mialika', audio: 'mialika', meaning: 'Vihuelas' }
        },
        {
          singular: { word: 'Mūambo', audio: 'm_u_ambo', meaning: 'Sacrificio, oferta' },
          plural: { word: 'Miambo', audio: 'miambo', meaning: 'Sacrificios, ofertas' }
        },
        {
          singular: { word: 'Mūanga', audio: 'm_u_anga', meaning: 'Rebaño, huerto' },
          plural: { word: 'Mianga', audio: 'mianga', meaning: 'Rebaños, huertos' }
        },
        {
          singular: { word: 'Mūanjo', audio: 'm_u_anjo', meaning: 'Justicia' },
          plural: { word: 'Mianjo', audio: 'mianjo', meaning: 'Justicias' }
        },
        {
          singular: { word: 'Mūemba', audio: 'm_u_emba', meaning: 'Sopa, salsa' },
          plural: { word: 'Miemba', audio: 'miemba', meaning: 'Sopas, salsas' }
        },
        {
          singular: { word: 'Mūēngi', audio: 'm_u_e_ngi', meaning: 'Extranjero' },
          plural: { word: 'Miēngi', audio: 'miengi', meaning: 'Extranjeros' }
        },
        {
          singular: { word: 'Mūēni', audio: 'm_u_e_ni', meaning: 'Brazalete' },
          plural: { word: 'Miēni', audio: 'mi_e_ni', meaning: 'Brazaletes' }
        },
        {
          singular: { word: 'Mūidi', audio: 'm_u_idi', meaning: 'Banco, orilla' },
          plural: { word: 'Miidi', audio: 'miidi', meaning: 'Bancos, orillas' }
        },
        {
          singular: { word: 'Mūindi', audio: 'm_u_indi', meaning: 'Montón, hato' },
          plural: { word: 'Miindi', audio: 'miindi', meaning: 'Montones, hatos' }
        },
        {
          singular: { word: 'Mūiya', audio: 'm_u_iya', meaning: 'Intestinos' },
          plural: { word: 'Miiya', audio: 'miiya', meaning: 'Intestinos' }
        }
      ],
      exceptionExamples: [
        {
          singular: { word: 'Muajo', audio: 'muajo', meaning: 'Mujer' },
          plural: { word: 'Bajo', audio: 'bajo', meaning: 'Mujeres' }
        },
        {
          singular: { word: 'Molo', audio: 'molo', meaning: 'Cabeza' },
          plural: { word: 'Miolo', audio: 'miolo', meaning: 'Cabezas' }
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

  .section-note {
    margin: 0 0 $spacing-lg;
    padding: $spacing-md;
    background: #FFFDE7;
    border-left: 4px solid $color-accent;
    color: $color-text-secondary;
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
