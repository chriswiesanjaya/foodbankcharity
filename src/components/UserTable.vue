<template>
  <div class="container text-center">
    <div class="flex justify-center mb-4">
      <SelectButton v-model="size" :options="sizeOptions" optionLabel="label" dataKey="label" />
    </div>
    <DataTable
      ref="dt"
      v-model:filters="filters"
      :value="users"
      :size="size.value"
      paginator
      :rows="10"
      :rowsPerPageOptions="[5, 10, 15, 20]"
      tableStyle="min-width: 50rem"
    >
      <template #header>
        <div class="row py-3">
          <div class="col text-start">
            <InputText
              v-model="filters.email.value"
              placeholder="Search by Email"
              class="p-inputtext-sm me-3"
            />
            <InputText
              v-model="filters.role.value"
              placeholder="Search by Role"
              class="p-inputtext-sm"
            />
          </div>
          <div class="col text-end">
            <Button label="Export CSV" @click="exportCSV" class="me-3" />
            <Button label="Export PDF" @click="exportPDF" class="me-3" />
          </div>
        </div>
      </template>
      <template #empty> No users found. </template>
      <template #loading> Loading users data. Please wait. </template>

      <Column
        field="email"
        header="Email"
        sortable
        filter
        filterPlaceholder="Search by Email"
        :filterField="filters.email.value"
      />
      <Column
        field="role"
        header="Role"
        sortable
        filter
        filterPlaceholder="Search by Role"
        :filterField="filters.role.value"
      />
    </DataTable>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import SelectButton from 'primevue/selectbutton'
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
  email: { value: null, matchMode: 'contains' },
  role: { value: null, matchMode: 'contains' }
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
