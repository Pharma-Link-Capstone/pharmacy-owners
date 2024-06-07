<script setup>
const props = defineProps({
  headers: {
    type: Array,
  },
  hasRecordsPerPage: {
    type: Boolean,
  },
  hasDateFilter: {
    type: Boolean,
  },
  items: {
    type: Array,
  },
  //to store ids of checked items
  checkedItems: {
    type: Array,
    default: [],
  },
  checkedItemsData: {
    type: Array,
    default: [],
  },
  hasCheckBox: {
    type: Boolean,
    default: false,
  },
  rowStyle: {
    type: String,
    default: "",
  },
  rowHeadStyle: {
    type: String,
    default: "",
  },
  sort: {
    type: Array,
  },
  loading: {
    type: Boolean,
    default: true,
  },
  color1: String,
  color2: String,
  color3: String,
  supporterClass: {
    type: String,
  },
  supportHeaderClass: {
    type: String,
  },
  noItemClass: {
    type: String,
  },
  fullRowClass: {
    type: String,
  },
});

const emits = defineEmits([
  "click:row",
  "update:sort",
  "update:checkedItems",
  "update:checkedItemsData",
]);

const _get = useGet;
const _set = useSet;
const _sort = ref([]);
onMounted(() => {
  props.sort.forEach((item) => {
    _sort.value = { ..._sort.value, ...item };
  });
});

const checkCheckedAll = computed(() => {
  return (
    props.checkedItems?.length == props.items?.length && props.items?.length > 0
  );
});

function sort_by(header) {
  console.log("sort", _sort.value);
  if (header.sortable === false) return;

  let direction = _sort.value[header.value];
  if (direction && direction === "asc") {
    console.log("if one", _sort.value);
    _sort.value[header.value] = "desc";
  } else if (direction && direction === "desc") {
    console.log("if else", _sort.value);
    delete _sort.value[header.value];
  } else {
    console.log("else", _sort.value, header.value);
    _sort.value[header.value] = "asc";
  }

  let sort = [];
  console.log("before loop", _sort.value);
  Object.keys(_sort.value).forEach((key) => {
    let obj = {};
    console.log("sortloop", key, "and", _sort.value[key]);
    _set(obj, key, _sort.value[key]);
    console.log("obj", obj);
    sort.push(obj);
  });
  console.log("final ", sort);
  emits("update:sort", sort);
}

function rowChecked(item, id) {
  emits(
    "update:checkedItems",
    Array.isArray(props.checkedItems)
      ? props.checkedItems.includes(id)
        ? props.checkedItems.filter((_id) => id !== _id)
        : [...props.checkedItems, id]
      : [id]
  );
  emits(
    "update:checkedItemsData",
    Array.isArray(props.checkedItemsData)
      ? props.checkedItemsData?.map((e) => e?.id).includes(id)
        ? props.checkedItemsData.filter((_id) => id !== _id.id)
        : [...props.checkedItemsData, item]
      : [item]
  );
}

function rowCheckedAll() {
  emits(
    "update:checkedItems",
    props.checkedItems?.length == props.items?.length
      ? []
      : props.items.map((item) => item.id)
  );
  emits(
    "update:checkedItemsData",
    props.checkedItems?.length == props.items?.length
      ? []
      : props.items.map((item) => item)
  );
}
</script>

<template>
  <div class="h-[6px]"></div>
  <!-- component -->
  <div
    :class="supporterClass"
    class="relative border sm:rounded-lg border-table-border"
  >
    <P-Progress
      v-if="loading"
      height="h-[6px]"
      :color1="color1"
      :color2="color2"
      :color3="color3"
    />
    <table
      class="w-full font-body"
      :class="[items?.length ? 'divide-y divide-secondary-4' : '']"
    >
      <thead class="bg-white">
        <tr>
          <th
            v-if="hasCheckBox"
            class="items-center hidden px-2 py-3 text-xs font-bold tracking-wider text-left text-black uppercase 2xl:px-4 2xl:py-5 lg:table-cell"
            :class="rowHeadStyle"
          >
            <input
              v-if="checkCheckedAll"
              type="checkbox"
              @click.prevent="rowCheckedAll()"
              :checked="checkCheckedAll"
              class="w-4 h-4 rounded cursor-pointer accent-teal-800 focus:ring-new-tale text-primary border-new-tale/50 text-md"
            />
            <input
              v-else
              type="checkbox"
              @click.prevent="rowCheckedAll()"
              :checked="checkCheckedAll"
              class="w-4 h-4 rounded cursor-pointer accent-teal-800 focus:ring-new-tale text-primary border-new-tale/50 text-md"
            />
          </th>
          <th
            class="hidden px-3 py-3 text-xs font-bold tracking-wider text-left text-black uppercase 2xl:px-4 2xl:py-5 lg:table-cell"
            v-for="(header, i) in headers"
            :key="i"
            :class="rowHeadStyle"
          >
            <span class="cursor-pointer font-body" @click="sort_by(header)">
              {{ header.text }}
              <Icon
                name="bi:sort-up"
                width="20"
                height="20"
                v-if="
                  _sort[header.value] === 'asc' && header.sortable !== false
                "
                class="inline-block text-primary"
              />
              <Icon
                name="bi:sort-down"
                width="20"
                height="20"
                v-if="
                  _sort[header.value] === 'desc' && header.sortable !== false
                "
                class="inline-block text-primary"
              />
            </span>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          :class="[
            ' border-gray-200 rounded last:border-0 hover:bg-gray-50 cursor-pointer',
            fullRowClass,
          ]"
          v-for="(item, idx) in items"
          :key="item.id"
          @click="
            () => {
              $emit('click:row', item);
            }
          "
          class="flex flex-row flex-wrap mb-0 lg:hover:bg-blue-50 lg:table-row lg:flex-no-wrap"
        >
          <slot name="row" :item="item" :headers="headers" :get="_get">
            <td
              v-if="hasCheckBox"
              class="relative block w-full px-2 py-4 text-xs border-b rounded lg:w-auto lg:table-cell lg:static 2xl:px-4 2xl:text-sm"
              :class="rowStyle"
            >
              <input
                v-if="checkedItems.includes(item.id)"
                type="checkbox"
                :checked="checkedItems.includes(item.id)"
                @click.stop="rowChecked(item, item.id)"
                class="w-4 h-4 rounded cursor-pointer accent-teal-800 focus:ring-new-tale text-primary border-new-tale/50 text-md"
              />
              <input
                v-else
                type="checkbox"
                :checked="checkedItems.includes(item.id)"
                @click.stop="rowChecked(item, item.id)"
                class="w-4 h-4 rounded cursor-pointer accent-accent-teal-800 focus:ring-new-tale text-new-tale border-new-tale/50 text-md"
              />
            </td>

            <td
              v-for="header in headers"
              :key="header.value"
              :class="rowStyle"
              class="relative block w-full px-2 py-4 text-xs text-left text-gray-900 rounded font-body lg:w-auto lg:table-cell lg:static 2xl:px-4 2xl:text-sm"
            >
              <span
                class="inline-block w-1/3 text-sm font-normal text-left align-middle lg:hidden text-secondary-2 font-body"
                >{{ header.text }}
              </span>
              <slot :item="item" :name="header.value">
                <span
                  class="inline-block align-middle whitespace-nowrap font-body lg:w-7/12 xl:w-9/12"
                  v-if="header.value == 'roll_no'"
                >
                  {{ idx + 1 }}
                </span>
                <span
                  class="inline-block overflow-hidden truncate align-middle overflow-ellipsis whitespace-nowrap font-body lg:w-7/12 xl:w-9/12"
                  v-else-if="header.value == 'full_name'"
                >
                  <!-- <PersonTypeIndicator :type="item.type" /> -->

                  {{ _get(item, header.value) || "-" }}
                </span>
                <span
                  class="inline-block overflow-hidden truncate align-middle lg:w-10/12 xl:w-11/12 overflow-ellipsis whitespace-nowrap font-body"
                  v-else
                >
                  {{ _get(item, header.value) || "-" }}
                </span>
              </slot>
            </td>
          </slot>
        </tr>
      </tbody>
    </table>
    <div :class="[items?.length ? 'hidden' : 'flex w-full ', noItemClass]">
      <P-NoItems v-if="!loading" text="No Result Found" />
    </div>
  </div>
</template>
<style scoped>
.centering {
  position: absolute;
  bottom: -1%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
