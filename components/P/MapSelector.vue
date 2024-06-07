<script setup>
import { icon } from "leaflet";
import { useFullscreen } from "@vueuse/core";

const props = defineProps(["lat", "long", "init", "headerClass"]);
const mapping = ref(null);
const { isFullscreen, enter, exit, toggle } = useFullscreen(mapping);
const userLocation = ref({});
const zoom = ref(14);
const loading = ref(false);
const position = ref({
  lat: props.lat,
  lng: props.long,
});
const address = ref("");
const dragging = ref(false);
const defaultLocation = ref({
  lat: props.lat || 8.9892498,
  lng: props.long || 38.7859123,
});

const selectedLocation = ref();

const emit = defineEmits(["updateMapVal"]);

const tileProvider = ref({
  attribution:
    '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
});
const getUserPosition = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      userLocation.value = {
        lat: props.lat || pos.coords.latitude,
        lng: props.long || pos.coords.longitude,
      };
      position.value = {
        lat: props.lat || pos.coords.latitude,
        lng: props.long || pos.coords.longitude,
      };
    });
  } else {
    userLocation.value = {
      lat: props.lat,
      lng: props.long,
    };
    position.value = {
      lat: props.lat,
      lng: props.long,
    };
  }
};

onMounted(async () => {
  getUserPosition();
});

const getAddress = async () => {
  loading.value = true;
  let address = "unresolved address";
  try {
    const { lat, lng } = position.value;
    const result = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    );
    if (result.status === 200) {
      const body = await result.json();
      address = body.display_name;
    }
  } catch (e) {
    // console.log("Reserve Geocode Error->", e);
  }
  loading.value = false;
  return address;
};

watch(
  position,
  async (value) => {
    // console.log("Watcher", value);
    address.value = await getAddress();
    emit("updateMapVal", {
      position: value || defaultLocation.value,
      address: address.value,
    });
    // console.log("position in wathcer", position.value);
  },
  { deep: true }
);

const doSomethingOnReady = () => {};

const onMapClick = async (value) => {
  if (value.latlng) {
    position.value = value.latlng;
  }
  // emit("updateMapVal", {
  //     position: value || defaultLocation.value,
  //   });
};

watch(
  () => selectedLocation.value,
  (value) => {
    position.value = value.latlng;
  }
);

const tooltipContent = computed(() => {
  if (dragging.value) return "...";
  if (loading.value) return "Loading...";
  if (!address.value)
    return `<strong>Unknown Location</strong> <hr/><strong>lat:</strong> ${position.value.lat}<br/> <strong>lng:</strong> ${position.value.lng}`;
  return `<strong>${address.value.replace(
    ",",
    "<br/>"
  )}</strong> <hr/><strong>lat:</strong> ${
    position.value.lat
  }<br/> <strong>lng:</strong> ${position.value.lng}`;
});

const openModal = ref(false);
</script>

<template>
  <div class="space-y-1">
    <p class="mb-2 text-sheger-gray-100">Location</p>
    <button
      v-html="
        tooltipContent
          ? tooltipContent.split('<hr/>')[0]
          : 'Click to get location'
      "
      @click.prevent="openModal = true"
      class="w-full py-2 text-xs text-gray-500 border border-gray-300 rounded-md"
      :class="[props.headerClass]"
    ></button>
  </div>
  <P-Modal
    :auto-close="true"
    body-class="w-[800px]"
    v-model="openModal"
    v-if="openModal"
  >
    <template #content>
      <div class="relative px-5 py-5 bg-white rounded-3xl">
        <button @click="openModal = false">
          <Icon
            name="ic:baseline-close"
            class="absolute z-50 text-3xl cursor-pointer top-2 right-2"
          />
        </button>
        <PMapSearch v-model="selectedLocation" class="overflow-visible" />
        <h1
          class="flex items-center mt-5 mb-2 text-xs font-light tracking-tight text-gray-700 gap-x-2"
        >
          <Icon name="carbon:information" class="text-xl text-primary" />
          Double click the map to set the location! / Ctrl + scroll to Zoom in
          and out
        </h1>
        <div class="h-[40vh] relative z-0">
          <button
            @click.prevent="toggle"
            :title="isFullscreen ? 'Exit Full Screen' : 'Full Screen'"
            class="absolute z-[10000] right-3 top-3 bg-primary-600 text-white flex items-center gap-x-2 group hover:bg-primaryLite px-1.5 py-1 rounded-lg transition-all duration-200"
          >
            <Icon
              :name="
                isFullscreen
                  ? 'material-symbols:fullscreen-exit'
                  : 'material-symbols:fullscreen'
              "
              class="text-xl duration-200 group-hover:scale-125"
            />
          </button>
          <LMap
            class="rounded-md"
            @ready="doSomethingOnReady()"
            ref="mapping"
            @dblclick="onMapClick"
            :zoom="zoom"
            :maxZoom="18"
            :center="[
              position.lat || userLocation.lat || defaultLocation.lat,
              position.lng || userLocation.lng || defaultLocation.lng,
            ]"
          >
            <LTileLayer
              :url="tileProvider.url"
              :attribution="tileProvider.attribution"
            />

            <LMarker
              v-if="position.lat && position.lng"
              visible
              :lat-lng="position"
              @dragstart="dragging = true"
              @dragend="dragging = false"
            >
              <LIcon
                name="Location"
                :class="'custom-div-icon'"
                :icon-size="[40, 40]"
                icon-url="/images/static/sheger-logo.png"
              ></LIcon>
              <LTooltip
                :content="tooltipContent"
                :options="{ permanent: true }"
              />
            </LMarker>
          </LMap>
        </div>

        <div class="flex justify-end mt-4">
          <button
            @click="openModal = false"
            class="px-5 py-2 text-white rounded-lg primary-button bg-primary-600 w-fit"
          >
            Done
          </button>
        </div>
      </div>
    </template>
  </P-Modal>
</template>
