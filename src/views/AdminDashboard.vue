<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <!-- User table -->
        <h1 class="text-center">User Table</h1>
        <UserTable :users="users" />
      </div>
    </div>
  </div>

  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <!-- Newsletter Form -->
        <h1 class="text-center">Send Newsletter</h1>
        <form @submit.prevent="submitNewsletter">
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
          <div v-if="submitNewsletterMessages.failure" class="text-danger text-center">
            {{ submitNewsletterMessages.failure }}
          </div>

          <!-- Submit success message -->
          <div v-if="submitNewsletterMessages.success" class="text-success text-center">
            {{ submitNewsletterMessages.success }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import UserTable from '../components/UserTable.vue'
import axios from 'axios'

const db = getFirestore()
const users = ref([])
const newsletter = ref([])

// Fetch users from Firestore
const fetchUsers = async () => {
  const querySnapshot = await getDocs(collection(db, 'users'))
  users.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

// Fetch newsletter emails from Firestore
const fetchNewsletter = async () => {
  const querySnapshot = await getDocs(collection(db, 'newsletter'))
  newsletter.value = querySnapshot.docs.map((doc) => doc.data().email)
}

// Form data
const formData = ref({
  subject: '',
  message: ''
})

// Error messages
const errors = ref({
  subject: null,
  message: null
})

// Submit newsletter messages
const submitNewsletterMessages = ref({
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

// Submit newsletter function (TBD)
const submitNewsletter = async () => {
  validateSubject(true)
  validateMessage(true)

  if (!errors.value.subject && !errors.value.message) {
    try {
      for (const recipient of newsletter.value) {
        await axios.post('http://localhost:3000/send-email', {
          to: recipient,
          from: 'chriswiesanjaya@gmail.com',
          subject: formData.value.subject,
          text: formData.value.message
        })
      }

      submitNewsletterMessages.value.success = 'Newsletter has been sent successfully.'
      submitNewsletterMessages.value.failure = null
      clearForm()
    } catch (error) {
      submitNewsletterMessages.value.success = null
      submitNewsletterMessages.value.failure = 'Failed to send newsletter. Please try again.'
      console.error(error)
    }
  } else {
    submitNewsletterMessages.value.success = null
    submitNewsletterMessages.value.failure = 'Failed to send newsletter. Please try again.'
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

// Initial fetch of users
onMounted(() => {
  fetchUsers()
  fetchNewsletter()
})
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
