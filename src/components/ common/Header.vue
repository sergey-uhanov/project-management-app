<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const isMenuOpen = ref(false)
const router = useRouter()

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <header class="header">
    <div class="header__container">
      <div class="header__logo" @click="goHome">Management Projects</div>

      <nav class="header__nav">
        <router-link class="header__link" to="/">All projects</router-link>
        <router-link class="header__link" to="/about">About</router-link>
      </nav>

      <button class="header__burger" @click="toggleMenu">
        <span></span><span></span><span></span>
      </button>

      <transition name="fade">
        <div v-if="isMenuOpen" class="header__mobile-menu" @click.self="toggleMenu">
          <div class="header__mobile-content">
            <router-link class="header__mobile-link" to="/" @click="toggleMenu"
              >All Projects
            </router-link>
            <router-link class="header__mobile-link" to="/about" @click="toggleMenu"
              >About app
            </router-link>
          </div>
        </div>
      </transition>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header {
  color: $font-color;
  padding: 16px 0;

  &__container {
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__logo {
    font-size: 20px;
    font-weight: 600;
    cursor: pointer;
    user-select: none;
  }

  &__nav {
    display: flex;
    gap: 20px;

    @media (max-width: 768px) {
      display: none;
    }
  }

  &__link {
    color: $font-color;
    font-size: 20px;
    text-decoration: none;
    opacity: 0.8;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 1;
    }
  }

  &__burger {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;

    @media (max-width: 768px) {
      display: block;
    }

    span {
      display: block;
      width: 24px;
      height: 2px;
      background: $black;
      margin-bottom: 5px;
      transition: 0.3s;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  &__mobile-menu {
    position: fixed;
    inset: 0;
    background: $background-translucent-transparent;
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: flex-end;
    z-index: 9999;
  }

  &__mobile-content {
    width: 200px;
    background: $background-secondary;
    height: 100%;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__mobile-link {
    color: #fff;
    text-decoration: none;
    font-size: 16px;
    opacity: 0.85;

    &:hover {
      opacity: 1;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
