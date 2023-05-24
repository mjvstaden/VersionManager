import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "./views/Dashboard.vue";
import Login from "./views/LoginView.vue";
import Register from "./views/Register.vue";
import DependencyGraph from "./views/DependencyGraph.vue";
import CreateComponent from "./views/CreateComponent.vue";
import UpdateComponent from "./views/UpdateComponent.vue";
import History from "./views/History.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Login,
    },
    {
      path: "/dashboard",
      component: Dashboard,
    },
    {
      path: "/login",
      component: Login,
    },
    {
      path: "/register",
      component: Register,
    },
    {
      path: "/view",
      component: DependencyGraph,
    },
    {
      path: "/create",
      component: CreateComponent,
    },
    {
      path: "/dependency-management/update-component",
      component: UpdateComponent,
    },
    {
      path: "/history",
      component: History,
    },
    
  ],
});

export default router;