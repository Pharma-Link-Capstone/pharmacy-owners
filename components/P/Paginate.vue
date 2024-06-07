<script setup>
import { usePagination } from "vue-composable";

const props = defineProps({
  modelValue: {
    type: Number,
    default: () => 1,
  },
  length: {
    type: Number,
    default: undefined,
    required: false,
  },
  disabled: {
    type: Boolean,
    default: false,
    required: false,
  },
  itemsPerPage: {
    type: Number,
    default: undefined,
    required: false,
  },
  totalData: {
    type: Number,
    default: undefined,
    required: false,
  },
  offset: {
    type: Number,
    default: undefined,
    required: false,
  },
});

const emit = defineEmits(["update:modelValue", "update:offset"]);

const setEvents = () => {
  emit("update:modelValue", pageTracker.value);
  emit("update:offset", offset.value);
};

const totalPages = computed(() => {
  if (props.length !== undefined) {
    return props.length / 1;
  } else if (
    props.totalData !== undefined &&
    props.itemsPerPage !== undefined
  ) {
    return Math.ceil(props.totalData / props.itemsPerPage);
  }
  return 0;
});

let pageTracker = ref(0);
if (props.offset === 0) {
  pageTracker.value = 1;
} else if (props.offset !== undefined) {
  pageTracker.value = Math.floor(props.offset / props.itemsPerPage);
} else {
  pageTracker.value = props.modelValue / 1;
}

// Functions two calculate direction of the dots
const offset = computed(() => {
  return (pageTracker.value - 1) * props.itemsPerPage;
});

const pageL1 = computed(() => {
  return pageTracker.value === 1;
});

const page3OR4 = computed(() => {
  return pageTracker.value === 3 || pageTracker.value === 4;
});

const pageBTN = computed(() => {
  return pageTracker.value >= 5 && pageTracker.value < totalPages.value - 2;
});

const pageLASTS = computed(() => {
  return pageTracker.value >= totalPages.value - 2;
});

const firsThree = computed(() => {
  return `${
    pageL1.value
      ? 3
      : page3OR4.value
      ? 5
      : pageBTN.value || pageLASTS.value
      ? 1
      : 3
  }`;
});

const lasThree = computed(() => {
  return pageL1.value
    ? totalPages.value - 2
    : page3OR4.value || pageBTN.value
    ? totalPages.value
    : pageLASTS.value
    ? totalPages.value - 4
    : totalPages.value - 2;
});

const middleStart = computed(() => {
  return pageBTN.value ? pageTracker.value - 1 : 0;
});

const middleEnd = computed(() => {
  return pageBTN.value ? pageTracker.value + 1 : 0;
});

const middleChecker = computed(() => {
  return pageBTN.value ? true : false;
});

const toggle = (n) => {
  pageTracker.value = n;
  setEvents();
};

const backward = () => {
  if (pageTracker.value > 1) {
    pageTracker.value--;
    setEvents();
  }
};

const forward = () => {
  if (pageTracker.value < totalPages.value) {
    pageTracker.value++;
    setEvents();
  }
};

const { prev, next } = usePagination({
  currentPage: pageTracker.value,
  pageSize: totalPages.value,
});

const range = (start, end) => {
  return Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx);
};
</script>

<template>
  <div>
    <div
      v-if="totalPages > 0"
      class="flex flex-wrap justify-between pb-2 mx-2 border-t-2"
    >
      <div>
        <a
          href="#"
          class="relative inline-flex items-center py-2 text-sm font-medium text-gray-500 sm:px-2 hover:text-secondary-9"
          :class="
            pageTracker === 1 || props.disabled
              ? 'text-gray-300 pointer-events-none'
              : ''
          "
          @click="
            prev();
            backward();
          "
        >
          <!-- <ArrowLongLeftIcon class="w-6 h-5" aria-hidden="true" /> -->
          <Icon name="bi:arrow-left" />
          <span class="hidden ml-5 sm:block">Previous</span>
        </a>
      </div>

      <div
        class="relative z-0 inline-flex -space-x-px -top-0.5"
        aria-label="Pagination"
      >
        <a
          v-for="n in totalPages"
          v-show="totalPages <= 7"
          :key="n"
          href="#"
          aria-current="page"
          class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500"
          :class="{
            ' border-t-2 px-2 z-10 text-primary-100 border-primary-100 ':
              n === pageTracker,
            'text-gray-300 pointer-events-none': props.disabled,
          }"
          :disabled="props.disabled ? 'pointer-events-none' : ''"
          @click="toggle(n)"
        >
          {{ n }}
        </a>

        <a
          v-for="n in range(1, firsThree)"
          v-show="totalPages > 7"
          :key="n"
          href="#"
          aria-current="page"
          class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500"
          :class="{
            ' border-t-2 px-2 z-10 text-primary-100 border-primary-100':
              n === pageTracker,
            'text-gray-300 pointer-events-none': props.disabled,
          }"
          @click="toggle(n)"
        >
          {{ n }}
        </a>
        <a
          v-show="totalPages > 7"
          v-if="middleChecker"
          href="#"
          aria-current="page"
          class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500"
          :class="{
            'text-gray-300 pointer-events-none': props.disabled,
          }"
        >
          ...
        </a>
        <!-- <div > -->
        <a
          v-for="n in range(middleStart, middleEnd)"
          v-show="pageTracker > 4 && pageTracker < totalPages - 2"
          :key="n"
          href="#"
          aria-current="page"
          class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500"
          :class="{
            'border-t-2 px-2 z-10 text-primary-100 border-primary-100':
              n === pageTracker,
            'text-gray-300 pointer-events-none': props.disabled,
          }"
          @click="toggle(n)"
        >
          {{ n }}
        </a>
        <!-- </div> -->
        <a
          v-show="totalPages > 7"
          href="#"
          aria-current="page"
          class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500"
          :class="{
            'text-gray-300 pointer-events-none': props.disabled,
          }"
        >
          ...
        </a>
        <a
          v-for="n in range(lasThree, totalPages)"
          v-show="totalPages > 7"
          :key="n"
          href="#"
          aria-current="page"
          class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500"
          :class="{
            'border-t-2 px-2 z-10 text-primary-100 border-primary-100':
              n === pageTracker,
            'text-gray-300 pointer-events-none': props.disabled,
          }"
          @click="toggle(n)"
        >
          {{ n }}
        </a>
      </div>
      <div>
        <a
          href="#"
          class="relative inline-flex items-center py-2 text-sm font-medium text-gray-500 sm:px-2 hover:text-secondary-9"
          :class="
            pageTracker === totalPages || props.disabled
              ? 'text-gray-300 pointer-events-none'
              : ''
          "
          @click="
            next();
            forward();
          "
        >
          <span class="hidden mr-5 sm:block">Next</span>
          <Icon name="bi:arrow-right" />
          <!-- <ArrowLongRightIcon class="w-6 h-5" aria-hidden="true" /> -->
        </a>
      </div>
    </div>
    <div v-else class="flex flex-wrap justify-between mx-10">
      <div>
        <a
          href="#"
          class="relative inline-flex items-center px-2 py-2 mr-2 text-sm font-medium text-gray-300 pointer-events-none hover:bg-gray-50"
        >
          <Icon name="bi:arrow-left" />

          <!-- <ArrowLongLeftIcon class="w-5 h-5" aria-hidden="true" /> -->
          <span class="hidden ml-5 sm:block">Previous</span>
        </a>
      </div>
      <div>
        <a
          href="#"
          class="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-300 pointer-events-none hover:bg-gray-50"
        >
          <span class="hidden mr-5 sm:block">Next</span>
          <Icon name="bi:arrow-right" />
          <!-- <ArrowLongRightIcon class="w-5 h-5" aria-hidden="true" /> -->
        </a>
      </div>
    </div>
  </div>
</template>
