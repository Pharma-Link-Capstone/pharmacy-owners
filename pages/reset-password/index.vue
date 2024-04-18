<script setup>
definePageMeta({
  layout: "auth",
});
</script>

<template>
  <div class="">
    <div class="">
      <h2 class="text-3xl text-left pb-4 text-[#313131]">Pharma Link</h2>
    </div>
    <div class="w-full h- grid grid-cols-2 gap-20">
      <div class="pt-6">
        <button class="flex items-center space-x-1 mb-6">
          <Icon name="ion:chevron-back" class="text-2xl" />
          <span>Back to login</span>
        </button>
        <form @submit.prevent class="max-w-[500px] space-y-10">
          <h1 class="text-4xl poppins-bold">Forgot your password?</h1>
          <p class="mt-4">
            Don’t worry, happens to all of us. Enter your email below to recover
            your password
          </p>

          <div class="mt-6">
            <P-Textfield
              placeholder="Email"
              field-class="!py-3 pl-12 bg-gray-50 rounded-2xl"
              class=""
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
            <button class="w-full py-3 text-white rounded bg-primary-600">
              Verify email
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
