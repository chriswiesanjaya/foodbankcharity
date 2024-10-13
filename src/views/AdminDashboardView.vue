<template>
  <!-- User Table -->
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">User Table</h1>
        <UserTable :users="users" />
      </div>
    </div>
  </div>

  <!-- Newsletter -->
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">Send Newsletter</h1>
        <form @submit.prevent="submitNewsletter">
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

          <div class="mb-3">
            <button type="button" class="btn btn-secondary me-3" @click="addAttachment">
              Add Attachment
            </button>
            <span v-if="attachmentName">{{ attachmentName }}</span>
          </div>

          <div class="row mb-3">
            <button type="submit" class="btn btn-primary">Submit</button>
          </div>

          <div v-if="submitNewsletterMessages.failure" class="text-danger text-center">
            {{ submitNewsletterMessages.failure }}
          </div>
          <div v-if="submitNewsletterMessages.success" class="text-success text-center">
            {{ submitNewsletterMessages.success }}
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Charity Comparison Chart -->
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">Charity Comparison Chart</h1>
        <div class="row mb-3">
          <label for="charity1" class="form-label">Charity 1</label>
          <select
            class="form-select"
            id="charity1"
            v-model="charityComparison.charity1"
            @change="updateChart"
            required
          >
            <option v-for="charity in charities" :key="charity.id" :value="charity.name">
              {{ charity.name }}
            </option>
          </select>
        </div>
        <div class="row mb-3">
          <label for="charity2" class="form-label">Charity 2</label>
          <select
            class="form-select"
            id="charity2"
            v-model="charityComparison.charity2"
            @change="updateChart"
            required
          >
            <option v-for="charity in charities" :key="charity.id" :value="charity.name">
              {{ charity.name }}
            </option>
          </select>
        </div>
        <div class="row mb-3">
          <label for="charity3" class="form-label">Charity 3</label>
          <select
            class="form-select"
            id="charity3"
            v-model="charityComparison.charity3"
            @change="updateChart"
            required
          >
            <option v-for="charity in charities" :key="charity.id" :value="charity.name">
              {{ charity.name }}
            </option>
          </select>
        </div>
        <div class="row mb-3">
          <label for="charity4" class="form-label">Charity 4</label>
          <select
            class="form-select"
            id="charity4"
            v-model="charityComparison.charity4"
            @change="updateChart"
            required
          >
            <option v-for="charity in charities" :key="charity.id" :value="charity.name">
              {{ charity.name }}
            </option>
          </select>
        </div>
        <div class="row mb-3">
          <label for="metric" class="form-label">Metric</label>
          <select
            class="form-select"
            id="metric"
            v-model="charityComparison.metric"
            @change="updateChart"
            required
          >
            <option value="donation">Donation (AUD)</option>
            <option value="volunteer">Volunteer</option>
          </select>
        </div>

        <!-- CharityChart Component -->
        <CharityChart
          :charities="charities"
          :selectedCharities="[
            charityComparison.charity1,
            charityComparison.charity2,
            charityComparison.charity3,
            charityComparison.charity4
          ]"
          :metric="charityComparison.metric"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import UserTable from '../components/UserTable.vue'
import CharityChart from '../components/CharityChart.vue'
import axios from 'axios'

const db = getFirestore()
const users = ref([])
const charities = ref([])
const charityComparison = ref({
  charity1: '',
  charity2: '',
  charity3: '',
  charity4: '',
  metric: 'donation'
})
const newsletter = ref([])
const attachment = ref(null)
const attachmentName = ref('')

const formData = ref({
  subject: '',
  message: ''
})

const errors = ref({
  subject: null,
  message: null
})

const submitNewsletterMessages = ref({
  success: null,
  failure: null
})

// Clear form
const clearForm = () => {
  formData.value.subject = ''
  formData.value.message = ''
  attachment.value = null
  attachmentName.value = ''
}

// Fetch users
const fetchUsers = async () => {
  const querySnapshot = await getDocs(collection(db, 'users'))
  users.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

// Fetch newsletter
const fetchNewsletter = async () => {
  const querySnapshot = await getDocs(collection(db, 'newsletter'))
  newsletter.value = querySnapshot.docs.map((doc) => doc.data().email)
}

// Fetch charities
const fetchCharities = async () => {
  const querySnapshot = await getDocs(collection(db, 'charities'))
  const charityList = querySnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() }
  })
  charities.value = charityList.sort((a, b) => {
    return a.name.localeCompare(b.name)
  })
}

// Add attachment
const addAttachment = () => {
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = '.pdf, .png, .jpg, .jpeg'
  fileInput.onchange = (event) => {
    const selectedFile = event.target.files[0]
    if (selectedFile) {
      attachment.value = selectedFile
      attachmentName.value = selectedFile.name
    }
  }
  fileInput.click()
}

// Submit Newsletter
const submitNewsletter = async () => {
  validateSubject(true)
  validateMessage(true)

  if (!errors.value.subject && !errors.value.message) {
    try {
      for (const recipient of newsletter.value) {
        const payload = {
          to: recipient,
          from: 'chriswiesanjaya@gmail.com',
          subject: formData.value.subject,
          text: formData.value.message
        }

        // If an attachment is present, read it as base64
        if (attachment.value) {
          const base64data = await readFileAsDataURL(attachment.value)
          payload.attachment = base64data // Send this to the server
        }

        // Call the Cloudflare Worker API
        const response = await axios.post(
          'https://delicate-dust-f011.chriswiesanjaya.workers.dev/',
          payload,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        // Optionally handle the response if needed
        if (response.status === 200) {
          console.log('Email sent successfully:', response.data)
        }
      }

      submitNewsletterMessages.value.success = 'Newsletter has been sent successfully.'
      submitNewsletterMessages.value.failure = null
      clearForm()
    } catch (error) {
      submitNewsletterMessages.value.success = null
      submitNewsletterMessages.value.failure = 'Failed to send newsletter. Please try again.'
      console.error('Error sending email:', error.response ? error.response.data : error.message)
    }
  } else {
    submitNewsletterMessages.value.success = null
    submitNewsletterMessages.value.failure = 'Please fix the errors before submitting.'
  }
}

// Function to read the file as a data URL
const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onloadend = () => resolve(fileReader.result)
    fileReader.onerror = () => reject(new Error('Failed to read file'))
    fileReader.readAsDataURL(file)
  })
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

// Initial fetch of users and charities
onMounted(() => {
  fetchUsers()
  fetchCharities()
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
