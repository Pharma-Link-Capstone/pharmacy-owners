<script setup>
import mutator_anonymous from "~/composables/apollo/mutator_anonymous";
import VerifyEmail from "~/graphql/auth/verify-email.gql";
import useNotify from "~/use/notify";

const { handleSubmit } = useForm();

const { notify } = useNotify();

const email = ref("");

const {
  mutate: verifyEmail,
  onDone: onVerifyEmailDone,
  loading,
  onError,
} = mutator_anonymous(VerifyEmail);

const onSubmit = handleSubmit((values) => {
  verifyEmail({
    email: values?.email,
    reset_url:
      "http://localhost:3000/verify-email/success?verified=true&email=" +
      values?.email,
  });
});

onVerifyEmailDone(({ data }) => {
  notify({
    title: "Email Sent",
    description:
      "We have sent you an email to verify your email. Please check your email.",
    cardClass: "bg-green-100",
  });

  router.push("/verify-email/success?email=" + email.value);
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

const router = useRouter();
const route = useRoute();
</script>

<template>
  <div class="">
    <div
      class="flex items-center h-16 cursor-pointer gap-x-6 shrink-0"
      @click="$router.push('/')"
    >
      <img
        class="object-contain w-[70px] pl-2 pt-6 h-auto"
        src="/images/pharmalink-logo.png"
        alt="Your Company"
      />
    </div>
    <div class="grid w-full grid-cols-2 gap-20">
      <div class="mt-20">
        <nuxt-link
          to="/login"
          class="flex items-center mb-6 space-x-1 text-gray-950"
        >
          <Icon name="ion:chevron-back" class="text-2xl" />
          <span>Back to login</span>
        </nuxt-link>
        <form @submit.prevent="onSubmit" class="max-w-[500px] space-y-12">
          <h1 class="text-4xl poppins-bold text-gray-950">Verify your email</h1>
          <p class="mt-4">
            Please enter the email address you used to sign up for PharmaLink.
            We will send you an email with a link to verify your account.
          </p>

          <div class="mt-6">
            <P-Textfield
              placeholder="Email"
              field-class="!py-3 pl-12 bg-primary-50 !border-0 shadow-md rounded-2xl"
              class=""
              v-model="email"
              name="email"
              rules="required|email"
            >
              <template #leading>
                <Icon
                  class="absolute w-5 h-5 text-xl text-gray-400 -translate-y-1/2 top-1/2 left-4"
                  name="lucide:mail"
                ></Icon>
              </template>
            </P-Textfield>
          </div>

          <div class="mt-10">
            <button class="w-full py-3 text-white rounded-md bg-primary-600">
              <span v-if="!loading">Verify email</span>
              <Icon v-else name="eos-icons:bubble-loading" />
            </button>
          </div>
        </form>
      </div>
      <div>
        <img
          src="/images/lock.png"
          class="object-cover max-h-[700px] pb-6"
          alt="lock image"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
