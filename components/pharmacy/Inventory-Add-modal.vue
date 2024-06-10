<script setup>
import FetchMedicines from "@/graphql/medicine/fetch_multiple_query.gql";
import InsertMultipleMedicines from "@/graphql/medicine/insert_multiple_mutation.gql";
import lists from "~/composables/apollo/lists";
import mutator from "~/composables/apollo/mutator";
import useNotify from "~/use/notify";

definePageMeta({
  layout: "app",
});

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "success"]);

const { notify } = useNotify();

const PhID = computed(() => localStorage.getItem("PhID"));

const openModal = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
  },
});

/*----------------------Fetch Medicines----------------------*/
const medicineOptions = ref([]);
const medicineSearchTerm = ref("");
const medicineFiler = computed(() => {
  return {
    name: {
      _ilike: `%${medicineSearchTerm.value}%`,
    },
  };
});

const { onResult: onFetchMedicineResult, loading: fetchMedicineLoading } =
  lists(FetchMedicines, {
    filter: medicineFiler,
    limit: ref(10),
    order: ref([{ name: "asc" }]),
  });

onFetchMedicineResult(({ data }) => {
  medicineOptions.value = data?.medicines;
});

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
  addedMedicines.value = [
    ...addedMedicines.value,
    {
      medicine: medicine.value,
      quantity: quantity.value,
      unitPrice: unitPrice.value,
      expiryDate: expiryDate.value,
    },
  ];

  resetForm();

  medicine.value = null;
});

/*----------------------Handle Submission----------------------*/
const {
  mutate: insertMedicines,
  loading: insertMedicinesLoading,
  onDone: onInsertMedicinesDone,
} = mutator(InsertMultipleMedicines, "pharmacist");

const onSubmit = () => {
  const data = addedMedicines.value.map((item) => {
    return {
      pharmacy_id: PhID.value,
      medicine_id: item?.medicine?.id,
      expire_at: item.expiryDate,
      price: item.unitPrice,
      quantity: item.quantity,
    };
  });

  const transactionObject = {
    phramacy_id: PhID.value,
    transaction_type: "IN",
    transaction_medicnies: {
      data: addedMedicines.value.map((item) => {
        return {
          medicine_id: item?.medicine?.id,
          quantity: item.quantity,
        };
      }),
    },
  };

  insertMedicines({
    objects: data,
    transactionObject,
  });
};

onInsertMedicinesDone(() => {
  openModal.value = false;
  addedMedicines.value = [];
  notify({
    title: "Success",
    description: "Medicines added successfully",
    cardClass: "bg-green-100",
  });

  emit("success");
});

const removeMedicine = (index) => {
  addedMedicines.value.splice(index, 1);
};

const handleEditMedicine = (index) => {
  medicine.value = filteredMedicines.value[index].medicine;
  quantity.value = parseInt(filteredMedicines.value[index].quantity);
  unitPrice.value = parseFloat(filteredMedicines.value[index].unitPrice);
  expiryDate.value = filteredMedicines.value[index].expiryDate;

  console.log(unitPrice.value, expiryDate.value, quantity.value);
  removeMedicine(index);
};
</script>

<template>
  <P-Modal
    v-model="openModal"
    :auto-close="false"
    body-class="w-[1200px] p-10 dark:!bg-primary-dark-900 dark:!text-gray-100"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <h1 class="text-3xl">Add Inventory</h1>
        <button class="btn-primary" @click="openModal = false">Close</button>
      </div>
    </template>
    <template #content>
      <div class="w-full h-full">
        <div
          class="relative grid h-full grid-cols-6 gap-5 mt-5 bg-white divide-x-2 dark:bg-primary-dark-900"
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
                    :items="medicineOptions"
                    name="medicine"
                    :return-object="true"
                    header-class="!bg-haze-50 !py-4 !rounded-2xl !pl-5 !border-0 !shadow-none dark:!bg-primary-dark-800 dark:!text-white"
                    rules="onerequired"
                    @search="medicineSearchTerm = $event"
                    supporter="dark:!bg-primary-dark-900 dark:border-primary-dark-500"
                    search-input-class="dark:!bg-primary-dark-800"
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
                          :src="item?.image_url"
                          alt="medicine"
                          class="object-cover w-10 h-10 rounded-full"
                        />
                        <div>
                          <h1 class="text-lg dark:text-gray-100">
                            {{ item?.name }}
                          </h1>
                          <p class="text-sm dark:text-gray-100">
                            {{ item?.category }}
                          </p>
                        </div>
                      </div>
                    </template>
                    <template #option="{ item }">
                      <p class="text-neutral-500 dark:text-gray-100">
                        No items found for search query: {{ item }}
                      </p>
                    </template>
                  </P-Lists-SingleSelectWithSearch>
                </div>

                <!-- Quantity Input -->
                <div>
                  <P-Textfield
                    v-model="quantity"
                    placeholder="How much medicine "
                    name="quantity"
                    rules="required|positive|integer"
                    type="number"
                    body-class="!shadow-none relative"
                    field-class="!py-4 !pl-5 !rounded-2xl bg-haze-50 !border-0 !shadow-none dark:!bg-primary-dark-800 dark:!text-gray-100 dark:placeholder:!text-gray-200"
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
                    placeholder="Unit price in ETB"
                    name="unitPrice"
                    rules="required|positive"
                    type="number"
                    body-class="!shadow-none relative"
                    field-class="!py-4 !pl-14 !rounded-2xl bg-haze-50 !border-0 !shadow-none dark:!bg-primary-dark-800 dark:!text-gray-100 dark:placeholder:!text-gray-200"
                  >
                    <template #label>
                      <label for="unitPrice" class="flex mb-2"
                        >Unit Price
                        <span class="ml-1 text-red-600">*</span></label
                      >
                    </template>
                    <template #leading>
                      <div
                        class="absolute top-0 left-0 flex items-center justify-center h-full px-3 bg-haze-200 dark:!bg-primary-dark-950 dark:!text-gray-100 w-fit"
                      >
                        ETB
                      </div>
                    </template>
                  </P-Textfield>
                </div>

                <!-- Expiry Date Input -->
                <div class="">
                  <P-DatePicker
                    v-model="expiryDate"
                    placeholder="Enter the exact expiry date"
                    name="expiryDate"
                    class="relative"
                    field-class="!py-4 !pl-5 !rounded-2xl !bg-haze-50 !border-0 !shadow-none dark:!bg-primary-dark-800 dark:!text-gray-100"
                    :rules="`required|minDate:${new Date()}`"
                  >
                    <template #label>
                      <label for="expiryDate" class="flex mb-2"
                        >Expiry Date
                        <span class="ml-1 text-red-600">*</span></label
                      >
                    </template>
                    <template #trailing>
                      <Icon
                        name="lucide:calendar"
                        color="gray"
                        class="absolute text-2xl -translate-y-1/2 text-gray-950 right-5 top-1/2"
                      />
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
                      field-class="!py-3 !rounded-2xl bg-haze-50 !border-none !shadow-none focus:!ring-none focus:!outline-none !pl-10 dark:!bg-primary-dark-800 dark:!text-gray-100"
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
                  class="flex flex-col max-h-[400px] h-full"
                >
                  <div
                    class="flex flex-col flex-grow w-full gap-5 overflow-y-auto scroll"
                    v-if="!insertMedicinesLoading"
                  >
                    <div
                      v-for="(medicine, index) in filteredMedicines"
                      :key="index"
                      class="w-full p-5 bg-haze-50 dark:bg-primary-dark-800 rounded-2xl"
                    >
                      <div>
                        <div class="flex items-center gap-5">
                          <img
                            :src="medicine.medicine.image_url"
                            alt="medicine"
                            class="object-cover rounded-full w-14 h-14"
                          />
                          <div>
                            <h1 class="text-lg">
                              {{ medicine.medicine.name }}
                            </h1>
                            <p class="text-sm">
                              {{ medicine.medicine.category }}
                            </p>
                          </div>
                          <div class="flex items-center gap-3">
                            <button
                              @click="removeMedicine(index)"
                              class="text-xl text-red-600"
                            >
                              <Icon name="tabler:trash" />
                            </button>

                            <button
                              class="text-xl text-primary-600"
                              @click="handleEditMedicine(index)"
                            >
                              <Icon name="tabler:pencil" />
                            </button>
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
                  <div
                    class="flex flex-col flex-grow w-full gap-5 overflow-y-auto scroll"
                    v-else
                  >
                    <P-Loader />
                  </div>
                  <div class="">
                    <button
                      @click="onSubmit"
                      :disabled="insertMedicinesLoading"
                      class="btn-primary w-full !py-4 text-center !rounded-2xl"
                    >
                      Save & Finish
                      <Icon
                        v-if="insertMedicinesLoading"
                        name="line-md:loading-twotone-loop"
                        class="text-2xl"
                      />
                    </button>
                  </div>
                </div>
                <div v-else class="w-full h-full">
                  <P-NoItems />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </P-Modal>
</template>
