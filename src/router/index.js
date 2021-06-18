import Vue from "vue";
import VueRouter from "vue-router";
import { store } from "@/store";
import Auth from "../views/Auth.vue";
import HostView from "../views/HostView.vue";
import HostScan from "../views/HostScan.vue";
import Dashboard from "../views/Dashboard.vue";
import HostSearch from "../views/HostSearch.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/auth",
    name: "auth",
    component: Auth
  },
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard
  },
  {
    path: "/host/search",
    name: "Search host",
    component: HostSearch
  },
  {
    path: "/host/scan",
    name: "Scan host",
    component: HostScan
  },
  {
    path: "/host/view",
    name: "Host view",
    component: HostView
  },
  // otherwise redirect to home
  { path: "*", redirect: "/" }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const publicPages = ["/auth"];

  const loggedIn = !!store.state.user.currentUser;

  // Redirect to login page if not logged in and trying to access a restricted page
  if (!publicPages.includes(to.path) && !loggedIn) {
    return next("/auth");
  }
  next();
});

export default router;
