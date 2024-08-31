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
        <div class="row text-center">
          <h1 v-if="showForms.donate">DONATION</h1>
          <h1 v-if="showForms.volunteer">VOLUNTEER</h1>
          <h1 v-if="showForms.rate">RATE</h1>
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
          <h1 v-if="showForms.createEvent">CREATE EVENT</h1>
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

const toggleDonateButton = () => {
  showForms.value.donate = !showForms.value.donate
  showForms.value.volunteer = false
  showForms.value.rate = false
  showForms.value.createEvent = false
}

const toggleVolunteerButton = () => {
  showForms.value.donate = false
  showForms.value.volunteer = !showForms.value.volunteer
  showForms.value.rate = false
  showForms.value.createEvent = false
}

const toggleRateButton = () => {
  showForms.value.donate = false
  showForms.value.volunteer = false
  showForms.value.rate = !showForms.value.rate
  showForms.value.createEvent = false
}

const toggleCreateEventButton = () => {
  showForms.value.donate = false
  showForms.value.volunteer = false
  showForms.value.rate = false
  showForms.value.createEvent = !showForms.value.createEvent
}

const userErrors = ref({
  charity: null,
  amount: null,
  job: null,
  rate: null,
  review: null
})

const adminErrors = ref({
  name: null,
  location: null,
  date: null
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
