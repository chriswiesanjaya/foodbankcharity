<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <!-- Sign In Form -->
        <h1 class="text-center">Sign In</h1>
        <form @submit.prevent="signIn">
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

          <!-- Sign In Button -->
          <div class="row mb-3">
            <button type="submit" class="btn btn-primary">Sign In</button>
          </div>

          <!-- Sign Up Navigation -->
          <div class="text-center mb-3">
            Don't have an account?
            <router-link to="/signup" class="text-primary"> Sign up</router-link>
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

// Sign in function
const signIn = () => {
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
