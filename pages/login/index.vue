<script setup></script>
<template>
  <div class="w-screen h-screen px-32 py-20 mx-auto max-w-screen-2xl">
    <div class="flex flex-col h-full">
      <div>
        <h1 class="text-4xl font-bold red-hat-display">Pharma Link</h1>
      </div>
      <div class="grid items-center flex-grow grid-cols-2 gap-20 mt-10">
        <div class="">
          <form @submit.prevent>
            <h1 class="text-4xl poppins-bold">Login</h1>
            <p class="mt-4 text-sm poppins-light">
              Login to access your PharmaLink account
            </p>

            <div class="mt-6">
              <P-Textfield
                placeholder="Email"
                field-class="!py-5 pl-12 bg-gray-50 rounded-2xl"
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

            <div class="mt-6">
              <P-Textfield
                placeholder="Password"
                type="password"
                field-class="!py-5 pl-12 bg-gray-50 rounded-2xl"
                name="password"
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

            <div class="flex items-center justify-between mt-6">
              <div>
                <input
                  type="checkbox"
                  name="remember"
                  id="remember"
                  class="rounded"
                />
                <label for="remember" class="ml-2">Remember me</label>
              </div>
              <nuxt-link to="/reset-password" class="text-[#FF8682]"
                >Forgot Password</nuxt-link
              >
            </div>

            <div class="mt-10">
              <button class="w-full py-3 text-white rounded bg-primary-600">
                Login
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

          <div class="mt-10">
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
          </div>
        </div>
        <div
          class="relative bg-[#d9d9d9] bg-opacity-70 rounded-3xl flex items-center flex-col aspect-[15/16] justify-center"
        >
          <img
            src="/images/illustrations/login.png"
            alt=""
            class="w-full h-full"
          />
          <div class="flex gap-1 py-3">
            <div class="w-5 h-2 rounded cursor-pointer bg-primary-600"></div>
            <div class="w-3 h-2 bg-gray-400 rounded cursor-pointer"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
