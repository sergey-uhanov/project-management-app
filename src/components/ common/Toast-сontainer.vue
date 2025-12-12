<script setup lang="ts">
import { useToast } from '@/composables/useToast.ts'

const { toasts } = useToast()
</script>

<template>
  <div class="toast-container">
    <div v-for="toast in toasts" :key="toast.id" class="toast" :class="`toast--${toast.type}`">
      {{ toast.message }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.toast-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 9999;
}

.toast {
  padding: 12px 18px;
  border-radius: 6px;
  color: #fff;
  font-weight: 500;
  box-shadow: 0 2px 8px $background-secondary;
  animation: fade-in 0.3s ease-out;
}

.toast--success {
  background: $green;
}

.toast--error {
  background: $danger;
}

.toast--info {
  background: $primary;
}

.toast--warning {
  background: $yellow;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-500px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
