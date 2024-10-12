<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <!-- Sign Up Form -->
        <form @submit.prevent="submitInquiry">
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
              id="message"
              rows="3"
              v-model="formData.message"
              required
              @blur="() => validateMessage(true)"
              @input="() => validateMessage(false)"
            />
          </div>
          <div v-if="errors.message" class="text-danger mb-3">{{ errors.message }}</div>

          <!-- Submit Button -->
          <div class="row mb-3">
            <button type="submit" class="btn btn-primary">Submit</button>
          </div>

          <!-- Submit failure message -->
          <div v-if="submitInquiryMessages.failure" class="text-danger text-center">
            {{ submitInquiryMessages.failure }}
          </div>

          <!-- Submit success message -->
          <div v-if="submitInquiryMessages.success" class="text-success text-center">
            {{ submitInquiryMessages.success }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref(localStorage.getItem('email'))

// Form data
const formData = ref({
  email: email,
  subject: '',
  message: ''
})

// Error messages
const errors = ref({
  subject: null,
  message: null
})

// Submit inquiry messages
const submitInquiryMessages = ref({
  success: null,
  failure: null
})

// Clear form
const clearForm = () => {
  formData.value = {
    subject: '',
    message: ''
  }
}

// Submit inquiry function (TBD)
const submitInquiry = () => {
  // Validate form
  validateSubject(true)
  validateMessage(true)

  if (!errors.value.subject && !errors.value.message) {
    // Handle submit inquiry success
    submitInquiryMessages.value.success = 'Your inquiry has been submitted successfully.'
    submitInquiryMessages.value.failure = null

    clearForm()
  } else {
    // Handle submit inquiry failure
    submitInquiryMessages.value.success = null
    submitInquiryMessages.value.failure = 'Failed to submit your inquiry. Please try again.'
  }
}

// Validate subject
const validateSubject = (blur) => {
  const subject = formData.value.subject
  const minLength = 3
  const maxLength = 50

  if (subject.length < minLength) {
    if (blur) errors.value.subject = 'Subject must be at least 3 characters.'
  } else if (subject.length > maxLength) {
    if (blur) errors.value.subject = 'Subject must be no more than 50 characters.'
  } else {
    errors.value.subject = null
  }
}

// Validate message
const validateMessage = (blur) => {
  const message = formData.value.message
  const minLength = 10
  const maxLength = 300

  if (message.length < minLength) {
    if (blur) errors.value.message = 'Message must be at least 10 characters.'
  } else if (message.length > maxLength) {
    if (blur) errors.value.message = 'Message must be no more than 300 characters.'
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
