<script setup>
definePageMeta({
  layout: "app",
});

useHead({
  title: "Settings | Pharmalink Portal",
  meta: [
    {
      name: "description",
      content: "This is a settings page for the pharmacy",
    },
  ],
  bodyAttrs: {
    class: "test",
  },
});
</script>
<template>
  <div class="flex flex-col py-8 gap-y-8">
    <ProfilePhoto />
    <ProfilePersonal />
    <ProfileContact />
    <ProfilePassword />
  </div>
</template>
