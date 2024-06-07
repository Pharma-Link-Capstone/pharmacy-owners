<script setup>
import FetchPharmacies from "@/graphql/pharmacy/fetch_multiple_query.gql";
import lists from "~/composables/apollo/lists";
import { useAuthStore } from "~/stores/auth";

const { user } = useAuthStore();

const pharmacyFilter = computed(() => {
  return {
    user: {
      id: { _eq: user?.id },
    },
  };
});

const { onResult: onFetchPharmaciesResult, loading: fetchPharmaciesLoading } =
  lists(FetchPharmacies, { filter: pharmacyFilter, role: ref("user") });

onFetchPharmaciesResult(({ data }) => {
  if (data?.pharmacies.length > 0) {
    return useRouter().replace("/app/");
  } else {
    return useRouter().replace("/pharmacy/create");
  }
});
</script>
<template>
  <div class="w-screen h-screen">
    <P-Loader />
  </div>
</template>
