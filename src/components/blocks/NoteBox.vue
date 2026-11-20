<template>
  <p :class="kindClass">
    <slot>{{ text }}</slot>
  </p>
</template>

<script>
/**
 * A note inside a page section. Three looks:
 *
 *   kind="section"  yellow box at the start of a section       ▌Hay muchas excepciones en esta clase…
 *   kind="after"    the same yellow box after a table or grid  (small space above instead of below)
 *   kind="small"    small grey italic line under examples       Dyâmbi se pronuncia «Jombi»…
 *
 *   <NoteBox kind="small" text="Dyâmbi se pronuncia «Jombi» y Dyoba «Joba»." />
 *   <NoteBox>Text with <strong>markup</strong> goes in the slot.</NoteBox>
 *
 * Section-file block: { "type": "note", "variant": "info" | "small" | …, "text": {…} }
 */
export default {
  name: 'NoteBox',
  props: {
    text: { type: String, default: '' },
    kind: {
      type: String,
      default: 'section',
      validator: (value) => ['section', 'after', 'small'].includes(value)
    }
  },
  computed: {
    kindClass() {
      return { section: 'section-note', after: 'note', small: 'example-note' }[this.kind]
    }
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.section-note {
  margin: 0 0 $spacing-lg;
  padding: $spacing-md;
  background: #fffde7;
  border-left: 4px solid $color-accent;
  color: $color-text-secondary;
}

.note {
  margin-top: $spacing-md;
  padding: $spacing-md;
  background: #fffde7;
  border-left: 4px solid $color-accent;
  color: $color-text-secondary;
}

.example-note {
  margin: $spacing-lg 0 0;
  color: $color-text-secondary;
  font-size: 0.9rem;
  font-style: italic;
  text-align: center;
}
</style>
