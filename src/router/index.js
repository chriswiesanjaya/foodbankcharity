import { createRouter, createWebHistory } from 'vue-router'
import AboutUsView from '../views/AboutUsView.vue'
import SignInView from '@/views/SignInView.vue'
import SignUpView from '@/views/SignUpView.vue'
import ProfileView from '@/views/ProfileView.vue'
import HomeView from '@/views/HomeView.vue'
import ContactUsView from '@/views/ContactUsView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/aboutus',
    name: 'AboutUs',
    component: AboutUsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/contactus',
    name: 'ContactUs',
    component: ContactUsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/events',
    name: 'Events',
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: SignInView
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUpView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated')
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'SignIn' })
  } else {
    next()
  }
})

export default router
