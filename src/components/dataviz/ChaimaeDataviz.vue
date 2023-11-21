<template>
  <!--add title-->
  <h2 class="text-2xl font-bold mt-6">Bar chart - Artistes</h2>
  <div class="flex gap-8">
    <svg id="chart" class="bg-neutral-200 rounded-lg"></svg>
    <div>
      <label for="nbSongs" class="block text-lg font-medium text-gray-700 mt-8"
        >Nombre de chansons:</label
      >
      <div class="mt-4 relative rounded-md shadow-sm">
        <select
          v-model="selectedNbSongs"
          id="nbSongs"
          name="nbSongs"
          class="form-select block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="all">Tous</option>
          <option value="0-50">0 - 50</option>
          <option value="50-100">50 - 100</option>
          <option value="100-200">100 - 200</option>
          <option value="200-500">200 - 500</option>
          <option value="500-1000">500 - 1000</option>
        </select>
      </div>
      <!--add select for deezer fans using the scale-->
      <label
        for="deezerFans"
        class="block text-lg font-medium text-gray-700 mt-8"
        >Nombre de fans Deezer:</label
      >
      <div class="mt-4 relative rounded-md shadow-sm">
        <select
          v-model="selectedDeezerFans"
          id="deezerFans"
          name="deezerFans"
          class="form-select block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="all">Tous</option>
          <option value="0-2000000">0 - 2M</option>
          <option value="2000000-4000000">2M - 4M</option>
          <option value="4000000-6000000">4M - 6M</option>
          <option value="6000000-8000000">6M - 8M</option>
          <option value="8000000-10000000">8M - 10M</option>
        </select>
      </div>
      <div class="mt-8">
        <ArtistCard
          v-if="selectedArtist"
          :artist="selectedArtist"
          :lifeSpan="selectedLifeSpan"
        />
      </div>
    </div>

    <div class="h-4"></div>
  </div>
</template>

<script setup lang="ts">
import * as d3 from "d3";
import { ref, onMounted } from "vue";
import ArtistCard from "../artist/ArtistCard.vue";
import { formatNumber } from "../../utils/functions";

const data = ref(null);
const chart = ref(null);
const legendTitle = "Nombre de fans Deezer";
const yAxisLabel = "Moyenne de fans par album";
const xAxisLabel = "Nombre d'albums";
const selectedArtist = ref(null);
const selectedNbSongs = ref("all");
const selectedDeezerFans = ref("all");
const lifeSpan = ref(null);
const selectedLifeSpan = ref(null);

onMounted(async () => {
  // Importing data from json file
  const response_artist = await fetch(
    import.meta.env.BASE_URL + "data/ch_artists_infos.json",
  );

  data.value = await response_artist.json();
  const response_lifespan = await fetch(
    import.meta.env.BASE_URL + "data/ch_lifespan.json",
  );
  lifeSpan.value = await response_lifespan.json();
  // Set the dimensions and margins of the graph
  const margin = { top: 24, right: 72, bottom: 48, left: 96 };
  const width = 1000 - margin.left - margin.right;
  const height = 720 - margin.top - margin.bottom;

  // Create the svg element chart
  const chart = d3
    .select("#chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  // Create the scales for X and Y axis
  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data.value, (d) => d.nbAlbums)])
    .range([0, width - 200]);

  const xAxis = d3.axisBottom(xScale);
  chart
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis)
    .selectAll("text")
    .style("font-weight", "bold")
    .style("font-size", "12px")
    .style("text-anchor", "end");

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data.value, (d) => d.avgAlbumsFans)])
    .range([height, 0]);

  const yAxis = d3.axisLeft(yScale);
  chart
    .append("g")
    .call(yAxis)
    .selectAll("text")
    .style("font-weight", "bold")
    .style("font-size", "12px")
    .style("text-anchor", "end")
    .attr("dx", "-.8em");
  //add labels to X and Y axis
  chart
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .text(xAxisLabel)
    .style("font-size", "12px")
    .style("font-weight", "bold");
  // Y axis label:
  chart
    .append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 24)
    .attr("x", -margin.top - height / 2)
    .text(yAxisLabel)
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .style("text-anchor", "middle")
    .style("fill", "black");

  // Create a sequential color scale for deezer fans
  const colorScale = d3
    .scaleSequential(d3.interpolateReds)
    .domain([0, d3.max(data.value, (d) => d.deezerFans)]);
  // Add bars to the chart
  chart
    .selectAll("rect")
    .data(data.value)
    .enter()
    .append("rect")
    .attr("x", (d) => xScale(d.nbAlbums))
    .attr("y", (d) => yScale(d.avgAlbumsFans))
    .attr("width", 8) // Largeur des barres
    .attr("height", (d) => height - yScale(d.avgAlbumsFans))
    .attr("fill", (d) => colorScale(d.deezerFans));
  //add legend for color scale
  const legend = chart
    .append("g")
    .attr("class", "legend")
    .attr("id", "legend")
    .attr("transform", "translate(" + (width - 104) + "," + 24 + ")")
    .selectAll("g")
    .data(colorScale.ticks(6).reverse())
    .enter()
    .append("g");
  //add legend color
  legend
    .append("rect")
    .attr("class", "legend")
    .attr("width", 24)
    .attr("height", 24)
    .attr("y", function (d, i) {
      return i * 24;
    })
    .attr("fill", colorScale);
  //add legend text
  legend
    .append("text")
    .attr("x", 32)
    .attr("y", function (d, i) {
      return i * 24 + 8;
    })
    .attr("dy", ".35em")
    .text(String);
  //add legend title
  legend
    .append("text")
    .attr("x", -24)
    .attr("y", -16)
    .attr("dy", ".35em")
    .text(legendTitle);
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

  //add on mouseover tooltip
  chart
    .selectAll("rect")
    // ignore the id "legend" from all the listeners
    .filter(function (d) {
      return d3.select(this).attr("class") != "legend";
    })
    .on("mouseover", function (event, d) {
      // If hover on legends don't show tooltip
      setUpTooltip(tooltip, event, d);
      d3.select(this).attr("width", 12);
    })
    .on("mouseout", function (event, d) {
      tooltip.style("visibility", "hidden");
      // reset the width of the bar
      d3.select(this).attr("width", 8);
    });
  //add on click event
  chart.selectAll("rect").on("click", function (event, d) {
    selectedArtist.value = d;
    //find the artist in the lifespan data
    selectedLifeSpan.value = lifeSpan.value.find(
      (artist) => artist.artist == d.artist,
    );
    console.log(selectedLifeSpan.value);
  });
  let nbSelectedArtists = data.value.length;
  //add filter to choose by categories of nbSongs
  const nbSongsFilter = d3.select("#nbSongs");
  nbSongsFilter.on("change", function (event, d) {
    selectedNbSongs.value = this.value;
    console.log(selectedNbSongs.value);
    if (selectedNbSongs.value == "all") {
      chart.selectAll("rect").attr("visibility", "visible");
      nbSelectedArtists = data.value.length;
      nbArtists.text("Nombre d'artistes: " + nbSelectedArtists);
    } else {
      let selected = chart
        .selectAll("rect")
        .attr("visibility", "hidden")
        .filter(function (d) {
          return (
            d.nbSongs >= selectedNbSongs.value.split("-")[0] &&
            d.nbSongs <= selectedNbSongs.value.split("-")[1]
          );
        })
        .attr("visibility", "visible");

      // Check for deezerFansFilter if it's not all and apply it
      if (selectedDeezerFans.value != "all") {
        selected = selected
          .attr("visibility", "hidden")
          .filter(function (d) {
            return (
              d.deezerFans >= selectedDeezerFans.value.split("-")[0] &&
              d.deezerFans <= selectedDeezerFans.value.split("-")[1]
            );
          })
          .attr("visibility", "visible");
      }
      legend.selectAll("rect").attr("visibility", "visible");
      //update number of artists
      nbSelectedArtists = selected._groups[0].length;
      nbArtists.text("Nombre d'artistes: " + nbSelectedArtists);
    }
  });

  //add filter to choose by categories of deezer fans
  const deezerFansFilter = d3.select("#deezerFans");
  deezerFansFilter.on("change", function (event, d) {
    selectedDeezerFans.value = this.value;
    if (selectedDeezerFans.value == "all") {
      chart.selectAll("rect").attr("visibility", "visible");
      nbSelectedArtists = data.value.length;
      nbArtists.text("Nombre d'artistes: " + nbSelectedArtists);
    } else {
      let selected = chart
        .selectAll("rect")
        .attr("visibility", "hidden")
        .filter(function (d) {
          return (
            d.deezerFans >= selectedDeezerFans.value.split("-")[0] &&
            d.deezerFans <= selectedDeezerFans.value.split("-")[1]
          );
        })
        .attr("visibility", "visible");
      // Check for nbSongsFilter if it's not all and apply it
      if (selectedNbSongs.value != "all") {
        selected = selected
          .filter(function (d) {
            return (
              d.nbSongs >= selectedNbSongs.value.split("-")[0] &&
              d.nbSongs <= selectedNbSongs.value.split("-")[1]
            );
          })
          .attr("visibility", "visible");
      }

      legend.selectAll("rect").attr("visibility", "visible");
      //update number of artists
      nbSelectedArtists = selected._groups[0].length;
      nbArtists.text("Nombre d'artistes: " + nbSelectedArtists);
    }
  });
  // add number of artists
  nbSelectedArtists = data.value.length;
  const nbArtists = chart
    .append("text")
    .attr("x", width - 104)
    .attr("y", height - 24)
    .attr("dy", ".35em")
    .text("Nombre d'artistes: " + nbSelectedArtists)
    .style("font-size", "12px")
    .style("font-weight", "bold");

  //add tooltip function
  const setUpTooltip = (tooltip, event, d) => {
    tooltip
      .html(
        `<div class="flex flex-col p-1 gap-1">
          <span class="text-xl font-bold">${d.artist}</span>
           <span class="w-full h-[2px] bg-white"></span>
            <span >${d.nbAlbums} Albums</span>
        <span>${d.nbSongs} Chansons</span>
        <span>${formatNumber(d.deezerFans)} Fans deezer </span>
          </div>`,
      )
      .style("visibility", "visible")
      .style("top", event.pageY - 24 + "px")
      .style("left", event.pageX + 24 + "px");
  };
});
</script>

<style scoped>
/* Add style to h2*/
h2 {
  text-align: center;
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 20px;
}
</style>
