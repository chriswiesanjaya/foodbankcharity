import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

import accounts from '@/assets/json/accounts.json'
import events from '@/assets/json/events.json'

import db from './firebase/init.js'
import { collection, addDoc, getDocs } from 'firebase/firestore'

// Fetch accounts.json file and store it in Local Storage
const saveAccountsToLocalStorage = () => {
  if (!localStorage.getItem('accounts')) {
    localStorage.setItem('accounts', JSON.stringify(accounts))
    console.log('Accounts have been loaded into Local Storage.')
  } else {
    console.log('Accounts already exist in Local Storage.')
  }
}

// Fetch events.json file and store it in Local Storage
const saveEventsToLocalStorage = () => {
  if (!localStorage.getItem('events')) {
    localStorage.setItem('events', JSON.stringify(events))
    console.log('Events have been loaded into Local Storage.')
  } else {
    console.log('Events already exist in Local Storage.')
  }
}

saveAccountsToLocalStorage()
saveEventsToLocalStorage()

// Function to upload events.json to Firestore
async function uploadEvents() {
  try {
    const eventsCollection = collection(db, 'events')
    const existingDocs = await getDocs(eventsCollection)

    // Only upload if the collection is empty
    if (existingDocs.empty) {
      for (const event of events) {
        await addDoc(eventsCollection, event)
      }
      console.log('Events successfully uploaded to Firestore')
    } else {
      console.log('Events already exist in Firestore, skipping upload.')
    }
  } catch (error) {
    console.error('Error uploading events: ', error)
  }
}

// Call the function to upload events on startup
uploadEvents()

const app = createApp(App)
app.use(PrimeVue, { theme: { preset: Aura } })
app.use(router)

app.mount('#app')
