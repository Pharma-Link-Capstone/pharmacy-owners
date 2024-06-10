<template>
  <div class="flex flex-col items-center justify-center w-screen h-screen">
    <div class="flex flex-col items-center justify-center gap-3 min-h-[400px]">
      <NavsTopNav />
      <div class="flex flex-col items-center justify-center">
        <Icon
          name="ic:round-pending-actions"
          class="text-9xl text-primary-400"
        />
        <h1 class="mt-5 text-2xl font-bold text-center">
          Pending Verification
        </h1>
      </div>

      <p class="max-w-[60ch] text-center">
        Thank you for submitting your verification request! Your request is
        currently being reviewed by our team. Our team will verify your
        submitted information and will notify you with email.
      </p>
    </div>
  </div>
</template>
