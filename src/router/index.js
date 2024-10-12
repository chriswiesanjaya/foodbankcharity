import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutUsView from '../views/AboutUsView.vue'
import ContactUsView from '@/views/ContactUsView.vue'
import CharitiesView from '@/views/CharitiesView.vue'
import ProfileView from '@/views/ProfileView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import FirebaseLoginView from '@/views/FirebaseLoginView.vue'
import FirebaseRegisterView from '@/views/FirebaseRegisterView.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'

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
    path: '/charities',
    name: 'Charities',
    component: CharitiesView,
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
    path: '/FirebaseLogin',
    name: 'FirebaseLogin',
    component: FirebaseLoginView
  },
  {
    path: '/FirebaseRegister',
    name: 'FirebaseRegister',
    component: FirebaseRegisterView
  },
  {
    path: '/AdminDashboard',
    name: 'AdminDashboard',
    component: AdminDashboard
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

  // Redirect authenticated users away from Login and Register to Profile
  if (isAuthenticated && (to.name === 'FirebaseLogin' || to.name === 'FirebaseRegister')) {
    next({ name: 'Profile' })
    return
  }

  // Redirect unauthenticated users away from protected pages to Login
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'FirebaseLogin' })
  } else {
    next()
  }
})

export default router
