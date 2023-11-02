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

const nbAlbums = computed(() => {
  return props.artist.nbAlbums ? props.artist.nbAlbums : 0;
});

const nbSongs = computed(() => {
  return props.artist.nbSongs ? props.artist.nbSongs : 0;
});

const emit = defineEmits(["filter"]);
const getGenre = (genre: string) => {
  emit("filter", genre);
};
</script>

<template>
  <div
    v-if="artist"
    class="flex flex-col w-full h-full px-4 py-3 linear-bg rounded-lg hover:shadow-xl hover:scale-[1.02] transition-all"
  >
    <div class="font-bold flex flex-col justify-between h-full gap-2 w-full">
      <div class="flex flex-col gap-0.5">
        <div class="flex text-2xl justify-between items-baseline">
          <span class="w-3/5">{{ artist.artist }}</span>
          <span v-if="artist.deezerFans" class="font-medium text-base">
            ❤️ {{ deezerFansFormatted }}
          </span>
        </div>

        <div
          v-show="artist.genres && artist.genres.length > 0"
          class="flex gap-1 flex-wrap font-medium text-sm"
        >
          <div v-for="genre in artist.genres">
            <GenreTag :genre="genre" @filter="getGenre(genre)" />
          </div>
        </div>
      </div>

      <div class="flex justify-between">
        <div>
          <span v-if="artist.nbAlbums" class="text-4xl font-bold"
            >{{ nbAlbums }}
          </span>
          <div class="font-medium leading-none">
            <span v-if="artist.nbAlbums === 1">album</span>
            <span v-else>albums</span>
          </div>
        </div>
        <div class="text-right">
          <span v-if="artist.nbSongs" class="text-4xl font-bold"
            >{{ nbSongs }}
          </span>
          <div class="font-medium leading-none">
            <span v-if="artist.nbSongs === 1">chanson</span>
            <span v-else>chansons</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.linear-bg {
  background: radial-gradient(
    circle,
    rgb(255, 255, 255) 0%,
    rgb(235, 235, 235) 50%,
    rgb(220, 220, 220) 100%
  );
}
</style>
