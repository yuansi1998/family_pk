import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
const PkDetail = () => import(/* webpackChunkName: "pk_detail" */ '../views/PkDetail.vue');
const Rule = () => import(/* webpackChunkName: "rule" */ '../views/Rule.vue');
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/pk_detail",
    name: "PkDetail",
    component: PkDetail
  },
  {
    path: "/rule",
    name: "Rule",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Rule
  }
];
const base =
  process.env.NODE_ENV === "production" ? "/m/activities/family_pk" : "/";
const router = new VueRouter({
  mode: "history",
  base,
  routes,
});

export default router;
