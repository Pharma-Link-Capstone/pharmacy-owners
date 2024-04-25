<script setup>
const emits = defineEmits(["update:modelValue", "confirm"]);
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  autoClose: {
    type: Boolean,
    default: true,
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
    <HeadlessTransitionRoot as="template" :show="open">
      <HeadlessDialog
        as="div"
        class="relative z-10"
        @close="autoClose ? (open = false) : ''"
      >
        <div class="fixed inset-0" />

        <div class="fixed inset-0 overflow-hidden">
          <div class="absolute inset-0 overflow-hidden">
            <div
              class="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none"
            >
              <HeadlessTransitionChild
                as="template"
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enter-from="translate-x-full"
                enter-to="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leave-from="translate-x-0"
                leave-to="translate-x-full"
              >
                <HeadlessDialogPanel
                  class="w-screen max-w-md pointer-events-auto"
                >
                  <div
                    class="flex flex-col h-full py-6 overflow-y-scroll bg-white shadow-xl"
                  >
                    <div class="px-4 sm:px-6">
                      <div class="flex items-start justify-between">
                        <HeadlessDialogTitle
                          as="h3"
                          class="flex-1 text-base font-semibold leading-6 text-gray-900"
                          ><slot name="heading" />
                        </HeadlessDialogTitle>
                        <div class="flex items-center ml-3 h-7">
                          <button
                            type="button"
                            class="relative text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
                            @click="open = false"
                          >
                            <span class="absolute -inset-2.5" />
                            <span class="sr-only">Close panel</span>
                            <Icon
                              name="iconamoon:close-light"
                              width="30"
                              height="30"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="relative flex-1 px-4 mt-6 sm:px-6">
                      <!-- Your content -->
                      <slot name="content" />
                    </div>
                  </div>
                </HeadlessDialogPanel>
              </HeadlessTransitionChild>
            </div>
          </div>
        </div>
      </HeadlessDialog>
    </HeadlessTransitionRoot>
  </ClientOnly>
</template>
