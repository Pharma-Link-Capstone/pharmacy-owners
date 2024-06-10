<script setup>
import RegistrationMutation from "@/graphql/auth/signup_mutation.gql";

import anonymousMutator from "@/composables/apollo/mutator_anonymous";

definePageMeta({
  layout: "auth",
});

const router = useRouter();

/*--------------- Register User -----------------*/
const userData = ref({});

const {
  mutate: register,
  loading: registerLoading,
  onDone: onRegisterDone,
  onError: onRegisterError,
} = anonymousMutator(RegistrationMutation);

const { handleSubmit } = useForm();

const onSubmit = handleSubmit((values) => {
  console.log("values", values);
  register({
    data: {
      first_name: userData.value.first_name,
      last_name: userData.value.last_name,
      email: userData.value.email,
      phone_number: userData.value.phone_number,
      sex: userData.value.sex,
      birth_date: new Date(userData.value.birth_date)?.toISOString(),
      password: userData.value.password,
      registered_with: "",
      redirect_url:
        "http://localhost:3000/verify-email/success?email=" +
        userData.value.email,
    },
  });
});

onRegisterDone(({ data }) => {
  router.push("/verify-email/success?email=" + userData.value.email);
});

onRegisterError((error) => {});

// Computed property to 18 years ago
const eighteenYearsAgo = computed(() => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 18);
  return date.toISOString().split("T")[0];
});
</script>

<template>
  <div>
    <div class="flex flex-col h-full">
      <div class="flex items-center justify-end">
        <img src="/images/pharmalink-logo.png" alt="" class="w-20" />
      </div>
      <div class="grid items-center flex-grow grid-cols-2 gap-20 mt-10">
        <div
          class="relative bg-[#d9d9d9] bg-opacity-70 rounded-3xl flex items-center flex-col aspect-[15/16] justify-center"
        >
          <img
            src="/images/illustrations/signup.png"
            alt=""
            class="w-full h-full"
          />
        </div>
        <div class="">
          <form @submit.prevent="onSubmit">
            <h1 class="text-4xl poppins-regular !font-bold">Sign up</h1>
            <p class="mt-3 text-sm poppins-light">
              Let’s get you all set up so you can access your personal account.
            </p>

            <div class="grid grid-cols-2 gap-5 mt-6">
              <P-Textfield
                placeholder="First Name"
                field-class="!py-3 pl-12 rounded-2xl"
                rules="required"
                name="first_name"
                label-class="!mb-2 text-sm text-gray-400"
                label="First Name"
                v-model="userData.first_name"
              >
                <template #leading>
                  <Icon
                    class="absolute w-6 h-6 text-gray-400 -translate-y-1/2 top-1/2 left-2.5 text-xl"
                    name="lucide:user-round"
                  ></Icon>
                </template>
              </P-Textfield>
              <P-Textfield
                placeholder="Last Name"
                field-class="!py-3 pl-12 rounded-2xl"
                rules="required"
                name="last_name"
                label-class="!mb-2 text-sm text-gray-400"
                label="Last Name"
                v-model="userData.last_name"
              >
                <template #leading>
                  <Icon
                    class="absolute w-6 h-6 text-gray-400 -translate-y-1/2 top-1/2 left-2.5 text-xl"
                    name="lucide:user-round"
                  ></Icon>
                </template>
              </P-Textfield>
            </div>
            <div class="grid grid-cols-2 gap-5 mt-5">
              <P-Textfield
                placeholder="Email"
                field-class="!py-3 pl-12 rounded-2xl"
                rules="required|email"
                name="email"
                label-class="!mb-2 text-sm text-gray-400"
                label="Email Address"
                v-model="userData.email"
              >
                <template #leading>
                  <Icon
                    class="absolute w-6 h-6 text-gray-400 -translate-y-1/2 top-1/2 left-2.5 text-xl"
                    name="lucide:mail"
                  ></Icon>
                </template>
              </P-Textfield>
              <P-Textfield
                placeholder="Phone Number"
                field-class="!py-3 pl-12 rounded-2xl"
                rules="required|ethio_phone"
                name="phone_number"
                label-class="!mb-2 text-sm text-gray-400"
                label="Phone Number"
                v-model="userData.phone_number"
              >
                <template #leading>
                  <Icon
                    class="absolute w-6 h-6 text-gray-400 -translate-y-1/2 top-1/2 left-2.5 text-xl"
                    name="lucide:phone"
                  ></Icon>
                </template>
              </P-Textfield>
            </div>

            <div class="grid grid-cols-2 gap-5 mt-5">
              <div>
                <h3 class="text-sm text-gray-400">Gender</h3>
                <div class="flex items-center mt-2">
                  <P-Radio
                    name="sex"
                    rules="required"
                    label="Male"
                    v-model="userData.sex"
                    value="MALE"
                  >
                    <template #label>
                      <span class="ml-2 text-sm text-gray-400"> Male</span>
                    </template>
                  </P-Radio>
                  <P-Radio
                    name="sex"
                    rules="required"
                    label="Female"
                    v-model="userData.sex"
                    value="FEMALE"
                  >
                    <template #label>
                      <span class="ml-2 text-sm text-gray-400"> Female</span>
                    </template>
                  </P-Radio>
                </div>
              </div>
              <div>
                <P-DatePicker
                  name="birth_date"
                  class="text-sm text-gray-400"
                  label="Date Of Birth"
                  label-class="!mb-2 text-sm text-gray-400"
                  :rules="`required|maxDate:${eighteenYearsAgo}`"
                  customError="You must be 18 years or older to register"
                  v-model="userData.birth_date"
                />
              </div>
            </div>

            <div class="">
              <P-Textfield
                placeholder="Password"
                type="password"
                field-class="!py-3 pl-12 rounded-2xl"
                rules="required|password"
                name="password"
                label-class="!mb-2 text-sm text-gray-400"
                label="Password"
                v-model="userData.password"
              >
                <template #leading>
                  <Icon
                    class="absolute w-6 h-6 text-gray-400 -translate-y-1/2 top-1/2 left-2.5 text-xl"
                    name="material-symbols:password"
                  ></Icon>
                </template>
              </P-Textfield>
            </div>
            <div class="mt-5">
              <P-Textfield
                placeholder="Confirm Password"
                type="password"
                field-class="!py-3 pl-12 rounded-2xl"
                rules="required|password"
                name="confirm_password"
                label-class="!mb-2 text-sm text-gray-400"
                label="Confirm Password"
                v-model="userData.confirm_password"
              >
                <template #leading>
                  <Icon
                    class="absolute w-6 h-6 text-gray-400 -translate-y-1/2 top-1/2 left-2.5 text-xl"
                    name="material-symbols:password"
                  ></Icon>
                </template>
              </P-Textfield>
            </div>

            <!-- <div class="flex items-center justify-between">
              <P-CheckBox
                name="terms"
                label-class="!mb-2 text-sm text-gray-400"
                label="I agree to all the Terms and Privacy Policies"
                class="text-sm"
                v-model="userData.terms"
              ></P-CheckBox>
            </div> -->

            <div class="mt-5">
              <button
                class="flex items-center justify-center w-full gap-2 py-3 text-white rounded-md bg-primary-600"
                :disabled="registerLoading"
              >
                <Icon
                  v-if="registerLoading"
                  name="mingcute:loading-3-fill"
                  class="text-xl animate-spin"
                ></Icon>
                Create an account
              </button>
            </div>

            <div>
              <p class="mt-3 text-center">
                Already have an account?
                <nuxt-link to="/login" class="text-[#FF8682]">Login</nuxt-link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
