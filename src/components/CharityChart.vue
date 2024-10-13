<template>
  <div class="container text-center">
    <div class="mb-3">
      <SelectButton v-model="selectedMetric" :options="metricOptions" optionLabel="label" />
    </div>
    <Chart type="bar" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import Chart from 'primevue/chart'

// Define the props
const props = defineProps({
  charities: {
    type: Array,
    required: true
  },
  selectedCharities: {
    type: Array,
    required: true
  },
  metric: {
    type: String,
    required: true
  }
})

// Metric options for the select button
const metricOptions = ref([
  { label: 'Donation', value: 'donation' },
  { label: 'Volunteer', value: 'volunteer' }
])
const selectedMetric = ref(props.metric) // Set initial value from props

const chartData = ref(null)
const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
})

// Watch for changes in selected charities or selected metric
watch([() => props.selectedCharities, selectedMetric], () => {
  updateChart()
})

// Watch for changes in the metric prop to set the selectedMetric
watch(
  () => props.metric,
  (newMetric) => {
    selectedMetric.value = newMetric
    updateChart() // Update the chart when the metric changes
  }
)

// Update chart data based on selected charities and metric
const updateChart = () => {
  const metricData = props.selectedCharities.map((charity) => {
    const charityData = props.charities.find((c) => c.name === charity)
    return selectedMetric.value === 'donation' ? charityData.donation : charityData.volunteer
  })

  const backgroundColors = [
    'rgba(249, 115, 22, 0.2)',
    'rgba(6, 182, 212, 0.2)',
    'rgb(107, 114, 128, 0.2)',
    'rgba(139, 92, 246, 0.2)'
  ]

  const borderColors = [
    'rgb(249, 115, 22)',
    'rgb(6, 182, 212)',
    'rgb(107, 114, 128)',
    'rgb(139, 92, 246)'
  ]

  chartData.value = {
    labels: props.selectedCharities,
    datasets: [
      {
        label: selectedMetric.value.charAt(0).toUpperCase() + selectedMetric.value.slice(1),
        data: metricData,
        backgroundColor: backgroundColors.slice(0, props.selectedCharities.length),
        borderColor: borderColors.slice(0, props.selectedCharities.length),
        borderWidth: 1
      }
    ]
  }
}
</script>

<style scoped>
.container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 80vw;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
}
</style>
