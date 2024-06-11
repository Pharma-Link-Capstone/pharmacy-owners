<script setup>
import FetchPharmacy from "@/graphql/pharmacy/fetch_one_query.gql";
import get_one from "~/composables/apollo/get_one";

import InsertPharmacy from "@/graphql/pharmacy/insert-one-mutation.gql";
import DeleteRelationship from "@/graphql/pharmacy/delete_relations.gql";
import mutator from "~/composables/apollo/mutator";
import useNotify from "~/use/notify";

definePageMeta({
  layout: "app",
});

const route = useRoute();
const router = useRouter();

const { notify } = useNotify();

const PhID = computed(() => localStorage.getItem("PhID"));

/*------------------- Fetch Pharmacy by ID ---------------------*/
const pharmacy = ref({});

const {
  onResult: onFetchPharmacyResult,
  loading: fetchPharmacyLoading,
  refetch: refetchPharmacy,
} = get_one(FetchPharmacy, PhID.value);

onFetchPharmacyResult(({ data }) => {
  console.log(data?.pharmacy?.location?.area?.id);
  pharmacy.value = {
    ...data?.pharmacy,
    logo_url: data?.pharmacy?.logo_url ? [data?.pharmacy?.logo_url] : [],
    cover_image: data?.pharmacy?.cover_image
      ? [data?.pharmacy?.cover_image]
      : [],
    license_url: data?.pharmacy?.license_url
      ? [data?.pharmacy?.license_url]
      : [],

    area: data?.pharmacy?.location?.area,

    location: {
      position: {
        lat: data?.pharmacy?.location?.location?.coordinates[1],
        lng: data?.pharmacy?.location?.location?.coordinates[0],
      },
    },
    region: data?.pharmacy?.location?.area?.city?.region,
    city: data?.pharmacy?.location?.area?.city,
    socials: data?.pharmacy?.pharmacy_social_medias?.map((social) => ({
      id: social?.social_media?.id,
      url: social?.url,
      name: social?.social_media?.name,
      icon_url: social?.social_media?.icon_url,
    })),
  };
});

/*-------------------------Step Management--------------------*/
const steps = ref([
  "Basic Pharmacy Information",
  "Contact Information",
  "License",
]);

if (!route.query.step) {
  router.replace({
    query: {
      step: steps.value[0],
    },
  });
}

const currentStepIndex = computed(() => {
  return steps.value.findIndex((step) => step === currentStep.value);
});

const currentStep = computed(() => route.query.step);

const next = () => {
  if (currentStepIndex.value === steps.value.length - 1) {
    alert("Finish");
    return;
  }
  router.replace({
    query: {
      step: steps.value[currentStepIndex.value + 1],
    },
  });
};

/*---------------- Form Submission ----------------*/
const {
  mutate: deleteRelationsMutation,
  loading: deleteRelationsLoading,
  onDone: onDeleteRelationsDone,
} = mutator(DeleteRelationship, "pharmacist");

const {
  mutate: insertPharmacyMutation,
  loading: insertPharmacyLoading,
  onDone: onInsertPharmacyDone,
} = mutator(InsertPharmacy, "pharmacist");

const onSubmit = () => {
  insertPharmacyMutation({
    object: {
      is_open: true,
      license_url: pharmacy.value?.license_url[0],
      location: {
        data: {
          area_id: pharmacy.value?.area?.id,
          location: {
            type: "Point",
            coordinates: [
              pharmacy.value?.location?.position?.lng,
              pharmacy.value?.location?.position?.lat,
            ],
          },
        },
      },
      logo_url: pharmacy.value?.logo_url[0],
      cover_image: pharmacy.value?.cover_image[0],
      name: pharmacy.value?.name,
      description: pharmacy.value?.description,
      phone_number_1: pharmacy.value?.phoneNumber,
      phone_number_2: pharmacy.value?.alternativePhoneNumber,
      pharmacy_social_medias: {
        data: pharmacy.value?.socials?.map((social) => ({
          social_media_id: social?.id,
          url: social?.url,
        })),
      },
    },
  });
};

onDeleteRelationsDone(() => {
  onSubmit();
});

onInsertPharmacyDone(() => {
  notify({
    title: "Success",
    description: "Pharmacy has been edited successfully",
    cardClass: "bg-green-100",
  });
  router.push("/app/pharmacy-profile");
});

const handleSubmission = () => {
  deleteRelationsMutation({
    id: PhID.value,
  });
};
</script>
<template>
  <div class="flex items-center justify-center w-full h-full">
    <div class="w-full py-5 bg-white dark:bg-primary-dark-900 rounded-2xl">
      <div class="flex gap-3 px-5">
        <h1 class="text-3xl dark:text-white">Edit Profile</h1>
      </div>
      <div class="px-5 mt-10">
        <!-- Stepper -->
        <div class="grid grid-cols-3 gap-10">
          <div v-for="(step, index) in steps" :key="index">
            <div
              class="w-full h-1"
              :class="
                currentStepIndex > index
                  ? 'bg-primary-600'
                  : currentStepIndex === index
                  ? 'bg-primary-200'
                  : 'bg-gray-200'
              "
            ></div>
            <div class="flex items-center gap-3 mt-3">
              <div
                class="w-[50px] aspect-square h-[50px] rounded-full border-2 border-gray-600 dark:text-white flex items-center justify-center font-bold text-2xl"
                :class="
                  currentStepIndex > index
                    ? 'text-primary-600 border-primary-600'
                    : currentStepIndex === index
                    ? 'text-primary-200 border-primary-200'
                    : ''
                "
              >
                0{{ index + 1 }}
              </div>
              <div class="dark:text-white">
                <p class="text-sm">STEP</p>
                <p class="text-base">{{ step }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Form -->
        <div class="mt-10 dark:text-white" v-if="!fetchPharmacyLoading">
          <Pharmacy-Form-BasicInfo
            v-model="pharmacy"
            v-if="currentStepIndex == 0"
            @next="next"
          />
          <Pharmacy-Form-ContactInfo
            v-if="currentStepIndex == 1"
            @next="next"
            @prev="
              () =>
                $router.replace({
                  query: { step: steps[currentStepIndex - 1] },
                })
            "
            v-model="pharmacy"
          />
          <Pharmacy-Form-License
            v-if="currentStepIndex == 2"
            @finish="handleSubmission"
            @prev="
              () =>
                $router.replace({
                  query: { step: steps[currentStepIndex - 1] },
                })
            "
            v-model="pharmacy"
          />
        </div>

        <div class="mt-10 h-full min-h-[300px] w-full" v-else>
          <P-Loader />
        </div>
      </div>
    </div>
  </div>
</template>
