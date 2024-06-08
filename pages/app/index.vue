<script setup>
import FetchPharmacies from "@/graphql/pharmacy/fetch_multiple_query.gql";
import lists from "~/composables/apollo/lists";
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  layout: "app",
});

const PhID = computed(() => localStorage.getItem("PhID"));

/*--- Fetch Pharmacies ---*/
const pharmacy = ref({});
const pharmacyFilter = computed(() => {
  return {
    id: {
      _eq: PhID.value,
    },
  };
});

const { onResult: onFetchPharmaciesResult, loading: fetchPharmaciesLoading } =
  lists(FetchPharmacies, { filter: pharmacyFilter });

onFetchPharmaciesResult(({ data }) => {
  pharmacy.value = data?.pharmacies[0];
});

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
    title: "Impression",
    value: 0,
    icon: "wpf:view-file",
  },
  {
    title: "Viewed",
    value: pharmacy.value?.summary?.view_count || 0,
    icon: "iconoir:eye",
  },
  {
    title: "Interactions",
    value: 0,
    icon: "carbon:touch-interaction",
  },
]);

const topSearchedPlaceHeader = ref([
  {
    text: "Area",
    value: "area",
  },
  {
    text: "Percentage",
    value: "percentage",
  },
  {
    text: "Quantity",
    value: "quantity",
  },
  {
    text: "Date",
    value: "date",
  },
]);

const topSearchedPlaceItems = ref([
  {
    area: "Addis Ababa",
    percentage: "30%",
    quantity: 300,
    date: "2021-09-01",
  },
  {
    area: "Koye",
    percentage: "20%",
    quantity: 200,
    date: "2021-09-01",
  },
  {
    area: "Bahir Dar",
    percentage: "10%",
    quantity: 100,
    date: "2021-09-01",
  },
  {
    area: "Gondar",
    percentage: "5%",
    quantity: 50,
    date: "2021-09-01",
  },
  {
    area: "Hawassa",
    percentage: "5%",
    quantity: 50,
    date: "2021-09-01",
  },
]);

const ratingValue = computed(() => {
  let val = 0;

  pharmacy.value?.reviews?.forEach((review) => {
    val += review.rating;
  });

  return val / pharmacy.value?.reviews.length;
});
</script>
<template>
  <div class="w-full">
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
      <div
        class="flex items-center col-span-6 px-10 py-6 bg-white dark:bg-primary-dark-900 rounded-3xl"
      >
        <div class="flex flex-col gap-10">
          <div>
            <div class="">
              <div class="flex items-center gap-3">
                <div class="flex items-center gap-2">
                  <span class="w-4 h-4 rounded-full bg-[#4318FF]"></span>
                  <span
                    class="text-3xl font-bold text-gray-950 dark:text-gray-200"
                    >37</span
                  >
                </div>
                <div class="flex items-center gap-1 text-green-500">
                  <Icon name="uil:arrow-up" />
                  <span class="text-sm">+3.5%</span>
                </div>
              </div>
              <p class="text-sm font-medium text-gray-500">Total Stock In</p>
            </div>
          </div>
          <div>
            <div class="">
              <div class="flex items-center gap-3">
                <div class="flex items-center gap-2">
                  <span class="w-4 h-4 rounded-full bg-[#6AD2FF]"></span>
                  <span
                    class="text-3xl font-bold text-gray-950 dark:text-gray-200"
                    >12</span
                  >
                </div>
                <div class="flex items-center gap-1 text-red-500">
                  <Icon name="uil:arrow-up" class="rotate-180" />
                  <span class="text-sm">-3.5%</span>
                </div>
              </div>
              <p class="text-sm font-medium text-gray-500">Total Stock Out</p>
            </div>
          </div>
        </div>
        <ChartSplineArea
          class="w-[500px] h-[300px]"
          :series="[
            {
              name: 'Stock In',
              data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
            },
            {
              name: 'Stock Out',
              data: [20, 30, 25, 40, 39, 50, 60, 91, 105],
            },
          ]"
          :x-axis-variables="[
            '2021-09-01',
            '2021-09-02',
            '2021-09-03',
            '2021-09-04',
            '2021-09-05',
            '2021-09-06',
            '2021-09-07',
            '2021-09-08',
            '2021-09-09',
          ]"
        />
      </div>

      <!-- Traffic Chart -->
      <div
        class="col-span-4 bg-white dark:bg-primary-dark-900 rounded-3xl"
      ></div>

      <!-- About Me -->
      <div
        class="box-content flex flex-col items-center col-span-2 gap-3 px-2 py-5 bg-white dark:bg-primary-dark-900 rounded-3xl"
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
    </div>

    <!-- Tables -->
    <div class="grid grid-cols-2 gap-10 mt-5">
      <div>
        <P-Table
          :headers="topSearchedPlaceHeader"
          :items="topSearchedPlaceItems"
          :loading="false"
          supporter-class="overflow-hidden bg-white dark:!bg-primary-dark-900 rounded-3xl border-0"
          row-head-style="text-gray-500 dark:text-gray-200 bg-gray-50 dark:bg-primary-dark-800"
          row-style="text-gray-500 dark:text-gray-200 rounded-none"
          fullRowClass="hover:bg-gray-50 dark:hover:bg-primary-dark-800 cursor-pointer"
        />
      </div>
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
      <div class="">
        <DashboardMostSearchedMedicines></DashboardMostSearchedMedicines>
      </div>
    </div>
  </div>
</template>
