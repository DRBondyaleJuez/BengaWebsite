<template>
  <svg
    :class="[
      'icon',
      `icon--${name}`,
      { 'icon--spin': spin }
    ]"
    :width="size"
    :height="size"
    :viewBox="`0 0 24 24`"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    v-bind="$attrs"
  >
    <!-- Play Icon -->
    <template v-if="name === 'play'">
      <polygon points="5 3 19 12 5 21 5 3" />
    </template>

    <!-- Pause Icon -->
    <template v-else-if="name === 'pause'">
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </template>

    <!-- Volume Icon -->
    <template v-else-if="name === 'volume'">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a6.5 6.5 0 0 1 0 9.07M17.45 6.55a10 10 0 0 1 0 14.14" />
    </template>

    <!-- Volume Muted Icon -->
    <template v-else-if="name === 'volume-muted'">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </template>

    <!-- External Link Icon -->
    <template v-else-if="name === 'external-link'">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </template>

    <!-- Close Icon -->
    <template v-else-if="name === 'close'">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </template>

    <!-- Download Icon -->
    <template v-else-if="name === 'download'">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </template>

    <!-- Menu Icon -->
    <template v-else-if="name === 'menu'">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </template>

    <!-- Chevron Up Icon -->
    <template v-else-if="name === 'chevron-up'">
      <polyline points="18 15 12 9 6 15" />
    </template>

    <!-- Chevron Down Icon -->
    <template v-else-if="name === 'chevron-down'">
      <polyline points="6 9 12 15 18 9" />
    </template>

    <!-- Arrow Right Icon -->
    <template v-else-if="name === 'arrow'">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </template>

    <!-- Info Icon -->
    <template v-else-if="name === 'info'">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </template>

    <!-- Search Icon -->
    <template v-else-if="name === 'search'">
      <circle cx="11" cy="11" r="8" />
      <line x1="20" y1="20" x2="16.65" y2="16.65" />
    </template>

    <!-- Heart Icon -->
    <template v-else-if="name === 'heart'">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </template>

    <!-- Check Icon -->
    <template v-else-if="name === 'check'">
      <polyline points="20 6 9 17 4 12" />
    </template>

    <!-- Alert Icon -->
    <template v-else-if="name === 'alert'">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </template>
  </svg>
</template>

<script>
export default {
  name: 'BaseIcon',
  props: {
    name: {
      type: String,
      required: true,
      validator: (value) => {
        const validIcons = [
          'play',
          'pause',
          'volume',
          'volume-muted',
          'external-link',
          'close',
          'download',
          'menu',
          'chevron-up',
          'chevron-down',
          'arrow',
          'info',
          'search',
          'heart',
          'check',
          'alert'
        ]
        return validIcons.includes(value)
      }
    },
    size: {
      type: [Number, String],
      default: 24
    },
    spin: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/mixins';

.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: currentColor;
  transition: color $transition-fast;

  &--spin {
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
