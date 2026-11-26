<template>
  <div class="irregular-nouns">
    <div class="irregular-nouns__header">
      <h1>{{ $t('pages.irregularNouns.nombresIrregulares') }}</h1>
      <p class="subtitle">{{ $t('pages.irregularNouns.excepcionesNoSiguenPatrones') }}</p>
    </div>

    <section class="irregular-nouns__intro">
      <p>
        {{ $t('pages.irregularNouns.aunqueSistemaSieteClases') }}
      </p>
    </section>

    <section class="irregular-nouns__no-singular">
      <h2>{{ $t('pages.irregularNouns.n7NombresCarecenSingular') }}</h2>
      <p class="description">
        {{ $t('pages.irregularNouns.hayCiertaPorcionNombres') }}
        <a href="/capitulo-2/clase-2">{{ $t('pages.irregularNouns.sustantivosClase2') }}</a>
      </p>

      <CardGrid
        :items="pluralOnlyNouns"
        class="examples-grid"
        key-prefix="plural"
        v-slot="{ item: example }"
      >
        <div class="example-card">
          <div class="example-form">
            <span class="label">{{ $t('pages.irregularNouns.formaPrincipalPlural') }}</span>
            <span class="value">
              <BengaWord :word="example.word" :meaning="$localized(example.meaning)" block />
            </span>
          </div>
        </div>
      </CardGrid>
    </section>

    <section class="irregular-nouns__no-plural">
      <h2>{{ $t('pages.irregularNouns.n8NombresCarecenPlural') }}</h2>
      <p class="description">
        {{ $t('pages.irregularNouns.otrosMuchosNombresHay') }}
      </p>

      <CardGrid
        :items="singularOnlyNouns"
        class="examples-grid"
        key-prefix="singular"
        v-slot="{ item: example }"
      >
        <div class="example-card">
          <div class="example-form">
            <span class="label">{{ $t('pages.irregularNouns.formaPrincipalSingular') }}</span>
            <span class="value">
              <BengaWord :word="example.word" :meaning="$localized(example.meaning)" block />
            </span>
          </div>
        </div>
      </CardGrid>
    </section>

    <section class="irregular-nouns__notes">
      <h2>{{ $t('pages.irregularNouns.notasImportantes') }}</h2>
      <div class="notes-list">
        <div class="note-item">
          <h4>{{ $t('pages.irregularNouns.patronSemantico') }}</h4>
          <p>
            {{ $t('pages.irregularNouns.nombresSinSingularSuelen') }}
          </p>
        </div>
        <div class="note-item">
          <h4>{{ $t('pages.irregularNouns.usoContexto') }}</h4>
          <p>
            {{ $t('pages.irregularNouns.aunqueNombreCarezcaPlural') }}
          </p>
        </div>
        <div class="note-item">
          <h4>{{ $t('pages.irregularNouns.frecuencia') }}</h4>
          <p>
            {{ $t('pages.irregularNouns.nombresIrregularesSonRelativamente') }}
          </p>
        </div>
        <div class="note-item">
          <h4>{{ $t('pages.irregularNouns.aprendizaje') }}</h4>
          <p>
            {{ $t('pages.irregularNouns.esRecomendableMemorizarlosExplicitamente') }}
          </p>
        </div>
      </div>
    </section>

    <section class="irregular-nouns__practice">
      <h2>{{ $t('pages.irregularNouns.paraPracticar') }}</h2>
      <ol>
        <li>{{ $t('pages.irregularNouns.memorizaListaNombresCarecen') }}</li>
        <li>{{ $t('pages.irregularNouns.usalosFrasesConAdjetivos') }}</li>
        <li>{{ $t('pages.irregularNouns.prestaAtencionComoSe') }}</li>
        <li>{{ $t('pages.irregularNouns.creaListaPersonalOtros') }}</li>
      </ol>
    </section>

    <SectionNavFooter />
  </div>
</template>

<script>
import irregularNounsData from '@/data/chapter-2/irregular-nouns.json'
import CardGrid from '@/components/blocks/CardGrid.vue'
import SectionNavFooter from '@/components/blocks/SectionNavFooter.vue'
import BengaWord from '@/components/content/BengaWord.vue'

export default {
  name: 'IrregularNouns',
  components: { CardGrid, BengaWord, SectionNavFooter },
  data() {
    // Words and texts of this page: @/data/chapter-2/irregular-nouns.json
    return { ...irregularNounsData }
  },
  created() {
    document.title = `${this.$t('pages.irregularNouns.pageTitle')} | Portal Benga`
  }
}
</script>

<style scoped lang="scss">
@use 'sass:color';
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.irregular-nouns {
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

    .description {
      color: $color-text-secondary;
      font-style: italic;
      margin-bottom: $spacing-lg;
    }
  }

  .examples-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: $spacing-md;

    .example-card {
      background: white;
      border: 2px solid #e0e0e0;
      border-radius: $border-radius;
      padding: $spacing-lg;
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
      }

      .example-form {
        display: flex;
        flex-direction: column;
        gap: $spacing-sm;
        margin-bottom: $spacing-md;

        .label {
          font-size: 0.85rem;
          color: $color-text-muted;
          font-weight: bold;
        }

        .value {
          font-size: 1.2rem;
          font-family: $font-mono;
          color: $color-primary;
          font-weight: bold;
        }
      }

      .example-meaning {
        padding-top: $spacing-md;
        border-top: 1px solid #f0f0f0;
        color: $color-text-primary;
      }
    }
  }

  &__transcription {
    background: #fffde7;
    border-left: 4px solid $color-accent;
    border-radius: $border-radius;
    padding: $spacing-lg;

    h2 {
      color: $color-text-secondary;
      border-bottom-color: $color-accent;
    }

    .note-text {
      margin: 0;
      color: $color-text-secondary;
      line-height: 1.6;
    }
  }

  &__notes {
    .notes-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: $spacing-lg;

      .note-item {
        background: linear-gradient(135deg, #fce4ec 0%, #f3e5f5 100%);
        padding: $spacing-lg;
        border-radius: $border-radius;
        border-left: 4px solid #8e44ad;

        h4 {
          margin: 0 0 $spacing-sm 0;
          color: #8e44ad;
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
  }
}
</style>
