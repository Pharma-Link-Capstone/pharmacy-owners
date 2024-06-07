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
    props.userNotification?.notification?.notification_type == "NEW_PHARMACY" ||
    props.userNotification?.notification?.notification_type == "PHARMACY_REPORT"
  ) {
    if (props.userNotification?.notification?.item_id) {
      emit("close");
      router.push(
        `/pharmacies/${props.userNotification?.notification?.item_id}`
      );
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
      'bg-primary-200': !userNotification?.is_seen,
    }"
    class="flex flex-col w-full p-2 mb-2 gap-y-4 hover:cursor-pointer"
  >
    <div class="flex items-center justify-between w-full overflow-y-auto">
      <div class="flex items-center w-full gap-2">
        <Icon
          :name="notificationType?.icon"
          width="23"
          height="23"
          color="gray-900"
        />
        <h1 class="pl-2 font-normal capitalize text-md font-poppins">
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

    <p class="text-sm font-light text-gray-700 capitalize font-poppins">
      {{ userNotification.notification?.body }}
    </p>

    <div class="text-gray-700">
      {{
        format(
          parseISO(userNotification.notification?.created_at),
          " HH:mm dd MMM yyyy"
        )
      }}
    </div>
  </div>
</template>
