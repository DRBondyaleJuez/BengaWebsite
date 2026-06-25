<template>
  <div class="irregular-nouns">
    <div class="irregular-nouns__header">
      <h1>Nombres Irregulares</h1>
      <p>Excepciones que no siguen los patrones estándar</p>
    </div>

    <section class="irregular-nouns__intro">
      <p>Aunque el sistema de siete clases es muy regular, el Benga contiene un número de nombres que no cumplen con los patrones esperados. Estos se dividen en dos categorías principales: nombres que carecen de singular y nombres que carecen de plural.</p>
    </section>

    <section class="irregular-nouns__no-singular">
      <h2>Nombres que carecen de singular</h2>
      <p class="description">Son generalmente nombres que expresan cantidad de algo, especialmente de líquidos, y los bengas jamás los usan en singular sino siempre en plural, tomando los adjuntos de éste.</p>
      
      <div class="examples-grid">
        <div class="example-card" v-for="(example, idx) in pluralOnlyNouns" :key="`plural-${idx}`">
          <div class="example-form">
            <span class="label">Forma principal (plural):</span>
            <span class="value">{{ example.word }}</span>
          </div>
          <div class="example-meaning">
            <strong>{{ example.meaning }}</strong>
          </div>
        </div>
      </div>
    </section>

    <section class="irregular-nouns__no-plural">
      <h2>Nombres que carecen de plural</h2>
      <p class="description">Otros muchos nombres hay que no se usan sino en singular, los cuales toman sus adjuntos correspondientes a dicho número singular.</p>
      
      <div class="examples-grid">
        <div class="example-card" v-for="(example, idx) in singularOnlyNouns" :key="`singular-${idx}`">
          <div class="example-form">
            <span class="label">Forma principal (singular):</span>
            <span class="value">{{ example.word }}</span>
          </div>
          <div class="example-meaning">
            <strong>{{ example.meaning }}</strong>
          </div>
        </div>
      </div>
    </section>

    <section class="irregular-nouns__notes">
      <h2>Notas Importantes</h2>
      <div class="notes-list">
        <div class="note-item">
          <h4>Patrón semántico</h4>
          <p>Los nombres sin singular suelen expresar conceptos masivos o colectivos (líquidos, cantidades, masas)</p>
        </div>
        <div class="note-item">
          <h4>Uso en contexto</h4>
          <p>Aunque un nombre carezca de plural gramatical, la cantidad se expresa mediante otros medios sintácticos</p>
        </div>
        <div class="note-item">
          <h4>Frecuencia</h4>
          <p>Los nombres irregulares son relativamente pocos en comparación con el total de vocabulario nominal</p>
        </div>
        <div class="note-item">
          <h4>Aprendizaje</h4>
          <p>Es recomendable memorizarlos explícitamente porque no siguen patrones que se puedan inferir</p>
        </div>
      </div>
    </section>

    <section class="irregular-nouns__practice">
      <h2>Para Practicar</h2>
      <ol>
        <li>Memoriza la lista de nombres que carecen de singular y plural</li>
        <li>Úsalos en frases con adjetivos para practicar la concordancia correcta</li>
        <li>Presta atención a cómo se expresan la cantidad y modificaciones con estos nombres</li>
        <li>Crea una lista personal de otros irregulares que encuentres en tu estudio</li>
      </ol>
    </section>

    <section class="irregular-nouns__nav">
      <router-link to="/capitulo-2/clase-7" class="nav-link prev">← Clase 7 (Invariables)</router-link>
      <router-link to="/capitulo-2/verbales" class="nav-link next">Nombres Verbales →</router-link>
    </section>
  </div>
</template>

<script>
export default {
  name: 'IrregularNouns',
  data() {
    return {
      pluralOnlyNouns: [
        { word: 'Hosá', meaning: 'Cabellera, pelo' },
        { word: 'Honji', meaning: 'Heno, yerba' },
        { word: 'Jubu', meaning: 'Ceniza' },
        { word: 'Mavule', meaning: 'Aceite' },
        { word: 'Miba', meaning: 'Agua' },
        { word: 'Makiya', meaning: 'Sangre' },
        { word: 'Maku', meaning: 'Licor, caña' },
        { word: 'Tito', meaning: 'Animal' }
      ],
      singularOnlyNouns: [
        { word: 'Háká', meaning: 'Ápice, punta' },
        { word: 'Un', meaning: 'Lona' },
        { word: 'Yadi', meaning: 'Agonía' },
        { word: 'Ngabo', meaning: 'Porción, división' },
        { word: 'Tina', meaning: 'Origen, causa' },
        { word: 'Pákaipaka', meaning: 'Verdad' },
        { word: 'Kála', meaning: 'Reloj de caja' },
        { word: 'Ndiba', meaning: 'Profundidad' },
        { word: 'Kapi', meaning: 'Remo' },
        { word: 'Kama', meaning: 'Ciento' },
        { word: 'Nyati', meaning: 'Buey' },
        { word: 'Pia', meaning: 'Pólvora' },
        { word: 'Ngaanjangaanja', meaning: 'Diligencia' },
        { word: 'Boká', meaning: 'Estación lluviosa' },
        { word: 'Bulu', meaning: 'Noche' }
      ]
    };
  },
  created() {
    document.title = 'Nombres Irregulares | Portal Benga';
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/variables';
@import '@/styles/mixins';

.irregular-nouns {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: $spacing-lg;

  &__header {
    background: linear-gradient(135deg, #C0392B 0%, #E74C3C 100%);
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

  &__intro {
    background: $color-surface-light;
    padding: $spacing-lg;
    border-radius: $border-radius;
    border-left: 4px solid #C0392B;
    margin-bottom: $spacing-xl;
  }

  section {
    margin-bottom: $spacing-xl;

    h2 {
      color: #C0392B;
      border-bottom: 2px solid #C0392B;
      padding-bottom: $spacing-md;
      margin-bottom: $spacing-lg;
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
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
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

  &__notes {
    .notes-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: $spacing-lg;

      .note-item {
        background: linear-gradient(135deg, #FCE4EC 0%, #F3E5F5 100%);
        padding: $spacing-lg;
        border-radius: $border-radius;
        border-left: 4px solid #8E44AD;

        h4 {
          margin: 0 0 $spacing-sm 0;
          color: #8E44AD;
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

  &__nav {
    display: flex;
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
      font-weight: bold;
      transition: all 0.3s ease;

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

    &__nav {
      flex-direction: column;
    }
  }
}
</style>
