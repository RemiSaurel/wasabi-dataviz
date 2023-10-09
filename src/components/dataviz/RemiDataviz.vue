<template>
  <div
    v-if="isLoading"
    class="flex flex-col w-full h-full m-auto justify-center items-center gap-8"
  >
    <div
      class="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-900"
    ></div>
    <span class="text-2xl font-bold">Chargement...</span>
  </div>
  <div class="flex h-full">
    <!-- LEFT SIDE DETAILS -->
    <div class="w-1/2 overflow-auto p-4">
      <!-- GLOBAL INFOS ON START + NO COUNTRY SELECTED -->
      <div
        v-if="showGlobalStats && globalInfos"
        class="grid grid-cols-1 lg:grid-cols-2 content-center place-self-center h-full gap-8"
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
          <div>
            <div class="flex justify-between items-baseline">
              <span class="text-2xl font-bold">{{ name }}</span>

              <button
                type="button"
                @click="resetAll"
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

            <div class="flex flex-col mt-2 gap-2">
              <!-- SEARCHING ARTIST -->
              <div class="flex items-center gap-2">
                <input
                  type="text"
                  class="border border-gray-300 rounded-md p-2 w-4/5"
                  placeholder="Nom d'artiste, genres, ..."
                  v-model="filterArtistName"
                  @keyup.enter="filterAndPaginateArtists"
                />
                <div class="flex-grow flex gap-2">
                  <button
                    class="flex-grow-0 bg-purple-800 text-white rounded-md p-2 hover:bg-purple-900 transition-all"
                    @click="filterAndPaginateArtists"
                  >
                    <img src="../../../public/search.svg" alt="search" />
                  </button>
                  <button
                    class="flex-grow-0 bg-red-700 text-white rounded-md p-2 hover:bg-red-800 transition-all"
                    @click="resetFilters"
                  >
                    <img
                      src="../../../public/bin.svg"
                      alt="reset artist name"
                    />
                  </button>
                </div>
              </div>

              <div class="flex justify-between">
                <!-- FILTERS AND NB RESULTS -->
                <div class="italic text-gray-700 text-sm">
                  Recherche :
                  <span v-if="filterArtistName">
                    '{{ filterArtistName }}'
                  </span>
                  <span v-else>aucun filtre</span>
                  <br />
                  {{ artists.length }} résultat(s)
                </div>
              </div>

              <!-- ARTIST CARDS -->
              <div
                class="grid grid-cols-1 gap-x-4 gap-y-6 h-full xl:grid-cols-2"
                v-if="displayedArtists.length > 0"
              >
                <ArtistCard
                  v-for="artist in displayedArtists"
                  :artist="artist"
                  :key="artist.artist"
                />
              </div>
              <div v-else>
                <span class="text-xl text-neutral-800">
                  😔 Nous n'avons trouvé aucun résultat pour votre recherche...
                </span>
              </div>
              <!-- PAGINATION -->
              <div class="flex justify-end mt-2" v-if="totalPages > 1">
                <div class="flex">
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
                    v-if="totalPages > 3"
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
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MAP -->
    <svg
      class="w-1/2"
      :class="isLoading ? '' : 'bg-blue-50'"
      id="worldMap"
    ></svg>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import * as d3 from "d3";
import { world } from "../../utils/world";
import ArtistCard from "./remi/ArtistCard.vue";
import { formatNumber } from "../../utils/functions";
import { RecycleScroller } from "vue-virtual-scroller";

const data = ref(null);
const isLoading = ref(true);
const globalInfos = ref(null);
const showGlobalStats = ref(true);
const name = ref("");
const artists = ref([]);
const countryInfo = ref({});
let filterArtistName = ""; // Not a ref because we don't want to trigger a re-render

onMounted(async () => {
  const response = await fetch(
    import.meta.env.BASE_URL + "data/full_countries_clean.json",
  );

  data.value = await response.json();

  isLoading.value = false;

  // SETUP GLOBAL DATA STATS
  setupGlobalDataStats();

  const worldMap = d3.select("#worldMap");
  const width = 1000;
  const height = 600;

  const projection = d3
    .geoMercator()
    .scale(120) // Adjust the initial scale as needed
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
      resetAll();

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

      // Init displayed artists
      filterAndPaginateArtists();

      // Country on the map should be pinging
      d3.select(this).attr("fill", "#591baa");
    })
    .on("mouseenter", function (event, d) {
      setupTooltip(tooltip, event, d);

      // If country is selected, don't change color
      if (name.value === d.properties.name) {
        return;
      }

      d3.select(this).attr("fill", "#c79ffb");

      // Cursor becomes a pointer
      d3.select(this).attr("cursor", "pointer");
    })
    .on("mouseleave", function (event, d) {
      // Hide and clear the tooltip
      tooltip.style("visibility", "hidden");

      // If country is selected, don't change color
      if (name.value === d.properties.name) {
        return;
      }

      d3.select(this).attr("fill", "#e0dbe9");
    });

  // Function to handle zooming
  function zoomed(event) {
    mapContainer.attr("transform", event.transform);
  }
});

const setupGlobalDataStats = () => {
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
};

const setupTooltip = (tooltip, event, d) => {
  // Show the tooltip next to the cursor
  const cursor = d3.pointer(event, window);

  const countryTootltipInfo = {
    name: d.properties.name,
    nbArtists: formatNumber(
      data.value.find((country) => {
        return country.country === d.properties.name;
      })?.artists.length,
    ),
    nbAlbums: formatNumber(
      data.value
        .find((country) => {
          return country.country === d.properties.name;
        })
        ?.artists.reduce((acc, artist) => {
          return acc + artist.nbAlbums;
        }, 0),
    ),
    nbSongs: formatNumber(
      data.value
        .find((country) => {
          return country.country === d.properties.name;
        })
        ?.artists.reduce((acc, artist) => {
          return acc + artist.nbSongs;
        }, 0),
    ),
  };

  tooltip
    .style("visibility", "visible")
    .style("left", cursor[0] + 10 + "px")
    .style("top", cursor[1] + 10 + "px");

  // Display tooltip
  tooltip.html(`
        <div class="flex flex-col p-1 gap-1">
          <span class="text-xl font-bold">${countryTootltipInfo.name}</span>
          <span class="w-full h-[2px] bg-white"></span>
          <span class="text-lg">${countryTootltipInfo.nbArtists} artiste(s)</span>
          <span class="text-lg">${countryTootltipInfo.nbAlbums} album(s)</span>
          <span class="text-lg">${countryTootltipInfo.nbSongs} chanson(s)</span>
        </div>
      `);
};

const resetAll = () => {
  d3.selectAll("path").attr("fill", "#e0dbe9");
  countryInfo.value = {};
  artists.value = [];
  displayedArtists.value = [];
  showGlobalStats.value = true;
  name.value = "";
  filterArtistName = "";
  currentPage.value = 1;
};

const resetFilters = () => {
  filterArtistName = "";
  currentPage.value = 1;
  filterAndPaginateArtists();
};

// FILTERED AND PAGINATED ARTISTS
const displayedArtists = ref([...artists.value]); // Define paginatedArtists as a ref

const filterAndPaginateArtists = () => {
  // Reset artists value to original value
  // Check also the genres
  artists.value = countryInfo.value.artists
    .filter((artist) => {
      const artistName = artist.artist.toLowerCase();
      const searchName = filterArtistName.toLowerCase();
      const genres = artist.genres.map((genre) => genre.toLowerCase());

      // Check if the artist's name contains the search term
      const nameMatch = artistName.includes(searchName);

      // Check if any of the artist's genres contain the search term
      const genreMatch = genres.some((genre) => genre.includes(searchName));

      return nameMatch || genreMatch;
    })
    .sort((a, b) => {
      return b.deezerFans - a.deezerFans;
    });

  // If nb of artists is less than itemsPerPage, set currentPage to 1
  if (
    (filterArtistName && artists.value.length < itemsPerPage) ||
    (artists.value.length < currentPage.value * itemsPerPage &&
      currentPage.value !== totalPages.value)
  ) {
    currentPage.value = 1;
  }

  // Paginate the filtered artists
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  displayedArtists.value = artists.value.slice(start, end);
};

const currentPage = ref(1);
const itemsPerPage = 20;

watch([currentPage], () => {
  filterAndPaginateArtists();
});

const setCurrentPage = (page: number) => {
  currentPage.value = page;
};

const totalPages = computed(() => {
  return countryInfo.value ? Math.ceil(artists.value.length / itemsPerPage) : 0;
});

const getMiddlePage = () => {
  return Math.ceil(totalPages.value / 2);
};
</script>
