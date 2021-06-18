<template>
  <v-container class="d-flex justify-center align-center fill-height">
    <v-row align="center" justify="center" no-gutters>
      <v-col cols="12" sm="10" xl="8">
        <v-card class="evelation-12">
          <v-window v-model="window" :vertical="verticalWindow">
            <!-- Sign In -->
            <v-window-item value="SignIn">
              <sign-in @signUp="window = 'SignUp'"></sign-in>
            </v-window-item>
            <!-- Sign Up -->
            <v-window-item value="SignUp">
              <sign-up @signIn="window = 'SignIn'"></sign-up>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SignIn from "@/components/auth-windows/SignIn.vue";
import SignUp from "@/components/auth-windows/SignUp.vue";

export default {
  components: {
    SignIn,
    SignUp
  },

  data() {
    return {
      window: "SignIn"
    };
  },

  computed: {
    verticalWindow() {
      return ["xs", "sm"].includes(this.$vuetify.breakpoint.name);
    }
  }
};
</script>

<style scoped lang="scss">
.v-card {
  overflow: hidden;
}
</style>
