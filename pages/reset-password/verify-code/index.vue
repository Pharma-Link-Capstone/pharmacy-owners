<script setup>
definePageMeta({
  layout: "auth",
});

const { handleSubmit } = useForm();

const onSubmit = handleSubmit(() => {
  useRouter().push("/reset-password/change");
});
</script>

<template>
  <div class="">
    <div class="">
      <h2 class="text-3xl text-left pb-4 text-[#313131]">Pharma Link</h2>
    </div>
    <div class="grid w-full grid-cols-2 gap-20 h-">
      <div class="pt-6">
        <button class="flex items-center mb-6 space-x-1">
          <Icon name="ion:chevron-back" class="text-2xl" />
          <span>Back to login</span>
        </button>
        <form @submit.prevent="onSubmit" class="max-w-[500px]">
          <h1 class="text-4xl poppins-bold">Verify code</h1>
          <p class="mt-2">
            An authentication code has been sent to your email.
          </p>

          <div class="mt-6">
            <P-Textfield
              placeholder="Enter Code"
              field-class="!py-3 pl-12 bg-gray-50 rounded-2xl"
              class=""
              rules="required|numberFromZero"
              name="code"
            >
              <template #leading>
                <Icon
                  class="absolute w-5 h-5 text-xl text-gray-400 -translate-y-1/2 top-1/2 left-4"
                  name="f7:number"
                ></Icon>
              </template>
            </P-Textfield>
          </div>

          <div class="mt-10">
            <button class="w-full py-3 text-white rounded bg-primary-600">
              Verify code
            </button>
          </div>
          <div>
            <p class="mt-4 text-center">
              Didn't receive a code?
              <button to="/reset-password/resend" class="text-[#FF8682]">
                Resend
              </button>
            </p>
          </div>
        </form>
      </div>
      <div>
        <img
          src="/images/lock2.png"
          class="object-cover max-h-[700px] pb-6"
          alt="lock image"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
