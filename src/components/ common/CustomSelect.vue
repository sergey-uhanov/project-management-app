<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import RowIcon from '@/icons/Row-icon.vue'

interface Option {
  label: string
  value: string
}

const props = defineProps<{
  modelValue: string
  options: Option[]
  placeholder?: string
  fullWidth?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const rootRef = ref<HTMLElement | null>(null)

function toggle() {
  isOpen.value = !isOpen.value
}

function selectOption(val: string) {
  emit('update:modelValue', val)
  isOpen.value = false
}

function clickOutside(e: MouseEvent) {
  if (!rootRef.value) return
  if (!rootRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', clickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', clickOutside)
})
</script>

<template>
  <div :style="{ width: props.fullWidth ? '100%' : '200px' }" class="custom-select" ref="rootRef">
    <div class="custom-select__control" @click="toggle">
      <span>
        {{
          props.options.find((o) => o.value === modelValue)?.label ||
          props.placeholder ||
          'Select...'
        }}
      </span>
      <div class="arrow" :class="{ open: isOpen }">
        <RowIcon :is-direction-up="false" />
      </div>
    </div>

    <ul v-if="isOpen" class="custom-select__dropdown">
      <li
        v-for="opt in options"
        :key="opt.value"
        @click="selectOption(opt.value)"
        :class="{ selected: opt.value === modelValue }"
      >
        {{ opt.label }}
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.custom-select {
  position: relative;
  user-select: none;

  &__control {
    padding: 8px 12px;
    border: 1px solid $border-color;
    border-radius: 6px;
    background: $white;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .arrow {
      transition: transform 0.2s ease;

      &.open {
        transform: rotate(180deg);
      }
    }
  }

  &__dropdown {
    margin: 0;
    padding: 6px 0;
    list-style: none;
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    background: $white;
    border: 1px solid $border-color;
    border-radius: 6px;
    box-shadow: 0 4px 12px $background-secondary;
    max-height: 260px;
    overflow-y: auto;
    z-index: 100;

    li {
      padding: 8px 12px;
      cursor: pointer;
      transition: background 0.15s ease;

      &:hover {
        background: $background-hover;
      }

      &.selected {
        background: $background-active;
        font-weight: 600;
      }
    }
  }
}
</style>
