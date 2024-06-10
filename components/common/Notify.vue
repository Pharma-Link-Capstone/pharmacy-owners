<script setup>
import { format, parseISO } from "date-fns";

const router = useRouter();

const emit = defineEmits(["deleteNotification", "close"]);
const props = defineProps({
  userNotification: {
    type: Object,
    required: false,
  },
});

/**--------------------Notification Type Data---------------- */
const notificationsTypes = ref([
  {
    id: "NEW_PHARMACY",
    icon: "healthicons:pharmacy-outline",
  },

  {
    id: "PHARMACY_REPORT",
    icon: "ph:flag",
  },
]);

const handleClick = () => {
  if (
    props.userNotification?.notification?.notification_type ==
    "PHARMACY_VERIFICATION"
  ) {
    if (props.userNotification?.notification?.item_id) {
      emit("close");
      router.push(`/app/pharmacy-profile/`);
    }
  }
};

const notificationType = computed(() => {
  return notificationsTypes.value?.find(
    (item) =>
      item?.id === props.userNotification?.notification?.notification_type
  );
});
</script>

<style scoped></style>

<template>
  <div
    @click="handleClick"
    :class="{
      'bg-primary-100 dark:bg-primary-dark-600': !userNotification?.is_seen,
      ' shadow rounded-xl dark:bg-primary-dark-950': userNotification?.is_seen,
    }"
    class="flex flex-col w-full px-3 py-2 mb-2 dark:text-white gap-y-4 hover:cursor-pointer"
  >
    <div class="flex items-center justify-between w-full overflow-y-auto">
      <div class="flex items-center w-full gap-2">
        <Icon
          name="lucide:badge-check"
          width="23"
          height="23"
          class="text-haze-600"
          v-if="
            userNotification?.notification?.subject == 'Pharmacy Verification'
          "
        />
        <Icon
          width="23"
          height="23"
          class="text-haze-600"
          name="mynaui:message"
          v-else
        />
        <h1 class="font-normal capitalize text-md font-poppins">
          {{ userNotification?.notification?.subject }}
        </h1>
      </div>

      <button @click="emit('deleteNotification', userNotification.id)">
        <Icon
          name="material-symbols:close"
          width="25"
          height="25"
          color="gray-900"
        />
      </button>
    </div>

    <p
      class="text-sm font-light text-gray-700 capitalize dark:text-white font-poppins"
    >
      {{ userNotification.notification?.body }}
    </p>

    <div class="text-gray-700 dark:text-white">
      {{
        format(
          parseISO(userNotification.notification?.created_at),
          "dd MMM, yyyy"
        )
      }}
    </div>
  </div>
</template>
