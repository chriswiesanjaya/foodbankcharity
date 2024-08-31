<template>
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
        <div class="col py-5 text-center" v-if="role == 'user'">
          <!-- Donate button -->
          <button type="button" class="btn btn-secondary me-3" @click="toggleDonateButton">
            Donate
          </button>

          <!-- Volunteer button -->
          <button type="button" class="btn btn-secondary me-3" @click="toggleVolunteerButton">
            Volunteer
          </button>

          <!-- Rate button -->
          <button type="button" class="btn btn-secondary" @click="toggleRateButton">Rate</button>
        </div>

        <!-- Forms for user -->
        <div class="row">
          <!-- Donate form for user -->
          <div v-if="showForms.donate">
            <h3 class="text-center">Donate to an Event</h3>
            <form @submit.prevent="submitDonate">
              <!-- Donate form charity -->
              <div class="row mb-3">
                <label for="charity" class="form-label">Charity</label>
                <select class="form-select" id="charity" v-model="donateFormData.charity" required>
                  <option v-for="event in events" :key="event.name" :value="event.name">
                    {{ event.name }}
                  </option>
                </select>
              </div>

              <!-- Donate form amount -->
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

              <!-- Donate form Submit Button -->
              <div class="row mb-3">
                <button type="submit" class="btn btn-primary">Submit</button>
              </div>

              <!-- Donate form Submit failure message -->
              <div v-if="submitMessages.failure" class="text-danger text-center">
                {{ submitMessages.failure }}
              </div>

              <!-- Donate form Submit success message -->
              <div v-if="submitMessages.success" class="text-success text-center">
                {{ submitMessages.success }}
              </div>
            </form>
          </div>

          <!-- Volunteer form for user -->
          <div v-if="showForms.volunteer">
            <h3 class="text-center">Apply for Volunteer</h3>
            <form @submit.prevent="submitVolunteer">
              <!-- Volunteer form charity -->
              <div class="row mb-3">
                <label for="charity" class="form-label">Charity</label>
                <select
                  class="form-select"
                  id="charity"
                  v-model="volunteerFormData.charity"
                  required
                >
                  <option v-for="event in events" :key="event.name" :value="event.name">
                    {{ event.name }}
                  </option>
                </select>
              </div>

              <!-- Volunteer form job -->
              <div class="row mb-3">
                <label for="job" class="form-label">Job</label>
                <select class="form-select" id="job" v-model="volunteerFormData.job" required>
                  <option value="food-purchasing">Food Purchasing</option>
                  <option value="food-processing">Food Processing</option>
                  <option value="food-distribution">Food Distribution</option>
                </select>
              </div>

              <!-- Volunteer form Submit Button -->
              <div class="row mb-3">
                <button type="submit" class="btn btn-primary">Submit</button>
              </div>

              <!-- Volunteer form Submit failure message -->
              <div v-if="submitMessages.failure" class="text-danger text-center">
                {{ submitMessages.failure }}
              </div>

              <!-- Volunteer form Submit success message -->
              <div v-if="submitMessages.success" class="text-success text-center">
                {{ submitMessages.success }}
              </div>
            </form>
          </div>

          <!-- Rate form for user -->
          <div v-if="showForms.rate">
            <h3 class="text-center">Rate an Event</h3>
            <form @submit.prevent="submitRate">
              <!-- Rate form charity -->
              <div class="row mb-3">
                <label for="charity" class="form-label">Charity</label>
                <select class="form-select" id="charity" v-model="rateFormData.charity" required>
                  <option v-for="event in events" :key="event.name" :value="event.name">
                    {{ event.name }}
                  </option>
                </select>
              </div>

              <!-- Rate form rate -->
              <div class="row mb-3">
                <label for="rate" class="form-label">Rating</label>
                <select class="form-select" id="rate" v-model="rateFormData.rate" required>
                  <option value="5">5 - Very Good</option>
                  <option value="4">4 - Good</option>
                  <option value="3">3 - Average</option>
                  <option value="2">2 - Poor</option>
                  <option value="1">1 - Very Poor</option>
                </select>
              </div>

              <!-- Rate form review -->
              <div class="row mb-3">
                <label for="review" class="form-label">Review</label>
                <textarea
                  class="form-control"
                  id="review"
                  rows="3"
                  v-model="rateFormData.review"
                  required
                  @blur="() => validateRateReview(true)"
                  @input="() => validateRateReview(false)"
                />
              </div>
              <div v-if="userErrors.review" class="text-danger mb-3">{{ userErrors.review }}</div>

              <!-- Volunteer form Submit Button -->
              <div class="row mb-3">
                <button type="submit" class="btn btn-primary">Submit</button>
              </div>

              <!-- Volunteer form Submit failure message -->
              <div v-if="submitMessages.failure" class="text-danger text-center">
                {{ submitMessages.failure }}
              </div>

              <!-- Volunteer form Submit success message -->
              <div v-if="submitMessages.success" class="text-success text-center">
                {{ submitMessages.success }}
              </div>
            </form>
          </div>
        </div>

        <!-- Buttons for admin -->
        <div class="col py-5 text-center" v-if="role == 'admin'">
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

// Validate rate review
const validateRateReview = (blur) => {
  const rateReview = rateFormData.value.review
  const minLength = 10

  if (rateReview.length < minLength) {
    if (blur) userErrors.value.review = 'Review message must be at least 10 characters.'
  } else {
    userErrors.value.review = null
  }
}

// Submit donate function
const submitDonate = () => {
  // Validate form
  validateDonateAmount(true)

  if (!userErrors.value.amount) {
    // Handle submit donate success
    // TODO: add amount to localstorage donation
    submitMessages.value.success = 'Your donation has been submitted successfully.'
    submitMessages.value.failure = null

    clearForm()
  } else {
    // Handle submit donate failure
    submitMessages.value.success = null
    submitMessages.value.failure = 'Failed to submit your donation. Please try again.'
  }
}

// Submit volunteer function
const submitVolunteer = () => {
  // Handle submit volunteer success
  // TODO: add +1 to localstorage volunteer
  submitMessages.value.success = 'Your volunteer application has been submitted successfully.'
  submitMessages.value.failure = null

  clearForm()
}

// Submit rate function
const submitRate = () => {
  // Validate form
  validateRateReview(true)

  if (!userErrors.value.review) {
    // Handle submit rating success
    // TODO: add rate to localstorage rating
    submitMessages.value.success = 'Your rating has been submitted successfully.'
    submitMessages.value.failure = null

    clearForm()
  } else {
    // Handle submit donate failure
    submitMessages.value.success = null
    submitMessages.value.failure = 'Failed to submit your rating. Please try again.'
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
