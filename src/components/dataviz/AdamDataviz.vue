<template>
  <h1 class="circular-packing">
    Circular packing des genres par leur popularité
  </h1>
  <div class="h-[90%]">
    <LoadingSpinner v-if="isLoading" :isLoading="isLoading" />
    <svg></svg>
  </div>
  <div class="flex">
    <b class="w-1/6">Nombre de fans minimum : </b>
    <input
      class="w-5/6 accent-[#12427C]"
      type="range"
      v-model="range_nbFans"
      :min="nbFansMin"
      :max="nbFansMax"
      :step="nbFansStep"
    />
    <span>{{ range_nbFans }}</span>
  </div>
</template>

<style scoped></style>
<script setup lang="ts">
import * as d3 from "d3";
import { onMounted, ref, watch } from "vue";
import { formatNumber } from "../../utils/functions";
import LoadingSpinner from "../LoadingSpinner.vue";

const nbFansMin = ref(50000);
const nbFansMax = ref(1000000);
const nbFansStep = ref(50000);
const isLoading = ref(true);
const range_nbFans = ref(500000);
let svg = null;

onMounted(async () => {
  await generateCircularPacking();
  isLoading.value = false;
});

//do something when the range_nbFans changes
watch(
  () => range_nbFans.value,
  async () => {
    isLoading.value = true;
    // Remove the existing svg
    svg.selectAll("*").remove();
    await generateCircularPacking();
    isLoading.value = false;
  },
);

function constructCircularPacking(dataWithoutUnknown: any) {
  //Removing all the artists with less then 50k fans
  for (let i = 0; i < dataWithoutUnknown.children.length; i++) {
    dataWithoutUnknown.children[i].children = dataWithoutUnknown.children[
      i
    ].children.filter((d) => d.nbFans > range_nbFans.value);
  }

  //Removing all the genres without any artists
  dataWithoutUnknown.children = dataWithoutUnknown.children.filter(
    (d) => d.children.length > 0,
  );

  // Specify the dimensions of the chart.
  const width = 928;
  const height = width;

  // Specify the number format for values.
  const format = d3.format(",d");

  let fontsize = d3.scaleOrdinal().domain([1, 3]).range([12, 16]);

  // Create the pack layout.
  const pack = d3.pack().size([width, height]).padding(3);

  // Create the color scale.
  const color = d3.scaleLinear().domain([0, 2]).range(["#B0C4DE", "#12427C"]);

  // Compute the hierarchy from the JSON data; recursively sum the
  // values for each node; sort the tree by descending value; lastly
  // apply the pack layout.
  const root = pack(
    d3
      .hierarchy(dataWithoutUnknown)
      .sum((d) => d.nbFans)
      .sort((a, b) => b.nbFans - a.nbFans),
  );

  // Create the SVG container.
  svg = d3
    .select("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
    .attr(
      "style",
      "width: 100%; height: 100%; margin : 2 0 0 0; font: 5px sans-serif;",
    )
    .attr("text-anchor", "middle");

  // Place each node according to the layout’s x and y values.
  // Append the nodes.
  const node = svg
    .append("g")
    .selectAll("circle")
    .data(root.descendants())
    .join("circle")
    .attr("fill", (d) => color(d.depth))
    .style("cursor", "pointer")
    .on("mouseover", function (event, d) {
      setupTooltip(tooltip, event, d);
      d3.select(this).attr("stroke", d.depth > 1 ? "#fff" : "#000");
    })
    .on("mouseout", function () {
      tooltip.style("visibility", "hidden");
      d3.select(this).attr("stroke", null);
    })
    .on(
      "click",
      (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()),
    );

  // Append the text labels.
  const label = svg
    .append("g")
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .selectAll("text")
    .data(root.descendants())
    .enter()
    .append("text")
    .style("fill-opacity", (d) => (d.depth === 1 ? 1 : 0))
    .style("display", (d) => (d.value < 100000 ? "none" : "inline"))
    .style("font", (d) => fontsize(d.depth) + "px arial")
    .text((d) => d.data.name)
    .style("fill", "white")
    .style("text-shadow", "2px 2px 0px black")
    .style("font-weight", "bold")
    .attr("clip-path", (d) => `circle(${d.r})`);

  // Create a tooltip element
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

    label
      .attr(
        "transform",
        (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`,
      )
      .attr("clip-path", (d) => `circle(${d.r * k})`)
      .style("display", (d) =>
        d.value < 200000 && d.depth > 1 ? "none" : "inline",
      );
    node.attr(
      "transform",
      (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`,
    );
    node.attr("r", (d) => d.r * k);
  }

  function zoom(event, d) {
    focus = d;

    const transition = svg
      .transition()
      .duration(event.altKey ? 7500 : 750)
      .tween("zoom", (d) => {
        const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
        return (t) => zoomTo(i(t));
      });

    //TODO : show the label on the leafs when zooming
    label
      .filter(function (d) {
        return d.parent === focus || this.style.display === "inline";
      })
      .transition(transition)
      .style("fill-opacity", (d) => (d.parent === focus ? 1 : 0))
      .on("start", function (d) {
        if (d.parent === focus) this.style.display = "inline";
      })
      .on("end", function (d) {
        if (d.parent !== focus) this.style.display = "none";
      });
  }
}

async function readJson(url: string) {
  return await d3.json(import.meta.env.BASE_URL + url);
}

//Removing the unknown genre (too big and not interesting)
function cleanData(data: any) {
  return {
    name: "All genres",
    children: data.children.filter((d) => d.name !== "Unknown"),
  };
}

async function generateCircularPacking() {
  const data = await readJson("data/full_genres_clean.json");
  const dataWithoutUnknown = cleanData(data);
  constructCircularPacking(dataWithoutUnknown);
}
</script>
