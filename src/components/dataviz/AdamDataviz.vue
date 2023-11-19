<template>
  <LoadingSpinner v-if="isLoading" :isLoading="isLoading"/>
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
    "children": data.children.filter((d) => d.name !== "Unknown")
  };
  //remove all the artists with less then 50 000 fans
  for (let i = 0; i < data_without_unknown.children.length; i++) {
    data_without_unknown.children[i].children = data_without_unknown.children[i].children.filter((d) => d.nbFans > 50000);
  }

  const width = 928;
  const height = width;

  // Specify the number format for values.
  const format = d3.format(",d");

  // Create the pack layout.
  const pack = d3.pack()
      .size([width, height])
      .padding(3);

  // Create the color scale.
  const color = d3.scaleLinear()
      .domain([0, 2])
      .range(["#B0C4DE", "#12427C"]);

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
      .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
      .attr("style", "width: 100%; height: 100%; margin : 2 0 0 0; font: 5px sans-serif;")
      .attr("text-anchor", "middle");



  // Place each node according to the layout’s x and y values.
  // Append the nodes.
  const node = svg.append("g")
      .selectAll("circle")
      .data(root.descendants())
      .join("circle")
      .attr("fill", d => d.children ? color(d.depth) : "white")
      .on("mouseover", function (event, d) {
        setupTooltip(tooltip, event, d);
        d3.select(this).attr("stroke", "#000");
      })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
        d3.select(this).attr("stroke", null);
      })
      .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));

  // Append the text labels.
  const label = svg.append("g")
      .style("font", "10px sans-serif")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(root.descendants())
      .join("text")
      .style("fill-opacity", d => d.parent === root ? 1 : 0)
      .style("display", d => d.parent === root ? "inline" : "none")
      .text(d => d.data.name)
      .attr("clip-path", d => `circle(${d.r})`);

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

  svg.on("click", (event) => zoom(event, root));
  let focus = root;
  let view;
  zoomTo([focus.x, focus.y, focus.r * 2]);

  function zoomTo(v) {
    const k = width / v[2];

    view = v;

    label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
    node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
    node.attr("r", d => d.r * k);
  }

  function zoom(event, d) {
    focus = d;

    const transition = svg.transition()
        .duration(event.altKey ? 7500 : 750)
        .tween("zoom", d => {
          const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
          return t => zoomTo(i(t));
        });

    label
        .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
        .filter(d => d.r > 10)
        .transition(transition)
        .style("fill-opacity", d => d.parent === focus ? 1 : 0)
        .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
        .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
  }

  isLoading.value = false;
});
</script>