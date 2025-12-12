<script lang="ts" setup="">

const { isDirectionUp, color = 'black' } = defineProps<{
  isDirectionUp: boolean
  color?: string
}>()
</script>

<template>
  <svg
    :class="{ 'rotate-180': isDirectionUp }"
    :style="{fill: color}"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.46004 13.0451L11.0008 18.5858V3.00006C11.0008 2.44778 11.4485 2.00006 12.0008 2.00006C12.5531 2.00006 13.0008 2.44778 13.0008 3.00006V18.5858L18.5415 13.0451C18.932 12.6546 19.5652 12.6546 19.9557 13.0451C20.3462 13.4356 20.3462 14.0688 19.9557 14.4593L12.7079 21.7072C12.3174 22.0977 11.6842 22.0977 11.2937 21.7072L4.04582 14.4593C3.84989 14.2634 3.75226 14.0064 3.75293 13.7496C3.7531 13.6865 3.7592 13.6234 3.77124 13.5612C3.80785 13.3721 3.89938 13.1916 4.04582 13.0451C4.43635 12.6546 5.06951 12.6546 5.46004 13.0451Z"
      "
    />
  </svg>
</template>

<style lang="scss">
svg {
  transition: transform 0.3s;
  width: 15px;
  height: 15px;
}

.rotate-180 {
  transform: rotate(180deg);
}
</style>
