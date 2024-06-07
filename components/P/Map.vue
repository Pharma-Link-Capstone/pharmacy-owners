<script setup>
/*-----------------------------------Imports---------------------------- */

// import getCurrentLocation from "@/composables/get-current-geo-location";

const props = defineProps({
  locations: {
    type: Array,
    required: true,
  },
  zoom: {
    type: Number,
    default: 15,
    required: false,
  },
  center: {
    type: Array,
    default: () => [9.000792178050938, 38.77155905822192],
    required: false,
  },
});
</script>

<template>
  <div class="w-full h-[42vh] z-0">
    <LMap
      ref="map"
      :use-global-leaflet="true"
      :zoom="zoom"
      :min-zoom="5"
      :max-zoom="24"
      :center="center"
      :options="{ zoomControl: true }"
      class="z-0"
    >
      <!-- --------------------Layers---------------------- -->
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&amp;copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        layer-type="base"
        name="OpenStreetMap"
      />

      <!-- --------------------Markers---------------------- -->
      <LMarker
        v-for="location in locations"
        :key="location.area?.name"
        :lat-lng="[
          location.location?.coordinates[1],
          location.location?.coordinates[0],
        ]"
        :name="location.area?.name"
      >
        <!-- -------------------------Icon Image---------------- -->

        <LIcon
          :name="location.area?.name"
          :class="'custom-div-icon'"
          :icon-size="[50, 50]"
          icon-url="/images/pharmalink-logo.png"
        ></LIcon>

        <!-- -------------------------Tooltip---------------- -->
        <LTooltip :permanent="true" :direction="'top'" :offset="[0, -50]">
          <div class="text-primary-600">{{ location.area?.name }}</div>
        </LTooltip>
        <!-- -------------------------Popup---------------- -->
        <!-- <LPopup :offset="[0, -50]">
          <div class="flex flex-col w-full">
            <p class="text-primary-600">{{ location.area?.name }}</p>

            <button
              @click="openDirectionOnMap(placeLocation.location?.coordinates)"
              class="flex justify-between w-full text-blue-700"
            >
              Direction
            </button>
          </div>
        </LPopup> -->
      </LMarker>
    </LMap>
  </div>
</template>

<style>
.custom-div-icon {
  background-color: blue;
  height: 40px;
  width: 40px;
}

.leaflet-popup-content-wrapper {
  width: 150px !important;
}

.leaflet-popup-content {
  width: 80% !important;
}
</style>
