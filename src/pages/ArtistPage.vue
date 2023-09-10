<script setup lang="ts">
import { ref } from "vue";
import { useArtist } from "../queries/artist.queries";
import { useRoute } from "vue-router";
import Datatable from "../components/Datatable.vue";

const albums = ref({
  cover: "Cover",
  title: "Title",
});

const members = ref({
  name: "Name",
  begin: "Begin",
  end: "End",
  instruments: "Instruments",
});

const route = useRoute();
const artistName = ref(route.params.artist);

const { data, isLoading, error } = useArtist(artistName);
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <div class="flex flex-col gap-2" v-else-if="data">
    <div class="text-2xl">{{ data.name }}</div>

    <div class="text-xl">Members</div>
    <Datatable :columns="members" :data="data.members" />

    <div class="text-xl">Albums</div>
    <Datatable :columns="albums" :data="data.albums" />
  </div>
  <div v-else-if="error">Error: {{ error }}</div>
</template>

<style scoped></style>
