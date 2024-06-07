<script setup>
/*-------------------------Globals--------------------*/

const emit = defineEmits(["update:currentTabIndex"]);
const props = defineProps({
  tabs: {
    type: Array,
    default: () => [],
  },

  currentTabIndex: {
    type: Number,
    default: 0,
    required: false,
  },
});

/*............Tab ............*/
const selectedTab = ref(props.currentTabIndex);
const indicator = ref(null);
const indicatorContainer = ref(null);

function tabWidth() {
  const element = document.getElementById(`tab-${selectedTab.value}`);
  return element.offsetWidth;
}
function changeTab(index) {
  selectedTab.value = index;
  moveIndicator();
  emit("update:currentTabIndex", index);
}

const moveIndicator = () => {
  const element = document.getElementById(`tab-${selectedTab.value}`);
  const rect = element.getBoundingClientRect();
  const position = rect.left + window.pageXOffset;
  indicator.value.style.left = `${
    position - indicatorContainer.value.getBoundingClientRect().left
  }px`;
  indicator.value.style.width = `${tabWidth()}px`;
};

watch(
  () => props.currentTabIndex,
  (newValue) => {
    selectedTab.value = props.currentTabIndex;
    moveIndicator();
  }
);

onMounted(() => {
  setTimeout(() => {
    moveIndicator();
  }, 100);
});
</script>

<template>
  <ClientOnly>
    <HeadlessTabGroup :selectedIndex="selectedTab" @change="changeTab" as="div">
      <HeadlessTabList
        @scroll="moveIndicator"
        as="div"
        class="flex mt-5 space-x-4 overflow-x-auto iphone5:justify-between lg:justify-start scroll lg:space-x-16"
      >
        <HeadlessTab
          :id="`tab-${index}`"
          :class="[
            selectedTab === index
              ? 'text-primary-600 '
              : 'text-gray-400 dark:text-white',
            'outline-none focus:outline-none duration-500 ease-in-out leading-none  md:text-xl cursor-pointer whitespace-nowrap',
          ]"
          as="div"
          v-for="(tab, index) in tabs"
          :key="tab.value"
          >{{ tab.name }}</HeadlessTab
        >
      </HeadlessTabList>
      <div
        ref="indicatorContainer"
        class="relative w-full py-1 overflow-hidden border-b dark:border-sheger_brown-100 xl:py-2"
      >
        <div
          ref="indicator"
          class="absolute duration-200 left-0 bottom-0 h-0.5 bg-primary-600"
        ></div>
      </div>

      <HeadlessTabPanels as="div">
        <HeadlessTabPanel as="div" v-for="tab in tabs" :key="tab.value">
          <slot :name="tab.value"></slot>
        </HeadlessTabPanel>
      </HeadlessTabPanels>
    </HeadlessTabGroup>
  </ClientOnly>
</template>
