<script setup>
// import { ref, computed,  onBeforeMount, toRefs } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { useField } from "vee-validate";
import { onClickOutside } from "@vueuse/core";

const emit = defineEmits([
  "update:modelValue",
  "update:selected",
  "search",
  "onSelectionFound",
]);
const props = defineProps({
  id: String,
  label: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  items: {
    type: Array,
    required: true,
    default() {
      return [];
    },
  },
  text: {
    type: String,
    default: "name",
  },

  returnObject: {
    type: Boolean,
    default: false,
  },
  // place holder
  placeholder: {
    type: String,
    default: "Select one",
  },
  placeholderClass: {
    type: String,
    default: "",
  },

  search: {
    type: String,
  },
  modelValue: {
    type: [String, Array, Object],
    // default: () => [],
  },
  selected: {
    type: String,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  errorMessages: {
    type: String,
  },
  placeHolder: {
    type: String,
  },
  class: {
    type: String,
    default: "",
  },
  clearable: Boolean,
  trailingIcon: String,
  rules: {
    type: String,
    default: "",
    required: false,
  },
  supporter: {
    type: String,
  },
  hideDetail: Boolean,
  searchPlaceholder: String,
  disabled: Boolean,
  placeholderStyle: String,
});

const {
  errorMessage,
  value: inputValue,
  meta,
} = useField(props.name, props.rules, {
  initialValue: props.returnObject ? props.modelValue?.id : props.modelValue,
});

const show = ref(false);
const input = ref(null);
const search = ref(undefined);
const { items, disabled } = toRefs(props);
const list_select = ref(null);

const selectedItem = ref(null);

const selectItem = (item) => {
  inputValue.value = item.id;
  selectedItem.value = item;
  show.value = false;
  if (props.returnObject) {
    emit("update:modelValue", item);
  } else {
    emit("update:modelValue", item.id);
  }
};
const outside = useDebounceFn(() => {
  show.value = false;
}, 300);

// open

const open = () => {
  show.value = true;
  input.value.focus();
};

// emit search word
const queryList = () => {
  emit("search", search.value);
};

// clear
const clear = () => {
  search.value = undefined;
  inputValue.value = "";
  selected.value = "";
  show.value = false;
  emit("update:modelValue", undefined);
  emit("update:selected", undefined);
  emit("onSelectionFound", undefined);
  emit("search", "");
};

onClickOutside(list_select, (e) => (show.value = false));

watch(
  () => props.modelValue,
  (newVal) => {
    if (props.returnObject) {
      inputValue.value = newVal?.id;
      selectedItem.value = newVal;
    } else {
      inputValue.value = newVal;
      selectedItem.value = props.items.find((item) => item.id == newVal);
      console.log(selectedItem.value, "from watch props");
    }
  }
);

/**------------------------Watch items----------------------- */
watch(
  () => props.items,
  (newVal) => {
    let tempSelectedItem = props.items.find(
      (item) => item.id == props.modelValue
    );

    if (tempSelectedItem) {
      inputValue.value = selectedItem.id;
      selectedItem.value = props.modelValue;
      // placeHolder.value = selectedItem.name;
      console.log(selectedItem.value, "from watch items");
    }
  }
);

onMounted(() => {
  if (props.returnObject) {
    inputValue.value = props.modelValue;
    selectedItem.value = props.modelValue;
  } else {
    inputValue.value = props.modelValue;
    selectedItem.value = props.items.find(
      (item) => item.id == props.modelValue
    );
    console.log(selectedItem.value, "from oumounted");
  }
  console.log("Mounted", selectedItem.value);
});
</script>

<template>
  <div class="relative">
    <slot name="label"></slot>
    <!-- -------------------Header---------- -->
    <div class="relative rounded-md shadow-sm font-body">
      <!-- @focus removed because of list open before focused  @focus="open" -->
      <button
        type="button"
        :id="id"
        :disabled="disabled"
        @click="open"
        class="bg-white text-base relative w-full border-2 border-green-500 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1"
        :class="[
          errorMessage
            ? 'focus:ring-red-500 focus:border-red-500 hover:border-red-500 border-red-500'
            : 'focus:ring-new-tale  focus:border-new-tale hover:border-new-tale border-gray-300 border-1 ',
          props.class ? props.class : '',
          disabled ? ' bg-gray-100 !cursor-not-allowed' : '',
          placeholder && !inputValue ? 'text-gray-500' : '',
        ]"
      >
        <div v-if="selectedItem" @click="show = true">
          <slot name="header" :item="selectedItem">
            <div class="text-gray-700">
              {{ selectedItem.name }}
            </div>
          </slot>
        </div>
        <div class="text-gray-700" :class="placeholderClass" v-else>
          {{ props.placeholder || "Select" }}
        </div>
      </button>

      <!-- -----------------------Chevron------------------- -->
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <Icon name="tabler:chevron-down" color="gray" class="text-2xl" />
      </div>
    </div>

    <!-- -------------------------Body------------------ -->
    <ul
      ref="list_select"
      v-show="show"
      :class="supporter"
      class="absolute z-50 w-full bg-white border-r-2 border-l-2 border-b-2 border-new-tale/50 scrollbar scrollbar-thin scrollbar-track-rounded-full scrollbar-track-primary shadow-lg max-h-56 h-auto rounded-br-xl rounded-b-xl text-base overflow-auto"
    >
      <li class="flex justify-center items-center px-2">
        <input
          ref="input"
          @input="queryList"
          v-model="search"
          @blur="outside"
          autocomplete="off"
          type="text"
          :name="props.name"
          class="my-1 shadow-sm focus:ring-new-tale focus:border-new-tale block sm:text-sm w-full border-gray-300 rounded-md font-body"
          :placeholder="props.searchPlaceholder || 'Search'"
        />
      </li>

      <!-- ----------------------Loading-------------------- -->
      <!-- <li class="h-1">
        <InputsProgress
          v-if="loading"
          class="rounded-xl w-full"
          color1="bg-new-tale/40"
          color2="bg-new-tale"
          color3="bg-dark-blue"
          height="h-1"
        ></InputsProgress>
      </li> -->

      <!-- -----------------------List items---------------- -->
      <li
        v-for="item in items"
        :key="item.id"
        @click="selectItem(item)"
        class="border-b select-none relative py-3 px-3 hover:bg-blue-50 text-gray-500 cursor-pointer"
      >
        <slot name="row" :item="item">
          <div
            :class="[props.itemClass ? props.itemClass : '']"
            class="flex items-center justify-between border-b select-none relative py-3 px-3 hover:bg-blue-50 cursor-pointer overflow-auto"
          >
            <span class="block capitalize break-words">{{ item.name }}</span>
            <!-- ---------------Check ------------>
            <div class="flex space-x-1">
              <Icon
                v-if="inputValue == item.id"
                name="ic:round-check"
                width="25"
                height="25"
                color="#003F7D"
                class="cursor-pointer text-inherit"
              />
            </div>
          </div>
        </slot>
      </li>

      <!-- ------------------------Option-------------------- -->
      <div
        v-if="!loading && items.length === 0"
        class="text-black test-lg flex justify-center items-center pb-2"
      >
        <slot name="option" :item="search" />
      </div>
    </ul>

    <!-- -----------------------Error--------------------- -->
    <p
      :visible="errorMessage"
      v-if="!props.hideDetail"
      class="mt-2 text-sm text-red-600 font-body"
      id="email-error"
    >
      {{ errorMessage }} &nbsp;
    </p>
  </div>
</template>
