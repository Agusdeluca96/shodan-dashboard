<template>
  <v-container class="mt-5" fluid>
    <v-row>
      <v-col cols="12" md="6">
        <app-card icon="mdi-earth" :title="host.ip_str" class="px-5 py-3 mb-15">
          <v-simple-table>
            <template v-slot:default>
              <tbody>
                <tr v-for="(item, i) in generalInfo" :key="i">
                  <td class="font-weight-bold">{{ item.key }}</td>
                  <td>{{ item.value }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </app-card>
        <app-card
          v-if="hasSecurityContact"
          icon="mdi-security"
          title="Security Contact"
          class="px-5 py-3 mb-15"
        >
          <v-simple-table>
            <template v-slot:default>
              <tbody>
                <tr v-for="(item, i) in securityContact" :key="i">
                  <td class="font-weight-bold">{{ item.key }}</td>
                  <td>{{ item.value }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </app-card>
        <app-card
          v-if="host.vulns"
          icon="mdi-alert"
          title="Vulnerabilities"
          class="px-5 py-3 mb-15"
        >
          <v-simple-table>
            <template v-slot:default>
              <tbody>
                <tr
                  v-for="(item, i) in vulnerabilities"
                  :key="i"
                  class="host-vulnerability"
                >
                  <td class="font-weight-bold host-vulnerability__key">
                    {{ item.key }}
                  </td>
                  <td class="host-vulnerability__value">{{ item.value }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </app-card>
      </v-col>
      <v-col cols="6">
        <app-card icon="mdi-serial-port" title="Ports" class="px-5 py-3 mb-15">
          <v-avatar
            v-for="(port, i) in ports"
            :key="i"
            tile
            color="green darken-2 mr-2 mb-2"
            class="rounded"
          >
            <span class="white--text">{{ port }}</span>
          </v-avatar>
        </app-card>
        <app-card
          v-if="services.length"
          icon="mdi-server-network"
          title="Services"
          class="px-5 py-3 mb-15"
        >
          <v-row
            v-for="(service, i) in services"
            :key="i"
            align="center"
            class="host-service py-2"
          >
            <v-col cols="4">
              <v-sheet
                width="auto"
                elevation="1"
                rounded
                class="host-service__sheet"
              >
                <v-list dense class="py-0" dark>
                  <v-list-item class="green darken-2">
                    {{ service.port }}
                  </v-list-item>
                  <v-list-item class="orange darken-2">
                    {{ service.transport }}
                  </v-list-item>
                  <v-list-item class="grey darken-2">
                    {{ service.module }}
                  </v-list-item>
                </v-list>
              </v-sheet>
            </v-col>
            <v-col cols="8">
              <span
                v-for="(data, i) in service.data"
                :key="i"
                class="d-block text-body-2"
              >
                {{ data }}
              </span>
            </v-col>
          </v-row>
        </app-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import AppCard from "@/components/AppCard.vue";

export default {
  components: {
    AppCard
  },

  computed: {
    ...mapState({
      host: state => state.hosts.host
    }),

    generalInfo() {
      return [
        { key: "City", value: this.host.city ?? "-" },
        { key: "Country", value: this.host.country_name ?? "-" },
        { key: "Organization", value: this.host.org ?? "-" },
        { key: "ASN", value: this.host.asn ?? "-" },
        { key: "ISP", value: this.host.isp ?? "-" },
        { key: "Last Update", value: this.host.last_update ?? "-" },
        {
          key: "Hostnames",
          value: this.host.hostnames.length
            ? this.host.hostnames.join(", ")
            : "-"
        }
      ];
    },

    hasSecurityContact() {
      return this.host.data.some(
        data =>
          Object.prototype.hasOwnProperty.call(data, "http") &&
          Object.prototype.hasOwnProperty.call(data.http, "securitytxt") &&
          data.http.securitytxt
      );
    },

    securityContact() {
      const securityContactData = this.host.data.find(
        data =>
          Object.prototype.hasOwnProperty.call(data, "http") &&
          Object.prototype.hasOwnProperty.call(data.http, "securitytxt") &&
          data.http.securitytxt
      );
      const securityContactArray = securityContactData.http.securitytxt.split(
        "\n"
      );
      const securityContact = [];
      securityContactArray.forEach(securityContactElem => {
        if (securityContactElem) {
          const securityContactElemSplit = securityContactElem.split(": ");
          securityContact.push({
            key: securityContactElemSplit[0],
            value: securityContactElemSplit[1]
          });
        }
      });

      return securityContact;
    },

    vulnerabilities() {
      const vulnerabilities = [];

      this.host.data.forEach(data => {
        if (data.vulns) {
          Object.keys(data.vulns).forEach(key => {
            if (!vulnerabilities.some(vuln => vuln.key === key)) {
              vulnerabilities.push({
                key,
                value: data.vulns[key].summary
              });
            }
          });
        }
      });

      return vulnerabilities;
    },

    ports() {
      const orderedPorts = [...this.host.ports].sort((a, b) => {
        return a - b;
      });

      return orderedPorts;
    },

    services() {
      const services = [];

      if (this.host.data) {
        this.host.data.forEach(data => {
          const serviceData = data.data.split("\n");
          services.push({
            port: data.port,
            transport: data.transport,
            module: data._shodan.module,
            data: serviceData
          });
        });
      }

      services.sort((a, b) => {
        return a.port - b.port;
      });

      return services;
    }
  }
};
</script>

<style lang="scss" scoped>
.host {
  &-service {
    &:not(:last-child) {
      border-bottom: 1.5px solid darkgrey;
    }

    &__sheet {
      overflow: hidden;
    }
  }

  &-vulnerability {
    &__key {
      width: 25%;
    }

    &__value {
      width: 75%;
      padding-top: 10px !important;
      padding-bottom: 10px !important;
    }
  }
}
</style>
