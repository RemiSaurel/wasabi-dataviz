<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const search = ref("");
const router = useRouter();

const searchArtist = (search: string) => {
  router.push({ name: "Artist", params: { artist: search } });
};
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
