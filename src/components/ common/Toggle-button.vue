<script setup lang="ts">
import { computed, ref, useTemplateRef, watchEffect } from 'vue'

const props = defineProps<{
  modelValue: string
  options: [{ value: string; label: string }, { value: string; label: string }]
}>()
const emit = defineEmits(['update:modelValue'])
const switchWidth = ref(0)
const offset = ref(0)
const buttonOne = useTemplateRef('buttonOne')
const buttonTwo = useTemplateRef('buttonTwo')

const indicatorStyle = computed(() => ({
  transform: `translateX(${offset.value}px)`,
  width: switchWidth.value + 'px',
}))

function handleToggleButton(e: Event, value: string) {
  emit('update:modelValue', value)

  const el = e.currentTarget as HTMLElement

  switchWidth.value = el.offsetWidth
  offset.value = el.offsetLeft
}

watchEffect(() => {
  const activeIndex = props.options.findIndex((opt) => opt.value === props.modelValue)

  if (activeIndex === 0) {
    switchWidth.value = buttonOne.value?.offsetWidth as number
    offset.value = buttonOne.value?.offsetLeft as number
  } else {
    switchWidth.value = buttonTwo.value?.offsetWidth as number
    offset.value = buttonTwo.value?.offsetLeft as number
  }
})
</script>

<template>
  <div class="button-toggle">
    <div class="button-toggle__switch" :style="indicatorStyle"></div>

    <button
      class="button-toggle__btn"
      :class="{ 'button-toggle__btn--active': modelValue === props.options[0].value }"
      @click="handleToggleButton($event, props.options[0].value)"
      ref="buttonOne"
    >
      {{ props.options[0].label }}
    </button>

    <button
      class="button-toggle__btn"
      :class="{ 'button-toggle__btn--active': modelValue === props.options[1].value }"
      @click="handleToggleButton($event, props.options[1].value)"
      ref="buttonTwo"
    >
      {{ props.options[1].label }}
    </button>
  </div>
</template>

<style lang="scss">
.button-toggle {
  position: relative;
  display: inline-flex;
  align-items: center;
  background: $background;
  border-radius: 25px;
  padding: 4px;
  gap: 0;
  width: fit-content;

  &__switch {
    position: absolute;
    top: 4px;
    left: 0;
    width: calc(50%);
    height: calc(100% - 8px);
    background: $primary;
    border-radius: 25px;
    transition: transform 0.28s ease;
    z-index: 0;
  }

  &__btn {
    position: relative;
    z-index: 1;
    border: none;
    background: transparent;
    padding: 8px 18px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    color: $dark-blue;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    transition:
      color 0.25s,
      transform 0.1s;

    @media (hover: hover) {
      &:hover {
        transform: scale(1.05);
      }
    }

    &--active {
      color: $white;
    }
  }
}
</style>
