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

const router = useRouter();

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
</script>
<template>
  <div class="flex items-center justify-between w-full h-full px-5">
    <div class="flex items-center text-sm font-medium text-gray-400 gap-x-2">
      <button class="cursor-pointer">
        <Icon name="fontisto:nav-icon-grid-a" class="text-sm" />
      </button>
      <span>/</span>
      <button class="cursor-pointer">{{ currentNav.name }}</button>
    </div>
    <div class="py-2.5 px-8 rounded-full flex items-center gap-x-4">
      <div class="relative">
        <input
          type="text"
          class="rounded-3xl py-2.5 pl-14 bg-primary-50 dark:bg-primary-dark-800 border-none focus:border-transparent outline-none dark:text-gray-100 text-gray-950 w-72"
          placeholder="Search"
        />
        <Icon
          class="absolute text-2xl -translate-y-1/2 text-gray-950 dark:text-gray-100 left-4 top-1/2"
          name="iconamoon:search"
        />
      </div>
      <div
        class="relative flex items-center gap-x-3 text-gray-950 dark:text-gray-400"
      >
        <Icon name="humbleicons:bell" class="text-2xl cursor-pointer" />
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
              src="/images/temp/profile.jpg"
              class="object-cover w-12 h-12 rounded-full"
              alt="" />
            <p class="hidden text-lg whitespace-nowrap lg:block">
              Grace Pharmacy
            </p>
            <Icon class="text-2xl" name="iconamoon:arrow-down-2-light"
          /></MenuButton>
          <MenuItems
            class="absolute flex flex-col w-full px-5 py-3 mt-2 bg-white rounded-3xl"
          >
            <MenuItem v-slot="{ active }">
              <nuxt-link
                :class="{ 'bg-primary-50': active }"
                to="/settings"
                class="px-3 py-2 text-left rounded-3xl"
              >
                <Icon name="ic:round-settings" class="mr-2 text-xl" />
                Profile & Privacy
              </nuxt-link>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <button
                :class="{ 'bg-primary-50': active }"
                class="px-3 py-2 text-left rounded-3xl"
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
