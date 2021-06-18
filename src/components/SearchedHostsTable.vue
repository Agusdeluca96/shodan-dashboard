<template>
  <app-card icon="mdi-magnify" :title="title" class="px-5 py-3">
    <template v-slot:after-heading>
      <v-btn
        depressed
        small
        dark
        color="grey darken-3 align-self-center"
        @click="resetSearchedHosts"
      >
        Clear history
      </v-btn>
    </template>

    <v-data-table
      :headers="headers"
      :items="hosts"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
    >
      <template v-slot:item.city="{ item }">
        {{ item.city ? item.city : "-" }}
      </template>
      <template v-slot:item.ports="{ item }">
        {{ item.ports.length }}
      </template>
      <template v-slot:item.searched_at="{ item }">
        {{ item.searched_at | formatDatetime }}
      </template>
      <template v-slot:item.actions="{ item }">
        <app-tooltip-button
          icon="mdi-magnify"
          tooltip="Open host"
          onClickEmit="openHost"
          @openHost="handleOpenHost(item)"
          :contained="false"
          color="blue-grey"
        ></app-tooltip-button>
        <app-tooltip-button
          icon="mdi-delete"
          tooltip="Remove from list"
          onClickEmit="removeSearchedHost"
          @removeSearchedHost="handleRemoveSearchedHost(item)"
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
import moment from "moment";

const tableHeaders = () => [
  { text: "IP", value: "ip_str", class: "primary--text" },
  { text: "ISP", value: "isp", class: "primary--text" },
  { text: "Organization", value: "org", class: "primary--text" },
  { text: "City", value: "city", class: "primary--text" },
  { text: "Country", value: "country_name", class: "primary--text" },
  { text: "Ports", value: "ports", class: "primary--text" },
  { text: "Date searched", value: "searched_at", class: "primary--text" },
  { text: "", value: "actions", class: "primary--text", sortable: false }
];

export default {
  components: {
    AppCard,
    AppTooltipButton
  },

  props: {
    title: {
      type: String,
      default: "Searched hosts"
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
      default: "searched_at"
    },
    sortDesc: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      searchInput: ""
    };
  },

  computed: {
    ...mapState({
      searchedHosts: state => state.hosts.searchedHosts
    }),

    hosts() {
      return this.limit
        ? [...this.searchedHosts].splice(0, this.limit)
        : this.searchedHosts;
    }
  },

  filters: {
    formatDatetime: datetime => {
      return moment(datetime).format("M-D-YYYY - h:mm A");
    }
  },

  methods: {
    ...mapActions("hosts", {
      resetSearchedHosts: "resetSearchedHosts",
      removeSearchedHost: "removeSearchedHost",
      setSelectedHost: "setHost"
    }),

    ...mapActions("app", {
      setError: "setError"
    }),

    async handleOpenHost(host) {
      try {
        await this.setSelectedHost(host);
        this.$router.push("/host/view");
      } catch (error) {
        this.setError(error.message);
      }
    },

    handleRemoveSearchedHost(host) {
      this.removeSearchedHost(host.ip).catch(error => {
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
