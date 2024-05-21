<script setup>
definePageMeta({
  layout: "app",
});

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const openModal = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
  },
});

const items = ref([
  {
    id: 1,
    name: "Paracetamol",
    generic_name: "Paracetamol",
    category: "Tablet",
    price: 10,
    quantity: 100,
    expiry_date: "2022-09-01",
    image:
      "https://img.freepik.com/free-photo/packings-pills-capsules-medicines_1339-2254.jpg?t=st=1715952463~exp=1715956063~hmac=db8fe1c8d119c6652229ab2ba999974dedc816257cef381dec10ccbe04aac388&w=900",
  },
  {
    id: 1,
    name: "Amoxicillin",
    generic_name: "Amoxicillin",
    category: "Capsule",
    price: 20,
    quantity: 200,
    expiry_date: "2022-09-01",
    image:
      "https://img.freepik.com/free-photo/packings-pills-capsules-medicines_1339-2254.jpg?t=st=1715952463~exp=1715956063~hmac=db8fe1c8d119c6652229ab2ba999974dedc816257cef381dec10ccbe04aac388&w=900",
  },
  {
    id: 1,
    name: "Ibuprofen",
    generic_name: "Ibuprofen",
    category: "Tablet",
    price: 15,
    quantity: 150,
    expiry_date: "2022-09-01",
    image:
      "https://img.freepik.com/free-photo/packings-pills-capsules-medicines_1339-2254.jpg?t=st=1715952463~exp=1715956063~hmac=db8fe1c8d119c6652229ab2ba999974dedc816257cef381dec10ccbe04aac388&w=900",
  },
  {
    id: 1,
    name: "Ciprofloxacin",
    generic_name: "Ciprofloxacin",
    category: "Capsule",
    price: 25,
    quantity: 250,
    expiry_date: "2022-09-01",
    image:
      "https://img.freepik.com/free-photo/packings-pills-capsules-medicines_1339-2254.jpg?t=st=1715952463~exp=1715956063~hmac=db8fe1c8d119c6652229ab2ba999974dedc816257cef381dec10ccbe04aac388&w=900",
  },
  {
    id: 1,
    name: "Doxycycline",
    generic_name: "Doxycycline",
    category: "Tablet",
    price: 30,
    quantity: 300,
    expiry_date: "2022-09-01",
    image:
      "https://img.freepik.com/free-photo/packings-pills-capsules-medicines_1339-2254.jpg?t=st=1715952463~exp=1715956063~hmac=db8fe1c8d119c6652229ab2ba999974dedc816257cef381dec10ccbe04aac388&w=900",
  },
  {
    id: 1,
    name: "Metronidazole",
    generic_name: "Metronidazole",
    category: "Capsule",
    price: 35,
    quantity: 350,
    expiry_date: "2022-09-01",
    image:
      "https://img.freepik.com/free-photo/packings-pills-capsules-medicines_1339-2254.jpg?t=st=1715952463~exp=1715956063~hmac=db8fe1c8d119c6652229ab2ba999974dedc816257cef381dec10ccbe04aac388&w=900",
  },
  {
    id: 1,
    name: "Azithromycin",
    generic_name: "Azithromycin",
    category: "Tablet",
    price: 40,
    quantity: 400,
    expiry_date: "2022-09-01",
    image:
      "https://img.freepik.com/free-photo/packings-pills-capsules-medicines_1339-2254.jpg?t=st=1715952463~exp=1715956063~hmac=db8fe1c8d119c6652229ab2ba999974dedc816257cef381dec10ccbe04aac388&w=900",
  },
  {
    id: 1,
    name: "Ceftriaxone",
    generic_name: "Ceftriaxone",
    category: "Capsule",
    price: 45,
    quantity: 450,
    expiry_date: "2022-09-01",
    image:
      "https://img.freepik.com/free-photo/packings-pills-capsules-medicines_1339-2254.jpg?t=st=1715952463~exp=1715956063~hmac=db8fe1c8d119c6652229ab2ba999974dedc816257cef381dec10ccbe04aac388&w=900",
  },
  {
    id: 1,
    name: "Cefixime",
    generic_name: "Cefixime",
    category: "Tablet",
    price: 50,
    quantity: 500,
    expiry_date: "2022-09-01",
    image:
      "https://img.freepik.com/free-photo/packings-pills-capsules-medicines_1339-2254.jpg?t=st=1715952463~exp=1715956063~hmac=db8fe1c8d119c6652229ab2ba999974dedc816257cef381dec10ccbe04aac388&w=900",
  },
  {
    id: 1,
    name: "Clarithromycin",
    generic_name: "Clarithromycin",
    category: "Capsule",
    price: 55,
    quantity: 550,
    expiry_date: "2022-09-01",
    image:
      "https://img.freepik.com/free-photo/packings-pills-capsules-medicines_1339-2254.jpg?t=st=1715952463~exp=1715956063~hmac=db8fe1c8d119c6652229ab2ba999974dedc816257cef381dec10ccbe04aac388&w=900",
  },
]);

/*----------------------Handle Form Add----------------------*/
const addedMedicines = ref([]);
const addedMedicineSearchTerm = ref("");
const filteredMedicines = computed(() => {
  return addedMedicines.value.filter((item) =>
    item.medicine.name
      .toLowerCase()
      .includes(addedMedicineSearchTerm.value.toLowerCase())
  );
});
const quantity = ref("");
const unitPrice = ref("");
const expiryDate = ref("");
const medicine = ref(null);

const { handleSubmit, resetForm } = useForm({});
const handleInventoryAdd = handleSubmit(() => {
  addedMedicines.value.push({
    medicine: medicine.value,
    quantity: quantity.value,
    unitPrice: unitPrice.value,
    expiryDate: expiryDate.value,
  });

  resetForm();
});
</script>

<template>
  <P-Modal v-model="openModal" :auto-close="false" body-class="w-[1200px] p-10">
    <template #header>
      <div class="flex items-center justify-between">
        <h1 class="text-3xl">Add Inventory</h1>
        <button class="btn-primary" @click="openModal = false">Close</button>
      </div>
    </template>
    <template #content>
      <div class="w-full h-full">
        <div
          class="relative grid h-full grid-cols-6 gap-5 mt-5 bg-white divide-x-2"
        >
          <div class="col-span-4">
            <div class="mx-auto">
              <form
                @submit.prevent="handleInventoryAdd"
                class="flex flex-col gap-5"
              >
                <div>
                  <P-Lists-SingleSelectWithSearch
                    v-model="medicine"
                    placeholder="Select a medicine"
                    :items="items"
                    name="medicine"
                    :return-object="true"
                    header-class="!bg-[#F6F7F9] !py-4 !rounded-2xl !pl-5 !border-0 !shadow-none"
                    rules="onerequired"
                  >
                    <template #label>
                      <label for="medicine" class="flex mb-2"
                        >Medicine
                        <span class="ml-1 text-red-600">*</span></label
                      >
                    </template>
                    <template #row="{ item }">
                      <div class="flex items-center gap-3">
                        <img
                          :src="item.image"
                          alt="medicine"
                          class="w-10 h-10 rounded-full"
                        />
                        <div>
                          <h1 class="text-lg">{{ item.name }}</h1>
                          <p class="text-sm">{{ item.category }}</p>
                        </div>
                      </div>
                    </template>
                  </P-Lists-SingleSelectWithSearch>
                </div>

                <!-- Quantity Input -->
                <div>
                  <P-Textfield
                    v-model="quantity"
                    placeholder="How much medicine "
                    name="quantity"
                    rules="required"
                    type="number"
                    field-class="!py-4 !pl-5 !rounded-2xl bg-[#F6F7F9] !border-0 !shadow-none"
                  >
                    <template #label>
                      <label for="quantity" class="flex mb-2"
                        >Quantity
                        <span class="ml-1 text-red-600">*</span></label
                      >
                    </template>
                  </P-Textfield>
                </div>

                <!-- Unit Price Input -->
                <div class="">
                  <P-Textfield
                    v-model="unitPrice"
                    placeholder="Write a unit price of the medicine"
                    name="unitPrice"
                    rules="required"
                    type="number"
                    field-class="!py-4 !pl-5 !rounded-2xl bg-[#F6F7F9] !border-0 !shadow-none"
                  >
                    <template #label>
                      <label for="unitPrice" class="flex mb-2"
                        >Unit Price
                        <span class="ml-1 text-red-600">*</span></label
                      >
                    </template>
                  </P-Textfield>
                </div>

                <!-- Expiry Date Input -->
                <div class="">
                  <P-DatePicker
                    v-model="expiryDate"
                    placeholder="Enter the exact expiry date"
                    name="expiryDate"
                    rules="required"
                    field-class="!py-4 !pl-5 !rounded-2xl !bg-[#F6F7F9] !border-0 !shadow-none"
                  >
                    <template #label>
                      <label for="expiryDate" class="flex mb-2"
                        >Expiry Date
                        <span class="ml-1 text-red-600">*</span></label
                      >
                    </template>
                  </P-DatePicker>
                </div>

                <div>
                  <button
                    class="btn-primary w-full !py-4 text-center !rounded-2xl"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div class="h-full col-span-2">
            <div class="h-full">
              <!-- List the medicines added -->
              <div class="flex flex-col h-full gap-5 px-5">
                <div>
                  <div class="flex justify-between">
                    <h1 class="text-2xl">Added Medicines</h1>
                    <button
                      @click="addedMedicines = []"
                      class="text-primary-600"
                    >
                      Clear
                    </button>
                  </div>
                  <!-- Search -->
                  <div class="relative mt-3">
                    <P-Textfield
                      placeholder="Search"
                      name="search"
                      field-class="!py-3 !rounded-2xl bg-[#F6F7F9] !border-none !shadow-none focus:!ring-none focus:!outline-none !pl-10 "
                      v-model="addedMedicineSearchTerm"
                    >
                      <template #trailing>
                        <Icon
                          name="tabler:search"
                          color="gray"
                          class="absolute text-xl text-gray-400 -translate-y-1/2 left-3 top-1/2"
                        />
                      </template>
                    </P-Textfield>
                  </div>
                </div>
                <div
                  v-if="filteredMedicines.length > 0"
                  class="flex flex-col flex-grow max-h-[400px] overflow-y-auto scroll"
                >
                  <div class="flex flex-col flex-grow w-full h-full gap-5">
                    <div
                      v-for="(medicine, index) in filteredMedicines"
                      :key="index"
                      class="p-5 w-full bg-[#F6F7F9] rounded-2xl"
                    >
                      <div>
                        <div class="flex items-center gap-5">
                          <img
                            :src="medicine.medicine.image"
                            alt="medicine"
                            class="w-10 h-10 rounded-full"
                          />
                          <div>
                            <h1 class="text-lg">
                              {{ medicine.medicine.name }}
                            </h1>
                            <p class="text-sm">
                              {{ medicine.medicine.category }}
                            </p>
                          </div>
                        </div>

                        <div class="grid grid-cols-2 gap-5 mt-3">
                          <div class="">
                            <p class="text-sm">Quantity</p>
                            <p class="text-lg">{{ medicine.quantity }}</p>
                          </div>
                          <div>
                            <p class="text-sm">Unit Price</p>
                            <p class="text-lg">{{ medicine.unitPrice }}</p>
                          </div>

                          <div>
                            <p class="text-sm">Expiry Date</p>
                            <p class="text-lg">{{ medicine.expiryDate }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="sticky bottom-0 left-0">
                    <button
                      class="btn-primary w-full !py-4 text-center !rounded-2xl"
                    >
                      Save & Finish
                    </button>
                  </div>
                </div>
                <div
                  v-else
                  class="flex flex-col items-center justify-center w-full h-full"
                >
                  <!-- No data illustration -->
                  <img
                    src="/images/no-data.jpg"
                    alt=""
                    class="object-contain w-60"
                  />
                  <p class="mt-3 text-lg text-center text-gray-950">
                    No medicine found
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </P-Modal>
</template>
