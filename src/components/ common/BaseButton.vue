<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'primary' | 'secondary' | 'outline' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    disabled?: boolean
    loading?: boolean
    block?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    block: false,
  },
)

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

function handleClick(e: MouseEvent) {
  if (props.disabled || props.loading) return
  emit('click', e)
}

const classes = computed(() => [
  'btn',
  `btn--${props.variant}`,
  `btn--${props.size}`,
  {
    'btn--block': props.block,
    'btn--loading': props.loading,
    'btn--disabled': props.disabled,
  },
])
</script>

<template>
  <button :class="classes" :disabled="disabled || loading" @click="handleClick">
    <span class="btn__content" :class="{ hidden: loading }">
      <slot />
    </span>

    <span class="btn__spinner" v-if="loading">
      <slot name="loader">
        <svg class="spinner" viewBox="0 0 50 50">
          <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5" />
        </svg>
      </slot>
    </span>
  </button>
</template>

<style scoped lang="scss">
.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s ease,
    opacity 0.2s ease;
  border: none;
  white-space: nowrap;

  &__content {
    transition: opacity 0.2s ease;
  }

  &__content.hidden {
    visibility: hidden;
    opacity: 0;
  }

  &__spinner {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    inset: 0;
  }

  &--block {
    width: 100%;
  }

  &--loading {
    pointer-events: none;
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* SIZES */
  &--sm {
    padding: 6px 12px;
    font-size: 14px;
  }

  &--md {
    padding: 8px 16px;
    font-size: 15px;
  }

  &--lg {
    padding: 12px 20px;
    font-size: 16px;
  }

  &--primary {
    background: $primary;
    color: $white;

    &:hover:not(.btn--disabled):not(.btn--loading) {
      background: $primary-hover;
    }
  }

  &--secondary {
    background: $background;
    color: $dark-blue;

    &:hover:not(.btn--disabled):not(.btn--loading) {
      background: $background;
    }
  }

  &--outline {
    background: transparent;
    border: 1px solid $border-color;
    color: $font-color;

    &:hover:not(.btn--disabled):not(.btn--loading) {
      background: $background;
    }
  }

  &--danger {
    background: $danger;
    color: $white;

    &:hover:not(.btn--disabled):not(.btn--loading) {
      background: $danger-hover;
    }
  }
}

.spinner {
  width: 20px;
  height: 20px;
  animation: rotate 1s linear infinite;
}

.path {
  stroke: currentColor;
  stroke-linecap: round;
  animation: dash 1.2s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120;
  }
}
</style>
