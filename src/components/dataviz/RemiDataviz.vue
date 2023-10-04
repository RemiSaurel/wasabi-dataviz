<template>
  <div class="flex h-[500px]">
    <svg class="w-2/3" id="worldMap"></svg>
    <div class="w-1/3 overflow-auto p-4">
      <div
        v-if="showGlobalStats && globalInfos"
        class="flex flex-col h-full justify-around items-center gap-8"
      >
        <div class="flex flex-col items-center">
          <span class="text-4xl font-bold">{{ globalInfos.totalNbSongs }}</span>
          <span class="text-4xl">chansons</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="text-4xl font-bold">{{
            globalInfos.totalNbAlbums
          }}</span>
          <span class="text-4xl">albums</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="text-4xl font-bold">{{
            globalInfos.totalNbDeezerFans
          }}</span>
          <span class="text-4xl">fans cumulés</span>
        </div>
      </div>
      <div v-else>
        <div class="flex justify-between items-baseline">
          <span class="text-2xl font-bold">{{ name }}</span>
          <button
            type="button"
            @click="reset"
            class="bg-white rounded-md p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset"
          >
            <span class="sr-only">Close menu</span>
            <svg
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div class="flex flex-col mt-2 gap-4">
          <input
            type="text"
            class="border border-gray-300 rounded-md p-2"
            placeholder="Nom de l'artiste..."
            v-model="filterArtist"
          />
          <div v-for="artist in filteredArtists">
            <artist-card :artist="artist" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import * as d3 from "d3";
import { world } from "../../utils/world";
import ArtistCard from "./remi/ArtistCard.vue";
import { formatNumber } from "../../utils/functions";

const data = ref(null);
const globalInfos = ref(null);
const showGlobalStats = ref(true);
const name = ref("");
const artists = ref([]);
const countryInfo = ref({});
const filterArtist = ref("");

onMounted(async () => {
  const response = await fetch("/data/countries.json");
  data.value = await response.json();

  let totalNbSongs: number = 0;
  let totalNbAlbums: number = 0;
  let totalNbDeezerFans: number = 0;

  data.value.forEach((country) => {
    country.artists.forEach((artist) => {
      totalNbAlbums += artist.nbAlbums || 0;
      totalNbSongs += artist.nbSongs || 0;
      totalNbDeezerFans += artist.deezerFans || 0;
    });
  });

  totalNbSongs = formatNumber(totalNbSongs);
  totalNbAlbums = formatNumber(totalNbAlbums);
  totalNbDeezerFans = formatNumber(totalNbDeezerFans);

  globalInfos.value = {
    totalNbSongs,
    totalNbAlbums,
    totalNbDeezerFans,
  };

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

  // Create a tooltip element
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip bg-purple-800 text-lg text-white p-2 rounded-md")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden");

  // Display the world map
  mapContainer
    .selectAll("path")
    .data(world.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", "#e0dbe9")
    .attr("stroke", "black")
    .attr("pointer", "cursor")
    .attr("stroke-width", 0.5)
    .on("click", function (event, d) {
      reset();

      showGlobalStats.value = false;
      name.value = d.properties.name;
      d3.select(this).attr("fill", "#c79ffb");
      countryInfo.value = data.value.find((country) => {
        return country.country === name.value;
      });

      if (!countryInfo.value) {
        return;
      }
      // Get artists and sort by nbDeezerFans
      artists.value = countryInfo.value.artists.sort((a, b) => {
        return b.deezerFans - a.deezerFans;
      });
    })
    .on("mouseenter", function (event, d) {
      // Show the tooltip next to the cursor
      const cursor = d3.pointer(event, window);
      tooltip
        .style("visibility", "visible")
        .style("left", cursor[0] + 10 + "px")
        .style("top", cursor[1] + 10 + "px")
        .text(d.properties.name);

      d3.select(this).attr("fill", "#c79ffb");
      // Cursor becomes a pointer
      d3.select(this).attr("cursor", "pointer");
    })
    .on("mouseleave", function (event, d) {
      // Hide and clear the tooltip
      tooltip.style("visibility", "hidden");
      d3.select(this).attr("fill", "#e0dbe9");
    });

  // Function to handle zooming
  function zoomed(event) {
    mapContainer.attr("transform", event.transform);
  }
});

const reset = () => {
  d3.selectAll("path").attr("fill", "#e0dbe9");
  countryInfo.value = {};
  artists.value = [];
  showGlobalStats.value = true;
  name.value = "";
};

const filteredArtists = computed(() => {
  if (filterArtist.value === "") {
    return artists.value;
  } else {
    return artists.value.filter((artist) => {
      return artist.artist
        .toLowerCase()
        .includes(filterArtist.value.toLowerCase());
    });
  }
});
</script>

<style scoped></style>
