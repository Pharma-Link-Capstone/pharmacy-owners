<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["update:modelValue", "next"]);
/*---------------- Define Variables ----------------*/
const pharmacy = computed({
  get: () => props.modelValue,
  set: (value) => {},
});

/*---------------- Form Submission ----------------*/
const { handleSubmit } = useForm({});
const onSubmit = handleSubmit(() => {
  emit("update:modelValue", pharmacy.value);
  emit("next");
});
</script>
<template>
  <div>
    <form @submit.prevent="onSubmit">
      <div>
        <h3 class="mb-2">
          Pharmacy Logo <span class="ml-1 text-red-600">*</span>
        </h3>
        <P-FileUploadWrapper
          v-model="pharmacy.logo_url"
          name="pharmacy_logo"
          rules="required"
          placeholder="Upload images PNG, JPG and GIF files are allowed"
          accept="image/*"
        >
          <template #wrapper>
            <div
              class="flex flex-col items-center justify-center w-full gap-4 p-8 border border-gray-300 border-dashed rounded-lg cursor-pointer bg-haze-50"
            >
              <Icon name="uil:cloud-upload" class="w-20 h-20" />
              <div class="flex flex-col mx-auto text-center input_field w-max">
                <div>
                  Upload images PNG, JPG and GIF files are allowed
                  <span class="text-primary-600">Browse</span>
                </div>
              </div>
            </div>
          </template>
        </P-FileUploadWrapper>
      </div>
      <div class="mt-3">
        <P-Textfield
          name="pharmacy_name"
          placeholder="Enter you legal business name"
          rules="required"
          v-model="pharmacy.name"
          field-class="!bg-haze-50 !h-12 !border-0 !rounded-2xl !shadow-none"
          body-class="!shadow-none"
        >
          <template #label>
            <label for="pharmacy_name" class="flex mb-2"
              >Pharmacy Name <span class="ml-1 text-red-600">*</span></label
            >
          </template>
        </P-Textfield>
      </div>
      <div class="mt-3">
        <P-Textarea
          label-class="mb-2"
          label="Description"
          name="pharmacy_description"
          placeholder="Describe your business in short and concise way"
          rules="required"
          v-model="pharmacy.description"
          field-class="!bg-haze-50 !border-0 !rounded-2xl !shadow-none"
          :maxlength="1000"
        />
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-center mt-8">
        <button
          type="submit"
          class="text-white bg-primary-600 px-3 py-1.5 rounded"
        >
          Save & Proceed
        </button>
      </div>
    </form>
  </div>
</template>
