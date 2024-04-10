<script setup>
const isChecked = ref(false);

const selectedItems = ref([]);
const items = ref([
  {
    name: "Selamu Dawit",
    id: "1",
    image:
      "https://media.istockphoto.com/id/466807030/photo/closeup-profile-of-business-woman-looking-forward.jpg?s=612x612&w=0&k=20&c=ob9EqIH1ZCZphVO78NdNoypd12S7UT_cwwBJotKwlxg=",
  },

  {
    name: "Yonatan Tesfaye",
    id: "2",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQix0aJcHrZfDqlr0N-xaLne6C5Il5-57DIUw&usqp=CAU",
  },
  {
    name: "Zerubabel Kasahun",
    id: "3",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRC8kiSH5ZSAcVoj3tAQQDoP_ux0sSricMyUg&usqp=CAU",
  },

  {
    name: "Samuel Noah",
    id: "4",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHxzM_e4qVtnPZttfPhbjcPssC78WndotRPg&usqp=CAU",
  },
]);

const itemsToShow = ref(items.value);

const search = ref("");
function searchItems(value) {
  search.value = value;
  itemsToShow.value = items.value.filter((item) =>
    item.name.toLowerCase().includes(value.toLowerCase())
  );
}
</script>
<template>
  <div class="my-10 max-w-sm mx-auto">
    <!-- <AListsSingleSelectWithSearch
      :items="itemsToShow"
      @search="searchItems"
      name="age"
      v-model="selectedItems"
      label="Selamu"
      placeholder="Select type"
      list-container-class=""
      rules="required"
    >
      <template v-slot:row="{ item }">
        <div class="flex items-center space-x-3">
          <img
            :src="item.image"
            :alt="item.name + 'image'"
            class="w-10 h-10 rounded-full object-cover object-right"
          />
          <p>{{ item.name }}</p>
        </div>
      </template>
      <template v-slot:header="{ item }">
        <div class="flex items-center space-x-3">
          <img
            :src="item.image"
            :alt="item.name + 'image'"
            class="w-10 h-10 rounded-full object-cover object-right"
          />
          <p>{{ item.name }}</p>
        </div>
      </template>
    </AListsSingleSelectWithSearch> -->

    <AListsMultiSelectWithSearch
      :items="itemsToShow"
      @search="searchItems"
      name="age"
      v-model="selectedItems"
      label="Selamu"
      placeholder="Select type"
      list-container-class=""
    >
      <template v-slot:row="{ item }">
        <div class="flex items-center space-x-3">
          <img
            :src="item.image"
            alt=""
            class="w-10 h-10 rounded-full object-cover object-right"
          />
          <p>{{ item.name }}</p>
        </div>
      </template>
      <template v-slot:header="{ selectedItemsList }">
        <div
          class="text-gray-700 flex items-center gap-x-2 overflow-x-scroll scroll w-full"
        >
          <div
            v-for="item in selectedItemsList"
            :key="item.id"
            class="py-1 px-2 border bg-blue-300 rounded-full flex items-center gap-x-2 self-start min-w-[10rem]"
          >
            <div class="flex items-center gap-x-2">
              <img
                :src="item.image"
                alt=""
                class="w-6 h-6 rounded-full object-cover object-right"
              />
              <p class="whitespace-nowrap self-start">{{ item.name }}</p>
            </div>

            <button @click="removeItem($event, item)" class="bg-red-400">
              <Icon name="gg:close" color="gray" class="text-xl" />
            </button>
          </div>
        </div>
        <!-- <div class="flex items-center space-x-3">
          <img
            :src="item.image"
            alt=""
            class="w-10 h-10 rounded-full object-cover object-right"
          />
          <p>{{ item.name }}</p>
        </div> -->
      </template>
    </AListsMultiSelectWithSearch>
  </div>
</template>
