<template>
  <div class="chapter-one">
    <!-- Header -->
    <header class="chapter-one__header">
      <div class="chapter-one__background">
        <div class="chapter-one__overlay"></div>
      </div>
      <div class="chapter-one__container">
        <h1 class="chapter-one__title">{{ $t('chapters.chapter1.title') }}</h1>
        <p class="chapter-one__subtitle">{{ chapter1Data.subtitle[$i18n.locale] || chapter1Data.subtitle.es }}</p>
      </div>
    </header>

    <!-- Introduction -->
    <div class="chapter-one__container">
      <div v-if="$route.name === 'Chapter1Index'">
        <section class="chapter-one__intro-section">
          <p class="chapter-one__intro-text">
            {{ chapter1Data.introduction[$i18n.locale] || chapter1Data.introduction.es }}
          </p>
        </section>

        <!-- Learning Outcomes -->
        <section class="chapter-one__outcomes-section">
          <h2>{{ $t('chapter1.learningOutcomes') || 'Al Completar Este Capítulo' }}</h2>
          <ul class="chapter-one__outcomes-list">
            <li v-for="outcome in chapter1Data.learningOutcomes" :key="outcome">
              ✓ {{ outcome[$i18n.locale] || outcome.es }}
            </li>
          </ul>
        </section>

        <!-- Sections Overview -->
        <section class="chapter-one__sections-section">
          <h2>{{ $t('chapter1.sections') || 'Secciones del Capítulo' }}</h2>

          <div class="chapter-one__sections-grid">
            <!-- Alphabet Section -->
            <router-link 
              to="/capitulo-1/alfabeto" 
              class="chapter-one__section-card"
              :style="{ borderLeftColor: colors.alphabet }"
            >
              <div class="chapter-one__section-icon">🔤</div>
              <h3>{{ $t('chapters.chapter1.sections.alphabet') }}</h3>
              <p>
                Aprende los 23 sonidos del alfabeto Benga, incluyendo vocales especiales y consonantes únicas.
              </p>
              <span class="chapter-one__section-meta">5-10 minutos</span>
            </router-link>

            <!-- Diphthongs Section -->
            <router-link 
              to="/capitulo-1/diptongos" 
              class="chapter-one__section-card"
              :style="{ borderLeftColor: colors.diphthongs }"
            >
              <div class="chapter-one__section-icon">🔗</div>
              <h3>{{ $t('chapters.chapter1.sections.diphthongs') }}</h3>
              <p>
                Domina las 9 combinaciones de diptongos que producen sonidos únicos en la lengua Benga.
              </p>
              <span class="chapter-one__section-meta">10-15 minutos</span>
            </router-link>

            <!-- Triphthongs Section -->
            <router-link 
              to="/capitulo-1/triptongos" 
              class="chapter-one__section-card"
              :style="{ borderLeftColor: colors.triphthongs }"
            >
              <div class="chapter-one__section-icon">🌊</div>
              <h3>{{ $t('chapters.chapter1.sections.triphthongs') }}</h3>
              <p>
                Aprende las 13 combinaciones de triptongos, especialmente comunes en conjugaciones verbales.
              </p>
              <span class="chapter-one__section-meta">12-18 minutos</span>
            </router-link>

            <!-- Consonants Section -->
            <router-link 
              to="/capitulo-1/consonantes" 
              class="chapter-one__section-card"
              :style="{ borderLeftColor: colors.consonants }"
            >
              <div class="chapter-one__section-icon">🔊</div>
              <h3>{{ $t('chapters.chapter1.sections.consonants') }}</h3>
              <p>
                Completa tu comprensión con 16 consonantes simples y 5 combinaciones consonánticas nasales.
              </p>
              <span class="chapter-one__section-meta">15-20 minutos</span>
            </router-link>
          </div>
        </section>

        <!-- Key Concepts -->
        <section class="chapter-one__concepts-section">
          <h2>{{ $t('chapter1.keyConcepts') || 'Conceptos Clave' }}</h2>

          <div class="chapter-one__concepts-grid">
            <div class="chapter-one__concept-card">
              <h3>Precisión Ortográfica</h3>
              <p>
                El Benga mantiene una correspondencia estricta entre escritura y pronunciación. Todo lo que se pronuncia 
                se escribe, y viceversa, todo lo que se escribe se pronuncia claro y distinto.
              </p>
            </div>

            <div class="chapter-one__concept-card">
              <h3>Vocales Largas y Cortas</h3>
              <p>
                Solo las vocales á, é y ü son "largas" (marca da con acento). Las demás son cortas. Esta distinción es crucial 
                para comprender significados diferentes.
              </p>
            </div>

            <div class="chapter-one__concept-card">
              <h3>Combinaciones Nasales</h3>
              <p>
                Las combinaciones Mb, Nd, Ng, Nj, Ny representan sonidos nasales únicos. Entender cómo articularlos es 
                fundamental para la pronunciación correcta.
              </p>
            </div>

            <div class="chapter-one__concept-card">
              <h3>El Dígrafo Y</h3>
              <p>
                La letra Y funciona tanto como vocal como consonante. Su comportamiento es crucial para entender patrones 
                silábicos y de estrés en Benga.
              </p>
            </div>
          </div>
        </section>

        <!-- Progress Tracker -->
        <section class="chapter-one__progress-section">
          <h2>{{ $t('chapter1.progressTracker') || 'Seguimiento de Progreso' }}</h2>

          <div class="chapter-one__progress-list">
            <div class="chapter-one__progress-item">
              <input 
                type="checkbox" 
                :id="`progress-alphabet`"
                v-model="progress.alphabet"
                class="chapter-one__progress-checkbox"
              />
              <label :for="`progress-alphabet`">{{ $t('chapters.chapter1.sections.alphabet') }}</label>
            </div>

            <div class="chapter-one__progress-item">
              <input 
                type="checkbox" 
                :id="`progress-vowels`"
                v-model="progress.vowels"
                class="chapter-one__progress-checkbox"
              />
              <label :for="`progress-vowels`">{{ $t('chapters.chapter1.sections.vowels') }}</label>
            </div>

            <div class="chapter-one__progress-item">
              <input 
                type="checkbox" 
                :id="`progress-diphthongs`"
                v-model="progress.diphthongs"
                class="chapter-one__progress-checkbox"
              />
              <label :for="`progress-diphthongs`">{{ $t('chapters.chapter1.sections.diphthongs') }}</label>
            </div>

            <div class="chapter-one__progress-item">
              <input 
                type="checkbox" 
                :id="`progress-triphthongs`"
                v-model="progress.triphthongs"
                class="chapter-one__progress-checkbox"
              />
              <label :for="`progress-triphthongs`">{{ $t('chapters.chapter1.sections.triphthongs') }}</label>
            </div>

            <div class="chapter-one__progress-item">
              <input 
                type="checkbox" 
                :id="`progress-consonants`"
                v-model="progress.consonants"
                class="chapter-one__progress-checkbox"
              />
              <label :for="`progress-consonants`">{{ $t('chapters.chapter1.sections.consonants') }}</label>
            </div>
          </div>

          <div class="chapter-one__progress-bar">
            <div 
              class="chapter-one__progress-fill"
              :style="{ width: progressPercentage + '%' }"
            ></div>
          </div>
          <p class="chapter-one__progress-text">{{ progressPercentage }}% completado</p>
        </section>

        <!-- Study Tips -->
        <section class="chapter-one__tips-section">
          <h2>{{ $t('chapter1.studyTips') || 'Consejos para Este Capítulo' }}</h2>

          <div class="chapter-one__tips-list">
            <div class="chapter-one__tip">
              <strong>Escucha con Atención:</strong> Usa los archivos de audio para familiarizarte con los sonidos antes 
              de intentar pronunciar.
            </div>
            <div class="chapter-one__tip">
              <strong>Toma Notas:</strong> Escribe las palabras de ejemplo y sus significados para reforzar la memoria.
            </div>
            <div class="chapter-one__tip">
              <strong>Practica la Pronunciación:</strong> Intenta reproducir los sonidos que escuchas. La práctica repetida 
              es clave.
            </div>
            <div class="chapter-one__tip">
              <strong>Conecta Patrones:</strong> Busca similitudes entre combinaciones de sonidos para crear una mental map 
              de la fonología.
            </div>
            <div class="chapter-one__tip">
              <strong>Revisión Espaciada:</strong> Vuelve a revisar secciones anteriores regularmente para consolidar el aprendizaje.
            </div>
          </div>
        </section>

        <!-- Next Chapter Preview -->
        <section class="chapter-one__next-section">
          <h2>{{ $t('chapter1.whatNext') || 'Próximo Paso: Capítulo 2' }}</h2>
          <div class="chapter-one__next-preview">
            <p>
              Una vez que domines los fundamentos fonéticos del Benga, el Capítulo 2 te introducirá al 
              <strong>sistema de clasificación de nombres sustantivos</strong>. Aprenderás sobre las siete clases nominales 
              que son fundamentales para la gramática Benga.
            </p>
            <button class="chapter-one__next-button" disabled>
              Capítulo 2 Próximamente
            </button>
          </div>
        </section>

        <!-- Start Learning CTA -->
        <section class="chapter-one__cta-section">
          <h2>¡Comencemos!</h2>
          <p>¿Listo para iniciar tu aprendizaje del Benga? Selecciona una sección arriba para comenzar.</p>
          <router-link to="/capitulo-1/alfabeto" class="chapter-one__cta-button">
            Comenzar con el Alfabeto →
          </router-link>
        </section>
      </div>

      <router-view v-else />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChapterOneIndex',
  data() {
    return {
      chapter1Data: {
        subtitle: {
          es: "Lecciones Preliminares: Fonética y Sonidos del Benga",
          en: "Preliminary Lessons: Phonetics and Sounds of Benga",
          fr: "Leçons Préliminaires: Phonétique et Sons du Benga"
        },
        introduction: {
          es: "El Capítulo 1 sienta las bases para entender la lengua Benga. Comenzaremos con el sistema de escritura y los sonidos fundamentales, desde el alfabeto básico hasta las combinaciones complejas de vocales y consonantes. Este capítulo es esencial para poder leer, escribir y pronunciar correctamente en Benga.",
          en: "Chapter 1 lays the foundation for understanding the Benga language. We'll start with the writing system and fundamental sounds, from the basic alphabet to complex combinations of vowels and consonants. This chapter is essential for reading, writing, and pronouncing Benga correctly.",
          fr: "Le chapitre 1 jette les bases pour comprendre la langue Benga. Nous commencerons par le système d'écriture et les sons fondamentaux, de l'alphabet de base aux combinaisons complexes de voyelles et de consonnes. Ce chapitre est essentiel pour lire, écrire et prononcer correctement le Benga."
        },
        learningOutcomes: [
          {
            es: "Identificar y pronunciar correctamente todos los 23 sonidos del alfabeto Benga",
            en: "Identify and correctly pronounce all 23 sounds of the Benga alphabet"
          },
          {
            es: "Comprender la distinción entre vocales largas y cortas",
            en: "Understand the distinction between long and short vowels"
          },
          {
            es: "Dominar la pronunciación de diptongos y triptongos",
            en: "Master the pronunciation of diphthongs and triphthongs"
          },
          {
            es: "Articular correctamente las combinaciones consonánticas nasales",
            en: "Correctly articulate nasal consonant combinations"
          },
          {
            es: "Leer y escribir palabras Benga con precisión ortográfica",
            en: "Read and write Benga words with spelling accuracy"
          }
        ]
      },
      colors: {
        alphabet: '#2D5A27',      // Primary green
        vowels: '#2D5A27',         // Primary green
        diphthongs: '#8B4513',     // Secondary brown
        triphthongs: '#8B4513',    // Secondary brown
        consonants: '#DAA520'      // Accent goldenrod
      },
      progress: {
        alphabet: false,
        vowels: false,
        diphthongs: false,
        triphthongs: false,
        consonants: false
      }
    }
  },
  computed: {
    progressPercentage() {
      const completed = Object.values(this.progress).filter(v => v).length
      const total = Object.keys(this.progress).length
      return Math.round((completed / total) * 100)
    }
  },
  watch: {
    progress: {
      handler(newProgress) {
        localStorage.setItem('chapter1Progress', JSON.stringify(newProgress))
      },
      deep: true
    }
  },
  created() {
    const saved = localStorage.getItem('chapter1Progress')
    if (saved) {
      this.progress = JSON.parse(saved)
    }
    document.title = this.$t('chapters.chapter1.title')
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/mixins';

.chapter-one {
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
    background: linear-gradient(135deg, $color-primary, $color-primary-light);
    z-index: 1;
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.15);
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

  &__intro-section {
    padding: $spacing-xl 0;
    border-bottom: 2px solid $border-color;
  }

  &__intro-text {
    @include body-text;
    font-size: $font-size-lg;
    color: $color-text-secondary;
    margin: 0;
    line-height: $line-height-loose;
  }

  &__outcomes-section {
    padding: $spacing-xl 0;
    border-bottom: 2px solid $border-color;

    h2 {
      @include heading-style;
      font-size: $font-size-2xl;
      margin-bottom: $spacing-lg;
      color: $color-primary;
    }
  }

  &__outcomes-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: $spacing-lg;

    li {
      @include body-text;
      font-size: $font-size-base;
      padding: $spacing-md;
      background: $color-surface-alt;
      border-radius: 6px;
      border-left: 4px solid $color-primary;
      line-height: $line-height-loose;
    }
  }

  &__sections-section {
    padding: $spacing-xl 0;
    border-bottom: 2px solid $border-color;

    h2 {
      @include heading-style;
      font-size: $font-size-2xl;
      margin-bottom: $spacing-lg;
      color: $color-primary;
    }
  }

  &__sections-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: $spacing-lg;

    @include respond-below('sm') {
      grid-template-columns: 1fr;
    }
  }

  &__section-card {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    padding: $spacing-xl;
    background: $color-surface;
    border-left: 4px solid $color-primary;
    border-radius: 12px;
    text-decoration: none;
    color: inherit;
    transition: all $transition-base;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
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
      line-height: $line-height-base;
      color: $color-text-secondary;
    }
  }

  &__section-icon {
    font-size: $font-size-3xl;
  }

  &__section-meta {
    @include body-text;
    font-size: $font-size-xs;
    color: $color-text-muted;
    font-style: italic;
    align-self: flex-end;
  }

  &__concepts-section {
    padding: $spacing-xl 0;
    border-bottom: 2px solid $border-color;

    h2 {
      @include heading-style;
      font-size: $font-size-2xl;
      margin-bottom: $spacing-lg;
      color: $color-primary;
    }
  }

  &__concepts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: $spacing-lg;
  }

  &__concept-card {
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

  &__progress-section {
    padding: $spacing-xl 0;
    border-bottom: 2px solid $border-color;

    h2 {
      @include heading-style;
      font-size: $font-size-2xl;
      margin-bottom: $spacing-lg;
      color: $color-primary;
    }
  }

  &__progress-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    margin-bottom: $spacing-xl;
  }

  &__progress-item {
    display: flex;
    align-items: center;
    gap: $spacing-md;

    label {
      @include body-text;
      font-size: $font-size-base;
      margin: 0;
      cursor: pointer;
    }
  }

  &__progress-checkbox {
    width: 20px;
    height: 20px;
    cursor: pointer;
    accent-color: $color-primary;
  }

  &__progress-bar {
    width: 100%;
    height: 12px;
    background: $color-surface-alt;
    border-radius: 100px;
    overflow: hidden;
    margin-bottom: $spacing-md;
  }

  &__progress-fill {
    height: 100%;
    background: $color-primary;
    transition: width 0.3s ease;
  }

  &__progress-text {
    @include body-text;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    margin: 0;
    text-align: center;
  }

  &__tips-section {
    padding: $spacing-xl 0;
    border-bottom: 2px solid $border-color;

    h2 {
      @include heading-style;
      font-size: $font-size-2xl;
      margin-bottom: $spacing-lg;
      color: $color-primary;
    }
  }

  &__tips-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
  }

  &__tip {
    padding: $spacing-lg;
    background: rgba($color-accent, 0.1);
    border-left: 4px solid $color-accent;
    border-radius: 6px;
    @include body-text;
    font-size: $font-size-base;
    line-height: $line-height-loose;

    strong {
      color: $color-primary;
    }
  }

  &__next-section {
    padding: $spacing-xl 0;
    border-bottom: 2px solid $border-color;

    h2 {
      @include heading-style;
      font-size: $font-size-2xl;
      margin-bottom: $spacing-lg;
      color: $color-primary;
    }
  }

  &__next-preview {
    padding: $spacing-xl;
    background: $color-surface-alt;
    border-left: 4px solid $color-secondary;
    border-radius: 8px;

    p {
      @include body-text;
      font-size: $font-size-base;
      margin-bottom: $spacing-lg;
      line-height: $line-height-loose;

      strong {
        color: $color-secondary;
      }
    }
  }

  &__next-button {
    padding: $spacing-md $spacing-lg;
    background: $color-text-muted;
    color: $color-text-inverse;
    border: none;
    border-radius: 6px;
    font-weight: $font-weight-semibold;
    cursor: not-allowed;
    opacity: 0.7;
  }

  &__cta-section {
    padding: $spacing-xl * 2 0;
    text-align: center;
    background: linear-gradient(135deg, rgba($color-primary, 0.05), rgba($color-accent, 0.05));
    border-radius: 12px;
    padding: $spacing-xl * 2;

    h2 {
      @include heading-style;
      font-size: $font-size-3xl;
      margin-bottom: $spacing-md;
      color: $color-primary;
    }

    p {
      @include body-text;
      font-size: $font-size-lg;
      margin-bottom: $spacing-xl;
      color: $color-text-secondary;
    }
  }

  &__cta-button {
    display: inline-block;
    padding: $spacing-lg $spacing-xl;
    background: $color-primary;
    color: $color-text-inverse;
    text-decoration: none;
    border-radius: 8px;
    font-weight: $font-weight-bold;
    transition: all $transition-base;

    &:hover {
      background: $color-primary-dark;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba($color-primary, 0.3);
    }
  }
}
</style>
