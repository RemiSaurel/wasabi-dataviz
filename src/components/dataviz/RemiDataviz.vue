<template>
  <div class="flex">
    <svg class="w-2/3 h-[500px]" id="worldMap"></svg>
    <div v-if="show">Name : {{ name }}</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import * as d3 from "d3";
import { world } from "../../utils/world";

const data = ref(null);
const show = ref(false);
const name = ref("");

onMounted(async () => {
  // Load your data structure (replace with your actual data source)
  const response = await fetch("/data/countries.json");
  data.value = await response.json();

  // Load world map data using D3.js
  const worldMap = d3.select("#worldMap");
  const width = 1000;
  const height = 600;

  const projection = d3
    .geoMercator()
    .scale(200) // Adjust the initial scale as needed
    .translate([width / 3, height / 1.5]);

  const path = d3.geoPath().projection(projection);

  // Create a zoom behavior
  const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed);

  // Attach the zoom behavior to the SVG element
  worldMap.call(zoom);

  // Create a container for the map elements
  const mapContainer = worldMap.append("g");

  // Display the world map
  mapContainer
    .selectAll("path")
    .data(world.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", "#e0dbe9")
    .attr("stroke", "black")
    .attr("stroke-width", 0.5)
    .on("mouseover", function (event, d) {
      // Show the country name on hover
      show.value = true;
      name.value = d.properties.name;
      d3.select(this).attr("fill", "#c79ffb");
    })
    .on("mouseout", function (event, d) {
      // Hide the country name on mouseout
      d3.select(this).attr("fill", "#e0dbe9");
      show.value = false;
      name.value = "";

      // Remove the country name text
      mapContainer.select("#countryName").remove();
    });

  // Function to handle zooming
  function zoomed(event) {
    mapContainer.attr("transform", event.transform);
  }
});
</script>

<style scoped></style>
