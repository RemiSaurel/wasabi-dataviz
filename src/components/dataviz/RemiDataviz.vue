<template>
  <LoadingSpinner v-if="isLoading" :isLoading="isLoading" />

  <!-- MAIN CONTAINER -->
  <div class="flex h-full relative">
    <!-- TOGGLE FULL MAP -->
    <button
      type="button"
      class="absolute top-3 ml-3 p-2 bg-white shadow transform z-10 hover:bg-gray-100"
      :class="[fullMap ? 'left-0' : 'left-1/2']"
      @click="toggleFullMap"
    >
      <span class="flex gap-1 text-sm items-center" v-if="fullMap">
        Afficher les infos
        <img src="/arrow_right.svg" alt="arrow" />
      </span>
      <img v-else src="/arrow_left.svg" alt="arrow" />
    </button>
    <div
      v-if="!fullMap"
      class="w-1/2 overflow-y-auto overflow-x-hidden p-4 transition-all duration-700 ease-in-out"
    >
      <!-- GLOBAL INFOS ON START + NO COUNTRY SELECTED -->
      <div
        v-if="showGlobalStats && globalInfos"
        class="grid grid-cols-1 gap-6 lg:grid-cols-2 content-center h-full"
      >
        <div
          v-for="(info, name, i) in globalInfos"
          class="flex flex-col items-center p-4 bg-neutral-100 rounded-2xl"
        >
          <span class="text-4xl font-bold">{{ info }}</span>
          <span class="text-xl">{{ GLOBAL_DATA_KEYS[i] }}</span>
        </div>
      </div>

      <!-- COUNTRY SELECTED -->
      <div v-else>
        <div v-if="!isLoading">
          <div class="flex justify-between items-baseline relative">
            <span class="text-4xl font-bold mb-4 uppercase">{{
              countryName
            }}</span>

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
                placeholder="Nom d'artiste..."
                v-model="filterArtistName"
                @keyup.enter="filterAndPaginateArtists"
              />
              <div class="flex-grow flex justify-between gap-2">
                <button
                  class="flex-grow-0 bg-neutral-800 text-white rounded-md p-2 hover:bg-neutral-900 transition-all"
                  @click="filterAndPaginateArtists"
                >
                  <img src="/search.svg" alt="search" />
                </button>
                <button
                  class="flex-grow-0 bg-red-700 text-white rounded-md p-2 hover:bg-red-800 transition-all"
                  @click="resetFilters"
                >
                  <img src="/bin.svg" alt="reset artist name" />
                </button>
              </div>
            </div>

            <div class="flex flex-col gap-1 mb-4 justify-between">
              <!-- FILTERS AND NB RESULTS -->
              <div v-if="genresFilter.length > 0" class="flex gap-1 flex-wrap">
                <div class="flex gap-1" v-for="genre in genresFilter">
                  <GenreTag
                    :genre="genre"
                    :closable="true"
                    @removeGenre="removeGenre(genre)"
                  />
                </div>
              </div>

              <div class="italic text-gray-700 text-sm">
                Recherche :
                <span v-if="filterArtistName"> '{{ filterArtistName }}' </span>
                <span v-if="filterArtistName && genresFilter.length > 0">
                  avec
                </span>
                <span v-if="genresFilter.length > 0">
                  {{ genresFilter.join(" + ") }}
                </span>
                <span v-if="!filterArtistName && genresFilter.length === 0"
                  >aucun filtre</span
                >
                <br />
                {{ artistList.length }} résultat(s)
              </div>
            </div>

            <!-- ARTIST CARDS -->
            <div
              class="grid gap-4 grid-cols-1 xl:grid-cols-2"
              v-if="displayedArtists.length > 0"
            >
              <ArtistCard
                @filter="addGenreFilter($event)"
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
                  class="px-3 py-2 rounded-md mx-1 cursor-pointer bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ⬅️
                </button>
                <button
                  @click="setCurrentPage(1)"
                  :class="{
                    'bg-neutral-900 text-white': currentPage === 1,
                    'bg-gray-300': currentPage !== 1,
                  }"
                  class="px-3 py-2 rounded-md mx-1 cursor-pointer"
                >
                  1
                </button>
                <button
                  v-if="totalPages > 3"
                  :class="{
                    'bg-neutral-900 text-white':
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
                    'bg-neutral-900 text-white': currentPage === totalPages,
                    'bg-gray-300': currentPage !== totalPages,
                  }"
                  class="px-3 py-2 rounded-md mx-1 cursor-pointer"
                >
                  {{ totalPages }}
                </button>
                <button
                  :disabled="currentPage === totalPages"
                  @click="currentPage = currentPage + 1"
                  class="px-3 py-2 rounded-md mx-1 cursor-pointer bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ➡️
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- D3JS DATAVIZ MAP -->
    <svg
      class="w-1/2 transition-all duration-700 ease-in-out cursor-grab"
      :class="[isLoading ? '' : 'bg-blue-50', fullMap ? 'w-full' : '']"
      id="worldMap"
    ></svg>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, Ref, ref, watch } from "vue";
import * as d3 from "d3";
import { world } from "../../utils/world";
import ArtistCard from "./remi/ArtistCard.vue";
import { formatNumber } from "../../utils/functions";
import GenreTag from "./remi/GenreTag.vue";
import { GLOBAL_DATA_KEYS, GlobalData, RemiData } from "../../models/models";
import LoadingSpinner from "../LoadingSpinner.vue";

// MAIN DATA
const data: Ref<RemiData[]> = ref(null); // My data loaded from my json file in public/data
const isLoading = ref(true); // Check if data from file is loading
const globalInfos: Ref<GlobalData> = ref(null); // Global data stats
const showGlobalStats = ref(true); // boolean to display global stats or specific country stats
const countryName = ref("");
const artistList = ref([]); // List of artists from a specific country
const countryInfo = ref({}); // Country info from a specific country
const genresFilter: Ref<string[]> = ref([]); // List of genres used to filter
let filterArtistName = ""; // Not a ref because we don't want to trigger a re-render

// PAGINATION VALUES
const currentPage = ref(1);
const itemsPerPage = 20;
const fullMap = ref(false);

onMounted(async () => {
  // Import data from file
  const response = await fetch(
    import.meta.env.BASE_URL + "data/full_countries_clean.json",
  );

  // Transform our data to a json object
  data.value = await response.json();

  // Not loading anymore
  isLoading.value = false;

  // SETUP GLOBAL DATA STATS
  setupGlobalDataStats();

  // We select the SVG with the id worldMap and setup its width and height
  const worldMap = d3.select("#worldMap");
  const width = 1000;
  const height = 600;

  // We define a projection with the Mercator projection
  const projection = d3
    .geoMercator()
    .scale(120) // Adjust the initial scale as needed
    .translate([width / 3, height / 1.5]);

  // We define a path using the projection
  const path = d3.geoPath().projection(projection);

  // Create a zoom behavior
  const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed);

  // Attach the zoom behavior to the SVG element
  worldMap.call(zoom);

  // Create a container for the map elements
  const mapContainer = worldMap.append("g");

  // Create a tooltip element with some styles
  const tooltip = d3
    .select("body")
    .append("div")
    .attr(
      "class",
      "tooltip bg-neutral-800 text-lg text-white pt-1 p-2 rounded-md",
    )
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden");

  // Display the world map with the countries and setup eventListeners
  mapContainer
    .selectAll("path")
    .data(world.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", "#ebebeb")
    .attr("stroke", "black")
    .attr("pointer", "cursor")
    .attr("stroke-width", 0.5)
    .on("click", function (event, d) {
      resetAll();

      showGlobalStats.value = false;
      countryName.value = d.properties.name;
      countryInfo.value = data.value.find((country) => {
        return country.country === countryName.value;
      });

      if (!countryInfo.value) {
        return;
      }
      // Get artists and sort by nbDeezerFans
      artistList.value = countryInfo.value.artists.sort((a, b) => {
        return b.deezerFans - a.deezerFans;
      });

      // Init displayed artists
      filterAndPaginateArtists();

      // Country on the map should be pinging
      d3.select(this).attr("fill", "#434e5c");
    })
    .on("mouseenter", function (event, d) {
      setupTooltip(tooltip, event, d);

      // If country is selected, don't change color
      if (countryName.value === d.properties.name) {
        return;
      }

      d3.select(this).attr("fill", "#a1a1ae");

      // Cursor becomes a pointer
      d3.select(this).attr("cursor", "pointer");
    })
    .on("mouseleave", function (event, d) {
      // Hide and clear the tooltip
      tooltip.style("visibility", "hidden");

      // If country is selected, don't change color
      if (countryName.value === d.properties.name) {
        return;
      }

      d3.select(this).attr("fill", "#ebebeb");
    });

  // Function to handle zooming
  function zoomed(event) {
    mapContainer.attr("transform", event.transform);
  }
});

// Function to setup the global data stats when we arrive on the page
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
      if (artist.genres) {
        artist.genres.forEach((genre) => {
          if (!uniqueGenres.has(genre)) {
            uniqueGenres.add(genre);
            totalNbUniqueGenres++;
          }
        });
      }
    });
  });

  // CREATE GLOBAL INFOS OBJECT
  globalInfos.value = {
    totalNbArtists: formatNumber(totalNbArtists),
    totalNbSongs: formatNumber(totalNbSongs),
    totalNbAlbums: formatNumber(totalNbAlbums),
    totalNbDeezerFans: formatNumber(totalNbDeezerFans),
    totalNbUniqueGenres: formatNumber(totalNbUniqueGenres),
  };
};

const setupTooltip = (tooltip, event, d) => {
  // Show the tooltip next to the cursor
  const cursor = d3.pointer(event, window);

  // Load the country data only once
  const countryData = data.value.find((country) => {
    return country.country === d.properties.name;
  });

  // Get info to display in tooltip
  const countryTootltipInfo = {
    name: countryData.country,
    nbArtists: formatNumber(countryData.artists.length),
    nbAlbums: formatNumber(
      countryData.artists.reduce((acc, artist) => {
        return acc + artist.nbAlbums;
      }, 0),
    ),
    nbSongs: formatNumber(
      countryData.artists.reduce((acc, artist) => {
        return acc + artist.nbSongs;
      }, 0),
    ),
  };

  // Styles for the tooltip
  tooltip
    .style("visibility", "visible")
    .style("left", cursor[0] + 10 + "px")
    .style("top", cursor[1] + 10 + "px");

  // Display tooltip
  tooltip.html(`
        <div class="flex flex-col p-1 gap-1">
          <span class="text-xl font-bold">${countryTootltipInfo.name}</span>
          <span class="w-full h-[2px] bg-white"></span>
          <span>${countryTootltipInfo.nbArtists} artiste(s)</span>
          <span>${countryTootltipInfo.nbAlbums} album(s)</span>
          <span>${countryTootltipInfo.nbSongs} chanson(s)</span>
        </div>
      `);
};

// Reset all values (click on the cross)
const resetAll = () => {
  d3.selectAll("path").attr("fill", "#ebebeb");
  countryInfo.value = {};
  artistList.value = [];
  displayedArtists.value = [];
  showGlobalStats.value = true;
  countryName.value = "";
  filterArtistName = "";
  currentPage.value = 1;
};

// Reset the filters (click on the bin)
const resetFilters = () => {
  filterArtistName = "";
  genresFilter.value = [];
  currentPage.value = 1;
  filterAndPaginateArtists();
};

// Handling toggle full map
const toggleFullMap = () => {
  fullMap.value = !fullMap.value;

  if (fullMap.value) {
    d3.select("#worldMap").attr("width", "100%");
  } else {
    d3.select("#worldMap").attr("width", "50%");
  }
};

// Add new genre to filter
const addGenreFilter = (genre: string) => {
  // If genre already in filter, do not add it
  if (genresFilter.value.includes(genre)) {
    return;
  } else {
    genresFilter.value = [...genresFilter.value, genre];
  }
  currentPage.value = 1;
  filterAndPaginateArtists();
};

// Remove genre from filter
const removeGenre = (genre: string) => {
  genresFilter.value = genresFilter.value.filter((g) => g !== genre);
  currentPage.value = 1;
  filterAndPaginateArtists();
};

// Filtered + paginated artists
const displayedArtists = ref([...artistList.value]); // Define paginatedArtists as a ref

// Filter and paginate artists
const filterAndPaginateArtists = () => {
  // Reset artists value to original value
  // Check also the genres
  artistList.value = countryInfo.value.artists
    .filter((artist) => {
      const artistName = artist.artist.toLowerCase();
      const searchName = filterArtistName.toLowerCase().trim();
      const genres = artist.genres.map((genre) => genre.toLowerCase());

      // Check if the artist's name contains the search term
      const nameMatch = artistName.includes(searchName);

      // Check if the artist's genres is in the genres filter
      const genresMatch = genresFilter.value.every((genre) =>
        genres.includes(genre.toLowerCase()),
      );

      return nameMatch && genresMatch; // We have an 'AND' condition since we need to match on both the name + genres selected
    })
    .sort((a, b) => {
      return b.deezerFans - a.deezerFans;
    });

  // If nb of artists is less than itemsPerPage, set currentPage to 1
  if (
    (filterArtistName && artistList.value.length < itemsPerPage) ||
    (artistList.value.length < currentPage.value * itemsPerPage &&
      currentPage.value !== totalPages.value)
  ) {
    currentPage.value = 1;
  }

  // Paginate the filtered artists
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  displayedArtists.value = artistList.value.slice(start, end);
};

const setCurrentPage = (page: number) => {
  currentPage.value = page;
};

const totalPages = computed(() => {
  return countryInfo.value
    ? Math.ceil(artistList.value.length / itemsPerPage)
    : 0;
});

const getMiddlePage = () => {
  return Math.ceil(totalPages.value / 2);
};

// Check if page changed, if so, filter and paginate artists
watch([currentPage], () => {
  filterAndPaginateArtists();
});
</script>
