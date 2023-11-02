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
    class="flex flex-col aspect-square justify-between px-4 py-3 bg-neutral-200 rounded-lg cursor-default transition-all duration-300 group hover:shadow-xl hover:bg-neutral-800 hover:text-white"
  >
    <div class="font-bold flex flex-col gap-2 w-full">
      <span class="break-words font-medium text-3xl">
        {{ artist.artist }}
      </span>
      <div class="text-2xl justify-between items-baseline">
        <div
          v-show="artist.genres && artist.genres.length > 0"
          class="flex gap-1 flex-wrap font-medium text-sm"
        >
          <div v-for="genre in artist.genres">
            <GenreTag :genre="genre" @filter="getGenre(genre)" />
          </div>
        </div>
      </div>
    </div>
    <div class="mt-auto group-hover:hidden">
      <span v-if="artist.deezerFans" class="font-medium text-2xl">
        ❤️ {{ deezerFansFormatted }}
      </span>
    </div>
    <div
      class="hidden justify-between z-10 pointer-events-none group-hover:flex"
    >
      <div>
        <span v-if="artist.nbAlbums" class="text-4xl">{{ nbAlbums }} </span>
        <div class="font-medium leading-none">
          <span v-if="artist.nbAlbums === 1">album</span>
          <span v-else>albums</span>
        </div>
      </div>
      <div class="text-right">
        <span v-if="artist.nbSongs" class="text-4xl">{{ nbSongs }} </span>
        <div class="font-medium leading-none">
          <span v-if="artist.nbSongs === 1">chanson</span>
          <span v-else>chansons</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
