<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <!-- Sign Up Form -->
        <h1 class="text-center">Contact Us</h1>
        <form @submit.prevent="sendInquiry">
          <!-- Email -->
          <div class="row mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" v-model="formData.email" required />
          </div>

          <!-- Name -->
          <div class="row mb-3">
            <label for="name" class="form-label">Name</label>
            <input
              type="text"
              class="form-control"
              id="name"
              v-model="formData.name"
              required
              @blur="() => validateName(true)"
              @input="() => validateName(false)"
            />
          </div>
          <div v-if="errors.name" class="text-danger mb-3">{{ errors.name }}</div>

          <!-- Subject -->
          <div class="row mb-3">
            <label for="subject" class="form-label">Subject</label>
            <input
              type="text"
              class="form-control"
              id="subject"
              v-model="formData.subject"
              required
              @blur="() => validateSubject(true)"
              @input="() => validateSubject(false)"
            />
          </div>
          <div v-if="errors.subject" class="text-danger mb-3">{{ errors.subject }}</div>

          <!-- Message -->
          <div class="row mb-3">
            <label for="message" class="form-label">Message</label>
            <textarea
              class="form-control"
              id="subject"
              rows="3"
              v-model="formData.message"
              required
              @blur="() => validateMessage(true)"
              @input="() => validateMessage(false)"
            />
          </div>
          <div v-if="errors.message" class="text-danger mb-3">{{ errors.message }}</div>

          <!-- Send Button -->
          <div class="row mb-3">
            <button type="submit" class="btn btn-primary">Send</button>
          </div>

          <!-- Send failure message -->
          <div v-if="sendInquiryMessages.failure" class="text-danger text-center">
            {{ sendInquiryMessages.failure }}
          </div>

          <!-- Send success message -->
          <div v-if="sendInquiryMessages.success" class="text-success text-center">
            {{ sendInquiryMessages.success }}
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
  name: '',
  subject: '',
  message: ''
})

// Error messages
const errors = ref({
  email: null,
  name: null,
  subject: null,
  message: null
})

// Send inquiry messages
const sendInquiryMessages = ref({
  success: null,
  failure: null
})

// Clear form
const clearForm = () => {
  formData.value = {
    email: '',
    name: '',
    subject: '',
    message: ''
  }
}

// Send inquiry function
const sendInquiry = () => {
  // Validate form
  validateName(true)
  validateSubject(true)
  validateMessage(true)

  if (!errors.value.name && !errors.value.subject && !errors.value.message) {
    // Handle send inquiry success
    sendInquiryMessages.value.success = 'Your inquiry has been sent successfully.'
    sendInquiryMessages.value.failure = null

    clearForm()
  } else {
    // Handle send inquiry failure
    sendInquiryMessages.value.success = null
    sendInquiryMessages.value.failure = 'Failed to send your inquiry. Please try again.'
  }
}

// Validate name
const validateName = (blur) => {
  const name = formData.value.name

  if (name.length < 3) {
    if (blur) errors.value.name = 'Name must be at least 3 characters.'
  } else {
    errors.value.name = null
  }
}

// Validate subject
const validateSubject = (blur) => {
  const subject = formData.value.subject

  if (subject.length < 3) {
    if (blur) errors.value.subject = 'Subject must be at least 3 characters.'
  } else {
    errors.value.subject = null
  }
}

// Validate message
const validateMessage = (blur) => {
  const message = formData.value.message

  if (message.length < 10) {
    if (blur) errors.value.message = 'Message must be at least 10 characters.'
  } else {
    errors.value.message = null
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
