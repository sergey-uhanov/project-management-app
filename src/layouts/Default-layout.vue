<script setup lang="ts">
import Header from '@/components/ common/Header.vue'
import Footer from '@/components/ common/Footer.vue'
</script>

<template>
  <div class="layout layout--default">
    <Header />

    <main class="layout__content">
      <router-view />
    </main>

    <Footer />
  </div>
</template>

<style lang="scss" scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 98vh;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 15px;
}

.layout__content {
  flex: 1;
}
</style>
