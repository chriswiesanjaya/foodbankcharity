<template>
  <!-- TODO -->
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">Events</h1>

        <!-- Events table -->
        <div class="row text-center">
          <DataTable :value="events" tableStyle="min-width: 50rem">
            <Column field="name" header="Name"></Column>
            <Column field="location" header="Location"></Column>
            <Column field="date" header="Date"></Column>
            <Column field="donation" header="Donation"></Column>
            <Column field="volunteer" header="Volunteer"></Column>
            <Column field="rating" header="Rating"></Column>
          </DataTable>
        </div>

        <!-- Buttons for user -->
        <!-- TODO: add to class v-if="role == 'user'" -->
        <div class="col py-5 text-center">
          <!-- Donate button for user -->
          <button type="button" class="btn btn-secondary me-3" @click="toggleDonateButton">
            Donate
          </button>

          <!-- Volunteer button for user -->
          <button type="button" class="btn btn-secondary me-3" @click="toggleVolunteerButton">
            Volunteer
          </button>

          <!-- Rate button for user -->
          <button type="button" class="btn btn-secondary" @click="toggleRateButton">Rate</button>
        </div>

        <!-- Forms for user -->
        <!-- TODO: make user forms -->
        <!-- TODO: add to div v-if="showForms.donate" -->
        <div class="row">
          <!-- Donate form for user -->
          <div v-if="showForms.donate">
            <h3 class="text-center">Donation</h3>
            <form @submit.prevent="submitDonate">
              <!-- Donate charity -->
              <div class="row mb-3">
                <label for="charity" class="form-label">Charity</label>
                <select class="form-select" id="charity" v-model="donateFormData.charity" required>
                  <option v-for="event in events" :key="event.name" :value="event.name">
                    {{ event.name }}
                  </option>
                </select>
              </div>

              <!-- Donate amount -->
              <div class="row mb-3">
                <label for="amount" class="form-label">Amount</label>
                <input
                  type="text"
                  class="form-control"
                  id="amount"
                  v-model="donateFormData.amount"
                  required
                  @blur="() => validateDonateAmount(true)"
                  @input="() => validateDonateAmount(false)"
                />
              </div>
              <div v-if="userErrors.amount" class="text-danger mb-3">{{ userErrors.amount }}</div>

              <!-- Submit Button -->
              <div class="row mb-3">
                <button type="submit" class="btn btn-primary">Submit</button>
              </div>

              <!-- Submit failure message -->
              <div v-if="submitMessages.failure" class="text-danger text-center">
                {{ submitMessages.failure }}
              </div>

              <!-- Submit success message -->
              <div v-if="submitMessages.success" class="text-success text-center">
                {{ submitMessages.success }}
              </div>
            </form>
          </div>
          <div v-if="showForms.volunteer">
            <h3>Volunteer</h3>
          </div>
          <div v-if="showForms.rate">
            <h3>Rate</h3>
          </div>
        </div>

        <!-- Buttons for admin -->
        <!-- TODO: add to class v-if="role == 'admin'" -->
        <div class="col py-5 text-center">
          <!-- Create Event button for user -->
          <button type="button" class="btn btn-secondary" @click="toggleCreateEventButton">
            Create Event
          </button>
        </div>

        <!-- Forms for admin -->
        <!-- TODO: make admin forms -->
        <div class="row text-center">
          <div v-if="showForms.createEvent">
            <h3>Create Event</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const role = localStorage.getItem('role')
const storedEvents = ref(JSON.parse(localStorage.getItem('events')) || [])

// Add computed rating to each event
const events = ref(
  storedEvents.value.map((event) => ({
    ...event,
    rating: event.numberRating > 0 ? (event.totalRating / event.numberRating).toFixed(2) : 0
  }))
)

// Show forms
const showForms = ref({
  donate: false,
  volunteer: false,
  rate: false,
  createEvent: false
})

// Donate form data
const donateFormData = ref({
  charity: '',
  amount: ''
})

// Volunteer form data
const volunteerFormData = ref({
  charity: '',
  job: ''
})

// Rate form data
const rateFormData = ref({
  charity: '',
  rate: '',
  review: ''
})

// Create Event form data
const createEventFormData = ref({
  name: '',
  location: '',
  date: ''
})

// Donate button toggle onclick
const toggleDonateButton = () => {
  showForms.value.donate = !showForms.value.donate
  showForms.value.volunteer = false
  showForms.value.rate = false
  showForms.value.createEvent = false
  clearForm()
  clearMessages()
}

// Volunteer button toggle onclick
const toggleVolunteerButton = () => {
  showForms.value.donate = false
  showForms.value.volunteer = !showForms.value.volunteer
  showForms.value.rate = false
  showForms.value.createEvent = false
  clearForm()
  clearMessages()
}

// Rate button toggle onclick
const toggleRateButton = () => {
  showForms.value.donate = false
  showForms.value.volunteer = false
  showForms.value.rate = !showForms.value.rate
  showForms.value.createEvent = false
  clearForm()
  clearMessages()
}

// Create Event button toggle onclick
const toggleCreateEventButton = () => {
  showForms.value.donate = false
  showForms.value.volunteer = false
  showForms.value.rate = false
  showForms.value.createEvent = !showForms.value.createEvent
  clearForm()
  clearMessages()
}

// Validate donate amount
const validateDonateAmount = (blur) => {
  const donateAmount = donateFormData.value.amount
  const isPositiveInteger = /^\d+$/.test(donateAmount) && parseInt(donateAmount, 10) >= 1

  if (!isPositiveInteger) {
    if (blur) userErrors.value.amount = `Donation amount must be a positive integer of at least $1.`
  } else {
    userErrors.value.amount = null
  }
}

// Submit donate function
const submitDonate = () => {
  // Validate form
  validateDonateAmount(true)

  if (!userErrors.value.amount) {
    // Handle submit success
    submitMessages.value.success = 'Your donation has been submitted successfully.'
    submitMessages.value.failure = null

    clearForm()
  } else {
    // Handle submit failure
    submitMessages.value.success = null
    submitMessages.value.failure = 'Failed to submit your donation. Please try again.'
  }
}

// Errors for user
const userErrors = ref({
  charity: null,
  amount: null,
  job: null,
  rate: null,
  review: null
})

// Errors for admin
const adminErrors = ref({
  name: null,
  location: null,
  date: null
})

// Submit messages
const submitMessages = ref({
  success: null,
  failure: null
})

// Clear form
const clearForm = () => {
  donateFormData.value = {
    charity: '',
    amount: ''
  }
  volunteerFormData.value = {
    charity: '',
    job: ''
  }
  rateFormData.value = {
    charity: '',
    rating: ''
  }
  createEventFormData.value = {
    name: '',
    location: '',
    date: ''
  }
}

const clearMessages = () => {
  userErrors.value = {
    charity: null,
    amount: null,
    job: null,
    rate: null,
    review: null
  }
  adminErrors.value = {
    name: null,
    location: null,
    date: null
  }
  submitMessages.value = {
    success: null,
    failure: null
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
