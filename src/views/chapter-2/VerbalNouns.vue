<template>
  <div class="verbal-nouns">
    <div class="verbal-nouns__header">
      <h1>Nombres Derivados</h1>
      <p class="subtitle">Nombres que se derivan de otras palabras</p>
    </div>

    <section class="verbal-nouns__intro">
      <p>Los nombres que derivan de otras palabras pueden dividirse en tres clases: nombres abstractos derivados de imperativos verbales, nombres agenciales derivados de imperativos verbales y nombres de modos derivados de los sustantivos agenciales o sustantivos abstractos.</p>
    </section>

    <!-- Class 1: Abstract Nouns -->
    <section class="verbal-nouns__class-1">
      <h2>CLASE PRIMERA: Nombres Abstractos</h2>
      <p class="rule">Estos se forman de la segunda persona del singular del imperativo, quitándole la última sílaba y anteponiendo a la palabra la letra i.</p>

      <div class="examples-grid">
        <div class="example-card" v-for="(example, idx) in abstractNouns" :key="`abstract-${idx}`">
          <div class="example-group">
            <div class="example-form">
              <span class="label">Imperativo</span>
              <BengaWord
                :word="example.imperative"
                :audio-id="makeAudioId(example.imperativeAudio)"
                :meaning="example.imperativeMeaning"
                :dictionary-url="getDictionaryUrl(example.imperative)"
                block
              />
            </div>
            <span class="arrow" aria-hidden="true">→</span>
            <div class="example-form">
              <span class="label">Nombre</span>
              <BengaWord
                :word="example.nominalForm"
                :audio-id="makeAudioId(example.nominalAudio)"
                :meaning="example.meaning"
                :dictionary-url="getDictionaryUrl(example.nominalForm)"
                block
              />
            </div>
          </div>
        </div>
      </div>
      <p class="classification-note">En la clasificación, estos nombres pertenecen a la <a href="/capitulo-2/clase-2">segunda clase</a> en su número singular. (i->ma)</p>
    </section>

    <!-- Class 2: Action Nouns -->
    <section class="verbal-nouns__class-2">
      <h2>CLASE SEGUNDA: Nombres Agenciales</h2>
      <p class="rule">Estos se forman asimismo de la segunda persona del singular del imperativo, quitando la última sílaba, anteponiendo a la palabra la letra u y la última letra siendo i.</p>

      <div class="examples-grid">
        <div class="example-card" v-for="(example, idx) in agentNouns" :key="`agent-${idx}`">
          <div class="example-group">
            <div class="example-form">
              <span class="label">Imperativo</span>
              <BengaWord
                :word="example.imperative"
                :audio-id="makeAudioId(example.imperativeAudio)"
                :meaning="example.imperativeMeaning"
                :dictionary-url="getDictionaryUrl(example.imperative)"
                block
              />
            </div>
            <span class="arrow" aria-hidden="true">→</span>
            <div class="example-form">
              <span class="label">Nombre</span>
              <BengaWord
                :word="example.nominalForm"
                :audio-id="makeAudioId(example.nominalAudio)"
                :meaning="example.meaning"
                :dictionary-url="getDictionaryUrl(example.nominalForm)"
                block
              />
            </div>
          </div>
        </div>
      </div>
      <p class="classification-note">Estos nombres pertenecen a la <a href="/capitulo-2/clase-3">tercera clase</a> en la formación del plural. u->me</p>
    </section>

    <!-- Class 3: Modality Nouns -->
    <section class="verbal-nouns__class-3">
      <h2>CLASE TERCERA: Nombres de Modo</h2>
      <p class="rule">Estos se reforman mudando la "u" inicial de los nombres agenciales por una "i", y añadiendo "di" a su terminación. (Se podría entender también como sustituyendo la última letra de los nombres abstractos por "idi"</p>

      <div class="examples-grid">
        <div class="example-card" v-for="(example, idx) in modalityNouns" :key="`modality-${idx}`">
          <div class="example-group">
            <div class="example-form">
              <span class="label">Nombre de acción</span>
              <BengaWord
                :word="example.actionForm"
                :audio-id="makeAudioId(example.actionFormAudio)"
                :meaning="example.actionFormMeaning"
                :dictionary-url="getDictionaryUrl(example.actionForm)"
                block
              />
            </div>
            <span class="arrow" aria-hidden="true">→</span>
            <div class="example-form">
              <span class="label">Nombre de modo</span>
              <BengaWord
                :word="example.nominalForm"
                :audio-id="makeAudioId(example.nominalAudio)"
                :meaning="example.meaning"
                :dictionary-url="getDictionaryUrl(example.nominalForm)"
                block
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Comparison Table -->
    <section class="verbal-nouns__summary">
      <h2>Los tres tipos en resumen</h2>
      <div class="summary-table">
        <div class="summary-row header">
          <div>Tipo</div>
          <div>Formación</div>
          <div>Ejemplo</div>
          <div>Clase nominal</div>
        </div>
        <div class="summary-row" v-for="row in typeSummary" :key="row.type">
          <div class="label">{{ row.type }}</div>
          <div>{{ row.formation }}</div>
          <div class="example">{{ row.example }}</div>
          <div>{{ row.nounClass }}</div>
        </div>
      </div>
    </section>

    <!-- Key Concepts -->
    <section class="verbal-nouns__concepts">
      <h2>Conceptos Clave</h2>
      <div class="concepts-grid">
        <div class="concept-card">
          <h4>Imperativo de partida</h4>
          <p>Las dos primeras clases nacen de la segunda persona del singular del imperativo, sin su última sílaba</p>
        </div>
        <div class="concept-card">
          <h4>Vocal precedente</h4>
          <p>En la clase segunda esa vocal se omite o se muda, y de ahí sale la forma ulongi, ulangi, ukali</p>
        </div>
        <div class="concept-card">
          <h4>Terminación en -di</h4>
          <p>La clase tercera parte del nombre de acción: muda su u inicial por i y añade di al final</p>
        </div>
        <div class="concept-card">
          <h4>Una misma raíz</h4>
          <p>Longaka, ulongi e ilongidi muestran cómo una sola raíz verbal produce los tres tipos</p>
        </div>
      </div>
    </section>

    <!-- Examples of Productivity -->
    <section class="verbal-nouns__productivity">
      <h2>Ejemplo con las tres derivaciones</h2>
      <p>Los tres derivaciones: aplicando cada regla a la misma raíz verbal se obtienen los tres tipos de nombres. Así ocurre con la raíz "<em>long</em>" de <em>Longaka</em>, «edifica tú»:</p>

      <div class="productivity-example">
        <div class="derivations-grid">
          <div class="derivation-item">
            <div class="derivation-label">Clase primera · abstracto</div>
            <BengaWord
              word="ilonga"
              :audio-id="makeAudioId('ilonga')"
              meaning="edificio"
              :dictionary-url="getDictionaryUrl('ilonga')"
              block
            />
          </div>
          <div class="derivation-item">
            <div class="derivation-label">Clase segunda · agenciales</div>
            <BengaWord
              word="ulongi"
              :audio-id="makeAudioId('ulongi')"
              meaning="arquitecto"
              :dictionary-url="getDictionaryUrl('ulongi')"
              block
            />
          </div>
          <div class="derivation-item">
            <div class="derivation-label">Clase tercera · de modo</div>
            <BengaWord
              word="ilongidi"
              :audio-id="makeAudioId('ilongidi')"
              meaning="modo de construir"
              :dictionary-url="getDictionaryUrl('ilongidi')"
              block
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Practice -->
    <section class="verbal-nouns__practice">
      <h2>Para Practicar</h2>
      <ol>
        <li>Memoriza las tres reglas de formación y a qué forma de partida arranca cada una</li>
        <li>Toma un imperativo nuevo y deduce su nombre abstracto y su nombre de acción</li>
        <li>Parte de un nombre de acción y construye su nombre de modo con la terminación <strong>-di</strong></li>
        <li>Comprueba en la tabla de resumen a qué clase nominal pertenece cada forma</li>
      </ol>
    </section>

    <!-- Navigation -->
    <section class="verbal-nouns__nav">
      <router-link to="/capitulo-2/irregulares" class="nav-link prev">← Nombres Irregulares</router-link>
      <router-link to="/capitulo-2" class="nav-link next">Volver a Capítulo 2 →</router-link>
    </section>
  </div>
</template>

<script>
import BengaWord from '@/components/content/BengaWord.vue'

const LIVING_DICTIONARY_BASE = 'https://livingdictionaries.app/benga/entry'

export default {
  name: 'VerbalNouns',
  components: { BengaWord },
  data() {
    return {
      abstractNouns: [
        { imperative: 'Tândâkâ', imperativeAudio: 't_a_nd_a_k_a_', imperativeMeaning: 'ama tú', nominalForm: 'itânde', nominalAudio: 'it_a_nde', meaning: 'amor' },
        { imperative: 'Binaka', imperativeAudio: 'binaka', imperativeMeaning: 'aborrece tú', nominalForm: 'ibina', nominalAudio: 'ibina', meaning: 'odio' },
        { imperative: 'Kalaka', imperativeAudio: 'kalaka', imperativeMeaning: 'habla tú', nominalForm: 'ikala', nominalAudio: 'ikala', meaning: 'razonamiento' },
        { imperative: 'Langaka', imperativeAudio: 'langaka', imperativeMeaning: 'lee tú', nominalForm: 'ilanga', nominalAudio: 'ilanga', meaning: 'lectura' },
        { imperative: 'Longaka', imperativeAudio: 'longaka', imperativeMeaning: 'edifica tú', nominalForm: 'ilonga', nominalAudio: 'ilonga', meaning: 'edificio' },
        { imperative: 'Lēndēkē', imperativeAudio: 'l_e_nd_e_k_e_', imperativeMeaning: 'escribe tú', nominalForm: 'ilende', nominalAudio: 'ilende', meaning: 'escritura' },
        { imperative: 'Kalakia', imperativeAudio: 'kalakia', imperativeMeaning: 'ora tú', nominalForm: 'ikalo', nominalAudio: 'ikalo', meaning: 'oración' },
        { imperative: 'Janjaka', imperativeAudio: 'janjaka', imperativeMeaning: 'trabaja tú', nominalForm: 'ijanja', nominalAudio: 'ijanja', meaning: 'trabajo' }
      ],
      abstractNounsExamples: [
        {
          singular: { word: 'Ilonga', audio: 'ilonga', meaning: 'edificio' },
          plural: { word: 'Malonga', audio: 'malonga', meaning: 'edificios' }
        },
        {
          singular: { word: 'Ijanja', audio: 'ijanja', meaning: 'trabajo' },
          plural: { word: 'Majanja', audio: 'majanja', meaning: 'trabajos' }
        }
      ],
      agentNouns: [
        { imperative: 'Longaka', imperativeAudio: 'longaka', imperativeMeaning: 'edifica tú', nominalForm: 'ulongi', nominalAudio: 'ulongi', meaning: 'arquitecto' },
        { imperative: 'Langaka', imperativeAudio: 'langaka', imperativeMeaning: 'lee tú', nominalForm: 'ulangi', nominalAudio: 'ulangi', meaning: 'lector' },
        { imperative: 'Kalaka', imperativeAudio: 'kalaka', imperativeMeaning: 'habla tú', nominalForm: 'ukali', nominalAudio: 'ukali', meaning: 'orador' },
        { imperative: 'Lēndēkē', imperativeAudio: 'l_e_nd_e_k_e_', imperativeMeaning: 'escribe tú', nominalForm: 'ulendi', nominalAudio: 'ulendi', meaning: 'escritor' }
      ],
      agentNounsExamples: [
        {
          singular: { word: 'Ulangi', audio: 'ulangi', meaning: 'lector' },
          plural: { word: 'Melangi', audio: 'melangi', meaning: 'lectores' }
        },
        {
          singular: { word: 'Ulendi', audio: 'ulendi', meaning: 'escritor' },
          plural: { word: 'Melendi', audio: 'melendi', meaning: 'escritores' }
        }
      ],
      modalityNouns: [
        { actionForm: 'Ulongi', actionFormAudio: 'ulongi', actionFormMeaning: 'arquitecto', nominalForm: 'ilongidi', nominalAudio: 'ilongidi', meaning: 'modo de construir' },
        { actionForm: 'Ulangi', actionFormAudio: 'ulangi', actionFormMeaning: 'lector', nominalForm: 'ilangidi', nominalAudio: 'ilangidi', meaning: 'modo de leer' },
        { actionForm: 'Ukali', actionFormAudio: 'ukali', actionFormMeaning: 'orador', nominalForm: 'ikalidi', nominalAudio: 'ikalidi', meaning: 'modo de hablar' }
      ],
      typeSummary: [
        {
          type: 'Abstracto',
          formation: 'Imperativo de 2.ª persona singular sin su última sílaba, con i inicial',
          example: 'Tândâkâ → itânde',
          nounClass: 'Segunda clase'
        },
        {
          type: 'De acción',
          formation: 'Imperativo de 2.ª persona singular sin su última sílaba, omitiendo o cambiando por i la última vocal',
          example: 'Longaka → ulongi',
          nounClass: 'Tercera clase'
        },
        {
          type: 'De modo',
          formation: 'Nombre de acción con su u inicial mudada en i y terminación en -di',
          example: 'Ulongi → ilongidi',
          nounClass: '—'
        }
      ]
    };
  },
  methods: {
    getDictionaryUrl(word) {
      return `${LIVING_DICTIONARY_BASE}/${String(word).toLowerCase()}`
    },
    makeAudioId(word) {
      if (!word) return null
      let id = ''
      for (const ch of String(word).toLowerCase()) {
        if ((ch >= 'a' && ch <= 'z') || (ch >= '0' && ch <= '9')) {
          id += ch
          continue
        }
        const plain = ch.normalize('NFD').replace(/\p{Diacritic}/gu, '')
        id += /^[a-z0-9]$/.test(plain) ? `_${plain}_` : '_'
      }
      return id.replace(/_{2,}/g, '_')
    }
  },
  created() {
    document.title = 'Nombres Derivados | Portal Benga';
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/variables';
@import '@/styles/mixins';

.verbal-nouns {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: $spacing-lg;

  &__header {
    background: linear-gradient(135deg, #C0392B 0%, #E74C3C 100%);
    color: white;
    padding: 2.5rem $spacing-lg;
    border-radius: $border-radius;
    text-align: center;
    margin-bottom: $spacing-xl;

    h1 {
      margin: 0 0 $spacing-sm 0;
      font-size: 2rem;
      font-family: $font-heading;
    }

    .subtitle {
      margin: 0;
      font-size: 1.1rem;
      opacity: 0.95;
    }
  }

  &__intro {
    background: $color-surface-light;
    padding: $spacing-lg;
    border-radius: $border-radius;
    border-left: 4px solid #C0392B;
    margin-bottom: $spacing-xl;
  }

  section {
    margin-bottom: $spacing-xl;

    h2 {
      color: #C0392B;
      margin-top: 0;
      margin-bottom: $spacing-lg;
      font-size: 1.5rem;
      border-bottom: 2px solid #C0392B;
      padding-bottom: $spacing-md;
    }

    .rule {
      background: #FFF3E0;
      padding: $spacing-md;
      border-radius: $border-radius;
      border-left: 4px solid #C0392B;
      margin-bottom: $spacing-lg;
      font-style: italic;
    }
  }

  .examples-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: $spacing-md;

    .example-card {
      background: white;
      border: 2px solid #e0e0e0;
      border-radius: $border-radius;
      padding: $spacing-md;
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        transform: translateY(-2px);
      }

      .example-group {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        gap: $spacing-sm;
        align-items: center;

        .arrow {
          color: $color-accent;
          font-size: 1.5rem;
          font-weight: bold;
        }
      }

      .example-form {
        display: flex;
        flex-direction: column;
        gap: $spacing-xs;
        min-width: 0;

        .label {
          font-size: 0.8rem;
          color: $color-text-muted;
          font-weight: bold;
          text-transform: uppercase;
          text-align: center;
        }

        .benga-word {
          justify-content: center;
        }
      }
    }
  }

  .classification-note {
    font-size: 0.9rem;
    color: $color-text-muted;
    background: #FFFDE7;
    padding: $spacing-md;
    border-radius: $border-radius;
    border-left: 4px solid #C0392B;
  }

  &__summary {
    .summary-table {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: $border-radius;
      overflow: hidden;

      .summary-row {
        display: grid;
        grid-template-columns: 130px 1.6fr 1fr 1fr;
        border-bottom: 1px solid #f0f0f0;

        div {
          padding: $spacing-md;
        }

        &.header {
          background: #C0392B;
          color: white;
          font-weight: bold;
        }

        &:not(.header) {
          &:hover {
            background: $color-surface-light;
          }

          .label {
            font-weight: bold;
          }

          .example {
            font-family: $font-mono;
            color: #C0392B;
            font-weight: bold;
          }
        }
      }
    }

    .note {
      margin-top: $spacing-md;
      padding: $spacing-md;
      background: #FFFDE7;
      border-left: 4px solid #C0392B;
      color: $color-text-secondary;
    }
  }

  &__concepts {
    .concepts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: $spacing-lg;

      .concept-card {
        background: linear-gradient(135deg, #FCE4EC 0%, #F3E5F5 100%);
        padding: $spacing-lg;
        border-radius: $border-radius;
        border-left: 4px solid #C0392B;

        h4 {
          margin: 0 0 $spacing-sm 0;
          color: #C0392B;
        }

        p {
          margin: 0;
          color: $color-text-secondary;
          font-size: 0.95rem;
        }
      }
    }
  }

  &__productivity {
    background: $color-surface-light;
    padding: $spacing-lg;
    border-radius: $border-radius;
    border-left: 4px solid #C0392B;

    .productivity-example {
      background: white;
      padding: $spacing-lg;
      border-radius: $border-radius;
      margin-top: $spacing-md;
    }

    .derivations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: $spacing-md;
    }

    .derivation-item {
      background: #FFF3E0;
      padding: $spacing-md;
      border-radius: $border-radius;
      border: 1px solid #ffe0b2;

      .derivation-label {
        font-size: 0.8rem;
        font-weight: bold;
        color: $color-text-muted;
        text-transform: uppercase;
        margin-bottom: $spacing-xs;
      }
    }
  }

  &__practice {
    background: $color-surface-light;
    padding: $spacing-lg;
    border-radius: $border-radius;

    ol {
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
      font-weight: bold;
      transition: all 0.3s ease;

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

    .examples-grid {
      grid-template-columns: 1fr;
    }

    &__summary .summary-table .summary-row {
      grid-template-columns: 1fr;
      border-bottom: 2px solid #e0e0e0;

      div {
        border-top: 1px solid #f0f0f0;
        padding: $spacing-sm $spacing-md;
      }

      div:first-child {
        border-top: none;
      }
    }

    &__nav {
      flex-direction: column;
    }
  }
}
</style>
