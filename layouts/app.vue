<script setup>
const openSidebar = ref(true);
</script>
<template>
  <main
    class="grid h-screen grid-cols-12 overflow-y-hidden bg-primary-50 dark:bg-primary-dark-950"
  >
    <div
      class="hidden bg-white dark:bg-primary-dark-900 xl:col-span-2 lg:col-span-3 lg:block"
    >
      <Navs-SideNav />
    </div>
    <div
      class="relative col-span-12 overflow-y-auto xl:col-span-10 lg:col-span-9"
    >
      <div class="w-full bg-white dark:bg-primary-dark-900">
        <Navs-TopNav />
      </div>
      <div class="p-5">
        <slot />
      </div>
    </div>
  </main>
</template>
