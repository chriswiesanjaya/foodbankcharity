import { createRouter, createWebHistory } from 'vue-router'
import AboutView from '../views/AboutView.vue'
import SigninView from '@/views/SigninView.vue'
import SignupView from '@/views/SignupView.vue'

const routes = [
  {
    path: '/',
    name: 'Home'
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView
  },
  {
    path: '/signin',
    name: 'Signin',
    component: SigninView
  },
  {
    path: '/signup',
    name: 'Signup',
    component: SignupView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated')
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
