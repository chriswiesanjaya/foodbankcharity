<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">Register</h1>
      </div>
    </div>
  </div>

  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <!-- Register Form -->
        <form @submit.prevent="register">
          <!-- Email -->
          <div class="row mb-3">
            <input
              type="email"
              class="form-control"
              id="email"
              placeholder="Email"
              v-model="formData.email"
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
              v-model="formData.password"
              required
              @blur="() => validatePassword(true)"
              @input="() => validatePassword(false)"
            />
          </div>
          <div v-if="errorMessages.password" class="text-danger mb-3">
            {{ errorMessages.password }}
          </div>

          <!-- Confirm Password -->
          <div class="row mb-3">
            <input
              type="password"
              class="form-control"
              id="confirm-password"
              placeholder="Confirm Password"
              v-model="formData.confirmPassword"
              required
              @blur="() => validateConfirmPassword(true)"
              @input="() => validateConfirmPassword(false)"
            />
          </div>
          <div v-if="errorMessages.confirmPassword" class="text-danger mb-3">
            {{ errorMessages.confirmPassword }}
          </div>

          <!-- Register Button -->
          <div class="row mb-3">
            <button type="submit" class="btn btn-primary">Register and Login</button>
          </div>

          <!-- Register failure message -->
          <div v-if="registerMessages.failure" class="text-danger text-center">
            {{ registerMessages.failure }}
          </div>

          <!-- Register success message -->
          <div v-if="registerMessages.success" class="text-success text-center">
            {{ registerMessages.success }}
          </div>

          <!-- Login Navigation -->
          <div class="text-center mb-3">
            Already have an account?
            <router-link to="/login" class="text-primary"> Login</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
// import { ref } from 'vue'
// import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
// import db from '../firebase/init.js'
// import { collection, addDoc } from 'firebase/firestore'

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import db from '../firebase/init.js'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'

const router = useRouter()
const auth = getAuth()

// Form data
const formData = ref({
  email: '',
  password: '',
  confirmPassword: ''
})

// Error messages
const errorMessages = ref({
  email: null,
  password: null,
  confirmPassword: null,
  role: null
})

// Register messages
const registerMessages = ref({
  success: null,
  failure: null
})

// Clear form
const clearForm = () => {
  formData.value = {
    email: '',
    password: '',
    confirmPassword: ''
  }
}

// Validate password
const validatePassword = (blur) => {
  const password = formData.value.password
  const minLength = 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    if (blur)
      errorMessages.value.password = `Password must be at least ${minLength} characters long.`
  } else if (!hasUppercase) {
    if (blur) errorMessages.value.password = 'Password must contain at least one uppercase letter.'
  } else if (!hasLowercase) {
    if (blur) errorMessages.value.password = 'Password must contain at least one lowercase letter.'
  } else if (!hasNumber) {
    if (blur) errorMessages.value.password = 'Password must contain at least one number.'
  } else if (!hasSpecialChar) {
    if (blur) errorMessages.value.password = 'Password must contain at least one special character.'
  } else {
    errorMessages.value.password = null
  }
}

// Validate confirm password
const validateConfirmPassword = (blur) => {
  const password = formData.value.password
  const confirmPassword = formData.value.confirmPassword

  if (password !== confirmPassword) {
    if (blur) errorMessages.value.confirmPassword = 'Passwords do not match.'
  } else {
    errorMessages.value.confirmPassword = null
  }
}

// Check if email exists in Firestore
const isEmailExistsInFirestore = async (email) => {
  const usersRef = collection(db, 'users')
  const q = query(usersRef, where('email', '==', email))
  const querySnapshot = await getDocs(q)
  return !querySnapshot.empty
}

// Register function
const register = async () => {
  // Validate form
  validatePassword(true)
  validateConfirmPassword(true)

  try {
    // Check error messages for password and confirmPassword
    if (!errorMessages.value.password && !errorMessages.value.confirmPassword) {
      // Register user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.value.email,
        formData.value.password
      )
      const user = userCredential.user
      const role = 'user'

      // Store the user's role in Firestore
      if (!(await isEmailExistsInFirestore(user.email))) {
        await addDoc(collection(db, 'users'), {
          email: user.email,
          role: role
        })
      }

      // Successful register message
      console.log('Firebase Register as', user.email, 'is Successful!')
      registerMessages.value.success = 'Your account has been created successfully.'
      registerMessages.value.failure = null

      // Successful register local storage
      localStorage.setItem('email', user.email)
      localStorage.setItem('role', role)
      localStorage.setItem('isAuthenticated', 'true')

      clearForm()

      // Redirect to /profile
      router.push('/profile').then(() => {
        window.location.reload()
      })
    }
    // Unsucessful register message
  } catch (error) {
    console.error('Firebase Register Error:', error.message)
    registerMessages.value.success = null
    registerMessages.value.failure = 'Failed to create an account. Please try again.'
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
