<script setup>
import FetchMedicines from "@/graphql/pharmacy/medicine/fetch_multiple_query.gql";
import InsertTransaction from "@/graphql/transaction/insert_one_mutation.gql";
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
    _and: [
      {
        pharmacy_id: {
          _eq: PhID.value,
        },
      },
      {
        medicine: {
          name: {
            _ilike: `%${medicineSearchTerm.value}%`,
          },
        },
      },
    ],
  };
});

const { onResult: onFetchMedicineResult, loading: fetchMedicineLoading } =
  lists(FetchMedicines, {
    filter: medicineFiler,
    limit: ref(10),
    order: ref([{ expire_at: "desc" }]),
  });

onFetchMedicineResult(({ data }) => {
  medicineOptions.value = data?.pharmacy_medicines;
});

/*----------------------Handle Form Add----------------------*/
const addedMedicines = ref([]);
const addedMedicineSearchTerm = ref("");
const filteredMedicines = computed(() => {
  return addedMedicines.value.filter((item) =>
    item.medicine?.medicine?.name
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

/*----------------------Handle Submission----------------------*/
const {
  mutate: insertMedicines,
  loading: insertMedicinesLoading,
  onDone: onInsertMedicinesDone,
} = mutator(InsertTransaction, "pharmacist");

const onSubmit = () => {
  const transactionObject = {
    phramacy_id: PhID.value,
    transaction_type: "OUT",
    transaction_medicnies: {
      data: addedMedicines.value.map((item) => {
        return {
          medicine_id: item?.medicine?.medicine?.id,
          quantity: item.quantity,
        };
      }),
    },
  };

  const pharmacyMedicineObject = addedMedicines.value?.map((item) => {
    return {
      where: {
        id: {
          _eq: item?.medicine?.id,
        },
      },
      _set: {
        quantity: item?.medicine?.quantity - item.quantity,
      },
    };
  });

  insertMedicines({
    transactionObject,
    pharmacyMedicineObject,
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
                    header-class="!bg-haze-50 !py-4 !rounded-2xl !pl-5 !border-0 !shadow-none dark:!bg-primary-dark-800 dark:!text-gray-100"
                    rules="onerequired"
                    @search="medicineSearchTerm = $event"
                    supporter="dark:!bg-primary-dark-900 dark:border-primary-dark-500"
                    search-input-class="dark:!bg-primary-dark-800"
                  >
                    <template #header="{ item }">
                      <div>
                        {{ item?.medicine?.name }}
                      </div>
                    </template>
                    <template #label>
                      <label for="medicine" class="flex mb-2"
                        >Medicine
                        <span class="ml-1 text-red-600">*</span></label
                      >
                    </template>
                    <template #row="{ item }">
                      <div class="flex items-center gap-3">
                        <img
                          :src="item?.medicine?.image_url"
                          alt="medicine"
                          class="object-cover w-10 h-10 rounded-full"
                        />
                        <div>
                          <h1 class="text-lg dark:text-gray-100">
                            {{ item?.medicine?.name }}
                          </h1>
                          <p class="text-sm dark:text-gray-100">
                            {{ item?.medicine?.category }}
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
                    :rules="`required|positive|integer|max:${
                      medicine?.quantity || 1000000
                    }`"
                    :key="medicine"
                    type="number"
                    body-class="!shadow-none relative"
                    field-class="!py-4 !pl-5 !rounded-2xl bg-haze-50 !border-0 !shadow-none dark:!bg-primary-dark-800 dark:!text-gray-100"
                  >
                    <template #label>
                      <label for="quantity" class="flex mb-2"
                        >Quantity
                        <span class="ml-1 text-red-600">*</span></label
                      >
                    </template>
                  </P-Textfield>
                  <!-- Show Available in stock -->
                  <p v-if="medicine" class="text-sm text-yellow-600">
                    Available in stock: {{ medicine?.quantity || 0 }}
                  </p>
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
                            :src="medicine?.medicine?.medicine?.image_url"
                            alt="medicine"
                            class="object-cover rounded-full w-14 h-14"
                          />
                          <div>
                            <h1 class="text-lg">
                              {{ medicine.medicine?.medicine?.name }}
                            </h1>
                            <p class="text-sm">
                              {{ medicine.medicine?.medicine?.category }}
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
