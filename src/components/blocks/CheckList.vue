<template>
  <div class="keypoints-box">
    <div v-for="(item, idx) in items" :key="`note-${idx}`" class="keypoint">
      <span class="keypoint__icon">✓</span>
      <span class="keypoint__text">{{ item }}</span>
    </div>
  </div>
</template>

<script>
/**
 * Points to remember, each with a round ✓ icon, in a responsive grid.
 *
 *   <CheckList :items="['Los adjetivos variables deben concordar…', '…']" />
 *
 * Section-file block: { "type": "checklist", "items": [{ "es": … }] }
 */
export default {
  name: 'CheckList',
  props: {
    /** Plain strings, already in the visitor's language. */
    items: { type: Array, required: true }
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.keypoints-box {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.keypoint {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    min-width: 1.5rem;
    border-radius: 50%;
    background-color: $color-primary;
    color: white;
    font-weight: 700;
    font-size: 0.9rem;
  }

  &__text {
    color: $color-text-primary;
    line-height: 1.6;
  }
}
</style>
