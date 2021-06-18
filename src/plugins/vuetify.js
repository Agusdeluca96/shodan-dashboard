import Vue from "vue";
import Vuetify from "vuetify/lib";
import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      options: {
        themeCache: {
          get: key => localStorage.getItem(key),
          set: (key, value) => localStorage.setItem(key, value)
        }
      },
      light: {
        primary: colors.blue.darken3,
        secondary: colors.blue.base,
        accent: colors.cyan.base,
        info: colors.teal.lighten1,
        warning: colors.amber.base,
        error: colors.deepOrange.accent4,
        success: colors.green.accent3
      },
      dark: {
        primary: colors.blue.darken1,
        secondary: colors.blue.base,
        accent: colors.cyan.base,
        info: colors.teal.lighten1,
        warning: colors.amber.base,
        error: colors.deepOrange.accent4,
        success: colors.green.accent3
      }
    }
  }
});
