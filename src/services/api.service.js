import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";

export const ApiService = {
  init() {
    Vue.use(VueAxios, axios);
    Vue.axios.defaults.baseURL = process.env.VUE_APP_API_URL;

    Vue.axios.interceptors.request.use(
      config => {
        const apiKey = process.env.VUE_APP_API_KEY;
        if (apiKey) {
          const url = config.url.split("?")[0];
          const urlParamsString = config.url.split("?")[1];
          const urlParams = new URLSearchParams(urlParamsString);

          urlParams.append("key", apiKey);
          config.url = url + "?" + urlParams.toString();
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    Vue.axios.interceptors.response.use(response => response.data);
  },

  async query(resource, params) {
    return Vue.axios.get(resource, { params }).catch(error => {
      throw new Error(error.response.data.error);
    });
  },

  async get(resource, slug = "") {
    return Vue.axios.get(`${resource}/${slug}`).catch(error => {
      throw new Error(error.response.data.error);
    });
  },

  async post(resource, params) {
    const formData = new FormData();

    Object.keys(params).forEach(key => {
      formData.append(key, params[key]);
    });

    return Vue.axios.post(resource, formData).catch(error => {
      throw new Error(error.response.data.error);
    });
  }
};
