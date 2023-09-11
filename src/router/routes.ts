import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import AllSongsPage from "../pages/AllSongsPage.vue";
import ArtistPage from "../pages/ArtistPage.vue";
import DatavizPage from "../pages/DatavizPage.vue";
import ContactPage from "../pages/ContactPage.vue";
import AlbumPage from "../pages/AlbumPage.vue";
import GenrePage from "../pages/GenrePage.vue";

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
  {
    path: "/dataviz",
    name: "DataViz",
    component: DatavizPage,
  },
  {
    path: "/contact",
    name: "Contact",
    component: ContactPage,
  },
  {
    path: "/:artist/album/:album",
    name: "Album",
    component: AlbumPage,
  },
  {
    path: "/genre/:genre",
    name: "Genre",
    component: GenrePage,
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHashHistory("/wasabi-dataviz"),
  routes: routes,
});

export default router;
