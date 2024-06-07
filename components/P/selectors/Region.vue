<script setup>
import RegionQuery from "~/graphql/basic/region_query.gql";
import lists from "~/composables/apollo/lists_anonymous";

const props = defineProps({
  modelValue: {
    type: [String, Object],
    required: true,
  },
  label: {
    type: String,
    default: "",
  },
  rules: {
    type: [String, Array, Object],
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  id: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  labelClass: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const { value: inputValue, errorMessage } = useField(props.name, props.rules, {
  initialValue: props.modelValue,
});

watch(
  () => props.modelValue,
  (value) => {
    inputValue.value = value;
  }
);

watch(
  () => inputValue.value,
  (value) => {
    emit("update:modelValue", value);
  }
);

/*--------------- Fetch Region -----------------*/
const regionOptions = ref([]);
const search = ref("");
const limit = ref(10);

const filter = computed(() => {
  return {
    _and: [
      {
        name: {
          _ilike: `%${search.value}%`,
        },
      },
    ],
  };
});
const { onResult, onError, loading } = lists(RegionQuery, { filter, limit });

onResult((result) => {
  regionOptions.value = result.data?.regions;
});
</script>
<template>
  <div :class="[wrapperClass]">
    <P-Lists-SingleSelectWithSearch
      v-model="inputValue"
      :items="regionOptions"
      :name="props.name"
      :id="props.id"
      placeholder="Select a region"
      :rules="rules"
      :disabled="props.disabled"
      :class="[inputClass]"
    >
      <template #label>
        <label for="regions" class="flex mb-2">{{ label }}</label>
      </template>
    </P-Lists-SingleSelectWithSearch>
  </div>
</template>
