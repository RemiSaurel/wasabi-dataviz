<script setup>
import { ref } from "vue";
import NavbarDataviz from "../components/dataviz/NavbarDataviz.vue";
import RemiDataviz from "../components/dataviz/RemiDataviz.vue";
import MathieuDataviz from "../components/dataviz/MathieuDataviz.vue";
import ChaimaeDataviz from "../components/dataviz/ChaimaeDataviz.vue";
import AdamDataviz from "../components/dataviz/AdamDataviz.vue";

const tab = ref("Rémi");

const changeTab = (tabName) => {
  tab.value = tabName;
};
</script>

<template>
  <div>
    <NavbarDataviz @tab="changeTab" :tab="tab" />

    <div v-if="tab === 'Adam'">
      <AdamDataviz />
    </div>
    <div v-else-if="tab === 'Chaimae'">
      <ChaimaeDataviz />
    </div>
    <div v-else-if="tab === 'Mathieu'">
      <MathieuDataviz />
    </div>
    <div v-else-if="tab === 'Rémi'">
      <RemiDataviz />
    </div>
  </div>
</template>

<style scoped></style>
