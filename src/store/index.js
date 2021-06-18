import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";

import { app } from "./app.module";
import { user } from "./user.module";
import { hosts } from "./hosts.module";

Vue.use(Vuex);

const modules = {
  app,
  user,
  hosts
};

export const store = new Vuex.Store({
  modules,
  actions: {
    reset({ commit }) {
      Object.keys(modules).forEach(moduleName => {
        commit(`${moduleName}/RESET`);
      });
    }
  },
  plugins: [new VuexPersistence().plugin]
});
