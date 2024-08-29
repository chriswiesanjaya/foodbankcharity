<template>
  <div class="container">
    <div class="foodbank-header d-flex justify-content-between align-items-center py-3">
      <!-- TODO: dynamic display not signed in / hello user (role) -->
      <p>Hello User (user)!</p>
      <h3>foodbankcharity</h3>
      <ul class="nav nav-pills">
        <li class="nav-item">
          <!-- TODO: sign in router / sign out button-->
          <router-link to="/login" class="nav-link" active-class="active">Sign In</router-link>
        </li>
      </ul>
    </div>
    <!-- TODO: hide if not signed in, and navigation -->
    <header class="d-flex justify-content-center py-3">
      <ul class="nav nav-pills">
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active" aria-current="page"
            >Home</router-link
          >
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
.foodbank-header h3 {
  font-size: 1.75rem;
  color: #333;
  margin: 0;
}

.foodbank-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
