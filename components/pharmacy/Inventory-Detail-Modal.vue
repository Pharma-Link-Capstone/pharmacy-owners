<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  medicine: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const openModal = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>
<template>
  <P-Modal
    v-model="openModal"
    :auto-close="false"
    body-class="w-[1200px] p-10 dark:!bg-primary-dark-900 dark:!text-gray-100"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <h1 class="text-3xl">Inventory Detail</h1>
        <button class="btn-primary" @click="openModal = false">Close</button>
      </div>
    </template>
    <template #content>
      <div class="w-full h-full">{{ props }} hey</div>
    </template>
  </P-Modal>
</template>
