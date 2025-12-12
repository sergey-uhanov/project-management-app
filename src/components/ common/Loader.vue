<script setup lang="ts"></script>

<template>
  <div class="loader">
    <div class="loader__spinner"></div>
  </div>
</template>

<style lang="scss">
.loader {
  margin: 20% auto;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;

  &__spinner {
    width: 48px;
    height: 48px;
    border: 4px solid $background-secondary;
    border-top-color: $primary;
    border-radius: 50%;
    animation: loader-spin 0.8s linear infinite;
  }
}

@keyframes loader-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
