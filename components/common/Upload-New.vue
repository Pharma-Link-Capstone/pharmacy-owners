<script setup>
import uploadMutation from "@/graphql/upload.gql";
import useNotify from "@/use/notify";
import { useField } from "vee-validate";
import mutator from "~/composables/apollo/mutator";

/**-----------------------Global variables----------------------- */
const { notify } = useNotify();
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  folder: {
    type: String,
    default: "",
  },
  modelValue: {
    type: String,
    default: "",
  },

  name: {
    type: String,
    required: true,
  },
  rules: {
    type: String,
    default: "",
    required: false,
  },
  imageClass: {
    type: String,
    default: "w-16 h-16",
  },
  accept: {
    type: String,
    default: "image/*",
  },
});

const {
  errorMessage,
  value: inputValue,
  meta,
} = useField(props.name, props.rules, {
  initialValue: "props.modelValue",
});

const base64Image = ref(null);
const isUploaded = ref(false);
const isError = ref(false);

const isImageSelected = computed(() => {
  return props.modelValue != "" || base64Image.value;
});

const selectedImage = computed(() => {
  return props.modelValue != "" ? props.modelValue : base64Image.value;
});

const deleteImage = () => {
  isUploaded.value = false;
  isError.value = false;
  base64Image.value = null;
  inputValue.value = null;
  emit("update:modelValue", "");
};

const {
  mutate: uploadMutate,
  onDone: uploadDone,
  onError: uploadError,
  loading: uploadLoading,
} = mutator(uploadMutation);

uploadDone((result) => {
  isUploaded.value = true;
  isError.value = false;
  if (result.data?.uploadFiles.urls?.length) {
    emit("update:modelValue", result.data?.uploadFiles?.urls[0]);
    emit("upload", result.data?.uploadFiles?.urls[0]);
  }
});

uploadError((error) => {
  isError.value = true;
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

const showUploadImageModal = ref(false);

function uploadImage(image) {
  isError.value = false;
  showUploadImageModal.value = false;
  base64Image.value = image;
  inputValue.value = image;

  uploadMutate({
    files: [base64Image.value],
  });
}
</script>

<template>
  <P-Modal
    body-class="w-[550px] !p-6 dark:bg-primary-dark-900 dark:!text-white"
    v-model="showUploadImageModal"
    :show-close="true"
  >
    <template #content>
      <div class="flex items-center justify-between pb-5">
        <p class="text-xl font-medium">Upload Image</p>
        <button type="button" @click="showUploadImageModal = false">
          <Icon name="heroicons:x-mark-20-solid" class="text-2xl" />
        </button>
      </div>

      <P-FileUploadSingleImgCropper
        name="upload"
        accept="image/*"
        @upload="uploadImage"
        :loading="uploadLoading"
      />
    </template>
  </P-Modal>
  <div>
    <div class="flex flex-col px-4 space-y-4">
      <button
        @click="showUploadImageModal = true"
        v-if="selectedImage"
        :class="imageClass"
        class="relative object-cover w-16 h-16 bg-green-500 rounded-full"
      >
        <img
          class="object-cover object-center w-full h-full rounded-full"
          :src="selectedImage"
          alt="My Image"
        />
        <icon
          name="lucide:plus"
          class="absolute bottom-0 right-0 text-2xl text-white rounded-full bg-primary-600"
        />
      </button>

      <div
        v-else-if="uploadLoading"
        class="flex flex-col w-full justify-center items-center h-[500px]"
      >
        <Icon
          name="eos-icons:bubble-loading"
          class="text-6xl text-primary-600"
        />
      </div>
      <div
        v-else
        @click="showUploadImageModal = true"
        class="flex flex-col items-center justify-center w-full mt-2 space-y-4 cursor-pointer"
      >
        <p
          class="items-center w-auto px-4 py-4 text-center border border-dashed rounded-full shadow text-new-tale border-primary-600"
        >
          <span class="text-blue-600"
            ><Icon
              name="ic:baseline-plus"
              class="self-center my-auto text-3xl text-primary-500"
            />
          </span>
        </p>
      </div>
    </div>
    <p
      v-if="errorMessage"
      class="mt-1 text-sm text-red-500 font-body"
      id="email-error"
    >
      {{ errorMessage }} &nbsp;
    </p>
  </div>
</template>
