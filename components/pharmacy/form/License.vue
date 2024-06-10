<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "finish", "prev"]);

const openModal = ref(false);
const errorMessage = ref("");

const license_url = computed({
  get: () => props.modelValue.license_url || [],
  set: (value) => {
    emit("update:modelValue", {
      ...props.modelValue,
      license_url: value,
    });
  },
});

const onSubmit = (e) => {
  if (!license_url.value) {
    errorMessage.value = "Please upload your license";
    return;
  }
  e.preventDefault();
  emit("finish");
};
</script>
<template>
  <!-- <P-FileUploadModal
    :max-file-size="10000000"
    :maxFiles="1"
    v-model="license_url"
    v-model:open-modal="openModal"
    name="license"
    rules="required"
    accept="application/pdf,image/*"
  /> -->
  <div>
    <div
      class="flex flex-col items-center justify-center w-full gap-3 text-gray-600"
    >
      <!-- <img
        src="/images/illustrations/upload.svg"
        alt=""
        class="w-[253px] h-[264px]"
      />
      <h2 class="text-lg">
        Upload your legal license:
        <button class="text-primary-600" @click="openModal = true">
          Browse
        </button>
      </h2>
      <p class="text-sm max-w-[50ch] text-center">
        Your legal license help us to guaranty all pharmacy are real pharmacies
        that we trust upon them so please upload a pdf/jpg/doc file for you
        license
      </p>
      <p class="text-red-600">{{ errorMessage }}</p> -->
      <P-FileUploadWrapper
        v-model="license_url"
        name="pharmacy_license"
        rules="required"
        placeholder="Upload images PNG, JPG and GIF files are allowed"
        accept="image/*,application/pdf"
      >
        <template #wrapper>
          <img
            src="/images/illustrations/upload.svg"
            alt=""
            class="w-[253px] h-[264px]"
          />
          <h2 class="text-lg">
            Upload your legal license:
            <button class="text-primary-600" @click="openModal = true">
              Browse
            </button>
          </h2>
          <p class="text-sm max-w-[50ch] text-center">
            Your legal license help us to guaranty all pharmacy are real
            pharmacies that we trust upon them so please upload a pdf/jpg/doc
            file for you license
          </p>
          <p class="text-red-600">{{ errorMessage }}</p>
        </template>
      </P-FileUploadWrapper>
    </div>
    <!-- Actions -->
    <div class="flex items-center justify-between mt-8">
      <button
        @click="$emit('prev')"
        class="flex items-center gap-2.5 justify-center px-3 py-1.5 rounded border shadow-sm text-gray-600"
      >
        <Icon name="ic:round-arrow-back-ios" class="text-xl text-gray-600" />
        Previous
      </button>
      <button
        @click="onSubmit"
        class="text-white bg-primary-600 px-5 py-1.5 rounded flex items-center justify-center gap-2.5"
      >
        Finish
        <Icon name="ic:round-arrow-forward-ios" class="text-xl text-white" />
      </button>
    </div>
  </div>
</template>
