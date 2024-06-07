<script setup>
import FetchMedicines from "@/graphql/medicine/fetch_multiple_query.gql";
import UpdateMedicine from "@/graphql/medicine/edit_one_mutation.gql";
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
  medicine: {
    type: Object,
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

/*----------------------Form Fields----------------------*/
const medicine = computed({
  get: () => props.medicine?.medicine,
  set: (value) => {
    props.medicine.medicine = value;
  },
});
const quantity = computed({
  get: () => props.medicine?.quantity,
  set: (value) => {
    props.medicine.quantity = value;
  },
});
const unitPrice = computed({
  get: () => props.medicine?.price,
  set: (value) => {
    props.medicine.price = value;
  },
});
const expiryDate = computed({
  get: () => props.medicine?.expire_at,
  set: (value) => {
    props.medicine.expire_at = value;
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

/*----------------------Handle Submission----------------------*/
const {
  mutate: updateMedicine,
  loading: updateMedicineLoading,
  onDone: onUpdateMedicineDone,
} = mutator(UpdateMedicine, "pharmacist");

// const onSubmit = () => {
//   const data = addedMedicines.value.map((item) => {
//     return {
//       pharmacy_id: PhID.value,
//       medicine_id: item?.medicine?.id,
//       expire_at: item.expiryDate,
//       price: item.unitPrice,
//       quantity: item.quantity,
//     };
//   });

//   insertMedicines({
//     objects: data,
//   });
// };

// onInsertMedicinesDone(() => {
//   openModal.value = false;
//   addedMedicines.value = [];
//   notify({
//     title: "Success",
//     description: "Medicines added successfully",
//     cardClass: "bg-green-100",
//   });

//   emit("success");
// });

const handleEditSubmit = () => {
  const object = {
    expire_at: expiryDate.value,
    price: unitPrice.value,
    quantity: quantity.value,
    updated_at: new Date(),
  };

  updateMedicine({
    object: object,
    id: props.medicine.id,
  });
};

onUpdateMedicineDone(() => {
  openModal.value = false;
  notify({
    title: "Success",
    description: "Medicine updated successfully",
    cardClass: "bg-green-100",
  });

  emit("success");
});
</script>

<template>
  <P-Modal
    v-model="openModal"
    :auto-close="false"
    body-class="w-[800px] p-10 dark:!bg-primary-dark-900 dark:!text-gray-100"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <h1 class="text-3xl">Edit Inventory</h1>
        <button class="btn-primary" @click="openModal = false">Close</button>
      </div>
    </template>
    <template #content>
      <div class="w-full h-full">
        <div
          class="relative h-full mt-5 bg-white divide-x-2 dark:bg-primary-dark-900"
        >
          <div>
            <div class="mx-auto">
              <form
                @submit.prevent="handleEditSubmit"
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
                    :disabled="true"
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
                    field-class="!py-4 !pl-5 !rounded-2xl bg-haze-50 !border-0 !shadow-none dark:!bg-primary-dark-800 dark:!text-gray-100"
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
                    placeholder="unit price in ETB"
                    name="unitPrice"
                    rules="required|positive"
                    type="number"
                    body-class="!shadow-none relative"
                    field-class="!py-4 !pl-14 !rounded-2xl bg-haze-50 !border-0 !shadow-none dark:!bg-primary-dark-800 dark:!text-gray-100"
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
                    :disabled="updateMedicineLoading"
                    class="btn-primary flex items-center justify-center gap-2 w-full !py-4 text-center !rounded-2xl"
                  >
                    Edit
                    <Icon
                      v-if="updateMedicineLoading"
                      name="line-md:loading-twotone-loop"
                      class="text-2xl"
                    />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </template>
  </P-Modal>
</template>
