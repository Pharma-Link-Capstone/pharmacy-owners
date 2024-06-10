<script setup>
import FetchMultipleTransactions from "@/graphql/transaction/fetch_multiple_query.gql";
import FetchPharmacy from "@/graphql/pharmacy/fetch_one_query.gql";
import get_one from "~/composables/apollo/get_one";
import lists from "~/composables/apollo/lists";

import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";

import { format, parseISO } from "date-fns";
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  layout: "app",
});

const PhID = computed(() => localStorage.getItem("PhID"));

const isPharmacist = computed(() =>
  useAuthStore().userRoles?.includes("pharmacist")
);

const analytics = computed(() => [
  {
    title: "Transactions",
    value: pharmacy.value?.medicines_count?.aggregate?.count || 0,
    icon: "hugeicons:transaction",
  },
  {
    title: "Total Quantity",
    value: pharmacy.value?.summary?.total_reviews || 0,
    icon: "fluent-mdl2:quantity",
  },
  {
    title: "Total Price",
    value: 0,
    icon: "uil:pricetag-alt",
  },
  {
    title: "Stock Out",
    value: pharmacy.value?.stockOut?.aggregate?.count || 0,
    icon: "iconoir:home-sale",
  },
  {
    title: "Stock In",
    value: pharmacy.value?.stockIn?.aggregate?.count,
    icon: "f7:purchased-circle",
  },
]);

const perPageOptions = ref([5, 10, 20, 30]);

const headers = [
  {
    text: "Type",
    value: "type",
  },
  {
    text: "Total Quantity",
    value: "quantity",
  },
  // {
  //   text: "Total Price",
  //   value: "price",
  // },
  {
    text: "Created At",
    value: "created_at",
  },
  // {
  //   text: "Actions",
  //   value: "actions",
  // },
];

const openModal = ref(false);

/*------------------ Fetch Pharmacy Medicines ----------------------*/
const limit = ref(10);
const page = ref(1);
const transactionsSort = ref([]);

const totalItems = ref(0);
const offset = computed(() => (page.value - 1) * limit.value);
const order = computed(() => {
  // const data = medicineSort.value?.map((sort) => {
  //   if (sort.hasOwnProperty("name")) {
  //     return {
  //       medicine: sort,
  //     };
  //   }
  //   return sort;
  // });
  // return data;
  return [];
});
const transactions = ref([]);
const transactionSearchTerm = ref("");
const transactionFilter = computed(() => ({
  _and: [
    {
      phramacy_id: {
        _eq: PhID.value,
      },
    },
    {
      transaction_medicnies: {
        medicine: {
          name: {
            _ilike: `%${transactionSearchTerm.value}%`,
          },
        },
      },
    },
  ],
}));

const {
  onResult: onFetchTransactionsResult,
  loading: fetchTransactionsLoading,
  refetch: refetchTransactions,
} = lists(FetchMultipleTransactions, {
  filter: transactionFilter,
  limit,
  offset,
  order: order,
});

onFetchTransactionsResult(({ data }) => {
  transactions.value = data?.transactions;

  totalItems.value = data?.length?.aggregate.count;
});

watch([limit, page], () => {
  refetchTransactions();
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
const selectedTransaction = ref({});

/*------------------- Detail Medicine ---------------------*/
const openDetailModal = ref(false);

/*------------------- Export Medicines ---------------------*/
const handleExport = () => {
  console.log("Exporting Medicines");
};

/*------------------- Stock out ---------------------*/
const openStockOutModal = ref(false);

const sum = (arr) => {
  return arr.reduce((a, b) => a + b, 0);
};

useHead({
  title: "Transactions | Pharmalink",
  meta: [
    {
      name: "description",
      content: "Dashboard",
    },
  ],
});
</script>
<template>
  <PharmacyInventoryStockOutModal
    v-if="openStockOutModal"
    v-model="openStockOutModal"
    @success="refetchTransactions"
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
        <div class="flex items-center gap-2">
          <div>
            <P-Textfield
              v-model="transactionSearchTerm"
              placeholder="Search"
              name="search"
              field-class="!h-10 pl-12 rounded-2xl dark:text-gray-100 text-gray-950 bg-haze-50 dark:bg-primary-dark-800 !border-0"
            >
              <template #leading>
                <Icon
                  class="absolute w-6 h-6 text-gray-400 -translate-y-1/2 top-1/2 left-2.5 text-xl"
                  name="lucide:search"
                ></Icon>
              </template>
            </P-Textfield>
          </div>
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
            class="dark:bg-primary-dark-700 btn-primary-outline px-3 py-1.5 rounded-md dark:text-gray-100"
            @click="openStockOutModal = true"
          >
            <icon name="hugeicons:package-out-of-stock" class="text-lg" />
            Stock Out
          </button>
        </div>
      </div>

      <!-- Table -->
      <div>
        <P-Table
          :headers="headers"
          :items="transactions"
          :loading="fetchTransactionsLoading"
          row-head-style="!bg-haze-100 dark:!bg-primary-dark-950 dark:!text-white"
          supporter-class="!border-0"
          no-item-class="!min-h-52"
          full-row-class="dark:hover:!bg-primary-dark-800"
          row-style="!rounded-none"
          v-model:sort="transactionsSort"
          @click:row="
            [(selectedTransaction = $event), (openDetailModal = true)]
          "
        >
          <!-- Medicines -->
          <!-- <template #medicines="{ item }">
            <div class="flex items-center gap-2 dark:text-white">
              <div
                v-for="(
                  transaction_medicine, index
                ) in item?.transaction_medicines"
                :key="index"
              >
                <img
                  :src="transaction_medicine.medicine?.image_url"
                  class="w-10 h-10 rounded-md"
                  alt=""
                />
                <div>
                  <p class="font-semibold">
                    {{ transaction_medicine.medicine?.name }}
                  </p>
                  <p class="text-sm">
                    {{ transaction_medicine.medicine?.description }}
                  </p>
                </div>
              </div>
            </div>
          </template> -->

          <!-- Type -->
          <template #type="{ item }">
            <p class="dark:text-white">
              {{ item.transaction_type == "IN" ? "Stock In" : "Stock Out" }}
            </p>
          </template>

          <!-- Total Quantity -->
          <template #quantity="{ item }">
            <div class="dark:text-white">
              {{ sum(item?.transaction_medicines?.map((m) => m.quantity)) }}
            </div>
          </template>

          <!-- Total Price -->
          <!-- <template #price="{ item }">
            <div class="dark:text-white">
              {{
                sum(item?.transaction_medicines?.map((m) => m?.medicine?.price))
              }}
            </div>
          </template> -->

          <!-- Created At -->
          <template #created_at="{ item }">
            <p class="dark:text-white">
              {{ format(parseISO(item?.created_at), " dd MMM, yyyy") }}
            </p>
          </template>
          <!-- Actions -->
          <!-- <template #actions="{ item }">
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
                <MenuItem
                  class="w-full px-3 py-2 text-left hover:bg-haze-200 dark:text-gray-100 dark:hover:!bg-primary-dark-800"
                >
                  <button
                    @click="
                      [
                        $event.stopPropagation(),
                        (selectedTransaction = item),
                        (openDetailModal = true),
                      ]
                    "
                  >
                    <Icon name="tabler:list-details" class="text-lg" /> View
                    Details
                  </button>
                </MenuItem>
                <MenuItem
                  class="w-full px-3 py-2 text-left hover:bg-haze-200 dark:text-gray-100 dark:hover:!bg-primary-dark-800"
                >
                  <button
                    @click="
                      [
                        $event.stopPropagation(),
                        (selectedTransaction = item),
                        (openEditModal = true),
                      ]
                    "
                  >
                    <Icon name="heroicons-solid:pencil" class="text-lg" /> Edit
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </template> -->
        </P-Table>
      </div>
    </div>

    <!-- Pagination -->
    <div class="w-full mt-3">
      <P-Paginate
        v-model="page"
        :total-data="totalItems"
        :items-per-page="limit"
        v-if="transactions?.length > 0"
      />
    </div>
  </div>
</template>
