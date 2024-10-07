<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <!-- Login Form -->
        <h1 class="text-center">Login</h1>
        <form @submit.prevent="login">
          <!-- Email -->
          <div class="row mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" v-model="email" required />
          </div>

          <!-- Password -->
          <div class="row mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" id="password" v-model="password" required />
          </div>

          <!-- Login Button -->
          <div class="row mb-3">
            <button type="submit" class="btn btn-primary">Login</button>
          </div>

          <!-- Register Navigation -->
          <div class="text-center mb-3">
            Don't have an account?
            <router-link to="/register" class="text-primary"> Register</router-link>
          </div>
          <div v-if="error" class="text-danger text-center">{{ error }}</div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

// Login function
const login = () => {
  const accounts = JSON.parse(localStorage.getItem('accounts')) || []
  const user = accounts.find((account) => account.email === email.value)

  if (user && user.password === password.value) {
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('email', user.email)
    localStorage.setItem('role', user.role)
    router.push('/profile').then(() => {
      window.location.reload()
    })
  } else {
    error.value = 'Email or password is incorrect.'
  }
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
</style>
