<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";

const search = ref("");
const router = useRouter();
const searchResults = ref([]);
const searchArtist = async (search: string) => {
  // router.push({ name: "Artist", params: { artist: search } });
};

watch(search, async () => {
  if (search.value.length < 2) {
    searchResults.value = [];
    return;
  }
  console.log(search.value);
  const result = await fetch(
    `https://wasabi.i3s.unice.fr/search/fulltext/${search.value}`,
  );
  searchResults.value = await result.json();
});

const filterResults = computed(() => {
  return searchResults.value.slice(0, 5);
});
</script>

<template>
  <div class="flex flex-col gap-4 items-center justify-center">
    <div class="flex gap-2 justify-center">
      <router-link class="text-blue-800" to="all">
        <button>All Songs</button>
      </router-link>
    </div>
    <div class="flex flex-col gap-2">
      <div>
        <input
          type="text"
          v-model="search"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
          placeholder="HJeuneCrack"
          required
        />
        <div class="flex items-center gap-4" v-for="result in filterResults">
          <img v-if="result.picture" :src="result.picture" />
          <div v-else class="w-14 h-14 bg-gray-200"></div>
          <div>{{ result.name }}</div>
        </div>
      </div>
      <div>
        <button class="bg-blue-100 text-lg" @click="searchArtist(search)">
          Search
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
