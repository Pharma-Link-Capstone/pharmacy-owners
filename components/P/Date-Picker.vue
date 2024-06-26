<script setup>
import { ref, watch } from "vue";
import { useField } from "vee-validate";

const props = defineProps({
  modelValue: {
    type: [String, Date],
    required: true,
  },
  name: {
    type: String,
    default: undefined,
    required: true,
  },
  id: String,
  rules: {
    type: [Object, Array, String],
    default: "",
    required: false,
  },
  label: String,
  labelClass: {
    type: String,
    default: () => "",
    required: false,
  },
  placeholder: String,
  disabled: Boolean,
  min: [String, Date],
  max: [String, Date],
  value: {
    type: [String, Date],
    default: () => new Date("01-01-2001"),
    required: false,
  },
  svgIcon: {
    type: String,
    default:
      '<svg xmlns="http://www.w3.org/2000/svg" style="color:#203468;transform:scale(.5)" fill="#203468" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>',
    required: false,
  },

  showStar: {
    type: Boolean,
    default: true,
  },
  fieldClass: {
    type: String,
    default: "",
    required: false,
  },
  trailingIcon: {
    type: String,
    default: "",
    required: false,
  },
  leadingIcon: {
    type: String,
    default: "",
    required: false,
  },
  trailingIconClass: {
    type: String,
    default: "",
    required: false,
  },
  leadingIconClass: {
    type: String,
    default: "",
    required: false,
  },
  customError: {
    type: String,
    default: "",
    required: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const {
  errorMessage,
  value: inputValue,
  meta,
} = useField(props.name, props.rules, {
  initialValue: props.modelValue,
});

const minDate = ref(props.min);
const maxDate = ref(props.max);

watch(
  () => props.modelValue,
  (newVal) => {
    inputValue.value = newVal;
  }
);

const input = (e) => {
  emit("update:modelValue", e.target.value);
};
</script>

<template>
  <div>
    <label v-if="label" :class="labelClass" :for="id" class="block"
      >{{ label }}
      <span v-show="rules !== '' && props.showStar" class="text-red-500"
        >*</span
      ></label
    >

    <slot name="label"></slot>
    <div class="relative rounded-md shadow-sm">
      <icon
        v-if="leadingIcon"
        :name="leadingIcon"
        class="absolute text-gray-400 -translate-y-1/2 left-2 top-1/2"
        :class="leadingIconClass"
      />
      <slot name="leading"></slot>
      <input
        v-model="inputValue"
        :disabled="disabled"
        :style="`background: white url('data:image/svg+xml,${svgIcon}') right no-repeat;`"
        type="date"
        @input="input($event)"
        @change="input($event)"
        :id="id"
        :min="minDate"
        :max="maxDate"
        :class="[
          errorMessage
            ? 'focus:ring-red-500 focus:border-red-500 hover:border-red-500 border-red-500'
            : 'focus:ring-primary  focus:border-primary hover:border-primary-2 border-gray-300 border-1',
          props.disabled
            ? 'bg-gray-100 border-gray-200 hover:border-gray-200 text-gray-400 pointer-events-none shadow-none'
            : ' focus:ring-1',
          props.fieldClass ? props.fieldClass : '',
        ]"
        class="block w-full text-base rounded-md text-secondary placeholder-primary focus:outline-none"
        aria-invalid="true"
        aria-describedby="date-error"
      />
      <slot name="trailing"></slot>
      <icon
        v-if="trailingIcon"
        :name="trailingIcon"
        class="absolute text-gray-400 -translate-y-1/2 right-2 top-1/2"
        :class="trailingIconClass"
      />
    </div>
    <p
      :visible="errorMessage"
      class="mt-2 text-sm text-red-600"
      id="email-error"
      v-if="errorMessage"
    >
      {{ customError || errorMessage }} &nbsp;
    </p>
  </div>
</template>

<style scoped>
[type="date"]::-webkit-inner-spin-button {
  display: none;
}
[type="date"]::-webkit-calendar-picker-indicator {
  position: absolute;
  opacity: 0;
  padding: 5px;
  width: 100%;
  cursor: pointer;
}
</style>
