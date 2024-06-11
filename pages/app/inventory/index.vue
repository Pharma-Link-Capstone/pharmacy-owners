<script setup>
import FetchMultipleMedicines from "@/graphql/pharmacy/medicine/fetch_multiple_query.gql";
import FetchPharmacy from "@/graphql/pharmacy/fetch_one_query.gql";
import get_one from "~/composables/apollo/get_one";
import lists from "~/composables/apollo/lists";

import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";

import { format, parseISO } from "date-fns";
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  layout: "app",
});

const router = useRouter();
const route = useRoute();

const PhID = computed(() => localStorage.getItem("PhID"));

const isPharmacist = computed(() =>
  useAuthStore().userRoles?.includes("pharmacist")
);

const analytics = computed(() => [
  {
    title: "Medicine",
    value: pharmacy.value?.medicines_count?.aggregate?.count || 0,
    icon: "healthicons:medicines-outline",
  },
  {
    title: "Reviews",
    value: pharmacy.value?.summary?.total_reviews || 0,
    icon: "material-symbols:reviews",
  },
  {
    title: "Expired",
    value: pharmacy.value?.expired?.aggregate?.count || 0,
    icon: "wpf:view-file",
  },
  {
    title: "Total Price",
    value:
      medicines.value?.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ) || 0,
    icon: "tdesign:money",
  },
  {
    title: "Total Quantity",
    value: medicines.value?.reduce((acc, item) => acc + item.quantity, 0),
    icon: "heroicons-solid:cube",
  },
]);

const perPageOptions = ref([5, 10, 20, 30]);

const headers = [
  {
    text: "Medicine Name",
    value: "name",
  },
  {
    text: "Composition",
    value: "composition",
    sortable: false,
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
    value: "expire_at",
  },
  {
    text: "Last Updated",
    value: "updated_at",
  },
  {
    text: "Actions",
    value: "actions",
  },
];

const openModal = ref(false);

/*------------------ Fetch Pharmacy Medicines ----------------------*/
const limit = ref(10);
const page = ref(1);
const medicineSort = ref([]);
const expired = ref(0);

const totalItems = ref(0);
const offset = computed(() => (page.value - 1) * limit.value);
const order = computed(() => {
  const data = medicineSort.value?.map((sort) => {
    if (sort.hasOwnProperty("name")) {
      return {
        medicine: sort,
      };
    }
    return sort;
  });
  return data;
});
const medicines = ref([]);
const medicineSearchTerm = computed({
  get: () => route.query.q || "",
  set: (value) => {
    router.push({
      query: {
        ...route.query,
        q: value,
      },
    });
  },
});

const filterFromQuery = computed(() => {
  const query = route.query;

  const _and = [];

  if (query.category) {
    _and.push({
      medicine: {
        category: {
          name: {
            _eq: query.category,
          },
        },
      },
    });
  }

  if (query.startPrice) {
    _and.push({
      price: {
        _gte: parseFloat(query.startPrice),
      },
    });
  }

  if (query.endPrice) {
    _and.push({
      price: {
        _lte: parseFloat(query.endPrice),
      },
    });
  }

  if (query.startDate) {
    _and.push({
      created_at: {
        _gte: query.startDate,
      },
    });
  }

  if (query.endDate) {
    _and.push({
      created_at: {
        _lte: query.endDate,
      },
    });
  }

  return _and;
});
const medicineFilter = computed(() => ({
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
    ...filterFromQuery.value,
  ],
}));

const {
  onResult: onFetchMedicineResult,
  loading: fetchMedicineLoading,
  refetch: refetchMedicines,
} = lists(FetchMultipleMedicines, {
  filter: medicineFilter,
  limit,
  offset,
  order: order,
});

onFetchMedicineResult(({ data }) => {
  medicines.value = data?.pharmacy_medicines;
  totalItems.value = data?.length?.aggregate?.count;
  expired.value = data?.expired?.aggregate?.count;
});

watch([limit, page], () => {
  refetchMedicines();
});

/*------------------- Fetch Pharmacy by ID ---------------------*/
const pharmacy = ref({});

const {
  onResult: onFetchPharmacyResult,
  loading: fetchPharmacyLoading,
  refetch: refetchPharmacy,
} = get_one(FetchPharmacy, PhID.value);

onFetchPharmacyResult(({ data }) => {
  pharmacy.value = data?.pharmacy;
});

/*------------------- Edit Medicine ---------------------*/
const openEditModal = ref(false);
const selectedMedicine = ref({});

/*------------------- Detail Medicine ---------------------*/
const openDetailModal = ref(false);

/*------------------- Export Medicines ---------------------*/
const handleExport = () => {
  console.log("Exporting Medicines");
};

/*------------------- Stock out ---------------------*/
const openStockOutModal = ref(false);

/*------------------- Search ---------------------*/
const { handleSubmit } = useForm({});
const handleSearch = handleSubmit((values) => {
  medicineSearchTerm.value = values.search;
  refetchMedicines({
    filter: medicineFilter.value,
  });
});

/*------------------- Dosage Instructions ---------------------*/
const openDosageModal = ref(false);

function isTimeInThePast(givenTime) {
  const givenDate = new Date(givenTime);

  const now = new Date();

  return givenDate < now;
}

useHead({
  title: "Medicines | Pharmalink Portal",
  meta: [
    {
      name: "description",
      content: "Dashboard",
    },
  ],
});
</script>
<template>
  <PharmacyInventoryAddModal
    v-if="openModal"
    v-model="openModal"
    @success="[refetchMedicines(), refetchPharmacy()]"
  />

  <PharmacyInventoryEditModal
    v-if="openEditModal"
    v-model="openEditModal"
    :medicine="selectedMedicine"
    @success="refetchMedicines"
  />

  <!-- <PharmacyInventoryDetailModal
    v-if="openDetailModal"
    v-model="openDetailModal"
    :medicine="selectedMedicine"
  /> -->

  <PharmacyInventoryStockOutModal
    v-if="openStockOutModal"
    v-model="openStockOutModal"
    @success="refetchMedicines"
  />

  <PharmacyInventoryDosageModal
    v-if="openDosageModal"
    v-model="openDosageModal"
  />

  <div>
    <!-- Analytic Cards -->
    <div class="grid grid-cols-5 gap-12" v-if="!fetchPharmacyLoading">
      <Dashboard-Card-Analytic
        v-for="(analytic, index) in analytics"
        :key="index"
        :analytic="analytic"
      />
    </div>
    <div v-else class="grid h-32 grid-cols-5 gap-12">
      <div v-for="i in 5" :key="i" class="w-full h-full">
        <SkeletonLoadingAnalytic />
      </div>
    </div>

    <!-- Body -->
    <div class="p-5 mt-5 bg-white dark:bg-primary-dark-900">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <Medicines-Filter @filter="refetchMedicines" />
          <form @submit.prevent="handleSearch">
            <P-Textfield
              placeholder="Search"
              name="search"
              field-class="!h-10 pl-12 rounded-2xl dark:text-gray-100 text-gray-950 bg-haze-50 dark:bg-primary-dark-800 !border-0"
            >
              <template #leading>
                <button
                  class="h-max w-max absolute w-6 h-6 cursor-pointer text-gray-400 -translate-y-1/2 top-1/2 left-2.5"
                >
                  <Icon
                    @click="handleSearch"
                    class="text-xl"
                    name="lucide:search"
                  ></Icon>
                </button>
              </template>
            </P-Textfield>
          </form>
          <div
            class="flex items-center self-end justify-end float-right gap-2 px-3 py-2 w-max rounded-xl"
          >
            <span class="dark:text-white">Show</span>
            <select
              class="w-20 h-10 py-1 !border-0 rounded-md bg-haze-50 dark:bg-primary-dark-800 dark:text-gray-100 text-gray-950"
              v-model="limit"
            >
              <option v-for="item in perPageOptions" :key="item" :value="item">
                {{ item }}
              </option>
            </select>
          </div>
        </div>

        <div
          v-if="isPharmacist && pharmacy.status == 'ACTIVE'"
          class="flex items-center gap-3"
        >
          <button
            @click="openModal = true"
            class="px-3 py-1.5 rounded-md flex items-center justify-center gap-2 bg-primary-600 text-white"
          >
            <Icon name="lucide:plus" class="text-lg" /> Add Medicine
          </button>
          <button
            class="dark:bg-primary-dark-700 px-3 py-1.5 rounded-md btn-primary-outline dark:text-gray-100"
            @click="openStockOutModal = true"
          >
            <icon name="hugeicons:package-out-of-stock" class="text-lg" />
            Stock Out
          </button>

          <button
            @click="openDosageModal = true"
            class="dark:bg-primary-dark-700 px-3 py-1.5 rounded-md btn-primary-outline dark:text-gray-100"
          >
            <icon
              name="material-symbols:integration-instructions-outline"
              class="text-lg"
            />
            Enter Dosage Instructions
          </button>
        </div>
      </div>

      <!-- Table -->
      <div>
        <P-Table
          :headers="headers"
          :items="medicines"
          :loading="fetchMedicineLoading"
          row-head-style="!bg-haze-100 dark:!bg-primary-dark-950 dark:!text-white"
          supporter-class="!border-0"
          no-item-class="!min-h-52"
          full-row-class="dark:hover:!bg-primary-dark-800"
          row-style="!rounded-none"
          v-model:sort="medicineSort"
          @click:row="[(selectedMedicine = $event), (openDetailModal = true)]"
        >
          <!-- Name and Image -->
          <template #name="{ item }">
            <div class="flex items-center gap-3">
              <img
                :src="item?.medicine?.image_url"
                class="w-8 h-8 rounded-full"
                :alt="item?.medicine?.name"
              />
              <p
                class="ml-2 max-w-[20ch] line-clamp-1 dark:text-gray-100"
                :title="item?.medicine?.name"
              >
                {{ item?.medicine?.name }}
              </p>
            </div>
          </template>

          <!-- Composition -->
          <template #composition="{ item }">
            <p class="dark:text-gray-100">{{ item?.medicine?.composition }}</p>
          </template>

          <!-- Category -->
          <template #category="{ item }">
            <p class="dark:text-gray-100">
              {{ item?.medicine?.category?.name || "--" }}
            </p>
          </template>

          <!-- Price -->
          <template #price="{ item }">
            <p class="dark:text-gray-100">{{ item?.price }}</p>
          </template>

          <!-- Quantity -->
          <template #quantity="{ item }">
            <p class="dark:text-gray-100">{{ item?.quantity }}</p>
          </template>

          <!-- Expiry Date -->
          <template #expire_at="{ item }">
            <p
              class="dark:text-gray-100"
              v-if="!isTimeInThePast(item?.expire_at)"
            >
              {{ format(item?.expire_at, "MMM dd, yyyy") }}
            </p>
            <p class="dark:text-gray-100" v-else>
              <span class="text-red-500">Expired</span>
            </p>
          </template>

          <!-- Last Updated -->
          <template #updated_at="{ item }">
            <p class="dark:text-gray-100">
              {{ format(item?.updated_at, "MMM dd, yyyy") }}
            </p>
          </template>

          <!-- Actions -->
          <template #actions="{ item }">
            <Menu>
              <MenuButton class="relative" @click="$event.stopPropagation()">
                <Icon
                  name="tabler:dots"
                  class="text-2xl rotate-90 dark:text-gray-100"
                />
              </MenuButton>
              <MenuItems
                class="absolute right-0 z-20 mt-2 overflow-hidden bg-white rounded shadow w-36 dark:bg-primary-dark-950"
              >
                <!-- <MenuItem
                  class="w-full px-3 py-2 text-left hover:bg-haze-200 dark:text-gray-100 dark:hover:!bg-primary-dark-800"
                >
                  <button
                    @click="
                      [
                        $event.stopPropagation(),
                        (selectedMedicine = item),
                        (openDetailModal = true),
                      ]
                    "
                  >
                    <Icon name="tabler:list-details" class="text-lg" /> View
                    Details
                  </button>
                </MenuItem> -->
                <MenuItem
                  class="w-full px-3 py-2 text-left hover:bg-haze-200 dark:text-gray-100 dark:hover:!bg-primary-dark-800"
                  v-if="isPharmacist && pharmacy.status == 'ACTIVE'"
                >
                  <button
                    @click="
                      [
                        $event.stopPropagation(),
                        (selectedMedicine = item),
                        (openEditModal = true),
                      ]
                    "
                  >
                    <Icon name="heroicons-solid:pencil" class="text-lg" /> Edit
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </template>
        </P-Table>
      </div>
    </div>

    <!-- Pagination -->
    <div class="w-full mt-3">
      <P-Paginate
        v-model="page"
        :total-data="totalItems"
        :items-per-page="limit"
        v-if="medicines.length > 0"
      />
    </div>
  </div>
</template>
