<script setup>
definePageMeta({
  layout: "app",
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
