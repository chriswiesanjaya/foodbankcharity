<template>
  <!-- Map Section -->
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div id="map" class="my-4" style="height: 500px"></div>
      </div>
    </div>

    <!-- Charity Selector -->
    <div class="container">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <h1 class="text-center">Select a Charity</h1>
          <div class="row mb-3">
            <label for="charitySelect" class="form-label">Charity</label>
            <select
              id="charitySelect"
              class="form-select"
              v-model="selectedCharity"
              @change="updateLocation"
            >
              <option disabled value="">Select a charity</option>
              <option v-for="charity in charities" :key="charity.id" :value="charity">
                {{ charity.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Location Output -->
    <div class="container">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <div v-if="locationOutput" class="alert alert-info">
            {{ locationOutput }}
          </div>
          <div v-if="errorMessage" class="alert alert-danger">
            {{ errorMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import L from 'leaflet'

const db = getFirestore()
const charities = ref([])
const selectedCharity = ref(null)
const locationOutput = ref('')
const errorMessage = ref('')
const distance = ref(null)
const userLocation = ref(null)
const locations = [
  { name: 'Melbourne', coords: [-37.8136, 144.9631] },
  { name: 'Clayton', coords: [-37.9186, 145.134] },
  { name: 'South Yarra', coords: [-37.8399, 144.9924] },
  { name: 'Brunswick', coords: [-37.7674, 144.9631] },
  { name: 'Southbank', coords: [-37.8201, 144.9644] },
  { name: 'Springvale', coords: [-37.9337, 145.1436] }
]

let map = null
let userMarker = null
let charityMarker = null
let line = null

onMounted(() => {
  initializeMap()
  getUserLocation()
  fetchCharities()
})

function initializeMap() {
  map = L.map('map').setView([-37.8136, 144.9631], 12)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
  }).addTo(map)
}

function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation.value = [position.coords.latitude, position.coords.longitude]
        addUserMarker()
      },
      () => {
        alert('Location access is denied. Please enable location services to use this feature.')
        // Optionally provide further instructions
      }
    )
  } else {
    alert('Geolocation is not supported by this browser.')
  }
}

function addUserMarker() {
  if (userLocation.value) {
    if (userMarker) {
      map.removeLayer(userMarker)
    }
    userMarker = L.marker(userLocation.value).addTo(map).bindPopup('Your Location').openPopup()
    map.setView(userLocation.value, 13)
  }
}

function fetchCharities() {
  getDocs(collection(db, 'charities')).then((querySnapshot) => {
    charities.value = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => a.name.localeCompare(b.name))
  })
}

function updateLocation() {
  if (selectedCharity.value) {
    const charityLocation = selectedCharity.value.location
    const matchedLocation = locations.find(
      (loc) => loc.name.toLowerCase() === charityLocation.toLowerCase()
    )

    if (matchedLocation) {
      distance.value = calculateDistance(userLocation.value, matchedLocation.coords)
      locationOutput.value = `${selectedCharity.value.name} location: ${matchedLocation.name} (${distance.value} km away)`
      errorMessage.value = ''

      // Clear existing markers and lines
      if (charityMarker) {
        map.removeLayer(charityMarker)
      }
      if (line) {
        map.removeLayer(line)
      }

      // Add charity marker
      charityMarker = L.marker(matchedLocation.coords)
        .addTo(map)
        .bindPopup(matchedLocation.name)
        .openPopup()

      // Draw a line between user location and charity location
      line = L.polyline([userLocation.value, matchedLocation.coords], { color: 'blue' }).addTo(map)
      map.setView(matchedLocation.coords, 13)
    } else {
      locationOutput.value = ''
      errorMessage.value = 'Error: Charity location not found.'
      distance.value = null
    }
  }
}

function calculateDistance(coords1, coords2) {
  const R = 6371 // Radius of the Earth in km
  const dLat = degreesToRadians(coords2[0] - coords1[0])
  const dLon = degreesToRadians(coords2[1] - coords1[1])
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(coords1[0])) *
      Math.cos(degreesToRadians(coords2[0])) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return (R * c).toFixed(2) // Distance in km
}

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180)
}
</script>

<style scoped>
#map {
  width: 100%;
  height: 500px;
}
.container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 80vw;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
}
</style>
