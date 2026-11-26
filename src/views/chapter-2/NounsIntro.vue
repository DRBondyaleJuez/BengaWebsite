<template>
  <div class="nouns-intro">
    <div class="nouns-intro__header">
      <h1>{{ $t('pages.nounsIntro.introduccionClasificacionNominal') }}</h1>
      <p>{{ $t('pages.nounsIntro.sistemaSieteClasesBenga') }}</p>
    </div>

    <section class="nouns-intro__overview">
      <h2>{{ $t('pages.nounsIntro.esClasificacionNominal') }}</h2>
      <p>
        {{ $t('pages.nounsIntro.clasificacionNombresDependeModo') }}
      </p>
    </section>

    <section class="nouns-intro__principles">
      <h2>{{ $t('pages.nounsIntro.tresPrincipiosClave') }}</h2>
      <div class="principles-grid">
        <div class="principle-card">
          <div class="principle-number">1</div>
          <h3>{{ $t('pages.nounsIntro.pluralesAgrupados') }}</h3>
          <p>
            {{ $t('pages.nounsIntro.nombresFormanSuPlural') }}
          </p>
        </div>
        <div class="principle-card">
          <div class="principle-number">2</div>
          <h3>{{ $t('pages.nounsIntro.cambiosRadicales') }}</h3>
          <p>
            {{ $t('pages.nounsIntro.contrasteConLenguasRomances') }}
          </p>
        </div>
        <div class="principle-card">
          <div class="principle-number">3</div>
          <h3>{{ $t('pages.nounsIntro.concordanciaRigurosa') }}</h3>
          <p>
            {{ $t('pages.nounsIntro.adjuntosAdjetivosPronombresPreposiciones') }}
          </p>
        </div>
      </div>
    </section>

    <section class="nouns-intro__complexity">
      <h2>{{ $t('pages.nounsIntro.simplificacionPedagogica') }}</h2>
      <p v-html="$t('pages.nounsIntro.datoHistoricoTreceDiferentes')"></p>
    </section>

    <section class="nouns-intro__classes">
      <h2>{{ $t('pages.nounsIntro.sieteClases') }}</h2>
      <div class="classes-table">
        <div class="class-row header">
          <div>{{ $t('pages.nounsIntro.clase') }}</div>
          <div>{{ $t('pages.nounsIntro.singular') }}</div>
          <div>{{ $t('pages.nounsIntro.plural') }}</div>
          <div>{{ $t('pages.nounsIntro.ejemplo') }}</div>
          <div>{{ $t('pages.nounsIntro.enlace') }}</div>
        </div>
        <router-link v-slot="{ navigate }" to="/capitulo-2/clase-1" custom>
          <div
            class="class-row"
            role="link"
            tabindex="0"
            @click="navigate"
            @keydown.enter="navigate"
          >
            <div><strong>1</strong></div>
            <div class="pattern">{{ $t('pages.nounsIntro.e') }}</div>
            <div class="pattern">be- / bi-</div>
            <div class="example">Epokolo → Bepokolo</div>
            <div>{{ $t('pages.nounsIntro.verClase') }}</div>
          </div>
        </router-link>
        <router-link v-slot="{ navigate }" to="/capitulo-2/clase-2" custom>
          <div
            class="class-row"
            role="link"
            tabindex="0"
            @click="navigate"
            @keydown.enter="navigate"
          >
            <div><strong>2</strong></div>
            <div class="pattern">i- / di-</div>
            <div class="pattern">ma-</div>
            <div class="example">Ibakē → Mabakē</div>
            <div>{{ $t('pages.nounsIntro.verClase') }}</div>
          </div>
        </router-link>
        <router-link v-slot="{ navigate }" to="/capitulo-2/clase-3" custom>
          <div
            class="class-row"
            role="link"
            tabindex="0"
            @click="navigate"
            @keydown.enter="navigate"
          >
            <div><strong>3</strong></div>
            <div class="pattern">u- / mū-</div>
            <div class="pattern">me / mi-</div>
            <div class="example">{{ $t('pages.nounsIntro.ubakiMebaki') }}</div>
            <div>{{ $t('pages.nounsIntro.verClase') }}</div>
          </div>
        </router-link>
        <router-link v-slot="{ navigate }" to="/capitulo-2/clase-4" custom>
          <div
            class="class-row"
            role="link"
            tabindex="0"
            @click="navigate"
            @keydown.enter="navigate"
          >
            <div><strong>4</strong></div>
            <div class="pattern">bo- / ba-</div>
            <div class="pattern">mi-</div>
            <div class="example">Bobako → Mibako</div>
            <div>{{ $t('pages.nounsIntro.verClase') }}</div>
          </div>
        </router-link>
        <router-link v-slot="{ navigate }" to="/capitulo-2/clase-5" custom>
          <div
            class="class-row"
            role="link"
            tabindex="0"
            @click="navigate"
            @keydown.enter="navigate"
          >
            <div><strong>5</strong></div>
            <div class="pattern">mo-</div>
            <div class="pattern">ba-</div>
            <div class="example">{{ $t('pages.nounsIntro.momoBamo') }}</div>
            <div>{{ $t('pages.nounsIntro.verClase') }}</div>
          </div>
        </router-link>
        <router-link v-slot="{ navigate }" to="/capitulo-2/clase-6" custom>
          <div
            class="class-row"
            role="link"
            tabindex="0"
            @click="navigate"
            @keydown.enter="navigate"
          >
            <div><strong>6</strong></div>
            <div class="pattern">v-</div>
            <div class="pattern">l-</div>
            <div class="example">Veya → Leya</div>
            <div>{{ $t('pages.nounsIntro.verClase') }}</div>
          </div>
        </router-link>
        <router-link v-slot="{ navigate }" to="/capitulo-2/clase-7" custom>
          <div
            class="class-row"
            role="link"
            tabindex="0"
            @click="navigate"
            @keydown.enter="navigate"
          >
            <div><strong>7</strong></div>
            <div class="pattern">{{ $t('pages.nounsIntro.invariable') }}</div>
            <div class="pattern">{{ $t('pages.nounsIntro.invariable') }}</div>
            <div class="example">{{ $t('pages.nounsIntro.falaFala') }}</div>
            <div>{{ $t('pages.nounsIntro.verClase') }}</div>
          </div>
        </router-link>
      </div>
    </section>

    <section class="nouns-intro__concordance">
      <h2>{{ $t('pages.nounsIntro.ejemploConcordancia') }}</h2>
      <p>
        {{ $t('pages.nounsIntro.concordanciaEsFundamentalBenga') }}
      </p>
      <div class="concordance-example">
        <div class="example-set">
          <h4>{{ $t('pages.nounsIntro.singular') }}</h4>
          <p class="bengatext"><span class="benga">Epokolo eyamu</span></p>
          <p class="translation">{{ $t('pages.nounsIntro.sombreroBueno') }}</p>
        </div>
        <div class="example-set">
          <h4>{{ $t('pages.nounsIntro.plural') }}</h4>
          <p class="bengatext"><span class="benga">Bepokolo beyamu</span></p>
          <p class="translation">{{ $t('pages.nounsIntro.sombrerosBuenos') }}</p>
        </div>
      </div>
      <p>
        {{ $t('pages.nounsIntro.estoSeraDesarrolladoMas') }}
      </p>
    </section>

    <section class="nouns-intro__practice">
      <h2>{{ $t('pages.nounsIntro.consejoPractico') }}</h2>
      <div class="practice-box">
        <p v-html="$t('pages.nounsIntro.memorizaPatronesInicialesPrimer')"></p>
        <p v-html="$t('pages.nounsIntro.agrupaPalabrasPorClase')"></p>
        <p v-html="$t('pages.nounsIntro.practicaConcordanciaNoAprendas')"></p>
      </div>
    </section>

    <section class="nouns-intro__cta">
      <h2>{{ $t('pages.nounsIntro.comienzaAhora') }}</h2>
      <p>
        {{ $t('pages.nounsIntro.estasListoParaExplorar') }}
      </p>
      <router-link to="/capitulo-2/clase-1" class="cta-button">
        {{ $t('pages.nounsIntro.irClase1') }}
      </router-link>
    </section>
    <SectionNavFooter />
  </div>
</template>

<script>
import SectionNavFooter from '@/components/blocks/SectionNavFooter.vue'
export default {
  name: 'NounsIntro',
  components: { SectionNavFooter },
  created() {
    document.title = `${this.$t('pages.nounsIntro.pageTitle')} | Portal Benga`
  }
}
</script>

<style scoped lang="scss">
@use 'sass:color';
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.nouns-intro {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--page-gutter, #{$spacing-lg});

  &__header {
    background: linear-gradient(135deg, #2d5a27 0%, #4a7c4e 100%);
    color: white;
    padding: 2.5rem $spacing-lg;
    border-radius: $border-radius;
    text-align: center;
    margin-bottom: $spacing-xl;

    h1 {
      margin: 0 0 $spacing-sm 0;
      font-size: 2.2rem;
    }

    p {
      margin: 0;
      font-size: 1.1rem;
      opacity: 0.95;
    }
  }

  section {
    margin-bottom: $spacing-xl;

    h2 {
      color: $color-primary;
      border-bottom: 2px solid $color-accent;
      padding-bottom: $spacing-md;
      margin-bottom: $spacing-lg;
    }
  }

  &__overview,
  &__complexity {
    background: $color-surface-light;
    padding: $spacing-lg;
    border-radius: $border-radius;
    border-left: 4px solid $color-accent;
  }

  &__principles {
    .principles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: $spacing-lg;

      .principle-card {
        background: white;
        padding: $spacing-lg;
        border-radius: $border-radius;
        border-top: 4px solid $color-primary;
        display: flex;
        flex-direction: column;
        gap: $spacing-md;

        .principle-number {
          background: $color-accent;
          color: white;
          font-size: 2rem;
          font-weight: bold;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        h3 {
          margin: 0;
          color: $color-primary;
        }

        p {
          margin: 0;
          color: $color-text-secondary;
        }
      }
    }
  }

  &__classes {
    .classes-table {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: $border-radius;
      overflow: hidden;

      .class-row {
        display: grid;
        grid-template-columns: 150px 100px 100px 1fr 100px;
        border-bottom: 1px solid #f0f0f0;
        padding: $spacing-md;
        align-items: center;
        transition: background 0.3s ease;
        cursor: pointer;

        &.header {
          background: $color-primary;
          color: white;
          font-weight: bold;
          cursor: default;
          text-align: center;
        }

        &:not(.header):hover {
          background: $color-surface-light;
        }

        .pattern {
          font-family: $font-mono;
          font-weight: bold;
          color: $color-primary;
          text-align: center;
        }

        .example {
          text-align: center;
        }

        div:first-child {
          text-align: left;
        }

        div:last-child {
          color: $color-accent;
          font-weight: bold;
          text-align: left;
        }
      }
    }
  }

  &__concordance {
    .concordance-example {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: $spacing-lg;

      .example-set {
        background: white;
        padding: $spacing-lg;
        border-radius: $border-radius;
        border: 1px solid #e0e0e0;
        text-align: center;

        h4 {
          margin: 0 0 $spacing-sm 0;
          color: $color-primary;
        }

        .bengatext {
          margin: $spacing-sm 0;
          font-size: 1.2rem;
          font-weight: bold;

          .benga {
            color: $color-primary;
            font-family: $font-mono;
          }
        }

        .translation {
          margin: 0;
          color: $color-text-secondary;
          font-style: italic;
        }
      }
    }
  }

  &__learning-path {
    .learning-steps {
      background: $color-surface-light;
      padding: $spacing-lg;
      border-radius: $border-radius;
      margin: 0;

      li {
        margin-bottom: $spacing-md;
        line-height: 1.6;
      }
    }
  }

  &__practice {
    .practice-box {
      background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
      padding: $spacing-lg;
      border-radius: $border-radius;
      border-left: 4px solid $color-primary;

      p {
        margin: 0 0 $spacing-md 0;

        &:last-child {
          margin: 0;
        }
      }
    }
  }

  &__cta {
    background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
    padding: $spacing-lg;
    border-radius: $border-radius;
    text-align: center;

    h2 {
      margin-top: 0;
      border: none;
      padding: 0;
      color: $color-secondary;
    }

    .cta-button {
      display: inline-block;
      background: $color-accent;
      color: white;
      padding: $spacing-md $spacing-lg;
      border-radius: $border-radius;
      text-decoration: none;
      font-weight: bold;
      transition: all 0.3s ease;

      &:hover {
        background: color.adjust($color-accent, $lightness: -10%);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }
    }
  }

  @include respond-below('md') {
    padding: var(--page-gutter, #{$spacing-md});

    &__classes .classes-table .class-row {
      grid-template-columns: 1fr 1fr 1fr;

      div:nth-child(4),
      div:nth-child(5) {
        display: none;
      }
    }
  }
}
</style>
