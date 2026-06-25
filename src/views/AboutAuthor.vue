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
              alt="Retrato de Francisco Salvadó y Cos" 
              class="about-author__portrait"
            />
            <div class="about-author__portrait-info">
              <p class="about-author__passion">{{ authorData.author.name }}</p>
              <p class="about-author__dates">{{ authorData.author.birth }}</p>
              <p class="about-author__role">{{ authorData.author.profession }}</p>
            </div>
          </div>

          <div class="about-author__biography">
            <h2>{{ $t('about.biographical') || 'Biografía' }}</h2>
            <p class="about-author__bio-text">
              {{ authorData.author.biography[$i18n.locale] || authorData.author.biography.es }}
            </p>
          </div>
        </div>
      </section>

      <!-- Publication Details -->
      <section class="about-author__section about-author__publication-section">
        <h2>{{ $t('about.masterwork') || 'Obra Maestra' }}</h2>

        <div class="about-author__publication-details">
          <div class="about-author__detail-card">
            <h3>{{ $t('about.workTitle') || 'Título de la Obra' }}</h3>
            <p class="about-author__detail-text">
              {{ authorData.author.workTitle }}
            </p>
            <p class="about-author__detail-subtitle">
              {{ authorData.author.subtitle }}
            </p>
          </div>

          <div class="about-author__detail-grid">
            <div class="about-author__detail-card">
              <h4>{{ $t('about.publicationYear') || 'Año de Publicación' }}</h4>
              <p class="about-author__detail-value">{{ authorData.author.publicationYear }}</p>
            </div>

            <div class="about-author__detail-card">
              <h4>{{ $t('about.publisher') || 'Editorial' }}</h4>
              <p class="about-author__detail-value">{{ authorData.author.publisher }}</p>
            </div>

            <div class="about-author__detail-card">
              <h4>{{ $t('about.location') || 'Lugar de Publicación' }}</h4>
              <p class="about-author__detail-value">{{ authorData.author.publicationPlace }}</p>
            </div>

            <div class="about-author__detail-card">
              <h4>{{ $t('about.pagination') || 'Páginas' }}</h4>
              <p class="about-author__detail-value">~{{ authorData.author.pages }}pp</p>
            </div>
          </div>
        </div>

        <!-- Book Description -->
        <div class="about-author__book-description">
          <p>
            Esta obra representa el primer esfuerzo sistemático de documentación del idioma Benga. En ella, Salvadó y Cos 
            presenta una introducción exhaustiva a la gramática Benga, incluyendo:
          </p>
          <ul>
            <li><strong>Alfabeto y sonidos:</strong> Una explicación detallada del sistema de escritura y pronunciación</li>
            <li><strong>Vocales y diptongos:</strong> Análisis fonético de todos los sonidos vocálicos</li>
            <li><strong>Consonantes:</strong> Descripción de consonantes simples y combinadas</li>
            <li><strong>Nombres y sustantivos:</strong> Sistema de clasificación nominal con siete clases</li>
            <li><strong>Adjetivos:</strong> Adjetivos variables e invariables y sus usos</li>
            <li><strong>Ejemplos prácticos:</strong> Cientos de palabras y expresiones en contexto</li>
          </ul>
        </div>
      </section>

      <!-- Historical Context -->
      <section class="about-author__section">
        <h2>{{ $t('about.historicalContext') || 'Contexto Histórico' }}</h2>

        <div class="about-author__context-cards">
          <div class="about-author__context-item">
            <h3>🌍 {{ $t('about.colonialLinguistics') || 'Lingüística Colonial' }}</h3>
            <p>
              En el siglo XIX, el estudio de lenguas africanas era parte de la empresa colonial europea. 
              Sin embargo, la obra de Salvadó y Cos se destaca por su rigor científico y su respeto por la lengua estudiada,
              recopilando materiales que de otra forma se hubiesen perdido.
            </p>
          </div>

          <div class="about-author__context-item">
            <h3>📚 {{ $t('about.linguisticValue') || 'Valor Lingüístico' }}</h3>
            <p>
              Como una de las primeras descripciones sistemáticas del Benga, esta gramática conserva información invaluable
              sobre la lengua que de otro modo estaría perdida. Para estudiosos modernos del Benga y lenguas relacionadas,
              representa una fuente primaria de importancia crítica.
            </p>
          </div>

          <div class="about-author__context-item">
            <h3>🙏 {{ $t('about.missionaryWork') || 'Labor Misionera' }}</h3>
            <p>
              Como misionero, Salvadó y Cos pasó años viviendo con hablantes nativos de Benga. Esta cercanía le permitió
              recopilar datos lingüísticos authenticos directamente de la comunidad de habla, en lugar de trabajar con informantes
              limitados o de segunda mano.
            </p>
          </div>

          <div class="about-author__context-item">
            <h3>🔍 {{ $t('about.legacy') || 'Legado' }}</h3>
            <p>
              La obra de Salvadó y Cos sigue siendo referencia en estudios de lenguas Ndowe. Su contribución a la documentación
              del Benga es reconocida por lingüistas africanos modernos y forma parte del patrimonio intelectual colectivo de la comunidad académica.
            </p>
          </div>
        </div>
      </section>

      <!-- About This Portal -->
      <section class="about-author__section about-author__portal-section">
        <h2>{{ $t('about.aboutPortal') || 'Sobre Este Portal' }}</h2>
        <div class="about-author__portal-content">
          <p>
            Este portal digital representa un esfuerzo por hacer accesible la valiosa obra de Salvadó y Cos a nuevas audiencias.
            Al transformar la gramática de 1891 en un formato interactivo, buscamos:
          </p>
          <ul>
            <li>✓ Preservar el conocimiento lingüístico histórico para futuras generaciones</li>
            <li>✓ Facilitar el acceso a estudiantes de lenguas africanas en todo el mundo</li>
            <li>✓ Apoyar a hablantes nativos de Benga en la revitalización de su lengua</li>
            <li>✓ Contribuir a la documentación de lenguas en peligro de extinción</li>
            <li>✓ Demostrar el valor de las fuentes históricas para la investigación contemporánea</li>
          </ul>

          <div class="about-author__download-box">
            <h3>{{ $t('about.originalWork') || 'Acceso a la Obra Original' }}</h3>
            <p>
              Para complementar tu aprendizaje en el portal, puedes descargar la gramática original de Salvadó y Cos en formato PDF:
            </p>
            <a 
              href="/downloads/salvado-y-cos-gramatica-benga.pdf"
              class="about-author__download-button"
              download
            >
              📄 {{ $t('nav.download') || 'Descargar PDF Completo' }}
            </a>
          </div>
        </div>
      </section>

      <!-- Resources -->
      <section class="about-author__section">
        <h2>{{ $t('about.furtherReading') || 'Lecturas Complementarias' }}</h2>

        <div class="about-author__resources">
          <div class="about-author__resource-card">
            <h3>{{ $t('about.languageFamily') || 'Familia Lingüística Ndowe' }}</h3>
            <p>
              El Benga pertenece a la familia de lenguas Ndowe, que incluye también Bubi (en Bioko) y otras lenguas relacionadas 
              habladas en la región del Golfo de Guinea.
            </p>
            <a href="https://en.wikipedia.org/wiki/Ndowe_languages" target="_blank" class="about-author__resource-link">
              Leer en Wikipedia →
            </a>
          </div>

          <div class="about-author__resource-card">
            <h3>{{ $t('about.livingDictionary') || 'Living Dictionary' }}</h3>
            <p>
              El Living Dictionary es un recurso comunitario que documenta lenguas en peligro. 
              Consulta las palabras Benga recopiladas por la comunidad de hablantes.
            </p>
            <a href="https://www.livingdictionaries.app/benga" target="_blank" class="about-author__resource-link">
              Visitar Living Dictionary →
            </a>
          </div>

          <div class="about-author__resource-card">
            <h3>{{ $t('about.sil') || 'SIL International' }}</h3>
            <p>
              SIL (Institución Lingüística de Verano) trabaja en la documentación y preservación de lenguas minoritarias
              en todo el mundo, incluyendo el Benga.
            </p>
            <a href="https://www.sil.org/" target="_blank" class="about-author__resource-link">
              Visitar SIL →
            </a>
          </div>

          <div class="about-author__resource-card">
            <h3>{{ $t('about.guineaInfo') || 'Guinea Ecuatorial' }}</h3>
            <p>
              Información sobre la geografía, cultura y lenguas de Guinea Ecuatorial, donde se habla el Benga.
            </p>
            <a href="https://en.wikipedia.org/wiki/Equatorial_Guinea" target="_blank" class="about-author__resource-link">
              Leer en Wikipedia →
            </a>
          </div>
        </div>
      </section>
    </div>

    <!-- CTA Footer -->
    <section class="about-author__cta-footer">
      <h2>{{ $t('home.readyToLearn') || '¿Listo para Comenzar?' }}</h2>
      <router-link to="/capitulo-1" class="about-author__cta-button">
        {{ $t('home.startLearning') }} →
      </router-link>
    </section>
  </div>
</template>

<script>
import authorData from '@/data/author-info.json'

export default {
  name: 'AboutAuthor',
  data() {
    return {
      authorData
    }
  },
  created() {
    document.title = 'Sobre el Autor - ' + this.$t('about.title')
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/mixins';

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

        strong {
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
