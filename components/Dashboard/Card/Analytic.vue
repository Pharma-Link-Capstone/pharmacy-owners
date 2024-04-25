<!-- Analytic Card -->
<script setup>
defineProps({
  analytic: {
    type: Object,
    required: true,
  },
});
</script>
<template>
  <div
    class="flex items-center justify-between p-6 bg-white shadow-sm dark:bg-primary-dark-900 rounded-3xl"
  >
    <div>
      <h3 class="text-sm text-gray-400 dark:dark:text-gray-200">
        {{ analytic.title }}
      </h3>
      <p class="mt-2 text-2xl font-medium text-gray-950 dark:text-gray-100">
        {{ analytic.value }}
      </p>
    </div>
    <div
      class="box-content flex items-center justify-center w-12 h-12 p-2 rounded-full bg-primary-50 dark:bg-primary-dark-800"
    >
      <Icon
        :name="analytic.icon"
        class="w-10 h-10 text-primary-600 dark:text-white"
      />
    </div>
  </div>
</template>
