<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-combobox
          v-model="ips"
          chips
          clearable
          label="Enter IPs to scan..."
          prepend-inner-icon="mdi-magnify"
          append-inner-icon="mdi-magnify"
          multiple
          solo
          :error="validation.hasError('ips')"
          :error-messages="validation.firstError('ips')"
        >
          <template v-slot:append>
            <v-btn
              depressed
              color="primary"
              :disabled="validation.hasError('ips') || !ips.length"
              @click="handleScanHosts"
            >
              Scan
            </v-btn>
          </template>
          <template v-slot:selection="{ attrs, item, select, selected }">
            <v-chip
              v-bind="attrs"
              :input-value="selected"
              close
              @click="select"
              @click:close="removeIp(item)"
              :color="`${isValidIp(item) ? 'green' : 'red'} darken-2`"
              :outlined="isValidIp(item)"
              dark
            >
              <span>{{ item }}</span>
            </v-chip>
          </template>
        </v-combobox>
      </v-col>
    </v-row>
    <v-row align="center" justify="center" class="mt-5">
      <v-col cols="12">
        <host-scans-table></host-scans-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import SimpleVueValidation from "simple-vue-validator";
import HostScansTable from "@/components/HostScansTable.vue";

const ipPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;

export default {
  components: {
    HostScansTable
  },

  data() {
    return {
      ips: [],
      loading: false
    };
  },

  validators: {
    ips(value) {
      return SimpleVueValidation.Validator.custom(function() {
        const isInvalid = value.some(ip => !ipPattern.test(ip));
        if (isInvalid) {
          return "There is at least 1 invalid IP address.";
        }
      });
    }
  },
  methods: {
    ...mapActions("app", {
      setError: "setError"
    }),

    ...mapActions("hosts", {
      scanHosts: "scanHosts"
    }),

    async handleScanHosts() {
      try {
        const validForm = await this.$validate();
        if (validForm) {
          const ipsStr = this.ips.join(", ");
          this.loading = true;
          await this.scanHosts(ipsStr);
          this.loading = false;
          this.ips = [];
        }
      } catch (error) {
        this.setError(error.message);
        this.loading = false;
      }
    },

    removeIp(ip) {
      this.ips = this.ips.filter(hostIp => hostIp !== ip);
    },

    isValidIp(ip) {
      return ipPattern.test(ip);
    }
  }
};
</script>

<style lang="scss" scoped>
.snackbar-message {
  font-weight: 500;
}
</style>
