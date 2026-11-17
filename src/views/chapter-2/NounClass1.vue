<template>
  <div class="noun-class">
    <!-- Header -->
    <div class="noun-class__header">
      <h1>Primera Clase Nominal</h1>
      <p class="subtitle">e → be / y → bi</p>
    </div>

    <!-- Pattern Explanation -->
    <section class="noun-class__pattern">
      <h2>Patrón de Transformación</h2>
      <PatternBox
        from="e-"
        to="be-"
        description="La vocal inicial 'e' se reemplaza con el prefijo 'be-' en forma plural"
      />
    </section>

    <!-- Examples Grid -->
    <section class="noun-class__examples">
      <h2>Ejemplos Principales</h2>
      <ExampleGrid :items="mainExamples" key-prefix="ex" />
    </section>

    <!-- Variant Pattern: Y -->
    <section class="noun-class__variants">
      <h2>Patrón Variant: Palabras que comienzan con 'y'</h2>
      <p>
        Los nombres que comienzan con 'y' siguen la misma regla, pero transformando 'y' en 'bi' en
        plural:
      </p>
      <PatternBox from="y-" to="bi-" compact />
      <ExampleGrid :items="yVariants" key-prefix="yvar" />
    </section>

    <!-- Concordance -->
    <section class="noun-class__concordance">
      <h2>Concordancia con Adjetivos</h2>
      <TableBlock :columns="['Número', 'Ejemplo', 'Traducción']" :rows="concordanceRows" />
      <NoteBox
        kind="after"
        text="La forma del adjetivo cambia junto con el nombre, manteniéndose la concordancia"
      />
    </section>

    <!-- Key Concepts -->
    <section class="noun-class__concepts">
      <h2>Conceptos Clave</h2>
      <ConceptList :items="concepts" />
    </section>

    <!-- Practice -->
    <section class="noun-class__practice">
      <h2>Para Practicar</h2>
      <PracticeList :items="practice" />
    </section>

    <!-- Navigation -->
    <section class="noun-class__nav">
      <SectionNavFooter
        :prev="{ to: '/capitulo-2/introduccion', label: 'Introducción' }"
        :next="{ to: '/capitulo-2/clase-2', label: 'Segunda Clase' }"
      />
    </section>
  </div>
</template>

<script>
import PatternBox from '@/components/blocks/PatternBox.vue'
import ExampleGrid from '@/components/blocks/ExampleGrid.vue'
import TableBlock from '@/components/blocks/TableBlock.vue'
import NoteBox from '@/components/blocks/NoteBox.vue'
import ConceptList from '@/components/blocks/ConceptList.vue'
import PracticeList from '@/components/blocks/PracticeList.vue'
import SectionNavFooter from '@/components/blocks/SectionNavFooter.vue'

export default {
  name: 'NounClass1',
  components: {
    PatternBox,
    ExampleGrid,
    TableBlock,
    NoteBox,
    ConceptList,
    PracticeList,
    SectionNavFooter
  },
  data() {
    return {
      concordanceRows: [
        [{ text: 'Singular' }, { benga: 'Epokolo eyamu' }, { text: 'Sombrero bueno' }],
        [{ text: 'Plural' }, { benga: 'Bepokolo beyamu' }, { text: 'Sombreros buenos' }]
      ],
      concepts: [
        {
          title: 'Cambio Radical Simple',
          text: 'Esta es la clase más simple porque el cambio es predecible y consistente'
        },
        {
          title: 'Patrón e → be',
          text: 'Todos los nombres de esta clase siguen este mismo patrón sin excepción'
        },
        {
          title: 'Variante y → bi',
          text: "Los nombres que comienzan con 'y' (consonante semivocal) siguen la misma lógica"
        }
      ],
      practice: [
        'Cubre la columna plural y trata de transformar cada nombre singular',
        'Forma frases usando el adjetivo "eyamu" (bueno) con cada nombre',
        'Intenta agregar otros adjetivos que conozcas y mantener la concordancia',
        'Escucha la pronunciación de cada palabra en plural'
      ],
      mainExamples: [
        {
          singular: {
            word: 'Ejanganangobo',
            audio: 'ejanganangobo',
            meaning: 'Libro'
          },
          plural: {
            word: 'Bejanganangobo',
            audio: 'bejanganangobo',
            meaning: 'Libros'
          }
        },
        {
          singular: {
            word: 'Epokolo',
            audio: 'epokolo',
            meaning: 'Sombrero'
          },
          plural: {
            word: 'Bepokolo',
            audio: 'bepokolo',
            meaning: 'Sombreros'
          }
        },
        {
          singular: {
            word: 'Enâ',
            audio: 'en_a_',
            meaning: 'Brazo'
          },
          plural: {
            word: 'Benâ',
            audio: 'ben_a_',
            meaning: 'Brazos'
          }
        },
        {
          singular: {
            word: 'Ekâi',
            audio: 'ek_a_i',
            meaning: 'Plátano'
          },
          plural: {
            word: 'Bekâi',
            audio: 'bek_a_i',
            meaning: 'Plátanos'
          }
        },
        {
          singular: {
            word: 'Elinga',
            audio: 'elinga',
            meaning: 'Cesto'
          },
          plural: {
            word: 'Belinga',
            audio: 'belinga',
            meaning: 'Cestos'
          }
        },
        {
          singular: {
            word: 'Elombo',
            audio: 'elombo',
            meaning: 'Cosa'
          },
          plural: {
            word: 'Belombo',
            audio: 'belombo',
            meaning: 'Cosas'
          }
        },
        {
          singular: {
            word: 'Egala',
            audio: 'egala',
            meaning: 'Cajón'
          },
          plural: {
            word: 'Begala',
            audio: 'begala',
            meaning: 'Cajones'
          }
        },
        {
          singular: {
            word: 'Elende',
            audio: 'elende',
            meaning: 'Bote'
          },
          plural: {
            word: 'Belende',
            audio: 'belende',
            meaning: 'Botes'
          }
        }
      ],
      yVariants: [
        {
          singular: {
            word: 'Yaho',
            audio: 'yaho',
            meaning: 'Quijada'
          },
          plural: {
            word: 'Biaho',
            audio: 'biaho',
            meaning: 'Quijadas'
          }
        },
        {
          singular: {
            word: 'Yako',
            audio: 'yako',
            meaning: 'Cama'
          },
          plural: {
            word: 'Biako',
            audio: 'biako',
            meaning: 'Camas'
          }
        },
        {
          singular: {
            word: 'Yalo',
            audio: 'yalo',
            meaning: 'Bote europeo'
          },
          plural: {
            word: 'Bialo',
            audio: 'bialo',
            meaning: 'Botes europeos'
          }
        },
        {
          singular: {
            word: 'Yambe',
            audio: 'yambe',
            meaning: 'Cura supersticiosa'
          },
          plural: {
            word: 'Biambe',
            audio: 'biambe',
            meaning: 'Curas supersticiosas'
          }
        },
        {
          singular: {
            word: 'Yapa',
            audio: 'yapa',
            meaning: 'Canasta'
          },
          plural: {
            word: 'Biapa',
            audio: 'biapa',
            meaning: 'Canastas'
          }
        },
        {
          singular: {
            word: 'Yâkâ',
            audio: 'y_a_k_a_',
            meaning: 'Medicina supersticiosa'
          },
          plural: {
            word: 'Biâkâ',
            audio: 'bi_a_k_a_',
            meaning: 'Medicinas supersticiosas'
          }
        },
        {
          singular: {
            word: 'Yējâ',
            audio: 'y_e_j_a_',
            meaning: 'Medida'
          },
          plural: {
            word: 'Biejâ',
            audio: 'biej_a_',
            meaning: 'Medidas'
          }
        },
        {
          singular: {
            word: 'Yēkē',
            audio: 'y_e_k_e_',
            meaning: 'Juicio'
          },
          plural: {
            word: 'Biēke',
            audio: 'bi_e_ke',
            meaning: 'Juicios'
          }
        },
        {
          singular: {
            word: 'Yima',
            audio: 'yima',
            meaning: 'Egoísmo'
          },
          plural: {
            word: 'Biima',
            audio: 'biima',
            meaning: 'Egoísmos'
          }
        },
        {
          singular: {
            word: 'Yoha',
            audio: 'yoha',
            meaning: 'Mono pequeño'
          },
          plural: {
            word: 'Bioha',
            audio: 'bioha',
            meaning: 'Monos pequeños'
          }
        },
        {
          singular: {
            word: 'Yoma',
            audio: 'yoma',
            meaning: 'Ñame'
          },
          plural: {
            word: 'Bioma',
            audio: 'bioma',
            meaning: 'Ñames'
          }
        },
        {
          singular: {
            word: 'Yomu',
            audio: 'yomu',
            meaning: 'Calor'
          },
          plural: {
            word: 'Biomu',
            audio: 'biomu',
            meaning: 'Calores'
          }
        }
      ]
    }
  },
  created() {
    document.title = 'Primera Clase Nominal | Portal Benga'
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
    background: linear-gradient(135deg, #2d5a27 0%, #4a7c4e 100%);
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

  &__practice {
    background: $color-surface-light;
    padding: $spacing-lg;
    border-radius: $border-radius;
  }

  &__nav {
    display: flex;
    justify-content: space-between;
    gap: $spacing-lg;
    margin-top: $spacing-xl;
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
    }
  }
}
</style>
