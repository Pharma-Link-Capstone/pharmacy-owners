<script setup>
import InsertPlace from "@/graphql/pharmacy/insert-one-mutation.gql";
import mutator from "~/composables/apollo/mutator";

definePageMeta({
  layout: "default",
});

const steps = ref([
  "Basic Pharmacy Information",
  "Contact Information",
  "License",
]);

const pharmacy = ref({
  logo_url: [],
});

const currentStepIndex = ref(0);

const next = () => {
  if (currentStepIndex.value === steps.value.length - 1) {
    alert("Finish");
    return;
  }
  currentStepIndex.value += 1;
};

/*---------------- Form Submission ----------------*/
const {
  mutate: insertPlaceMutation,
  loading: insertPlaceLoading,
  onDone: onInsertPlaceDOne,
} = mutator(InsertPlace);

const onSubmit = () => {
  insertPlaceMutation({
    object: {
      name: pharmacy.value.name,
      description: pharmacy.value.description,
      logo_url: pharmacy.value.logo_url[0],
      location: pharmacy.value.location,
      socials: pharmacy.value.socials,
      license: pharmacy.value.license[0],
    },
  });
};
</script>
<template>
  <div class="w-full h-full">
    <div
      class="w-full max-w-[950px] mx-auto mt-20 shadow border rounded-2xl py-5"
    >
      <div class="flex flex-col items-center gap-3">
        <img src="/images/pharmalink-logo.png" alt="" />
        <h1 class="text-3xl">Set Up Profile</h1>
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
                class="w-[50px] aspect-square h-[50px] rounded-full border-2 border-gray-600 flex items-center justify-center font-bold text-2xl"
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
              <div>
                <p class="text-sm">STEP</p>
                <p class="text-base">{{ step }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- FOrm -->
        <div class="mt-10">
          <Pharmacy-Form-BasicInfo
            v-model="pharmacy"
            v-if="currentStepIndex == 0"
            @next="next"
          />
          <Pharmacy-Form-ContactInfo
            v-if="currentStepIndex == 1"
            @next="next"
            @prev="() => (currentStepIndex -= 1)"
            v-model="pharmacy"
          />
          <Pharmacy-Form-License
            v-if="currentStepIndex == 2"
            @finish="next"
            @prev="() => (currentStepIndex -= 1)"
            v-model="pharmacy"
          />
        </div>
      </div>
    </div>
  </div>
</template>
