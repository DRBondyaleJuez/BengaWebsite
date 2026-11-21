<template>
  <div class="about-author">
    <!-- Header -->
    <header class="about-author__header">
      <div class="about-author__background">
        <div class="about-author__overlay"></div>
      </div>
      <div class="about-author__container">
        <h1 class="about-author__title">{{ authorData.author.name }}</h1>
        <p class="about-author__subtitle">{{ $t('about.title') }}</p>
      </div>
    </header>

    <!-- Main Content -->
    <div class="about-author__container">
      <!-- Biography Section -->
      <section class="about-author__section">
        <div class="about-author__section-content">
          <div class="about-author__portrait-container">
            <img
              src="@/assets/images/salvado-y-cos-portrait.png"
              :alt="$t('pages.about.retratoFranciscoSalvadoCos')"
              class="about-author__portrait"
            />
            <div class="about-author__portrait-info">
              <p class="about-author__passion">{{ authorData.author.name }}</p>
              <p class="about-author__dates">{{ $localized(authorData.author.birth) }}</p>
              <p class="about-author__role">{{ $localized(authorData.author.profession) }}</p>
            </div>
          </div>

          <div class="about-author__biography">
            <h2>{{ $t('about.biographical') }}</h2>
            <p class="about-author__bio-text">
              {{ $localized(authorData.author.biography) }}
            </p>
          </div>
        </div>
      </section>

      <!-- Publication Details -->
      <section class="about-author__section about-author__publication-section">
        <h2>{{ $t('about.masterwork') }}</h2>

        <div class="about-author__publication-details">
          <div class="about-author__detail-card">
            <h3>{{ $t('about.workTitle') }}</h3>
            <p class="about-author__detail-text">
              {{ authorData.author.workTitle }}
            </p>
            <p class="about-author__detail-subtitle">
              {{ authorData.author.subtitle }}
            </p>
          </div>

          <div class="about-author__detail-grid">
            <div class="about-author__detail-card">
              <h4>{{ $t('about.publicationYear') }}</h4>
              <p class="about-author__detail-value">{{ authorData.author.publicationYear }}</p>
            </div>

            <div class="about-author__detail-card">
              <h4>{{ $t('about.publisher') }}</h4>
              <p class="about-author__detail-value">{{ authorData.author.publisher }}</p>
            </div>

            <div class="about-author__detail-card">
              <h4>{{ $t('about.location') }}</h4>
              <p class="about-author__detail-value">{{ authorData.author.publicationPlace }}</p>
            </div>

            <div class="about-author__detail-card">
              <h4>{{ $t('about.pagination') }}</h4>
              <p class="about-author__detail-value">~{{ authorData.author.pages }}pp</p>
            </div>
          </div>
        </div>

        <!-- Book Description -->
        <div class="about-author__book-description">
          <p>
            {{ $t('pages.about.estaObraRepresentaPrimer') }}
          </p>
          <ul>
            <li v-html="$t('pages.about.alfabetoSonidosExplicacionDetallada')"></li>
            <li v-html="$t('pages.about.vocalesDiptongosAnalisisFonetico')"></li>
            <li v-html="$t('pages.about.consonantesDescripcionConsonantesSimples')"></li>
            <li v-html="$t('pages.about.nombresSustantivosSistemaClasificacion')"></li>
            <li v-html="$t('pages.about.adjetivosAdjetivosVariablesE')"></li>
            <li v-html="$t('pages.about.ejemplosPracticosCientosPalabras')"></li>
          </ul>
        </div>
      </section>

      <!-- Historical Context -->
      <section class="about-author__section">
        <h2>{{ $t('about.historicalContext') }}</h2>

        <div class="about-author__context-cards">
          <div class="about-author__context-item">
            <h3>🌍 {{ $t('about.colonialLinguistics') }}</h3>
            <p>
              {{ $t('pages.about.sigloXixEstudioLenguas') }}
            </p>
          </div>

          <div class="about-author__context-item">
            <h3>📚 {{ $t('about.linguisticValue') }}</h3>
            <p>
              {{ $t('pages.about.comoPrimerasDescripcionesSistematicas') }}
            </p>
          </div>

          <div class="about-author__context-item">
            <h3>🙏 {{ $t('about.missionaryWork') }}</h3>
            <p>
              {{ $t('pages.about.comoMisioneroSalvadoCos') }}
            </p>
          </div>

          <div class="about-author__context-item">
            <h3>🔍 {{ $t('about.legacy') }}</h3>
            <p>
              {{ $t('pages.about.obraSalvadoCosSigue') }}
            </p>
          </div>
        </div>
      </section>

      <!-- About This Portal -->
      <section class="about-author__section about-author__portal-section">
        <h2>{{ $t('about.aboutPortal') }}</h2>
        <div class="about-author__portal-content">
          <p>
            {{ $t('pages.about.estePortalDigitalRepresenta') }}
          </p>
          <ul>
            <li>{{ $t('pages.about.preservarConocimientoLinguisticoHistorico') }}</li>
            <li>{{ $t('pages.about.facilitarAccesoEstudiantesLenguas') }}</li>
            <li>{{ $t('pages.about.apoyarHablantesNativosBenga') }}</li>
            <li>{{ $t('pages.about.contribuirDocumentacionLenguasPeligro') }}</li>
            <li>
              {{ $t('pages.about.demostrarValorFuentesHistoricas') }}
            </li>
          </ul>

          <div class="about-author__download-box">
            <h3>{{ $t('about.originalWork') }}</h3>
            <p>
              {{ $t('pages.about.paraComplementarTuAprendizaje') }}
            </p>
            <a :href="bookPdfUrl" class="about-author__download-button" download>
              📄 {{ $t('nav.download') }}
            </a>
          </div>
        </div>
      </section>

      <!-- Resources -->
      <section class="about-author__section">
        <h2>{{ $t('about.furtherReading') }}</h2>

        <div class="about-author__resources">
          <div class="about-author__resource-card">
            <h3>{{ $t('about.languageFamily') }}</h3>
            <p>
              {{ $t('pages.about.bengaPerteneceFamiliaLenguas') }}
            </p>
            <a
              href="https://en.wikipedia.org/wiki/Ndowe_languages"
              target="_blank"
              class="about-author__resource-link"
            >
              {{ $t('pages.about.leerWikipedia') }}
            </a>
          </div>

          <div class="about-author__resource-card">
            <h3>{{ $t('about.livingDictionary') }}</h3>
            <p>
              {{ $t('pages.about.livingDictionaryEsRecurso') }}
            </p>
            <a
              :href="livingDictionaryHome"
              target="_blank"
              rel="noopener noreferrer"
              class="about-author__resource-link"
            >
              {{ $t('pages.about.visitarLivingDictionary') }}
            </a>
          </div>

          <div class="about-author__resource-card">
            <h3>{{ $t('about.sil') }}</h3>
            <p>
              {{ $t('pages.about.silInstitucionLinguisticaVerano') }}
            </p>
            <a href="https://www.sil.org/" target="_blank" class="about-author__resource-link">
              {{ $t('pages.about.visitarSil') }}
            </a>
          </div>

          <div class="about-author__resource-card">
            <h3>{{ $t('about.guineaInfo') }}</h3>
            <p>
              {{ $t('pages.about.informacionSobreGeografiaCultura') }}
            </p>
            <a
              href="https://en.wikipedia.org/wiki/Equatorial_Guinea"
              target="_blank"
              class="about-author__resource-link"
            >
              {{ $t('pages.about.leerWikipedia') }}
            </a>
          </div>
        </div>
      </section>
    </div>

    <!-- CTA Footer -->
    <section class="about-author__cta-footer">
      <h2>{{ $t('home.readyToLearn') }}</h2>
      <router-link to="/capitulo-1" class="about-author__cta-button">
        {{ $t('home.startLearning') }} →
      </router-link>
    </section>
  </div>
</template>

<script>
import authorData from '@/data/author-info.json'
import { BOOK_PDF_URL, LIVING_DICTIONARY_HOME } from '@/config/external'

export default {
  name: 'AboutAuthor',
  data() {
    return {
      authorData,
      bookPdfUrl: BOOK_PDF_URL,
      livingDictionaryHome: LIVING_DICTIONARY_HOME
    }
  },
  created() {
    document.title = this.$t('pages.about.pageTitle', { title: this.$t('about.title') })
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.about-author {
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
    background: linear-gradient(135deg, $color-primary, $color-secondary);
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

  &__section-content {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: $spacing-xl;
    align-items: start;

    @include respond-below('md') {
      grid-template-columns: 1fr;
    }
  }

  &__portrait-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-lg;
  }

  &__portrait {
    width: 100%;
    max-width: 280px;
    border-radius: 12px;
    border: 4px solid $color-primary;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  &__portrait-info {
    text-align: center;
    padding: $spacing-lg;
    background: $color-surface-alt;
    border-radius: 8px;
    width: 100%;
  }

  &__passion,
  &__dates,
  &__role {
    margin: 0;
    @include body-text;
  }

  &__passion {
    font-weight: $font-weight-bold;
    font-size: $font-size-lg;
    color: $color-primary;
  }

  &__dates {
    font-size: $font-size-sm;
    color: $color-text-secondary;
  }

  &__role {
    font-size: $font-size-sm;
    color: $color-text-muted;
    font-style: italic;
  }

  &__biography h2 {
    font-size: $font-size-2xl;
    margin-bottom: $spacing-lg;
  }

  &__bio-text {
    @include body-text;
    font-size: $font-size-base;
    line-height: $line-height-loose;
    margin-bottom: 0;
  }

  &__publication-section {
    background: $color-surface-alt;
    padding: $spacing-xl * 2;
    border-radius: 12px;
    margin: 0;
  }

  &__publication-details {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
    margin-bottom: $spacing-xl;
  }

  &__detail-card {
    padding: $spacing-lg;
    background: $color-surface;
    border-radius: 8px;
    border-left: 4px solid $color-primary;

    h3 {
      @include heading-style;
      font-size: $font-size-lg;
      margin: 0 0 $spacing-md 0;
      color: $color-primary;
    }

    h4 {
      @include heading-style;
      font-size: $font-size-base;
      margin: 0 0 $spacing-sm 0;
      color: $color-primary;
    }
  }

  &__detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: $spacing-lg;
  }

  &__detail-text,
  &__detail-value,
  &__detail-subtitle {
    @include body-text;
    margin: 0;
    font-size: $font-size-sm;
  }

  &__detail-value {
    font-weight: $font-weight-bold;
    font-size: $font-size-lg;
    color: $color-secondary;
  }

  &__detail-subtitle {
    font-style: italic;
    color: $color-text-secondary;
    margin-top: $spacing-sm;
  }

  &__book-description {
    padding: $spacing-lg;
    background: $color-surface;
    border-left: 4px solid $color-accent;
    border-radius: 8px;
    margin-top: $spacing-xl;

    p {
      @include body-text;
      margin-bottom: $spacing-lg;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        @include body-text;
        font-size: $font-size-sm;
        padding: $spacing-sm 0;
        line-height: $line-height-loose;

        :deep(strong) {
          color: $color-primary;
        }
      }
    }
  }

  &__context-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: $spacing-lg;
  }

  &__context-item {
    padding: $spacing-lg;
    background: $color-surface-alt;
    border-radius: 8px;
    border-top: 4px solid $color-secondary;

    h3 {
      @include heading-style;
      font-size: $font-size-lg;
      margin: 0 0 $spacing-md 0;
      color: $color-secondary;
    }

    p {
      @include body-text;
      font-size: $font-size-sm;
      margin: 0;
      line-height: $line-height-loose;
    }
  }

  &__portal-section {
    background: linear-gradient(135deg, rgba($color-primary, 0.05), rgba($color-secondary, 0.05));
  }

  &__portal-content {
    p {
      @include body-text;
      margin-bottom: $spacing-lg;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: $spacing-lg 0;

      li {
        @include body-text;
        font-size: $font-size-base;
        padding: $spacing-sm 0;
        padding-left: $spacing-lg;
      }
    }
  }

  &__download-box {
    padding: $spacing-xl;
    background: $color-accent;
    border-radius: 12px;
    color: $color-primary;
    margin: $spacing-xl 0;

    h3 {
      @include heading-style;
      font-size: $font-size-lg;
      margin: 0 0 $spacing-md 0;
      color: $color-primary;
    }

    p {
      @include body-text;
      margin-bottom: $spacing-lg;
      color: $color-primary;
    }
  }

  &__download-button {
    display: inline-block;
    padding: $spacing-md $spacing-lg;
    background: $color-primary;
    color: $color-text-inverse;
    text-decoration: none;
    border-radius: 6px;
    font-weight: $font-weight-bold;
    transition: all $transition-base;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba($color-primary, 0.3);
    }
  }

  &__resources {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: $spacing-lg;
  }

  &__resource-card {
    padding: $spacing-lg;
    background: $color-surface-alt;
    border-radius: 8px;
    border-left: 4px solid $color-benga-word;

    h3 {
      @include heading-style;
      font-size: $font-size-lg;
      margin: 0 0 $spacing-md 0;
      color: $color-benga-word;
    }

    p {
      @include body-text;
      font-size: $font-size-sm;
      margin-bottom: $spacing-md;
      line-height: $line-height-loose;
    }
  }

  &__resource-link {
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

  &__cta-footer {
    padding: $spacing-xl * 2 0;
    background: linear-gradient(135deg, $color-primary, $color-secondary);
    color: $color-text-inverse;
    text-align: center;

    h2 {
      font-family: $font-family-heading;
      font-size: $font-size-3xl;
      margin-bottom: $spacing-xl;
      font-weight: $font-weight-bold;
    }
  }

  &__cta-button {
    display: inline-block;
    padding: $spacing-lg $spacing-xl;
    background: $color-accent;
    color: $color-primary;
    text-decoration: none;
    border-radius: 8px;
    font-weight: $font-weight-bold;
    transition: all $transition-base;

    &:hover {
      background: $color-accent-light;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
  }
}
</style>
