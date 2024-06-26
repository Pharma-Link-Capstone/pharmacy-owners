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

  /*-------------------- leading icon-----------------------*/
  /*--------------------When using leading by slot pl have to given to bodyClass-----------------------*/

  leadingIcon: {
    type: String,
    required: false,
    default: undefined,
  },

  leadingIconClass: {
    type: String,
    required: false,
    default: "",
  },
  leadingIconContainerClass: {
    type: String,
    required: false,
    default: "",
  },

  /*-------------------- Trailing icon-----------------------*/
  trailingIcon: {
    type: String,
    required: false,
    default: undefined,
  },

  trailingIconClass: {
    type: String,
    required: false,
    default: "",
  },
  trailingIconContainerClass: {
    type: String,
    required: false,
    default: "",
  },

  placeholderStyle: String,
  iconBackground: Boolean,

  /*-----------------------Container Class-------------------------*/

  /*------------- The whole element container--------------*/
  mainDivClass: {
    type: String,
    required: false,
    default: "",
  },

  /*------------- Leading icon, input field and Traling icon container--------------*/
  bodyClass: {
    type: String,
    required: false,
    default: "",
  },

  /*------------- Input field class--------------*/

  fieldClass: {
    type: String,
    required: false,
    default: "",
  },
});
const emit = defineEmits(["update:modelValue", "trailingIconClick"]);

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
  <div :class="mainDivClass">
    <!-- -------------------Label----------------- -->
    <slot name="label"></slot>
    <label
      :class="[props.labelClass, 'text-gray-700']"
      v-if="props.label"
      :for="props.id ? props.id : ''"
    >
      {{ props.label }}
    </label>
    <div
      class="relative rounded-md shadow-sm overflow-clip font-body group"
      :class="props.bodyClass"
    >
      <!-- -----------------Leading Class--------------- -->
      <slot name="leading" />

      <div
        v-if="props.leadingIcon"
        class="absolute inset-y-0 left-0 flex items-center px-4 pointer-events-none"
        :class="[
          props.leadingIconContainerClass,
          iconBackground && !errorMessage
            ? 'rounded-l-lg border border-gray-300 bg-gray-50'
            : 'rounded-l-lg border border-red-500 hover:border-red-500 focus:border-red-500 focus:ring-red-500',
        ]"
      >
        <Icon
          :name="props.leadingIcon"
          :class="props.leadingIconClass"
          class="text-gray-700"
        />
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
          props.fieldClass ? props.fieldClass : '',
          errorMessage
            ? '!border-red-500 !border hover:!border-red-500 focus:!border-red-500 focus:!ring-red-500'
            : 'border-[1px]  border-gray-300  focus:border-primary-600 focus:!ring-0 disabled:bg-gray-100 disabled:cursor-not-allowed',
          props.trailingIcon ? 'pr-0' : '',
          props.placeholderStyle
            ? props.placeholderStyle
            : ' placeholder-gray-500',
          props.trailingIcon ? 'pr-7' : '',
          props.type == 'password' ? 'pr-7' : '',
          props.leadingIcon ? 'pl-14' : '',
        ]"
        class="block w-full text-base text-gray-500 placeholder-gray-500 rounded-md font-body focus:outline-none"
        :placeholder="props.placeholder"
        aria-invalid="true"
        aria-describedby="email-error"
        :disabled="props.disabled"
      />

      <!-- -----------------Trailing--------------- -->
      <slot name="trailing" />

      <div
        v-if="props.trailingIcon && props.type == 'password'"
        class="absolute inset-y-0 right-0 flex items-center pr-3 hover:cursor-pointer"
        @click="togglePassword()"
      >
        <Icon
          class="w-5 h-5"
          :class="[type === 'password' ? 'text-gray-400' : 'text-new-tale']"
          :name="props.trailingIcon"
        ></Icon>
      </div>

      <div
        v-if="props.trailingIcon && props.type != 'password'"
        class="absolute inset-y-0 right-0 flex items-center pr-3 hover:cursor-pointer"
        :class="props.trailingIconContainerClass"
        @click="emit('trailingIconClick')"
      >
        <Icon
          class="w-5 h-5 text-gray-400"
          :class="props.trailingIconClass"
          :name="props.trailingIcon"
        ></Icon>
      </div>
    </div>
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
