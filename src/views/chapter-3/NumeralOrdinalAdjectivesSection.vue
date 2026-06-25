<template>
  <div class="numeral-ordinal">
    <div class="numeral-ordinal__header">
      <h1>Numerales y Ordinales</h1>
      <p class="subtitle">Sistema decimal y números ordinales</p>
    </div>

    <!-- Overview -->
    <section class="numeral-ordinal__overview">
      <p>
        El modo de contar de los Bengas es rigurosamente decimal. Al llegar a diez, 
        tiene lugar la reduplicación: diez y uno, diez y dos, etc.; dos dieces, tres dieces, etc., hasta ciento.
      </p>
    </section>

    <!-- Cardinal Numbers -->
    <section class="numeral-ordinal__cardinals">
      <h2>Números Cardinales</h2>
      
      <!-- 1-10 -->
      <div class="cardinal-group">
        <h3>Números del 1 al 10</h3>
        <div class="numbers-grid">
          <div class="number-card" v-for="num in cardinals_1_10" :key="`card1-${num.number}`">
            <span class="number-arabic">{{ num.number }}</span>
            <span class="number-bengaform">{{ num.bengaForm }}</span>
            <span class="number-spanish">{{ num.spanishForm }}</span>
          </div>
        </div>
      </div>

      <!-- 11-20 -->
      <div class="cardinal-group">
        <h3>Números del 11 al 20</h3>
        <div class="numbers-list">
          <div class="number-row" v-for="num in cardinals_11_20" :key="`card11-${num.number}`">
            <span class="number-arabic">{{ num.number }}</span>
            <span class="number-bengaform">{{ num.bengaForm }}</span>
            <span class="number-spanish">{{ num.spanishForm }}</span>
          </div>
        </div>
      </div>

      <!-- 21-100 -->
      <div class="cardinal-group">
        <h3>Números Mayores (21 a 100+)</h3>
        <div class="numbers-list">
          <div class="number-row" v-for="num in cardinals_21_100" :key="`card21-${num.number}`">
            <span class="number-arabic">{{ num.number }}</span>
            <span class="number-bengaform">{{ num.bengaForm }}</span>
            <span class="number-spanish">{{ num.spanishForm }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Inflections -->
    <section class="numeral-ordinal__inflections">
      <h2>Inflexiones de los Primeros Numerales</h2>
      <p class="inflections-note">
        Los cinco primeros numerales (1-5) son variables y están sujetos a cambio según la clase del sustantivo.
      </p>
      <div class="inflections-table">
        <div class="table-header">
          <div class="cell">Clase</div>
          <div class="cell">Uno</div>
          <div class="cell">Dos</div>
          <div class="cell">Tres</div>
          <div class="cell">Cuatro</div>
          <div class="cell">Cinco</div>
        </div>
        <div class="table-body">
          <div class="table-row" v-for="cls in numeralInflections" :key="`class-${cls.classId}`">
            <div class="cell class-name">{{ cls.className }}</div>
            <div class="cell">{{ cls.uno }}</div>
            <div class="cell">{{ cls.dos }}</div>
            <div class="cell">{{ cls.tres }}</div>
            <div class="cell">{{ cls.cuatro }}</div>
            <div class="cell">{{ cls.cinco }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Ordinal Numbers -->
    <section class="numeral-ordinal__ordinals">
      <h2>Números Ordinales</h2>
      <p class="ordinals-note">
        Los ordinales propiamente dichos no los conocen los Bengas; sin embargo, hay un modo general de expresarlos.
        Este método consiste en prefijar el número cardinal en caso posesivo.
      </p>
      <div class="ordinals-table">
        <div class="table-header">
          <div class="cell">Posición</div>
          <div class="cell">Preposición</div>
          <div class="cell">Cardinal</div>
          <div class="cell">Ordinal</div>
          <div class="cell">Significado</div>
        </div>
        <div class="table-body">
          <div class="table-row" v-for="ord in ordinals" :key="`ord-${ord.class}`">
            <div class="cell">{{ ord.class }}</div>
            <div class="cell bengaform">{{ ord.preposition }}</div>
            <div class="cell bengaform">{{ ord.cardinal }}</div>
            <div class="cell bengaform">{{ ord.ordinal }}</div>
            <div class="cell">{{ ord.spanishMeaning }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Distributives -->
    <section class="numeral-ordinal__distributives">
      <h2>Números Distributivos</h2>
      <p class="distributives-note">
        Los distributivos se forman repitiendo los cardinales.
      </p>
      <div class="distributives-list">
        <div class="distributive-item" v-for="(dist, idx) in distributives" :key="`dist-${idx}`">
          <span class="bengaform">{{ dist.bengaForm }}</span>
          <span class="meaning">{{ dist.spanishMeaning }}</span>
        </div>
      </div>
    </section>

    <!-- Special Uses -->
    <section class="numeral-ordinal__special">
      <h2>Usos Especiales de Numerales</h2>
      <div class="special-methods">
        <div class="method-card">
          <h3>Método de los Dedos</h3>
          <p>
            Mostrar los dedos levantados y esperar a que los oyentes digan el número en voz alta. 
            Este método es muy eficaz para representar centenas, decenas y unidades sin equívocos.
          </p>
        </div>
        <div class="method-card">
          <h3>Método de Repetición Rápida</h3>
          <p>
            Repetir una palabra diez, quince o veinte veces con mucha prisa para indicar número, 
            calidad o cantidad extraordinaria. Es propio de la narración, especialmente en el sexo femenino.
          </p>
        </div>
      </div>
    </section>

    <!-- Key Notes -->
    <section class="numeral-ordinal__notes">
      <h2>Notas Importantes</h2>
      <div class="notes-list">
        <div class="note-item" v-for="(note, idx) in notes" :key="`note-${idx}`">
          <span class="note-number">{{ idx + 1 }}</span>
          <span class="note-text">{{ note }}</span>
        </div>
      </div>
    </section>

    <!-- Navigation -->
    <div class="numeral-ordinal__navigation">
      <router-link to="/capitulo-3/comparativos-superlativos" class="nav-button nav-button--back">
        ← Comparativos y Superlativos
      </router-link>
      <router-link to="/capitulo-3" class="nav-button nav-button--index">
        Índice del Capítulo
      </router-link>
    </div>
  </div>
</template>

<script>
import numeralsData from '@/data/chapter-3/numerals-ordinals.json';

export default {
  name: 'NumeralOrdinalAdjectivesSection',
  data() {
    return {
      cardinals_1_10: [],
      cardinals_11_20: [],
      cardinals_21_100: [],
      numeralInflections: [],
      ordinals: [],
      distributives: [],
      notes: []
    }
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.cardinals_1_10 = numeralsData.cardinalNumbers['1-10'];
      this.cardinals_11_20 = numeralsData.cardinalNumbers['11-20'];
      this.cardinals_21_100 = numeralsData.cardinalNumbers['21-100'].concat(
        numeralsData.cardinalNumbers['101-1000']
      );
      this.numeralInflections = numeralsData.numeralInflections.classes;
      this.ordinals = numeralsData.ordinalNumbers.ordinals;
      this.distributives = numeralsData.distributives.examples;
      this.notes = numeralsData.notes;
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables';
@import '@/styles/mixins';

.numeral-ordinal {
  @include page-container;

  &__header {
    text-align: center;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 2px solid $color-primary;

    h1 {
      font-size: 2.2rem;
      color: $color-primary;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      font-size: 1rem;
      color: $color-text-secondary;
    }
  }

  &__overview {
    background: $color-background-light;
    padding: 1.5rem;
    border-radius: $border-radius-base;
    margin-bottom: 2.5rem;
    border-left: 4px solid $color-primary;

    p {
      color: $color-text-primary;
      line-height: 1.8;
      margin: 0;
    }
  }

  &__cardinals,
  &__inflections,
  &__ordinals,
  &__distributives,
  &__special,
  &__notes {
    margin-bottom: 3rem;

    h2 {
      font-size: 1.6rem;
      color: $color-heading-dark;
      margin-bottom: 1.5rem;
    }
  }
}

.cardinal-group {
  margin-bottom: 2.5rem;

  h3 {
    font-size: 1.2rem;
    color: $color-primary;
    margin-bottom: 1rem;
    padding-left: 1rem;
    border-left: 3px solid $color-primary;
  }
}

.numbers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.number-card {
  @include card-base;
  padding: 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: all $transition-base;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba($color-primary, 0.1);
  }

  .number-arabic {
    font-size: 1.5rem;
    font-weight: bold;
    color: $color-primary;
  }

  .number-bengaform {
    font-weight: 600;
    color: $color-text-primary;
  }

  .number-spanish {
    font-size: 0.9rem;
    color: $color-text-secondary;
  }
}

.numbers-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.number-row {
  display: grid;
  grid-template-columns: 50px 150px 1fr;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: white;
  border-radius: 4px;
  border-left: 3px solid #e0e0e0;
  align-items: center;

  &:hover {
    border-left-color: $color-primary;
    background-color: #f9f9f9;
  }

  .number-arabic {
    font-weight: bold;
    color: $color-primary;
  }

  .number-bengaform {
    font-weight: 600;
    color: $color-text-primary;
  }

  .number-spanish {
    color: $color-text-secondary;
  }
}

.inflections-note,
.ordinals-note,
.distributives-note {
  color: $color-text-secondary;
  margin-bottom: 1.5rem;
  font-style: italic;
}

.inflections-table,
.ordinals-table {
  background: white;
  border-radius: $border-radius-base;
  overflow-x: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.table-header {
  display: grid;
  background-color: $color-primary;
  color: white;
  font-weight: 600;

  .cell {
    padding: 1rem;
  }
}

.inflections-table .table-header {
  grid-template-columns: 1.2fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr;
}

.ordinals-table .table-header {
  grid-template-columns: 0.8fr 0.8fr 1fr 1fr 1.5fr;
}

.table-body {
  display: flex;
  flex-direction: column;
}

.table-row {
  display: grid;
  border-bottom: 1px solid #e0e0e0;
  align-items: center;

  &:nth-child(odd) {
    background-color: #f9f9f9;
  }

  .cell {
    padding: 0.75rem 1rem;

    &.bengaform {
      color: $color-primary;
      font-weight: 600;
    }

    &.class-name {
      font-weight: 600;
      color: $color-heading-dark;
    }
  }
}

.inflections-table .table-row {
  grid-template-columns: 1.2fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr;
}

.ordinals-table .table-row {
  grid-template-columns: 0.8fr 0.8fr 1fr 1fr 1.5fr;
}

.distributives-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.distributive-item {
  @include card-base;
  padding: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;

  .bengaform {
    color: $color-primary;
    font-weight: 600;
    min-width: fit-content;
    background-color: #f9f9f9;
    padding: 0.5rem 1rem;
    border-radius: 4px;
  }

  .meaning {
    flex: 1;
    color: $color-text-primary;
  }
}

.special-methods {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.method-card {
  @include card-base;
  padding: 1.5rem;
  border-top: 3px solid $color-primary;

  h3 {
    color: $color-primary;
    font-size: 1.1rem;
    margin-bottom: 0.75rem;
  }

  p {
    color: $color-text-primary;
    line-height: 1.6;
    margin: 0;
  }
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.note-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  background: white;
  padding: 1rem;
  border-radius: 4px;
  border-left: 3px solid $color-primary;

  .note-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.8rem;
    height: 1.8rem;
    min-width: 1.8rem;
    border-radius: 50%;
    background-color: $color-primary;
    color: white;
    font-weight: bold;
    font-size: 0.9rem;
  }

  .note-text {
    color: $color-text-primary;
    line-height: 1.6;
    padding-top: 0.1rem;
  }
}

.numeral-ordinal__navigation {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;

  @media (max-width: 600px) {
    flex-direction: column;
  }
}

.nav-button {
  @include button-base;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: $border-radius-base;
  transition: all $transition-base;
  flex: 1;
  text-align: center;

  &--back {
    background-color: #f0f0f0;
    color: $color-text-primary;

    &:hover {
      background-color: #e0e0e0;
    }
  }

  &--index {
    background-color: $color-primary;
    color: white;

    &:hover {
      background-color: $color-primary-dark;
    }
  }
}
</style>
