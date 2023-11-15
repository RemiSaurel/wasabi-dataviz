<template>
  <LoadingSpinner v-if="isLoading" :isLoading="isLoading" />
  <svg></svg>
</template>

<style scoped></style>

<script setup lang="ts">
import * as d3 from "d3";
import {onMounted, ref} from "vue";
import {formatNumber} from "../../utils/functions";
import LoadingSpinner from "../LoadingSpinner.vue";

const isLoading = ref(true);

onMounted(async () => {
  const data = await d3.json(import.meta.env.BASE_URL + "data/full_genres_clean.json");
  // Specify the dimensions of the chart.
  const data_without_unknown = {
    "name": "All genres",
    "children" : data.children.filter((d) => d.name !== "Unknown")
  };

  const width = 900;
  const height = width;
  const margin = 1; // to avoid clipping the root circle stroke

  // Specify the number format for values.
  const format = d3.format(",d");

  // Create the pack layout.
  const pack = d3.pack()
      .size([width - margin * 2, height - margin * 2])
      .padding(3);

  // Compute the hierarchy from the JSON data; recursively sum the
  // values for each node; sort the tree by descending value; lastly
  // apply the pack layout.
  const root = pack(d3.hierarchy(data_without_unknown)
      .sum(d => d.nbFans)
      .sort((a, b) => b.nbFans - a.nbFans));

  // Create the SVG container.
  const svg = d3.select("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-margin, -margin, width, height])
      .attr("style", "width: 100%; height: auto; font: 5px sans-serif;")
      .attr("text-anchor", "middle");

  // Place each node according to the layout’s x and y values.
  const node = svg.append("g")
      .selectAll()
      .data(root.descendants())
      .join("g")
      .attr("transform", d => `translate(${d.x},${d.y})`);

  // Create a tooltip element
  const tooltip = d3.select("body")
      .append("div")
      .attr(
          "class",
          "tooltip bg-neutral-800 text-lg text-white pt-1 p-2 rounded-md",
      )
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden");

  const setupTooltip = (tooltip, event, d) => {
    // Show the tooltip next to the cursor
    const cursor = d3.pointer(event, window);
    tooltip
        .style("visibility", "visible")
        .style("left", cursor[0] + 10 + "px")
        .style("top", cursor[1] + 10 + "px");

    // Display tooltip content
    if (d.data.nbFans && d.data.nbAlbums && d.data.nbSongs) {
      tooltip.html(`
        <div class="flex flex-col p-1 gap-1">
          <span class="text-xl font-bold">${d.data.name}</span>
          <span class="w-full h-[2px] bg-white"></span>
          <span>${format(d.data.nbFans)} fan(s)</span>
          <span>${d.data.nbAlbums} album(s)</span>
          <span>${d.data.nbSongs} chanson(s)</span>
          <span>${d.data.country}</span>
        </div>
      `);
    } else {
      tooltip.html(`
        <div class="flex flex-col p-1 gap-1">
          <span class="text-xl font-bold">${d.data.name}</span>
          <span class="w-full h-[2px] bg-white"></span>
          <span>${formatNumber(d.value)} fan(s)</span>
        </div>
      `);
    }

  };

  // Add a filled or stroked circle.
  node.append("circle")
      .attr("fill", d => d.children ? "#FFFFFF" : "#B0C4DE")
      .attr("stroke", d => d.children ? "#22427C" : null)
      .attr("r", d => d.r)
      .on("mouseenter", function (event, d) {
        setupTooltip(tooltip, event, d);

        d3.select(this).attr("fill", "#22427C");
        // Cursor becomes a pointer
        d3.select(this).attr("cursor", "pointer");
      })
      .on("mouseleave", function (event, d) {
        // Hide and clear the tooltip
        tooltip.style("visibility", "hidden");
        if(d.data.nbFans) {
          d3.select(this).attr("fill", "#B0C4DE");
        } else {
          d3.select(this).attr("fill", "#FFFFFF");
        }
      })

  // Add a label to leaf nodes.
  const text = node
      .filter(d => !d.children && d.r > 10)
      .append("text")
      .attr("clip-path", d => `circle(${d.r})`);

  // Add a tspan for each CamelCase-separated word.
  text.selectAll()
      .data(d => d.data.name.split(/(?=[A-Z][a-z])|\s+/g))
      .join("tspan")
      .attr("x", 0)
      .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.35}em`)
      .text(d => d);

  // Add a tspan for the node’s value.
  text.append("tspan")
      .attr("x", 0)
      .attr("y", d => `${d.data.name.split(/(?=[A-Z][a-z])|\s+/g).length / 2 + 0.35}em`)
      .attr("fill-opacity", 0.7)
      .text(d => formatNumber(d.value));

  isLoading.value = false;
});
</script>