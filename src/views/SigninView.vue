<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">Sign In</h1>
        <form @submit.prevent="signIn">
          <div class="row mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" v-model="email" required />
          </div>
          <div class="row mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" id="password" v-model="password" required />
          </div>
          <div class="row mb-3">
            <button type="submit" class="btn btn-primary">Sign In</button>
          </div>
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

/* TODO: email and password fetch from json */
const signIn = () => {
  if (email.value === 'admin@admin.com' && password.value === 'admin') {
    localStorage.setItem('isAuthenticated', 'true')
    router.push('/').then(() => {
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
