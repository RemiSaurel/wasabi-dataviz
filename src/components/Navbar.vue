<script setup lang="ts">
//https://github.com/RemiSaurel/wasabi-dataviz
</script>

<template>
  <nav
    class="border-b border-neutral-200 w-full justify-evenly flex gap-8 items-center text-neutral-600 h-12 mb-8"
  >
    <div class="flex">
      <router-link to="/">
        <img class="h-8 w-8" src="/w.svg" />
      </router-link>
    </div>

    <div class="flex gap-2 justify-center">
      <router-link to="/dataviz">
        <div
          class="font-bold hover:text-neutral-800 transition-all hover:underline"
        >
          Dataviz
        </div>
      </router-link>
    </div>

    <div class="flex">
      <a href="https://github.com/wasabi-project" target="_blank">
        <img class="h-8 w-8" src="/github.svg" />
      </a>
    </div>
  </nav>
</template>

<style scoped></style>
