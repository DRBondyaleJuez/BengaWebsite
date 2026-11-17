<template>
  <div class="concordance-table">
    <div class="concordance-row header">
      <div v-for="(column, idx) in columns" :key="`col-${idx}`">{{ column }}</div>
    </div>
    <div v-for="(row, rowIdx) in rows" :key="`row-${rowIdx}`" class="concordance-row">
      <div v-for="(cell, idx) in row" :key="`cell-${rowIdx}-${idx}`" :class="{ label: idx === 0 }">
        <span v-if="cell.benga" class="bengaword">{{ cell.benga }}</span>
        <template v-else>{{ cell.text }}</template>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * A small table with a coloured header row; the first column is bold (row labels).
 *
 *   columns = ['Número', 'Ejemplo', 'Traducción']
 *   rows    = [[{ text: 'Singular' }, { benga: 'Epokolo eyamu' }, { text: 'Sombrero bueno' }]]
 *
 *   ┌────────┬───────────────┬────────────────┐
 *   │ Número │ Ejemplo       │ Traducción     │  ← header (primary colour)
 *   │Singular│ Epokolo eyamu │ Sombrero bueno │  ← Benga cells in the Benga style
 *   └────────┴───────────────┴────────────────┘
 *
 * Section-file block: { "type": "table", "columns": [{…}], "rows": [[{ "es": … } | { "benga": … }]] }
 * The look is the class-1 "Concordancia con Adjetivos" table. On narrow screens the third
 * column is hidden.
 */
export default {
  name: 'TableBlock',
  props: {
    /** Column titles (plain strings). */
    columns: { type: Array, required: true },
    /** Rows of cells: { text } for normal text, { benga } for a Benga phrase. */
    rows: { type: Array, required: true }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables';
@import '@/styles/mixins';

.concordance-table {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: $border-radius;
  overflow: hidden;

  .concordance-row {
    display: grid;
    grid-template-columns: 100px 1fr 1fr;
    border-bottom: 1px solid #f0f0f0;
    min-height: 60px;

    &.header {
      background: $color-primary;
      color: white;
      font-weight: bold;

      div {
        padding: $spacing-md;
        display: flex;
        align-items: center;
      }
    }

    &:not(.header) {
      &:hover {
        background: $color-surface-light;
      }

      div {
        padding: $spacing-md;
        display: flex;
        align-items: center;

        &.label {
          font-weight: bold;
        }

        .bengaword {
          font-family: $font-mono;
          color: $color-primary;
          font-weight: bold;
        }
      }
    }

    @include respond-below('md') {
      grid-template-columns: 80px 1fr;

      div:nth-child(3) {
        display: none;
      }
    }
  }
}
</style>
