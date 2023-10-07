<template>
  <div
    v-if="isLoading"
    class="flex flex-col w-full m-auto h-[400px] justify-center items-center gap-8"
  >
    <div
      class="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-900"
    ></div>
    <span class="text-2xl font-bold">Chargement...</span>
  </div>
  <div class="flex h-[500px]">
    <!-- MAP -->
    <svg class="w-2/3" id="worldMap"></svg>

    <!-- RIGHT SIDE DETAILS -->
    <div class="w-1/3 overflow-auto p-4">
      <!-- GLOBAL INFOS ON START + NO COUNTRY SELECTED -->
      <div
        v-if="showGlobalStats && globalInfos"
        class="flex flex-col h-full justify-around items-center gap-8"
      >
        <div
          v-for="(info, name) in globalInfos"
          class="flex flex-col items-center"
        >
          <span class="text-4xl font-bold">{{ info }}</span>
          <span class="text-xl">{{ name }}</span>
        </div>
      </div>

      <!-- COUNTRY SELECTED -->
      <div v-else>
        <div v-if="!isLoading">
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
            <!-- SEARCHING ARTIST -->
            <input
              type="text"
              class="border border-gray-300 rounded-md p-2"
              placeholder="Votre artiste..."
              v-model="filterArtist"
            />

            <!-- PAGINATION -->
            <div class="flex justify-end">
              <div v-if="totalPages > 1" class="flex">
                <button
                  @click="currentPage = currentPage - 1"
                  :disabled="currentPage === 1"
                  class="px-3 py-2 rounded-md mx-1 cursor-pointer bg-gray-300 disabled:opacity-50"
                >
                  ⬅️
                </button>

                <button
                  @click="setCurrentPage(1)"
                  :class="{
                    'bg-purple-900 text-white': currentPage === 1,
                    'bg-gray-300': currentPage !== 1,
                  }"
                  class="px-3 py-2 rounded-md mx-1 cursor-pointer"
                >
                  1
                </button>
                <button
                  :class="{
                    'bg-purple-900 text-white':
                      currentPage !== 1 && currentPage !== totalPages,
                    'bg-gray-300':
                      currentPage === 1 || currentPage === totalPages,
                  }"
                  @click="setCurrentPage(getMiddlePage(0))"
                  class="px-3 py-2 rounded-md mx-1 cursor-pointer"
                >
                  {{
                    currentPage !== 1 && currentPage !== totalPages
                      ? currentPage
                      : "..."
                  }}
                </button>
                <button
                  @click="setCurrentPage(totalPages)"
                  :class="{
                    'bg-purple-900 text-white': currentPage === totalPages,
                    'bg-gray-300': currentPage !== totalPages,
                  }"
                  class="px-3 py-2 rounded-md mx-1 cursor-pointer"
                >
                  {{ totalPages }}
                </button>
                <button
                  :disabled="currentPage === totalPages"
                  @click="currentPage = currentPage + 1"
                  class="px-3 py-2 rounded-md mx-1 cursor-pointer bg-gray-300 disabled:opacity-50"
                >
                  ➡️
                </button>
              </div>
            </div>

            <!-- ARTIST CARDS -->
            <div v-for="artist in paginatedArtists">
              <artist-card :artist="artist" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import * as d3 from "d3";
import { world } from "../../utils/world";
import ArtistCard from "./remi/ArtistCard.vue";
import { formatNumber } from "../../utils/functions";

const data = ref(null);
const isLoading = ref(true);
const globalInfos = ref(null);
const showGlobalStats = ref(true);
const name = ref("");
const artists = ref([]);
const countryInfo = ref({});
const filterArtist = ref("");

// Show loading spinner before data is loaded

onMounted(async () => {
  const response = await fetch(
    import.meta.env.BASE_URL + "data/full_countries_clean.json",
  );

  data.value = await response.json();

  isLoading.value = false;

  let totalNbSongs: number = 0;
  let totalNbAlbums: number = 0;
  let totalNbArtists: number = 0;
  let totalNbDeezerFans: number = 0;
  let totalNbUniqueGenres: number = 0;
  let uniqueGenres: Set<string> = new Set();

  data.value.forEach((country) => {
    country.artists.forEach((artist) => {
      totalNbArtists++;
      totalNbAlbums += artist.nbAlbums || 0;
      totalNbSongs += artist.nbSongs || 0;
      totalNbDeezerFans += artist.deezerFans || 0;
      uniqueGenres = new Set([...uniqueGenres, ...artist.genres]);
    });
  });

  totalNbArtists = formatNumber(totalNbArtists);
  totalNbSongs = formatNumber(totalNbSongs);
  totalNbAlbums = formatNumber(totalNbAlbums);
  totalNbDeezerFans = formatNumber(totalNbDeezerFans);
  totalNbUniqueGenres = formatNumber(uniqueGenres.size);

  globalInfos.value = {
    chansons: totalNbSongs,
    artistes: totalNbArtists,
    albums: totalNbAlbums,
    "fans cumulés": totalNbDeezerFans,
    "genres uniques": totalNbUniqueGenres,
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
    .attr("class", "tooltip bg-purple-800  text-lg text-white p-2 rounded-md")
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

      const countryTootltipInfo = {
        name: d.properties.name,
        nbArtists: data.value.find((country) => {
          return country.country === d.properties.name;
        })?.artists.length,
        nbAlbums: data.value
          .find((country) => {
            return country.country === d.properties.name;
          })
          ?.artists.reduce((acc, artist) => {
            return acc + artist.nbAlbums;
          }, 0),
      };

      tooltip
        .style("visibility", "visible")
        .style("left", cursor[0] + 10 + "px")
        .style("top", cursor[1] + 10 + "px");

      if (!countryTootltipInfo.nbArtists || !countryTootltipInfo.nbAlbums) {
        countryTootltipInfo.nbArtists = 0;
        countryTootltipInfo.nbAlbums = 0;
      }
      tooltip.html(`
        <div class="flex flex-col p-1 gap-1">
          <span class="text-xl font-bold">${countryTootltipInfo.name}</span>
          <span class="w-full h-[2px] bg-white"></span>
          <span class="text-lg">${countryTootltipInfo.nbArtists} artiste(s)</span>
          <span class="text-lg">${countryTootltipInfo.nbAlbums} album(s)</span>
        </div>
      `);

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
  filterArtist.value = "";
  currentPage.value = 1;
};

/* FILTERED ARTISTS
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
*/

const currentCountryArtists = computed(() => {
  return countryInfo.value ? artists.value : [];
});

const currentPage = ref(1);
const itemsPerPage = 50;

const setCurrentPage = (page: number) => {
  currentPage.value = page;
};

const totalPages = computed(() => {
  return Math.ceil(currentCountryArtists.value.length / itemsPerPage);
});

const getMiddlePage = (section: number) => {
  const middle = Math.ceil(totalPages.value / 2);
  if (section === 1) {
    return Math.min(currentPage.value + 1, middle);
  } else if (section === 2) {
    return Math.max(currentPage.value - 1, middle);
  }

  return middle;
};

const paginatedArtists = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return currentCountryArtists.value.slice(start, end);
});
</script>
