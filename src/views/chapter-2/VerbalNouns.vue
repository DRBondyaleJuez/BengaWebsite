<template>
  <div class="verbal-nouns">
    <div class="verbal-nouns__header">
      <h1>Nombres Verbales</h1>
      <p>Nominalizaciones derivadas de verbos</p>
    </div>

    <section class="verbal-nouns__intro">
      <p>Los nombres verbales son aquellos que se derivan de verbos. En Benga, pueden dividirse en tres clases principales según su formación y significado.</p>
    </section>

    <!-- Class 1: Abstract Nouns -->
    <section class="verbal-nouns__class-1">
      <h2>CLASE PRIMERA: Nombres Abstractos</h2>
      <p class="rule">Estos se forman de la segunda persona del singular del imperativo, quitándole la última sílaba y anteponiendo a la palabra la letra 'i'.</p>
      
      <div class="formation-examples">
        <div class="formation-row" v-for="(example, idx) in abstractNouns" :key="`abstract-${idx}`">
          <div class="formation-group">
            <span class="label">Imperativo:</span>
            <span class="value">{{ example.imperative }}</span>
          </div>
          <span class="arrow">→</span>
          <div class="formation-group">
            <span class="label">Nombre:</span>
            <span class="value">{{ example.nominalForm }}</span>
          </div>
          <div class="formation-meaning">{{ example.meaning }}</div>
        </div>
      </div>
      <p class="classification-note">En la clasificación, estos nombres pertenecen a la segunda clase en singular.</p>
    </section>

    <!-- Class 2: Action Nouns -->
    <section class="verbal-nouns__class-2">
      <h2>CLASE SEGUNDA: Nombres de Acción</h2>
      <p class="rule">Estos se forman asimismo de la segunda persona del singular del imperativo, quitando la última sílaba y omitiendo o mudando la vocal que le precede.</p>
      
      <div class="formation-examples">
        <div class="formation-row" v-for="(example, idx) in actionNouns" :key="`action-${idx}`">
          <div class="formation-group">
            <span class="label">Imperativo:</span>
            <span class="value">{{ example.imperative }}</span>
          </div>
          <span class="arrow">→</span>
          <div class="formation-group">
            <span class="label">Agent/Doer:</span>
            <span class="value">{{ example.nominalForm }}</span>
          </div>
          <div class="formation-meaning">{{ example.meaning }}</div>
        </div>
      </div>
      <p class="classification-note">Estos nombres pertenecen a la tercera clase en la formación del plural.</p>
    </section>

    <!-- Class 3: Manner Nouns -->
    <section class="verbal-nouns__class-3">
      <h2>CLASE TERCERA: Nombres de Modo</h2>
      <p class="rule">Estos se reforman mudando la 'u' inicial de los nombres de acción, y añadiendo 'di' a su terminación.</p>
      
      <div class="formation-examples">
        <div class="formation-row" v-for="(example, idx) in mannerNouns" :key="`manner-${idx}`">
          <div class="formation-group">
            <span class="label">Nombre de Acción:</span>
            <span class="value">{{ example.actionForm }}</span>
          </div>
          <span class="arrow">→</span>
          <div class="formation-group">
            <span class="label">Modo:</span>
            <span class="value">{{ example.nominalForm }}</span>
          </div>
          <div class="formation-meaning">{{ example.meaning }}</div>
        </div>
      </div>
    </section>

    <!-- Key Concepts -->
    <section class="verbal-nouns__concepts">
      <h2>Conceptos Clave</h2>
      <div class="concepts-grid">
        <div class="concept-card">
          <h4>Prefijo i-</h4>
          <p>Marca nombres abstractos derivados de verbos, similar a sufijos en otras lenguas</p>
        </div>
        <div class="concept-card">
          <h4>Prefijo u-</h4>
          <p>Crea nombres de agente o executor de una acción</p>
        </div>
        <div class="concept-card">
          <h4>Sufijo -di</h4>
          <p>Expresa el modo o manera en que se realiza una acción</p>
        </div>
        <div class="concept-card">
          <h4>Derivación Regular</h4>
          <p>Estos patrones son productivos - pueden aplicarse a muchos verbos para crear nuevos nombres</p>
        </div>
      </div>
    </section>

    <!-- Examples of Productivity -->
    <section class="verbal-nouns__productivity">
      <h2>Productividad de los Patrones</h2>
      <p>Estos patrones de formación son muy productivos en Benga. Puedes aplicarlos a nuevos verbos para crear nombres verbales según sea necesario. Por ejemplo:</p>
      
      <div class="productivity-example">
        <p><strong>Si aprendes un verbo nuevo:</strong> Longaka "edifica"</p>
        <p><strong>Puedes formar:</strong></p>
        <ul>
          <li><span class="form">ilonga</span> (acción de edificar → edificio)</li>
          <li><span class="form">ulongi</span> (quien edifica → arquitecto)</li>
          <li><span class="form">ilongidi</span> (manera de edificar → modo de construcción)</li>
        </ul>
      </div>
    </section>

    <!-- Practice -->
    <section class="verbal-nouns__practice">
      <h2>Para Practicar</h2>
      <ol>
        <li>Memoriza los tres patrones de formación (i-, u-, -di)</li>
        <li>Practica transformando verbos conocidos en sus formas nominales</li>
        <li>Intenta aplicar los patrones a verbos nuevos que encuentres</li>
        <li>Usa los nombres verbales en contexto de frase</li>
      </ol>
    </section>

    <!-- Navigation -->
    <section class="verbal-nouns__nav">
      <router-link to="/capitulo-2/irregulares" class="nav-link prev">← Nombres Irregulares</router-link>
      <router-link to="/capitulo-2" class="nav-link next">Volver a Capítulo 2 →</router-link>
    </section>
  </div>
</template>

<script>
export default {
  name: 'VerbalNouns',
  data() {
    return {
      abstractNouns: [
        { imperative: 'Tánddká', nominalForm: 'itánde', meaning: 'amor' },
        { imperative: 'Binaka', nominalForm: 'ibina', meaning: 'odio' },
        { imperative: 'Kalaka', nominalForm: 'ikala', meaning: 'razonamiento' },
        { imperative: 'Langaka', nominalForm: 'ilanga', meaning: 'lectura' },
        { imperative: 'Longaka', nominalForm: 'ilonga', meaning: 'edificio' },
        { imperative: 'Léndeké', nominalForm: 'ilende', meaning: 'escritura' },
        { imperative: 'Kalakia', nominalForm: 'ikalo', meaning: 'oración' },
        { imperative: 'Janjaka', nominalForm: 'ijanja', meaning: 'trabajo' }
      ],
      actionNouns: [
        { imperative: 'Longaka', nominalForm: 'ulongi', meaning: 'arquitecto' },
        { imperative: 'Langaka', nominalForm: 'ulangi', meaning: 'lector' },
        { imperative: 'Kalaka', nominalForm: 'ukali', meaning: 'orador' },
        { imperative: 'Lendiki', nominalForm: 'ulendi', meaning: 'escritor' }
      ],
      mannerNouns: [
        { actionForm: 'Ulongi', nominalForm: 'ilongidi', meaning: 'modo de construir' },
        { actionForm: 'Ulangi', nominalForm: 'ilangidi', meaning: 'modo de leer' },
        { actionForm: 'Ukali', nominalForm: 'ikalidi', meaning: 'modo de hablar' }
      ]
    };
  },
  created() {
    document.title = 'Nombres Verbales | Portal Benga';
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/variables';
@import '@/styles/mixins';

.verbal-nouns {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: $spacing-lg;

  &__header {
    background: linear-gradient(135deg, #8E44AD 0%, #9B59B6 100%);
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
    border-left: 4px solid #8E44AD;
    margin-bottom: $spacing-xl;
  }

  section {
    margin-bottom: $spacing-xl;

    h2 {
      color: #8E44AD;
      border-bottom: 2px solid #8E44AD;
      padding-bottom: $spacing-md;
      margin-bottom: $spacing-lg;
    }

    .rule {
      background: #F3E5F5;
      padding: $spacing-md;
      border-radius: $border-radius;
      border-left: 4px solid #8E44AD;
      margin-bottom: $spacing-lg;
      font-style: italic;
    }
  }

  .formation-examples {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;

    .formation-row {
      display: grid;
      grid-template-columns: 1fr auto 1fr 1fr;
      gap: $spacing-md;
      align-items: center;
      padding: $spacing-md;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: $border-radius;
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }

      .formation-group {
        display: flex;
        flex-direction: column;
        gap: $spacing-xs;

        .label {
          font-size: 0.8rem;
          color: $color-text-muted;
          font-weight: bold;
          text-transform: uppercase;
        }

        .value {
          font-family: $font-mono;
          font-weight: bold;
          color: $color-primary;
          font-size: 1.1rem;
        }
      }

      .arrow {
        color: $color-accent;
        font-size: 1.5rem;
        font-weight: bold;
      }

      .formation-meaning {
        color: $color-text-secondary;
        font-style: italic;
      }
    }
  }

  .classification-note {
    font-size: 0.9rem;
    color: $color-text-muted;
    background: #FFFDE7;
    padding: $spacing-md;
    border-radius: $border-radius;
  }

  &__concepts {
    .concepts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: $spacing-lg;

      .concept-card {
        background: linear-gradient(135deg, #F3E5F5 0%, #EDE7F6 100%);
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

  &__productivity {
    background: $color-surface-light;
    padding: $spacing-lg;
    border-radius: $border-radius;
    border-left: 4px solid $color-accent;

    .productivity-example {
      background: white;
      padding: $spacing-lg;
      border-radius: $border-radius;
      margin-top: $spacing-md;

      p {
        margin: 0 0 $spacing-sm 0;

        &:first-child {
          font-weight: bold;
        }

        &:nth-child(2) {
          font-weight: bold;
          margin-bottom: $spacing-md;
        }
      }

      ul {
        margin: 0;
        padding-left: $spacing-lg;
        list-style: none;

        li {
          margin-bottom: $spacing-sm;

          .form {
            background: #FFE0B2;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: $font-mono;
            font-weight: bold;
            color: $color-primary;
          }
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

    .formation-examples .formation-row {
      grid-template-columns: 1fr;

      .arrow {
        display: none;
      }
    }

    &__nav {
      flex-direction: column;
    }
  }
}
</style>
