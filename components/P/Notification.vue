<script setup>
import useNotify from "@/use/notify";
const { dismiss, notification } = useNotify();
</script>

<template>
  <!-- Global notification live region, render this permanently at the end of the document -->

  <div
    aria-live="assertive"
    class="z-[100] fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start"
  >
    <div class="flex flex-col items-center w-full space-y-4 sm:items-end">
      <!-- Notification panel, dynamically insert this into the live region when it needs to be displayed -->
      <transition
        enter-active-class="transition duration-300 ease-out transform"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="notification && notification.state"
          class="w-full max-w-sm overflow-hidden pointer-events-auto ring-1 ring-black ring-opacity-5"
          :class="notification.cardClass || 'bg-white  shadow-lg rounded-lg'"
        >
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0" v-if="notification.icon">
                <component
                  class=""
                  :class="notification.iconClass || 'h-5 w-5 text-gray-400'"
                  :is="notification.icon"
                ></component>
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p
                  class=""
                  :class="
                    notification.titleClass ||
                    'text-gray-900 text-sm font-medium '
                  "
                >
                  {{ notification.title }}
                </p>
                <p
                  class="mt-1"
                  :class="
                    notification.descriptionClass || 'text-gray-500 text-sm '
                  "
                >
                  {{ notification.description }}
                </p>
              </div>
              <div class="flex flex-shrink-0 ml-4">
                <button
                  @click="dismiss"
                  class="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  :class="
                    notification.closeButtonClass ||
                    'bg-white text-gray-400 hover:text-gray-500'
                  "
                >
                  <span class="sr-only">Close</span>
                  <Icon name="ic:round-close" class="text-xl"></Icon>
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
