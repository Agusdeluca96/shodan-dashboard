<template>
  <v-container fluid>
    <v-row align="center" justify="center">
      <v-col cols="12">
        <v-form class="flex" @submit.prevent="handleSearchHost">
          <v-text-field
            solo
            filled
            prepend-inner-icon="mdi-magnify"
            class="mb-5"
            label="Enter IP to search..."
            v-model="ip"
            :error="validation.hasError('ip')"
            :error-messages="validation.firstError('ip')"
            :loading="loading"
            :loader-height="4"
          >
            <template v-slot:append>
              <v-btn
                depressed
                color="primary"
                :disabled="validation.hasError('ip') || !ip"
                @click="handleSearchHost"
              >
                Search
              </v-btn>
            </template>
          </v-text-field>
        </v-form>
      </v-col>
      <v-col cols="12" class="mt-5">
        <searched-hosts-table></searched-hosts-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import SimpleVueValidation from "simple-vue-validator";
import SearchedHostsTable from "@/components/SearchedHostsTable.vue";

const ipPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;

export default {
  components: {
    SearchedHostsTable
  },

  data() {
    return {
      ip: "",
      loading: false
    };
  },

  validators: {
    ip(value) {
      return SimpleVueValidation.Validator.value(value)
        .required()
        .regex(ipPattern, "Must be a valid IP address.");
    }
  },
  methods: {
    ...mapActions("app", {
      setError: "setError"
    }),

    ...mapActions("hosts", {
      searchHost: "searchHost"
    }),

    async handleSearchHost() {
      try {
        const validForm = await this.$validate();
        if (validForm) {
          this.loading = true;
          await this.searchHost(this.ip);
          this.loading = false;
          this.$router.push("/host/view");
        }
      } catch (error) {
        this.setError(error.message);
        this.loading = false;
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
