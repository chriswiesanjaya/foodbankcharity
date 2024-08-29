<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">Sign In</h1>
        <form @submit.prevent="signin">
          <div class="row mb-3">
            <label for="username" class="form-label">Username</label>
            <input type="text" class="form-control" id="username" v-model="username" required />
          </div>
          <div class="row mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" id="password" v-model="password" required />
          </div>
          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2 mb-3">Sign In</button>
          </div>
          <div class="text-center mb-3">Dont have an account? Sign up</div>
          <div v-if="error" class="text-danger text-center">{{ error }}</div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const signin = () => {
  if (username.value === 'admin' && password.value === 'admin') {
    localStorage.setItem('isAuthenticated', 'true')
    router.push('/').then(() => {
      window.location.reload()
    })
  } else {
    error.value = 'Invalid credentials'
  }
}
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
</style>
