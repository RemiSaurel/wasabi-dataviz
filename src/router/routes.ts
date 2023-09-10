import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";
import HomePage from "../pages/HomePage.vue";
import AllSongsPage from "../pages/AllSongsPage.vue";
import ArtistPage from "../pages/ArtistPage.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/all",
    name: "AllSongs",
    component: AllSongsPage,
  },
  {
    path: "/artist/:artist",
    name: "Artist",
    component: ArtistPage,
  },
];

const router = createRouter({
  history: createWebHashHistory("/wasabi-dataviz"),
  routes,
});

export default router;
