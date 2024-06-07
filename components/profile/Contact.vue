<script setup>
import { useAuthStore } from "@/stores/auth.js";

const authStore = useAuthStore();
</script>

<template>
  <div
    class="w-[80%] flex-col bg-white dark:bg-primary-dark-900 justify-center items-center pl-2 rounded-md py-5"
  >
    <div class="flex items-center justify-between w-full p-5 bg-white-100">
      <h1
        class="pt-0 text-lg font-medium capitalize font-poppins dark:text-white"
      >
        Contact information
      </h1>
    </div>
    <div class="flex w-full justify-between pl-5 mb-2 max-w-[40rem]">
      <div class="flex flex-col gap-2">
        <h1
          class="pt-0 text-sm font-normal text-gray-600 capitalize dark:text-gray-100 font-poppins"
        >
          Phone Number
        </h1>
        <h1 class="pt-0 text-base font-normal font-poppins dark:text-white">
          +251{{ authStore.user?.phone_number }}
        </h1>
      </div>
      <div class="flex flex-col gap-2">
        <h1
          class="pt-0 text-sm font-normal text-gray-600 capitalize dark:text-gray-100 font-poppins"
        >
          Email
        </h1>
        <h1 class="pt-0 text-base font-normal font-poppins dark:text-white">
          {{ authStore.user?.email }}
        </h1>
      </div>
    </div>
  </div>
</template>
