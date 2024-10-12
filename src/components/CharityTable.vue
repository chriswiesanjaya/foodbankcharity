<template>
  <div class="container text-center">
    <div class="flex justify-center mb-4">
      <SelectButton v-model="size" :options="sizeOptions" optionLabel="label" dataKey="label" />
    </div>
    <DataTable
      ref="dt"
      v-model:filters="filters"
      :value="charities"
      :size="size.value"
      paginator
      :rows="10"
      :rowsPerPageOptions="[5, 10, 15, 20]"
      :globalFilterFields="['name', 'location']"
      tableStyle="min-width: 50rem"
    >
      <template #header>
        <div class="row py-3">
          <div class="col text-start"></div>
          <div class="col text-center">
            <InputText v-model="filters.global.value" placeholder="Search" class="p-inputtext-sm" />
          </div>
          <div class="col text-end">
            <Button label="Export CSV" @click="exportCSV" class="me-3" />
            <Button label="Export PDF" @click="exportPDF" class="me-3" />
          </div>
        </div>
      </template>
      <template #empty> No charities found. </template>
      <template #loading> Loading charities data. Please wait. </template>

      <Column field="name" header="Charity Name" sortable exportHeader="Charity Name"></Column>
      <Column field="location" header="Location" sortable exportHeader="Location"></Column>
      <Column field="donation" header="Donation (AUD)" sortable exportHeader="Donation"></Column>
      <Column field="volunteer" header="Volunteer" sortable exportHeader="Volunteer"></Column>
      <Column field="rating" header="Rating (out of 5)" sortable exportHeader="Rating"></Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import SelectButton from 'primevue/selectbutton' // Import SelectButton
import jsPDF from 'jspdf'
import 'jspdf-autotable'

// Define the props
const props = defineProps({
  charities: {
    type: Array,
    required: true
  }
})

const filters = ref({
  global: { value: null, matchMode: 'contains' }
})

const dt = ref()

const exportCSV = () => {
  dt.value.exportCSV()
}

const exportPDF = () => {
  const doc = new jsPDF()
  const columns = [
    { title: 'Charity Name', dataKey: 'name' },
    { title: 'Location', dataKey: 'location' },
    { title: 'Donation (AUD)', dataKey: 'donation' },
    { title: 'Volunteer', dataKey: 'volunteer' },
    { title: 'Rating', dataKey: 'rating' }
  ]

  doc.autoTable(columns, props.charities)
  doc.save('charities.pdf')
}

// Size selection for DataTable
const size = ref({ label: 'Normal', value: 'null' })
const sizeOptions = ref([
  { label: 'Small', value: 'small' },
  { label: 'Normal', value: 'null' },
  { label: 'Large', value: 'large' }
])
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
