<script setup>
definePageMeta({
  layout: "app",
});

const analytics = ref([
  {
    title: "Medicine",
    value: 282,
    icon: "healthicons:medicines-outline",
  },
  {
    title: "Reviews",
    value: 300,
    icon: "material-symbols:reviews",
  },
  {
    title: "Impression",
    value: 182,
    icon: "wpf:view-file",
  },
  {
    title: "Viewed",
    value: 34,
    icon: "iconoir:eye",
  },
  {
    title: "Interactions",
    value: 12,
    icon: "carbon:touch-interaction",
  },
]);

const perPageOptions = [10, 25, 50, 100];

const headers = [
  {
    text: "Medicine Name",
    value: "name",
  },
  {
    text: "Generic Name",
    value: "generic_name",
  },
  {
    text: "Category",
    value: "category",
  },
  {
    text: "Price",
    value: "price",
  },
  {
    text: "Quantity",
    value: "quantity",
  },
  {
    text: "Expiry Date",
    value: "expiry_date",
  },
  {
    text: "Actions",
    value: "actions",
  },
];

const items = ref([
  {
    name: "Paracetamol",
    generic_name: "Paracetamol",
    category: "Tablet",
    price: 10,
    quantity: 100,
    expiry_date: "2022-09-01",
  },
  {
    name: "Amoxicillin",
    generic_name: "Amoxicillin",
    category: "Capsule",
    price: 20,
    quantity: 200,
    expiry_date: "2022-09-01",
  },
  {
    name: "Ibuprofen",
    generic_name: "Ibuprofen",
    category: "Tablet",
    price: 15,
    quantity: 150,
    expiry_date: "2022-09-01",
  },
  {
    name: "Ciprofloxacin",
    generic_name: "Ciprofloxacin",
    category: "Capsule",
    price: 25,
    quantity: 250,
    expiry_date: "2022-09-01",
  },
  {
    name: "Doxycycline",
    generic_name: "Doxycycline",
    category: "Tablet",
    price: 30,
    quantity: 300,
    expiry_date: "2022-09-01",
  },
  {
    name: "Metronidazole",
    generic_name: "Metronidazole",
    category: "Capsule",
    price: 35,
    quantity: 350,
    expiry_date: "2022-09-01",
  },
  {
    name: "Azithromycin",
    generic_name: "Azithromycin",
    category: "Tablet",
    price: 40,
    quantity: 400,
    expiry_date: "2022-09-01",
  },
  {
    name: "Ceftriaxone",
    generic_name: "Ceftriaxone",
    category: "Capsule",
    price: 45,
    quantity: 450,
    expiry_date: "2022-09-01",
  },
  {
    name: "Cefixime",
    generic_name: "Cefixime",
    category: "Tablet",
    price: 50,
    quantity: 500,
    expiry_date: "2022-09-01",
  },
  {
    name: "Clarithromycin",
    generic_name: "Clarithromycin",
    category: "Capsule",
    price: 55,
    quantity: 550,
    expiry_date: "2022-09-01",
  },
]);

const loading = ref(false);

const openModal = ref(false);
</script>
<template>
  <PharmacyInventoryAddModal v-model="openModal" />
  <div>
    <!-- Analytic Cards -->
    <div class="grid grid-cols-5 gap-12">
      <Dashboard-Card-Analytic
        v-for="(analytic, index) in analytics"
        :key="index"
        :analytic="analytic"
      />
    </div>

    <!-- Body -->
    <div class="p-5 mt-5 bg-white dark:bg-primary-dark-900">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-2">
            <span>Show</span>
            <select class="w-10 py-1 border rounded-md" v-model="perPage">
              <option v-for="item in perPageOptions" :key="item" :value="item">
                {{ item }}
              </option>
            </select>
            <span> entries </span>
          </div>

          <div>
            <P-Textfield
              v-model="search"
              placeholder="Search"
              name="search"
              rules="required"
              field-class="!py-2 pl-12 rounded-2xl"
              label-class="!mb-2 text-sm text-gray-400"
            >
              <template #leading>
                <Icon
                  class="absolute w-6 h-6 text-gray-400 -translate-y-1/2 top-1/2 left-2.5 text-xl"
                  name="lucide:search"
                ></Icon>
              </template>
            </P-Textfield>
          </div>
        </div>

        <div>
          <button
            @click="openModal = true"
            class="px-3 py-1.5 rounded-md flex items-center justify-center gap-2 bg-primary-600 text-white"
          >
            <Icon name="lucide:plus" class="text-lg" /> Add Medicine
          </button>
        </div>
      </div>

      <!-- Table -->
      <div>
        <P-Table :headers="headers" :items="items" :loading="loading">
          <template #actions="{ item }">
            <div class="flex items-center gap-2">
              <button class="text-primary-600">
                <Icon name="heroicons-solid:pencil" class="text-lg" />
              </button>
              <button class="text-red-600">
                <Icon name="heroicons-solid:trash" class="text-lg" />
              </button>
            </div>
          </template>
        </P-Table>
      </div>
    </div>
  </div>
</template>
