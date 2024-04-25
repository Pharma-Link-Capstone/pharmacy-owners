<script setup>
definePageMeta({
  layout: "app",
});

const analytics = ref([
  {
    title: "Medicine",
    value: 282,
    icon: "healthicons:medicines-outline",
  },
  {
    title: "Reviews",
    value: 300,
    icon: "material-symbols:reviews",
  },
  {
    title: "Impression",
    value: 182,
    icon: "wpf:view-file",
  },
  {
    title: "Viewed",
    value: 34,
    icon: "iconoir:eye",
  },
  {
    title: "Interactions",
    value: 12,
    icon: "carbon:touch-interaction",
  },
]);
</script>
<template>
  <div class="w-full">
    <!-- Analytic Cards -->
    <div class="grid grid-cols-5 gap-12">
      <Dashboard-Card-Analytic
        v-for="(analytic, index) in analytics"
        :key="index"
        :analytic="analytic"
      />
    </div>

    <!--  -->
    <div class="grid grid-cols-12 gap-10 mt-5">
      <!-- Inventory Chart -->
      <div
        class="col-span-6 bg-white dark:bg-primary-dark-900 rounded-3xl"
      ></div>

      <!-- Traffic Chart -->
      <div
        class="col-span-4 bg-white dark:bg-primary-dark-900 rounded-3xl"
      ></div>

      <!-- About Me -->
      <div
        class="box-content flex flex-col items-center col-span-2 gap-3 px-2 py-5 bg-white dark:bg-primary-dark-900 rounded-3xl"
      >
        <img
          src="/images/temp/pharmacy.jpg"
          alt="pharmacy"
          class="object-cover w-32 h-32 rounded-3xl"
        />
        <h2 class="text-xl font-bold text-gray-950 dark:text-gray-100">
          Grace Pharmacy
        </h2>
        <p class="text-sm text-gray-400 dark:text-gray-200">
          <Icon name="lucide:map-pin" /> Koye, Addis Ababa
        </p>
      </div>
    </div>
  </div>
</template>
