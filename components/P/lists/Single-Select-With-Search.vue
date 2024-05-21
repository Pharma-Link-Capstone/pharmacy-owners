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
  searchInputClass: String,
  headerClass: String,
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
  if (props.disabled) return;
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
        class="relative w-full py-2 pl-3 pr-10 text-base text-left bg-white border border-gray-200 rounded-md shadow-sm cursor-default focus:outline-none focus:ring-1"
        :class="[
          errorMessage
            ? 'focus:ring-red-500 focus:border-red-500 hover:border-red-500 border-red-500'
            : 'focus:ring-new-tale  focus:border-new-tale hover:border-new-tale border-gray-300 border-1 ',
          props.class ? props.class : '',
          disabled ? ' bg-gray-100 !cursor-not-allowed' : '',
          placeholder && !inputValue ? 'text-gray-500' : '',
          props.headerClass ? props.headerClass : '',
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
      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
        <Icon name="tabler:chevron-down" color="gray" class="text-2xl" />
      </div>
    </div>

    <!-- -------------------------Body------------------ -->
    <ul
      v-if="!disabled"
      ref="list_select"
      v-show="show"
      :class="supporter"
      class="absolute z-50 w-full h-auto overflow-auto text-base bg-white border-b-2 border-l-2 border-r-2 shadow-lg border-new-tale/50 scrollbar scrollbar-thin scrollbar-track-rounded-full scrollbar-track-primary max-h-56 rounded-br-xl rounded-b-xl"
    >
      <li class="flex items-center justify-center px-2">
        <input
          ref="input"
          @input="queryList"
          v-model="search"
          @blur="outside"
          autocomplete="off"
          type="text"
          :name="props.name"
          class="block w-full my-1 border-gray-300 rounded-md shadow-sm focus:ring-new-tale focus:border-new-tale sm:text-sm font-body"
          :class="[props.searchInputClass]"
          :placeholder="props.searchPlaceholder || 'Search'"
        />
      </li>

      <!-- ----------------------Loading-------------------- -->
      <!-- <li class="h-1">
        <InputsProgress
          v-if="loading"
          class="w-full rounded-xl"
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
        class="relative px-3 py-3 text-gray-500 border-b cursor-pointer select-none hover:bg-blue-50"
      >
        <slot name="row" :item="item">
          <div
            :class="[props.itemClass ? props.itemClass : '']"
            class="relative flex items-center justify-between px-3 py-3 overflow-auto border-b cursor-pointer select-none hover:bg-blue-50"
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
        class="flex items-center justify-center pb-2 text-black test-lg"
      >
        <slot name="option" :item="search" />
      </div>
    </ul>

    <!-- -----------------------Error--------------------- -->
    <p
      :visible="errorMessage"
      v-if="!props.hideDetail && errorMessage"
      class="mt-2 text-sm text-red-600 font-body"
      id="email-error"
    >
      {{ errorMessage }} &nbsp;
    </p>
  </div>
</template>
