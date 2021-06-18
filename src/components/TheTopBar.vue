<template>
  <v-app-bar id="app-top-bar" app absolute color="transparent" flat>
    <v-app-bar-nav-icon @click.stop="toggleDrawerOpened"></v-app-bar-nav-icon>

    <v-spacer></v-spacer>

    <v-menu
      bottom
      left
      offset-y
      origin="top right"
      transition="scale-transition"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ attrs, on }">
        <v-btn icon v-bind="attrs" v-on="on" id="profile-menu-button">
          <v-avatar v-if="user.photoURL" size="32px" item>
            <v-img :src="user.photoURL" :alt="user.displayName"></v-img>
          </v-avatar>
          <v-icon v-else>mdi-account</v-icon>
        </v-btn>
      </template>

      <v-card class="mx-auto" tile width="auto">
        <v-list dense class="py-0">
          <v-list-item class="py-2">
            <v-list-item-avatar>
              <img v-if="user.photoURL" :src="user.photoURL" alt="John" />
              <v-icon v-else>mdi-account</v-icon>
            </v-list-item-avatar>
            <v-list-item-content class="d-block">
              <v-list-item-title class="text-body-1 mb-1">
                {{ user.displayName }}
              </v-list-item-title>
              <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item>
            <v-switch v-model="$vuetify.theme.dark" primary dense>
              <template v-slot:label>
                <p
                  class="text-subtitle-2 ml-2 mb-1"
                  :class="{
                    'white--text': $vuetify.theme.dark,
                    'grey--text text--darken-4': !$vuetify.theme.dark
                  }"
                >
                  Dark mode
                </p>
              </template>
            </v-switch>
          </v-list-item>

          <v-list-item id="sign-out-list-item" @click="handleSignOut">
            <v-list-item-action>
              <v-icon size="20">mdi-logout</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="text-subtitle-2">
                Sign out
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  computed: {
    ...mapState({
      user: state => state.user.currentUser
    })
  },

  methods: {
    ...mapActions({
      toggleDrawerOpened: "app/toggleDrawerOpened",
      setError: "app/setError",
      signOut: "user/signOut"
    }),

    async handleSignOut() {
      try {
        await this.signOut();
        this.$router.push("/auth");
      } catch (error) {
        this.setError(error.message);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#app-top-bar {
  .v-toolbar__title {
    font-size: 1rem;
  }
}
</style>
