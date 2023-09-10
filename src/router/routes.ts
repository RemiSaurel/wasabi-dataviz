import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import AllSongsPage from "../pages/AllSongsPage.vue";
import ArtistPage from "../pages/ArtistPage.vue";

const routes = [
  {
    path: "/wasabi-dataviz/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/wasabi-dataviz/all",
    name: "AllSongs",
    component: AllSongsPage,
  },
  {
    path: "/wasabi-dataviz/artist/:artist",
    name: "Artist",
    component: ArtistPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
