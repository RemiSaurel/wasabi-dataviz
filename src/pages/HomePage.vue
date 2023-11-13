<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import StatCard from "../components/home/StatCard.vue";

const search = ref("");
const searchResults = ref([]);
const stats = ref({});

const getStats = async () => {
  const result = await fetch(`https://wasabi.i3s.unice.fr/search/dbinfo`);
  stats.value = await result.json();
};

const statsLoaded = computed(() => {
  return Object.keys(stats.value).length > 0;
});

watch(search, async () => {
  if (search.value.length === 0) {
    searchResults.value = [];
    return;
  }
  const result = await fetch(
    `https://wasabi.i3s.unice.fr/search/fulltext/${search.value}`,
  );
  searchResults.value = await result.json();
});

onMounted(() => {
  getStats();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <div v-if="statsLoaded" class="flex gap-24 mb-8 justify-center text-center">
      <StatCard title="Artists" :value="stats.nbArtist" />
      <StatCard title="Albums" :value="stats.nbAlbum" />
      <StatCard title="Songs" :value="stats.nbSong" />
    </div>
    <div class="flex flex-col items-center">
      <div class="flex justify-center w-full">
        <input
          type="text"
          v-model="search"
          class="bg-gray-50 w-1/2 min-w-[200px] border border-gray-300 text-neutral-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
          placeholder="Que souhaitez-vous découvrir ?"
          required
        />
      </div>
      <div
        class="w-1/2 min-w-[300px] rounded-lg flex flex-col justify-center items-center bg-neutral-100 overflow-auto"
      >
        <router-link
          class="flex items-center w-full gap-4 hover:bg-neutral-200 transition-all"
          v-for="result in searchResults"
          :to="{ name: 'Artist', params: { artist: result.name } }"
        >
          <img
            v-if="result.picture"
            :src="result.picture"
            class="h-20 w-20"
            alt=""
          />
          <div
            v-else
            class="h-20 w-20 bg-gray-200 text-4xl flex items-center justify-center"
          >
            ?
          </div>
          <div class="flex flex-col gap-2">
            <div class="font-semibold">{{ result.name }}</div>
            <div v-if="result.title">
              <div class="text-sm text-gray-500">
                Titre : {{ result.title }}
              </div>
              <div class="text-sm text-gray-500">
                Album : {{ result.albumTitle }}
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
