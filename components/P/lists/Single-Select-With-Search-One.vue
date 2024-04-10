<script setup>
import { ref, watch, toRefs, onMounted } from "vue";
import { useField } from "vee-validate";
import { useDebounceFn } from "@vueuse/core";

const emit = defineEmits([
  "update:modelValue",
  "returnedObject",
  "elementFocus",
  "update:search",
]);

const props = defineProps({
  id: String,

  query: Object,
  items: {
    type: Array,
    default: () => [],
  },
  placeholder: String,
  label: String,
  labelClass: String,
  clearable: Boolean,
  returnObject: Boolean,
  nameClass: String,
  modelValue: {
    type: [String, Number, Object, Boolean],
    default: undefined,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "text",
    required: false,
  },
  labelClass: {
    type: String,
    default: "",
    required: false,
  },
  rules: {
    type: String,
    default: "",
    required: false,
  },
  class: {
    type: String,
    default: "",
    required: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  listHeight: String,
  placeholderStyle: String,
  hideDetail: {
    type: Boolean,
    default: true,
    required: false,
  },
});

const selected = ref("");
const { items } = toRefs(props) || [];
const show = ref(false);
const placeHolder = ref("");
const input = ref(null);
const {
  errorMessage,
  value: inputValue,
  meta,
} = useField(props.name, props.rules, {
  initialValue: props.modelValue,
});

const outside = useDebounceFn(() => {
  if (props.removeSearch) {
    return;
  }
  show.value = false;
}, 300);

const set = (item) => {
  inputValue.value = item["id"];
  show.value = false;
  if (props.returnObject) {
    emit("update:modelValue", item);
  } else {
    emit("update:modelValue", item.id);
    emit("returnedObject", item);
    selected.value = item.id;
  }
};

const handleFocus = (event) => {
  if (props.removeSearch) {
    event.target.blur();
  }
  show.value = true;
  emit("elementFocus");
};
const clear = () => {
  placeHolder.value = undefined;
  inputValue.value = "";
  show.value = false;
  input.value.focus();
  emit("update:modelValue", undefined);
};

watch(
  () => props.modelValue,
  (newVal) => {
    let selectedItem;
    inputValue.value = newVal;
    selected.value = newVal;
    selectedItem = props.items.find((item) => item.id == newVal);
    if (selectedItem) {
      placeHolder.value = selectedItem.name;
    }
  }
);

watch(
  () => props.items,
  (newVal) => {
    let selectedItem = props.items.find((item) => item.id == props.modelValue);
    if (selectedItem) {
      inputValue.value = selectedItem.id;
      selected.value = props.modelValue;
      placeHolder.value = selectedItem.name;
    }
  }
);

onMounted(() => {
  let selectedItem = props.items.find((item) => item.id == props.modelValue);

  if (selectedItem) {
    inputValue.value = selectedItem.id;
    selected.value = props.modelValue;
    placeHolder.value = selectedItem.name;
  }
});
</script>
<template>
  <div class="relative">
    <div class="flex gap-x-2">
      <slot name="label"> </slot>
      <span
        v-if="rules.includes('required') && !props.disabled"
        class="text-red-600"
        >*</span
      >
    </div>
    <div class="relative rounded-md shadow-sm font-body">
      <input
        ref="input"
        v-model="placeHolder"
        @input="emit('update:search', $event.target.value)"
        @click="show = true"
        @focus="handleFocus"
        @blur="outside"
        autocomplete="off"
        :type="type"
        :placeholder="props.placeholder || 'Select'"
        :name="props.name"
        :id="id"
        class="block w-full text-gray-500 pr-10 focus:outline-none md:text-base text-sm rounded-md bg-transparent"
        :class="[
          errorMessage
            ? 'focus:ring-red-500 focus:border-red-500 hover:border-red-500 border-red-500 '
            : 'focus:ring-primary-600 focus:border-primary-600 hover:border-primary-600/70 border-gray-300 border-1 ',
          disabled ? ' bg-gray-100 cursor-not-allowed' : '',
          props.class ? props.class : '',
          props.placeholderStyle
            ? props.placeholderStyle
            : ' placeholder-gray-500',
          props.removeSearch ? 'cursor-pointer' : '',
        ]"
        :disabled="disabled"
        aria-invalid="true"
        aria-describedby="email-error"
      />
      <!-- icon -->
      <div
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
      >
        <Icon
          name="tabler:chevron-down"
          class="text-2xl text-gray-500 dark:text-white"
        />
      </div>
      <div
        v-if="clearable && !disabled"
        @click="clear"
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        <Icon
          name="gg:close"
          width="25"
          height="25"
          color="gray"
          class="cursor-pointer"
        />
      </div>
    </div>
    <ul
      v-show="show"
      class="absolute z-50 overflow-y-scroll overflow-x-hidden w-full bg-white border border-gray-300 shadow max-h-56 h-auto rounded-md text-base dark:bg-sheger_brown-300 dark:border-sheger_light_gray-200"
      :class="listHeight ? listHeight : ''"
    >
      <li
        v-for="item in items"
        :key="item.id"
        @click="set(item)"
        class="border-b border-gray-200 select-none relative py-3 px-3 secondary-text cursor-pointer overflow-auto dark:bg-transparent dark:border-sheger_light_gray-200"
      >
        <div
          class="flex items-center justify-between"
          :class="[labelClass ? labelClass : 'font-normal block font-body']"
        >
          <p :class="nameClass" class="block capitalize break-words">
            {{ item.name }}
          </p>
          <p class="text-sm text- font-light" v-if="item.identifier">
            {{ item.identifier }}
          </p>
        </div>
      </li>
    </ul>
    <p
      class="col-span-5 mt-1 font-body text-sm text-red-600 duration-300 transition-all"
      :visible="errorMessage"
      :class="errorMessage ? 'h-5' : 'h-0'"
      id="email-error"
    >
      {{ errorMessage }} &nbsp;
    </p>
  </div>
</template>
<style scoped>
.zz {
  z-index: 99;
}

::-webkit-scrollbar {
  width: 4px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px white;
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #d34553;
  border-radius: 3px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #d34553;
}
</style>
