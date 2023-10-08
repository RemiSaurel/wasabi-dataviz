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
    <NavbarDataviz id="tabs" @tab="changeTab" :tab="tab" />

    <AdamDataviz v-if="tab === 'Adam'" />
    <ChaimaeDataviz v-else-if="tab === 'Chaimae'" />
    <MathieuDataviz v-else-if="tab === 'Mathieu'" />
    <RemiDataviz v-else-if="tab === 'Rémi'" />
  </div>
</template>

<style scoped></style>
