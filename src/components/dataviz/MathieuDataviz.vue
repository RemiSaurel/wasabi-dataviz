<script setup lang="ts">
import * as d3 from "d3";
import { ref, onMounted } from "vue";

const data = ref(null);
const isLoading = ref(true);

// Read the data
onMounted(async () => {
  // Import data from file
  const response = await fetch(import.meta.env.BASE_URL + "data/artist_mathieu.json");
  // Transform our data to a json object
  data.value = await response.json();

  // Take only the first 1000 data points
  data.value = data.value.slice(0, 1000);
  data.value = data.value.filter((d) => {
    return d.carrier.begin != 0
  })

  // set the dimensions and margins of the graph
  const margin = { top: 100, right: 50, bottom: 120, left: 50 };
  const width = 1500 - margin.left - margin.right;
  const height = 420 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = d3.select("#chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Add X axis
  const x = d3.scaleLinear()
      .domain([
        1900,
        d3.max(data.value, d => d.carrier.end),
      ])
      .range([0, width/2]);

  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add Y axis
  const y = d3.scaleLinear()
      .domain([
        d3.min(data.value, d => (d.albums && d.albums.length) ? d.albums.length : 0),
        d3.max(data.value, d => (d.albums && d.albums.length) ? d.albums.length : 0),
      ])
      .range([height, -50]);

  svg.append("g")
      .call(d3.axisLeft(y));

  // Add X axis label
  svg.append("text")
      .attr("transform", "translate(" + (width / 4) + " ," + (margin.top+height-40) + ")")
      .style("text-anchor", "middle")
      .text("Carrier Begins");

  // Add Y axis label
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Number of Albums");

  // Add a log scale for bubble size
  const z = d3.scaleLog()
      .base(10)  // Logarithmic base
      .domain([
        d3.min(data.value, d => (d.popularity) ? d.popularity : 0.1),  // Adjust the min value as needed
        d3.max(data.value, d => (d.popularity) ? d.popularity : 0.1),  // Adjust the max value as needed
      ])
      .range([1, 20]);  // Adjust the range as needed

  // Add dots
  svg.append('g')
      .selectAll("dot")
      .data(data.value)
      .enter()
      .append("circle")
      .attr("cx", d => (d.carrier && d.carrier.begin) ? x(d.carrier.begin) : 0)
      .attr("cy", d => (d.albums && d.albums.length) ? y(d.albums.length) : 0)
      .attr("r", d => (d.popularity) ? z(d.popularity) : 0)
      .style("fill", d => (d.popularity && d.popularity > 40000) ? "red" : "#69b3a2")  // Change color if popularity > 40000
      .style("opacity", "0.7")
      .attr("stroke", "black");
});

</script>

<template>
  <svg id="chart" />
</template>

<style scoped></style>
