<script setup lang="ts">
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<template>
  <footer class="footer">
    <div class="footer__container">
      <div class="footer__info">
        <h3 class="footer__title">Project app</h3>
        <p class="footer__text">© {{ currentYear }}. All rights reserved.</p>
      </div>

      <nav class="footer__nav">
        <ul class="footer__list">
          <li class="footer__item">
            <RouterLink class="footer__link" to="/">Главная</RouterLink>
          </li>
          <li class="footer__item">
            <RouterLink class="footer__link" to="/projects">Проекты</RouterLink>
          </li>
          <li class="footer__item">
            <RouterLink class="footer__link" to="/about">О нас</RouterLink>
          </li>
        </ul>
      </nav>

      <div class="footer__social">
        <a href="https://github.com" target="_blank" class="footer__social-link"> GitHub </a>
        <a href="https://t.me" target="_blank" class="footer__social-link"> Telegram </a>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  padding: 24px 0;
  color: #424242;

  &__container {
    margin: 0 auto;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
  }

  &__title {
    margin: 0 0 4px;
    font-size: 20px;
    font-weight: 600;
  }

  &__text {
    margin: 0;
    font-size: 14px;
    opacity: 0.7;
  }

  &__nav {
    & .footer__list {
      display: flex;
      gap: 12px;
      padding: 0;
      margin: 0;
      list-style: none;
    }
  }

  &__link {
    color: $white;
    font-size: 14px;
    opacity: 0.8;
    text-decoration: none;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 1;
    }
  }

  &__social {
    display: flex;
    gap: 12px;
  }

  &__social-link {
    color: $white;
    font-size: 14px;
    opacity: 0.8;
    text-decoration: none;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
