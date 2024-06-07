<script setup>
/*------------ Personal Information Form -----------*/
import { useAuthStore } from "@/stores/auth.js";
// import update from "@/API/mutation/Admin/update.gql";
// import Authorizar from "@/composables/mutation/Authorizar.js";
import useNotify from "@/use/notify";
const { notify } = useNotify();
const authStore = useAuthStore();
const { handleSubmit } = useForm({});
const firstName = ref("");
const middleName = ref("");
const lastName = ref("");
const imgUrl = ref("");
// firstName.value = authStore?.user?.given_name;
// middleName.value = authStore?.user?.middle_name;
// lastName.value = authStore?.user?.family_name;
// imgUrl.value = authStore?.user?.picture;
// console.log(authStore?.user);
// const {
//   mutate: updateProfile,
//   onDone: updateProfileDone,
//   onError: updateProfileError,
//   loading: updateProfileLoading,
// } = Authorizar(update, "Authorizer");

// updateProfileDone((result) => {
//   notify({
//     title: "You Successfully Update Your Information ",
//     type: "success",
//     borderClass: "border-l-8 border-green-300",
//   });
//   authStore.setProfilePicture(imgUrl.value);
// });
// updateProfileError((error) => {
//   notify({
//     title: "Some thing went wrong",
//     description: error.message,
//     type: "error",
//     borderClass: "border-l-8 border-red-400",
//   });
// });

// const handleProfileChange = handleSubmit(() => {
//   let params = {
//     // picture: item.value.profilePic,
//     // old_password: oldPassword.value,
//     // new_password: password.value,
//     // confirm_new_password: ConfirmPassword.value,
//     given_name: firstName.value,
//     middle_name: middleName.value,
//     family_name: lastName.value,
//     picture: imgUrl.value,
//   };
//   updateProfile({
//     params,
//   });
// });
</script>

<template>
  <div class="p-5">
    <h1 class="text-2xl text-black">Account Details</h1>

    <div class="mt-5">
      <div>
        <div class="flex items-center">
          <img
            class="object-cover w-20 h-20 rounded-full"
            src="https://placehold.co/600x400"
            alt=""
          />
          <div class="ml-5">
            <p class="text-sm font-light text-gray-600">Profile Picture</p>
            <button class="btn-primary !py-1 mt-3">Change</button>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-5 mt-5">
        <div>
          <p class="text-sm font-light text-gray-600">First Name</p>
          <p>Zerubabel</p>
        </div>
        <div>
          <p class="text-sm font-light text-gray-600">Last Name</p>
          <p>Yigzaw</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-5">
        <div>
          <p class="text-sm font-light text-gray-600">Email</p>
          <p>zerubabel@gmail.com</p>
        </div>
        <div>
          <p class="text-sm font-light text-gray-600">Phone Number</p>
          <p>0912345678</p>
        </div>
      </div>
    </div>
  </div>
</template>
