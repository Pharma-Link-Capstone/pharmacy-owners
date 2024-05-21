<script setup>
import { useField } from "vee-validate";
import { Cropper, CircleStencil, RectangleStencil } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
const emit = defineEmits(["update:modelValue", "upload", "select"]);
const props = defineProps({
  modelValue: {
    type: [Array, Object, String],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  uploaded: {
    type: [Array, Object, String],
  },
  cropperClass: {
    type: String,
    default: "",
  },
  cropMaxWidth: {
    type: Number,
    default: 1100,
  },
  cropMaxHight: {
    type: Number,
    default: 1100,
  },
  cropMinWidth: {
    type: Number,
    default: 100,
  },
  cropMinHight: {
    type: Number,
    default: 100,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  maxFileSize: {
    type: Number,
    required: false,
  },
  inputClass: {
    type: String,
    default: "",
    required: false,
  },
  imageClass: {
    type: String,
    default: "",
  },
  stencilComponent: {
    type: String,
    default: "rectangle",
  },
  name: {
    type: String,
    default: undefined,
    required: true,
  },
  fileType: {
    type: String,
    default: "image",
    required: false,
  },
  fileTypesMessage: {
    type: String,
    default: "PNG, JPG, GIF, upto 10MB",
    required: false,
  },
  rules: {
    type: String,
    default: "required",
    required: false,
  },

  text: { type: String },
  fileTypes: { type: String },
  wrapperClass: String,
});

const {
  errorMessage,
  value: inputValue,
  meta,
} = useField(props.name, props.rules, {
  initialValue: props.uploaded,
});
const errorMessage2 = ref("");
const fileInput = ref(null);
const files = ref([]);
const type = ref("");
const base64Files = ref([]);
const base64String = ref("/*");
const fileInfo = ref({});
const open = () => {
  fileInput.value.click();
};
function getFileSize(bytes) {
  if (bytes === 0) {
    return "0 B";
  }

  let k = 1000,
    dm = 1,
    sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
const onFileSelect = async (event) => {
  errorMessage.value = "";
  event.preventDefault();
  let _files = event.dataTransfer
    ? event.dataTransfer.files
    : event.target.files;

  for (let file of _files) {
    file.objectURL = window.URL.createObjectURL(file);
    fileInfo.value.name = file.name;
    fileInfo.value.size = getFileSize(file.size);
    fileInfo.value.type = file.type;
    console.log(file.type);
    if (props.fileType == "pdf") {
      if (file.type != "application/pdf") {
        errorMessage2.value = "Please upload a pdf file";
        return;
      }
    } else {
      if (
        file.type != "image/jpeg" &&
        file.type != "image/png" &&
        file.type != "image/gif" &&
        file.type != "image/jpg" &&
        file.type != "image/svg+xml"
      ) {
        errorMessage2.value = "Please upload a image file";
        return;
      }
    }
    console.log(file.type);
    createImage(file);
    files.value[0] = file;
  }
  openModal.value = true;
};

function createImage(file) {
  var reader = new FileReader();
  reader.onload = (e) => {
    base64Files.value[0] = e.target.result;
    // props.modelValue = base64Files.value[0];
    console.log(base64Files.value[0]);
    if (props.fileType != "image") {
      type.value = getMimeType(e.target.result, "image/jpeg");
      emit("upload", base64Files.value[0]);
    } else {
      type.value = getMimeType(e.target.result, "application/pdf");
    }
  };
  reader.readAsDataURL(file);
}
const handleDragOver = (event) => {
  event.preventDefault();
};

watch(
  () => props.modelValue,
  (newVal) => {
    // inputValue.value = newVal;
  }
);
watch(
  () => props.uploaded,
  (newVal) => {
    inputValue.value = newVal;
  }
);
const openModal = ref(false);
function getMimeType(file, fallback = null) {
  const byteArray = new Uint8Array(file).subarray(0, 4);
  let header = "";
  for (let i = 0; i < byteArray.length; i++) {
    header += byteArray[i].toString(16);
  }
  switch (header) {
    case "89504e47":
      return "image/png";
    case "ffd8ffe0":
    case "ffd8ffe1":
    case "ffd8ffe2":
    case "ffd8ffe3":
    case "ffd8ffe8":
      return "image/jpeg";
    default:
      return fallback;
  }
}
function change({ coordinates, image, visibleArea, canvas }) {
  canvas.toBlob((blob) => {
    const reader = new FileReader();
    reader.onload = () => {
      base64String.value = reader.result; // This is the base64-encoded string

      // You can now do something with the base64 string, like uploading it to a server or using it in your application.
    };

    reader.readAsDataURL(blob);
    // Do something with blob: upload to a server, download and etc.
  }, type.value);
}
const crop = () => {
  openModal.value = false;
  emit("upload", base64String.value);
};
</script>
<template>
  <Modals-Modal
    wrapperClass="max-w-xl"
    :model-value="openModal && fileType == 'image'"
  >
    <template #content>
      <cropper
        :class="['h-[600px] w-[600px] bg-slate-100', props.cropperClass]"
        :src="files[0].objectURL"
        :stencil-component="
          stencilComponent == 'rectangle' ? RectangleStencil : CircleStencil
        "
        @change="change"
      />
      <div class="flex justify-center space-x-10 py-5">
        <button
          @click="crop"
          class="flex items-center space-x-2 py-2 px-5 bg-primary text-primary-600 rounded-md shadow-full hover:shadow-lg duration-200"
        >
          <Icon name="material-symbols:crop" class="text-2xl"></Icon>
          <p>Crop and Upload</p>
        </button>
        <button
          @click="openModal = false"
          class="shadow-full hover:shadow-lg duration-200 flex items-center space-x-1 py-2 px-5 text-primary bg-gray-100 ring-1 ring-gray-300 rounded-md"
        >
          <p>Cancel</p>
        </button>
      </div>
    </template>
  </Modals-Modal>
  <div
    class="flex flex-col w-auto border border-gray-400 border-dashed shadow rounded-md pb-12"
    @dragover="handleDragOver"
    @drop="onFileSelect"
  >
    <div class="flex flex-wrap items-center gap-y-5 gap-x-10 rounded-t-md">
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        :class="[props.inputClass]"
        :accept="props.accept"
        @change="onFileSelect"
        :disabled="disabled"
      />
    </div>
    <div
      v-if="uploaded && !loading"
      class="flex items-center rounded-md w-full justify-center relative gap-3"
    >
      <div
        v-if="fileType == 'image'"
        class="overflow-hidden justify-center flex"
        :class="imageClass"
      >
        <img
          role="presentation"
          alt="logo"
          :src="uploaded"
          class="object-contain bg-white"
        />
      </div>
      <div v-else class="w-full">
        <Icon name="uiw:file-pdf" class="text-8xl text-red-500"></Icon>
        <div>
          <p>{{ fileInfo.name }}</p>
          <p>{{ fileInfo.size }}</p>
        </div>
      </div>
      <div
        @click="open"
        class="absolute cursor-pointer flex text-white justify-center items-center gap-x-2 -bottom-10 capitalize bg-primary px-4 py-1 rounded-md group"
      >
        <Icon
          name="tdesign:refresh"
          class="text-xl group-hover:rotate-45 duration-200"
        ></Icon>
        Change
      </div>
    </div>
    <div
      v-else-if="loading"
      class="flex flex-col w-full justify-center items-center h-[200px]"
    >
      <div role="status">
        <svg
          aria-hidden="true"
          class="w-8 h-8 mr-2 text-gray-200 animate-spin  :text-gray-600 fill-primary"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <div
      v-else
      class="flex flex-col w-full justify-center items-center space-y-4"
    >
      <Icon name="iconoir:add-media-image" class="text-4xl  :text-white" />
      <p class="px-5 w-full text-center text-new-tale pt-3">
        <span @click="open" class="cursor-pointer text-blue-600"
          >upload Image
        </span>
        <span class="text-secondary-text  :text-white">
          or Drag and Drop</span
        >
      </p>
      <p
        class="font-poppins font-thin text-sm text-secondary-text  :text-white"
      >
        {{ fileTypesMessage }}
      </p>
    </div>
  </div>
  <p
    class="col-span-5 mt-1 text-left font-body text-sm text-red-600 duration-300 transition-all"
    :class="errorMessage2 ? 'h-5' : 'h-0'"
    id="email-error"
    :visible="errorMessage2"
  >
    {{ errorMessage2 }} &nbsp;
  </p>
  <p
    class="col-span-5 mt-1 text-left font-body text-sm text-red-600 duration-300 transition-all"
    :class="errorMessage ? 'h-5' : 'h-0'"
    id="email-error"
    :visible="errorMessage"
  >
    {{ errorMessage }} &nbsp;
  </p>
</template>
<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.cropper {
  height: 600px;
  width: 600px;
  background: #ddd;
}
</style>
