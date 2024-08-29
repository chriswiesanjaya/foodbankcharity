<template>
  <div class="container">
    <div class="foodbank-header d-flex justify-content-between align-items-center py-3">
      <!-- TODO: dynamic display not signed in / hello user (role) -->
      <p>Hello User (user)!</p>
      <router-link to="/" class="foodbank-logo">
        <h3>foodbankcharity</h3>
      </router-link>
      <ul class="nav nav-pills">
        <li class="nav-item">
          <!-- TODO: sign in router / sign out button-->
          <router-link to="/signin" class="nav-link" active-class="active">Sign In</router-link>
        </li>
      </ul>
    </div>
    <!-- TODO: hide if not signed in, and navigation -->
    <header class="nav-header d-flex justify-content-center py-3">
      <ul class="nav nav-pills">
        <li class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active">Home</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active">Events</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active">About</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active">Blog</router-link>
        </li>
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
  /* background-color: #e0bfbf; */
  border-radius: 10px;
}

.nav-header {
  border-bottom: 2px solid #ccc; /* Add a border at the bottom */
  padding-bottom: 10px; /* Add padding to give space below the border */
}

.foodbank-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #ccc; /* Add a border at the bottom */
  padding-bottom: 10px; /* Add padding to give space below the border */
}

.foodbank-header h3 {
  font-size: 1.75rem;
  color: #333;
  margin: 0;
}

.foodbank-logo {
  text-decoration: none;
  color: inherit;
}
</style>
