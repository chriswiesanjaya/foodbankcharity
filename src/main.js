import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import accounts from '@/assets/json/accounts.json'
import events from '@/assets/json/events.json'

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

const app = createApp(App)
app.use(PrimeVue, { theme: { preset: Aura } })
app.use(router)

app.mount('#app')
