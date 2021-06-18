<template>
  <component :is="layout"></component>
</template>

<script>
import { mapState } from "vuex";
import AppLayout from "@/layouts/AppLayout";
import EmptyLayout from "@/layouts/EmptyLayout";

export default {
  name: "App",

  components: {
    "app-layout": AppLayout,
    "empty-layout": EmptyLayout
  },

  computed: {
    ...mapState({
      layout: state => state.app.layout
    })
  }
};
</script>
