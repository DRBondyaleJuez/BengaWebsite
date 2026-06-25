<template>
  <div class="resources">
    <!-- Header -->
    <header class="resources__header">
      <div class="resources__background">
        <div class="resources__overlay"></div>
      </div>
      <div class="resources__container">
        <h1 class="resources__title">{{ $t('nav.resources') }}</h1>
        <p class="resources__subtitle">{{ $t('resources.subtitle') || 'Herramientas y referencias para el aprendizaje del Benga' }}</p>
      </div>
    </header>

    <!-- Main Content -->
    <div class="resources__container">
      <!-- Primary Sources -->
      <section class="resources__section">
        <h2>{{ $t('resources.primarySources') || 'Fuentes Primarias' }}</h2>

        <div class="resources__cards-grid">
          <div class="resources__card resources__card--primary">
            <div class="resources__card-icon">📄</div>
            <h3>{{ $t('about.masterwork') || 'Gramática Original de Salvadó y Cos' }}</h3>
            <p>
              La obra completa de 1891 en formato PDF. Este es el documento original que forma la base de todo este portal.
            </p>
            <a 
              href="/downloads/salvado-y-cos-gramatica-benga.pdf"
              class="resources__button"
              download
            >
              Descargar PDF
            </a>
          </div>

          <div class="resources__card resources__card--primary">
            <div class="resources__card-icon">🎧</div>
            <h3>{{ $t('resources.audioFiles') || 'Archivos de Audio' }}</h3>
            <p>
              Pronunciaciones de palabras Benga recopiladas por hablantes nativos. Estos archivos están alojados en Cloudinary.
            </p>
            <p class="resources__coming-soon">En desarrollo...</p>
          </div>
        </div>
      </section>

      <!-- Learning Tools -->
      <section class="resources__section">
        <h2>{{ $t('resources.learningTools') || 'Herramientas de Aprendizaje' }}</h2>

        <div class="resources__cards-grid">
          <div class="resources__card">
            <div class="resources__card-icon">📖</div>
            <h3>Living Dictionary</h3>
            <p>
              Un diccionario comunitario que documenta el Benga con contribuciones de hablantes nativos. 
              Puedes explorar palabras, escuchar pronunciaciones y aprender usos contextuales.
            </p>
            <a 
              href="https://www.livingdictionaries.app/benga"
              target="_blank"
              rel="noopener noreferrer"
              class="resources__button resources__button--external"
            >
              Visitar Living Dictionary ↗
            </a>
          </div>

          <div class="resources__card">
            <div class="resources__card-icon">🔍</div>
            <h3>SIL International</h3>
            <p>
              La Institución Lingüística de Verano trabaja en documentación de lenguas minoritarias. 
              Sus recursos incluyen información sobre lenguas Ndowe y técnicas de documentación lingüística.
            </p>
            <a 
              href="https://www.sil.org/"
              target="_blank"
              rel="noopener noreferrer"
              class="resources__button resources__button--external"
            >
              Visitar SIL ↗
            </a>
          </div>

          <div class="resources__card">
            <div class="resources__card-icon">📚</div>
            <h3>Wikipedia - Ndowe Languages</h3>
            <p>
              Artículo informativo sobre la familia de lenguas Ndowe, incluyendo el Benga. 
              Proporciona contexto geográfico, histórico y cultural.
            </p>
            <a 
              href="https://en.wikipedia.org/wiki/Ndowe_languages"
              target="_blank"
              rel="noopener noreferrer"
              class="resources__button resources__button--external"
            >
              Leer en Wikipedia ↗
            </a>
          </div>

          <div class="resources__card">
            <div class="resources__card-icon">🗺️</div>
            <h3>Wikimedia Commons</h3>
            <p>
              Repositorio de imágenes, mapas y documentos históricos libres de derechos. 
              Útil para recursos visuales sobre Guinea Ecuatorial y la región de Corisco.
            </p>
            <a 
              href="https://commons.wikimedia.org/"
              target="_blank"
              rel="noopener noreferrer"
              class="resources__button resources__button--external"
            >
              Visitar Wikimedia Commons ↗
            </a>
          </div>
        </div>
      </section>

      <!-- Reference Materials -->
      <section class="resources__section">
        <h2>{{ $t('resources.references') || 'Materiales de Referencia' }}</h2>

        <div class="resources__reference-list">
          <div class="resources__reference-item">
            <h3>🌍 Geografía de Guinea Ecuatorial</h3>
            <p>Información sobre la isla de Corisco y los alrededores donde se habla el Benga.</p>
            <a 
              href="https://en.wikipedia.org/wiki/Equatorial_Guinea"
              target="_blank"
              rel="noopener noreferrer"
              class="resources__link"
            >
              Leer más →
            </a>
          </div>

          <div class="resources__reference-item">
            <h3>👥 Cultura Ndowe</h3>
            <p>
              Información sobre el pueblo Ndowe, sus tradiciones y su importancia cultural 
              en la región del Golfo de Guinea.
            </p>
            <a 
              href="https://en.wikipedia.org/wiki/Ndowe_people"
              target="_blank"
              rel="noopener noreferrer"
              class="resources__link"
            >
              Leer más →
            </a>
          </div>

          <div class="resources__reference-item">
            <h3>🕰️ Historia de Guinea Ecuatorial</h3>
            <p>
              Contexto histórico que ayuda a entender la época en que Salvadó y Cos escribió su gramática.
            </p>
            <a 
              href="https://en.wikipedia.org/wiki/History_of_Equatorial_Guinea"
              target="_blank"
              rel="noopener noreferrer"
              class="resources__link"
            >
              Leer más →
            </a>
          </div>

          <div class="resources__reference-item">
            <h3>🎓 Investigación Lingüística Contemporánea</h3>
            <p>
              Estudios recientes sobre documentación de lenguas, preservación lingüística y revitalización.
            </p>
            <a 
              href="https://www.linguisticsociety.org/"
              target="_blank"
              rel="noopener noreferrer"
              class="resources__link"
            >
              Linguistic Society of America →
            </a>
          </div>
        </div>
      </section>

      <!-- Study Tips -->
      <section class="resources__section resources__tips-section">
        <h2>{{ $t('resources.studyTips') || 'Consejos para Estudiar Benga' }}</h2>

        <div class="resources__tips-grid">
          <div class="resources__tip-card">
            <span class="resources__tip-number">1</span>
            <h3>Empieza por el Alfabeto</h3>
            <p>
              Familiarízate con los sonidos básicos y el sistema de escritura Benga antes de pasar a estructuras más complejas.
            </p>
          </div>

          <div class="resources__tip-card">
            <span class="resources__tip-number">2</span>
            <h3>Escucha Pronunciaciones</h3>
            <p>
              Usa los archivos de audio disponibles en el portal. La pronunciación correcta es crucial en Benga.
            </p>
          </div>

          <div class="resources__tip-card">
            <span class="resources__tip-number">3</span>
            <h3>Aprende Cognados</h3>
            <p>
              Identifica palabras que se parecen a términos en otras lenguas Ndowe o lenguas bantu relacionadas.
            </p>
          </div>

          <div class="resources__tip-card">
            <span class="resources__tip-number">4</span>
            <h3>Memoriza Clases Nominales</h3>
            <p>
              El sistema de siete clases nominales es fundamental para la gramática Benga. Dedica tiempo a aprenderlas bien.
            </p>
          </div>

          <div class="resources__tip-card">
            <span class="resources__tip-number">5</span>
            <h3>Practica con Ejemplos</h3>
            <p>
              El portal proporciona cientos de ejemplos. Úsalos para ver cómo funcionan las reglas en contexto real.
            </p>
          </div>

          <div class="resources__tip-card">
            <span class="resources__tip-number">6</span>
            <h3>Conecta con la Comunidad</h3>
            <p>
              Si es posible, conecta con hablantes nativos de Benga o comunidades de investigadores interesados en la lengua.
            </p>
          </div>
        </div>
      </section>

      <!-- Community -->
      <section class="resources__section">
        <h2>{{ $t('footer.community') || 'Comunidad' }}</h2>

        <div class="resources__community-content">
          <p>
            El aprendizaje del Benga es mejor cuando se hace en comunidad. Aquí hay formas de conectar:
          </p>

          <ul>
            <li>
              <strong>Living Dictionary:</strong> Contribuye con pronunciaciones y usos de palabras Benga
            </li>
            <li>
              <strong>SIL Communities:</strong> Participa en iniciativas de documentación y preservación lingüística
            </li>
            <li>
              <strong>Comunidad Ndowe:</strong> Busca grupos culturales y educativos Ndowe en línea o localmente
            </li>
            <li>
              <strong>Universidades:</strong> Algunos programas de lingüística africana pueden ofrecerte oportunidades de aprendizaje especializado
            </li>
          </ul>

          <div class="resources__contribute-box">
            <h3>{{ $t('footer.contribute') }}</h3>
            <p>
              ¿Tienes recursos que agregar? ¿Correcciones o sugerencias? Nos gustaría saber de ti.
            </p>
            <router-link to="/" class="resources__contribute-button">
              Conectar con Nosotros
            </router-link>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResourcesPage',
  created() {
    document.title = 'Recursos - ' + this.$t('nav.resources')
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/mixins';

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

        strong {
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
