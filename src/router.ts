import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { generateUrl } from '@nextcloud/router'

const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('@/views/AppView.vue') },
  { path: '/about', component: () => import('@/views/AboutView.vue') },
]

const router = createRouter({
  history: createWebHistory(generateUrl('/apps/framaspace/apps/framaspace')),
  routes,
})

export default router
