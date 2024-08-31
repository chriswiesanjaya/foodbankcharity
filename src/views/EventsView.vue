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
          <button
            type="button"
            class="btn btn-secondary me-3"
            @click="showForms.donate = !showForms.donate"
          >
            Donate
          </button>
          <button
            type="button"
            class="btn btn-secondary me-3"
            @click="showForms.volunteer = !showForms.volunteer"
          >
            Volunteer
          </button>
          <button type="button" class="btn btn-secondary" @click="showForms.rate = !showForms.rate">
            Rate
          </button>
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
          <button
            type="button"
            class="btn btn-secondary"
            @click="showForms.createEvent = !showForms.createEvent"
          >
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
