import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { generateUrl } from '@nextcloud/router'

const routes: RouteRecordRaw[] = [{ path: '/', component: () => import('@/views/AppView.vue') }]

const router = createRouter({
  history: createWebHistory(generateUrl('/apps/framaspace')),
  routes,
})

export default router
