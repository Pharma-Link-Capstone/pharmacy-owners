<script setup>
const props = defineProps({
  name: {
    type: String,
    // default: "Selamu",
  },
});
</script>
<template>
  <div>My name is :{{ props.name }}</div>
</template>
