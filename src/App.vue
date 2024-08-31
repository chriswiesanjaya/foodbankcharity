<script setup>
import BFooter from './components/BFooter.vue'
import BHeader from './components/BHeader.vue'
</script>

<template>
  <header><BHeader /></header>
  <main><router-view></router-view></main>
  <footer><BFooter /></footer>
</template>

<style scoped></style>
