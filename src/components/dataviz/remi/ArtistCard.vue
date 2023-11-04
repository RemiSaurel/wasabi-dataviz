<script setup lang="ts">
import GenreTag from "./GenreTag.vue";
import { computed, onMounted, ref } from "vue";
import { formatNumber } from "../../../utils/functions";
import { useArtist } from "../../../queries/artist.queries";
import { fetchArtist } from "../../../services/artist-service";
import router from "../../../router/routes";

const props = defineProps<{
  artist: {
    artist: string;
    deezerFans: number;
    nbAlbums: number;
    genres: string[];
    nbSongs: number;
  };
}>();

const artistInfo = ref<any>(null);
const alreadyFetched = ref<boolean>(false);
const artistName = ref<string>(props.artist.artist);
const artistPicture = ref<string>("");
const loading = ref<boolean>(false);

const getArtistInfo = async () => {
  if (alreadyFetched.value) return;
  loading.value = true;
  artistInfo.value = await fetchArtist(artistName);
  loading.value = false;
  alreadyFetched.value = true;
  artistPicture.value = getArtistPicture();
};

const getArtistPicture = () => {
  if (artistInfo.value) {
    return artistInfo.value["picture"]["medium"];
  }
};

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
    @mouseenter="getArtistInfo"
    class="flex flex-col aspect-square justify-between px-4 py-3 bg-neutral-800 rounded-lg transition-all duration-300 group text-white shadow-2xl relative overflow-hidden"
    :class="!artistPicture ? 'hover:bg-black' : ''"
  >
    <div class="font-bold flex flex-col gap-2 w-full">
      <span
        @click="router.push({ name: 'Artist', params: { artist: artistName } })"
        class="break-words font-medium text-3xl z-50 hover:cursor-pointer"
      >
        {{ artist.artist }}
      </span>
      <div class="text-2xl justify-between items-baseline z-50">
        <div
          v-show="artist.genres && artist.genres.length > 0"
          class="flex gap-1 flex-wrap font-medium text-sm"
        >
          <div v-for="genre in artist.genres" class="z-40">
            <GenreTag :genre="genre" @filter="getGenre(genre)" />
          </div>
        </div>
      </div>
      <div
        v-if="loading"
        class="m-auto mt-8 animate-spin rounded-full h-8 w-8 border-b-2 border-white"
      ></div>
      <div v-if="artistPicture">
        <div
          class="absolute top-0 left-0 w-full h-full bg-black opacity-60 z-10 rounded-lg"
        ></div>
        <div
          class="absolute rounded-lg inset-0 group-hover:scale-125 duration-500 ease-in-out transition-all"
          :style="{
            backgroundImage: `url('${artistPicture}')`,
            backgroundSize: 'cover',
          }"
        ></div>
      </div>
    </div>
    <div class="flex justify-between items-end z-50 pointer-events-none">
      <span class="font-medium text-2xl">
        ❤️
        <span v-if="artist.deezerFans">{{ deezerFansFormatted }}</span>
        <span v-else>0</span>
      </span>
      <div class="flex flex-col text-right">
        <div>
          <span v-if="artist.nbAlbums" class="text-4xl">{{ nbAlbums }} </span>
          <div class="font-medium leading-none">
            <span v-if="artist.nbAlbums === 1">album</span>
            <span v-else>albums</span>
          </div>
        </div>
        <div>
          <span v-if="artist.nbSongs" class="text-4xl">{{ nbSongs }} </span>
          <div class="font-medium leading-none">
            <span v-if="artist.nbSongs === 1">chanson</span>
            <span v-else>chansons</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
