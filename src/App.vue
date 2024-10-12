<template>
  <div :class="{ 'my-app-dark': isDarkMode }">
    <header v-if="showHeader">
      <BHeader :isDarkMode="isDarkMode" @toggleDarkMode="toggleDarkMode" />
    </header>
    <main><router-view></router-view></main>
    <footer v-if="showHeader"><BFooter /></footer>
  </div>
</template>

<script setup>
import BFooter from './components/BFooter.vue'
import BHeader from './components/BHeader.vue'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const isDarkMode = ref(localStorage.getItem('darkMode') === 'true')

// Toggle dark mode function
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('my-app-dark', isDarkMode.value)
  localStorage.setItem('darkMode', isDarkMode.value)
}

const route = useRoute()

const showHeader = computed(() => {
  return route.name !== 'GetCharityCountAPI' && route.name !== 'GetAllCharitiesAPI'
})
</script>

<style>
.my-app-dark {
  background-color: #222 !important; /* Dark background for the whole app */
  color: #fff !important; /* Light text */
}

/* Navbar */
.my-app-dark .navbar {
  background-color: #444 !important; /* Dark navbar background */
}

/* Links */
.my-app-dark .nav-link {
  color: #fff !important; /* Light text for nav links */
}

/* Containers */
.my-app-dark .container {
  background-color: #222; /* Dark background for containers */
}
</style>
