<script setup>
import mutator_anonymous from "~/composables/apollo/mutator_anonymous";
import VerifyEmail from "~/graphql/auth/verify-email.gql";
import UsersQuery from "~/graphql/auth/users-query.gql";
import useNotify from "~/use/notify";

definePageMeta({
  layout: "auth",
});

import { useRouter, useRoute } from "vue-router";
import lists from "~/composables/apollo/lists";

const router = useRouter();
const route = useRoute();
const email = computed(() => route?.query.email);

const { notify } = useNotify();

if (!route?.query?.email) {
  router.go(-1);
}

const {
  mutate: verifyEmail,
  onDone: onVerifyEmailDone,
  loading,
  onError,
} = mutator_anonymous(VerifyEmail);

const handleResend = () => {
  verifyEmail({
    email: email.value,
    reset_url:
      "http://localhost:3000/verify-email/success?verified=true&email=" +
      email.value,
  });
};

onVerifyEmailDone(({ data }) => {
  notify({
    title: "Email Sent",
    description:
      "We have sent you an email to verify your email. Please check your email.",
    cardClass: "bg-green-100",
  });

  currentTimeInSeconds.value = 60;

  const interval = setInterval(() => {
    currentTimeInSeconds.value = currentTimeInSeconds.value - 1;
    localStorage.setItem("currentTimeInSeconds", currentTimeInSeconds.value);
  }, 1000);
  setTimeout(() => {
    clearInterval(interval);
  }, 60000);
});

onError((error) => {
  notify({
    title: "Some Went wrong",
    description: error.message,
    cardClass: "bg-red-200",
  });
});

const currentTimeInSeconds = ref(
  localStorage.getItem("currentTimeInSeconds") || 60
);

const interval = setInterval(() => {
  currentTimeInSeconds.value = currentTimeInSeconds.value - 1;
  localStorage.setItem("currentTimeInSeconds", currentTimeInSeconds.value);
}, 1000);

setTimeout(() => {
  clearInterval(interval);
}, currentTimeInSeconds.value * 1000);

/*--------------- Check  -----------------*/
const filter = computed(() => {
  return {
    email: {
      _eq: email.value,
    },
  };
});
const { onResult, refetch } = lists(UsersQuery, {
  filter,
});

const refetchInterval = setInterval(() => {
  refetch();
}, 1000);

onResult(({ data }) => {
  if (data?.users?.length > 0 && data?.users[0]?.status == "ACTIVE") {
    clearInterval(refetchInterval);

    notify({
      title: "Email Verified",
      description: "Your email has been verified successfully.",
      cardClass: "bg-green-100",
    });

    router.push("/login");
  }
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
        src="/images/pharmalink-logo.png"
        alt="Your Company"
      />
    </div>
    <div class="grid w-full grid-cols-2 gap-20">
      <div class="mt-20">
        <button
          @click="$router.go(-1)"
          class="flex items-center mb-6 space-x-1 text-gray-950"
        >
          <Icon name="ion:chevron-back" class="text-2xl" />
          <span>Goto login</span>
        </button>

        <div
          class="flex flex-col items-center h-full gap-6 mt-16"
          v-if="!loading"
        >
          <div class="flex items-center justify-center">
            <Icon name="lucide:mail" class="text-6xl text-primary-600" />
          </div>
          <div>
            <h1 class="text-3xl font-bold text-center">Check your email</h1>
            <p class="mt-3 text-base text-center text-haze-700">
              We have send an instruction on how to verify your email to
              <span class="font-bold">
                {{ email }}
              </span>
            </p>
          </div>

          <div>
            <p class="mt-4 text-center">
              Didn't receive a email?
              <button
                @click="handleResend"
                class="text-primary-600"
                :disabled="currentTimeInSeconds > 0"
                :class="{
                  'cursor-not-allowed !text-gray-900 font-bold':
                    currentTimeInSeconds > 0,
                }"
              >
                Resend
              </button>
            </p>

            <p class="mt-4 text-center text-haze-700">
              Resend in
              <span class="font-bold" :key="currentTimeInSeconds">
                {{ currentTimeInSeconds }}
              </span>
              seconds
            </p>
          </div>
        </div>

        <div class="flex items-center justify-center h-full" v-else>
          <P-Loader />
        </div>
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
