<script setup>
import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/vue";

import { appNavigation } from "~/helper/data/navigation";
import { useAuthStore } from "~/stores/auth";

const router = useRouter();

const { user, $reset } = useAuthStore();

const { onLogout } = useApollo();

const currentPath = computed(() => router.currentRoute.value.path);

const currentNav = computed(() => {
  return appNavigation.find((nav) => currentPath.value.includes(nav.path));
});

const colorPreference = computed(() => {
  return useColorMode().preference;
});

const changeColorPreference = (preference) => {
  useColorMode().value = preference;
  useColorMode().preference = preference;
};

const openConfirmationModal = ref(false);

const handleLogout = () => {
  onLogout("authenticated");
  $reset();
  localStorage.removeItem("PhID");
  router.push("/login");
};

const entryOption = ref([
  {
    text: "Inventory",
    value: "inventory",
  },
  {
    text: "Sales",
    value: "sales",
  },
]);

const entry = ref(entryOption.value[0]);

const { handleSubmit } = useForm({});

const searchTerm = ref("");
const handleSearch = handleSubmit((values) => {
  if (entry.value.value === "inventory") {
    router.push("/app/inventory?q=" + searchTerm.value);
  } else if (entry.value.value === "sales") {
    router.push("/app/sales?q=" + searchTerm.value);
  }
});

const openNotification = ref(false);
</script>
<template>
  <!-- ---------------Notification--------------- -->

  <!-- <CommonNotification
    v-if="openNotification"
    v-model="openNotification"
  ></CommonNotification> -->

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

  <div class="flex items-center justify-between w-full h-full px-5">
    <div class="flex items-center text-sm font-medium text-gray-400 gap-x-2">
      <button class="cursor-pointer">
        <Icon name="fontisto:nav-icon-grid-a" class="text-sm" />
      </button>
      <span>/</span>
      <button class="cursor-pointer">{{ currentNav.name }}</button>
    </div>
    <div class="py-2.5 px-8 rounded-full flex items-center gap-x-4">
      <form @submit.prevent="handleSearch" class="relative">
        <input
          type="text"
          class="rounded-3xl py-2.5 pl-14 bg-primary-50 dark:bg-primary-dark-800 border-none focus:border-transparent outline-none dark:text-gray-100 text-gray-950 w-full"
          placeholder="Search"
          name="searchTop"
          v-model="searchTerm"
        />
        <button
          class="absolute -translate-y-1/2 cursor-pointer text-gray-950 dark:text-gray-100 left-4 top-1/2"
        >
          <Icon
            class="text-2xl"
            name="iconamoon:search"
            @click="handleSearch"
          />
        </button>
        <div class="absolute z-50 right-1.5 -translate-y-1/2 top-1/2">
          <Menu as="div" class="relative">
            <MenuButton
              class="flex items-center px-5 py-1.5 cursor-pointer gap-x-3 text-gray-950 dark:text-gray-100 bg-primary-100 dark:bg-primary-dark-900 rounded-3xl"
            >
              {{ entry.text }}
              <Icon class="text-2xl" name="iconamoon:arrow-down-2-light"
            /></MenuButton>
            <MenuItems
              class="absolute z-30 flex flex-col w-full mt-1 overflow-hidden bg-white shadow dark:bg-primary-dark-900 dark:text-white rounded-xl"
            >
              <MenuItem
                v-for="(entryP, index) in entryOption"
                :key="index"
                class="hover:bg-gray-50 dark:hover:bg-primary-dark-700 py-1.5 px-3"
                @click="(_) => (entry = entryP)"
              >
                <button type="button" class="w-full text-left">
                  {{ entryP.text }}
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      </form>
      <div
        class="relative flex items-center gap-x-3 text-gray-950 dark:text-gray-400"
      >
        <button class="relative z-50" @click="openNotification = true">
          <Icon name="humbleicons:bell" class="text-2xl cursor-pointer" />
          <!-- <span
          v-show="unSeedLength > 0"
          class="absolute z-50 text-sm font-medium text-red-600 rounded-full left-4 bottom-2 -right-1"
          >{{ unSeedLength }}</span
        > -->
        </button>

        <Popover class="relative">
          <PopoverButton
            class="!border-none focus:border-none focus:outline-none w-full"
          >
            <button class="w-full">
              <Icon
                :name="
                  colorPreference == 'dark'
                    ? 'ic:sharp-mode-night'
                    : colorPreference == 'light'
                    ? 'ic:sharp-light-mode'
                    : 'material-symbols:computer-outline'
                "
                class="text-2xl cursor-pointer"
              />
              <Icon class="text-2xl" name="iconamoon:arrow-down-2-light" />
            </button>
          </PopoverButton>

          <PopoverPanel
            class="absolute right-0 z-50 p-2 mt-3 bg-white shadow w- dark:bg-primary-dark-900 rounded-3xl"
          >
            <div class="flex flex-col gap-2">
              <button
                @click="(_) => changeColorPreference('light')"
                class="flex items-center gap-x-1 hover:dark:bg-primary-dark-800 hover:dark:text-gray-100 w-full hover:bg-primary-50 rounded-xl py-0.5 px-1 text-gray-950 dark:text-gray-400"
              >
                <Icon
                  name="ic:sharp-light-mode"
                  class="text-2xl cursor-pointer"
                />
                Light</button
              ><button
                @click="(_) => changeColorPreference('dark')"
                class="flex items-center gap-x-1 hover:dark:bg-primary-dark-800 hover:dark:text-gray-100 w-full hover:bg-primary-50 rounded-xl py-0.5 px-1 text-gray-950 dark:text-gray-400"
              >
                <Icon
                  name="ic:sharp-mode-night"
                  class="text-2xl cursor-pointer"
                />
                Dark</button
              ><button
                @click="(_) => changeColorPreference('system')"
                class="flex items-center gap-x-1 hover:dark:bg-primary-dark-800 hover:dark:text-gray-100 w-full hover:bg-primary-50 rounded-xl py-0.5 px-1 text-gray-950 dark:text-gray-400"
              >
                <Icon
                  name="material-symbols:computer-outline"
                  class="text-2xl cursor-pointer"
                />
                System
              </button>
            </div>
          </PopoverPanel>
        </Popover>
      </div>
      <div>
        <Menu as="div" class="relative">
          <MenuButton
            class="flex items-center pr-5 cursor-pointer gap-x-3 text-gray-950 dark:text-gray-100 bg-primary-50 dark:bg-primary-dark-800 rounded-3xl"
          >
            <img
              :src="user?.media?.url"
              class="object-cover w-12 h-12 rounded-full"
              alt="" />
            <p class="hidden text-lg whitespace-nowrap lg:block">
              {{ user?.first_name }} {{ user?.last_name }}
            </p>
            <Icon class="text-2xl" name="iconamoon:arrow-down-2-light"
          /></MenuButton>
          <MenuItems
            class="absolute z-20 flex flex-col w-full px-5 py-3 mt-2 bg-white rounded-3xl dark:bg-primary-dark-900 dark:text-white"
          >
            <MenuItem v-slot="{ active }">
              <nuxt-link
                :class="{ 'bg-primary-50 dark:bg-primary-dark-700': active }"
                to="/app/settings"
                class="px-3 py-2 text-left rounded-3xl"
              >
                <Icon name="ic:round-settings" class="mr-2 text-xl" />
                Profile & Privacy
              </nuxt-link>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <button
                :class="{ 'bg-primary-50 dark:bg-primary-dark-700': active }"
                class="px-3 py-2 text-left rounded-3xl"
                @click="openConfirmationModal = true"
              >
                <Icon name="ic:round-logout" class="mr-2 text-xl" />
                Logout
              </button>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </div>
  </div>
</template>
