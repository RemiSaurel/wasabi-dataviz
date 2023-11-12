<template>
  <div>
    <svg width="800" height="600" id="spider-chart">
    </svg>
  </div>
</template>

<script setup lang="ts">
import * as d3 from 'd3';
import { onMounted } from "vue";

onMounted(() => {
  const data = [
    { category: 'Catégorie 1', value: 4 },
    { category: 'Catégorie 2', value: 7 },
    { category: 'Catégorie 3', value: 5 },
    { category: 'Catégorie 4', value: 2 },
    { category: 'Catégorie 5', value: 6 },
  ];

  const width = 800;
  const height = 600;



  const svg = d3.select('#spider-chart')
      .attr('width', width)
      .attr('height', height);

  const centerX = width / 2;
  const centerY = height / 2;

  const scale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 10])
      .range([0, Math.min(centerX, centerY)]);

  const line = d3.lineRadial<number>()
      .angle((d, i) => (i * 2 * Math.PI) / data.length)
      .radius(d => scale(d.value));
//affichage des cercles arrières

  svg.selectAll('circle')
      .data(scale.ticks(5).slice(1))
      .enter()
      .append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('fill', 'none')
      .attr('stroke', 'gray')
      .attr('r', d => scale(d));
  //affichage des lignes des axes
  svg.selectAll('line')
      .data(data)
      .enter()
      .append('line')
      .attr('x1', centerX)
      .attr('y1', centerY)
      .attr('x2', (d, i) => centerX + scale(d.value) * Math.cos((i * 2 * Math.PI) / data.length))
      .attr('y2', (d, i) => centerY + scale(d.value) * Math.sin((i * 2 * Math.PI) / data.length))
      .attr('stroke', 'white');

//affichage catégories
  svg.append('g')
      .selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .text(d => d.category)
      .attr('x', (d, i) => centerX + scale(scale.ticks(5).pop()) * Math.cos((i * 2 * Math.PI) / data.length))
      .attr('y', (d, i) => centerY + scale(scale.ticks(5).pop()) * Math.sin((i * 2 * Math.PI) / data.length))
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('fill', 'white')
      .attr('font-size', 14)
      .attr('font-weight', 'bold');
//affichage des axes
  svg.append('g')
      .selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .text(d => d.value)
      .attr('x', (d, i) => centerX + scale(d.value) * Math.cos((i * 2 * Math.PI) / data.length))
      .attr('y', (d, i) => centerY + scale(d.value) * Math.sin((i * 2 * Math.PI) / data.length))
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('fill', 'white')
      .attr('font-size', 14)
      .attr('font-weight', 'bold');


//affichage des lignes
  svg.append('line')
      .attr('x1', centerX + scale(data[0].value) * Math.cos(0))
      .attr('y1', centerY + scale(data[0].value) * Math.sin(0))
      .attr('x2', centerX + scale(data[data.length - 1].value) * Math.cos((data.length - 1) * 2 * Math.PI / data.length))
      .attr('y2', centerY + scale(data[data.length - 1].value) * Math.sin((data.length - 1) * 2 * Math.PI / data.length))
      .attr('stroke', 'gray');
  //affichage du polygone
  let path =d3.path();
  path.moveTo(centerX + scale(data[0].value) * Math.cos(0), centerY + scale(data[0].value) * Math.sin(0));
  //affichage de path
  data.forEach((d, i) => {
    path.lineTo(centerX + scale(d.value) * Math.cos(i * 2 * Math.PI / data.length), centerY + scale(d.value) * Math.sin(i * 2 * Math.PI / data.length));
  });
  //ajout de path
  svg.append('path')
      .attr('d', path)
      .attr('fill', 'rgba(255, 255, 255, 0.5)')
      .attr('stroke', 'white');
});

</script>

<style scoped>
svg {
  background-color: #213547;
}

</style>
