<template>
  <v-row class="sign-up">
    <v-col
      cols="12"
      md="4"
      class="blue darken-3 d-flex align-center justify-center"
    >
      <div>
        <v-card-text class="white--text">
          <h1 class="text-center text-h5 mb-md-5 mb-sm-2">
            Already have an account?
          </h1>
          <h3 class="text-center subtitle-1 mb-md-3">
            Please sign in!
          </h3>
        </v-card-text>
        <div class="text-center mb-6">
          <v-btn dark outlined @click="goToSignIn">Sign In</v-btn>
        </div>
      </div>
    </v-col>
    <v-col
      cols="12"
      md="8"
      class="pt-6 pb-6 d-flex align-center justify-center"
    >
      <v-card-text>
        <h1 class="text-center display-1 mb-10 primary--text text-darken-3">
          Sign Up
        </h1>
        <v-form class="mx-lg-8 mx-md-4" @submit.prevent="handleSignUp">
          <v-text-field
            label="Full name"
            prepend-icon="mdi-account"
            v-model="fullName"
            :error="validation.hasError('fullName')"
            :error-messages="validation.firstError('fullName')"
            @keydown="handleEnterKeySubmit"
          ></v-text-field>
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
          <v-text-field
            label="Repeat password"
            v-model="repeatedPassword"
            :type="showRepeatedPassword ? 'text' : 'password'"
            prepend-icon="mdi-empty"
            :append-icon="showRepeatedPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append="showRepeatedPassword = !showRepeatedPassword"
            :error="validation.hasError('repeatedPassword')"
            :error-messages="validation.firstError('repeatedPassword')"
            @keydown="handleEnterKeySubmit"
          ></v-text-field>
          <v-alert v-model="hasError" type="error" text dismissible>
            {{ errorMessage }}
          </v-alert>
          <div class="text-center mt-6">
            <v-btn type="submit" color="blue darken-3" dark :loading="loading">
              Sign Up
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from "vuex";
import SimpleVueValidation from "simple-vue-validator";

export default {
  data() {
    return {
      fullName: "",
      email: "",
      password: "",
      repeatedPassword: "",
      showPassword: false,
      showRepeatedPassword: false,
      loading: false,
      hasError: null,
      errorMessage: null
    };
  },

  validators: {
    fullName(value) {
      return SimpleVueValidation.Validator.value(value).required();
    },
    email(value) {
      return SimpleVueValidation.Validator.value(value)
        .required()
        .email();
    },
    password(value) {
      return SimpleVueValidation.Validator.value(value).required();
    },
    repeatedPassword(value) {
      return SimpleVueValidation.Validator.value(value)
        .required()
        .match(this.password);
    }
  },

  methods: {
    ...mapActions("user", {
      signUp: "signUp"
    }),

    handleEnterKeySubmit({ keyCode }) {
      if (keyCode === 13) {
        this.handleSignUp();
      }
    },

    goToSignIn() {
      this.$emit("signIn");
    },

    async handleSignUp() {
      try {
        this.hasError = false;
        this.errorMessage = null;
        this.loading = true;
        const validForm = await this.$validate();
        if (validForm) {
          await this.signUp({
            fullName: this.fullName,
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
    }
  }
};
</script>

<style scoped lang="scss">
.sign-up {
  @media screen and (min-width: 960px) {
    min-height: 55vh;
  }
}
</style>
