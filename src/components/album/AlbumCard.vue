<script setup lang="ts">
const props = defineProps<{
  album: {
    _id: string;
    title: string;
    cover: {
      standard: string;
    };
  };
}>();
</script>

<template>
  <div
    class="flex flex-col w-40 p-4 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-all"
  >
    <img
      class="w-32 h-32"
      v-if="album['cover'] && album['cover']['standard']"
      :src="album['cover']['standard']"
    />
    <div
      class="w-32 h-32 bg-neutral-50 text-4xl flex items-center justify-center"
      v-else
    >
      ?
    </div>
    <span class="w-full font-bold mt-4">
      {{ album.title }}
      <br />
      <span v-if="album.deezerFans" class="font-medium"
        >🖤 : {{ album.deezerFans }}</span
      >
    </span>
  </div>
</template>

<style scoped></style>
