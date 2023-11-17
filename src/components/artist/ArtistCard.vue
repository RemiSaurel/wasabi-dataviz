<template>
  <!-- onchange of artist display artist -->
  <div v-if="artist" class="artist-card bg-">
    <div>
      <h2 >{{ artist.artist }}</h2>
    </div>
    <div>
      <p>Nombre d'albums: {{ artist.nbAlbums }}</p>
      <p>Nombre de chansons: {{ artist.nbSongs }}</p>
      <p>Nombre de fans Deezer: {{ artist.deezerFans }}</p>
    </div>

    <!-- Ajoutez d'autres informations de l'artiste selon vos besoins -->
  </div>
</template>

<script setup>
const { artist } = defineProps(['artist']);
</script>
<style scoped>
.artist-card {
  border: 8px solid cadetblue;
  border-radius: 8px;
  padding: -100px; /* Ajustez la valeur de padding selon vos besoins */
  width: 300px;
  height: 300px;
}
h2 {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  color: brown;
}


</style>
