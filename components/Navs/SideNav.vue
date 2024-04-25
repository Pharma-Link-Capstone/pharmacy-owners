<script setup>
import { appNavigation } from "@/helper/data/navigation";

const router = useRouter();

const currentPath = computed(() => router.currentRoute.value.path);
</script>
<template>
  <div class="flex flex-col justify-between w-full h-full px-10 py-5">
    <div>
      <div>
        <div class="flex items-center justify-center">
          <img src="/images/pharmalink-logo.png" alt="Pharmalink logo" />
        </div>
      </div>
      <nav class="flex flex-col gap-5 mt-10">
        <nuxt-link
          v-for="(nav, index) in appNavigation"
          :key="index"
          class="flex items-center justify-center w-full gap-5 px-5 py-2 text-xl transition-all ease-in-out rounded-md text-gray-950 dark:text-primary-dark-600 hover:bg-primary-600 hover:dark:bg-primary-600 hover:dark:text-white hover:text-white"
          :class="[
            currentPath.includes(nav.path) && nav.name != 'Dashboard'
              ? 'bg-primary-600 text-white dark:!text-white'
              : '',
          ]"
          exact-active-class="text-white dark:!text-white bg-primary-600"
          :to="nav.path"
        >
          <Icon :name="nav.icon" class="text-xl" />
          <p>{{ nav.name }}</p>
        </nuxt-link>
      </nav>
    </div>
    <div class="mb-16">
      <div
        class="flex flex-col items-center gap-8 p-5 text-white rounded-3xl bg-gradient-to-tl from-secondary-600 to-secondary-200"
      >
        <h2 class="text-sm font-medium">Update account</h2>
        <button
          class="w-full py-3 text-lg bg-white shadow px-7 rounded-3xl text-secondary-600"
        >
          Upgrade Now!
        </button>
      </div>
      <button
        class="flex items-center justify-center w-full gap-3 mt-8 text-xl"
      >
        <Icon name="mdi:logout" class="text-xl" />
        <p>Logout</p>
      </button>
    </div>
  </div>
</template>
