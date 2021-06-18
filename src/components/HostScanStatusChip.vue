<template>
  <v-chip :color="statusColor" text-color="white" small chip>
    <strong>{{ status }}</strong>
  </v-chip>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      required: true
    }
  },

  computed: {
    statusColor() {
      switch (this.status) {
        case "SUBMITTING":
          return "blue-grey";
        case "QUEUE":
          return "brown lighten-1";
        case "PROCESSING":
          return "amber";
        case "DONE":
          return "green";
        default:
          return "";
      }
    }
  }
};
</script>
