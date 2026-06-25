<template>
  <div class="example-table">
    <table class="example-table__table">
      <thead v-if="headers.length">
        <tr>
          <th 
            v-for="(header, index) in headers" 
            :key="index"
            class="example-table__header"
          >
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="(row, rowIndex) in rows" 
          :key="rowIndex"
          class="example-table__row"
        >
          <td 
            v-for="(cell, cellIndex) in row" 
            :key="cellIndex"
            class="example-table__cell"
            :class="getCellClass(cellIndex)"
          >
            <!-- If cell is a Benga word object -->
            <template v-if="isBengaCell(cellIndex)">
              <BengaWord
                :word="cell.word || cell"
                :audio-id="cell.audioId"
                :dictionary-url="cell.dictionaryUrl"
                :show-meaning="false"
              />
            </template>
            <!-- Regular text -->
            <template v-else>
              {{ cell }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import BengaWord from './BengaWord.vue'

export default {
  name: 'ExampleTable',
  components: {
    BengaWord
  },
  props: {
    headers: {
      type: Array,
      default: () => []
    },
    rows: {
      type: Array,
      required: true
    },
    bengaColumns: {
      type: Array,
      default: () => [0, 1] // Default: first two columns are Benga words
    }
  },
  methods: {
    isBengaCell(columnIndex) {
      return this.bengaColumns.includes(columnIndex)
    },
    getCellClass(columnIndex) {
      return {
        'example-table__cell--benga': this.isBengaCell(columnIndex)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/mixins';

.example-table {
  width: 100%;
  overflow-x: auto;
  margin: $spacing-md 0;
  @include custom-scrollbar;

  &__table {
    width: 100%;
    border-collapse: collapse;
    background: $color-surface;
    border-radius: $border-radius-md;
    overflow: hidden;
    box-shadow: $shadow-sm;
  }

  &__header {
    padding: $spacing-md;
    text-align: left;
    font-weight: $font-weight-semibold;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    background: $color-surface-alt;
    border-bottom: 2px solid $border-color;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__row {
    &:nth-child(even) {
      background: rgba($color-surface-alt, 0.5);
    }

    &:hover {
      background: rgba($color-primary, 0.03);
    }
  }

  &__cell {
    padding: $spacing-md;
    border-bottom: $border-width solid $border-color;
    vertical-align: middle;

    &--benga {
      font-family: $font-family-benga;
    }
  }
}
</style>
