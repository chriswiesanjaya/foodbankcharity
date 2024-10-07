<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <!-- Register Form -->
        <h1 class="text-center">Firebase Register</h1>
        <form @submit.prevent="register">
          <!-- Email -->
          <div class="row mb-3">
            <label for="email" class="form-label">Email</label>
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
            <label for="password" class="form-label">Password</label>
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
            <label for="confirm-password" class="form-label">Confirm Password</label>
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
            <button type="submit" class="btn btn-primary">Register</button>
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
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import db from '../firebase/init.js'
import { collection, addDoc } from 'firebase/firestore'

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

      // Store the user's role in Firestore
      await addDoc(collection(db, 'users'), {
        email: user.email,
        role: 'user'
      })

      // Successful register message
      console.log('Firebase Register as', user.email, 'is Successful!')
      registerMessages.value.success = 'Your account has been created successfully.'
      registerMessages.value.failure = null
      clearForm()
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

<style scoped>
.container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 80vw;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
}
</style>
