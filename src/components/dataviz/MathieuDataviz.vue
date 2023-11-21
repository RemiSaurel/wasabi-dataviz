<script setup lang="ts">
import * as d3 from "d3";
import { ref, onMounted } from "vue";
import { formatNumber } from "../../utils/functions";

const data = ref(null);
let artistName = ref("");
let nbAlbums = ref(null);
let popularity = ref(null);
let selectedArtistInfo = ref(null);
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
// Read the data
onMounted(async () => {
  // Import data from file
  const response = await fetch(
    import.meta.env.BASE_URL + "data/artist_mathieu.json",
  );
  // Transform our data to a json object
  data.value = await response.json();

  // Take only the first 1000 data points
  data.value = data.value.slice(0, 10000);
  data.value = data.value.filter((d) => {
    return d.carrier.begin > 1900;
  });

  // set the dimensions and margins of the graph
  const margin = { top: 100, right: 100, bottom: 120, left: 50 };
  const width = 900 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;
  // append the svg object to the body of the page
  const svg = d3
    .select("#chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .classed("svg-content-responsive", true)
    // call d3 Zoom that resize the axes
    .call(
      d3.zoom().on("zoom", function (event) {
        svg.attr("transform", event.transform);
        // Resize the axes
      }),
    )
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Add X axis
  const x = d3
    .scaleLinear()
    .domain([0, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90])
    .range([0, width / 10]);

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  const y = d3
    .scaleLinear()
    .domain([
      d3.min(data.value, (d) =>
        d.albums && d.albums.length ? d.albums.length : 0,
      ),
      d3.max(data.value, (d) =>
        d.albums && d.albums.length ? d.albums.length : 0,
      ),
    ])
    .range([height, -50]);

  svg.append("g").call(d3.axisLeft(y));

  // Add X axis label
  const xAxis = svg
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 4 + " ," + (margin.top + height - 40) + ")",
    )
    .style("text-anchor", "middle")
    .text("Career Length");

  // Add Y axis label
  const yAxis = svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Number of Albums");

  // Add a log scale for bubble size
  const z = d3
    .scaleLog()
    .base(10) // Logarithmic base
    .domain([
      d3.min(data.value, (d) => (d.popularity ? d.popularity : 0.1)), // Adjust the min value as needed
      d3.max(data.value, (d) => (d.popularity ? d.popularity : 0.1)), // Adjust the max value as needed
    ])
    .range([1, 20]); // Adjust the range as needed

  // Add dots
  svg
    .append("g")
    .selectAll("dot")
    .data(data.value)
    .enter()
    .append("circle")
    .attr("cx", (d) =>
      d.carrier && d.carrier.begin ? x(d.carrier.end - d.carrier.begin) : 0,
    )
    .attr("cy", (d) => (d.albums && d.albums.length ? y(d.albums.length) : 0))
    .attr("r", (d) => (d.popularity ? z(d.popularity) : 0))
    .style("fill", (d) =>
      d.members && d.members.length > 0 ? "red" : "#69b3a2",
    ) // Change color if artist solo or not
    .style("opacity", "0.7")
    .attr("stroke", "black")
    .on("click", function (event, d) {
      // Reset previous selected artist info
      selectedArtistInfo.value = d;
    })
    .on("mouseenter", function (event, d) {
      setupTooltip(tooltip, event, d);
      artistName = d.artist;
      nbAlbums = d.albums.length;
      popularity = d.popularity;
      d3.select(this).style("filter", "brightness(70%)");
      // Cursor becomes a pointer
      d3.select(this).attr("cursor", "pointer");
    })
    .on("mouseleave", function (event, d) {
      // Hide and clear the tooltip
      tooltip.style("visibility", "hidden");
      // Reset the color when mouse leaves
      d3.select(this).style("fill", (d) =>
        d.members && d.members.length > 0 ? "red" : "#69b3a2",
      );
      d3.select(this).style("filter", "brightness(100%)");
    });
});
const setupTooltip = (tooltip, event, d) => {
  // Show the tooltip next to the cursor
  const cursor = d3.pointer(event, window);

  // Get info to display in tooltip
  const circleTootltipInfo = {
    Artistname: d.artist,
    nbAlbums: formatNumber(d.albums.length),
    popularity: formatNumber(d.popularity),
  };

  // Styles for the tooltip
  tooltip
    .style("visibility", "visible")
    .style("left", cursor[0] + 10 + "px")
    .style("top", cursor[1] + 10 + "px");

  // Display tooltip
  tooltip.html(`
        <div class="flex flex-col p-1 gap-1">
          <span class="text-xl font-bold">${circleTootltipInfo.Artistname}</span>
          <span class="w-full h-[2px] bg-white"></span>
          <span>${circleTootltipInfo.popularity} followers(s)</span>
          <span>${circleTootltipInfo.nbAlbums} album(s)</span>
        </div>
      `);
};
</script>

<template>
  <div class="container mt-6 flex flex-col gap-4 xl:flex-row">
    <div class="chart-container flex flex-col gap-y-4">
      <div class="flex items-center justify-evenly">
        <span class="text-2xl font-bold text-center my-3">Bubble Chart</span>
        <div class="h-14 w-28 shadow bg-neutral-100 rounded px-2 pt-1 gap-2">
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded-full bg-[red] pt-1"></div>
            <span>Groupes</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded-full bg-[#69b3a2] pt-1"></div>
            <span>Solo</span>
          </div>
        </div>
      </div>
      <svg id="chart" />
    </div>
    <div
      class="bg-neutral-100 p-4 rounded-lg h-fit w-full"
      v-if="selectedArtistInfo"
    >
      <span class="text-2xl font-bold text-center">{{
        selectedArtistInfo.artist
      }}</span>
      <span class="w-full h-[2px] bg-white"></span>
      <ul>
        <span
          >{{ formatNumber(selectedArtistInfo.popularity) }} follower(s)</span
        >
      </ul>
      <span>{{ formatNumber(selectedArtistInfo.albums.length) }} album(s)</span>
      <span
        v-if="selectedArtistInfo.members && selectedArtistInfo.members.length"
        class="flex w-full h-1 my-2 rounded-2xl bg-gray-300"
      ></span>
      <div
        class="h-max-40 overflow-auto"
        v-if="selectedArtistInfo.members && selectedArtistInfo.members.length"
      >
        <h3 class="text-xl font-bold">Members</h3>
        <ul>
          <li v-for="member in selectedArtistInfo.members" :key="member">
            {{ member }}
          </li>
        </ul>
      </div>
      <span class="flex w-full h-1 my-2 rounded-2xl bg-gray-300"></span>

      <div
        class="h-80 overflow-auto"
        v-if="selectedArtistInfo.albums && selectedArtistInfo.albums.length"
      >
        <h3 class="text-xl font-bold">Albums</h3>
        <ul>
          <li v-for="album in selectedArtistInfo.albums" :key="album">
            {{ album }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex; /* Utilise Flexbox pour aligner les éléments en ligne */
}
</style>
