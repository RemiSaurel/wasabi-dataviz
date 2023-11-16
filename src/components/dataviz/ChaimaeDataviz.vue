<template>
  <div>
    <h2>Nuage de Points - Artistes</h2>
    <svg id="chart" class="bg-neutral-200 rounded-lg"></svg>
    <div class="h-4"></div>
  </div>
</template>

<script setup lang="ts">
import * as d3 from "d3";
import { ref, onMounted } from "vue";
const data = ref(null);
const chart = ref(null);
// Importez les données depuis le fichier JSON

onMounted(async () => {
  const response = await fetch(
    import.meta.env.BASE_URL + "data/ch_artists_infos.json",
  );

  data.value = await response.json();

  const margin = { top: 24, right: 70, bottom: 48, left: 100 };
  const width = 1000 - margin.left - margin.right;
  const height = 700 - margin.top - margin.bottom;

  // Créer le nuage de points
  const chart = d3
    .select("#chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  // Créer l'échelle pour les axes
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
    .text("Nombre d'albums");
  // Y axis label:
  chart
    .append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 24)
    .attr("x", -margin.top - height / 2 + 100)
    .text("Moyenne de fans par album");

  // Créer l'échelle de couleur pour le nombre de fans
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
    .attr("transform", "translate(" + (width - 100) + "," + 20 + ")")
    .selectAll("g")
    .data(colorScale.ticks(6).reverse())
    .enter()
    .append("g");
  //add legend color
  legend
    .append("rect")
    .attr("width", 20)
    .attr("height", 20)
    .attr("y", function (d, i) {
      return i * 20;
    })
    .attr("fill", colorScale);
  //add legend text
  legend
    .append("text")
    .attr("x", 30)
    .attr("y", function (d, i) {
      return i * 20 + 9;
    })
    .attr("dy", ".35em")
    .text(String);
  //add legend title
  legend
    .append("text")
    .attr("x", -10)
    .attr("y", -20)
    .attr("dy", ".35em")
    .text("Nombre de fans Deezer");
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
/* Add style to svg*/
svg {
  display: block;
  margin: auto;
}
</style>
