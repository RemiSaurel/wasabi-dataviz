<script setup lang="ts">
import { useRouter } from "vue-router";
import { onErrorCaptured } from "vue";

const router = useRouter();
onErrorCaptured((err, vm, info) => {
  console.log(err, vm, info);
});
</script>

<template>
  <router-view></router-view>
</template>

<style scoped></style>
