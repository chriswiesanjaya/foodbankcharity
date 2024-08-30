<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <!-- Sign Up Form -->
        <h1 class="text-center">Sign Up</h1>
        <form @submit.prevent="signUp">
          <!-- Email -->
          <div class="row mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" v-model="formData.email" required />
          </div>

          <!-- Password -->
          <div class="row mb-3">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              class="form-control"
              id="password"
              v-model="formData.password"
              required
              @blur="() => validatePassword(true)"
              @input="() => validatePassword(false)"
            />
          </div>
          <div v-if="errors.password" class="text-danger mb-3">{{ errors.password }}</div>

          <!-- Confirm Password -->
          <div class="row mb-3">
            <label for="confirm-password" class="form-label">Confirm Password</label>
            <input
              type="password"
              class="form-control"
              id="confirm-password"
              v-model="formData.confirmPassword"
              required
              @blur="() => validateConfirmPassword(true)"
              @input="() => validateConfirmPassword(false)"
            />
          </div>
          <div v-if="errors.confirmPassword" class="text-danger mb-3">
            {{ errors.confirmPassword }}
          </div>

          <!-- Role -->
          <div class="row mb-3">
            <label for="role" class="form-label">Role</label>
            <select class="form-select" id="role" v-model="formData.role" required>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <!-- Sign Up Button -->
          <div class="row mb-3">
            <button type="submit" class="btn btn-primary">Sign Up</button>
          </div>

          <!-- Sign In Navigation -->
          <div class="text-center mb-3">
            Already have an account?
            <router-link to="/signin" class="text-primary"> Sign in</router-link>
          </div>
          <div v-if="signUpMessages.failure" class="text-danger text-center">
            {{ signUpMessages.failure }}
          </div>
          <div v-if="signUpMessages.success" class="text-success text-center">
            {{ signUpMessages.success }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  email: '',
  password: '',
  confirmPassword: '',
  role: ''
})

const errors = ref({
  email: null,
  password: null,
  confirmPassword: null,
  role: null
})

const signUpMessages = ref({
  success: null,
  failure: null
})

// Clear form
const clearForm = () => {
  formData.value = {
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  }
}

// Sign up function
const signUp = () => {
  // Validate form
  validatePassword(true)
  validateConfirmPassword(true)

  // Get existing local storage accounts
  const accounts = JSON.parse(localStorage.getItem('accounts')) || []
  const user = accounts.find((account) => account.email === formData.value.email)

  if (!user && !errors.value.password && !errors.value.confirmPassword) {
    // Handle sign up success
    signUpMessages.value.success = 'Your account has been created successfully.'
    signUpMessages.value.failure = null

    // Make new account and push to local storage
    const newAccount = {
      email: formData.value.email,
      password: formData.value.password,
      role: formData.value.role
    }
    accounts.push(newAccount)
    localStorage.setItem('accounts', JSON.stringify(accounts))

    clearForm()
  } else {
    // Handle sign up failure
    signUpMessages.value.success = null
    signUpMessages.value.failure = 'Registration failed. Please try again.'
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
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`
  } else if (!hasUppercase) {
    if (blur) errors.value.password = 'Password must contain at least one uppercase letter.'
  } else if (!hasLowercase) {
    if (blur) errors.value.password = 'Password must contain at least one lowercase letter.'
  } else if (!hasNumber) {
    if (blur) errors.value.password = 'Password must contain at least one number.'
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = 'Password must contain at least one special character.'
  } else {
    errors.value.password = null
  }
}

// Validate confirm password
const validateConfirmPassword = (blur) => {
  const password = formData.value.password
  const confirmPassword = formData.value.confirmPassword

  if (password !== confirmPassword) {
    if (blur) errors.value.confirmPassword = 'Passwords do not match.'
  } else {
    errors.value.confirmPassword = null
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
