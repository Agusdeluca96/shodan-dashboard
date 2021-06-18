<template>
  <v-container class="mt-5" fluid>
    <v-row justify="center">
      <v-col cols="12" sm="6" lg="3">
        <app-card
          icon="mdi-serial-port"
          title="Top open ports"
          class="px-5 py-3"
        >
          <v-simple-table v-if="!!topPorts.length" dense>
            <template v-slot:default>
              <tbody>
                <tr v-for="(item, i) in topPorts" :key="i">
                  <td class="font-weight-bold">{{ item.port }}</td>
                  <td class="text-right">{{ item.value }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <div v-else>
            <v-divider></v-divider>
            <div class="d-flex flex-row mt-8 mb-6 justify-center align-center">
              <v-icon>mdi-information-outline</v-icon>
              <p class="grey--text ml-2 mb-0 pt-1">No open ports founded.</p>
            </div>
          </div>
        </app-card>
      </v-col>
      <v-col cols="12" sm="6" lg="3" class="mt-5 mt-md-0">
        <app-card
          icon="mdi-alert"
          title="Top vulnerabilities"
          class="px-5 py-3"
        >
          <v-simple-table v-if="!!topVulnerabilities.length" dense>
            <template v-slot:default>
              <tbody>
                <tr v-for="(item, i) in topVulnerabilities" :key="i">
                  <td class="font-weight-bold">{{ item.vuln }}</td>
                  <td class="text-right">{{ item.value }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <div v-else>
            <v-divider></v-divider>
            <div class="d-flex flex-row mt-8 mb-6 justify-center align-center">
              <v-icon>mdi-information-outline</v-icon>
              <p class="grey--text ml-2 mb-0 pt-1">
                No vulnerabilities founded.
              </p>
            </div>
          </div>
        </app-card>
      </v-col>
      <v-col cols="12" lg="6" class="mt-5 mt-lg-0">
        <host-scans-table
          title="Last scanned hosts"
          :limit="5"
          :headers="lastScansTableHeaders"
        ></host-scans-table>
      </v-col>
      <v-col cols="12" class="mt-5">
        <searched-hosts-table
          title="Last searched hosts"
          :limit="5"
          :headers="lastSearchedHostsTableHeaders"
        ></searched-hosts-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import AppCard from "@/components/AppCard.vue";
import SearchedHostsTable from "@/components/SearchedHostsTable.vue";
import HostScansTable from "@/components/HostScansTable.vue";
import { sortObjectsBy } from "@/utils/array-helpers.js";
import moment from "moment";

const lastSearchedHostsTableHeaders = [
  { text: "IP", value: "ip_str", class: "primary--text" },
  { text: "ISP", value: "isp", class: "primary--text" },
  { text: "Organization", value: "org", class: "primary--text" },
  { text: "City", value: "city", class: "primary--text" },
  { text: "Country", value: "country_name", class: "primary--text" },
  { text: "Ports", value: "ports", class: "primary--text" },
  { text: "Date searched", value: "searched_at", class: "primary--text" }
];

const lastScansTableHeaders = [
  { text: "ID", value: "id", class: "primary--text" },
  { text: "IPs", value: "ips", class: "primary--text" },
  { text: "Status", value: "status", class: "primary--text" },
  {
    text: "Last status refresh",
    value: "last_status_refresh",
    class: "primary--text"
  }
];

export default {
  components: {
    AppCard,
    SearchedHostsTable,
    HostScansTable
  },

  data() {
    return {
      lastSearchedHostsTableHeaders,
      lastScansTableHeaders
    };
  },

  computed: {
    ...mapState("hosts", {
      searchedHosts: "searchedHosts",
      scans: "scans"
    }),

    lastScannedHosts() {
      const lastScannedHosts = [];
      const sortedScans = sortObjectsBy(this.scans, "scanned_at", "desc");
      sortedScans.forEach(scan => {
        const scanIps = scan.ips.split(", ");
        scanIps.forEach(ip => {
          lastScannedHosts.push({
            ip,
            scanned_at: moment(scan.scanned_at).format("M-D-YYYY - h:mm A"),
            status: scan.status
          });
        });
      });

      const lastFiveScannedHosts = lastScannedHosts.slice(0, 5);
      return lastFiveScannedHosts;
    },

    topPorts() {
      const topPorts = {};
      this.searchedHosts.forEach(host => {
        host.ports &&
          host.ports.forEach(port => {
            topPorts[port] = Object.prototype.hasOwnProperty.call(
              topPorts,
              port
            )
              ? topPorts[port] + 1
              : 1;
          });
      });
      const topPortsArray = Object.keys(topPorts).map(port => ({
        port,
        value: topPorts[port]
      }));
      const sortedTopPorts = sortObjectsBy(topPortsArray, "value", "desc");

      const sortedTopFivePorts = sortedTopPorts.slice(0, 5);
      return sortedTopFivePorts;
    },

    topVulnerabilities() {
      const topVulns = {};
      this.searchedHosts.forEach(host => {
        host.vulns &&
          host.vulns.forEach(vuln => {
            topVulns[vuln] = Object.prototype.hasOwnProperty.call(
              topVulns,
              vuln
            )
              ? topVulns[vuln] + 1
              : 1;
          });
      });
      const topVulnsArray = Object.keys(topVulns).map(vuln => ({
        vuln,
        value: topVulns[vuln]
      }));
      const sortedTopVulns = sortObjectsBy(topVulnsArray, "value", "desc");

      const sortedTopFiveVulns = sortedTopVulns.slice(0, 5);
      return sortedTopFiveVulns;
    }
  }
};
</script>
