<template>
  <v-app>
    <the-drawer></the-drawer>
    <the-top-bar></the-top-bar>
    <v-main class="fill-height">
      <router-view></router-view>
    </v-main>
    <v-snackbar
      :value="error"
      @input="toggleSnackbar"
      multi-line
      right
      :timeout="5000"
      color="red darken-3"
    >
      <v-icon>mdi-alert</v-icon>
      <span class="snackbar-message ml-3 ">{{ error }}</span>
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="() => setError(null)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapState, mapActions } from "vuex";
import TheTopBar from "@/components/TheTopBar.vue";
import TheDrawer from "@/components/TheDrawer.vue";

export default {
  components: {
    TheTopBar,
    TheDrawer
  },

  computed: {
    ...mapState({
      error: state => state.app.error
    })
  },

  methods: {
    ...mapActions("app", {
      setError: "setError"
    }),

    toggleSnackbar(value) {
      if (!value) {
        this.setError(null);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.snackbar-message {
  font-weight: 500;
}
</style>
