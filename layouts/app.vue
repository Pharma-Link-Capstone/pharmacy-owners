<script setup>
import RefreshToken from "@/graphql/auth/refresh_token_mutation.gql";
import FetchPharmacies from "@/graphql/pharmacy/fetch_multiple_query.gql";
import lists from "~/composables/apollo/lists";

import mutator from "~/composables/apollo/mutator";
import { useAuthStore } from "~/stores/auth";
import useNotify from "~/use/notify";

const { notify } = useNotify();

const {
  mutate: refreshToken,
  loading: refreshTokenLoading,
  onDone: onRefreshTokenDone,
} = mutator(RefreshToken);

const router = useRouter();

const { userRoles, setToken, user, setUser, setPhID } = useAuthStore();

const { onLogin } = useApollo();

const isPharmacist = computed(() => userRoles?.includes("pharmacist"));

const isSuspended = ref(false);

const showWarning = ref(true);

watch(
  isPharmacist,
  (value) => {
    showWarning.value = !value;
  },
  { immediate: true }
);

onMounted(() => {
  console.log("App layout mounted", isPharmacist.value);
  if (!isPharmacist.value) {
    refreshToken();
  }
});

onRefreshTokenDone(({ data }) => {
  setToken(data?.refreshToken?.token);
  onLogin(data?.refreshToken?.token, "authenticated");
  setUser(data?.refreshToken?.user);
});

/*--- Fetch Pharmacies ---*/
const pharmacyFilter = computed(() => {
  return {
    user: {
      id: { _eq: user?.id },
    },
  };
});

const role = computed(() => {
  if (userRoles.includes("pharmacist")) {
    return "pharmacist";
  }
  return "user";
});

const {
  onResult: onFetchPharmaciesResult,
  loading: fetchPharmaciesLoading,
  onError: onFetchPharmaciesError,
} = lists(FetchPharmacies, {
  filter: pharmacyFilter,
  role,
});

onFetchPharmaciesResult(({ data }) => {
  if (data?.pharmacies.length === 0) {
    return router.push("/login");
  }

  if (data?.pharmacies[0]?.status == "SUSPENDED") {
    isSuspended.value = true;
    showWarning.value = true;
    notify({
      title: "Account Suspended",
      description: "Your account has been suspended. Please contact the admin.",
      cardClass: "bg-red-200",
    });
  }

  localStorage.setItem("PhID", data?.pharmacies[0]?.id);

  setPhID(data?.pharmacies[0]?.id);
});

onFetchPharmaciesError((error) => {
  console.log("Fetch Pharmacies Error", error);
});
</script>
<template>
  <main
    class="grid h-screen grid-cols-12 overflow-y-hidden bg-primary-50 dark:bg-primary-dark-950"
  >
    <div
      class="hidden bg-white dark:bg-primary-dark-900 xl:col-span-2 lg:col-span-3 lg:block"
    >
      <Navs-SideNav />
    </div>
    <div
      class="relative col-span-12 overflow-y-auto xl:col-span-10 lg:col-span-9"
    >
      <div class="w-full bg-white dark:bg-primary-dark-900">
        <Navs-TopNav />
      </div>
      <div class="p-5" v-if="!refreshTokenLoading && !fetchPharmaciesLoading">
        <p
          v-if="showWarning"
          class="flex items-center justify-between gap-3 px-5 py-2 mb-5 rounded-xl"
          :class="{
            'bg-red-200 dark:bg-red-500': isSuspended,
            'bg-yellow-200 dark:bg-yellow-500': !isPharmacist,
          }"
        >
          <span v-if="!isPharmacist">
            <icon name="material-symbols:warning" />
            Your pharmacy account is not yet activated. Please contact the admin
            to activate your account.
          </span>

          <span v-else-if="isSuspended">
            <icon name="material-symbols:warning" />
            Your pharmacy account has been suspended. Please contact the admin.
          </span>
          <button @click="showWarning = false" class="p-2 rounded-full">
            <icon name="material-symbols:close" />
          </button>
        </p>
        <slot />
      </div>
      <div
        class="flex items-center justify-center w-full h-full col-span-12 bg-white dark:bg-primary-dark-900 xl:col-span-10 lg:col-span-9"
        v-else
      >
        <P-Loader />
      </div>
    </div>
  </main>
</template>
