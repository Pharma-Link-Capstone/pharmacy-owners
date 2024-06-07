<script setup>
/**------------------------ Imports---------------------*/
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";

import notificationListQUery from "@/graphql/notification/list.gql";
import lists from "~/composables/apollo/lists";
import seeNotificationMutation from "@/graphql/notification/seen.gql";
import deleteNotificationMutation from "@/graphql/notification/delete.gql";

import useRegisterDevice from "~/composables/register-device";
import mutator from "~/composables/apollo/mutator";
import useNotify from "~/use/notify";
import { useAuthStore } from "~/stores/auth";

const { notify } = useNotify();

const { userRoles } = useAuthStore();
/**--------------------------Globals---------------------- */
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);
const open = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
  },
});

/**--------------------------register device-------------------------- */
const { registerDevice } = useRegisterDevice();
registerDevice();

/* --------------------------- Fetch Notifications --------------------------- */
const notifications = ref([]);
const role = computed(() => {
  if (userRoles.value?.includes("pharmacist]")) {
    return "pharmacist";
  } else {
    return "user";
  }
});
const filter = ref({});
const {
  onResult,
  onError,
  refetch: notificationRefetch,
} = lists(notificationListQUery, {
  filter,
  role,
});
onResult((result) => {
  if (result.data?.notifications) {
    notifications.value = result.data?.notifications;
  }
});

onError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    cardClass: "bg-red-200",
  });
});

/**--------------------Seen notifications------------ */

const {
  mutate: seeNotification,
  onError: seenError,
  loading: seenLoading,
  onDone: seenDone,
} = mutator(seeNotificationMutation);
seenDone((result) => {
  notificationRefetch();
});
onError((error) => {});

const handleSee = (id) => {
  seeNotification();
};

/**--------------------Delete notifications------------ */

const {
  mutate: deleteNotification,
  onError: deleteError,
  loading: deleteLoading,
  onDone: deleteDone,
} = mutator(deleteNotificationMutation);
deleteDone((result) => {
  notificationRefetch();
});
deleteError((error) => {
  alert(error.message);
});

const handleDelete = (id) => {
  deleteNotification({
    id,
  });
};

const isSeen = computed(() => {
  !!notifications.value?.find((item) => !item?.is_seen);
});
</script>
<template>
  <div></div>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-50" @close="open = false">
      <TransitionChild
        as="template"
        enter="ease-in-out duration-500"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in-out duration-500"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
        />
      </TransitionChild>

      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div
            class="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none"
          >
            <TransitionChild
              as="template"
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enter-from="translate-x-full"
              enter-to="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leave-from="translate-x-0"
              leave-to="translate-x-full"
            >
              <DialogPanel class="relative pointer-events-auto max-w-7xl">
                <TransitionChild
                  as="template"
                  enter="ease-in-out duration-500"
                  enter-from="opacity-0"
                  enter-to="opacity-100"
                  leave="ease-in-out duration-500"
                  leave-from="opacity-100"
                  leave-to="opacity-0"
                >
                  <div
                    class="absolute flex pt-4 pr-2 -ml-8 left-5 top-64 xl:top-96 sm:-ml-10 sm:pr-4"
                  >
                    <button
                      type="button"
                      class="relative w-10 h-10 text-gray-300 rounded-full hover:text-white focus:outline-none focus:ring-2 bg-primary-500"
                      @click="open = false"
                    >
                      <span class="absolute -inset-1.5" />
                      <span class="sr-only">Close panel</span>
                      <Icon
                        name="ph:x"
                        color="white"
                        width="20"
                        height="20"
                        class="self-center"
                      ></Icon>
                    </button>
                  </div>
                </TransitionChild>
                <div
                  class="w-[24rem] h-screen py-4 px-2 overflow-y-auto bg-white"
                >
                  <div class="flex items-center justify-between px-2 mb-4">
                    <h1
                      class="font-medium text-lg leading-[35px] text-primary-600"
                    >
                      Notifications
                    </h1>

                    <button
                      class="disabled:text-gray-300"
                      :disabled="!isSeen"
                      @click="handleSee"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div
                    v-if="notifications.length > 0"
                    class="divide-y-2 divide-gray-100"
                  >
                    <CommonNotify
                      v-for="(userNotification, index) in notifications"
                      :user-notification="userNotification"
                      :key="index"
                      @delete-notification="handleDelete"
                    ></CommonNotify>
                  </div>
                  <div
                    v-if="notifications.length < 4"
                    class="flex-col justify-center w-full pt-64 my-auto"
                  >
                    <div class="flex justify-center m-auto my-auto">
                      <Icon
                        name="basil:notification-on-outline"
                        class="item-center h-[100px] w-[100px] text-primary-600"
                      >
                      </Icon>
                    </div>
                    <div class="flex justify-center m-auto my-auto">
                      <h1
                        class="item-center text-primary-600 text-md font-poppins"
                      >
                        No More Notifications
                      </h1>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
