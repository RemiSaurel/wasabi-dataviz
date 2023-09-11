<template>
  <div>
    <h2>Line Chart</h2>
    <div id="container"></div>
  </div>
</template>

<script setup lang="ts">
import * as d3 from "d3";
import { onMounted } from "vue";

onMounted(() => {
  // Generate sample data for the line chart.
  const data = generateData();

  // Declare the chart dimensions and margins.
  const width = 1000;
  const height = 400;
  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 30;
  const marginLeft = 40;

  // Declare the x (horizontal position) scale.
  const x = d3
    .scaleUtc()
    .domain(d3.extent(data, (d) => d.date))
    .range([marginLeft, width - marginRight]);

  // Declare the y (vertical position) scale.
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value)])
    .range([height - marginBottom, marginTop]);

  // Create the SVG container.
  const svg = d3.create("svg").attr("width", width).attr("height", height);

  // Add the x-axis.
  svg
    .append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x));

  // Add the y-axis.
  svg
    .append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y));

  // Create a line generator.
  const line = d3
    .line()
    .x((d) => x(d.date))
    .y((d) => y(d.value));

  // Add the line chart path.
  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", line);

  // Append the SVG element to the container.
  const container = d3.select("#container");
  container.node().append(svg.node());
});

// Function to generate sample data.
function generateData() {
  const startDate = new Date("2023-01-01");
  const endDate = new Date("2023-12-31");
  const data = [];
  const daysInYear = d3.timeDay.count(startDate, endDate);

  for (let i = 0; i < daysInYear; i++) {
    const date = d3.timeDay.offset(startDate, i);
    const value = Math.random() * 100;
    data.push({ date, value });
  }

  return data;
}
</script>
