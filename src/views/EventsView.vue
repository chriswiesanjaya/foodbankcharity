<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">Events</h1>

        <!-- Events table -->
        <div class="row text-center">
          <DataTable :value="events" tableStyle="min-width: 50rem">
            <Column field="name" header="Charity Name"></Column>
            <Column field="location" header="Location"></Column>
            <Column field="donation" header="Donation (AUD)"></Column>
            <Column field="volunteer" header="Volunteer"></Column>
            <Column field="rating" header="Rating (out of 5)"></Column>
          </DataTable>
        </div>

        <!-- Buttons for user -->
        <div class="col py-5 text-center" v-if="role === 'user'">
          <button type="button" class="btn btn-secondary me-3" @click="toggleDonateButton">
            Donate
          </button>
          <button type="button" class="btn btn-secondary me-3" @click="toggleVolunteerButton">
            Volunteer
          </button>
          <button type="button" class="btn btn-secondary" @click="toggleRateButton">Rate</button>
        </div>

        <!-- Forms for user -->
        <div class="row">
          <!-- Donate form for user -->
          <div v-if="showForms.donate">
            <h3 class="text-center">Donate to an Event</h3>
            <form @submit.prevent="submitDonate">
              <div class="row mb-3">
                <label for="charity" class="form-label">Charity</label>
                <select class="form-select" id="charity" v-model="donateFormData.charity" required>
                  <option v-for="event in events" :key="event.name" :value="event.name">
                    {{ event.name }}
                  </option>
                </select>
              </div>
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
              <div class="row mb-3">
                <button type="submit" class="btn btn-primary">Submit</button>
              </div>
              <div v-if="submitMessages.failure" class="text-danger text-center">
                {{ submitMessages.failure }}
              </div>
              <div v-if="submitMessages.success" class="text-success text-center">
                {{ submitMessages.success }}
              </div>
            </form>
          </div>

          <!-- Volunteer form for user -->
          <div v-if="showForms.volunteer">
            <h3 class="text-center">Apply for Volunteer</h3>
            <form @submit.prevent="submitVolunteer">
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
              <div class="row mb-3">
                <label for="job" class="form-label">Job</label>
                <select class="form-select" id="job" v-model="volunteerFormData.job" required>
                  <option value="food-purchasing">Food Purchasing</option>
                  <option value="food-processing">Food Processing</option>
                  <option value="food-distribution">Food Distribution</option>
                </select>
              </div>
              <div class="row mb-3">
                <button type="submit" class="btn btn-primary">Submit</button>
              </div>
              <div v-if="submitMessages.failure" class="text-danger text-center">
                {{ submitMessages.failure }}
              </div>
              <div v-if="submitMessages.success" class="text-success text-center">
                {{ submitMessages.success }}
              </div>
            </form>
          </div>

          <!-- Rate form for user -->
          <div v-if="showForms.rate">
            <h3 class="text-center">Rate an Event</h3>
            <form @submit.prevent="submitRate">
              <div class="row mb-3">
                <label for="charity" class="form-label">Charity</label>
                <select class="form-select" id="charity" v-model="rateFormData.charity" required>
                  <option v-for="event in events" :key="event.name" :value="event.name">
                    {{ event.name }}
                  </option>
                </select>
              </div>
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
                ></textarea>
              </div>
              <div v-if="userErrors.review" class="text-danger mb-3">{{ userErrors.review }}</div>
              <div class="row mb-3">
                <button type="submit" class="btn btn-primary">Submit</button>
              </div>
              <div v-if="submitMessages.failure" class="text-danger text-center">
                {{ submitMessages.failure }}
              </div>
              <div v-if="submitMessages.success" class="text-success text-center">
                {{ submitMessages.success }}
              </div>
            </form>
          </div>
        </div>

        <!-- Buttons for admin -->
        <div class="col py-5 text-center" v-if="role === 'admin'">
          <button type="button" class="btn btn-secondary" @click="toggleCreateEventButton">
            Create Event
          </button>
        </div>

        <!-- Forms for admin -->
        <div class="row">
          <div v-if="showForms.createEvent">
            <h3 class="text-center">Create an Event</h3>
            <form @submit.prevent="submitCreateEvent">
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
              <div class="row mb-3">
                <button type="submit" class="btn btn-primary">Submit</button>
              </div>
              <div v-if="submitMessages.failure" class="text-danger text-center">
                {{ submitMessages.failure }}
              </div>
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
import { ref, onMounted } from 'vue'
import { getFirestore, collection, getDocs, updateDoc, doc, setDoc } from 'firebase/firestore'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const db = getFirestore()
const role = localStorage.getItem('role')

const events = ref([])

// Form data and error handling
const donateFormData = ref({ charity: '', amount: '' })
const volunteerFormData = ref({ charity: '', job: '' })
const rateFormData = ref({ charity: '', rate: '', review: '' })
const createEventFormData = ref({ name: '', location: '' })
const showForms = ref({ donate: false, volunteer: false, rate: false, createEvent: false })
const submitMessages = ref({ success: null, failure: null })
const userErrors = ref({ amount: null, review: null })
const adminErrors = ref({ name: null, location: null })

const fetchEvents = async () => {
  const querySnapshot = await getDocs(collection(db, 'events'))

  // Map the documents to event objects
  const eventList = querySnapshot.docs.map((doc) => {
    const event = { id: doc.id, ...doc.data() }

    // Calculate the rating
    event.rating = event.numberRating > 0 ? (event.totalRating / event.numberRating).toFixed(2) : 0

    return event
  })

  // Sort the event list by 'name' in ascending order
  events.value = eventList.sort((a, b) => {
    return a.name.localeCompare(b.name)
  })
}

// Clear form
const clearForm = () => {
  donateFormData.value = { charity: '', amount: '' }
  volunteerFormData.value = { charity: '', job: '' }
  rateFormData.value = { charity: '', rating: '' }
  createEventFormData.value = { name: '', location: '' }
}

// Clear messages
const clearMessages = () => {
  userErrors.value = { charity: null, amount: null, job: null, rate: null, review: null }
  adminErrors.value = { name: null, location: null }
  submitMessages.value = { success: null, failure: null }
}

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
  const rateReview = rateFormData.value.review.trim()
  const minLength = 10
  const maxLength = 100

  if (rateReview.length < minLength) {
    if (blur) userErrors.value.review = 'Review message must be at least 10 characters.'
  } else if (rateReview.length > maxLength) {
    if (blur) userErrors.value.review = 'Review message must be at most 100 characters.'
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

// Submit functions
const submitDonate = async () => {
  const amount = parseFloat(donateFormData.value.amount)
  const charity = donateFormData.value.charity
  try {
    const docRef = doc(db, 'events', charity)
    await updateDoc(docRef, {
      donation: amount
    })
    submitMessages.value.success = 'Donation successful!'
  } catch (error) {
    submitMessages.value.failure = 'Donation failed: ' + error.message
  }
}

const submitVolunteer = async () => {
  const charity = volunteerFormData.value.charity
  const job = volunteerFormData.value.job
  try {
    // Add volunteer logic here
    submitMessages.value.success = 'Volunteer application successful!'
  } catch (error) {
    submitMessages.value.failure = 'Volunteer application failed: ' + error.message
  }
}

const submitRate = async () => {
  const charity = rateFormData.value.charity
  const rating = {
    rate: rateFormData.value.rate,
    review: rateFormData.value.review
  }
  try {
    // Add rating logic here
    submitMessages.value.success = 'Rating submitted successfully!'
  } catch (error) {
    submitMessages.value.failure = 'Rating submission failed: ' + error.message
  }
}

const submitCreateEvent = async () => {
  const { name, location } = createEventFormData.value
  try {
    await setDoc(doc(db, 'events', name), {
      name,
      location,
      donation: 0,
      volunteers: 0,
      ratings: []
    })
    submitMessages.value.success = 'Event created successfully!'
  } catch (error) {
    submitMessages.value.failure = 'Event creation failed: ' + error.message
  }
}

// Initial fetch of events
onMounted(fetchEvents)
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
