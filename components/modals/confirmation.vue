<script setup>
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { sub } from "date-fns";

const emits = defineEmits(["update:modelValue", "confirm"]);
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  autoClose: {
    type: Boolean,
    default: true,
  },
  icon: {
    type: String,
    default: "ph:seal-check-fill",
  },
  iconWrapperClass: {
    type: String,
    default:
      "mx-auto flex h-12 w-12 flex-shrink-0 items-center text-green-600 justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10",
  },
  iconClass: {
    type: String,
    default: "h-8 w-8 text-green-600",
  },
  title: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  assuranceText: {
    type: String,
    default: "",
  },
  confirmButton: {
    type: String,
    default: "Confirm",
  },
  confirmButtonClass: {
    type: String,
    default:
      "inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto",
  },
  actionsClass: {
    type: String,
    default: "mt-5 sm:mt-4 sm:flex sm:flex-row-reverse",
  },
});

const open = computed({
  get() {
    return props.modelValue;
  },
  set(newVal) {
    emits("update:modelValue", newVal);
  },
});
</script>
<template>
  <ClientOnly>
    <TransitionRoot as="template" :show="open">
      <Dialog
        as="div"
        class="relative z-[200]"
        @close="autoClose ? (open = false) : ''"
      >
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div
            class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-20"
          />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div
            class="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0"
          >
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                class="relative px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl dark:bg-primary-dark-900 sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
              >
                <div class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                  <button
                    type="button"
                    class="text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-200 focus:ring-offset-1"
                    @click="open = false"
                  >
                    <span class="sr-only">Close</span>
                    <Icon
                      name="ion:close-outline"
                      width="25"
                      height="25"
                      class="w-6 h-6"
                    />
                  </button>
                </div>
                <div class="sm:flex sm:items-start">
                  <div :class="iconWrapperClass">
                    <Icon
                      :name="icon"
                      :class="iconClass"
                      width="35"
                      height="35"
                      aria-hidden="true"
                    />
                  </div>
                  <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle
                      as="h3"
                      class="text-xl font-semibold leading-6 text-gray-900 dark:text-white"
                      >{{ title }}</DialogTitle
                    >
                    <div class="mt-2" v-if="assuranceText">
                      <p
                        class="font-semibold text-gray-500 dark:text-white text-lh"
                      >
                        {{ assuranceText }}
                      </p>
                    </div>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500 dark:text-gray-100">
                        {{ description }}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  class="mt-5 sm:mt-8 sm:flex sm:flex-row-reverse"
                  :class="actionsClass"
                >
                  <button
                    type="button"
                    :class="confirmButtonClass"
                    @click="emits('confirm')"
                  >
                    {{ confirmButton }}
                  </button>
                  <button
                    type="button"
                    class="inline-flex justify-center w-full px-3 py-2 mt-3 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm hover:shadow-lg ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    @click="open = false"
                  >
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </ClientOnly>
</template>
