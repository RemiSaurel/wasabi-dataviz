<template>
  <!--add a grid to display the title the chart and the artist card-->
  <h1 class="text-3xl font-bold text-center">Nuage de Points - Artistes</h1>
  <div class="flex gap-8">
    <!-- Nuage de points -->

      <svg id="chart" class="bg-neutral-200 rounded-lg "></svg>

    <!-- Composant artist card à droite du nuage de points s'affiche onclick sur circle -->
    <div>
      <ArtistCard v-if="selectedArtist" :artist="selectedArtist"  />
      <div v-else>
        <p>Artistes.</p>
      </div>
    </div>


    <div class="h-4"></div>
  </div>


</template>

<script setup lang="ts">
import * as d3 from "d3";
import { ref, onMounted } from "vue";
import ArtistCard from "../artist/ArtistCard.vue";
const data = ref(null);
const chart = ref(null);
const legendTitle = "Nombre de fans Deezer"
const yAxisLabel = "Moyenne de fans par album"
const xAxisLabel = "Nombre d'albums"
const selectedArtist = ref(null);

onMounted(async () => {
  // Importing data from json file
  const response = await fetch(
    import.meta.env.BASE_URL + "data/ch_artists_infos.json",
  );

  data.value = await response.json();
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
  chart.append("g").attr("transform", `translate(0, ${height})`).call(xAxis);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data.value, (d) => d.avgAlbumsFans)])
    .range([height, 0]);

  const yAxis = d3.axisLeft(yScale);
  chart.append("g").call(yAxis);
  //add labels to X and Y axis
  chart
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .text(xAxisLabel);
  // Y axis label:
  chart
    .append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 24)
    .attr("x", -margin.top - height / 2 + 104)
    .text(yAxisLabel);

  // Create a sequential color scale for deezer fans
  const colorScale = d3
    .scaleSequential(d3.interpolateReds)
    .domain([0, d3.max(data.value, (d) => d.deezerFans)]);

  chart
    .selectAll("circle")
    .data(data.value)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.nbAlbums))
    .attr("cy", (d) => yScale(d.avgAlbumsFans))
    .attr("r", 4)
    .attr("fill", (d) => colorScale(d.deezerFans));
  //add legend for color scale
  const legend = chart
    .append("g")
    .attr("class", "legend")
    .attr("transform", "translate(" + (width - 104) + "," + 24 + ")")
    .selectAll("g")
    .data(colorScale.ticks(6).reverse())
    .enter()
    .append("g");
  //add legend color
  legend
    .append("rect")
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
    .attr("x", -8)
    .attr("y", -16)
    .attr("dy", ".35em")
    .text(legendTitle);
  //add on hover tooltip
  chart
    .selectAll("circle")
    .on("mouseover", function (event, d) {
      d3.select(this).attr("r", 8);
      chart
        .append("text")
        .attr("id", "tooltip")
        .attr("x", xScale(d.nbAlbums) + 8)
        .attr("y", yScale(d.avgAlbumsFans) - 8)
        .text(d.artist + " (" + d.deezerFans + " deezer fans)")
        .style("font-size", "12px")
        .style("font-weight", "bold");
    })
    .on("mouseout", function (event, d) {
      d3.select(this).attr("r", 4);
      d3.select("#tooltip").remove();
    });
  //add on click event
  chart
    .selectAll("circle")
    .on("click", function (event, d) {
      selectedArtist.value = d;
      console.log(selectedArtist.value);
    });

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
