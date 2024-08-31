<template>
  <div class="container">
    <!-- Food Bank Charity Header -->
    <div class="row foodbank-header py-3">
      <!-- Left Section -->
      <div class="col text-start"></div>

      <!-- Center Section -->
      <div class="col text-center">
        <router-link to="/" class="foodbank-logo">
          <h3><strong>FOOD BANK CHARITY</strong></h3>
        </router-link>
      </div>

      <!-- Right Section -->
      <div class="col text-end">
        <router-link v-if="!isAuthenticated" to="/signin" class="btn btn-primary"
          >Sign In</router-link
        >
        <button v-if="isAuthenticated" @click="signOut" class="btn btn-secondary">Sign Out</button>
      </div>
    </div>

    <!-- Navigation Header-->
    <!-- TODO: Check on navigation -->
    <header class="row nav-header py-3" v-if="isAuthenticated">
      <ul class="nav nav-pills justify-content-between">
        <!-- Profile Navigation -->
        <li class="nav-item">
          <router-link to="/profile" class="nav-link" active-class="active">Profile</router-link>
        </li>

        <!-- Events Navigation -->
        <li class="nav-item">
          <router-link to="/events" class="nav-link" active-class="active">Events</router-link>
        </li>

        <!-- About Us Navigation -->
        <li class="nav-item">
          <router-link to="/aboutus" class="nav-link" active-class="active">About Us</router-link>
        </li>

        <!-- Contact Us Navigation -->
        <li class="nav-item">
          <router-link to="/contactus" class="nav-link" active-class="active"
            >Contact Us</router-link
          >
        </li>
      </ul>
    </header>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true')
const router = useRouter()

// Sign out function
const signOut = () => {
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('email')
  localStorage.removeItem('role')
  isAuthenticated.value = false
  router.push('/signin')
}
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
