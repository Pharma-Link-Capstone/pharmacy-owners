<script setup>
import update from "@/graphql/auth/update-profile.gql";
import { useAuthStore } from "@/stores/auth.js";
import useNotify from "@/use/notify";
import { storeToRefs } from "pinia";
import mutator from "~/composables/apollo/mutator";

const authStore = useAuthStore();
const { notify } = useNotify();
const { handleSubmit } = useForm({});
// const { user } = storeToRefs(authStore);
const item = ref({});
item.value.first = authStore?.user?.first_name;
item.value.last = authStore?.user?.last_name;

const {
  mutate: updateProfile,
  onDone: updateProfileDone,
  onError: updateProfileError,
  loading: updateProfileLoading,
} = mutator(update);
updateProfileDone((result) => {
  notify({
    title: "Successful",
    description: "You Successfully Update Your Information ",
    type: "success",
    cardClass: "bg-green-100",
  });

  let user = authStore.user;
  user.first_name = item.value?.first;
  user.last_name = item.value?.last;
  authStore.setUser(user);

  openEditModel.value = false;
});
updateProfileError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    cardClass: "bg-red-200",
  });
});

const openEditModel = ref(false);
const handleNameChange = handleSubmit(() => {
  let set = {
    first_name: item.value?.first,
    last_name: item.value?.last,
  };
  updateProfile({
    id: authStore.user?.id,
    set: {
      first_name: item.value?.first,
      last_name: item.value?.last,
    },
  });

  // alert(JSON.stringify(set));
});
</script>

<template>
  <P-Modal
    v-model="openEditModel"
    :auto-close="false"
    body-class="w-[600px] p-10 dark:!bg-primary-dark-900 dark:!text-gray-100"
  >
    <template #header>
      <div class="flex justify-between px-7 pt-7">
        <div class="flex gap-1">
          <h1
            class="text-xl font-medium text-black dark:text-white font-poppins"
          >
            Update profile
          </h1>
        </div>
        <button @click="openEditModel = false">
          <Icon
            name="ph:x"
            width="20"
            height="20"
            class="self-center dark:text-white"
          ></Icon>
        </button>
      </div>
    </template>
    <template #content>
      <div class="w-full py-4 px-7">
        <form action="" @submit.prevent="handleNameChange">
          <div class="flex-col w-full">
            <div class="w-full my-2">
              <PTextfield
                label="First Name"
                label-class="!mb-3 dark:text-white"
                rules="required"
                name="first"
                v-model="item.first"
                :mainDiv="'my-2 w-full'"
              />
            </div>
            <div class="my-2 col-span-full">
              <PTextfield
                rules="required"
                name="last"
                label="Last Name"
                label-class="!mb-3 dark:text-white"
                v-model="item.last"
                :mainDiv="'my-2'"
              />
            </div>
            <div class="mt-8">
              <button class="w-full py-3 text-white rounded bg-primary-600">
                <span v-if="!updateProfileLoading">Update</span>
                <Icon v-else name="eos-icons:bubble-loading" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </template>
  </P-Modal>
  <div
    class="w-[80%] flex-col bg-white dark:bg-primary-dark-900 justify-center items-center pl-2 rounded-md py-5"
  >
    <div class="flex items-center justify-between w-full p-5 bg-white-100">
      <h1
        class="pt-0 text-lg font-medium capitalize font-poppins dark:text-white"
      >
        personal information
      </h1>

      <button
        @click="openEditModel = true"
        type="button"
        class="border-[1px] rounded py-1 px-3 mr-10 dark:text-white"
      >
        <Icon
          name="ri:edit-line"
          width="20"
          height="20"
          class="self-center mr-1 text-primary-500 font-inter dark:text-white"
        ></Icon>
        Edit
      </button>
    </div>
    <div class="flex w-full justify-between pl-5 mb-2 max-w-[40rem]">
      <div class="flex flex-col gap-2">
        <h1
          class="pt-0 text-sm font-normal text-gray-600 capitalize dark:text-gray-100 font-poppins"
        >
          first name
        </h1>
        <h1
          class="pt-0 text-base font-normal capitalize font-poppins dark:text-white"
        >
          {{ item?.first }}
        </h1>
      </div>
      <div class="flex flex-col gap-2">
        <h1
          class="pt-0 text-sm font-normal text-gray-600 capitalize dark:text-gray-100 font-poppins"
        >
          last name
        </h1>
        <h1
          class="pt-0 text-base font-normal capitalize font-poppins dark:text-white"
        >
          {{ item?.last }}
        </h1>
      </div>
    </div>
  </div>
</template>
