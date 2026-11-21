<template>
  <div class="resources">
    <!-- Header -->
    <header class="resources__header">
      <div class="resources__background">
        <div class="resources__overlay"></div>
      </div>
      <div class="resources__container">
        <h1 class="resources__title">{{ $t('nav.resources') }}</h1>
        <p class="resources__subtitle">
          {{ $t('resources.subtitle') }}
        </p>
      </div>
    </header>

    <!-- Main Content -->
    <div class="resources__container">
      <!-- Primary Sources -->
      <section class="resources__section">
        <h2>{{ $t('resources.primarySources') }}</h2>

        <div class="resources__cards-grid">
          <div class="resources__card resources__card--primary">
            <div class="resources__card-icon">📄</div>
            <h3>{{ $t('about.masterwork') }}</h3>
            <p>
              {{ $t('pages.resources.obraCompleta1891Formato') }}
            </p>
            <a :href="bookPdfUrl" class="resources__button" download>
              {{ $t('pages.resources.descargarPdf') }}
            </a>
          </div>

          <div class="resources__card resources__card--primary">
            <div class="resources__card-icon">🎧</div>
            <h3>{{ $t('resources.audioFiles') }}</h3>
            <p>
              {{ $t('pages.resources.pronunciacionesPalabrasBengaRecopiladas') }}
            </p>
            <p class="resources__coming-soon">{{ $t('pages.resources.desarrollo') }}</p>
          </div>
        </div>
      </section>

      <!-- Learning Tools -->
      <section class="resources__section">
        <h2>{{ $t('resources.learningTools') }}</h2>

        <div class="resources__cards-grid">
          <div class="resources__card">
            <div class="resources__card-icon">📖</div>
            <h3>{{ $t('pages.resources.livingDictionary') }}</h3>
            <p>
              {{ $t('pages.resources.diccionarioComunitarioDocumentaBenga') }}
            </p>
            <a
              :href="livingDictionaryHome"
              target="_blank"
              rel="noopener noreferrer"
              class="resources__button resources__button--external"
            >
              {{ $t('pages.resources.visitarLivingDictionary') }}
            </a>
          </div>

          <div class="resources__card">
            <div class="resources__card-icon">🔍</div>
            <h3>{{ $t('pages.resources.silInternational') }}</h3>
            <p>
              {{ $t('pages.resources.institucionLinguisticaVeranoTrabaja') }}
            </p>
            <a
              href="https://www.sil.org/"
              target="_blank"
              rel="noopener noreferrer"
              class="resources__button resources__button--external"
            >
              {{ $t('pages.resources.visitarSil') }}
            </a>
          </div>

          <div class="resources__card">
            <div class="resources__card-icon">📚</div>
            <h3>{{ $t('pages.resources.wikipediaNdoweLanguages') }}</h3>
            <p>
              {{ $t('pages.resources.articuloInformativoSobreFamilia') }}
            </p>
            <a
              href="https://en.wikipedia.org/wiki/Ndowe_languages"
              target="_blank"
              rel="noopener noreferrer"
              class="resources__button resources__button--external"
            >
              {{ $t('pages.resources.leerWikipedia') }}
            </a>
          </div>

          <div class="resources__card">
            <div class="resources__card-icon">🗺️</div>
            <h3>{{ $t('pages.resources.wikimediaCommons') }}</h3>
            <p>
              {{ $t('pages.resources.repositorioImagenesMapasDocumentos') }}
            </p>
            <a
              href="https://commons.wikimedia.org/"
              target="_blank"
              rel="noopener noreferrer"
              class="resources__button resources__button--external"
            >
              {{ $t('pages.resources.visitarWikimediaCommons') }}
            </a>
          </div>
        </div>
      </section>

      <!-- Reference Materials -->
      <section class="resources__section">
        <h2>{{ $t('resources.references') }}</h2>

        <div class="resources__reference-list">
          <div class="resources__reference-item">
            <h3>{{ $t('pages.resources.geografiaGuineaEcuatorial') }}</h3>
            <p>{{ $t('pages.resources.informacionSobreIslaCorisco') }}</p>
            <a
              href="https://en.wikipedia.org/wiki/Equatorial_Guinea"
              target="_blank"
              rel="noopener noreferrer"
              class="resources__link"
            >
              {{ $t('pages.resources.leerMas') }}
            </a>
          </div>

          <div class="resources__reference-item">
            <h3>{{ $t('pages.resources.culturaNdowe') }}</h3>
            <p>
              {{ $t('pages.resources.informacionSobrePuebloNdowe') }}
            </p>
            <a
              href="https://en.wikipedia.org/wiki/Ndowe_people"
              target="_blank"
              rel="noopener noreferrer"
              class="resources__link"
            >
              {{ $t('pages.resources.leerMas') }}
            </a>
          </div>

          <div class="resources__reference-item">
            <h3>{{ $t('pages.resources.historiaGuineaEcuatorial') }}</h3>
            <p>
              {{ $t('pages.resources.contextoHistoricoAyudaEntender') }}
            </p>
            <a
              href="https://en.wikipedia.org/wiki/History_of_Equatorial_Guinea"
              target="_blank"
              rel="noopener noreferrer"
              class="resources__link"
            >
              {{ $t('pages.resources.leerMas') }}
            </a>
          </div>

          <div class="resources__reference-item">
            <h3>{{ $t('pages.resources.investigacionLinguisticaContemporanea') }}</h3>
            <p>
              {{ $t('pages.resources.estudiosRecientesSobreDocumentacion') }}
            </p>
            <a
              href="https://www.linguisticsociety.org/"
              target="_blank"
              rel="noopener noreferrer"
              class="resources__link"
            >
              {{ $t('pages.resources.linguisticSocietyOfAmerica') }}
            </a>
          </div>
        </div>
      </section>

      <!-- Study Tips -->
      <section class="resources__section resources__tips-section">
        <h2>{{ $t('resources.studyTips') }}</h2>

        <div class="resources__tips-grid">
          <div class="resources__tip-card">
            <span class="resources__tip-number">1</span>
            <h3>{{ $t('pages.resources.empiezaPorAlfabeto') }}</h3>
            <p>
              {{ $t('pages.resources.familiarizateConSonidosBasicos') }}
            </p>
          </div>

          <div class="resources__tip-card">
            <span class="resources__tip-number">2</span>
            <h3>{{ $t('pages.resources.escuchaPronunciaciones') }}</h3>
            <p>
              {{ $t('pages.resources.usaArchivosAudioDisponibles') }}
            </p>
          </div>

          <div class="resources__tip-card">
            <span class="resources__tip-number">3</span>
            <h3>{{ $t('pages.resources.aprendeCognados') }}</h3>
            <p>
              {{ $t('pages.resources.identificaPalabrasSeParecen') }}
            </p>
          </div>

          <div class="resources__tip-card">
            <span class="resources__tip-number">4</span>
            <h3>{{ $t('pages.resources.memorizaClasesNominales') }}</h3>
            <p>
              {{ $t('pages.resources.sistemaSieteClasesNominales') }}
            </p>
          </div>

          <div class="resources__tip-card">
            <span class="resources__tip-number">5</span>
            <h3>{{ $t('pages.resources.practicaConEjemplos') }}</h3>
            <p>
              {{ $t('pages.resources.portalProporcionaCientosEjemplos') }}
            </p>
          </div>

          <div class="resources__tip-card">
            <span class="resources__tip-number">6</span>
            <h3>{{ $t('pages.resources.conectaConComunidad') }}</h3>
            <p>
              {{ $t('pages.resources.siEsPosibleConecta') }}
            </p>
          </div>
        </div>
      </section>

      <!-- Community -->
      <section class="resources__section">
        <h2>{{ $t('footer.community') }}</h2>

        <div class="resources__community-content">
          <p>
            {{ $t('pages.resources.aprendizajeBengaEsMejor') }}
          </p>

          <ul>
            <li v-html="$t('pages.resources.livingDictionaryContribuyeCon')"></li>
            <li v-html="$t('pages.resources.silCommunitiesParticipaIniciativas')"></li>
            <li v-html="$t('pages.resources.comunidadNdoweBuscaGrupos')"></li>
            <li v-html="$t('pages.resources.universidadesAlgunosProgramasLinguistica')"></li>
          </ul>

          <div class="resources__contribute-box">
            <h3>{{ $t('footer.contribute') }}</h3>
            <p>
              {{ $t('pages.resources.tienesRecursosAgregarCorrecciones') }}
            </p>
            <router-link to="/" class="resources__contribute-button">
              {{ $t('pages.resources.conectarConNosotros') }}
            </router-link>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { BOOK_PDF_URL, LIVING_DICTIONARY_HOME } from '@/config/external'

export default {
  name: 'ResourcesPage',
  data() {
    return {
      bookPdfUrl: BOOK_PDF_URL,
      livingDictionaryHome: LIVING_DICTIONARY_HOME
    }
  },
  created() {
    document.title = this.$t('pages.resources.pageTitle', { resources: this.$t('nav.resources') })
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.resources {
  &__header {
    position: relative;
    padding: $spacing-xl * 2 0;
    color: $color-text-inverse;
    text-align: center;
    overflow: hidden;
    margin-bottom: $spacing-xl * 2;

    @include respond-below('md') {
      padding: $spacing-xl 0;
    }
  }

  &__background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, $color-secondary, $color-accent);
    z-index: 1;
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.2);
  }

  &__container {
    position: relative;
    z-index: 2;
    max-width: $max-page-width;
    margin: 0 auto;
    padding: 0 $spacing-lg;
  }

  &__title {
    font-family: $font-family-heading;
    font-size: $font-size-4xl;
    font-weight: $font-weight-bold;
    margin-bottom: $spacing-sm;

    @include respond-below('md') {
      font-size: $font-size-2xl;
    }
  }

  &__subtitle {
    font-family: $font-family-base;
    font-size: $font-size-xl;
    font-weight: $font-weight-semibold;

    @include respond-below('md') {
      font-size: $font-size-lg;
    }
  }

  &__section {
    padding: $spacing-xl * 2 0;
    border-bottom: 1px solid $border-color;

    h2 {
      @include heading-style;
      font-size: $font-size-3xl;
      margin-bottom: $spacing-xl;
      color: $color-primary;
    }

    &:last-of-type {
      border-bottom: none;
    }
  }

  &__cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: $spacing-lg;

    @include respond-below('sm') {
      grid-template-columns: 1fr;
    }
  }

  &__card {
    padding: $spacing-xl;
    background: $color-surface-alt;
    border-radius: 12px;
    border: 2px solid $border-color;
    transition: all $transition-base;
    display: flex;
    flex-direction: column;
    gap: $spacing-md;

    &--primary {
      border-color: $color-primary;
      border-width: 2px;
    }

    &:hover {
      border-color: $color-primary;
      box-shadow: 0 8px 16px rgba($color-primary, 0.15);
      transform: translateY(-4px);
    }

    h3 {
      @include heading-style;
      font-size: $font-size-lg;
      margin: 0;
      color: $color-primary;
    }

    p {
      @include body-text;
      font-size: $font-size-sm;
      margin: 0;
      line-height: $line-height-loose;
    }
  }

  &__card-icon {
    font-size: $font-size-3xl;
  }

  &__coming-soon {
    color: $color-text-muted;
    font-style: italic;
  }

  &__button {
    display: inline-block;
    padding: $spacing-md $spacing-lg;
    background: $color-primary;
    color: $color-text-inverse;
    text-decoration: none;
    border-radius: 6px;
    font-weight: $font-weight-semibold;
    text-align: center;
    transition: all $transition-base;
    align-self: flex-start;

    &:hover {
      background: $color-primary-dark;
      transform: translateX(2px);
    }

    &--external {
      background: $color-secondary;

      &:hover {
        background: $color-secondary-dark;
      }
    }
  }

  &__reference-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: $spacing-lg;
  }

  &__reference-item {
    padding: $spacing-lg;
    background: $color-surface-alt;
    border-radius: 8px;
    border-left: 4px solid $color-secondary;

    h3 {
      @include heading-style;
      font-size: $font-size-lg;
      margin: 0 0 $spacing-md 0;
      color: $color-secondary;
    }

    p {
      @include body-text;
      font-size: $font-size-sm;
      margin-bottom: $spacing-md;
      line-height: $line-height-loose;
    }
  }

  &__link {
    display: inline-block;
    color: $color-primary;
    text-decoration: none;
    font-weight: $font-weight-semibold;
    transition: all $transition-base;

    &:hover {
      color: $color-secondary;
      transform: translateX(4px);
    }
  }

  &__tips-section {
    background: linear-gradient(135deg, rgba($color-accent, 0.08), rgba($color-primary, 0.08));
    padding: $spacing-xl * 2;
    border-radius: 12px;
    margin: 0;
  }

  &__tips-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: $spacing-lg;
  }

  &__tip-card {
    padding: $spacing-lg;
    background: $color-surface;
    border-radius: 8px;
    border: 2px solid $color-accent;
    position: relative;

    h3 {
      @include heading-style;
      font-size: $font-size-lg;
      margin: $spacing-lg 0 $spacing-md 0;
      color: $color-primary;
    }

    p {
      @include body-text;
      font-size: $font-size-sm;
      margin: 0;
      line-height: $line-height-loose;
    }
  }

  &__tip-number {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    background: $color-accent;
    color: $color-primary;
    border-radius: 50%;
    font-weight: $font-weight-bold;
    font-size: $font-size-lg;
  }

  &__community-content {
    p {
      @include body-text;
      font-size: $font-size-base;
      margin-bottom: $spacing-lg;
      line-height: $line-height-loose;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: $spacing-lg 0;

      li {
        @include body-text;
        font-size: $font-size-sm;
        padding: $spacing-sm 0;
        padding-left: $spacing-lg;
        line-height: $line-height-loose;

        :deep(strong) {
          color: $color-primary;
        }
      }
    }
  }

  &__contribute-box {
    margin-top: $spacing-xl;
    padding: $spacing-xl;
    background: $color-accent;
    border-radius: 8px;
    color: $color-primary;

    h3 {
      @include heading-style;
      font-size: $font-size-lg;
      margin: 0 0 $spacing-md 0;
      color: $color-primary;
    }

    p {
      color: $color-primary;
      margin-bottom: $spacing-lg;
    }
  }

  &__contribute-button {
    display: inline-block;
    padding: $spacing-md $spacing-lg;
    background: $color-primary;
    color: $color-text-inverse;
    text-decoration: none;
    border-radius: 6px;
    font-weight: $font-weight-semibold;
    transition: all $transition-base;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba($color-primary, 0.3);
    }
  }
}
</style>
