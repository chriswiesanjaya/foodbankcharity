<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">Charity</h1>

        <!-- Charities table -->
        <div class="row text-center">
          <DataTable :value="charities" tableStyle="min-width: 50rem">
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
          <button type="button" class="btn btn-secondary me-3" @click="toggleRateButton">
            Rate
          </button>
        </div>

        <!-- Forms for user -->
        <div class="row">
          <!-- Donate form for user -->
          <div v-if="showForms.donate">
            <h3 class="text-center">Donate to a Charity</h3>
            <form @submit.prevent="submitDonate">
              <div class="row mb-3">
                <label for="charity" class="form-label">Charity</label>
                <select class="form-select" id="charity" v-model="donateFormData.charity" required>
                  <option v-for="charity in charities" :key="charity.name" :value="charity.name">
                    {{ charity.name }}
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
                  <option v-for="charity in charities" :key="charity.name" :value="charity.name">
                    {{ charity.name }}
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
            <h3 class="text-center">Rate a Charity</h3>
            <form @submit.prevent="submitRate">
              <div class="row mb-3">
                <label for="charity" class="form-label">Charity</label>
                <select class="form-select" id="charity" v-model="rateFormData.charity" required>
                  <option v-for="charity in charities" :key="charity.name" :value="charity.name">
                    {{ charity.name }}
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
          <button type="button" class="btn btn-secondary me-3" @click="toggleCreateCharityButton">
            Create Charity
          </button>
          <button type="button" class="btn btn-secondary me-3" @click="toggleModifyCharityButton">
            Modify Charity
          </button>
          <button type="button" class="btn btn-secondary me-3" @click="toggleDeleteCharityButton">
            Delete Charity
          </button>
        </div>

        <!-- Forms for admin -->
        <div class="row">
          <!-- Create Charity form for admin -->
          <div v-if="showForms.createCharity">
            <h3 class="text-center">Create a Charity</h3>
            <form @submit.prevent="submitCreateCharity">
              <div class="row mb-3">
                <label for="name" class="form-label">Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  v-model="createCharityFormData.name"
                  required
                  @blur="() => validateCreateCharityName(true)"
                  @input="() => validateCreateCharityName(false)"
                />
              </div>
              <div v-if="adminErrors.name" class="text-danger mb-3">{{ adminErrors.name }}</div>
              <div class="row mb-3">
                <label for="location" class="form-label">Location</label>
                <input
                  type="text"
                  class="form-control"
                  id="location"
                  v-model="createCharityFormData.location"
                  required
                  @blur="() => validateCreateCharityLocation(true)"
                  @input="() => validateCreateCharityLocation(false)"
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

          <!-- Modify Charity form for admin -->
          <div v-if="showForms.modifyCharity">
            <h3 class="text-center">Modify a Charity</h3>
            <form @submit.prevent="submitModifyCharity">
              <div class="row mb-3">
                <label for="charity" class="form-label">Charity</label>
                <select
                  class="form-select"
                  id="charity"
                  v-model="modifyCharityFormData.charity"
                  required
                >
                  <option v-for="charity in charities" :key="charity.name" :value="charity.name">
                    {{ charity.name }}
                  </option>
                </select>
              </div>
              <div class="row mb-3">
                <label for="name" class="form-label">Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  v-model="modifyCharityFormData.name"
                  required
                  @blur="() => validateModifyCharityName(true)"
                  @input="() => validateModifyCharityName(false)"
                />
              </div>
              <div v-if="adminErrors.name" class="text-danger mb-3">{{ adminErrors.name }}</div>
              <div class="row mb-3">
                <label for="location" class="form-label">Location</label>
                <input
                  type="text"
                  class="form-control"
                  id="location"
                  v-model="modifyCharityFormData.location"
                  required
                  @blur="() => validateModifyCharityLocation(true)"
                  @input="() => validateModifyCharityLocation(false)"
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

          <!-- Delete Charity form for admin -->
          <div v-if="showForms.deleteCharity">
            <h3 class="text-center">Delete a Charity</h3>
            <form @submit.prevent="submitDeleteCharity">
              <div class="row mb-3">
                <label for="charity" class="form-label">Charity</label>
                <select
                  class="form-select"
                  id="charity"
                  v-model="deleteCharityFormData.charity"
                  required
                >
                  <option v-for="charity in charities" :key="charity.name" :value="charity.name">
                    {{ charity.name }}
                  </option>
                </select>
              </div>
              <div class="row mb-3">
                <button type="submit" class="btn btn-primary">Delete</button>
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
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  increment,
  where,
  query,
  addDoc,
  deleteDoc
} from 'firebase/firestore'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const db = getFirestore()
const role = localStorage.getItem('role')

const charities = ref([])

// Form data and error handling
const donateFormData = ref({ charity: '', amount: '' })
const volunteerFormData = ref({ charity: '', job: '' })
const rateFormData = ref({ charity: '', rate: '' })
const createCharityFormData = ref({ name: '', location: '' })
const modifyCharityFormData = ref({ charity: '', name: '', location: '' })
const deleteCharityFormData = ref({ charity: '' })

const showForms = ref({
  donate: false,
  volunteer: false,
  rate: false,
  createCharity: false,
  modifyCharity: false,
  deleteCharity: false
})
const submitMessages = ref({ success: null, failure: null })
const userErrors = ref({ amount: null })
const adminErrors = ref({ name: null, location: null })

const fetchCharities = async () => {
  const querySnapshot = await getDocs(collection(db, 'charities'))

  const charityList = querySnapshot.docs.map((doc) => {
    const charity = { id: doc.id, ...doc.data() }
    charity.rating =
      charity.numberRating > 0 ? (charity.totalRating / charity.numberRating).toFixed(2) : 0
    return charity
  })

  charities.value = charityList.sort((a, b) => {
    return a.name.localeCompare(b.name)
  })
}

// Clear form
const clearForm = () => {
  donateFormData.value = { charity: '', amount: '' }
  volunteerFormData.value = { charity: '', job: '' }
  rateFormData.value = { charity: '', rating: '' }
  createCharityFormData.value = { name: '', location: '' }
  modifyCharityFormData.value = { charity: '', name: '', location: '' }
  deleteCharityFormData.value = { charity: '' }
}

// Clear messages
const clearMessages = () => {
  userErrors.value = { charity: null, amount: null, job: null, rate: null }
  adminErrors.value = { name: null, location: null }
  submitMessages.value = { success: null, failure: null }
}

// Toggle all buttons
const toggleAllButtons = () => {
  showForms.value.donate = false
  showForms.value.volunteer = false
  showForms.value.rate = false
  showForms.value.createCharity = false
  showForms.value.modifyCharity = false
  showForms.value.deleteCharity = false
  clearForm()
  clearMessages()
}

// Donate button toggle onclick
const toggleDonateButton = () => {
  toggleAllButtons()
  showForms.value.donate = !showForms.value.donate
}

// Volunteer button toggle onclick
const toggleVolunteerButton = () => {
  toggleAllButtons()
  showForms.value.volunteer = !showForms.value.volunteer
}

// Rate button toggle onclick
const toggleRateButton = () => {
  toggleAllButtons()
  showForms.value.rate = !showForms.value.rate
}

// Create Charity button toggle onclick
const toggleCreateCharityButton = () => {
  toggleAllButtons()
  showForms.value.createCharity = !showForms.value.createCharity
}

// Modify Charity button toggle onclick
const toggleModifyCharityButton = () => {
  toggleAllButtons()
  showForms.value.modifyCharity = !showForms.value.modifyCharity
}

// Delete Charity button toggle onclick
const toggleDeleteCharityButton = () => {
  toggleAllButtons()
  showForms.value.deleteCharity = !showForms.value.deleteCharity
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

// Validate create charity name
const validateCreateCharityName = (blur) => {
  const name = createCharityFormData.value.name
  const minLength = 3

  if (name.length < minLength) {
    if (blur) adminErrors.value.name = 'Name must be at least 3 characters.'
  } else {
    adminErrors.value.name = null
  }
}

// Validate create charity location
const validateCreateCharityLocation = (blur) => {
  const location = createCharityFormData.value.location
  const minLength = 3

  if (location.length < minLength) {
    if (blur) adminErrors.value.location = 'Location must be at least 3 characters.'
  } else {
    adminErrors.value.location = null
  }
}

// Validate modify charity name
const validateModifyCharityName = (blur) => {
  const name = modifyCharityFormData.value.name
  const minLength = 3

  if (name.length < minLength) {
    if (blur) adminErrors.value.name = 'Name must be at least 3 characters.'
  } else {
    adminErrors.value.name = null
  }
}

// Validate modify charity location
const validateModifyCharityLocation = (blur) => {
  const location = modifyCharityFormData.value.location
  const minLength = 3

  if (location.length < minLength) {
    if (blur) adminErrors.value.location = 'Location must be at least 3 characters.'
  } else {
    adminErrors.value.location = null
  }
}

// Submit Donate functions
const submitDonate = async () => {
  validateDonateAmount(true)
  const charity = donateFormData.value.charity
  const amount = parseInt(donateFormData.value.amount, 10)

  try {
    const q = query(collection(db, 'charities'), where('name', '==', charity))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      submitMessages.value.success = null
      submitMessages.value.failure = 'Charity not found.'
      return
    }
    const docRef = querySnapshot.docs[0].ref

    await updateDoc(docRef, {
      donation: increment(amount)
    })

    submitMessages.value.success = 'Donation successful! Refresh the page.'
    submitMessages.value.failure = null
    clearForm()
  } catch (error) {
    submitMessages.value.success = null
    submitMessages.value.failure = 'Donation failed! Try again.'
  }
}

// Submit Volunteer functions
const submitVolunteer = async () => {
  const charity = volunteerFormData.value.charity

  try {
    const q = query(collection(db, 'charities'), where('name', '==', charity))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      submitMessages.value.success = null
      submitMessages.value.failure = 'Charity not found.'
      return
    }
    const docRef = querySnapshot.docs[0].ref

    await updateDoc(docRef, {
      volunteer: increment(1)
    })

    submitMessages.value.success = 'Volunteer application successful! Refresh the page.'
    submitMessages.value.failure = null
    clearForm()
  } catch (error) {
    submitMessages.value.success = null
    submitMessages.value.failure = 'Volunteer application failed! Try again.'
  }
}

// Submit Rate functions
const submitRate = async () => {
  const charity = rateFormData.value.charity
  const rating = parseInt(rateFormData.value.rate, 10)

  try {
    const q = query(collection(db, 'charities'), where('name', '==', charity))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      submitMessages.value.success = null
      submitMessages.value.failure = 'Charity not found.'
      return
    }
    const docRef = querySnapshot.docs[0].ref

    await updateDoc(docRef, {
      totalRating: increment(rating),
      numberRating: increment(1)
    })

    submitMessages.value.success = 'Rating successful! Refresh the page.'
    submitMessages.value.failure = null
    clearForm()
  } catch (error) {
    submitMessages.value.success = null
    submitMessages.value.failure = 'Rating failed! Try again.'
  }
}

const submitCreateCharity = async () => {
  validateCreateCharityName(true)
  validateCreateCharityLocation(true)
  const name = createCharityFormData.value.name
  const location = createCharityFormData.value.location

  try {
    const querySnapshot = await getDocs(
      query(collection(db, 'charities'), where('name', '==', name))
    )

    if (!querySnapshot.empty) {
      submitMessages.value.failure = 'Charity with this name already exists!'
      return
    }

    await addDoc(collection(db, 'charities'), {
      name: name,
      location: location,
      donation: 0,
      volunteer: 0,
      totalRating: 0,
      numberRating: 0
    })

    submitMessages.value.success = 'Charity creation successful! Refresh the page.'
    submitMessages.value.failure = null
    clearForm()
  } catch (error) {
    submitMessages.value.success = null
    submitMessages.value.failure = 'Charity creation failed! Try again.'
  }
}

const submitModifyCharity = async () => {
  validateModifyCharityName(true)
  validateModifyCharityLocation(true)
  const charity = modifyCharityFormData.value.charity
  const name = modifyCharityFormData.value.name
  const location = modifyCharityFormData.value.location

  try {
    const q = query(collection(db, 'charities'), where('name', '==', charity))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      submitMessages.value.success = null
      submitMessages.value.failure = 'Charity not found.'
      return
    }
    const docRef = querySnapshot.docs[0].ref

    await updateDoc(docRef, {
      name: name,
      location: location
    })

    submitMessages.value.success = 'Charity modification successful! Refresh the page.'
    submitMessages.value.failure = null
    clearForm()
  } catch (error) {
    submitMessages.value.success = null
    submitMessages.value.failure = 'Charity modification failed! Try again.'
  }
}

// Submit Delete Charity functions
const submitDeleteCharity = async () => {
  const charity = deleteCharityFormData.value.charity

  try {
    const q = query(collection(db, 'charities'), where('name', '==', charity))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      submitMessages.value.success = null
      submitMessages.value.failure = 'Charity not found.'
      return
    }
    const docRef = querySnapshot.docs[0].ref

    await deleteDoc(docRef)

    submitMessages.value.success = 'Delete charity successful! Refresh the page.'
    submitMessages.value.failure = null
    clearForm()
  } catch (error) {
    submitMessages.value.success = null
    submitMessages.value.failure = 'Delete charity failed! Try again.'
  }
}

// Initial fetch of charities
onMounted(fetchCharities)
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
