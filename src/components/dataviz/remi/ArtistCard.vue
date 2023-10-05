<script setup lang="ts">
import GenreTag from "./GenreTag.vue";
import { computed } from "vue";
import { formatNumber } from "../../../utils/functions";

const props = defineProps<{
  artist: {
    artist: string;
    deezerFans: number;
    nbAlbums: number;
    genres: string[];
    nbSongs: number;
  };
}>();

const deezerFansFormatted = computed(() => {
  return formatNumber(props.artist.deezerFans);
});
</script>

<template>
  <div
    v-if="artist"
    class="flex flex-col w-full px-4 py-3 bg-neutral-100 rounded-lg hover:bg-neutral-200 hover:scale-105 transition-all"
  >
    <div class="font-bold flex flex-col gap-2 w-full">
      <div class="flex text-2xl justify-between items-baseline">
        <span class="w-2/3">{{ artist.artist }}</span>
        <span v-if="artist.deezerFans" class="font-medium text-xl">
          ❤️ {{ deezerFansFormatted }}
        </span>
      </div>

      <div
        v-show="artist.genres && artist.genres.length > 0"
        class="flex gap-1 flex-wrap font-medium text-sm"
      >
        <div v-for="genre in artist.genres">
          <GenreTag :genre="genre" />
        </div>
      </div>

      <div class="flex justify-between">
        <div>
          <span v-if="artist.nbAlbums" class="text-4xl font-bold"
            >{{ artist.nbAlbums }}
          </span>
          <br />
          <span v-if="artist.nbAlbums === 1">album</span>
          <span v-else>albums</span>
        </div>
        <div>
          <span v-if="artist.nbSongs" class="text-4xl font-bold"
            >{{ artist.nbSongs }}
          </span>
          <br />
          <span v-if="artist.nbSongs === 1">chanson</span>
          <span v-else>chansons</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
