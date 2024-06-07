<template>
  <div class="relative w-full">
    <input
      type="text"
      v-model="query"
      @input="onInput"
      @keydown.down="onArrowDown"
      @keydown.up="onArrowUp"
      @keydown.enter="onEnter"
      :placeholder="placeholder"
      class="w-full p-2 border border-gray-300 rounded"
    />
    <ul
      v-if="showSuggestions"
      class="absolute left-0 right-0 z-10 mt-2 overflow-y-auto bg-white border border-gray-300 rounded max-h-60"
    >
      <li
        v-for="(suggestion, index) in filteredSuggestions"
        :key="index"
        @click="selectSuggestion(suggestion)"
        :class="[
          'p-2 cursor-pointer',
          index === activeSuggestionIndex ? 'bg-gray-200' : '',
        ]"
      >
        {{ suggestion }}
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, computed } from "vue";

export default {
  props: {
    suggestions: {
      type: Array,
      required: true,
    },
    placeholder: {
      type: String,
      default: "Search...",
    },
  },
  setup(props, { emit }) {
    const query = ref("");
    const activeSuggestionIndex = ref(-1);
    const showSuggestions = ref(false);

    const filteredSuggestions = computed(() => {
      return props.suggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(query.value.toLowerCase())
      );
    });

    const onInput = () => {
      showSuggestions.value = true;
      activeSuggestionIndex.value = -1;
    };

    const onArrowDown = () => {
      if (activeSuggestionIndex.value < filteredSuggestions.value.length - 1) {
        activeSuggestionIndex.value++;
      }
    };

    const onArrowUp = () => {
      if (activeSuggestionIndex.value > 0) {
        activeSuggestionIndex.value--;
      }
    };

    const onEnter = () => {
      if (activeSuggestionIndex.value >= 0) {
        selectSuggestion(
          filteredSuggestions.value[activeSuggestionIndex.value]
        );
      }
    };

    const selectSuggestion = (suggestion) => {
      query.value = suggestion;
      showSuggestions.value = false;
      emit("input", query.value);
    };

    return {
      query,
      activeSuggestionIndex,
      showSuggestions,
      filteredSuggestions,
      onInput,
      onArrowDown,
      onArrowUp,
      onEnter,
      selectSuggestion,
    };
  },
};
</script>

<style scoped></style>
