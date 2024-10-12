import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

import charities from '@/assets/json/charities.json'

import db from './firebase/init.js'
import { collection, addDoc, getDocs } from 'firebase/firestore'

// Function to upload charities.json to Firestore
async function uploadCharities() {
  try {
    const charitiesCollection = collection(db, 'charities')
    const existingDocs = await getDocs(charitiesCollection)

    // Only upload if the collection is empty
    if (existingDocs.empty) {
      for (const charity of charities) {
        await addDoc(charitiesCollection, charity)
      }
      console.log('Charities successfully uploaded to Firestore')
    } else {
      console.log('Charities already exist in Firestore, skipping upload.')
    }
  } catch (error) {
    console.error('Error uploading charities: ', error)
  }
}

// Call the function to upload charities on startup
uploadCharities()

const app = createApp(App)
app.use(PrimeVue, { theme: { preset: Aura } })
app.use(router)

app.mount('#app')
