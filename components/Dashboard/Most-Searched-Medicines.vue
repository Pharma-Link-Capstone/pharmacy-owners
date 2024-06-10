<script setup>
/**------------IMports---------------------- */
import getMedicines from "@/graphql/medicine/fetch_multiple_query.gql";
import lists from "~/composables/apollo/lists";
import { useAuthStore } from "~/stores/auth";
import useNotify from "~/use/notify";

const router = useRouter();

const { notify } = useNotify();

const { userRoles } = useAuthStore();

const headers = ref([
  {
    text: "Name",
    value: "name",
  },
  {
    text: "Searches",
    value: "search_count",
  },

  {
    text: "Quantity",
    value: "quantity",
  },
]);
/**------------Pharmacy data fetch---------------------- */

const limit = ref(4);

/**-------------------Compute filter when tab change and search---------------- */
const sort = ref([
  {
    searches_aggregate: {
      count: "desc_nulls_last",
    },
  },
]);

const role = computed(() => {
  if (userRoles.includes("pharmacist")) {
    return "pharmacist";
  }
  return "user";
});

const medicines = ref([]);
const { onResult, onError, loading, refetch } = lists(getMedicines, {
  order: sort,
  limit,
  role,
});
onResult((result) => {
  if (result.data?.medicines) {
    medicines.value = result.data.medicines;
  }
});
onError((error) => {
  notify({
    title: "Network Error",
    description: "Please check your internet connection",
    cardClass: "bg-red-200",
  });
});

// function rowClick(item) {
//   router.push(`/pharmacies/${item.id}`);
// }
</script>

<template>
  <!-- Most Searched -->

  <div class="w-full h-full bg-white dark:bg-primary-dark-900 rounded-2xl">
    <div class="flex items-center justify-between w-full px-5 py-2 rounded-2xl">
      <h2
        class="text-2xl font-semibold font-poppins text-primary-950 dark:text-haze-50"
      >
        Total most searched medicines
      </h2>

      <!-- <NuxtLink
        to="/medicines"
        class="px-5 py-2 font-medium rounded-full text-primary-700 bg-primary-50 dark:bg-primary-dark-800 dark:text-primary-100 hover:bg-primary-100 dark:hover:bg-primary-dark-700 hover:text-primary-800 dark:hover:text-primary-100"
      >
        See all
      </NuxtLink> -->
    </div>

    <PTable
      :headers="headers"
      :items="medicines"
      :loading="loading"
      row-head-style="!bg-haze-100 dark:!bg-primary-dark-800 dark:!text-white"
      supporter-class="!border-0"
      no-item-class="!min-h-52"
      full-row-class="dark:hover:!bg-primary-dark-800"
      row-style="!rounded-none"
      :sort="sort"
      @click:row="rowClick"
    >
      <template #name="{ item }">
        <div class="flex items-center gap-x-4 dark:text-white">
          <img :src="item.image_url" alt="" class="w-8 h-8 rounded-full" />
          <p class="!text-sm capitalize">
            {{ item.name }}
          </p>
        </div>
      </template>
      <template #search_count="{ item }">
        <div>
          <p class="dark:text-white">
            {{ item.searches_aggregate?.aggregate?.count }}
          </p>
        </div>
      </template>
      <template #quantity="{ item }">
        <div>
          <p class="dark:text-white">
            {{ item.pharmacy_medicines_aggregate?.aggregate?.count }}
          </p>
        </div>
      </template>
    </PTable>
  </div>
</template>
