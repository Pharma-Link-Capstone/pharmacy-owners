<script setup>
import { useField } from "vee-validate";
import Visible from "@/plugins/visible";
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
  id: {
    type: String,
    default: undefined,
    required: false,
  },
  type: {
    type: String,
    default: "text",
    required: false,
  },
  placeholder: {
    type: String,
    default: undefined,
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
  disabled: {
    type: Boolean,
    default: false,
  },
  class: String,
  iconLeadingClass: String,
  placeholderStyle: String,
  iconBackground: Boolean,
  mainDiv: String,
});
const emit = defineEmits(["update:modelValue"]);

const {
  errorMessage,
  value: inputValue,
  meta,
} = useField(props.name, props.rules, {
  initialValue: props.modelValue,
});

const type = ref(props.type);

const set = (event) => {
  emit("update:modelValue", event.target.value);
};

const togglePassword = () => {
  if (type.value === "password") {
    type.value = "text";
    return;
  }
  if (type.value === "text") {
    type.value = "password";
  }
};

watch(
  () => props.modelValue,
  (newVal) => {
    inputValue.value = props.type == "number" ? Number(newVal) : newVal;
  }
);
</script>
<template>
  <div :class="mainDiv">
    <!-- -------------------Label----------------- -->
    <slot name="label"></slot>
    <label
      :class="[props.labelClass, 'text-red-400']"
      v-if="props.label"
      :for="props.id ? props.id : ''"
    >
      {{ props.label + "ertyui" }}
    </label>
    <div
      class="relative rounded-md overflow-clip font-body shadow-sm group"
      :class="props.class"
    >
      <!-- -----------------Leading Class--------------- -->
      <slot name="leading" />

      <div
        v-if="props.leadingIcon"
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center px-4"
        :class="
          iconBackground && !errorMessage
            ? 'rounded-l-lg border border-gray-300 bg-gray-50'
            : 'rounded-l-lg border border-red-500 hover:border-red-500 focus:border-red-500 focus:ring-red-500'
        "
      >
        <Icon :name="props.leadingIcon" width="25" height="25" color="gray" />
        <component
          class="h-5 w-5 text-gray-400 hover:cursor-pointer"
          :is="props.leadingIcon"
        ></component>
      </div>
      <input
        v-model="inputValue"
        @input="set($event)"
        @change="set($event)"
        :min="min"
        :max="max"
        :type="type"
        :name="props.name"
        step="any"
        :id="id"
        :class="[
          errorMessage
            ? 'border-red-500 hover:border-red-500 focus:border-red-500 focus:ring-red-500'
            : 'border-[1px]  border-gray-300 group-hover:border-new-tale focus:border-new-tale focus:ring-new-tale disabled:bg-gray-100 disabled:cursor-not-allowed',
          props.iconLeadingClass ? props.iconLeadingClass : '',
          props.trailingIcon ? 'pr-0' : '',
          props.class ? props.class : '',
          props.placeholderStyle
            ? props.placeholderStyle
            : ' placeholder-gray-500',
          props.trailingIcon ? 'pr-7' : '',
          props.type == 'password' ? 'pr-7' : '',
        ]"
        class="block w-full rounded-md font-body text-base text-gray-500 placeholder-gray-500 focus:outline-none"
        :placeholder="props.placeholder"
        aria-invalid="true"
        aria-describedby="email-error"
        :disabled="props.disabled"
      />

      <!-- -----------------Trailing--------------- -->
      <slot name="trailing" />
      <div
        v-if="props.type == 'password'"
        class="absolute inset-y-0 right-0 flex items-center pr-3 hover:cursor-pointer"
        @click="togglePassword()"
      >
        <Icon
          class="h-5 w-5"
          :class="[type === 'password' ? 'text-gray-400' : 'text-new-tale']"
          :name="props.trailingIcon"
        ></Icon>
      </div>
      <component :is="props.trailingIcon"></component>
    </div>
    <p
      class="col-span-5 mt-1 font-body text-sm text-red-600 duration-300 transition-all"
      :class="errorMessage ? 'h-5' : 'h-0'"
      id="email-error"
      :visible="errorMessage"
    >
      {{ errorMessage }} &nbsp;
    </p>
  </div>
</template>
