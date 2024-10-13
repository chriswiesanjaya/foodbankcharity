import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutUsView from '../views/AboutUsView.vue'
import CharitiesView from '@/views/CharitiesView.vue'
import ProfileView from '@/views/ProfileView.vue'
import FirebaseLoginView from '@/views/FirebaseLoginView.vue'
import FirebaseRegisterView from '@/views/FirebaseRegisterView.vue'
import AdminDashboard from '@/views/AdminDashboardView.vue'
import GetCharityCountAPI from '@/views/GetCharityCountAPI.vue'
import GetAllCharitiesAPI from '@/views/GetAllCharitiesAPI.vue'
import MapView from '@/views/MapView.vue'

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
    component: FirebaseLoginView
  },
  {
    path: '/register',
    name: 'Register',
    component: FirebaseRegisterView
  },
  {
    path: '/AdminDashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/map',
    name: 'Map',
    component: MapView,
    meta: { requiresAuth: true }
  },
  {
    path: '/GetCharityCountAPI',
    name: 'GetCharityCountAPI',
    component: GetCharityCountAPI
  },
  {
    path: '/GetAllCharitiesAPI',
    name: 'GetAllCharitiesAPI',
    component: GetAllCharitiesAPI
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
  const role = localStorage.getItem('role')

  // Redirect authenticated users away from Login and Register to Profile
  if (isAuthenticated && (to.name === 'Login' || to.name === 'Register')) {
    next({ name: 'Profile' })
    return
  }

  // Redirect users away from AdminDashboard to Profile
  if (role !== 'admin' && to.name === 'AdminDashboard') {
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
