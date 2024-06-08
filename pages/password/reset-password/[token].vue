<script setup>
import { email } from "@vee-validate/rules";
import mutator_anonymous from "~/composables/apollo/mutator_anonymous";
import ResetPassword from "~/graphql/auth/reset-password.gql";
import useNotify from "@/use/notify";

const { handleSubmit } = useForm();

const { notify } = useNotify();

const router = useRouter();
const route = useRoute();

const { token } = route.params;

const {
  mutate: resetPassword,
  onDone: onResetPasswordDone,
  loading,
  onError,
} = mutator_anonymous(ResetPassword);

const onSubmit = handleSubmit((values) => {
  resetPassword({
    credentials: {
      password: values?.new_password,
      reset_password_by_email_token: token,
    },
  });
});

onResetPasswordDone(({ data }) => {
  notify({
    title: "Password reset",
    description: "You have successfully reset your password",
    cardClass: "bg-green-200",
  });

  router.push("/");
});
onError((error) => {
  notify({
    title: "Some Went wrong",
    description: error.message,
    cardClass: "bg-red-200",
  });
});

definePageMeta({
  layout: "auth",
});
</script>

<template>
  <div class="">
    <div
      class="flex items-center h-16 cursor-pointer gap-x-6 shrink-0"
      @click="$router.push('/')"
    >
      <img
        class="object-contain w-[70px] pl-2 pt-6 h-auto"
        src="/images/logo.svg"
        alt="Your Company"
      />
    </div>
    <div class="grid w-full grid-cols-2 gap-20 mt-8">
      <div class="mt-16">
        <form @submit.prevent="onSubmit" class="max-w-[500px] space-y-8">
          <h1 class="text-4xl poppins-bold text-gray-950">Set a password</h1>
          <p class="mt-4">
            Your previous password has been reset. Please set a new password for
            your account.
          </p>

          <div class="mt-6">
            <P-Textfield
              placeholder="New Password"
              field-class="!py-3 pl-12 bg-gray-50 rounded-2xl"
              class=""
              type="password"
              name="new_password"
              rules="required|password"
            >
              <template #leading>
                <Icon
                  class="absolute w-5 h-5 text-xl text-gray-400 -translate-y-1/2 top-1/2 left-4"
                  name="material-symbols:password"
                ></Icon>
              </template>
            </P-Textfield>
          </div>

          <div class="mt-3">
            <P-Textfield
              placeholder="Re-enter Password"
              field-class="!py-3 pl-12 bg-gray-50 rounded-2xl"
              class=""
              type="password"
              name="confirm_password"
              rules="required|password"
            >
              <template #leading>
                <Icon
                  class="absolute w-5 h-5 text-xl text-gray-400 -translate-y-1/2 top-1/2 left-4"
                  name="material-symbols:password"
                ></Icon>
              </template>
            </P-Textfield>
          </div>

          <div class="mt-10">
            <button class="w-full py-3 text-white rounded bg-primary-600">
              Set password
            </button>
          </div>
        </form>
      </div>
      <div>
        <img
          src="/images/temp/lock3.png"
          class="object-cover max-h-[700px] pb-6"
          alt="lock image"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
