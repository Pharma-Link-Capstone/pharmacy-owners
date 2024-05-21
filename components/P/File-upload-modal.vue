<script setup>
import { useField } from "vee-validate";

import upload_query from "@/graphql/upload.gql";
import authMutation from "@/composables/apollo/mutator";

const emit = defineEmits([
  "update:modelValue",
  "update:openModal",
  "uploadDone",
  "itemChange",
  "select",
  "clear",
]);
const props = defineProps({
  modelValue: {
    type: [Array, Object, String],
    required: true,
  },
  description: {
    type: String,
  },
  openModal: {
    type: Boolean,
  },
  init: {
    type: [Array, Object, String],
    default: undefined,
  },
  allowedTypes: {
    type: [Array, String],
    default: "/*",
  },
  folder: {
    type: String,
    default: "files",
    required: true,
  },
  accept: {
    type: String,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  invalidFileSizeMessage: {
    type: String,
    default: "{0}: Invalid file size, file size should be smaller than {1}.",
  },
  invalidFileTypeMessage: {
    type: String,
    default: "{0}: Invalid file type, allowed file types: {1}.",
  },
  invalidFileLimitMessage: {
    type: String,
    default: "Maximum number of files exceeded, limit is {0} at most.",
  },
  maxFileSize: {
    type: Number,
    required: true,
  },
  inputClass: {
    type: String,
    default: "",
    required: false,
  },
  name: {
    type: String,
    default: undefined,
    required: true,
  },
  auto: {
    type: Boolean,
    default: false,
  },
  rules: {
    type: [String, Object],
    default: "",
    required: false,
  },
  hideDetail: {
    type: Boolean,
    default: false,
    required: false,
  },
  prependIcon: Function,
  fileLimit: { type: Number, default: 1 },
  text: { type: String },
  fileTypes: { type: String },
  thumbnail: { type: Boolean, default: false },
  customizableText: { type: Boolean, default: false },
  preview: {
    type: Boolean,
    default: false,
  },
  editImage: String,
  previewSrc: [Array, String],
  wrapperClass: String,
});

const { modelValue } = toRefs(props);
// const toast = useToast();

const {
  errorMessage,
  value: inputValue,
  meta,
} = useField(props.name, props.rules, {
  initialValue: modelValue.value,
});

// const { notify } = useNotify();
const fileInput = ref(null);
const files = ref([]);
const uploadedFileCount = ref(0);
// const uploadedFiles = ref([]);
const uploadedFilesIndex = ref([]);
const rawFiles = ref([]);
const messages = ref([]);
const dataUrls = ref([]);
const isIcon = ref(true);
const previewSrc = ref(props.init);
const selectedType = ref([]);
const focused = ref(false);
const isUploadDone = ref(false);
const base64Files = ref([]);
const uploadedFiles = computed({
  get() {
    return props.init || [];
  },
  set(newVal) {
    emit("update:modelValue", newVal);
  },
});
const openModalVal = computed({
  get() {
    return props.openModal;
  },
  set(newVal) {
    emit("update:openModal", newVal);
  },
});

const urlToObject = async (imageUrl) => {
  const url = new URL(imageUrl);
  const filename = url.pathname.split("/").slice(-1)[0].split(".")[0];
  const response = await fetch(url);
  const blob = await response.blob();
  const file = new File([blob], filename, { type: blob.type });
  file.objectURL = URL.createObjectURL(file);
  file.fromBack = true;
  files.value.push(file);
};

onMounted(async () => {
  if (previewSrc.value) {
    await Promise.all(previewSrc.value?.map(urlToObject));
  }
});

watch(
  () => modelValue.value,
  (newVal) => {
    inputValue.value = newVal;
  },
  { deep: true }
);

const open = () => {
  fileInput.value.click();
};

const onFileSelect = async (event) => {
  files.value = files.value || [];
  let _files = event.target.files;

  for (let file of _files) {
    if (!isFileSelected(file)) {
      if (validate(file)) {
        file.objectURL = window.URL.createObjectURL(file);
        files.value.push(file);
      }
    }
  }

  emit("select", { originalEvent: event, files: files.value });

  if (props.fileLimit) {
    checkFileLimit();
  }

  if (props.auto && hasFiles.value && !isFileLimitExceeded()) {
    upload();
  }
};

function isFileSelected(file) {
  if (files.value && files.value.length) {
    for (let sFile of files.value) {
      if (
        sFile.name + sFile.type + sFile.size ===
        file.name + file.type + file.size
      )
        return true;
    }
  }

  return false;
}

function validate(file) {
  if (props.accept && !isFileTypeValid(file)) {
    messages.value == null ? (messages.value = []) : messages.value;
    messages.value.push(
      props.invalidFileTypeMessage
        .replace("{0}", file.name)
        .replace("{1}", props.accept)
    );

    return false;
  }

  if (props.maxFileSize && file.size > props.maxFileSize) {
    messages.value == null ? (messages.value = []) : messages.value;
    messages.value.push(
      props.invalidFileSizeMessage
        .replace("{0}", file.name)
        .replace("{1}", formatSize(props.maxFileSize))
    );

    return false;
  }

  return true;
}

function isFileTypeValid(file) {
  let acceptableTypes = props.accept.split(",").map((type) => type.trim());

  for (let type of acceptableTypes) {
    let acceptable = isWildcard(type)
      ? getTypeClass(file.type) === getTypeClass(type)
      : file.type == type ||
        getFileExtension(file).toLowerCase() === type.toLowerCase();

    if (acceptable) {
      return true;
    }
  }

  return false;
}

function isWildcard(fileType) {
  return fileType.indexOf("*") !== -1;
}

function getTypeClass(fileType) {
  return fileType.substring(0, fileType.indexOf("/"));
}

function getFileExtension(file) {
  return "." + file.name.split(".").pop();
}
function isImage(file) {
  return /^image\//.test(file.type);
}
function formatSize(bytes) {
  if (bytes === 0) {
    return "0 B";
  }

  let k = 1000,
    dm = 1,
    sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

const getNumberOfFiles = computed(() => {
  return Math.floor(parseInt(props.maxFileSize) / parseInt(props.fileLimit));
});

function checkFileLimit() {
  if (isFileLimitExceeded()) {
    messages.value == null ? (messages.value = []) : messages.value;
    messages.value.push(
      props.invalidFileLimitMessage.replace("{0}", props.fileLimit.toString())
    );
  }
}

function isFileLimitExceeded() {
  if (
    props.fileLimit &&
    props.fileLimit <= files.value.length + uploadedFileCount.value &&
    focused.value
  ) {
    focused.value = false;
  }

  return (
    props.fileLimit &&
    props.fileLimit < files.value.length + uploadedFileCount.value
  );
}

function onMessageClose(index) {
  messages.value.splice(index, 1);
}

const hasFiles = computed(() => {
  return files.value && files.value.length > 0;
});

const chooseDisabled = computed(() => {
  return (
    props.disabled ||
    (props.fileLimit &&
      props.fileLimit <= files.value.length + uploadedFileCount.value)
  );
});
const uploadDisabled = computed(() => {
  return (
    props.disabled ||
    !hasFiles.value ||
    (props.fileLimit && props.fileLimit < files.value.length)
  );
});
const cancelDisabled = computed(() => {
  return props.disabled || !hasFiles.value;
});

function clear() {
  files.value = [];
  messages.value = null;
  uploadedFiles.value.splice(0, uploadedFiles.value.length);
  emit("update:modelValue", uploadedFiles.value);
}

function clearInputElement() {
  fileInput.value = "";
}

function remove(index) {
  files.value.splice(index, 1);
  uploadedFiles.value.splice(index, 1);
  if (uploadedFiles.value?.length) {
    emit("update:modelValue", uploadedFiles.value);
  }
}

defineExpose({
  remove,
});

watch(
  () => files.value,
  async (newFiles) => {
    base64Files.value = [];

    const base64Promises = newFiles.map(async (file) => {
      if (file.fromBack || file.fileIsUploaded) {
        return null;
      }
      return {
        base64: await fileToBase64(file),
      };
    });
    const base64Results = await Promise.all(base64Promises);
    base64Files.value = base64Results.filter((result) => result !== null);
  },
  { deep: true }
);

function fileToBase64(file) {
  return new Promise((resolve) => {
    var reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.readAsDataURL(file);
  });
}

const enabled = ref(true);
const { mutate, onError, onDone, loading } = authMutation(upload_query);
const upload = () => {
  isUploadDone.value = true;
  let _files = base64Files.value
    .filter((e) => !e.fromBack)
    .map((e) => {
      return e.base64;
    });
  if (_files.length) {
    mutate({
      files: _files,
      folder: props.folder,
    });
  } else {
    emit("update:modelValue", uploadedFiles.value);
    // toast.add({
    // 	severity: "info",
    // 	summary: "No Change!",
    // 	detail: "No change have been made.",
    // 	life: 3000,
    // });
  }
};

onDone(({ data }) => {
  if (data) {
    let temp = [...uploadedFiles.value, ...data.uploadFiles.urls];
    uploadedFiles.value = temp;

    // uploadedFiles.value.push(...data.upload_files.data.fileUrls);

    files.value = files.value.map((file) => {
      const fl = new File([file], file.name, {
        ...file,
        type: file.type,
      });
      fl.objectURL = file.objectURL;
      fl.fileIsUploaded = true;
      fl.fromBack = file.fromBack;
      return fl;
    });
    // emit("update:modelValue", uploadedFiles.value);
    openModalVal.value = false;
    emit("uploadDone");
    // toast.add({
    // 	severity: "success",
    // 	summary: "File Uploaded Successfully!",
    // 	detail: "File Uploaded Successfully!",
    // 	life: 3000,
    // });
    files.value = [];
  }
});
</script>
<template>
  <P-Modal
    v-if="openModalVal"
    body-class="!bg-white !overflow-hidden !rounded-3xl"
    v-model="openModalVal"
    :autoClose="true"
  >
    <template #header>
      <div
        class="flex !my-0 items-center rounded-t-3xl p-3 justify-between w-full text-gray-600 bg-white"
      >
        <div class="flex items-center gap-x-3">
          <Icon name="icons8:upload-2" class="text-2xl" />
          <h1 class="text-lg font-medium">Upload File</h1>
        </div>
      </div>
    </template>
    <template #content>
      <div class="w-[750px] rounded-b-3xl p-3 bg-white">
        <div
          class="flex flex-col w-auto pb-3 transition-all duration-300 rounded-md shadow"
          :class="[
            errorMessage
              ? 'focus:ring-red-500 focus:border-red-500 hover:border-red-500 border-red-500'
              : 'hover:ring-gray-400   hover:border-gray-400 border-gray-300',
          ]"
        >
          <div
            class="flex flex-wrap items-center justify-center px-3 py-2 bg-gray-100 border-b-2 gap-y-5 gap-x-3 rounded-t-md"
          >
            <input
              ref="fileInput"
              type="file"
              class="hidden"
              :name="name"
              :class="[props.inputClass]"
              :accept="props.accept"
              @change="onFileSelect"
              :disabled="disabled"
              :multiple="fileLimit > 1"
            />
            <div class="flex items-center justify-start w-full gap-x-2">
              <span class="text-lg">Add File</span>
              <button
                class="self-start cursor-pointer text-primary-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                @click="open"
                :disabled="chooseDisabled"
                type="button"
              >
                <Icon
                  name="carbon:add-filled"
                  class="text-2xl duration-200 hover:scale-125"
                />
              </button>
            </div>
          </div>
          <TransitionGroup
            name="list"
            tag="ul"
            class="flex flex-col w-full px-2 mt-1 mb-5 gap-y-5"
          >
            <div
              class="bg-red-100 border-l-[6px] border-red-500 rounded-l-md text-teal-900 pl-4 pr-10 py-3 shadow-md relative"
              role="alert"
              v-for="(msg, index) of messages"
              :key="msg"
            >
              <div class="flex">
                <div class="py-1 pr-3 text-red-600">
                  <Icon name="ion:warning-outline" width="35" height="35" />
                </div>
                <div class="flex flex-col">
                  <p class="font-bold break-words">
                    {{ msg?.split(",")[1].split("_").join(" ") }}
                  </p>
                </div>
                <button
                  @click="onMessageClose(index)"
                  class="absolute duration-200 hover:text-red-500 top-2 right-2"
                  type="button"
                >
                  <Icon name="carbon:close-outline" width="25" height="25" />
                </button>
              </div>
            </div>
          </TransitionGroup>
          <TransitionGroup
            name="list"
            tag="ul"
            class="flex flex-col items-start gap-5 px-2"
            v-if="files?.length"
          >
            <div
              v-for="(file, index) of files"
              :key="file.name + file.type + file.size"
              class="flex items-center w-full gap-3 px-1 py-3 border rounded-md"
            >
              <div
                class="overflow-hidden rounded-md"
                :class="[
                  file.type === 'application/pdf' ? ' w-[60px]' : ' w-[150px]',
                ]"
              >
                <div v-if="file.type == 'video/mp4'" class="w-20 h-20">
                  <video
                    class="object-fill"
                    :src="file.objectURL"
                    :id="'video' + index"
                    autoplay
                    controls
                  ></video>
                </div>

                <div
                  v-else-if="file.type != 'application/pdf'"
                  class="w-20 h-20"
                >
                  <img
                    role="presentation"
                    :alt="file.name"
                    :src="file.objectURL"
                    class="object-contain w-full shrink-0"
                    width="100px"
                    height="100px"
                  />
                </div>
              </div>
              <div class="flex flex-col items-start justify-start w-full">
                <span class="break-all line-clamp-1">{{ file.name }} </span>
                <div class="flex gap-x-3">
                  <span class="">{{ formatSize(file.size) }}</span>
                </div>
              </div>
              <button @click="remove(index)" type="button">
                <Icon name="carbon:close-outline" width="25" height="25" />
              </button>
            </div>
          </TransitionGroup>
          <div
            v-else
            class="flex flex-col items-center justify-center w-full pb-10 cursor-pointer"
            @click="open"
          >
            <Icon name="ion:image-outline" class="text-5xl" />

            <p class="w-full px-5 pt-3 text-center lg:w-3/4 text-new-tale">
              {{ props.description }}
            </p>
          </div>
        </div>
        <div class="flex justify-between w-full mt-5 gap-x-5">
          <button
            class="px-5 py-1.5 border rounded-md shadow hover:shadow-md transition-all duration-300"
            @click="[(openModalVal = false), (enabled = false)]"
            type="button"
          >
            Cancel
          </button>
          <button
            @click="upload"
            class="flex items-center justify-center px-5 py-1.5 border rounded-md text-white gap-x-2 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:border-none disabled:text-gray-500 primary-button bg-primary-600"
            :disabled="uploadDisabled"
            type="button"
            :title="uploadDisabled ? 'Select a file to upload' : ''"
          >
            <Icon
              name="line-md:uploading-loop"
              v-if="loading"
              class="text-2xl text-white"
            />
            {{ !!init?.length || modelValue?.length ? "Add" : "Upload" }}
          </button>
        </div>
        <p
          v-if="!props.hideDetail"
          :class="errorMessage ? 'h-5' : 'h-0'"
          class="mt-2 text-sm text-red-600 font-body"
          id="email-error"
        >
          {{ errorMessage }} &nbsp;
        </p>
      </div>
    </template>
  </P-Modal>
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
</style>
