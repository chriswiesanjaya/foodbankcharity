import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutUsView from '../views/AboutUsView.vue'
import ContactUsView from '@/views/ContactUsView.vue'
import EventsView from '@/views/EventsView.vue'
import ProfileView from '@/views/ProfileView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import FirebaseSignInView from '@/views/FirebaseSignInView.vue'
import FirebaseSignUpView from '@/views/FirebaseSignUpView.vue'

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
    component: EventsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/FirebaseSignIn',
    name: 'Firebase Sign In',
    component: FirebaseSignInView
  },
  {
    path: '/FirebaseSignUp',
    name: 'Firebase Sign Up',
    component: FirebaseSignUpView
  },
  // Catch-all route for undefined pages
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: { name: 'Home' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated')

  // Redirect authenticated users away from Login and Register to Profile
  if (isAuthenticated && (to.name === 'Login' || to.name === 'Register')) {
    next({ name: 'Profile' })
    return
  }

  // Redirect unauthenticated users away from protected pages to Login
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
