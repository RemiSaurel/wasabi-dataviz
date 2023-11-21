<template>
  <!-- onchange of artist display artist -->
  <div
    v-if="artist"
    class="tooltip bg-neutral-800 text-lg text-white pt-1 p-2 rounded-md"
  >
    <div class="flex flex-col p-1 gap-1">
      <span class="text-xl font-bold uppercase">{{ artist.artist }}</span>
      <span class="w-full h-[2px] bg-white"></span>

      <span>{{ artist.nbAlbums }} Albums</span>
      <span>{{ artist.nbSongs }} Chansons</span>
      <span>{{ formattedFans }} Fans sur deezer</span>
      <span>{{ lifeSpan.duration }} Années de carrière</span>
      <span>Début: {{ lifeSpan.begin }}</span>
      <span>Fin: {{ lifeSpan.end }}</span>
    </div>
  </div>
</template>

<script setup>
import { formatNumber } from "../../utils/functions";
const { artist, lifeSpan } = defineProps(["artist", "lifeSpan"]);

const formattedFans = formatNumber(artist.deezerFans);
</script>
