<template>
  <div class="noun-class noun-class--7">
    <div class="noun-class__header">
      <h1>Séptima Clase Nominal</h1>
      <p class="subtitle">Singular = Plural</p>
    </div>

    <section class="noun-class__pattern">
      <h2>Patrón de Transformación</h2>
      <div class="pattern-box">
        <div class="pattern-item">
          <span class="pattern-label">Singular:</span>
          <span class="pattern-value singular">hako / tuma / mbadi / ndabo / nganga / sango</span>
        </div>
        <div class="pattern-arrow">→</div>
        <div class="pattern-item">
          <span class="pattern-label">Plural:</span>
          <span class="pattern-value plural">hako / tuma / mbadi / ndabo / nganga / sango</span>
        </div>
      </div>
      <p class="pattern-description">Son muy numerosos, ya que siguen esta regla muchos de los que empiezan por consonante y casi todos los que comienzan con doble consonante. Por los adjuntos que les acompañan se conocerá la diversidad del número.</p>
    </section>

    <section class="noun-class__examples">
      <h2>Ejemplos del libro ({{ words.length }})</h2>
      <div class="examples-grid">
        <div class="example-card" v-for="(word, idx) in words" :key="`word-${idx}`">
          <div class="example-singular">
            <BengaWord
              :word="word.word"
              :audio-id="word.audio"
              :meaning="word.meaning"
              :dictionary-url="getDictionaryUrl(word.word)"
              block
            />
          </div>
        </div>
      </div>
    </section>

    <section class="noun-class__concepts">
      <h2>Conceptos Clave</h2>
      <div class="concepts-list">
        <div class="concept-item">
          <h4>Invariable</h4>
          <p>En esta clase, la forma del nombre no cambia entre singular y plural.</p>
        </div>
        <div class="concept-item">
          <h4>Contexto gramatical</h4>
          <p>El número se infiere por los modificadores, los adjetivos o el contexto de la frase.</p>
        </div>
        <div class="concept-item">
          <h4>Gran grupo</h4>
          <p>Muchos de los nombres que empiezan por consonante y casi todos los que comienzan con doble consonante siguen esta regla.</p>
        </div>
      </div>
    </section>

    <section class="noun-class__practice">
      <h2>Para Practicar</h2>
      <ol class="practice-list">
        <li>Observa que la forma del nombre no cambia entre singular y plural.</li>
        <li>Busca el número por el adjetivo o por el contexto en la oración.</li>
        <li>Memoriza ejemplos comunes para reconocer la clase rápidamente.</li>
      </ol>
    </section>

    <section class="noun-class__nav">
      <router-link to="/capitulo-2/clase-6" class="nav-link prev">← Clase 6</router-link>
      <router-link to="/capitulo-2/irregulares" class="nav-link next">Irregulares →</router-link>
    </section>
  </div>
</template>

<script>
import BengaWord from '@/components/content/BengaWord.vue'

const LIVING_DICTIONARY_BASE = 'https://livingdictionaries.app/benga/entry'

export default {
  name: 'NounClass7',
  components: {
    BengaWord
  },
  data() {
    return {
      words: [
        { word: 'Fala', audio: 'fala', meaning: 'Francés' },
        { word: 'Fato', audio: 'fato', meaning: 'Media, calceta' },
        { word: 'Fula', audio: 'fula', meaning: 'Franco, moneda' },
        { word: 'Dyate', audio: 'dyate', meaning: 'Cinta del sombrero' },
        { word: 'Hako', audio: 'hako', meaning: 'Hormiga' },
        { word: 'Hapi', audio: 'hapi', meaning: 'Cerradura' },
        { word: 'Hoūe', audio: 'ho_u_e', meaning: 'Pelo, cabello' },
        { word: 'Jângâ', audio: 'j_a_ng_a_', meaning: 'Temor (clase de)' },
        { word: 'Jonda', audio: 'jonda', meaning: 'Rana' },
        { word: 'Jumba', audio: 'jumba', meaning: 'Carga' },
        { word: 'Kabala', audio: 'kabala', meaning: 'Caballo' },
        { word: 'Kâtâ', audio: 'k_a_t_a_', meaning: 'Tranca' },
        { word: 'Kono', audio: 'kono', meaning: 'Bisagra' },
        { word: 'Kuma', audio: 'kuma', meaning: 'Fama, renombre' },
        { word: 'Mâkâ', audio: 'm_a_k_a_', meaning: 'Tienda de campaña' },
        { word: 'Pago', audio: 'pago', meaning: 'Tributo' },
        { word: 'Paha', audio: 'paha', meaning: 'Rama' },
        { word: 'Panga', audio: 'panga', meaning: 'Cadena, promesa' },
        { word: 'Tagulu', audio: 'tagulu', meaning: 'Mesa' },
        { word: 'Tina', audio: 'tina', meaning: 'Razón, causa' },
        { word: 'Tito', audio: 'tito', meaning: 'Bestia, animal' },
        { word: 'Toko', audio: 'toko', meaning: 'Cuchara' },
        { word: 'Tolongo', audio: 'tolongo', meaning: 'Baúl' },
        { word: 'Tombo', audio: 'tombo', meaning: 'Aguja' },
        { word: 'Tongo', audio: 'tongo', meaning: 'Manantial' },
        { word: 'Tudi', audio: 'tudi', meaning: 'Disgusto, fastidio' },
        { word: 'Tuma', audio: 'tuma', meaning: 'Tenedor' },
        { word: 'Tungu', audio: 'tungu', meaning: 'Bahía' },
        { word: 'Tyoli', audio: 'tyoli', meaning: 'Despensero' },
        { word: 'Mbadi', audio: 'mbadi', meaning: 'Ardilla' },
        { word: 'Mbalanga', audio: 'malanga', meaning: 'Antilope' },
        { word: 'Mbanja', audio: 'mbanja', meaning: 'Bambú, costilla' },
        { word: 'Mbângâ', audio: 'mb_a_ng_a_', meaning: 'Patata' },
        { word: 'Mbuja', audio: 'mbuja', meaning: 'Red' },
        { word: 'Mbūa', audio: 'mb_u_a', meaning: 'Perro' },
        { word: 'Ndabo', audio: 'ndabo', meaning: 'Casa' },
        { word: 'Ndaga', audio: 'ndaga', meaning: 'Palabra, razonamiento' },
        { word: 'Ndâtâ', audio: 'nd_a_t_a_', meaning: 'Sueño, desvario' },
        { word: 'Ndembo', audio: 'ndembo', meaning: 'Señal' },
        { word: 'Ndoba', audio: 'ndoba', meaning: 'Enemigo' },
        { word: 'Ndomina', audio: 'ndomina', meaning: 'Tío materno' },
        { word: 'Ndonda', audio: 'ndonga', meaning: 'Cosecha, siega' },
        { word: 'Ndonga', audio: 'ndonga', meaning: 'Confianza' },
        { word: 'Ndongo', audio: 'ndongo', meaning: 'Pimiento' },
        { word: 'Ndumba', audio: 'ndumba', meaning: 'Huésped' },
        { word: 'Penge', audio: 'penge', meaning: 'Ulcera' },
        { word: 'Pani', audio: 'pani', meaning: 'Costumbre' },
        { word: 'Pavo', audio: 'pavo', meaning: 'Cuchillo' },
        { word: 'Pândâ', audio: 'p_a_nd_a_', meaning: 'Casco' },
        { word: 'Penda', audio: 'penda', meaning: 'Controversia' },
        { word: 'Pembē', audio: 'pemb_e_', meaning: 'Pan, greda' },
        { word: 'Pika', audio: 'pika', meaning: 'Riñón' },
        { word: 'Pimba', audio: 'pimba', meaning: 'Coraje' },
        { word: 'Pita', audio: 'pita', meaning: 'Pólvora' },
        { word: 'Pogo', audio: 'pogo', meaning: 'Arpón' },
        { word: 'Poke', audio: 'poke', meaning: 'Sordera' },
        { word: 'Poti', audio: 'poti', meaning: 'Maíz, grano' },
        { word: 'Pudi', audio: 'pudi', meaning: 'Aire, aliento' },
        { word: 'Pūisi', audio: 'p_u_isi', meaning: 'Gato' },
        { word: 'Sago', audio: 'sago', meaning: 'Jabón' },
        { word: 'Sango', audio: 'sango', meaning: 'Fiesta, noticia' },
        { word: 'Senge', audio: 'senge', meaning: 'Palangana' },
        { word: 'Sikulu', audio: 'sikulu', meaning: 'Escuela' },
        { word: 'Nenge', audio: 'nenge', meaning: 'Isla' },
        { word: 'Ngabo', audio: 'ngabo', meaning: 'Ración, porción' },
        { word: 'Ngaho', audio: 'ngaho', meaning: 'Alambre' },
        { word: 'Ngama', audio: 'ngama', meaning: 'Defensa' },
        { word: 'Ngambi', audio: 'ngambi', meaning: 'Ira, rencor' },
        { word: 'Ngando', audio: 'ngando', meaning: 'Cocodrilo' },
        { word: 'Ngandi', audio: 'ngandi', meaning: 'Globo, bola' },
        { word: 'Ngani', audio: 'ngani', meaning: 'Juego de manos' },
        { word: 'Nganga', audio: 'nuega', meaning: 'Médico' },
        { word: 'Nganiyango', audio: 'aniyango', meaning: 'Acceso, entrada' },
        { word: 'Ngâmbi', audio: 'ng_u_mbi', meaning: 'Harpa' },
        { word: 'Ngândâ', audio: 'ng_u_nda', meaning: 'Habas' },
        { word: 'Ngâūē', audio: 'ng_a_u_e', meaning: 'Capitán' },
        { word: 'Ngejangeja', audio: 'gejangeja', meaning: 'Cristal' },
        { word: 'Ngenga', audio: 'ngenga', meaning: 'Ciempiés' },
        { word: 'Ngomba', audio: 'ngomba', meaning: 'Puerco espín' },
        { word: 'Ngonga', audio: 'ngonda', meaning: 'Pecho' },
        { word: 'Ngudi', audio: 'ngudi', meaning: 'Fuerza, voluntad' },
        { word: 'Ngumu', audio: 'ngumu', meaning: 'Jefe, principal' },
        { word: 'Njadi', audio: 'njadi', meaning: 'Yunque' },
        { word: 'Njadi', audio: 'njadi', meaning: 'Primogenito' },
        { word: 'Nyangūa ditâ', audio: 'nyang_u_a_dita', meaning: 'Timpano, oido' },
        { word: 'Nyuūē', audio: 'nyu_u_e_', meaning: 'Cabello blanco, o canas' },
        { word: 'Nyeti', audio: 'nyeti', meaning: 'Chorro violento' },
        { word: 'Nyēnjē', audio: 'ny_e_nj_e_', meaning: 'Cangrejo' }
      ]
    }
  },
  methods: {
    getDictionaryUrl(word) {
      return `${LIVING_DICTIONARY_BASE}/${word.toLowerCase()}`
    }
  },
  created() {
    document.title = 'Séptima Clase Nominal | Portal Benga'
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables';
@import '@/styles/mixins';

.noun-class {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: $spacing-lg;

  &__header {
    background: linear-gradient(135deg, #2D5A27 0%, #4A7C4E 100%);
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

  &__pattern {
    .pattern-box {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: $spacing-lg;
      background: $color-surface-light;
      padding: 2rem;
      border-radius: $border-radius;
      margin-bottom: $spacing-md;

      .pattern-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: $spacing-sm;

        .pattern-label {
          font-weight: bold;
          color: $color-text-secondary;
          font-size: 0.9rem;
        }

        .pattern-value {
          font-size: 1.8rem;
          font-weight: bold;
          font-family: $font-mono;
          padding: $spacing-md $spacing-lg;
          border-radius: $border-radius;

          &.singular {
            background: #E8F5E9;
            color: #1B5E20;
          }

          &.plural {
            background: #FFF3E0;
            color: #E65100;
          }
        }
      }

      .pattern-arrow {
        font-size: 2rem;
        color: $color-accent;
        font-weight: bold;
      }
    }

    .pattern-description {
      text-align: center;
      color: $color-text-secondary;
      font-style: italic;
    }
  }

  .section-note {
    margin: 0 0 $spacing-lg;
    padding: $spacing-md;
    background: #FFFDE7;
    border-left: 4px solid $color-accent;
    color: $color-text-secondary;
  }

  .example-note {
    margin: $spacing-lg 0 0;
    font-size: 0.9rem;
    color: $color-text-muted;
    font-style: italic;
  }

  &__examples,
  &__variants,
  &__exceptions {
    .examples-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: $spacing-md;
    }

    .example-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: $border-radius;
      padding: $spacing-md;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      &:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        transform: translateY(-2px);
      }

      .example-singular {
        .benga-word--block {
          background: #E8F5E9;
        }

        :deep(.benga-word__text) {
          color: #1B5E20;
        }
      }

      :deep(.benga-word__meaning) {
        max-width: 100%;
        min-width: 50%;
        flex: 1;
      }
    }
  }

  &__concepts {
    .concepts-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: $spacing-lg;

      .concept-item {
        background: linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 100%);
        padding: $spacing-lg;
        border-radius: $border-radius;
        border-left: 4px solid $color-primary;

        h4 {
          margin: 0 0 $spacing-sm 0;
          color: $color-primary;
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

    .practice-list {
      margin: 0;
      padding-left: $spacing-lg;

      li {
        margin-bottom: $spacing-md;
        line-height: 1.6;
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
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      }

      &.prev {
        background: $color-secondary;

        &:hover {
          background: darken($color-secondary, 10%);
        }
      }
    }
  }

  @include respond-below('md') {
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

    &__nav {
      flex-direction: column;

      .nav-link {
        text-align: center;
      }
    }
  }
}
</style>
