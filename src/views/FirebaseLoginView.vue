<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <!-- Login Form -->
        <h1 class="text-center">Firebase Login</h1>
        <form @submit.prevent="login">
          <!-- Email -->
          <div class="row mb-3">
            <input
              type="email"
              class="form-control"
              id="email"
              placeholder="Email"
              v-model="email"
              required
            />
          </div>

          <!-- Password -->
          <div class="row mb-3">
            <input
              type="password"
              class="form-control"
              id="password"
              placeholder="Password"
              v-model="password"
              required
            />
          </div>

          <!-- Login Button -->
          <div class="row mb-3">
            <button type="submit" class="btn btn-primary">Login</button>
          </div>

          <!-- Register Navigation -->
          <div class="text-center mb-3">
            Don't have an account?
            <router-link to="/FirebaseRegister" class="text-primary"> Register</router-link>
          </div>
          <div v-if="errorMessage" class="text-danger text-center">{{ errorMessage }}</div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'
import db from '../firebase/init.js'
import { collection, query, where, getDocs } from 'firebase/firestore'

const router = useRouter()
const auth = getAuth()

// Form data
const email = ref('')
const password = ref('')
const errorMessage = ref('')

// Login function
const login = async () => {
  try {
    // Sign in with Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user

    // Fetch user role from Firestore
    const q = query(collection(db, 'users'), where('email', '==', user.email))
    const querySnapshot = await getDocs(q)
    let role = 'user'
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      role = data.role || 'user'
    })

    // Successful login message
    console.log('Firebase Login Successful!')
    console.log(auth.currentUser)
    console.log('User Role:', role)

    // Successful login local storage
    localStorage.setItem('email', user.email)
    localStorage.setItem('role', role)
    localStorage.setItem('isAuthenticated', 'true')

    // Redirect to /profile
    router.push('/profile').then(() => {
      window.location.reload()
    })
  } catch (error) {
    // Unsucessful login message
    console.error('Firebase Login Error:', error.message)
    errorMessage.value = 'Email or password is incorrect.'
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
