<template>
  <v-navigation-drawer
    id="app-drawer"
    app
    :value="isLargeDevice || drawerOpened"
    @input="handleDrawerChange"
    :mini-variant="isLargeDevice && !drawerOpened"
    mini-variant-width="90"
    :dark="true"
    :src="require('@/assets/images/network.jpg')"
  >
    <template v-slot:img="props">
      <v-img
        gradient="to bottom, rgba(0, 0, 0, .8), rgba(0, 0, 0, .5)"
        v-bind="props"
      />
    </template>
    <v-container class="my-5">
      <v-img
        :src="
          require(isLargeDevice && !drawerOpened
            ? '@/assets/images/logo-mini.svg'
            : '@/assets/images/logo-dark.svg')
        "
        alt="Logo"
        contain
        height="40"
      />
    </v-container>
    <v-divider class="mb-1" />
    <v-list dense nav>
      <v-list-item link to="/">
        <v-list-item-action class="mx-4">
          <v-icon size="28">mdi-view-dashboard</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title class="text-body-2">Dashboard</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link to="/host/search">
        <v-list-item-action class="mx-4">
          <v-icon size="28">mdi-magnify</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title class="text-body-2">Host search</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link to="/host/scan">
        <v-list-item-action class="mx-4">
          <v-icon size="28">mdi-magnify-scan</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title class="text-body-2">Host scan</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  computed: {
    ...mapState({
      drawerOpened: state => state.app.drawerOpened
    }),

    isLargeDevice() {
      return ["lg", "xl"].includes(this.$vuetify.breakpoint.name);
    }
  },

  methods: {
    ...mapActions({
      toggleDrawerOpened: "app/toggleDrawerOpened"
    }),

    handleDrawerChange(newValue) {
      if (this.drawerOpened !== newValue) {
        this.toggleDrawerOpened();
      }
    }
  }
};
</script>
