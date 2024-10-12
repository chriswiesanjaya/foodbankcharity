<template>
  <pre>{{ jsondata }}</pre>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const jsondata = ref(null)
const error = ref(null)
const getAllCharitiesAPIKey = 'https://getallcharities-ltpm7ejipa-uc.a.run.app'

const getAllCharitiesAPI = async () => {
  try {
    const response = await axios.get(getAllCharitiesAPIKey)
    jsondata.value = response.data
    error.value = null
  } catch (err) {
    console.log('Error fetching all charities: ', err)
    error.value = err
    jsondata.value = null
  }
}

onMounted(() => {
  getAllCharitiesAPI()
})
</script>
