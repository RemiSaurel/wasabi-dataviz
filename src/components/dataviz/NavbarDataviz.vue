<script setup>
const emit = defineEmits(["tab"]);

defineProps({
  tab: {
    type: String,
    required: true,
  },
});
const changeTab = (tabName) => {
  emit("tab", tabName);
};
</script>

<template>
  <ul
    class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200"
  >
    <li class="mr-2">
      <a
        @click="changeTab('Adam')"
        :class="{
          'text-blue-600 bg-gray-100 rounded-t-lg active': tab === 'Adam',
        }"
        aria-current="page"
        class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 cursor-pointer"
        >Adam</a
      >
    </li>
    <li class="mr-2">
      <a
        @click="changeTab('Chaimae')"
        :class="{
          'text-blue-600 bg-gray-100 rounded-t-lg active': tab === 'Chaimae',
        }"
        class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 cursor-pointer"
        >Chaimae</a
      >
    </li>
    <li class="mr-2">
      <a
        @click="changeTab('Mathieu')"
        :class="{
          'text-blue-600 bg-gray-100 rounded-t-lg active': tab === 'Mathieu',
        }"
        class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 cursor-pointer"
        >Mathieu</a
      >
    </li>
    <li class="mr-2">
      <a
        @click="changeTab('Rémi')"
        :class="{
          'text-blue-600 bg-gray-100 rounded-t-lg active': tab === 'Rémi',
        }"
        class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 cursor-pointer"
        >Rémi</a
      >
    </li>
  </ul>
</template>

<style scoped></style>
