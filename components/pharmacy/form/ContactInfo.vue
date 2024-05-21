<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "next", "prev"]);
/*---------------- Define Variables ----------------*/
const pharmacy = computed({
  get: () => props.modelValue,
  set: (value) => {},
});
const country = computed({
  get: () => pharmacy.value.country,
  set: (value) => {
    pharmacy.value.country = value;
  },
});
const city = computed({
  get: () => pharmacy.value.city,
  set: (value) => {
    pharmacy.value.city = value;
  },
});
const location = computed({
  get: () => pharmacy.value.location,
  set: (value) => {
    pharmacy.value.location = value;
  },
});
const selectedSocials = computed({
  get: () => pharmacy.value.socials,
  set: (value) => {
    pharmacy.value.socials = value;
  },
});

const countryOptions = ref([
  { id: 1, name: "Ethiopia" },
  { id: 2, name: "Kenya" },
  { id: 3, name: "Somalia" },
]);

const cityOptions = ref([
  { id: 1, name: "Addis Ababa" },
  { id: 2, name: "Nairobi" },
  { id: 3, name: "Mogadishu" },
]);

const socialUrl = ref("");
const addSocial = () => {
  if (!socialUrl.value) return;
  // check if url is valid
  const url = new URL(socialUrl.value);
  if (!url) return;
  // check if the social media is already added
  const isExist = selectedSocials.value.find(
    (social) => social.url === socialUrl.value
  );
  if (isExist) return;
  selectedSocials.value.push({
    id: socialMedia.value,
    name: socialMediaOptions.value[socialMedia.value].name,
    url: socialUrl.value,
    icon: socialMediaOptions.value[socialMedia.value].icon,
  });

  socialUrl.value = "";
};

const socialMedia = ref(0);

const socialMediaOptions = ref([
  { id: 1, name: "Facebook", icon: "logos:facebook" },
  { id: 2, name: "Twitter", icon: "logos:twitter" },
  { id: 3, name: "Instagram", icon: "skill-icons:instagram" },
]);
/*---------------- Form Submission ----------------*/
const { handleSubmit } = useForm({});
const onSubmit = handleSubmit(() => {
  emit("update:modelValue", pharmacy.value);
  emit("next");
});
</script>
<template>
  <div>
    <form @submit.prevent="onSubmit">
      <div>
        <P-Lists-SingleSelectWithSearch
          v-model="country"
          :items="countryOptions"
          name="country"
          placeholder="Select a country"
          rules="required"
          :disabled="true"
        >
          <template #label>
            <label for="country" class="flex mb-2"
              >Country <span class="ml-1 text-red-600">*</span></label
            >
          </template>
        </P-Lists-SingleSelectWithSearch>
      </div>
      <div class="mt-3">
        <P-Lists-SingleSelectWithSearch
          v-model="city"
          :items="cityOptions"
          name="city"
          placeholder="Select a city"
          rules="required"
          :disabled="true"
        >
          <template #label>
            <label for="country" class="flex mb-2"
              >City <span class="ml-1 text-red-600">*</span></label
            >
          </template>
        </P-Lists-SingleSelectWithSearch>
      </div>

      <div class="mt-3">
        <P-MapSelector @update-map-val="location = $event" />
      </div>

      <hr class="my-5" />

      <div>
        <h2>Socials</h2>
        <div class="flex mt-2">
          <Menu as="div" class="relative w-12 h-12">
            <MenuButton
              class="flex items-center justify-center w-full h-full text-white border rounded-l-md"
            >
              <Icon
                :name="socialMediaOptions[socialMedia]?.icon"
                class="text-xl"
              />
            </MenuButton>
            <MenuItems class="absolute flex flex-col w-full bg-white shadow">
              <MenuItem
                v-for="(social, index) in socialMediaOptions"
                :key="index"
                @click="socialMedia = social.id"
              >
                <button
                  class="flex items-center justify-center w-full py-2 hover:bg-primary-300 hover:text-white"
                >
                  <icon :name="social.icon" class="mr-2 text-xl" />
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
          <P-Textfield
            name="socialUrl"
            placeholder="Add your social media link and press the + icon"
            class="flex-grow h-12"
            field-class="h-12 border !rounded-none !rounded-r-md focus:!outline-none focus:!ring-0"
            body-class="!rounded-none"
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
            class="flex items-center px-6 py-2 bg-white border rounded-full shadow"
          >
            <Icon :name="social.icon" class="text-xl" />
            <span class="ml-2">{{ social.name }}</span>
          </span>
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
