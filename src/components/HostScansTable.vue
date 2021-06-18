<template>
  <app-card icon="mdi-magnify-scan" :title="title" class="px-5 py-3">
    <template v-slot:after-heading>
      <v-btn
        depressed
        small
        dark
        color="grey darken-3 align-self-center"
        @click="resetHostScans"
      >
        Clear history
      </v-btn>
    </template>

    <v-data-table
      :headers="headers"
      :items="hostScans"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
    >
      <template v-slot:item.status="{ item }">
        <host-scan-status-chip :status="item.status"></host-scan-status-chip>
      </template>
      <template v-slot:item.scanned_at="{ item }">
        {{ item.scanned_at | formatDatetime }}
      </template>
      <template v-slot:item.last_status_refresh="{ item }">
        {{ item.last_status_refresh | formatDatetime }}
      </template>
      <template v-slot:item.actions="{ item }">
        <app-tooltip-button
          icon="mdi-refresh"
          tooltip="Refresh status"
          onClickEmit="refreshScanStatus"
          @refreshScanStatus="handleRefreshScanStatus(item)"
          :loading="updatingScans.includes(item.id)"
          :contained="false"
          color="blue-grey"
        ></app-tooltip-button>
        <app-tooltip-button
          icon="mdi-delete"
          tooltip="Remove from list"
          onClickEmit="removeScan"
          @removeScan="handleRemoveScan(item)"
          :contained="false"
          color="red darken-3"
        ></app-tooltip-button>
      </template>
    </v-data-table>
  </app-card>
</template>

<script>
import { mapState, mapActions } from "vuex";
import AppCard from "@/components/AppCard.vue";
import AppTooltipButton from "@/components/AppTooltipButton.vue";
import HostScanStatusChip from "@/components/HostScanStatusChip.vue";
import moment from "moment";

const tableHeaders = () => [
  { text: "ID", value: "id", class: "primary--text" },
  { text: "IPs", value: "ips", class: "primary--text" },
  { text: "Status", value: "status", class: "primary--text" },
  { text: "Date scanned", value: "scanned_at", class: "primary--text" },
  {
    text: "Last status refresh",
    value: "last_status_refresh",
    class: "primary--text"
  },
  { text: "", value: "actions", class: "primary--text", sortable: false }
];

export default {
  components: {
    AppCard,
    AppTooltipButton,
    HostScanStatusChip
  },

  props: {
    title: {
      type: String,
      default: "Host scans"
    },
    headers: {
      type: Array,
      default: tableHeaders
    },
    limit: {
      type: Number,
      default: null
    },
    sortBy: {
      type: String,
      default: "last_status_refresh"
    },
    sortDesc: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      searchInput: "",
      updatingScans: []
    };
  },

  computed: {
    ...mapState({
      scans: state => state.hosts.scans
    }),

    hostScans() {
      return this.limit ? [...this.scans].splice(0, this.limit) : this.scans;
    }
  },

  filters: {
    formatDatetime: datetime => {
      return moment(datetime).format("M-D-YYYY - h:mm A");
    }
  },

  methods: {
    ...mapActions("hosts", {
      resetHostScans: "resetScans",
      refreshScanStatus: "refreshScanStatus",
      removeScan: "removeScan"
    }),

    ...mapActions("app", {
      setError: "setError"
    }),

    async handleRefreshScanStatus(scan) {
      try {
        this.updatingScans.push(scan.id);
        await this.refreshScanStatus(scan.id);
        this.updatingScans = this.updatingScans.filter(
          updatingScanId => updatingScanId !== scan.id
        );
      } catch (error) {
        this.setError(error.message);
      }
    },

    handleRemoveScan(scan) {
      this.removeScan(scan.id).catch(error => {
        this.setError(error.message);
      });
    }
  }
};
</script>

<style lang="scss">
.v-data-table {
  td {
    font-weight: 300;
  }
}
</style>
