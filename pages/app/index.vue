<script setup>
import FetchPharmacies from "@/graphql/pharmacy/fetch_multiple_query.gql";
import FetchChartData from "@/graphql/chart.gql";
import lists from "~/composables/apollo/lists";
import { useAuthStore } from "~/stores/auth";
import { parseISO, format } from "date-fns";

definePageMeta({
  layout: "app",
});

const { userRoles, PhID: PhIDFromStore } = useAuthStore();

const PhID = computed({
  get: () => localStorage.getItem("PhID") || PhIDFromStore,
  set: (value) => localStorage.setItem("PhID", value),
});

/*--- Fetch Pharmacies ---*/
const role = computed(() => {
  if (userRoles.includes("pharmacist")) {
    return "pharmacist";
  }
  return "user";
});
const pharmacy = ref({});
const pharmacyFilter = computed(() => {
  return {
    id: {
      _eq: PhID.value,
    },
  };
});

const pharmacyEnabled = computed(() => {
  return !!PhID.value;
});

const { onResult: onFetchPharmaciesResult, loading: fetchPharmaciesLoading } =
  lists(FetchPharmacies, {
    filter: pharmacyFilter,
    role,
    enabled: pharmacyEnabled,
  });

onFetchPharmaciesResult(({ data }) => {
  pharmacy.value = data?.pharmacies[0];
});

/*--- Fetch Chart Data ---*/
const chartData = ref({});
const { onResult: onFetchChartDataResult, loading: fetchChartDataLoading } =
  lists(FetchChartData, {
    role,
    filter: computed(() => PhID.value),
    enabled: pharmacyEnabled,
  });

onFetchChartDataResult(({ data }) => {
  chartData.value = data;
});

const stockInPercentage = computed(() => {
  if (
    !chartData.value?.stockInPercent ||
    chartData.value?.stockInPercent?.length == 0
  )
    return 0;
  return chartData.value?.stockInPercent[0].week;
});

const stockOutPercentage = computed(() => {
  if (
    !chartData.value?.stockOutPercent ||
    chartData.value?.stockOutPercent?.length == 0
  )
    return 0;
  return chartData.value?.stockOutPercent[0]?.week;
});

const stockInData = computed(() => {
  return {
    name: "Stock In",
    data: chartData.value?.stockIn?.map((item) => item.out_quantity),
  };
});

const stockOutData = computed(() => {
  return {
    name: "Stock Out",
    data: chartData.value?.stockOut?.map((item) => item.out_quantity),
  };
});

const dailyVisit = computed(() => {
  return [
    {
      name: "Visitors",
      data: chartData.value?.dailyVisitsInWeek?.map((item) => item.visit_count),
    },
  ];
});

const totalStockIn = computed(() => {
  let _sum = 0;
  stockInData.value.data?.map((stock) => {
    _sum += parseInt(stock);
  });
  return _sum;
});

const totalStockOut = computed(() => {
  let _sum = 0;
  stockOutData.value.data?.map((stock) => {
    _sum += parseInt(stock);
  });
  return _sum;
});

const xAxisVariables = computed(() =>
  chartData.value?.stockIn?.map((item) =>
    format(parseISO(item.transaction_date), "eee")
  )
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
    title: "Transaction",
    value: pharmacy.value?.transactions_aggregate?.aggregate?.count || 0,
    icon: "wpf:view-file",
  },
  {
    title: "Viewed",
    value: pharmacy.value?.summary?.view_count || 0,
    icon: "iconoir:eye",
  },
  {
    title: "Expired",
    value: pharmacy.value?.expired?.aggregate?.count || 0,
    icon: "carbon:touch-interaction",
  },
]);

const ratingValue = computed(() => {
  let val = 0;

  pharmacy.value?.reviews?.forEach((review) => {
    val += review.rating;
  });

  return val / pharmacy.value?.reviews?.length;
});

const showTransactionChart = computed(() => {
  return (
    role.value == "pharmacist" &&
    stockInData.value.data?.length > 0 &&
    stockOutData.value.data?.length > 0
  );
});

const showTrafficChart = computed(() => {
  return role.value == "pharmacist" && dailyVisit.value?.length > 0;
});

useHead({
  title: "Dashboard | Pharmalink",
  meta: [
    {
      name: "description",
      content: "Dashboard",
    },
  ],
});
</script>
<template>
  <div class="w-full" v-if="!!PhID">
    <!-- Analytic Cards -->
    <div class="grid grid-cols-5 gap-12" v-if="!fetchPharmaciesLoading">
      <Dashboard-Card-Analytic
        v-for="(analytic, index) in analytics"
        :key="index"
        :analytic="analytic"
      />
    </div>

    <!-- Skeleton -->
    <div v-else class="grid h-32 grid-cols-5 gap-12">
      <div v-for="i in 5" :key="i" class="w-full h-full">
        <SkeletonLoadingAnalytic />
      </div>
    </div>

    <!--  -->

    <div class="grid grid-cols-12 gap-10 mt-5">
      <!-- Inventory Chart -->
      <!-- Chart Skeleton Loader -->
      <div v-if="fetchChartDataLoading" class="w-full h-full col-span-6">
        <SkeletonLoadingAreaChart />
      </div>
      <div
        v-else-if="!showTransactionChart"
        class="flex flex-col items-center justify-center w-full h-full col-span-6 p-6 text-center bg-white rounded-lg shadow-md dark:bg-primary-dark-900"
      >
        <div>
          <div class="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-12 h-12 mx-auto text-gray-500 dark:text-haze-100"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 17v-2a4 4 0 100-8 4 4 0 100 8v2m0 0h6m-6 0v2m0-6h6m-6 0v-2m0 0h6"
              />
            </svg>
            <h2
              class="mt-4 text-lg font-semibold text-gray-700 dark:text-haze-100"
            >
              No Data Available
            </h2>
            <p class="mt-2 text-gray-600 dark:text-haze-100">
              There is currently no data to display in the chart.
            </p>
          </div>
        </div>
      </div>
      <div
        class="col-span-6 px-10 py-6 bg-white dark:bg-primary-dark-900 rounded-3xl"
        v-else
      >
        <h1 class="text-xl font-semibold dark:text-white">
          Weekly Stock In vs. Stock Out Analysis
        </h1>
        <div class="flex items-center">
          <div class="flex flex-col gap-10">
            <div>
              <div class="">
                <div class="flex items-center gap-3">
                  <div class="flex items-center gap-2">
                    <span class="w-4 h-4 rounded-full bg-[#4318FF]"></span>
                    <span
                      class="text-3xl font-bold text-gray-950 dark:text-gray-200"
                      >{{ totalStockIn }}</span
                    >
                  </div>
                  <div
                    class="flex items-center gap-1"
                    :class="
                      stockOutPercentage >= 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    "
                  >
                    <Icon name="uil:arrow-up" v-if="stockInPercentage >= 0" />
                    <Icon name="uil:arrow-down" v-else />
                    <span class="text-sm"
                      >{{ stockInPercentage >= 0 ? "+" : "-"
                      }}{{ stockInPercentage }}%</span
                    >
                  </div>
                </div>
                <p class="text-sm font-medium text-gray-500 dark:text-haze-100">
                  Total Stock In
                </p>
              </div>
            </div>
            <div>
              <div class="">
                <div class="flex items-center gap-3">
                  <div class="flex items-center gap-2">
                    <span class="w-4 h-4 rounded-full bg-[#6AD2FF]"></span>
                    <span
                      class="text-3xl font-bold text-gray-950 dark:text-gray-200"
                      >{{ totalStockOut }}</span
                    >
                  </div>
                  <div
                    class="flex items-center gap-1"
                    :class="
                      stockOutPercentage >= 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    "
                  >
                    <Icon name="uil:arrow-up" v-if="stockOutPercentage >= 0" />
                    <Icon name="uil:arrow-down" v-else />
                    <span class="text-sm"
                      >{{ stockOutPercentage >= 0 ? "+" : "-"
                      }}{{ stockOutPercentage }}%</span
                    >
                  </div>
                </div>
                <p class="text-sm font-medium text-gray-500 dark:text-haze-100">
                  Total Stock Out
                </p>
              </div>
            </div>
          </div>

          <ChartSplineArea
            v-if="!fetchChartDataLoading && stockInData && stockOutData"
            :key="stockInData"
            class="w-[500px] h-[300px]"
            :series="[stockInData, stockOutData]"
            :x-axis-variables="xAxisVariables"
          />
        </div>
      </div>

      <!-- Traffic Chart -->
      <!-- Chart Skeleton Loader -->
      <div v-if="fetchChartDataLoading" class="w-full h-full col-span-4">
        <SkeletonLoadingAreaChart />
      </div>
      <div
        v-else-if="!showTrafficChart"
        class="flex items-center justify-center w-full h-full col-span-4 p-6 text-center bg-white rounded-lg shadow-md dark:bg-primary-dark-900"
      >
        <div>
          <div class="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-12 h-12 mx-auto text-gray-500 dark:text-haze-100"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 17v-2a4 4 0 100-8 4 4 0 100 8v2m0 0h6m-6 0v2m0-6h6m-6 0v-2m0 0h6"
              />
            </svg>
            <h2
              class="mt-4 text-lg font-semibold text-gray-700 dark:text-haze-100"
            >
              No Data Available
            </h2>
            <p class="mt-2 text-gray-600 dark:text-haze-100">
              There is currently no data to display in the chart.
            </p>
          </div>
        </div>
      </div>
      <div
        class="col-span-4 px-10 pt-6 bg-white dark:bg-primary-dark-900 rounded-3xl"
        v-else
      >
        <h1 class="text-xl font-semibold dark:text-white">Daily Visitors</h1>
        <Chart-StackedColumn
          :key="dailyVisit"
          v-if="!fetchChartDataLoading && dailyVisit"
          :series="dailyVisit"
          :x-axis-variables="xAxisVariables"
          :colors="['#5847e4']"
        />
      </div>

      <!-- About Me -->
      <div
        class="box-content flex flex-col items-center col-span-2 gap-3 px-2 py-5 bg-white dark:bg-primary-dark-900 rounded-3xl"
        v-if="!fetchPharmaciesLoading"
      >
        <img
          :src="pharmacy?.logo_url || '/images/temp/pharmacy.jpg'"
          alt="pharmacy"
          class="object-cover w-32 h-32 rounded-3xl"
        />
        <h2 class="text-xl font-bold text-gray-950 dark:text-gray-100">
          {{ pharmacy?.name }}
        </h2>
        <p class="text-sm text-gray-400 dark:text-gray-200">
          <Icon name="lucide:map-pin" /> {{ pharmacy?.location?.area?.name }},
          {{ pharmacy?.location?.area?.city?.name }},
        </p>
        <p class="text-sm text-gray-400 dark:text-gray-200">
          {{ pharmacy?.location?.area?.city?.region?.name }}
        </p>
        <div>
          <NuxtRating
            :read-only="true"
            :ratingValue="ratingValue"
            class="flex justify-center bg-black"
          />
        </div>
      </div>

      <!-- About Me Skeleton Loader -->
      <div v-else class="w-full h-full col-span-2">
        <SkeletonLoadingAboutMe />
      </div>
    </div>

    <!-- Tables -->
    <div class="grid grid-cols-2 gap-10 mt-5">
      <div class="col-span-2">
        <DashboardMostSearchedMedicines></DashboardMostSearchedMedicines>
      </div>
      <!-- <div v-if="topSearchedPlaceItems.length > 0">
        <P-Table
          :headers="topSearchedPlaceHeader"
          :items="topSearchedPlaceItems"
          :loading="false"
          :sort="[]"
          supporter-class="overflow-hidden bg-white dark:!bg-primary-dark-900 rounded-3xl border-0"
          row-head-style="text-gray-500 dark:text-gray-200 bg-gray-50 dark:bg-primary-dark-800"
          row-style="text-gray-500 dark:text-gray-200 rounded-none"
          fullRowClass="hover:bg-gray-50 dark:hover:bg-primary-dark-800 cursor-pointer"
        />
      </div> -->
      <!-- <div>
        <P-Table
          :headers="topSearchedPlaceHeader"
          :items="topSearchedPlaceItems"
          :loading="false"
          supporter-class="overflow-hidden bg-white border-0 dark:bg-primary-dark-900 rounded-3xl"
          row-head-style="text-gray-500 dark:text-gray-200 bg-gray-50 dark:bg-primary-dark-800"
          row-style="text-gray-500 dark:text-gray-200 rounded-none"
          fullRowClass="hover:bg-gray-50 dark:hover:bg-primary-dark-800 cursor-pointer"
        />
      </div> -->
    </div>
  </div>
  <div v-else>
    <P-Loader />
  </div>
</template>
