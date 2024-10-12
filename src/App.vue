<template>
  <header v-if="showHeader"><BHeader /></header>
  <main><router-view></router-view></main>
  <footer v-if="showHeader"><BFooter /></footer>
</template>

<script setup>
import BFooter from './components/BFooter.vue'
import BHeader from './components/BHeader.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const showHeader = computed(() => {
  return route.name !== 'GetCharityCountAPI' && route.name !== 'GetAllCharitiesAPI'
})
</script>
