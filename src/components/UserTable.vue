<template>
  <div class="container text-center">
    <DataTable
      ref="dt"
      v-model:filters="filters"
      :value="users"
      paginator
      :rows="10"
      :rowsPerPageOptions="[5, 10, 15, 20]"
      :globalFilterFields="['email', 'role']"
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
      <template #empty> No users found. </template>
      <template #loading> Loading users data. Please wait. </template>

      <Column field="email" header="Email" sortable exportHeader="Email"></Column>
      <Column field="role" header="Role" sortable exportHeader="Role"></Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

// Define the props
const props = defineProps({
  users: {
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
    { title: 'Email', dataKey: 'email' },
    { title: 'Role', dataKey: 'role' }
  ]

  doc.autoTable(columns, props.users)
  doc.save('users.pdf')
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
