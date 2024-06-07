<script setup>
const route = useRoute();
const router = useRouter();

const email = computed({
  get: () => route.query.email,
  set: (value) => {
    router.push({ query: { email: value } });
  },
});

const verifyEmail = () => {
  const email = document.getElementById("email").value;
  if (!email) {
    alert("Please enter your email address");
    return;
  }
  alert(`Email verification link has been sent to ${email}`);
};
</script>
<template>
  <div>
    <div class="">
      <div class="grid items-center grid-cols-2 gap-20 mt-10">
        <div class="">
          {{ email }}
        </div>
        <div
          class="relative bg-[#d9d9d9] bg-opacity-70 rounded-3xl flex items-center flex-col max-w-[50%] justify-center"
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
