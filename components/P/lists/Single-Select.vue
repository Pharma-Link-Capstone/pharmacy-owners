<script setup>
import { ref, watch, toRefs, onMounted } from "vue";
import { useField } from "vee-validate";
import { useDebounceFn } from "@vueuse/core";

const emit = defineEmits(["update:modelValue", "returnedObject"]);
const props = defineProps({
  id: {
    type: String,
    required: false,
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

  modelValue: {
    type: [String, Number, Object, Boolean],
    default: undefined,
  },

  items: {
    type: Array,
    default: () => [],
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

  // label
  label: {
    type: String,
    required: false,
  },
  labelClass: {
    type: String,
    default: "",
  },

  returnObject: {
    type: Boolean,
    default: false,
  },

  rules: {
    type: String,
    default: "",
  },
  class: {
    type: String,
    default: "",
  },

  headerClass: {
    type: String,
    required: false,
    default: "",
  },

  // list item
  listContainerClass: {
    type: String,
    required: false,
  },
  itemClass: {
    type: String,
    required: false,
    default: "",
  },
});

const singleSelect = ref(null);

const { items } = toRefs(props) || [];
const show = ref(false);
const {
  errorMessage,
  value: inputValue,
  meta,
} = useField(props.name, props.rules, {
  initialValue: props.returnObject ? props.modelValue?.id : props.modelValue,
});

const selectedItem = ref(null);

const outside = useDebounceFn(() => {
  show.value = false;
}, 300);

const set = (item) => {
  inputValue.value = item["id"];
  selectedItem.value = item;
  show.value = false;
  if (props.returnObject) {
    emit("update:modelValue", item);
  } else {
    emit("update:modelValue", item.id);
    emit("returnedObject", item);
  }
};

watchEffect(
  () => props.modelValue,
  (newVal) => {
    if (props.returnObject) {
      inputValue.value = newVal?.id;
      selectedItem.value = newVal;
    } else {
      inputValue.value = newVal;
      selectedItem.value = props.items.find((item) => item.id == newVal);
    }
  }
);

onClickOutside(singleSelect, (e) => (show.value = false));

onMounted(() => {
  if (props.returnObject) {
    inputValue.value = props.modelValue?.id;
    selectedItem.value = props.modelValue;
  } else {
    inputValue.value = props.modelValue;
    selectedItem.value = props.items.find(
      (item) => item.id == props.modelValue
    );
  }
});
</script>
<template>
  <div class="relative" ref="singleSelect">
    <div class="flex gap-x-2">
      <!-- -----------------Label----------------- -->

      <slot name="label"> </slot>
      <label
        class="text-gray-700"
        :class="labelClass"
        v-if="props.label"
        :for="props.id ? props.id : ''"
        >{{ props.label }}</label
      >
      <span
        v-if="rules.includes('required') && !props.disabled"
        class="text-red-600"
        >*</span
      >
    </div>

    <!-- -----------------Heading---------------- -->

    <div
      @click="show = !show"
      class="flex items-center justify-between rounded-md shadow-sm font-body border px-4 mb-2"
      :class="[props.headerClass, errorMessage ? 'border-red-500' : '']"
    >
      <!------------------- Leading icon----------- -->

      <!-- -----------------Left Side----------------- -->

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

      <!---------------- Chevron trailing icon ------------------->

      <div class="flex items-center pointer-events-none py-3">
        <Icon name="tabler:chevron-down" width="25" height="25" color="gray" />
      </div>
    </div>

    <!-------------------Body-------------------  -->
    <ul
      v-show="show"
      class="absolute z-50 overflow-y-scroll overflow-x-hidden w-full bg-white border shadow max-h-56 h-auto rounded-md text-base"
      :class="[props.listContainerClass ? props.listContainerClass : '']"
    >
      <li v-for="item in items" :key="item.id" @click="set(item)">
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
    </ul>
    <p
      :visible="errorMessage"
      class="mt-1 text-sm text-red-500 font-body"
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
  background: #c3ddfd;
  border-radius: 3px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #c3ddfd;
}
</style>

<!-- Steps

  ui structure
  props







-->
