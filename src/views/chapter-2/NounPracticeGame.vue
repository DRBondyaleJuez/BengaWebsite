<template>
  <div class="noun-class noun-class--practice">
    <div class="noun-class__header">
      <h1>Práctica de Nombres Sustantivos</h1>
      <p class="subtitle">
        Juega con el singular, el plural y las clases nominales
      </p>
    </div>

    <section class="noun-class__instructions">
      <h2>¿Cómo funciona?</h2>
      <ol class="practice-list">
        <li>
          Cada tarjeta muestra el <strong>singular</strong> con su audio. La
          traducción permanece oculta hasta que la pidas.
        </li>
        <li>
          Pulsa el icono de giro (↺) para ver la <strong>clase</strong> y el
          resumen de conversión (por ejemplo <em>i- → ma-</em>).
        </li>
        <li>
          Púlsalo de nuevo para revelar el <strong>plural</strong> con su audio.
        </li>
        <li>
          Púlsalo una última vez para volver al singular. Al activar una
          tarjeta, las demás vuelven a su estado inicial.
        </li>
        <li>
          Baraja y navega por páginas (~10 tarjetas en escritorio, 2 en móvil).
        </li>
      </ol>
    </section>

    <section class="noun-class__cards">
      <div class="cards-toolbar">
        <button class="refresh-btn" @click="refreshDeck">Barajar de nuevo</button>
        <span class="deck-count">
          {{ deck.length }} palabras ·
          {{ currentPage }} / {{ totalPages }}
        </span>
      </div>

      <div class="cards-grid" :class="cardsGridClass">
        <div
          v-for="card in paginatedCards"
          :key="card.id"
          class="flip-card"
          :class="{ 'flip-card--flipped': card.flipped }"
        >
          <div class="flip-card__inner">
            <div class="flip-card__face flip-card__face--front">
              <button
                class="flip-card__icon"
                type="button"
                title="Ver clase y plural"
                @click="flipCard(card.id)"
              >
                ↺
              </button>
              <span class="flip-card__badge">Singular</span>

              <BengaWord
                class="flip-card__word"
                :word="card.singular"
                :audio-id="card.singularAudioId"
                :meaning="card.translation"
                :show-meaning="card.showTranslation"
                :dictionary-url="getDictionaryUrl(card.singular)"
                block
              />

              <button
                class="translate-btn"
                type="button"
                @click="toggleTranslation(card.id)"
              >
                {{ card.showTranslation ? 'Ocultar' : 'Mostrar' }} traducción
              </button>
            </div>

            <div class="flip-card__face flip-card__face--back">
              <button
                class="flip-card__icon"
                type="button"
                :title="card.pluralRevealed ? 'Volver al singular' : 'Ver plural'"
                @click="flipCard(card.id)"
              >
                ↺
              </button>
              <span class="flip-card__badge flip-card__badge--class">
                {{ card.pluralRevealed ? 'Plural' : 'Clase nominal' }}
              </span>

              <div v-if="!card.pluralRevealed" class="flip-card__class">
                <strong>{{ card.nounClass }}</strong>
                <span class="flip-card__conversion">
                  {{ card.conversionSummary }}
                </span>
                <span class="flip-card__hint">
                  Pulsa ↺ para ver el plural
                </span>
              </div>

              <template v-else>
                <BengaWord
                  class="flip-card__word"
                  :word="card.plural"
                  :audio-id="card.pluralAudioId"
                  :meaning="card.pluralTranslation"
                  :show-meaning="card.showTranslation"
                  :dictionary-url="getDictionaryUrl(card.plural)"
                  block
                />

                <button
                  class="translate-btn"
                  type="button"
                  @click="toggleTranslation(card.id)"
                >
                  {{ card.showTranslation ? 'Ocultar' : 'Mostrar' }} traducción
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>

      <nav v-if="totalPages > 1" class="pagination" aria-label="Paginación">
        <button
          class="pagination__arrow"
          type="button"
          :disabled="currentPage === 1"
          @click="prevPage"
        >
          ←
        </button>
        <button
          v-for="p in visiblePages"
          :key="p"
          type="button"
          class="pagination__page"
          :class="{ 'pagination__page--active': currentPage === p }"
          @click="goToPage(p)"
        >
          {{ p }}
        </button>
        <button
          class="pagination__arrow"
          type="button"
          :disabled="currentPage === totalPages"
          @click="nextPage"
        >
          →
        </button>
      </nav>
    </section>

    <section class="noun-class__nav">
      <router-link to="/capitulo-2/verbales" class="nav-link prev">
        ← Nombres Derivados
      </router-link>
      <router-link to="/capitulo-2" class="nav-link next">
        Volver al Capítulo 2 →
      </router-link>
    </section>
  </div>
</template>

<script>
import BengaWord from "@/components/content/BengaWord.vue";
import deckData from "@/data/chapter-2/noun-practice-deck.json";

const LIVING_DICTIONARY_BASE = "https://livingdictionaries.app/benga/entry";
const MOBILE_BREAKPOINT = 768;

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default {
  name: "NounPracticeGame",
  components: {
    BengaWord,
  },
  data() {
    return {
      deck: [],
      currentPage: 1,
      windowWidth: typeof window !== "undefined" ? window.innerWidth : 1200,
    };
  },
  computed: {
    cardsPerPage() {
      return this.windowWidth < MOBILE_BREAKPOINT ? 2 : 8;
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.deck.length / this.cardsPerPage));
    },
    paginatedCards() {
      const start = (this.currentPage - 1) * this.cardsPerPage;
      return this.deck.slice(start, start + this.cardsPerPage);
    },
    cardsGridClass() {
      return this.windowWidth < MOBILE_BREAKPOINT
        ? "cards-grid--mobile"
        : "cards-grid--desktop";
    },
    visiblePages() {
      const total = this.totalPages;
      const current = this.currentPage;
      const windowSize = 5;
      let start = Math.max(1, current - Math.floor(windowSize / 2));
      const end = Math.min(total, start + windowSize - 1);
      start = Math.max(1, end - windowSize + 1);
      const pages = [];
      for (let i = start; i <= end; i += 1) {
        pages.push(i);
      }
      return pages;
    },
  },
  methods: {
    getDictionaryUrl(word) {
      return `${LIVING_DICTIONARY_BASE}/${word.toLowerCase()}`;
    },
    buildDeck() {
      return deckData.map((item, index) => ({
        id: index + 1,
        singular: item.singular,
        plural: item.plural,
        translation: item.translation,
        pluralTranslation: item.pluralTranslation || item.translation,
        singularAudioId: item.singularAudioId,
        pluralAudioId: item.pluralAudioId,
        nounClass: item.nounClass,
        conversionSummary: item.conversionSummary,
        flipped: false,
        pluralRevealed: false,
        showTranslation: false,
      }));
    },
    refreshDeck() {
      this.deck = shuffle(this.buildDeck());
      this.currentPage = 1;
    },
    // Vuelve la tarjeta a su estado inicial. `pluralRevealed` se deja como
    // está a propósito: así la cara trasera no cambia de contenido mientras
    // la tarjeta gira de vuelta; se reinicia en el siguiente giro.
    collapse(card) {
      card.flipped = false;
      card.showTranslation = false;
    },
    resetOthers(id) {
      this.deck.forEach((card) => {
        if (card.id !== id) this.collapse(card);
      });
    },
    resetAll() {
      this.deck.forEach(this.collapse);
    },
    // Ciclo: singular -> clase y conversión -> plural -> singular
    flipCard(id) {
      const card = this.deck.find((item) => item.id === id);
      if (!card) return;
      this.resetOthers(id);
      if (!card.flipped) {
        card.pluralRevealed = false;
        card.showTranslation = false;
        card.flipped = true;
      } else if (!card.pluralRevealed) {
        card.pluralRevealed = true;
        card.showTranslation = false;
      } else {
        this.collapse(card);
      }
    },
    toggleTranslation(id) {
      const card = this.deck.find((item) => item.id === id);
      if (!card) return;
      card.showTranslation = !card.showTranslation;
    },
    goToPage(page) {
      this.currentPage = page;
      this.resetAll();
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
        this.resetAll();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1;
        this.resetAll();
      }
    },
    handleResize() {
      this.windowWidth = window.innerWidth;
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages;
      }
    },
  },
  created() {
    this.deck = shuffle(this.buildDeck());
    document.title = "Práctica de Nombres Sustantivos | Portal Benga";
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>

<style scoped lang="scss">
@import "@/styles/variables";
@import "@/styles/mixins";

.noun-class {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: $spacing-lg;

  &__header {
    background: linear-gradient(135deg, #2d5a27 0%, #4a7c4e 100%);
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

  &__instructions {
    background: $color-surface-light;
    padding: $spacing-lg;
    border-radius: $border-radius;
    border-left: 4px solid $color-accent;

    .practice-list {
      margin: 0;
      padding-left: $spacing-lg;

      li {
        margin-bottom: $spacing-md;
        line-height: 1.6;
        color: $color-text-secondary;
      }
    }
  }

  &__cards {
    .cards-toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: $spacing-md;
      margin-bottom: $spacing-lg;

      .deck-count {
        color: $color-text-secondary;
        font-size: 0.9rem;
      }
    }

    .refresh-btn {
      padding: $spacing-sm $spacing-lg;
      background: $color-primary;
      color: white;
      border: none;
      border-radius: $border-radius;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: darken($color-primary, 8%);
        transform: translateY(-2px);
      }
    }

    .cards-grid {
      display: grid;
      gap: $spacing-lg;

      &--desktop {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      }

      &--mobile {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      }
    }

    .flip-card {
      perspective: 1200px;
      min-height: 210px;
      min-width: 0; // evita que el contenido ensanche la celda del grid

      &__inner {
        position: relative;
        width: 100%;
        height: 210px;
        transition: transform 0.6s;
        transform-style: preserve-3d;
      }

      // OJO: no usar `&--flipped &__inner` aquí. Como .flip-card está anidado,
      // `&` es ".noun-class__cards .flip-card" y se duplicaría en el selector.
      &--flipped > .flip-card__inner {
        transform: rotateY(180deg);
      }

      // Solo la cara visible recibe los clics
      &__face--back {
        pointer-events: none;
      }

      &--flipped > .flip-card__inner > .flip-card__face--back {
        pointer-events: auto;
      }

      &--flipped > .flip-card__inner > .flip-card__face--front {
        pointer-events: none;
      }

      &__face {
        position: absolute;
        top: 0;
        left: 0;
        box-sizing: border-box; // padding y borde dentro del 100% (si no, la cara desborda la celda)
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: $spacing-sm;
        padding: $spacing-md;
        border-radius: $border-radius;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
        transform: rotateY(0deg);

        &--front {
          background: #e8f5e9;
          border: 1px solid #c8e6c9;

          :deep(.benga-word__text) {
            color: #1b5e20;
          }
        }

        &--back {
          background: #fff3e0;
          border: 1px solid #ffe0b2;
          transform: rotateY(180deg);

          :deep(.benga-word__text) {
            color: #e65100;
          }
        }
      }

      &__icon {
        position: absolute;
        top: $spacing-sm;
        left: $spacing-sm;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: $border-radius-full;
        font-size: 1.1rem;
        color: $color-primary;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: $color-primary;
          color: white;
          transform: rotate(90deg);
        }
      }

      &__badge {
        position: absolute;
        top: $spacing-sm;
        right: $spacing-sm;
        padding: 2px $spacing-sm;
        background: #1b5e20;
        color: white;
        border-radius: $border-radius-full;
        font-size: 0.7rem;
        font-weight: bold;
        letter-spacing: 0.04em;
        text-transform: uppercase;

        &--class {
          background: #e65100;
        }
      }

      &__word {
        width: 100%;
        justify-content: center;
        text-align: center;
      }

      &__class {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: $spacing-sm;
        text-align: center;

        strong {
          font-size: 1.2rem;
          color: #e65100;
        }

        .flip-card__conversion {
          font-family: $font-mono;
          font-weight: bold;
          color: #1b5e20;
          background: #e8f5e9;
          padding: $spacing-xs $spacing-sm;
          border-radius: $border-radius-sm;
        }

        .flip-card__hint {
          font-size: 0.8rem;
          color: $color-text-secondary;
          font-style: italic;
        }
      }

      .translate-btn {
        margin-top: $spacing-xs;
        padding: $spacing-xs $spacing-sm;
        background: white;
        color: $color-text-secondary;
        border: 1px solid #e0e0e0;
        border-radius: $border-radius-sm;
        font-size: 0.8rem;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          border-color: $color-primary;
          color: $color-primary;
        }
      }
    }

    .pagination {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: $spacing-sm;
      margin-top: $spacing-xl;

      &__arrow,
      &__page {
        min-width: 38px;
        height: 38px;
        padding: 0 $spacing-sm;
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: $border-radius-sm;
        color: $color-text-secondary;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover:not(:disabled) {
          border-color: $color-primary;
          color: $color-primary;
        }

        &:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      }

      &__page--active {
        background: $color-primary;
        border-color: $color-primary;
        color: white;
        font-weight: bold;
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
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }

      &.prev {
        background: $color-secondary;

        &:hover {
          background: darken($color-secondary, 10%);
        }
      }
    }
  }

  @include respond-below("md") {
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

    &__cards {
      .cards-grid--desktop,
      .cards-grid--mobile {
        grid-template-columns: 1fr;
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