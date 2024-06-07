<script setup>
definePageMeta({
  layout: "auth",
});
</script>
<template>
  <div>
    <div class="flex flex-col h-full">
      <div>
        <h1 class="text-4xl font-bold text-right red-hat-display">
          Pharma Link
        </h1>
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
          <div class="flex gap-1 py-3">
            <div class="w-5 h-2 rounded cursor-pointer bg-primary-600"></div>
            <div class="w-3 h-2 bg-gray-400 rounded cursor-pointer"></div>
          </div>
        </div>

        <div class="flex flex-col gap-5">
          <div class="flex flex-col gap-2">
            <h1 class="text-3xl font-bold">Verify Your Email</h1>
            <p class="text-gray-500">
              We have sent a verification link to your email address. Please
              click on the link to verify your email address.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
