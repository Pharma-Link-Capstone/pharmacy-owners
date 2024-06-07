<script setup>
defineProps({
  text: {
    type: String,
    default: "No items found",
  },
});
</script>
<template>
  <div class="flex flex-col items-center justify-center w-full h-full">
    <!-- No data illustration -->
    <img src="/images/no-data.jpg" alt="" class="object-contain w-60" />
    <p class="mt-3 text-lg text-center text-gray-950">
      {{ text }}
    </p>
  </div>
</template>
