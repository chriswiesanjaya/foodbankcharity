<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <!-- Register Form -->
        <h1 class="text-center">Register</h1>
        <form @submit.prevent="register">
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

// Form data
const formData = ref({
  email: '',
  password: '',
  confirmPassword: '',
  role: ''
})

// Error messages
const errors = ref({
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
    confirmPassword: '',
    role: ''
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

// Register function
const register = () => {
  // Validate form
  validatePassword(true)
  validateConfirmPassword(true)

  // Get existing local storage accounts
  const accounts = JSON.parse(localStorage.getItem('accounts')) || []
  const user = accounts.find((account) => account.email === formData.value.email)
  const email = formData.value.email
  const password = formData.value.password
  const role = formData.value.role

  // Handle Register success
  if (!user && !errors.value.password && !errors.value.confirmPassword) {
    // Make a new account and push to local storage
    const newAccount = {
      email: email,
      password: password,
      role: role
    }
    accounts.push(newAccount)
    localStorage.setItem('accounts', JSON.stringify(accounts))

    registerMessages.value.success = 'Your account has been created successfully.'
    registerMessages.value.failure = null

    clearForm()

    // Handle register failure
  } else {
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
