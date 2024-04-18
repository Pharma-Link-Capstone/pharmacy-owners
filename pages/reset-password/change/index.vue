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
        <form @submit.prevent class="max-w-[500px] space-y-10">
          <h1 class="text-4xl poppins-bold">Set a password</h1>
          <p class="mt-4">
            Your previous password has been reseted. Please set a new password
            for your account.
          </p>

          <div class="mt-6">
            <P-Textfield
              placeholder="New Password"
              field-class="!py-3 pl-12 bg-gray-50 rounded-2xl"
              class=""
              type="password"
            >
              <template #leading>
                <Icon
                  class="absolute w-5 h-5 text-xl text-gray-400 -translate-y-1/2 top-1/2 left-4"
                  name="material-symbols:password"
                ></Icon>
              </template>
              <template #trailing>
                <Icon
                  class="absolute w-5 h-5 text-xl text-gray-400 -translate-y-1/2 top-1/2 right-4 cursor-pointer"
                  name="mdi:eye-off-outline"
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
            >
              <template #leading>
                <Icon
                  class="absolute w-5 h-5 text-xl text-gray-400 -translate-y-1/2 top-1/2 left-4"
                  name="material-symbols:password"
                ></Icon>
              </template>
              <template #trailing>
                <Icon
                  class="absolute w-5 h-5 text-xl text-gray-400 -translate-y-1/2 top-1/2 right-4 cursor-pointer"
                  name="mdi:eye-off-outline"
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
          src="/images/lock3.png"
          class="object-cover max-h-[700px] pb-6"
          alt="lock image"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
