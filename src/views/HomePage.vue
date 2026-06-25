<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero__background">
        <div class="hero__overlay"></div>
        <img 
          src="@/assets/images/equatorial-guinea-map.png" 
          alt="Mapa de Guinea Ecuatorial" 
          class="hero__image"
        />
      </div>

      <div class="hero__container">
        <div class="hero__content">
          <h1 class="hero__title">
            {{ $t('home.welcome') }}
          </h1>
          <p class="hero__subtitle">
            {{ $t('app.subtitle') }}
          </p>
          <p class="hero__description">
            {{ $t('home.intro') }}
          </p>
          <router-link to="/capitulo-1" class="hero__cta">
            {{ $t('home.startLearning') }}
            <BaseIcon name="arrow" />
          </router-link>
        </div>
      </div>
    </section>

    <!-- Introduction Section -->
    <section class="home-page__intro-section">
      <div class="home-page__container">
        <h2>{{ $t('home.aboutBenga') || 'Sobre la Lengua Benga' }}</h2>

        <div class="home-page__intro-grid">
          <div class="home-page__intro-card">
            <div class="home-page__intro-icon">🗣️</div>
            <h3>{{ $t('home.languageFamily') || 'Familia Lingüística' }}</h3>
            <p>
              El Benga pertenece a la familia de lenguas Ndowe, habladas en Guinea Ecuatorial y regiones adyacentes. 
              Es una lengua rica en matices gramaticales y sonidos únicos.
            </p>
          </div>

          <div class="home-page__intro-card">
            <div class="home-page__intro-icon">🏝️</div>
            <h3>{{ $t('home.geography') || 'Ubicación Geográfica' }}</h3>
            <p>
              Hablada principalmente en la isla de Corisco, pueblos de su bahía e islas adyacentes en Guinea Ecuatorial.
              Esta región tiene una rica tradición cultural y lingüística.
            </p>
          </div>

          <div class="home-page__intro-card">
            <div class="home-page__intro-icon">📚</div>
            <h3>{{ $t('home.heritage') || 'Patrimonio Lingüístico' }}</h3>
            <p>
              El Benga representa parte importante del patrimonio lingüístico africano. Su preservación es esencial
              para mantener la diversidad cultural y el conocimiento ancestral.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- About the Grammar -->
    <section class="home-page__grammar-section">
      <div class="home-page__container">
        <div class="home-page__grammar-content">
          <div class="home-page__grammar-text">
            <h2>{{ $t('home.aboutGrammar') || 'Sobre Esta Gramática' }}</h2>
            <p>
              Este portal está basado en la obra seminal de Francisco Salvadó y Cos, publicada en 1891:
            </p>
            <blockquote class="home-page__quote">
              <p>
                "Colección de apuntes preliminares sobre la lengua Benga, o sea introducción a una gramática de este 
                idioma que se habla en la isla de Corisco, pueblos de su bahía e islas adyacentes"
              </p>
            </blockquote>
            <p>
              La obra original, publicada en Madrid por la Imprenta de A. Pérez Dubrull, representa el primer 
              esfuerzo sistemático de documentación de esta lengua. Hoy la presentamos en formato digital interactivo 
              para que estudiantes de lenguas africanas, investigadores y hablantes de Benga puedan acceder y 
              aprender de esta valiosa documentación histórica.
            </p>
          </div>

          <div class="home-page__grammar-image">
            <img 
              src="@/assets/images/salvado-y-cos-portrait.png" 
              alt="Francisco Salvadó y Cos - Retrato" 
              class="home-page__portrait"
            />
            <p class="home-page__image-caption">
              Francisco Salvadó y Cos (Siglo XIX)<br>
              Misionero y Lingüista
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Curriculum Overview -->
    <section class="home-page__curriculum-section">
      <div class="home-page__container">
        <h2>{{ $t('home.curriculum') || 'Estructura del Curso' }}</h2>

        <div class="home-page__chapters-preview">
          <div class="home-page__chapter-card">
            <h3>{{ $t('chapters.chapter1.title') }}</h3>
            <p>Fundamentos de la lengua Benga incluyendo alfabeto, vocales, diptongos, triptongos y consonantes.</p>
            <ul>
              <li>✓ Alfabeto y escritura</li>
              <li>✓ Sonidos vocales</li>
              <li>✓ Diptongos y triptongos</li>
              <li>✓ Consonantes y combinaciones</li>
            </ul>
            <router-link to="/capitulo-1" class="home-page__chapter-link">
              Ir a Capítulo 1 →
            </router-link>
          </div>

          <div class="home-page__chapter-card">
            <h3>{{ $t('chapters.chapter2.title') }}</h3>
            <p>Sistema de clasificación de nombres y sustantivos en Benga.</p>
            <ul>
              <li>✓ Introducción a los nombres</li>
              <li>✓ Siete clases nominales</li>
              <li>✓ Nombres irregulares</li>
              <li>✓ Nombres verbales</li>
            </ul>
            <button class="home-page__chapter-link home-page__chapter-link--disabled" disabled>
              Próximamente
            </button>
          </div>

          <div class="home-page__chapter-card">
            <h3>{{ $t('chapters.chapter3.title') }}</h3>
            <p>Adjetivos, modificadores y estructuras de concordancia.</p>
            <ul>
              <li>✓ Adjetivos variables</li>
              <li>✓ Adjetivos invariables</li>
              <li>✓ Concordancia nominal</li>
              <li>✓ Ejemplos en contexto</li>
            </ul>
            <button class="home-page__chapter-link home-page__chapter-link--disabled" disabled>
              Próximamente
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="home-page__features-section">
      <div class="home-page__container">
        <h2>{{ $t('home.features') || 'Características' }}</h2>

        <div class="home-page__features-grid">
          <div class="home-page__feature">
            <div class="home-page__feature-icon">🔊</div>
            <h4>{{ $t('home.audioSupport') || 'Pronunciación con Audio' }}</h4>
            <p>Aprende la pronunciación correcta con ejemplos de audio para cada palabra.</p>
          </div>

          <div class="home-page__feature">
            <div class="home-page__feature-icon">📖</div>
            <h4>{{ $t('home.liveDict') || 'Diccionario Vivo' }}</h4>
            <p>Acceso integrado al Living Dictionary para explorar palabras en contexto.</p>
          </div>

          <div class="home-page__feature">
            <div class="home-page__feature-icon">📱</div>
            <h4>{{ $t('home.responsive') || 'Diseño Responsivo' }}</h4>
            <p>Aprende en cualquier dispositivo: escritorio, tablet o móvil.</p>
          </div>

          <div class="home-page__feature">
            <div class="home-page__feature-icon">🌐</div>
            <h4>{{ $t('home.multiLanguage') || 'Multilingüe' }}</h4>
            <p>Disponible en español, con soporte para inglés y francés próximamente.</p>
          </div>

          <div class="home-page__feature">
            <div class="home-page__feature-icon">📚</div>
            <h4>{{ $t('home.systematiC') || 'Método Sistemático' }}</h4>
            <p>Basado en la gramática histórica rigurosa de Salvadó y Cos.</p>
          </div>

          <div class="home-page__feature">
            <div class="home-page__feature-icon">🤝</div>
            <h4>{{ $t('home.community') || 'Comunidad' }}</h4>
            <p>Conecta con otros estudiosos de la lengua Benga y la cultura Ndowe.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="home-page__cta-section">
      <div class="home-page__container">
        <h2>{{ $t('home.readyToLearn') || '¿Listo para Comenzar?' }}</h2>
        <p>{{ $t('home.ctaSubtitle') || 'Inicia tu viaje en el aprendizaje del idioma Benga hoy.' }}</p>

        <div class="home-page__cta-buttons">
          <router-link to="/capitulo-1" class="home-page__cta-button home-page__cta-button--primary">
            {{ $t('home.startLearning') }}
          </router-link>
          <router-link to="/sobre-el-autor" class="home-page__cta-button home-page__cta-button--secondary">
            {{ $t('nav.about') }}
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import BaseIcon from '@/components/common/BaseIcon.vue'

export default {
  name: 'HomePage',
  components: {
    BaseIcon
  },
  created() {
    document.title = 'Portal de Aprendizaje Benga - ' + this.$t('home.welcome')
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/mixins';

// Hero Section
.hero {
  position: relative;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: $spacing-xl * 2;

  @include respond-below('md') {
    height: 400px;
  }

  @include respond-below('sm') {
    height: 300px;
  }
}

.hero__background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.hero__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(45, 90, 39, 0.8), rgba(139, 69, 19, 0.6));
  z-index: 2;
}

.hero__container {
  position: relative;
  z-index: 3;
  max-width: $max-page-width;
  margin: 0 auto;
  padding: 0 $spacing-lg;
  text-align: center;
}

.hero__content {
  color: $color-text-inverse;
}

.hero__title {
  font-family: $font-family-heading;
  font-size: $font-size-4xl;
  font-weight: $font-weight-bold;
  margin-bottom: $spacing-md;
  line-height: $line-height-tight;

  @include respond-below('md') {
    font-size: $font-size-3xl;
  }

  @include respond-below('sm') {
    font-size: $font-size-2xl;
  }
}

.hero__subtitle {
  font-family: $font-family-base;
  font-size: $font-size-2xl;
  margin-bottom: $spacing-lg;
  font-weight: $font-weight-semibold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);

  @include respond-below('md') {
    font-size: $font-size-xl;
  }
}

.hero__description {
  font-family: $font-family-base;
  font-size: $font-size-lg;
  margin-bottom: $spacing-xl;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: $line-height-loose;

  @include respond-below('md') {
    font-size: $font-size-base;
  }
}

.hero__cta {
  display: inline-flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-lg $spacing-xl;
  background: $color-accent;
  color: $color-primary;
  text-decoration: none;
  border-radius: 8px;
  font-weight: $font-weight-bold;
  font-size: $font-size-lg;
  transition: all $transition-base;
  border: 2px solid $color-accent;

  &:hover {
    background: $color-accent-light;
    border-color: $color-accent-light;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  }

  @include respond-below('sm') {
    padding: $spacing-md $spacing-lg;
    font-size: $font-size-base;
  }
}

// Main Page Content
.home-page {
  &__container {
    max-width: $max-page-width;
    margin: 0 auto;
    padding: 0 $spacing-lg;
  }

  &__intro-section {
    padding: $spacing-xl * 2 0;
    background: $color-surface-alt;

    h2 {
      @include heading-style;
      font-size: $font-size-3xl;
      text-align: center;
      margin-bottom: $spacing-xl;
    }
  }

  &__intro-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: $spacing-lg;

    @include respond-below('sm') {
      grid-template-columns: 1fr;
    }
  }

  &__intro-card {
    padding: $spacing-xl;
    background: $color-surface;
    border-radius: 12px;
    border-left: 4px solid $color-primary;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all $transition-base;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba($color-primary, 0.2);
    }

    h3 {
      @include heading-style;
      font-size: $font-size-lg;
      margin: $spacing-lg 0 $spacing-md 0;
      color: $color-primary;
    }

    p {
      @include body-text;
      margin: 0;
      font-size: $font-size-sm;
      line-height: $line-height-loose;
    }
  }

  &__intro-icon {
    font-size: $font-size-3xl;
  }

  &__grammar-section {
    padding: $spacing-xl * 2 0;
  }

  &__grammar-section h2 {
    @include heading-style;
    font-size: $font-size-3xl;
    margin-bottom: $spacing-xl;
  }

  &__grammar-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-xl;
    align-items: center;

    @include respond-below('md') {
      grid-template-columns: 1fr;
    }
  }

  &__grammar-text {
    p {
      @include body-text;
      margin-bottom: $spacing-lg;
      font-size: $font-size-base;
      line-height: $line-height-loose;
    }
  }

  &__quote {
    padding: $spacing-lg;
    background: $color-benga-word-bg;
    border-left: 4px solid $color-benga-word;
    border-radius: 6px;
    margin: $spacing-lg 0;
    font-style: italic;

    p {
      margin: 0;
      color: $color-benga-word;
      font-weight: $font-weight-semibold;
    }
  }

  &__grammar-image {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-md;
  }

  &__portrait {
    width: 100%;
    max-width: 350px;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    border: 4px solid $color-primary;
  }

  &__image-caption {
    @include body-text;
    font-size: $font-size-sm;
    text-align: center;
    color: $color-text-secondary;
    font-style: italic;
  }

  &__curriculum-section {
    padding: $spacing-xl * 2 0;
    background: $color-surface-alt;

    h2 {
      @include heading-style;
      font-size: $font-size-3xl;
      text-align: center;
      margin-bottom: $spacing-xl;
    }
  }

  &__chapters-preview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: $spacing-lg;

    @include respond-below('sm') {
      grid-template-columns: 1fr;
    }
  }

  &__chapter-card {
    padding: $spacing-xl;
    background: $color-surface;
    border-radius: 12px;
    border-top: 4px solid $color-primary;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: $spacing-md;

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
      line-height: $line-height-base;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        @include body-text;
        font-size: $font-size-sm;
        padding: $spacing-xs 0;
        color: $color-text-secondary;
      }
    }
  }

  &__chapter-link {
    display: inline-block;
    padding: $spacing-md $spacing-lg;
    background: $color-primary;
    color: $color-text-inverse;
    text-decoration: none;
    border-radius: 6px;
    font-weight: $font-weight-semibold;
    text-align: center;
    transition: all $transition-base;
    border: 2px solid $color-primary;
    cursor: pointer;

    &:hover:not(&--disabled) {
      background: $color-primary-dark;
      border-color: $color-primary-dark;
      transform: translateY(-2px);
    }

    &--disabled {
      background: $color-text-muted;
      border-color: $color-text-muted;
      cursor: not-allowed;
      opacity: 0.7;
    }
  }

  &__features-section {
    padding: $spacing-xl * 2 0;

    h2 {
      @include heading-style;
      font-size: $font-size-3xl;
      text-align: center;
      margin-bottom: $spacing-xl;
    }
  }

  &__features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: $spacing-lg;

    @include respond-below('sm') {
      grid-template-columns: 1fr;
    }
  }

  &__feature {
    padding: $spacing-lg;
    background: $color-surface-alt;
    border-radius: 12px;
    text-align: center;
    border: 2px solid transparent;
    transition: all $transition-base;

    &:hover {
      border-color: $color-primary;
      box-shadow: 0 4px 12px rgba($color-primary, 0.2);
      transform: translateY(-4px);
    }
  }

  &__feature-icon {
    font-size: $font-size-3xl;
    margin-bottom: $spacing-md;
  }

  &__feature h4 {
    @include heading-style;
    font-size: $font-size-base;
    margin: 0 0 $spacing-md 0;
    color: $color-primary;
  }

  &__feature p {
    @include body-text;
    font-size: $font-size-sm;
    margin: 0;
    line-height: $line-height-base;
  }

  &__cta-section {
    padding: $spacing-xl * 2 0;
    background: linear-gradient(135deg, $color-primary, $color-secondary);
    color: $color-text-inverse;
    text-align: center;

    h2 {
      font-family: $font-family-heading;
      font-size: $font-size-3xl;
      margin-bottom: $spacing-md;
      font-weight: $font-weight-bold;
    }

    p {
      @include body-text;
      font-size: $font-size-lg;
      margin-bottom: $spacing-xl;
    }
  }

  &__cta-buttons {
    display: flex;
    justify-content: center;
    gap: $spacing-lg;
    flex-wrap: wrap;

    @include respond-below('sm') {
      flex-direction: column;
    }
  }

  &__cta-button {
    display: inline-block;
    padding: $spacing-lg $spacing-xl;
    border-radius: 8px;
    font-weight: $font-weight-bold;
    font-size: $font-size-base;
    text-decoration: none;
    transition: all $transition-base;
    border: 2px solid;

    &--primary {
      background: $color-accent;
      color: $color-primary;
      border-color: $color-accent;

      &:hover {
        background: $color-accent-light;
        border-color: $color-accent-light;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }
    }

    &--secondary {
      background: transparent;
      color: $color-text-inverse;
      border-color: $color-text-inverse;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }
    }

    @include respond-below('sm') {
      width: 100%;
    }
  }
}
</style>
