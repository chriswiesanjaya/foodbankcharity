<template>
  <div class="container">
    <!-- Food Bank Charity Header -->
    <div class="row foodbank-header">
      <!-- Left Section -->
      <div class="col text-start">
        <label class="form-check form-switch">
          <input
            type="checkbox"
            class="form-check-input"
            :checked="isDarkMode"
            @change="toggleDarkMode"
          />
          <span class="form-check-label">Dark Mode</span>
        </label>
      </div>

      <!-- Center Section -->
      <div class="col text-center">
        <router-link to="/" class="foodbank-logo">
          <h3><strong>FOOD BANK CHARITY</strong></h3>
        </router-link>
      </div>

      <!-- Right Section -->
      <div class="col text-end">
        <!-- Regular Login / Logout Button -->
        <!-- <router-link v-if="!isAuthenticated" to="/login" class="btn btn-primary">Login</router-link>
        <button v-if="isAuthenticated" @click="logout1" class="btn btn-secondary">Logout</button> -->

        <!-- Login / Logout Button -->
        <router-link v-if="!isAuthenticated" to="/FirebaseLogin" class="btn btn-primary"
          >Login</router-link
        >
        <button v-if="isAuthenticated" @click="logout" class="btn btn-secondary">Logout</button>
      </div>
    </div>

    <!-- Navigation Header -->
    <header class="row nav-header py-3" v-if="isAuthenticated">
      <ul class="nav nav-pills justify-content-between">
        <!-- Profile Navigation -->
        <li class="nav-item">
          <router-link to="/profile" class="nav-link" active-class="active">Profile</router-link>
        </li>

        <!-- Charities Navigation -->
        <li class="nav-item">
          <router-link to="/charities" class="nav-link" active-class="active"
            >Charities</router-link
          >
        </li>

        <!-- About Us Navigation -->
        <li class="nav-item">
          <router-link to="/aboutus" class="nav-link" active-class="active">About Us</router-link>
        </li>

        <!-- Admin Dashboard Navigation -->
        <li class="nav-item" v-if="role === 'admin'">
          <router-link to="/AdminDashboard" class="nav-link" active-class="active"
            >Admin Dashboard</router-link
          >
        </li>
      </ul>
    </header>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, signOut } from 'firebase/auth'

const router = useRouter()
const auth = getAuth()

const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true')
const role = ref(localStorage.getItem('role'))

const props = defineProps({
  isDarkMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits()

const toggleDarkMode = () => {
  emit('toggleDarkMode')
}

// Firebase Log Out
const logout = () => {
  signOut(auth)
    .then(() => {
      isAuthenticated.value = false
      localStorage.removeItem('email')
      localStorage.removeItem('role')
      localStorage.removeItem('isAuthenticated')

      console.log('Firebase Sign Out Successful!')
      router.push('/FirebaseLogin').then(() => {
        window.location.reload()
      })
    })
    .catch((error) => {
      console.log(error.code)
    })
}

// Log out function
// const logout1 = () => {
//   localStorage.removeItem('isAuthenticated')
//   localStorage.removeItem('email')
//   localStorage.removeItem('role')
//   isAuthenticated.value = false
//   router.push('/login').then(() => {
//     window.location.reload()
//   })
// }
</script>

<style scoped>
.container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 80vw;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
}
.foodbank-header {
  border-bottom: 2px solid #ccc;
  padding-bottom: 10px;
}
.foodbank-logo {
  text-decoration: none;
  color: inherit;
}
.nav-header {
  border-bottom: 2px solid #ccc;
  padding-bottom: 10px;
}
</style>
