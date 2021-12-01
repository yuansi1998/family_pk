import Vue from "vue";
import App from "./App.vue";
import router from "./router";
// import "babel-polyfill";
// import "core-js/stable";
// import "regenerator-runtime/runtime";
import "@/assets/scss/reset.scss";
import Tips from "@/components/Tips.vue";
const sid = document.getElementById("user_sid").value;
const noble_level = document.getElementById('noble_level').value;
const current_family_id = document.getElementById('current_family_id').value;
window.USER_SID = process.env.NODE_ENV !== "production" ? "20589290si9yhqz" : sid;
window.USER_NOBLE = process.env.NODE_ENV !== "production" ? 8 : noble_level;
window.CURRENT_FAMILY_ID = process.env.NODE_ENV !== "production" ? 152315 : current_family_id;
Vue.config.productionTip = false;
Vue.component("Tips", Tips);
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
