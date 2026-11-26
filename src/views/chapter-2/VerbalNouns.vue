<template>
  <div class="verbal-nouns">
    <div class="verbal-nouns__header">
      <h1>{{ $t('pages.verbalNouns.nombresDerivados') }}</h1>
      <p class="subtitle">{{ $t('pages.verbalNouns.nombresSeDerivanOtras') }}</p>
    </div>

    <section class="verbal-nouns__intro">
      <p>
        {{ $t('pages.verbalNouns.nombresDerivanOtrasPalabras') }}
      </p>
    </section>

    <!-- Class 1: Abstract Nouns -->
    <section class="verbal-nouns__class-1">
      <h2>{{ $t('pages.verbalNouns.clasePrimeraNombresAbstractos') }}</h2>
      <p class="rule">
        {{ $t('pages.verbalNouns.estosSeFormanSegunda') }}
      </p>

      <CardGrid
        :items="abstractNouns"
        class="examples-grid"
        key-prefix="abstract"
        v-slot="{ item: example }"
      >
        <div class="example-card">
          <div class="example-group">
            <div class="example-form">
              <span class="label">{{ $t('pages.verbalNouns.imperativo') }}</span>
              <BengaWord
                :word="example.imperative"
                :meaning="$localized(example.imperativeMeaning)"
                block
              />
            </div>
            <span class="arrow" aria-hidden="true">→</span>
            <div class="example-form">
              <span class="label">{{ $t('pages.verbalNouns.nombre') }}</span>
              <BengaWord :word="example.nominalForm" :meaning="$localized(example.meaning)" block />
            </div>
          </div>
        </div>
      </CardGrid>
      <p class="classification-note">
        {{ $t('pages.verbalNouns.clasificacionEstosNombresPertenecen') }}
        <a href="/capitulo-2/clase-2">{{ $t('pages.verbalNouns.clase2') }}</a>
        {{ $t('pages.verbalNouns.suNumeroSingularI') }}
      </p>
    </section>

    <!-- Class 2: Action Nouns -->
    <section class="verbal-nouns__class-2">
      <h2>{{ $t('pages.verbalNouns.claseSegundaNombresAgenciales') }}</h2>
      <p class="rule">
        {{ $t('pages.verbalNouns.estosSeFormanAsimismo') }}
      </p>

      <CardGrid
        :items="agentNouns"
        class="examples-grid"
        key-prefix="agent"
        v-slot="{ item: example }"
      >
        <div class="example-card">
          <div class="example-group">
            <div class="example-form">
              <span class="label">{{ $t('pages.verbalNouns.imperativo') }}</span>
              <BengaWord
                :word="example.imperative"
                :meaning="$localized(example.imperativeMeaning)"
                block
              />
            </div>
            <span class="arrow" aria-hidden="true">→</span>
            <div class="example-form">
              <span class="label">{{ $t('pages.verbalNouns.nombre') }}</span>
              <BengaWord :word="example.nominalForm" :meaning="$localized(example.meaning)" block />
            </div>
          </div>
        </div>
      </CardGrid>
      <p class="classification-note">
        {{ $t('pages.verbalNouns.estosNombresPertenecen') }}
        <a href="/capitulo-2/clase-3">{{ $t('pages.verbalNouns.clase3') }}</a>
        {{ $t('pages.verbalNouns.formacionPluralUMe') }}
      </p>
    </section>

    <!-- Class 3: Modality Nouns -->
    <section class="verbal-nouns__class-3">
      <h2>{{ $t('pages.verbalNouns.claseTerceraNombresModo') }}</h2>
      <p class="rule">
        {{ $t('pages.verbalNouns.estosSeReformanMudando') }}
      </p>

      <CardGrid
        :items="modalityNouns"
        class="examples-grid"
        key-prefix="modality"
        v-slot="{ item: example }"
      >
        <div class="example-card">
          <div class="example-group">
            <div class="example-form">
              <span class="label">{{ $t('pages.verbalNouns.nombreAccion') }}</span>
              <BengaWord
                :word="example.actionForm"
                :meaning="$localized(example.actionFormMeaning)"
                block
              />
            </div>
            <span class="arrow" aria-hidden="true">→</span>
            <div class="example-form">
              <span class="label">{{ $t('pages.verbalNouns.nombreModo') }}</span>
              <BengaWord :word="example.nominalForm" :meaning="$localized(example.meaning)" block />
            </div>
          </div>
        </div>
      </CardGrid>
    </section>

    <!-- Comparison Table -->
    <section class="verbal-nouns__summary">
      <h2>{{ $t('pages.verbalNouns.tresTiposResumen') }}</h2>
      <div class="summary-table">
        <div class="summary-row header">
          <div>{{ $t('pages.verbalNouns.tipo') }}</div>
          <div>{{ $t('pages.verbalNouns.formacion') }}</div>
          <div>{{ $t('pages.verbalNouns.ejemplo') }}</div>
          <div>{{ $t('pages.verbalNouns.claseNominal') }}</div>
        </div>
        <div class="summary-row" v-for="row in typeSummary" :key="row.example">
          <div class="label">{{ $localized(row.type) }}</div>
          <div>{{ $localized(row.formation) }}</div>
          <div class="example">{{ row.example }}</div>
          <div>{{ $localized(row.nounClass) }}</div>
        </div>
      </div>
    </section>

    <!-- Key Concepts -->
    <section class="verbal-nouns__concepts">
      <h2>{{ $t('pages.verbalNouns.conceptosClave') }}</h2>
      <div class="concepts-grid">
        <div class="concept-card">
          <h4>{{ $t('pages.verbalNouns.imperativoPartida') }}</h4>
          <p>
            {{ $t('pages.verbalNouns.dosPrimerasClasesNacen') }}
          </p>
        </div>
        <div class="concept-card">
          <h4>{{ $t('pages.verbalNouns.vocalPrecedente') }}</h4>
          <p>
            {{ $t('pages.verbalNouns.claseSegundaEsaVocal') }}
          </p>
        </div>
        <div class="concept-card">
          <h4>{{ $t('pages.verbalNouns.terminacionDi') }}</h4>
          <p>
            {{ $t('pages.verbalNouns.claseTerceraParteNombre') }}
          </p>
        </div>
        <div class="concept-card">
          <h4>{{ $t('pages.verbalNouns.mismaRaiz') }}</h4>
          <p>
            {{ $t('pages.verbalNouns.longakaUlongiEIlongidi') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Examples of Productivity -->
    <section class="verbal-nouns__productivity">
      <h2>{{ $t('pages.verbalNouns.ejemploConTresDerivaciones') }}</h2>
      <p v-html="$t('pages.verbalNouns.tresDerivacionesAplicandoCada')"></p>

      <div class="productivity-example">
        <div class="derivations-grid">
          <div class="derivation-item">
            <div class="derivation-label">{{ $t('pages.verbalNouns.clasePrimeraAbstracto') }}</div>
            <BengaWord word="ilonga" :meaning="$t('pages.verbalNouns.meaningEdificio')" block />
          </div>
          <div class="derivation-item">
            <div class="derivation-label">{{ $t('pages.verbalNouns.claseSegundaAgenciales') }}</div>
            <BengaWord word="ulongi" :meaning="$t('pages.verbalNouns.meaningArquitecto')" block />
          </div>
          <div class="derivation-item">
            <div class="derivation-label">{{ $t('pages.verbalNouns.claseTerceraModo') }}</div>
            <BengaWord
              word="ilongidi"
              :meaning="$t('pages.verbalNouns.meaningModoConstruir')"
              block
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Practice -->
    <section class="verbal-nouns__practice">
      <h2>{{ $t('pages.verbalNouns.paraPracticar') }}</h2>
      <ol>
        <li>{{ $t('pages.verbalNouns.memorizaTresReglasFormacion') }}</li>
        <li>{{ $t('pages.verbalNouns.tomaImperativoNuevoDeduce') }}</li>
        <li v-html="$t('pages.verbalNouns.parteNombreAccionConstruye')"></li>
        <li>{{ $t('pages.verbalNouns.compruebaTablaResumenClase') }}</li>
      </ol>
    </section>

    <SectionNavFooter />
  </div>
</template>

<script>
import verbalNounsData from '@/data/chapter-2/verbal-nouns.json'
import CardGrid from '@/components/blocks/CardGrid.vue'
import SectionNavFooter from '@/components/blocks/SectionNavFooter.vue'
import BengaWord from '@/components/content/BengaWord.vue'

export default {
  name: 'VerbalNouns',
  components: { CardGrid, BengaWord, SectionNavFooter },
  data() {
    // Words and texts of this page: @/data/chapter-2/verbal-nouns.json
    return { ...verbalNounsData }
  },
  created() {
    document.title = `${this.$t('pages.verbalNouns.pageTitle')} | Portal Benga`
  }
}
</script>

<style scoped lang="scss">
@use 'sass:color';
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.verbal-nouns {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--page-gutter, #{$spacing-lg});

  &__header {
    background: linear-gradient(135deg, #c0392b 0%, #e74c3c 100%);
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
    border-left: 4px solid #c0392b;
    margin-bottom: $spacing-xl;
  }

  section {
    margin-bottom: $spacing-xl;

    h2 {
      color: #c0392b;
      margin-top: 0;
      margin-bottom: $spacing-lg;
      font-size: 1.5rem;
      border-bottom: 2px solid #c0392b;
      padding-bottom: $spacing-md;
    }

    .rule {
      background: #fff3e0;
      padding: $spacing-md;
      border-radius: $border-radius;
      border-left: 4px solid #c0392b;
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
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
    background: #fffde7;
    padding: $spacing-md;
    border-radius: $border-radius;
    border-left: 4px solid #c0392b;
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
          background: #c0392b;
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
            color: #c0392b;
            font-weight: bold;
          }
        }
      }
    }

    .note {
      margin-top: $spacing-md;
      padding: $spacing-md;
      background: #fffde7;
      border-left: 4px solid #c0392b;
      color: $color-text-secondary;
    }
  }

  &__concepts {
    .concepts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: $spacing-lg;

      .concept-card {
        background: linear-gradient(135deg, #fce4ec 0%, #f3e5f5 100%);
        padding: $spacing-lg;
        border-radius: $border-radius;
        border-left: 4px solid #c0392b;

        h4 {
          margin: 0 0 $spacing-sm 0;
          color: #c0392b;
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
    border-left: 4px solid #c0392b;

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
      background: #fff3e0;
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

  @include respond-below('md') {
    padding: var(--page-gutter, #{$spacing-md});

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
  }
}
</style>
