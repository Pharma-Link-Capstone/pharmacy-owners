<script setup>
import { appNavigation } from "@/helper/data/navigation";
import { useAuthStore } from "~/stores/auth";

const router = useRouter();

const { $reset } = useAuthStore();

const { onLogout } = useApollo();

const currentPath = computed(() => router.currentRoute.value.path);

const openConfirmationModal = ref(false);

const changeColorPreference = (preference) => {
  useColorMode().value = preference;
  useColorMode().preference = preference;
};

const handleLogout = () => {
  onLogout("authenticated");
  $reset();
  localStorage.removeItem("PhID");
  router.push("/login");
  setTimeout(() => {
    changeColorPreference("light");
  }, 1000);
};
</script>
<template>
  <Modals-confirmation
    v-model="openConfirmationModal"
    :assurance-text="'Are you sure you want to logout?'"
    description="You will be logged out of the system. Do you want to continue?"
    icon="ri:logout-circle-r-line"
    icon-class="rotate-90 text-haze-600"
    title="Logout"
    actions-class="!justify-between"
    iconWrapperClass="mx-auto flex h-12 w-12 flex-shrink-0 items-center text-red-600 justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
    confirm-button-class="inline-flex justify-center w-full px-3 py-2 text-sm font-semibold text-white bg-red-600 rounded-md shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
    @confirm="handleLogout"
  ></Modals-confirmation>

  <div class="flex flex-col justify-between w-full h-full px-10 py-5">
    <div>
      <div>
        <nuxt-link to="/app" class="flex items-center justify-center">
          <img src="/images/pharmalink-logo.png" alt="Pharmalink logo" />
        </nuxt-link>
      </div>
      <nav class="flex flex-col gap-5 mt-10">
        <nuxt-link
          v-for="(nav, index) in appNavigation"
          :key="index"
          class="flex items-center w-full gap-5 px-5 py-2 text-xl transition-all ease-in-out rounded-md text-gray-950 dark:text-white hover:bg-primary-600 hover:dark:bg-primary-600 hover:text-white"
          :class="[
            currentPath.includes(nav.path) && nav.name != 'Dashboard'
              ? 'bg-primary-600 text-white dark:!text-white'
              : '',
          ]"
          exact-active-class="text-white dark:!text-white bg-primary-600"
          :to="nav.path"
        >
          <Icon :name="nav.icon" class="text-xl" />
          <p>{{ nav.name }}</p>
        </nuxt-link>
      </nav>
    </div>
    <div class="mb-16">
      <button
        class="flex items-center justify-start w-full gap-3 px-5 mt-8 text-xl dark:text-white"
        @click="openConfirmationModal = true"
      >
        <Icon name="mdi:logout" class="text-xl" />
        <p>Logout</p>
      </button>
    </div>
  </div>
</template>
