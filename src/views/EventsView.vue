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
            <Column field="date" header="Date (DD/MM/YYYY)"></Column>
            <Column field="donation" header="Donation (AUD)"></Column>
            <Column field="volunteer" header="Volunteer"></Column>
            <Column field="rating" header="Rating (out of 5)"></Column>
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
                <label for="amount" class="form-label">Amount (AUD)</label>
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
        <div class="row">
          <div v-if="showForms.createEvent">
            <h3 class="text-center">Create an Event</h3>
            <form @submit.prevent="submitCreateEvent">
              <!-- Create Event form name -->
              <div class="row mb-3">
                <label for="name" class="form-label">Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  v-model="createEventFormData.name"
                  required
                  @blur="() => validateCreateEventName(true)"
                  @input="() => validateCreateEventName(false)"
                />
              </div>
              <div v-if="adminErrors.name" class="text-danger mb-3">{{ adminErrors.name }}</div>

              <!-- Create Event form location -->
              <div class="row mb-3">
                <label for="location" class="form-label">Location</label>
                <input
                  type="text"
                  class="form-control"
                  id="location"
                  v-model="createEventFormData.location"
                  required
                  @blur="() => validateCreateEventLocation(true)"
                  @input="() => validateCreateEventLocation(false)"
                />
              </div>
              <div v-if="adminErrors.location" class="text-danger mb-3">
                {{ adminErrors.location }}
              </div>

              <!-- Create Event form date -->
              <div class="row mb-3">
                <label for="date" class="form-label">Date</label>
                <DatePicker
                  id="date"
                  v-model="createEventFormData.date"
                  dateFormat="dd/mm/yy"
                  required
                  @blur="() => validateCreateEventDate(true)"
                  @input="() => validateCreateEventDate(false)"
                />
              </div>
              <div v-if="adminErrors.date" class="text-danger mb-3">
                {{ adminErrors.date }}
              </div>

              <!-- Create Event form Submit Button -->
              <div class="row mb-3">
                <button type="submit" class="btn btn-primary">Submit</button>
              </div>

              <!-- Create Event form Submit failure message -->
              <div v-if="submitMessages.failure" class="text-danger text-center">
                {{ submitMessages.failure }}
              </div>

              <!-- Create Event form Submit success message -->
              <div v-if="submitMessages.success" class="text-success text-center">
                {{ submitMessages.success }}
              </div>
            </form>
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
import DatePicker from 'primevue/datepicker'

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

// Validate create event name
const validateCreateEventName = (blur) => {
  const name = createEventFormData.value.name
  const minLength = 3

  if (name.length < minLength) {
    if (blur) adminErrors.value.name = 'Name must be at least 3 characters.'
  } else {
    adminErrors.value.name = null
  }
}

// Validate create event location
const validateCreateEventLocation = (blur) => {
  const location = createEventFormData.value.location
  const minLength = 3

  if (location.length < minLength) {
    if (blur) adminErrors.value.location = 'Location must be at least 3 characters.'
  } else {
    adminErrors.value.location = null
  }
}

// Validate create event date
const validateCreateEventDate = (blur) => {
  const date = createEventFormData.value.date

  if (!date) {
    if (blur) adminErrors.value.date = 'Date is required.'
  } else {
    adminErrors.value.date = null
  }
}

// Submit Donate function
const submitDonate = () => {
  // Validate form
  validateDonateAmount(true)

  // Get existing local storage events
  const events = JSON.parse(localStorage.getItem('events')) || []
  const charity = events.find((event) => event.name === donateFormData.value.charity)
  const donation = parseInt(donateFormData.value.amount, 10)

  // Handle submit donate success
  if (charity && !userErrors.value.amount) {
    // Update the donation amount
    charity.donation = (charity.donation || 0) + donation
    localStorage.setItem('events', JSON.stringify(events))

    submitMessages.value.success =
      'Your donation has been submitted successfully. Plesae refresh the page.'
    submitMessages.value.failure = null

    clearForm()

    // Handle submit donate failure
  } else {
    submitMessages.value.success = null
    submitMessages.value.failure = 'Failed to submit your donation. Please try again.'
  }
}

// Submit Volunteer function
const submitVolunteer = () => {
  // Get existing local storage events
  const events = JSON.parse(localStorage.getItem('events')) || []
  const charity = events.find((event) => event.name === volunteerFormData.value.charity)

  // Handle submit volunteer success
  if (charity) {
    // Update the volunteer count
    charity.volunteer = (charity.volunteer || 0) + 1
    localStorage.setItem('events', JSON.stringify(events))

    submitMessages.value.success =
      'Your volunteer application has been submitted successfully. Please refresh the page.'
    submitMessages.value.failure = null

    clearForm()

    // Handle submit volunteer failure
  } else {
    submitMessages.value.success = null
    submitMessages.value.failure = 'Failed to submit your volunteer application. Please try again.'
  }
}

// Submit Rate function
const submitRate = () => {
  // Validate form
  validateRateReview(true)

  // Get existing local storage events
  const events = JSON.parse(localStorage.getItem('events')) || []
  const charity = events.find((event) => event.name === rateFormData.value.charity)
  const rating = parseInt(rateFormData.value.rate, 10)

  // Handle submit rating success
  if (charity && !userErrors.value.review) {
    // Update the rating
    charity.totalRating = (charity.totalRating || 0) + rating
    charity.numberRating = (charity.numberRating || 0) + 1
    localStorage.setItem('events', JSON.stringify(events))

    submitMessages.value.success =
      'Your rating has been submitted successfully. Please refresh the page.'
    submitMessages.value.failure = null

    clearForm()

    // Handle submit rating failure
  } else {
    submitMessages.value.success = null
    submitMessages.value.failure = 'Failed to submit your rating. Please try again.'
  }
}

// Submit Create Event function
const submitCreateEvent = () => {
  // Validate form
  validateCreateEventName(true)
  validateCreateEventLocation(true)
  validateCreateEventDate(true)

  // Get existing local storage events
  const events = JSON.parse(localStorage.getItem('events')) || []
  const name = createEventFormData.value.name
  const location = createEventFormData.value.location
  const date = formatDate(createEventFormData.value.date)

  // Handle submit create event success
  if (!adminErrors.value.name && !adminErrors.value.location && !adminErrors.value.date) {
    // Make a new event and push to local storage
    const newEvent = {
      name: name,
      location: location,
      date: date,
      donation: 0,
      volunteer: 0,
      totalRating: 0,
      numberRating: 0
    }
    events.push(newEvent)
    localStorage.setItem('events', JSON.stringify(events))

    submitMessages.value.success =
      'An event has been created successfully. Please refresh the page.'
    submitMessages.value.failure = null

    clearForm()

    // Handle submit create event failure
  } else {
    submitMessages.value.success = null
    submitMessages.value.failure = 'Failed to create an event. Please try again.'
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

// Clear messages
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

// Format date from ISO to DD/MM/YYYY
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
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
