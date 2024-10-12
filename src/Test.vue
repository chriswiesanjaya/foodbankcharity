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
      'Your donation has been submitted successfully. Please refresh the page.'
    submitMessages.value.failure = null

    clearForm()

    // Handle submit donate failure
  } else {
    submitMessages.value.success = null
    submitMessages.value.failure = 'Failed to submit your donation. Please try again.'
  }
}

const submitVolunteerF = async () => {
  const charity = volunteerFormData.value.charity
  const job = volunteerFormData.value.job
  try {
    // Add volunteer logic here
    submitMessages.value.success = 'Volunteer application successful!'
  } catch (error) {
    submitMessages.value.failure = 'Volunteer application failed: ' + error.message
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

const submitCreateEvent = async () => {
  const name = createEventFormData.value.name
  const location = createEventFormData.value.location
  try {
    await setDoc(doc(db, 'events', name), {
      name,
      location,
      donation: 0,
      volunteer: 0,
      totalRating: 0,
      numberRating: 0
    })
    submitMessages.value.success = 'Event created successfully!'
  } catch (error) {
    submitMessages.value.failure = 'Event creation failed: ' + error.message
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
