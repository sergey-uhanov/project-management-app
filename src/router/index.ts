import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/Default-layout.vue'),
    children: [
      {
        path: '',
        name: 'projects',
        component: () => import('@/views/Project.vue'),
      },
      {
        path: 'projects/:id',
        name: 'one-project',
        component: () => import('@/views/Project-page.vue'),
      },
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
