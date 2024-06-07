<script setup>
import update from "@/graphql/auth/update-profile.gql";
import addMedia from "@/graphql/file/insert_one_media.gql";

import { useAuthStore } from "@/stores/auth.js";
import useNotify from "@/use/notify";
import mutator from "~/composables/apollo/mutator";

const authStore = useAuthStore();
const { notify } = useNotify();

const imageUrls = ref(authStore?.user?.media?.url);

/**--------------------------Add Media--------------------------- */

const {
  mutate: addMediaMutate,
  onDone: mediaDone,
  onError: mediaError,
  loading: mediaLoading,
} = mutator(addMedia);
mediaDone(({ data }) => {
  // call update profile
  updateProfile({
    id: authStore.user?.id,
    set: {
      profile_picture_id: data.new_media?.id,
    },
  });
});
mediaError((error) => {
  notify({
    title: "Media Error",
    description: error.message,
    type: "error",
    cardClass: "bg-red-200",
  });
});

const handleAddMedia = (media) => {
  addMediaMutate({
    input: {
      url: media,
    },
  });
};

const {
  mutate: updateProfile,
  onDone: updateProfileDone,
  onError: updateProfileError,
  loading: updateProfileLoading,
} = mutator(update);
updateProfileDone((result) => {
  notify({
    title: "You Successfully Update Your Information ",
    description: result.data?.message,
    type: "success",
  });
  authStore.user.media.url = imageUrls.value;
});
updateProfileError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    cardClass: "bg-red-200",
  });
});
</script>

<template>
  <div
    class="w-[80%] flex-col bg-white dark:bg-primary-dark-900 justify-center items-center my-3 pl-2 rounded-md py-5"
  >
    <div
      class="relative flex-col items-center justify-center w-full h-full p-5 bg-white-100"
    >
      <div
        class="relative flex-col items-center justify-center w-full h-full bg-white-100 p-"
      >
        <div
          class="relative flex-col items-center justify-center w-full h-full bg-white-100 p-"
        >
          <div>
            <div class="flex items-center gap-x-1">
              <CommonUploadNew
                folder=""
                rules="required"
                name="profilePicture"
                accept="image/*"
                @upload="handleAddMedia"
                v-model:model-value="imageUrls"
                image-class="!w-24 !h-24"
              ></CommonUploadNew>
              <div class="space-y-2">
                <p class="text-base font-medium dark:text-white">
                  Upload Profile Picture
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-100">
                  Select a picture that is max(10MB)
                </p>
              </div>
            </div>
          </div>

          <!-- <h1 class="pt-2 text-lg font-medium capitalize font-poppins"> -->
          <!-- {{ item.first }} {{ item.last }} {{ item.family }} -->
          <!-- </h1> -->
        </div>
      </div>
    </div>
  </div>
</template>
