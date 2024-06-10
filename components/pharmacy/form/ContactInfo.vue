<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";

import RegionQuery from "~/graphql/basic/region_query.gql";
import CityQuery from "~/graphql/basic/city_query.gql";
import AreaQuery from "~/graphql/basic/area_query.gql";
import SocialMedias from "~/graphql/basic/social_medias.gql";

import lists from "~/composables/apollo/lists_anonymous";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "next", "prev"]);
/*---------------- Define Variables ----------------*/
const phoneNumber = computed({
  get: () => props.modelValue?.phoneNumber || "",
  set: (value) => {
    emit("update:modelValue", { ...props.modelValue, phoneNumber: value });
  },
});

const alternativePhoneNumber = computed({
  get: () => props.modelValue?.alternativePhoneNumber || "",
  set: (value) => {
    emit("update:modelValue", {
      ...props.modelValue,
      alternativePhoneNumber: value,
    });
  },
});

const region = computed({
  get: () => props.modelValue.region || props.modelValue?.area?.city?.region,
  set: (value) => {
    emit("update:modelValue", { ...props.modelValue, region: value });
  },
});
const city = computed({
  get: () => props.modelValue.city || props.modelValue?.area?.city,
  set: (value) => {
    emit("update:modelValue", { ...props.modelValue, city: value });
  },
});
const area = computed({
  get: () => props.modelValue.area || props.modelValue?.area,
  set: (value) => {
    emit("update:modelValue", { ...props.modelValue, area: value });
  },
});
const location = computed({
  get: () => props.modelValue.location,
  set: (value) => {
    emit("update:modelValue", { ...props.modelValue, location: value });
  },
});
const selectedSocials = computed({
  get: () => props.modelValue.socials || [],
  set: (value) => {
    emit("update:modelValue", { ...props.modelValue, socials: value });
  },
});

/*---------------- Fetch Regions ----------------*/

const regionOptions = ref([]);
const regionSearchTerm = ref("");
const itemsLimit = ref(10);

const filterRegions = computed(() => {
  return {
    _and: [
      {
        name: {
          _ilike: `%${regionSearchTerm.value}%`,
        },
      },
    ],
  };
});
const { onResult: onFetchRegions, loading: fetchRegionsLoading } = lists(
  RegionQuery,
  { filter: filterRegions, limit: itemsLimit }
);

onFetchRegions((result) => {
  regionOptions.value = result.data?.regions;
});

/*---------------- Fetch Cities ----------------*/
const cityOptions = ref([]);
const citySearchTerm = ref("");
const filterCities = computed(() => {
  return {
    _and: [
      {
        name: {
          _ilike: `%${citySearchTerm.value}%`,
        },
      },
      {
        region_id: {
          _eq: region.value,
        },
      },
    ],
  };
});

const { onResult: onFetchCities, loading: fetchCitiesLoading } = lists(
  CityQuery,
  { filter: filterCities, limit: itemsLimit }
);

onFetchCities((result) => {
  cityOptions.value = result.data?.cities;
});

/*---------------- Fetch Areas ----------------*/
const areaOptions = ref([]);
const areaSearchTerm = ref("");
const filterAreas = computed(() => {
  return {
    _and: [
      {
        name: {
          _ilike: `%${areaSearchTerm.value}%`,
        },
      },
      {
        city_id: {
          _eq: city.value,
        },
      },
    ],
  };
});

const { onResult: onFetchAreas, loading: fetchAreasLoading } = lists(
  AreaQuery,
  { filter: filterAreas, limit: itemsLimit }
);

onFetchAreas((result) => {
  areaOptions.value = result.data?.areas;
});

/*---------------- Social Media ----------------*/
const socialMediaOptions = ref([]);
const { onResult: onSocialMediaResult, loading: socialMediaLoading } = lists(
  SocialMedias,
  { filter: {} }
);

onSocialMediaResult((result) => {
  socialMediaOptions.value = result.data?.socials;
  socialMedia.value = socialMediaOptions.value[0];
});

const socialUrl = ref("");
const addSocial = () => {
  if (!socialUrl.value) return;
  // check if url is valid
  try {
    const url = new URL(socialUrl.value);
    if (!url) return;
    // check if the social media is already added
    const isExist = selectedSocials?.value.find(
      (social) => social.url === socialUrl.value
    );
    if (isExist) return;

    selectedSocials.value = [
      ...selectedSocials.value,
      {
        name: socialMedia.value.name,
        icon_url: socialMedia.value.icon_url,
        url: socialUrl.value,
        id: socialMedia.value?.id,
      },
    ];

    socialUrl.value = "";
  } catch (error) {
    return;
  }
};

const removeSocial = (index) => {
  selectedSocials.value = selectedSocials.value.filter((_, i) => i !== index);
};

const socialMedia = ref({});

/*---------------- Form Submission ----------------*/
const { handleSubmit } = useForm({});
const onSubmit = handleSubmit(() => {
  emit("next");
});
</script>
<template>
  <div>
    <form @submit.prevent="onSubmit">
      <!-- Region -->
      <div>
        <P-Lists-SingleSelectWithSearch
          v-model="region"
          :items="regionOptions"
          name="region"
          :return-object="true"
          header-class="!bg-haze-50 !h-12 !rounded-2xl !border-0 !shadow-none"
          placeholder="Select a region"
          rules="required"
          @search="regionSearchTerm = $event"
          :loading="fetchRegionsLoading"
        >
          <template #label>
            <label for="region" class="flex mb-2"
              >Region <span class="ml-1 text-red-600">*</span></label
            >
          </template>
          <template #row="{ item }">
            <div>
              {{ item.name }}
            </div>
          </template>
        </P-Lists-SingleSelectWithSearch>
      </div>

      <!-- City Selector -->
      <div class="grid grid-cols-2 gap-3 mt-3">
        <P-Lists-SingleSelectWithSearch
          v-model="city"
          :items="cityOptions"
          name="city"
          :return-object="true"
          placeholder="Select a city"
          header-class="!bg-haze-50 !h-12 !rounded-2xl !border-0 !shadow-none"
          rules="required"
          :disabled="!region"
          @search="citySearchTerm = $event"
          :loading="fetchCitiesLoading"
          class="!shadow-none"
        >
          <template #label>
            <label for="city" class="flex mb-2"
              >City <span class="ml-1 text-red-600">*</span></label
            >
          </template>
          <template #row="{ item }">
            <div>
              {{ item.name }}
            </div>
          </template>
        </P-Lists-SingleSelectWithSearch>
        <P-Lists-SingleSelectWithSearch
          v-model="area"
          :items="areaOptions"
          name="area"
          :return-object="true"
          placeholder="Select an area"
          header-class="!bg-haze-50 !h-12 !rounded-2xl !border-0 !shadow-none"
          rules="required"
          :disabled="!city"
          @search="areaSearchTerm = $event"
          :loading="fetchAreasLoading"
          class="!shadow-none"
        >
          <template #label>
            <label for="area" class="flex mb-2"
              >Area <span class="ml-1 text-red-600">*</span></label
            >
          </template>
          <template #row="{ item }">
            <div>
              {{ item.name }}
            </div>
          </template>
        </P-Lists-SingleSelectWithSearch>
      </div>

      <!--  -->
      <div class="mt-3"></div>
      <div class="mt-3">
        <P-MapSelector
          draggable
          :lat="location?.position?.lat"
          :long="location?.position?.lng"
          :key="location?.position?.lat"
          @update-map-val="location = $event"
          header-class="!bg-haze-50 !h-12 !rounded-2xl !border-0 !shadow-none"
        />
      </div>

      <hr class="my-5" />

      <div>
        <div class="grid grid-cols-2 gap-3">
          <p-Textfield
            placeholder="Phone Number"
            v-model="phoneNumber"
            rules="required|ethio_phone"
            name="phoneNumber"
            body-class="relative !shadow-none"
            class="relative"
            field-class="!bg-haze-50 !h-12 pl-16 !border-0 !rounded-2xl !shadow-none"
          >
            <template #label>
              <label for="phoneNumber" class="flex mb-2"
                >Phone Number <span class="ml-1 text-red-600">*</span></label
              >
            </template>
            <template #leading>
              <div
                class="absolute top-0 left-0 flex items-center justify-center h-full px-3 bg-haze-200 w-fit"
              >
                +251
              </div>
            </template>
          </p-Textfield>
          <p-Textfield
            placeholder="Alternative Phone Number"
            v-model="alternativePhoneNumber"
            rules="ethio_phone"
            name="alternativePhoneNumber"
            body-class="relative !shadow-none"
            class="relative"
            field-class="!bg-haze-50 !h-12 pl-16 !border-0 !rounded-2xl !shadow-none"
          >
            <template #label>
              <label for="alternativePhoneNumber" class="flex mb-2"
                >Alternative Phone Number</label
              >
            </template>
            <template #leading>
              <div
                class="absolute top-0 left-0 flex items-center justify-center h-full px-3 bg-haze-200 w-fit"
              >
                +251
              </div>
            </template>
          </p-Textfield>
        </div>
        <div class="mt-3">
          <h2>Socials</h2>
          <div class="flex mt-2">
            <Menu as="div" class="relative w-16 h-12">
              <MenuButton
                class="flex items-center justify-center w-full h-full rounded-l-2xl text-haze-600 bg-haze-50"
              >
                <img
                  :src="socialMedia?.icon_url"
                  class="object-cover rounded-full w-7 h-7"
                  alt=""
                />

                <Icon name="ic:round-arrow-drop-down" class="text-xl" />
              </MenuButton>
              <MenuItems
                class="absolute flex flex-col w-full mt-1 bg-white shadow"
              >
                <MenuItem
                  v-for="(social, index) in socialMediaOptions"
                  :key="index"
                  class="w-12 h-12"
                >
                  <div
                    @click="socialMedia = social"
                    class="flex items-center justify-center w-full h-12 py-2 hover:bg-primary-300 hover:text-white"
                  >
                    <img
                      :src="social?.icon_url"
                      class="object-cover mr-2 rounded-full w-7 h-7"
                      alt=""
                    />
                  </div>
                </MenuItem>
              </MenuItems>
            </Menu>
            <P-Textfield
              name="socialUrl"
              placeholder="Add your social media link and press the + icon"
              class="flex-grow h-12"
              field-class="!bg-haze-50 !h-12 !rounded-r-2xl !rounded-l-0 !border-0 !shadow-none"
              body-class="!rounded-none !shadow-none"
              v-model="socialUrl"
              rules="url"
            >
              <template #trailing>
                <button
                  @click="addSocial"
                  class="absolute right-0 flex items-center justify-center w-12 h-full -translate-y-1/2 rounded-r-md bg-primary-300 top-1/2"
                  type="button"
                >
                  <Icon name="ic:round-add" class="text-2xl text-white" />
                </button>
              </template>
            </P-Textfield>
          </div>
          <div class="flex items-center gap-3 mt-5">
            <span
              v-for="(social, index) in selectedSocials"
              :key="index"
              class="flex items-center px-6 py-2 rounded-full bg-haze-50"
            >
              <Icon :name="social.icon" class="text-xl" />
              <span class="ml-2">{{ social.name }}</span>

              <icon
                name="ic:round-close"
                class="ml-3 text-gray-400 cursor-pointer"
                @click="(_) => removeSocial(index)"
              />
            </span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-between mt-8">
        <button
          type="button"
          @click="$emit('prev')"
          class="flex items-center gap-2.5 justify-center px-3 py-1.5 rounded border shadow-sm text-gray-600"
        >
          <Icon name="ic:round-arrow-back-ios" class="text-xl text-gray-600" />
          Previous
        </button>
        <button
          type="submit"
          class="text-white bg-primary-600 px-3 py-1.5 rounded"
        >
          Save & Proceed
        </button>
      </div>
    </form>
  </div>
</template>
