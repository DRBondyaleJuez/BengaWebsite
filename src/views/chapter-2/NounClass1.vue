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
      <div class="pattern-box">
        <div class="pattern-item">
          <span class="pattern-label">Singular:</span>
          <span class="pattern-value singular">e-</span>
        </div>
        <div class="pattern-arrow">→</div>
        <div class="pattern-item">
          <span class="pattern-label">Plural:</span>
          <span class="pattern-value plural">be-</span>
        </div>
      </div>
      <p class="pattern-description">La vocal inicial 'e' se reemplaza con el prefijo 'be-' en forma plural</p>
    </section>

    <!-- Examples Grid -->
    <section class="noun-class__examples">
      <h2>Ejemplos Principales</h2>
      <div class="examples-grid">
        <div class="example-card" v-for="(example, idx) in mainExamples" :key="`ex-${idx}`">
          <div class="example-header">
            <span class="example-singular">{{ example.singular }}</span>
            <span class="example-arrow">→</span>
            <span class="example-plural">{{ example.plural }}</span>
          </div>
          <div class="example-meaning">
            <strong>{{ example.meaning }}</strong>
          </div>
        </div>
      </div>
    </section>

    <!-- Variant Pattern: Y -->
    <section class="noun-class__variants">
      <h2>Patrón Variant: Palabras que comienzan con 'y'</h2>
      <p>Los nombres que comienzan con 'y' siguen la misma regla, pero transformando 'y' en 'bi' en plural:</p>
      <div class="variant-pattern">
        <span class="pattern-value">y-</span>
        <span>→</span>
        <span class="pattern-value">bi-</span>
      </div>
      <div class="examples-grid">
        <div class="example-card" v-for="(example, idx) in yVariants" :key="`yvar-${idx}`">
          <div class="example-header">
            <span class="example-singular">{{ example.singular }}</span>
            <span class="example-arrow">→</span>
            <span class="example-plural">{{ example.plural }}</span>
          </div>
          <div class="example-meaning">
            <strong>{{ example.meaning }}</strong>
          </div>
        </div>
      </div>
    </section>

    <!-- Concordance -->
    <section class="noun-class__concordance">
      <h2>Concordancia con Adjetivos</h2>
      <div class="concordance-table">
        <div class="concordance-row header">
          <div>Número</div>
          <div>Ejemplo</div>
          <div>Traducción</div>
        </div>
        <div class="concordance-row">
          <div class="label">Singular</div>
          <div><span class="bengaword">Epokolo eyamu</span></div>
          <div>Sombrero bueno</div>
        </div>
        <div class="concordance-row">
          <div class="label">Plural</div>
          <div><span class="bengaword">Bepokolo beyamu</span></div>
          <div>Sombreros buenos</div>
        </div>
      </div>
      <p class="note">La forma del adjetivo cambia junto con el nombre, manteniéndose la concordancia</p>
    </section>

    <!-- Key Concepts -->
    <section class="noun-class__concepts">
      <h2>Conceptos Clave</h2>
      <div class="concepts-list">
        <div class="concept-item">
          <h4>Cambio Radical Simple</h4>
          <p>Esta es la clase más simple porque el cambio es predecible y consistente</p>
        </div>
        <div class="concept-item">
          <h4>Patrón e → be</h4>
          <p>Todos los nombres de esta clase siguen este mismo patrón sin excepción</p>
        </div>
        <div class="concept-item">
          <h4>Variante y → bi</h4>
          <p>Los nombres que comienzan con 'y' (consonante semivocal) siguen la misma lógica</p>
        </div>
        <div class="concept-item">
          <h4>Frecuencia en uso</h4>
          <p>Aunque la clase 1 existe, la mayoría de palabras de esta clase son nombres comunes</p>
        </div>
      </div>
    </section>

    <!-- Practice -->
    <section class="noun-class__practice">
      <h2>Para Practicar</h2>
      <ol class="practice-list">
        <li>Cubre la columna plural y trata de transformar cada nombre singular</li>
        <li>Forma frases usando el adjetivo "eyamu" (bueno) con cada nombre</li>
        <li>Intenta agregar otros adjetivos que conozcas y mantener la concordancia</li>
        <li>Escucha la pronunciación de cada palabra en plural</li>
      </ol>
    </section>

    <!-- Navigation -->
    <section class="noun-class__nav">
      <router-link to="/capitulo-2/introduccion" class="nav-link prev">
        ← Introducción
      </router-link>
      <router-link to="/capitulo-2/clase-2" class="nav-link next">
        Segunda Clase →
      </router-link>
    </section>
  </div>
</template>

<script>
export default {
  name: 'NounClass1',
  data() {
    return {
      mainExamples: [
        { singular: 'Ejanganangobo', plural: 'Bejanganangobo', meaning: 'Libro' },
        { singular: 'Epokolo', plural: 'Bepokolo', meaning: 'Sombrero' },
        { singular: 'Eñá', plural: 'Bená', meaning: 'Brazo' },
        { singular: 'Ekái', plural: 'Bekái', meaning: 'Plátano' },
        { singular: 'Elinga', plural: 'Belinga', meaning: 'Cesto' },
        { singular: 'Elombo', plural: 'Belombo', meaning: 'Cosa' },
        { singular: 'Egala', plural: 'Begala', meaning: 'Cajón' },
        { singular: 'Elende', plural: 'Belende', meaning: 'Bote' }
      ],
      yVariants: [
        { singular: 'Yaho', plural: 'Biaho', meaning: 'Quijada' },
        { singular: 'Yako', plural: 'Biako', meaning: 'Cama' },
        { singular: 'Yalo', plural: 'Bialo', meaning: 'Bote europeo' },
        { singular: 'Yambe', plural: 'Biambe', meaning: 'Cura supersticiosa' },
        { singular: 'Yapa', plural: 'Biapa', meaning: 'Canasta' },
        { singular: 'Yáki', plural: 'Biáki', meaning: 'Medicina' },
        { singular: 'Yzjá', plural: 'Biejá', meaning: 'Medida' },
        { singular: 'Yeké', plural: 'Biéke', meaning: 'Juicio' },
        { singular: 'Yima', plural: 'Biima', meaning: 'Egoísmo' },
        { singular: 'Yoha', plural: 'Bioha', meaning: 'Mono pequeño' },
        { singular: 'Yoma', plural: 'Bioma', meaning: 'Ñame' },
        { singular: 'Yomu', plural: 'Biomu', meaning: 'Calor' }
      ]
    };
  },
  created() {
    document.title = 'Primera Clase Nominal | Portal Benga';
  }
};
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

      .example-header {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: $spacing-sm;
        margin-bottom: $spacing-sm;
        font-weight: bold;

        .example-singular {
          color: #1B5E20;
          font-family: $font-mono;
        }

        .example-arrow {
          color: $color-accent;
        }

        .example-plural {
          color: #E65100;
          font-family: $font-mono;
        }
      }

      .example-meaning {
        text-align: center;
        color: $color-text-primary;
        font-size: 0.95rem;
      }
    }
  }

  &__variants {
    .variant-pattern {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: $spacing-md;
      margin-bottom: $spacing-lg;
      padding: $spacing-lg;
      background: #F3E5F5;
      border-radius: $border-radius;
      font-size: 1.5rem;
      font-weight: bold;

      .pattern-value {
        background: white;
        padding: $spacing-md $spacing-lg;
        border-radius: $border-radius;
        font-family: $font-mono;
        color: $color-primary;
      }
    }
  }

  &__concordance {
    .concordance-table {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: $border-radius;
      overflow: hidden;

      .concordance-row {
        display: grid;
        grid-template-columns: 100px 1fr 1fr;
        border-bottom: 1px solid #f0f0f0;
        min-height: 60px;

        &.header {
          background: $color-primary;
          color: white;
          font-weight: bold;

          div {
            padding: $spacing-md;
            display: flex;
            align-items: center;
          }
        }

        &:not(.header) {
          &:hover {
            background: $color-surface-light;
          }

          div {
            padding: $spacing-md;
            display: flex;
            align-items: center;

            &.label {
              font-weight: bold;
            }

            .bengaword {
              font-family: $font-mono;
              color: $color-primary;
              font-weight: bold;
            }
          }
        }
      }
    }

    .note {
      margin-top: $spacing-md;
      padding: $spacing-md;
      background: #FFFDE7;
      border-left: 4px solid $color-accent;
      color: $color-text-secondary;
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

    &__concordance .concordance-table .concordance-row {
      grid-template-columns: 80px 1fr;

      div:nth-child(3) {
        display: none;
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
