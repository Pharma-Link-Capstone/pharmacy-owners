<template>
  <div class="w-screen h-screen px-32 py-20 mx-auto max-w-screen-2xl">
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
        <div class="">
          <form @submit.prevent>
            <h1 class="text-4xl poppins-regular !font-bold">Sign up</h1>
            <p class="mt-3 text-sm poppins-light">
              Let’s get you all set up so you can access your personal account.
            </p>

            <div class="mt-6">
              <P-Textfield
                placeholder="Pharmacy Name"
                field-class="!py-5 bg-gray-50 rounded-2xl"
                rules="required"
              >
              </P-Textfield>
            </div>
            <div class="grid grid-cols-2 gap-5 mt-5">
              <P-Textfield
                placeholder="Email"
                field-class="!py-5 pl-12 bg-gray-50 rounded-2xl"
                rules="required|email"
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
                field-class="!py-5 pl-12 bg-gray-50 rounded-2xl"
                rules="required|ethio_phone"
              >
                <template #leading>
                  <Icon
                    class="absolute w-6 h-6 text-gray-400 -translate-y-1/2 top-1/2 left-2.5 text-xl"
                    name="lucide:phone"
                  ></Icon>
                </template>
              </P-Textfield>
            </div>
            <div class="mt-5">
              <P-Textfield
                placeholder="Password"
                type="password"
                field-class="!py-5 pl-12 bg-gray-50 rounded-2xl"
                rules="required|password"
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
                field-class="!py-5 pl-12 bg-gray-50 rounded-2xl"
                rules="required|password"
              >
                <template #leading>
                  <Icon
                    class="absolute w-6 h-6 text-gray-400 -translate-y-1/2 top-1/2 left-2.5 text-xl"
                    name="material-symbols:password"
                  ></Icon>
                </template>
              </P-Textfield>
            </div>

            <div class="flex items-center justify-between">
              <P-CheckBox
                label="I agree to all the Terms and Privacy Policies"
                class="text-sm"
              ></P-CheckBox>
            </div>

            <div class="mt-5">
              <button class="w-full py-3 text-white rounded bg-primary-600">
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

          <div class="mt-5">
            <p class="text-center">Or signup with</p>
            <div class="grid grid-cols-2 mt-5">
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
      </div>
    </div>
  </div>
</template>
