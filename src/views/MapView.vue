<template>
  <div class="container">
    <div class="map-container">
      <div id="map" class="map"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
// import MapboxDirections from '@mapbox/mapbox-gl-directions' // Import MapboxDirections
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css' // Import Directions CSS

mapboxgl.accessToken =
  'pk.eyJ1IjoiY2hyaXN3aWVzYW5qYXlhIiwiYSI6ImNtMjZveHY2NzE1cXAyam9qbjBva2pwd3cifQ.RJttnKpqMBMD8oHbmphCVg'

onMounted(() => {
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [-79.4512, 43.6568],
    zoom: 13
  })

  // Initialize the directions control
  const directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken
  })

  map.addControl(directions, 'top-left')
})
</script>

<style>
.container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 80vw;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
}
.map-container {
  width: 100%;
  height: 500px; /* Set the height of the map */
}
.map {
  width: 100%;
  height: 100%;
}
</style>
