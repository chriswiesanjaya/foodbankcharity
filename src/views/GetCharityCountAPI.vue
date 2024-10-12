<template>
  <pre>{{ jsondata }}</pre>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const jsondata = ref(null)
const error = ref(null)
const getCharityCountAPIKey = 'https://getcharitycount-ltpm7ejipa-uc.a.run.app'

const getCharityCountAPI = async () => {
  try {
    const response = await axios.get(getCharityCountAPIKey)
    jsondata.value = response.data
    error.value = null
  } catch (err) {
    console.log('Error fetching charity count: ', err)
    error.value = err
    jsondata.value = null
  }
}

onMounted(() => {
  getCharityCountAPI()
})
</script>
