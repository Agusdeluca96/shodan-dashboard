<template>
  <v-row class="sign-in">
    <v-col
      cols="12"
      md="8"
      class="pt-6 pb-6 d-flex align-center justify-center"
    >
      <v-card-text>
        <v-form class="mx-lg-8 mx-md-4" @submit.prevent="handleSignIn">
          <h1 class="text-center display-1 mb-10 primary--text text-darken-3">
            Sign in
          </h1>
          <v-text-field
            label="Email"
            prepend-icon="mdi-email"
            v-model="email"
            :error="validation.hasError('email')"
            :error-messages="validation.firstError('email')"
            @keydown="handleEnterKeySubmit"
          ></v-text-field>
          <v-text-field
            label="Password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append="showPassword = !showPassword"
            :error="validation.hasError('password')"
            :error-messages="validation.firstError('password')"
            @keydown="handleEnterKeySubmit"
          ></v-text-field>
          <v-alert v-model="hasError" type="error" text dismissible>
            {{ errorMessage }}
          </v-alert>
          <div class="text-center">
            <a
              href="#"
              class="mt-3 overline text-decoration-none primary--text text-darken-3"
            >
              Forgot your password?
            </a>
          </div>
          <div class="text-center mt-6 ">
            <v-btn
              dark
              type="submit"
              color="blue darken-3"
              class="d-block mx-auto mb-4"
              :loading="loading"
            >
              Sign In
            </v-btn>
            <v-btn
              id="google-sign-in-button"
              dark
              color="grey lighten-3"
              class="d-block mx-auto"
              @click="handleSignInWithGoogle"
              :loading="loadingGoogleSignIn"
            >
              <img
                src="@/assets/images/google-icon.svg"
                alt="Google button"
                height="38"
              />
              <span>Sign in with Google</span>
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-col>
    <v-col
      cols="12"
      md="4"
      class="blue darken-3 d-flex align-center justify-center"
    >
      <div>
        <v-card-text class="white--text">
          <h1 class="text-center text-h5 mb-md-5 mb-sm-2">
            Don't have an account?
          </h1>
          <h3 class="text-center subtitle-1 mb-md-3">
            Please sign up to continue.
          </h3>
        </v-card-text>
        <div class="text-center mb-6">
          <v-btn dark outlined @click="goToSignUp">Sign Up</v-btn>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from "vuex";
import SimpleVueValidation from "simple-vue-validator";

export default {
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
      loading: false,
      loadingGoogleSignIn: false,
      hasError: null,
      errorMessage: null
    };
  },

  validators: {
    email(value) {
      return SimpleVueValidation.Validator.value(value)
        .required()
        .email();
    },
    password(value) {
      return SimpleVueValidation.Validator.value(value).required();
    }
  },

  methods: {
    ...mapActions("user", {
      signIn: "signIn",
      signInWithGoogle: "signInWithGoogle"
    }),

    handleEnterKeySubmit({ keyCode }) {
      if (keyCode === 13) {
        this.handleSignIn();
      }
    },

    goToSignUp() {
      this.$emit("signUp");
    },

    async handleSignIn() {
      try {
        this.hasError = false;
        this.errorMessage = null;
        this.loading = true;
        const validForm = await this.$validate();
        if (validForm) {
          await this.signIn({
            email: this.email,
            password: this.password
          });
          this.loading = false;
          this.$router.push("/");
        }
      } catch (error) {
        this.loading = false;
        this.errorMessage = error;
        this.hasError = true;
      }
    },

    async handleSignInWithGoogle() {
      try {
        this.hasError = false;
        this.errorMessage = null;
        this.loadingGoogleSignIn = true;
        await this.signInWithGoogle();
        this.loadingGoogleSignIn = false;
        this.$router.push("/");
      } catch (error) {
        this.loadingGoogleSignIn = false;
        this.errorMessage = error;
        this.hasError = true;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.sign-in {
  @media screen and (min-width: 960px) {
    min-height: 55vh;
  }

  #google-sign-in-button {
    span {
      color: #000000;
      font-weight: 500;
      letter-spacing: 0;
    }
  }
}
</style>
