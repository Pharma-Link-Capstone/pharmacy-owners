<script setup>
import mutator_anonymous from "~/composables/apollo/mutator_anonymous";
import useNotify from "~/use/notify";

import LoginMutation from "~/graphql/auth/login_mutation.gql";
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  layout: "auth",
});

const router = useRouter();

const { notify } = useNotify();

const { onLogin } = useApollo();

const { setUser, setToken } = useAuthStore();

/*--------------- Define Variables -----------------*/
const email = ref("");
const password = ref("");
const remember = ref(false);

/*--------------- Login User -----------------*/
const {
  mutate: login,
  loading: loginLoading,
  onDone: onLoginDone,
  onError: onLoginError,
} = mutator_anonymous(LoginMutation);

const { handleSubmit } = useForm({});
const handleLogin = (values) => {
  login({
    credential: {
      email_or_phone_number: email.value,
      password: password.value,
    },
  });
};

onLoginDone(async ({ data }) => {
  try {
    await onLogin(data?.login?.token, "authenticated");
    setUser(data?.login?.user);
    setToken(data?.login?.token);
    notify({
      title: "Login Successful",
      description: "You have successfully logged in",
      cardClass: "bg-green-100",
    });

    router.replace("/loading");
  } catch (error) {
    notify({
      title: "Login Failed",
      description: "Invalid email or password",
      cardClass: "bg-red-100",
    });
  }
});

onLoginError((error) => {
  if (error.message.includes("Unverified")) {
    router.push("/signup/verify");
  } else {
    notify({
      title: "Login Failed",
      description: "Invalid email or password",
      cardClass: "bg-red-100",
    });
  }
});
</script>
<template>
  <div>
    <div class="flex flex-col h-full">
      <div class="grid items-center flex-grow grid-cols-2 gap-20 mt-10">
        <div class="">
          <form @submit.prevent="handleLogin" class="flex flex-col gap-6">
            <div>
              <div class="flex items-center">
                <img src="/images/pharmalink-logo.png" alt="" />
                <!-- <h1 class="text-4xl font-bold red-hat-display">Pharma Link</h1> -->
              </div>
              <h1 class="mt-10 text-4xl poppins-bold">Login</h1>
              <p class="mt-4 text-sm poppins-light">
                Login to access your PharmaLink account
              </p>
            </div>
            <div class="flex flex-col gap-5">
              <div>
                <P-Textfield
                  placeholder="Email"
                  field-class="!py-5 pl-12 max-h-14 bg-gray-50 rounded-2xl"
                  name="email"
                  rules="required|email"
                  v-model="email"
                >
                  <template #leading>
                    <Icon
                      class="absolute w-5 h-5 text-xl text-gray-400 -translate-y-1/2 top-1/2 left-4"
                      name="lucide:mail"
                    ></Icon>
                  </template>
                </P-Textfield>
              </div>

              <div>
                <P-Textfield
                  placeholder="Password"
                  type="password"
                  field-class="!py-5 pl-12 max-h-12 bg-gray-50 rounded-2xl"
                  name="password"
                  rules="required|password"
                  v-model="password"
                >
                  <template #leading>
                    <Icon
                      class="absolute w-5 h-5 text-xl text-gray-400 -translate-y-1/2 top-1/2 left-4"
                      name="material-symbols:password"
                    ></Icon>
                  </template>
                </P-Textfield>
              </div>

              <div class="flex items-center justify-between">
                <div></div>
                <nuxt-link to="/reset-password" class="text-[#FF8682]"
                  >Forgot Password</nuxt-link
                >
              </div>
            </div>

            <div>
              <button
                class="flex items-center justify-center w-full gap-2 py-3 text-white rounded bg-primary-600"
              >
                Login
                <Icon
                  v-if="loginLoading"
                  name="mingcute:loading-3-fill"
                  class="text-xl animate-spin"
                ></Icon>
              </button>
            </div>

            <div>
              <p class="mt-4 text-center">
                Don’t have an account?
                <nuxt-link to="/signup" class="text-[#FF8682]"
                  >Sign up</nuxt-link
                >
              </p>
            </div>
          </form>

          <!-- <div class="mt-10">
            <p class="text-center">Or login with</p>
            <div class="grid grid-cols-2 mt-10">
              <button
                class="flex items-center justify-center py-3 border rounded-full w-f3ll border-primary-300"
              >
                <Icon name="logos:google-icon" class="text-3xl"></Icon>
              </button>
              <button
                class="flex items-center justify-center w-full py-3 ml-5 border rounded-full border-primary-300"
              >
                <Icon name="logos:facebook" class="text-3xl"></Icon>
              </button>
            </div>
          </div> -->
        </div>
        <div
          class="relative bg-[#d9d9d9] bg-opacity-70 rounded-3xl flex items-center flex-col aspect-[15/16] justify-center"
        >
          <img
            src="/images/illustrations/login.png"
            alt=""
            class="w-full h-full"
          />
        </div>
      </div>
    </div>
  </div>
</template>
