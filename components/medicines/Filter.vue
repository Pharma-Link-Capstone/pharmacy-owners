<script setup>
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";

import FetchCategories from "@/graphql/basic/category_query.gql";
import lists from "~/composables/apollo/lists";

const emit = defineEmits(["update:modelValue", "filter"]);

const router = useRouter();
const route = useRoute();

/*---------------------- Define Variables ----------------------*/
const category = ref(route.query.category || null);
const startPrice = ref(route.query.startPrice || null);
const endPrice = ref(route.query.endPrice || null);
const startDate = ref(route.query.startDate || null);
const endDate = ref(route.query.endDate || null);

/*---------------------- Fetch Categories ----------------------*/
const categoryOptions = ref([]);
const categorySearchTerm = ref("");
const limit = ref(10);
const categoryFilter = computed(() => ({
  name: {
    _ilike: `%${categorySearchTerm.value}%`,
  },
}));

const order = ref([
  {
    name: "asc",
  },
]);

const { onResult: onFetchCategoriesResult, loading: fetchCategoryLoading } =
  lists(FetchCategories, {
    filter: categoryFilter,
    limit,
    order,
  });

onFetchCategoriesResult((result) => {
  categoryOptions.value = result.data?.categories;

  if (category.value) {
    category.value = categoryOptions.value.find(
      (item) => item.name === category.value.name
    );
  }
});

/*---------------------- Emit Changes ----------------------*/
const applyFilter = () => {
  const query = {
    category: category.value?.name,
    startPrice: startPrice.value?.toString(),
    endPrice: endPrice.value?.toString(),
    startDate: startDate.value?.toString(),
    endDate: endDate.value?.toString(),
  };

  router.push({
    query: {
      ...route.query,
      ...query,
    },
  });
  emit("filter");
};

const clearFilter = () => {
  category.value = null;
  startPrice.value = null;
  endPrice.value = null;
  startDate.value = null;
  endDate.value = null;

  console.log(route.query);
  router.replace({
    query: {
      ...route.query,
      category: null,
      startPrice: null,
      endPrice: null,
      startDate: null,
      endDate: null,
    },
  });

  emit("filter");
};
</script>
<template>
  <div>
    <Popover class="relative">
      <PopoverButton>
        <button
          class="w-10 h-10 rounded-xl bg-haze-50 dark:bg-primary-dark-800"
        >
          <Icon
            name="mage:filter"
            class="text-xl text-black dark:text-gray-100"
          />

          <span class="sr-only">Filter</span>
        </button>
      </PopoverButton>

      <PopoverPanel
        class="absolute z-10 mt-2 bg-white dark:bg-primary-dark-900 dark:text-white shadow !w-max p-3 rounded-xl"
      >
        <div class="flex flex-col gap-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-medium">Filter</h2>
            <button class="text-primary-600" @click="clearFilter">
              Clear All
            </button>
          </div>
          <div>
            <div class="w-full">
              <P-Lists-SingleSelectWithSearch
                :clearable="true"
                v-model="category"
                placeholder="Select a category"
                :items="categoryOptions"
                name="category"
                :return-object="true"
                header-class="!bg-haze-50 !py-2 !rounded-2xl !pl-5 !border-0 !shadow-none dark:!bg-primary-dark-800 dark:!text-white"
                @search="categorySearchTerm = $event"
                supporter="dark:!bg-primary-dark-900 dark:border-primary-dark-500"
                search-input-class="dark:!bg-primary-dark-800"
              >
                <template #label>
                  <label for="medicine" class="flex mb-2"
                    >Category <span class="ml-1 text-red-600">*</span></label
                  >
                </template>
                <template #row="{ item }">
                  <div class="flex items-center gap-3 dark:text-white">
                    {{ item.name }}
                  </div>
                </template>
                <template #option="{ item }">
                  <p class="text-neutral-500 dark:text-gray-100">
                    No items found for search query: {{ item }}
                  </p>
                </template>
              </P-Lists-SingleSelectWithSearch>
            </div>
          </div>

          <div class="flex flex-col">
            <!-- Price range -->
            <label for="filter-price" class="mb-2 text-sm">Price</label>

            <div class="flex items-center gap-2">
              <div class="">
                <P-Textfield
                  v-model="startPrice"
                  placeholder="Start Price"
                  name="start_price"
                  rules="positive"
                  type="number"
                  body-class="!shadow-none relative"
                  field-class="!w-40 !py-2 !rounded-2xl bg-haze-50 !border-0 !shadow-none dark:!bg-primary-dark-800 dark:!text-gray-100 dark:placeholder:!text-gray-200"
                >
                </P-Textfield>
              </div>

              <span class="text-sm">to</span>

              <div class="">
                <P-Textfield
                  v-model="endPrice"
                  placeholder="End Price"
                  name="end_price"
                  rules="positive"
                  type="number"
                  body-class="!shadow-none relative"
                  field-class="!w-40 !py-2 !rounded-2xl bg-haze-50 !border-0 !shadow-none dark:!bg-primary-dark-800 dark:!text-gray-100 dark:placeholder:!text-gray-200"
                >
                </P-Textfield>
              </div>
            </div>
          </div>

          <div class="flex flex-col">
            <!-- Price range -->
            <label for="filter-price" class="mb-2 text-sm">Date</label>

            <div class="flex items-center gap-2">
              <div class="">
                <P-DatePicker
                  v-model="startDate"
                  placeholder="Start Date"
                  name="startDate"
                  class="relative"
                  field-class="!py-2 !pl-5 !rounded-2xl text-gray-600 !bg-haze-50 !border-0 !shadow-none dark:!bg-primary-dark-800 dark:!text-gray-100"
                >
                </P-DatePicker>
              </div>

              <span class="text-sm">to</span>

              <div class="">
                <P-DatePicker
                  v-model="endDate"
                  placeholder="End Date"
                  name="endDate"
                  class="relative"
                  field-class="!py-2 !pl-5 !rounded-2xl text-gray-600 !bg-haze-50 !border-0 !shadow-none dark:!bg-primary-dark-800 dark:!text-gray-100"
                >
                </P-DatePicker>
              </div>
            </div>
          </div>

          <button
            class="w-full py-2 mt-5 text-white rounded-md bg-primary-500"
            @click="applyFilter"
          >
            Apply
          </button>
        </div>
      </PopoverPanel>
    </Popover>
  </div>
</template>
