<script setup>
import { useRouter } from "vue-router";
import { appNavigation } from "~/helper/data/navigation";

const router = useRouter();
const route = useRoute();

const crumbs = computed(() => {
  const paths = route.path.split("/").filter((path) => path);
  return paths.map((path, index) => {
    const formattedPath = path.replace(/-/g, " ");
    return {
      name: formattedPath.charAt(0).toUpperCase() + formattedPath.slice(1),
      path: `/${paths.slice(0, index + 1).join("/")}`,
    };
  });
});
</script>
<template>
  <div>
    <nav aria-label="breadcrumb">
      <ol class="flex items-center">
        <li
          v-for="(crumb, index) in crumbs"
          :key="index"
          class="flex items-center"
        >
          <nuxt-link to="/" v-if="index === 0">
            <button class="cursor-pointer">
              <Icon name="fontisto:nav-icon-grid-a" class="text-sm" />
            </button>
          </nuxt-link>
          <nuxt-link v-else :to="crumb.path">{{ crumb.name }}</nuxt-link>
          <span v-if="index < crumbs.length - 1" class="mx-2.5"> / </span>
        </li>
      </ol>
    </nav>
  </div>
</template>
