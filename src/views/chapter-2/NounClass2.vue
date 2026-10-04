<template>
  <div class="noun-class noun-class--2">
    <div class="noun-class__header">
      <h1>Segunda Clase Nominal</h1>
      <p class="subtitle">i / di → ma</p>
    </div>

    <section class="noun-class__pattern">
      <h2>Patrón de Transformación</h2>
      <div class="pattern-box">
        <div class="pattern-item">
          <span class="pattern-label">Singular:</span>
          <span class="pattern-value singular">i- / di-</span>
        </div>
        <div class="pattern-arrow">→</div>
        <div class="pattern-item">
          <span class="pattern-label">Plural:</span>
          <span class="pattern-value plural">ma-</span>
        </div>
      </div>
      <p class="pattern-description">La inicial de muchas palabras de esta clase se convierte en el prefijo ma- en plural.</p>
    </section>

    <section class="noun-class__examples">
      <h2>Ejemplos con i-</h2>
      <div class="examples-grid">
        <div class="example-card" v-for="(example, idx) in iExamples" :key="`i-${idx}`">
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
      <h2>Ejemplos con di-</h2>
      <div class="examples-grid">
        <div class="example-card" v-for="(example, idx) in diExamples" :key="`di-${idx}`">
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
          <h4>Cambio inicial predecible</h4>
          <p>La clase 2 mantiene un prefijo plural muy estable: ma-.</p>
        </div>
        <div class="concept-item">
          <h4>i- y di-</h4>
          <p>Las palabras con inicial i o di siguen el mismo esquema y se convierten en ma-.</p>
        </div>
        <div class="concept-item">
          <h4>Concordancia</h4>
          <p>El plural del sustantivo afecta también al adjetivo que lo acompaña.</p>
        </div>
      </div>
    </section>

    <section class="noun-class__exceptions">
      <h2>Excepciones</h2>
      <p class="section-note">Hay muchas excepciones en esta clase: nombres que empiezan por i- o di- y que, sin embargo, forman el plural con mi-, mâ- o mo- en lugar de ma-.</p>
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
      <p class="example-note">Dyâmbi se pronuncia «Jombi» y Dyoba «Joba».</p>
    </section>

    <section class="noun-class__liquids">
      <h2>Excepción: líquidos siempre en plural</h2>
      <p class="section-note">Hay también algunos nombres de líquidos que los bengas no usan en singular y que forman el plural como los pertenecientes a esta clase.</p>
      <div class="examples-grid">
        <div class="example-card" v-for="(example, idx) in iExamples" :key="`i-${idx}`">
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

    <section class="noun-class__class-six">
      <h2>Excepción: nombres con i- que pertenecen a la sexta clase</h2>
      <p class="section-note">Se hallan asimismo algunos nombres que, si bien empiezan con i- en el singular, no pertenecen a esta clase, sino a la sexta. Estos forman el plural mudando la i- radical en lo-.</p>
      <div class="examples-grid">
        <div class="example-card" v-for="(example, idx) in diExamples" :key="`di-${idx}`">
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
          <h4>Cambio inicial predecible</h4>
          <p>La clase 2 mantiene un prefijo plural muy estable: ma-.</p>
        </div>
        <div class="concept-item">
          <h4>i- y di-</h4>
          <p>Las palabras con inicial i o di siguen el mismo esquema y se convierten en ma-.</p>
        </div>
        <div class="concept-item">
          <h4>Concordancia</h4>
          <p>El plural del sustantivo afecta también al adjetivo que lo acompaña.</p>
        </div>
      </div>
    </section>

    <section class="noun-class__practice">
      <h2>Para Practicar</h2>
      <ol class="practice-list">
        <li>Compara cada forma singular y plural y repite el cambio ma-.</li>
        <li>Forma frases con un nombre singular y luego en plural.</li>
        <li>Escucha la entonación de los ejemplos para detectar la diferencia.</li>
      </ol>
    </section>

    <section class="noun-class__nav">
      <router-link to="/capitulo-2/clase-1" class="nav-link prev">← Clase 1</router-link>
      <router-link to="/capitulo-2/clase-3" class="nav-link next">Tercera Clase →</router-link>
    </section>
  </div>
</template>

<script>
import BengaWord from '@/components/content/BengaWord.vue'

const LIVING_DICTIONARY_BASE = 'https://livingdictionaries.app/benga/entry'

export default {
  name: 'NounClass2',
  components: {
    BengaWord
  },
  data() {
    return {
      iExamples: [
        {
          singular: { word: 'Ibakē', audio: 'ibak_e_', meaning: 'Cuidado' },
          plural: { word: 'Mabakē', audio: 'mabak_e_', meaning: 'Cuidados' }
        },
        {
          singular: { word: 'Ibala', audio: 'ibala', meaning: 'Victoria' },
          plural: { word: 'Mabala', audio: 'mabala', meaning: 'Victorias' }
        },
        {
          singular: { word: 'Ibâlu', audio: 'ib_a_lu', meaning: 'Cuello' },
          plural: { word: 'Mabâlu', audio: 'mab_a_lu', meaning: 'Cuellos' }
        },
        {
          singular: { word: 'Ibângâ', audio: 'ib_a_n_g_a_', meaning: 'Rodilla' },
          plural: { word: 'Mabângâ', audio: 'mab_a_n_g_a_', meaning: 'Rodillas' }
        },
        {
          singular: { word: 'Ibâtâ', audio: 'ib_a_t_a_', meaning: 'Bendición' },
          plural: { word: 'Mabâtâ', audio: 'mab_a_t_a_', meaning: 'Bendiciones' }
        },
        {
          singular: { word: 'Ibeku', audio: 'ibeku', meaning: 'Apoyo' },
          plural: { word: 'Mabeku', audio: 'mabeku', meaning: 'Apoyos' }
        },
        {
          singular: { word: 'Ibendē', audio: 'ibend_e_', meaning: 'Alabanza' },
          plural: { word: 'Mabendē', audio: 'mabend_e_', meaning: 'Alabanzas' }
        },
        {
          singular: { word: 'Ibēkē', audio: 'ib_e_k_e_', meaning: 'Hombro' },
          plural: { word: 'Mabēkē', audio: 'mab_e_k_e_', meaning: 'Hombros' }
        },
        {
          singular: { word: 'Ikadu', audio: 'ikadu', meaning: 'Mano' },
          plural: { word: 'Makadu', audio: 'makadu', meaning: 'Manos' }
        },
        {
          singular: { word: 'Ilale', audio: 'ilale', meaning: 'Piedra' },
          plural: { word: 'Malale', audio: 'malale', meaning: 'Piedras' }
        },
        {
          singular: { word: 'Ibomba', audio: 'ibomba', meaning: 'Cuerno' },
          plural: { word: 'Mabomba', audio: 'mabomba', meaning: 'Cuernos' }
        },
        {
          singular: { word: 'Ihana', audio: 'ihana', meaning: 'Ayuda' },
          plural: { word: 'Mahana', audio: 'mahana', meaning: 'Ayudas' }
        },
        {
          singular: { word: 'Ihonga', audio: 'ihonga', meaning: 'Diente' },
          plural: { word: 'Mahonga', audio: 'mahonga', meaning: 'Dientes' }
        },
        {
          singular: { word: 'Ihuhu', audio: 'ihuhu', meaning: 'Estómago, vientre' },
          plural: { word: 'Mahuhu', audio: 'mahuhu', meaning: 'Estómagos, vientres' }
        },
        {
          singular: { word: 'Ihuku', audio: 'ihuku', meaning: 'Fin, extremidad' },
          plural: { word: 'Mahuku', audio: 'mahuku', meaning: 'Fines, extremidades' }
        },
        {
          singular: { word: 'Ijane', audio: 'ijane', meaning: 'Nacimiento' },
          plural: { word: 'Majanē', audio: 'majane', meaning: 'Nacimientos' }
        },
        {
          singular: { word: 'Ikabo', audio: 'ikabo', meaning: 'Porción, parte' },
          plural: { word: 'Makabo', audio: 'makabo', meaning: 'Porciones, partes' }
        },
        {
          singular: { word: 'Ikalia', audio: 'ikalia', meaning: 'Oración, súplica' },
          plural: { word: 'Makalia', audio: 'makalia', meaning: 'Oraciones, súplicas' }
        },
        {
          singular: { word: 'Ikana', audio: 'ikana', meaning: 'Juramento' },
          plural: { word: 'Makana', audio: 'makana', meaning: 'Juramentos' }
        },
        {
          singular: { word: 'Ikelenge', audio: 'ikelenge', meaning: 'Campana' },
          plural: { word: 'Makelenge', audio: 'makelenge', meaning: 'Campanas' }
        },
        {
          singular: { word: 'Ikēlēnē', audio: 'ik_e_l_e_n_e_', meaning: 'Vanidad' },
          plural: { word: 'Makēlēnē', audio: 'mak_e_l_e_n_e_', meaning: 'Vanidades' }
        },
        {
          singular: { word: 'Ikēluku', audio: 'ik_e_luku', meaning: 'Ambición' },
          plural: { word: 'Makēluku', audio: 'mak_e_luku', meaning: 'Ambiciones' }
        },
        {
          singular: { word: 'Ikogo', audio: 'ikogo', meaning: 'Zapato' },
          plural: { word: 'Makogo', audio: 'makogo', meaning: 'Zapatos' }
        },
        {
          singular: { word: 'Iluku', audio: 'iluku', meaning: 'Hermana' },
          plural: { word: 'Maluku', audio: 'maluku', meaning: 'Hermanas' }
        },
        {
          singular: { word: 'Itánde', audio: 'itande', meaning: 'Amor' },
          plural: { word: 'Matánde', audio: 'matande', meaning: 'Amores' }
        },
        {
          singular: { word: 'Iovenda', audio: 'iovenda', meaning: 'Gloria' },
          plural: { word: 'Mavenda', audio: 'mavenda', meaning: 'Glorias' }
        },
        {
          singular: { word: 'Ivē', audio: 'iv_e_', meaning: 'Paga, recompensa' },
          plural: { word: 'Mavē', audio: 'ma_v_e_', meaning: 'Pagas, recompensas' }
        },
        {
          singular: { word: 'Ibobēlē', audio: 'ibob_e_l_e_', meaning: 'Araña' },
          plural: { word: 'Mabobēlē', audio: 'mabob_e_l_e_', meaning: 'Arañas' }
        }
      ],
      diExamples: [
        {
          singular: { word: 'Diba', audio: 'diba', meaning: 'Casamiento' },
          plural: { word: 'Maba', audio: 'maba', meaning: 'Casamientos' }
        },
        {
          singular: { word: 'Dibē', audio: 'dib_e_', meaning: 'Ubre, teta' },
          plural: { word: 'Mabē', audio: 'ma_b_e_', meaning: 'Ubres, tetas' }
        },
        {
          singular: { word: 'Dikē', audio: 'dik_e_', meaning: 'Huevo' },
          plural: { word: 'Makē', audio: 'mak_e_', meaning: 'Huevos' }
        },
        {
          singular: { word: 'Dimya', audio: 'dimya', meaning: 'Torpedo' },
          plural: { word: 'Mamya', audio: 'mumya', meaning: 'Torpedos' }
        },
        {
          singular: { word: 'Diso', audio: 'diso', meaning: 'Nigua' },
          plural: { word: 'Maso', audio: 'muso', meaning: 'Niguas' }
        },
        {
          singular: { word: 'Dindē', audio: 'dind_e_', meaning: 'Ñame, Tubérculo' },
          plural: { word: 'Mandē', audio: 'man_d_e_', meaning: 'Ñames, Tubérculos' }
        },
        {
          singular: { word: 'Dingongola', audio: 'dingongola', meaning: 'Plátano especial' },
          plural: { word: 'Mangongola', audio: 'mangongola', meaning: 'Plátanos especiales' }
        },
        {
          singular: { word: 'Dinyâ', audio: 'diny_a_', meaning: 'Escama' },
          plural: { word: 'Manyâ', audio: 'many_a_', meaning: 'Escamas' }
        },
        {
          singular: { word: 'Ditâ', audio: 'dit_a_', meaning: 'Oreja' },
          plural: { word: 'Matâ', audio: 'mat_a_', meaning: 'Orejas' }
        },
        {
          singular: { word: 'Divyâ', audio: 'divy_a_', meaning: 'Escoba' },
          plural: { word: 'Mavyâ', audio: 'mavy_a_', meaning: 'Escobas' }
        }
      ],
      exceptionExamples: [
        {
          singular: { word: 'Diâ', audio: 'di_a_', meaning: 'Hogar' },
          plural: { word: 'Miâ', audio: 'mi_a_', meaning: 'Hogares' }
        },
        {
          singular: { word: 'Dina', audio: 'dina', meaning: 'Nombre' },
          plural: { word: 'Mina', audio: 'mina', meaning: 'Nombres' }
        },
        {
          singular: { word: 'Dihâ', audio: 'dih_a_', meaning: 'Ojo' },
          plural: { word: 'Mihâ', audio: 'mih_a_', meaning: 'Ojos' }
        },
        {
          singular: { word: 'Dyâmbi', audio: 'dy_a_mbi', meaning: 'Puerta' },
          plural: { word: 'Mâmbi', audio: 'm_a_mbi', meaning: 'Puertas' }
        },
        {
          singular: { word: 'Dyoba', audio: 'dyoba', meaning: 'Sol' },
          plural: { word: 'Moda', audio: 'moda', meaning: 'Soles' }
        }
      ],
      liquidExamples: [
        { word: 'Mavule', audio: 'mavule', meaning: 'Aceite' },
        { word: 'Manyângâ', audio: 'many_a_ng_a_', meaning: 'Leche' },
        { word: 'Maku', audio: 'maku', meaning: 'Ron, licor' },
        { word: 'Makândâ', audio: 'mak_a_nd_a_', meaning: 'Savia' },
        { word: 'Makiya', audio: 'makiya', meaning: 'Sangre' },
        { word: 'Miba', audio: 'miba', meaning: 'Agua' }
      ],
      classSixExamples: [
        {
          singular: { word: 'Inâni', audio: 'in_a_ni', meaning: 'Pájaro' },
          plural: { word: 'Lonâni', audio: 'lon_a_ni', meaning: 'Pájaros' }
        },
        {
          singular: { word: 'Iboko', audio: 'iboko', meaning: 'Lugar, sitio' },
          plural: { word: 'Loboko', audio: 'loboko', meaning: 'Lugares, sitios' }
        },
        {
          singular: { word: 'Ikadada', audio: 'ikadada', meaning: 'Pimienta' },
          plural: { word: 'Lokadada', audio: 'lokadada', meaning: 'Pimientas' }
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
    document.title = 'Segunda Clase Nominal | Portal Benga'
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
  &__exceptions,
  &__liquids,
  &__class-six {
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

  &__liquids {
    .plural-only-tag {
      display: inline-block;
      margin-top: $spacing-sm;
      padding: 2px $spacing-sm;
      background: #FFFDE7;
      border: 1px solid $color-accent;
      border-radius: $border-radius-full;
      color: $color-accent-dark;
      font-size: 0.7rem;
      font-weight: bold;
      letter-spacing: 0.04em;
      text-transform: uppercase;
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
