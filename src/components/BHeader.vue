<template>
  <div class="container">
    <!-- foodbankcharity Header -->
    <div class="row foodbank-header py-3">
      <!-- Left Section -->
      <div class="col text-start"></div>

      <!-- Center Section -->
      <div class="col text-center">
        <router-link to="/" class="foodbank-logo">
          <h3>foodbankcharity</h3>
        </router-link>
      </div>

      <!-- Right Section -->
      <!-- TODO: Change to logout button if signed in -->
      <div class="col text-end">
        <router-link to="/signin" class="btn btn-primary">Sign In</router-link>
      </div>
    </div>

    <!-- Navigation Header-->
    <!-- TODO: hide if not signed in, and navigation -->
    <header class="row nav-header py-3">
      <ul class="nav nav-pills justify-content-between">
        <!-- Profile Navigation -->
        <li class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active">Profile</router-link>
        </li>

        <!-- Events Navigation -->
        <li class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active">Events</router-link>
        </li>

        <!-- About Navigation -->
        <li class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active">About</router-link>
        </li>

        <!-- Blog Navigation -->
        <li class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active">Blog</router-link>
        </li>

        <!-- Contact Us Navigation -->
        <li class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active">Contact Us</router-link>
        </li>
      </ul>
    </header>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

/* TODO: Authentication */

// const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true')
// const router = useRouter()

// const logout = () => {
//   localStorage.removeItem('isAuthenticated')
//   isAuthenticated.value = false
//   router.push('/login')
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
