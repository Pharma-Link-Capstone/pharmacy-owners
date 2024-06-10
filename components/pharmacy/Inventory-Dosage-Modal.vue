<script setup>
import FetchMedicines from "@/graphql/medicine/fetch_multiple_query.gql";
import FetchUsers from "@/graphql/auth/users-query.gql";
import InsertOneDosages from "@/graphql/patient/insert_one_mutation.gql";
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

/*----------------------Fetch Users----------------------*/
const userOptions = ref([]);
const userSearchTerm = ref("");
const userFilter = computed(() => {
  return {
    _or: [
      {
        first_name: {
          _ilike: `%${userSearchTerm.value}%`,
        },
      },
      {
        last_name: {
          _ilike: `%${userSearchTerm.value}%`,
        },
      },
      {
        phone_number: {
          _ilike: `%${userSearchTerm.value}%`,
        },
      },
      {
        email: {
          _ilike: `%${userSearchTerm.value}%`,
        },
      },
    ],
  };
});

const { onResult: onFetchUserResult, loading: fetchUserLoading } = lists(
  FetchUsers,
  {
    filter: userFilter,
    limit: ref(5),
    order: ref([{ first_name: "asc" }]),
  }
);

onFetchUserResult(({ data }) => {
  userOptions.value = data?.users;
});

/*----------------------Handle Form Add----------------------*/

const first_name = ref("");
const last_name = ref("");
const startDate = ref("");
const endDate = ref("");
const medicine = ref(null);
const user = ref(null);
const times = ref([]);

/*----------------------Handle Submission----------------------*/
const { handleSubmit, resetForm } = useForm({});

const {
  mutate: insertDosage,
  onDone: onInsertDosageDone,
  loading: insertDosageLoading,
} = mutator(InsertOneDosages, "pharmacist");

const onSubmit = () => {
  if (addedItems.value.length === 0) {
    notify({
      title: "Error",
      description: "Please add at least one item to continue",
      cardClass: "bg-red-100",
    });
    return;
  }

  const user_id = user.value.id;

  const user_medicines = addedItems.value.map((item) => {
    return {
      start_date: item.startDate,
      end_date: item?.endDate,
      medicine_id: item?.medicine?.id,
      usage_times: {
        data: item?.usage_times?.map((time) => {
          return {
            time: time,
          };
        }),
      },
    };
  });

  insertDosage({
    object: {
      user_id: user_id,
      first_name: first_name.value,
      last_name: last_name.value,
      user_medicines: {
        data: user_medicines,
      },
    },
  });
};

onInsertDosageDone(() => {
  notify({
    title: "Success",
    description: "Dosage instructions added successfully",
    cardClass: "bg-green-100",
  });

  emit("success");
  openModal.value = false;
});

/*----------------------Handle Items----------------------*/
const handleAddItems = handleSubmit(() => {
  const item = {
    medicine: medicine.value,
    startDate: startDate.value,
    endDate: endDate.value,
    usage_times: times.value,
  };

  addedItems.value = [...addedItems.value, item];

  medicine.value = null;
  startDate.value = "";
  endDate.value = "";
  times.value = [];
});

const removeItem = (index) => {
  addedItems.value = addedItems.value.filter((item, i) => i !== index);
};

const handleEditItem = (index) => {
  const item = addedItems.value[index];
  medicine.value = item.medicine;
  startDate.value = item.startDate;
  endDate.value = item.endDate;
  times.value = item.usage_times;
  addedItems.value = addedItems.value.filter((item, i) => i !== index);

  removeItem(index);
};

const addedItemSearchTerm = ref("");
const filteredItems = computed(() => {
  return addedItems.value.filter((item) => {
    return item.medicine.name
      .toLowerCase()
      .includes(addedItemSearchTerm.value.toLowerCase());
  });
});
const addedItems = ref([]);

const getYesterday = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return yesterday;
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
        <h1 class="text-3xl">Add Dosage Instructions</h1>
        <button class="btn-primary" @click="openModal = false">Close</button>
      </div>
    </template>
    <template #content>
      <div class="w-full h-full">
        <div
          class="relative h-full mt-5 bg-white divide-x-2 dark:bg-primary-dark-900"
        >
          <div class="grid grid-cols-6 gap-5">
            <div class="col-span-4">
              <form
                @submit.prevent="handleAddItems"
                class="flex flex-col gap-5"
              >
                <div>
                  <P-Lists-SingleSelectWithSearch
                    v-model="user"
                    placeholder="Select a user"
                    :items="userOptions"
                    name="user"
                    :return-object="true"
                    :disabled="addedItems.length > 0"
                    header-class="!bg-haze-50 !py-4 !rounded-2xl !pl-5 !border-0 !shadow-none dark:!bg-primary-dark-800 dark:!text-white"
                    rules="onerequired"
                    @search="userSearchTerm = $event"
                    supporter="dark:!bg-primary-dark-900 dark:border-primary-dark-500"
                    search-input-class="dark:!bg-primary-dark-800"
                    search-placeholder="Search by name, phone number or email"
                  >
                    <template #label>
                      <label for="user" class="flex mb-2"
                        >User <span class="ml-1 text-red-600">*</span></label
                      >
                    </template>
                    <template #row="{ item }">
                      <div class="flex items-center gap-3">
                        <img
                          :src="item?.media?.url"
                          alt="medicine"
                          class="object-cover w-10 h-10 rounded-full"
                        />
                        <div>
                          <h1 class="text-lg dark:text-gray-100">
                            {{ item?.first_name }} {{ item?.last_name }}
                          </h1>
                        </div>
                      </div>
                    </template>
                    <template #option="{ item }">
                      <p class="text-neutral-500 dark:text-gray-100">
                        No items found for search query: {{ item }}
                      </p>
                    </template>
                    <template #header="{ item }">
                      <div class="flex items-center gap-3">
                        <img
                          :src="item?.media?.url"
                          alt="medicine"
                          class="object-cover rounded-full w-7 h-7"
                        />
                        <div>
                          <h1 class="text-lg dark:text-gray-100">
                            {{ item?.first_name }} {{ item?.last_name }}
                          </h1>
                        </div>
                      </div>
                    </template>
                  </P-Lists-SingleSelectWithSearch>
                </div>

                <!--  -->
                <div class="grid grid-cols-2 gap-5">
                  <div>
                    <P-Textfield
                      v-model="first_name"
                      :disabled="addedItems.length > 0"
                      placeholder="First Name"
                      name="first_name"
                      rules="required"
                      body-class="!shadow-none relative"
                      field-class="!py-4 !pl-5 !rounded-2xl bg-haze-50 !border-0 !shadow-none dark:!bg-primary-dark-800 dark:!text-gray-100 dark:placeholder:!text-gray-200"
                    >
                      <template #label>
                        <label for="quantity" class="flex mb-2"
                          >First Name
                          <span class="ml-1 text-red-600">*</span></label
                        >
                      </template>
                    </P-Textfield>
                  </div>
                  <div>
                    <P-Textfield
                      v-model="last_name"
                      :disabled="addedItems.length > 0"
                      placeholder="Last Name"
                      name="last_name"
                      rules="required"
                      body-class="!shadow-none relative"
                      field-class="!py-4 !pl-5 !rounded-2xl bg-haze-50 !border-0 !shadow-none dark:!bg-primary-dark-800 dark:!text-gray-100 dark:placeholder:!text-gray-200"
                    >
                      <template #label>
                        <label for="quantity" class="flex mb-2"
                          >Last name
                          <span class="ml-1 text-red-600">*</span></label
                        >
                      </template>
                    </P-Textfield>
                  </div>
                </div>
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
                <div class="grid grid-cols-2 gap-5">
                  <!-- Expiry Date Input -->
                  <div class="">
                    <P-DatePicker
                      v-model="startDate"
                      placeholder="Enter the exact start date"
                      name="startDate"
                      class="relative"
                      field-class="!py-4 !pl-5 !rounded-2xl !bg-haze-50 !border-0 !shadow-none dark:!bg-primary-dark-800 dark:!text-gray-100"
                      :rules="`required|minDate:${getYesterday()}`"
                    >
                      <template #label>
                        <label for="startDate" class="flex mb-2"
                          >Start Date
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
                    <P-DatePicker
                      v-model="endDate"
                      placeholder="Enter the exact end date"
                      name="endDate"
                      class="relative"
                      field-class="!py-4 !pl-5 !rounded-2xl !bg-haze-50 !border-0 !shadow-none dark:!bg-primary-dark-800 dark:!text-gray-100"
                      :rules="
                        !!startDate
                          ? `required|minDate:${new Date(startDate)}`
                          : `required|minDate:${new Date()}`
                      "
                    >
                      <template #label>
                        <label for="endDate" class="flex mb-2"
                          >End Date
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
                </div>
                <div>
                  <P-TimePicker
                    id="calendar-timeonly"
                    :multiple="true"
                    v-model="times"
                    label="Usage times"
                  />
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

            <div class="h-full col-span-2">
              <div class="h-full">
                <!-- List the medicines added -->
                <div class="flex flex-col h-full gap-5 px-5">
                  <div>
                    <div class="flex justify-between">
                      <h1 class="text-2xl">Added Medicines</h1>
                      <button @click="addedItems = []" class="text-primary-600">
                        Clear
                      </button>
                    </div>
                    <!-- Search -->
                    <div class="relative mt-3">
                      <P-Textfield
                        placeholder="Search"
                        name="search"
                        field-class="!py-3 !rounded-2xl bg-haze-50 !border-none !shadow-none focus:!ring-none focus:!outline-none !pl-10 dark:!bg-primary-dark-800 dark:!text-gray-100"
                        v-model="addedItemSearchTerm"
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
                    v-if="filteredItems.length > 0"
                    class="flex flex-col h-full max-h-full"
                  >
                    <div
                      class="flex flex-col flex-grow w-full gap-5 overflow-y-auto scroll"
                      v-if="!insertDosageLoading"
                    >
                      <div
                        v-for="(item, index) in filteredItems"
                        :key="index"
                        class="w-full p-5 bg-haze-50 dark:bg-primary-dark-800 rounded-2xl"
                      >
                        <div>
                          <div class="flex items-center gap-5">
                            <img
                              :src="item.medicine.image_url"
                              alt="medicine"
                              class="object-cover rounded-full w-14 h-14"
                            />
                            <div>
                              <h1 class="text-lg">
                                {{ item.medicine.name }}
                              </h1>
                              <p class="text-sm">
                                {{ item.medicine.category }}
                              </p>
                            </div>
                            <div class="flex items-center gap-3">
                              <button
                                @click="removeItem(index)"
                                class="text-xl text-red-600"
                              >
                                <Icon name="tabler:trash" />
                              </button>

                              <button
                                class="text-xl text-primary-600"
                                @click="handleEditItem(index)"
                              >
                                <Icon name="tabler:pencil" />
                              </button>
                            </div>
                          </div>

                          <div class="grid grid-cols-2 gap-5 mt-3">
                            <div class="">
                              <p class="text-sm">Start Date</p>
                              <p class="text-lg">{{ item.startDate }}</p>
                            </div>
                            <div>
                              <p class="text-sm">Unit Price</p>
                              <p class="text-lg">{{ item.endDate }}</p>
                            </div>

                            <div class="col-span-2">
                              <p class="text-sm">Usage Times</p>
                              <p
                                class="flex flex-wrap gap-2 text-sm font-medium"
                              >
                                <span
                                  class="px-2 py-1 rounded-xl bg-primary-100 text-primary-600"
                                  v-for="(time, index) in item.usage_times"
                                  :key="index"
                                >
                                  {{ time }}
                                </span>
                              </p>
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
                        :disabled="insertDosageLoading"
                        class="btn-primary w-full !py-4 text-center !rounded-2xl"
                      >
                        Save & Finish
                        <Icon
                          v-if="insertDosageLoading"
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
      </div>
    </template>
  </P-Modal>
</template>
