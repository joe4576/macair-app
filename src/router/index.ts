import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

interface MenuItem {
  title: string;
  icon: string;
  path: string;
}

export const menuItems: MenuItem[] = [
  {
    title: "Home",
    icon: "mdi-home",
    path: "/",
  },
];

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

export default router;
