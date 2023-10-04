<script setup lang="ts">
import { useRouter } from "vue-router";
import { onErrorCaptured } from "vue";
import Navbar from "./components/Navbar.vue";

const router = useRouter();
onErrorCaptured((err, vm, info) => {
  console.log(err, vm, info);
});
</script>

<template>
  <Navbar />
  <router-view id="container"></router-view>
</template>

<style scoped>
#container {
  margin-right: 6rem;
  margin-left: 6rem;
}
</style>
