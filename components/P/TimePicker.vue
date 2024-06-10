<script setup>
const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
  multiple: {
    type: Boolean,
    default: false,
  },

  label: {
    type: String,
    default: "Timetable",
  },

  placeholder: {
    type: String,
    default: "Select the time you want to receive the notification.",
  },

  options: {
    type: Array,
    default: () => [
      "01:00AM",
      "02:00AM",
      "03:00AM",
      "04:00AM",
      "05:00AM",
      "06:00AM",
      "07:00AM",
      "08:00AM",
      "09:00AM",
      "10:00AM",
      "11:00AM",
      "12:00PM",
      "01:00PM",
      "02:00PM",
      "03:00PM",
      "04:00PM",
      "05:00PM",
      "06:00PM",
      "07:00PM",
      "08:00PM",
      "09:00PM",
      "10:00PM",
      "11:00PM",
      "12:00AM",
    ],
  },
});

const emit = defineEmits(["update:modelValue"]);

const selected = computed({
  get: () => props.modelValue || (props.multiple ? [] : ""),
  set: (value) => emit("update:modelValue", value),
});

const showOptions = ref(false);

const timetable = ref(null);

onClickOutside(timetable, () => {
  showOptions.value = false;
});

const handleInput = (ev) => {
  if (props.multiple) {
    const value = ev.target.value;
    if (selected.value.includes(value)) {
      selected.value = selected.value.filter((item) => item !== value);
    } else {
      selected.value = [...selected.value, value];
    }
  } else {
    selected.value = ev.target.value;
    showOptions.value = false;
  }
};
</script>
<template>
  <div class="relative w-full" id="timetable">
    <div>
      <label
        for="timetable"
        class="block mb-2 text-base font-medium dark:text-gray-300"
      >
        {{ label }}
      </label>
      <button
        type="button"
        class="w-full h-12 px-5 py-2 mt-1 text-base text-left text-gray-500 rounded-xl bg-haze-50 dark:text-gray-400"
        @click="showOptions = true"
      >
        <span v-if="!selected || selected.length === 0"
          >Select the time you want to receive the notification.</span
        >
        <span
          v-for="(item, index) in selected"
          :key="index"
          class="px-2 py-1 mr-2 rounded-xl bg-primary-100 text-primary-600"
        >
          {{ item }}
        </span>
      </button>
    </div>
    <div
      class="flex flex-col pt-5 sm:flex-row sm:space-x-5 rtl:space-x-reverse"
    >
      <div
        class="absolute w-full p-3 mt-5 overflow-y-auto bg-white border-gray-200 shadow dark:bg-primary-dark-900 max-h-40 dark:border-gray-800 sm:max-w-full sm:mt-0"
        :class="{ hidden: !showOptions }"
      >
        <p>Options</p>
        <ul ref="timetable" class="grid w-full grid-cols-4 gap-2 mt-5">
          <li v-for="(option, index) in options" :key="index">
            <input
              :type="multiple ? 'checkbox' : 'radio'"
              :id="option"
              :value="option"
              class="hidden peer"
              name="timetable"
              :checked="selected.includes(option)"
              @input="handleInput"
            />
            <label
              :for="option"
              class="inline-flex items-center justify-center w-full p-2 text-sm font-medium text-center text-blue-600 bg-white border border-blue-600 rounded-lg cursor-pointer dark:hover:text-white dark:border-blue-500 dark:peer-checked:border-blue-500 peer-checked:border-blue-600 peer-checked:bg-blue-600 hover:text-white peer-checked:text-white hover:bg-blue-500 dark:text-blue-500 dark:bg-gray-900 dark:hover:bg-blue-600 dark:hover:border-blue-600 dark:peer-checked:bg-blue-500"
            >
              {{ option }}
            </label>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
