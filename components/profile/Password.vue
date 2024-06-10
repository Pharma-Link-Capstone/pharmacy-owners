<script setup>
import useNotify from "@/use/notify";
import { useAuthStore } from "@/stores/auth.js";
import update from "@/graphql/auth/update-password.gql";
import mutator from "~/composables/apollo/mutator";

const authStore = useAuthStore();
const { notify } = useNotify();
const { handleSubmit, resetForm } = useForm({});

const currentPassword = ref();
const password = ref("");
const confirmPassword = ref("");

const {
  mutate: changePassword,
  onDone: changePasswordDone,
  onError: changePasswordError,
  loading: changePasswordLoading,
} = mutator(update);
changePasswordDone((result) => {
  notify({
    title: "Successful",
    description: "You Successfully Update Your Password ",
    type: "success",
    cardClass: "bg-green-100",
  });
  resetForm();
});
changePasswordError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
  });
});

const passwordChange = handleSubmit(() => {
  let credentials = {
    password: currentPassword.value,
    new_password: password.value,
  };
  changePassword({
    credentials,
  });
});
</script>
<template>
  <div>
    <form action="" @submit.prevent="passwordChange">
      <div
        class="w-[80%] flex bg-white dark:bg-primary-dark-900 justify-center pl-2 rounded-md"
      >
        <div
          class="w-[30%] flex-col bg-white-100 justify-between items-center p-5 mt-2"
        >
          <h1
            class="pt-0 text-lg font-medium capitalize font-poppins dark:text-white"
          >
            update password
          </h1>
          <h1
            class="pt-0 mt-2 text-xs font-normal text-gray-600 capitalize dark:text-gray-100 font-poppins"
          >
            update your password
          </h1>
        </div>
        <div class="flex-col justify-between w-full p-6">
          <div class="flex-col w-[50%]">
            <PTextfield
              type="password"
              :name="'oldPassword'"
              v-model="currentPassword"
              :trailingIcon="'mdi:eye-outline'"
              iconLeadingClass="pl-10"
              rules="required"
              fieldClass="pl-12"
            >
              <template v-slot:label>
                <div
                  class="text-sm mb-2 font-medium leading-[35px] text-secondary dark:text-white"
                >
                  Current Password
                </div>
              </template>
              <template v-slot:leading>
                <div class="absolute -translate-y-1/2 left-3 top-1/2">
                  <Icon
                    name="teenyicons:key-solid"
                    color="black"
                    class="w-5 h-5"
                  />
                </div>
              </template>
            </PTextfield>
          </div>
          <div class="flex-col w-[50%]">
            <PTextfield
              type="password"
              :name="'password'"
              v-model="password"
              :trailingIcon="'mdi:eye-outline'"
              iconLeadingClass="pl-10"
              class=""
              rules="required"
              placeholder=""
              fieldClass="pl-12"
            >
              <template v-slot:label>
                <div
                  class="text-sm mb-2 mt-2 font-medium leading-[35px] text-secondary dark:text-white"
                >
                  New Password
                </div>
              </template>
              <template v-slot:leading>
                <div class="absolute -translate-y-1/2 left-3 top-1/2">
                  <Icon
                    name="teenyicons:key-solid"
                    color="black"
                    class="w-5 h-5"
                  />
                </div>
              </template>
            </PTextfield>
          </div>
          <div class="flex-col w-[50%]">
            <PTextfield
              rules="required|password|confirmed:@password"
              type="password"
              :name="'ConfirmPassword'"
              v-model="confirmPassword"
              :trailingIcon="'mdi:eye-outline'"
              iconLeadingClass="pl-10"
              fieldClass="pl-12"
            >
              <template v-slot:label>
                <div
                  class="text-sm mb-2 mt-2 font-medium leading-[35px] text-secondary dark:text-white"
                >
                  Confirm Password
                </div>
              </template>
              <template v-slot:leading>
                <div class="absolute -translate-y-1/2 left-3 top-1/2">
                  <Icon
                    name="teenyicons:key-solid"
                    color="black"
                    class="w-5 h-5"
                  />
                </div>
              </template>
            </PTextfield>
          </div>

          <div class="w-1/2 mt-8">
            <button
              class="w-full py-3 text-white rounded min-h-[55px] bg-primary-600"
            >
              <span v-if="!changePasswordLoading">Update</span>
              <Icon v-else name="eos-icons:bubble-loading" />
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
