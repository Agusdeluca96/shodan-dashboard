import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";
import vuetify from "./plugins/vuetify";
import { ApiService } from "./services/api.service";
import SimpleVueValidation from "simple-vue-validator";

Vue.config.productionTip = false;

Vue.use(SimpleVueValidation);

ApiService.init();

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
