<script setup>
import FetchPharmacy from "@/graphql/pharmacy/fetch_one_query.gql";
import get_one from "~/composables/apollo/get_one";
import Rating from "primevue/rating";
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  layout: "app",
});

const route = useRoute();
const router = useRouter();

const { userRoles } = useAuthStore();

const PhID = computed(() => localStorage.getItem("PhID"));

/*-------------------------Tab Management--------------------*/

const tabs = ref([
  {
    name: "Overview",
    value: "overview",
  },

  {
    name: "Reviews",
    value: "reviews",
  },
]);

if (route.query.tab === undefined) {
  router.replace({ query: { tab: tabs.value[0].value } });
}

const currentTab = computed(() => route.query.tab);
const currentTabIndex = computed({
  get: () => {
    return tabs.value.findIndex((tab) => tab.value === currentTab.value);
  },
  set: (index) => {
    router.push({ query: { tab: tabs.value[index].value } });
  },
});

watch(currentTabIndex, (newValue) => {
  if (newValue !== -1) {
    router.push({ query: { tab: tabs.value[newValue].value } });
  }
});

/*------------------- Fetch Pharmacy by ID ---------------------*/
const isPharmacist = computed(() => userRoles?.includes("pharmacist"));
const pharmacy = ref({});

const role = computed(() => {
  if (userRoles.includes("pharmacist")) {
    return "pharmacist";
  }
  return "user";
});

const {
  onResult: onFetchPharmacyResult,
  loading: fetchPharmacyLoading,
  refetch: refetchPharmacy,
} = get_one(FetchPharmacy, PhID.value, role);

onFetchPharmacyResult(({ data }) => {
  pharmacy.value = data?.pharmacy;
});

const ratingValue = computed(() => {
  let val = 0;

  pharmacy.value?.reviews?.forEach((review) => {
    val += review.rating;
  });

  return val / pharmacy.value?.reviews?.length;
});

useHead({
  title: "Pharmacy Profile | Pharmalink",
  meta: [
    { name: "description", content: "This is a profile page for the pharmacy" },
  ],
  bodyAttrs: {
    class: "test",
  },
});
</script>
<template>
  <div class="h-full">
    <div class="relative overflow-visible">
      <div class="z-0">
        <img
          :src="pharmacy?.cover_image || '/images/temp/cover.png'"
          alt=""
          class="object-cover w-full h-56 rounded-3xl"
        />
      </div>
      <div
        class="absolute p rounded-full !overflow-hidden -bottom-1/3 z-50 flex items-center w-[90%] left-1/2 -translate-x-1/2 gap-5 bg-white dark:bg-primary-dark-900"
      >
        <div v-if="!fetchPharmacyLoading" class="flex justify-between w-full">
          <div class="flex items-center gap-5">
            <div>
              <img
                class="object-cover rounded-full w-44 h-44"
                :src="pharmacy.logo_url"
                alt=""
              />
            </div>
            <div>
              <h1 class="text-xl font-medium dark:text-white">
                {{ pharmacy.name }}
              </h1>
              <!-- Rating -->
              <div class="!w-fit grid grid-cols-2 items-center gap-5">
                <NuxtRating
                  :read-only="true"
                  :ratingValue="ratingValue"
                  class="col-span-1"
                />
                <p class="col-span-1 ml-3 text-haze-600 dark:text-haze-50">
                  {{ ratingValue || 0 }} ({{
                    pharmacy.reviews_aggregate?.aggregate?.count || 0
                  }}
                  reviews)
                </p>
              </div>
              <!-- Social medias -->
              <div class="flex items-center gap-5 mt-3">
                <nuxt-link
                  v-for="(social, index) in pharmacy.pharmacy_social_medias"
                  :key="index"
                  :to="social?.url"
                  target="_blank"
                >
                  <img
                    :src="social?.social_media?.icon_url"
                    alt=""
                    class="object-contain w-8 h-8"
                  />
                </nuxt-link>
              </div>
            </div>
          </div>
          <div
            class="flex items-center gap-3 mr-10"
            v-if="isPharmacist && pharmacy.status == 'ACTIVE'"
          >
            <nuxt-link
              :to="`/app/pharmacy-profile/edit`"
              class="!w-36 !rounded-3xl btn-primary gap-3 flex justify-center"
            >
              <icon name="uil:pen" class="text-xl" /> Edit
            </nuxt-link>
            <!-- <button class="!w-fit !rounded-3xl btn-primary-outline">
              <icon name="material-symbols:close" class="text-xl" /> Close
              Pharmacy
            </button> -->
          </div>
        </div>
        <div class="w-full h-44" v-else>
          <div class="flex justify-between w-full animate-pulse">
            <div class="flex items-center gap-5">
              <div>
                <div class="rounded-full w-44 h-44 bg-haze-200"></div>
              </div>
              <div>
                <div class="h-6 rounded w-44 bg-haze-200"></div>
              </div>
            </div>

            <div class="flex items-center gap-3 mr-10">
              <div class="h-12 w-36 rounded-3xl bg-haze-200"></div>
              <div class="h-12 w-36 rounded-3xl bg-haze-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--  -->
    <div class="px-5 py-px bg-white rounded mt-28 dark:bg-primary-dark-900">
      <P-Tabs :tabs="tabs" v-model:currentTabIndex="currentTabIndex">
        <template #overview>
          <div class="mt-5" v-if="!fetchPharmacyLoading">
            <div class="grid grid-cols-3 gap-5 divide-x">
              <div class="col-span-3">
                <div>
                  <h1 class="text-xl font-semibold dark:text-white">About</h1>
                  <p class="mt-3 text-haze-800 dark:text-white">
                    {{
                      pharmacy.description || "-- No description provided --"
                    }}
                  </p>
                </div>
                <div>
                  <h1 class="mt-5 text-xl font-semibold dark:text-white">
                    Contact Information
                  </h1>
                  <div class="flex items-center gap-10">
                    <div class="flex flex-col gap-2 mt-3">
                      <p class="text-sm text-haze-600 dark:text-white">
                        Phone Number
                      </p>
                      <p class="font-medium dark:text-white">
                        +251 9{{ pharmacy.phoneNumber }}
                      </p>
                    </div>
                    <div class="flex flex-col gap-2 mt-3">
                      <p class="text-sm text-haze-600 dark:text-white">
                        Alternative phone number
                      </p>
                      <p class="font-medium dark:text-white">
                        +251 9{{ pharmacy.alternativePhoneNumber }}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h1 class="mt-5 text-xl font-semibold dark:text-white">
                    Location
                  </h1>
                  <div class="mt-3">
                    <div class="flex items-center gap-10">
                      <div class="flex flex-col gap-2 mt-3">
                        <p class="text-sm text-haze-600 dark:text-white">
                          Region/State
                        </p>
                        <p class="font-medium dark:text-white">
                          {{
                            pharmacy.location?.area?.city?.region.name ||
                            "Addis Ababa"
                          }}
                        </p>
                      </div>
                      <div class="flex flex-col gap-2 mt-3">
                        <p class="text-sm text-haze-600 dark:text-white">
                          City/Sub City
                        </p>
                        <p class="font-medium dark:text-white">
                          {{
                            pharmacy.location?.area?.city.name || "Addis Ababa"
                          }}
                        </p>
                      </div>
                      <div class="flex flex-col gap-2 mt-3">
                        <p class="text-sm text-haze-600 dark:text-white">
                          Area/Kebele
                        </p>
                        <p class="font-medium dark:text-white">
                          {{ pharmacy.location?.area?.name || "Addis Ababa" }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="mt-3">
                    <P-Map :locations="[pharmacy.location]" />
                  </div>
                </div>
              </div>
              <!-- <div class="col-span-1 pl-5">
                <div>
                  <h1 class="text-xl font-semibold dark:text-white">
                    Top Selling Medicines
                  </h1>

                  <div>
                    <P-NoItems />
                  </div>
                </div>
              </div> -->
            </div>
          </div>
          <div v-else class="h-[300px]">
            <P-Loader />
          </div>
        </template>

        <template #reviews>
          <div class="pb-5 min-h-[300px]">
            <div class="mt-5" v-if="!fetchPharmacyLoading">
              <div v-if="pharmacy.reviews?.length > 0">
                <div v-for="(review, index) in pharmacy?.reviews" :key="index">
                  <div class="flex items-center gap-5">
                    <div>
                      <img
                        :src="pharmacy.logo_url"
                        class="object-cover w-10 h-10 rounded-full"
                        alt=""
                      />
                    </div>
                    <div>
                      <p
                        class="text-sm font-medium text-neutral-600 dark:text-white"
                      >
                        Samuel Noah
                      </p>
                      <NuxtRating
                        :read-only="true"
                        :ratingValue="ratingValue"
                        class="mt-2"
                        rating-size="23px"
                      />
                    </div>
                  </div>
                  <div class="mt-2">
                    <p
                      class="text-sm text-neutral-700 max-w-[100ch] text-justify dark:text-white"
                    >
                      {{ review?.comment }}
                    </p>
                  </div>
                </div>
              </div>
              <div v-else>
                <P-NoItems text="No Reviews Yet" />
              </div>
            </div>
          </div>
        </template>
      </P-Tabs>
    </div>
  </div>
</template>
