<script setup>
import { useFieldArray } from "vee-validate";

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: undefined,
  },
  name: {
    type: String,
    default: undefined,
    required: true,
  },
  value: {
    type: [String, Number],
    required: false,
  },
  id: {
    type: String,
    default: undefined,
    required: false,
  },
  type: {
    type: String,
    default: "radio",
    required: false,
  },
  label: {
    type: String,
    default: undefined,
    required: false,
  },
  labelClass: {
    type: String,
    default: () => "",
    required: false,
  },
  hideDetail: {
    type: Boolean,
    default: false,
    required: false,
  },
  trailingIcon: {
    type: [String, Function],
    default: undefined,
    required: false,
  },
  leadingIcon: {
    type: Function,
    default: undefined,
    required: false,
  },
  min: String,
  max: String,
  rules: {
    type: [String, Object],
    default: "",
    required: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const { value, errorMessage, meta } = useFieldArray(props.value, props.rules);

const set = (e) => {
  if (e.target.value === "on") emit("update:modelValue", props.value);
};

const checked = computed(() => {
  return props.modelValue === props.value;
});
</script>
<template>
  <div class="flex items-center space-x-2">
    <input
      type="radio"
      :name="name"
      :value="value"
      :checked="checked"
      @change="set"
      class="w-4 h-4 rounded-full text-primary border-primary focus:ring-0 focus:ring-offset-0 focus:ring-transparent focus:outline-none"
    />
    <slot name="label" />
    <p
      class="col-span-5 mt-1 text-sm text-red-600 transition-all duration-300 font-body"
      :class="errorMessage ? 'h-5' : 'h-0'"
      id="email-error"
      :visible="errorMessage"
    >
      {{ errorMessage }} &nbsp;
    </p>
  </div>
</template>
