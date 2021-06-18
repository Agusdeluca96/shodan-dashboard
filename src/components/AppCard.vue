<template>
  <v-card v-bind="$attrs" class="app-card">
    <div class="d-flex grow flex-wrap">
      <v-sheet
        :color="sheetColor"
        :max-height="90"
        width="auto"
        elevation="6"
        rounded
        class="app-card__heading text-start mb-n6 pa-6"
        dark
      >
        <v-icon size="35">{{ icon }}</v-icon>
      </v-sheet>

      <div v-if="title" class="ml-5 mt-1">
        <span class="title">{{ title }}</span>
      </div>

      <v-spacer></v-spacer>

      <div v-if="$slots['after-heading']" class="ml-6 d-flex">
        <slot name="after-heading" />
      </div>
    </div>

    <slot />

    <template v-if="$slots.footer">
      <v-divider class="mt-2" />

      <v-card-actions class="pb-0">
        <slot name="footer" />
      </v-card-actions>
    </template>
  </v-card>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: ""
    },
    color: {
      type: String
    }
  },

  computed: {
    sheetColor() {
      return this.color ?? this.$vuetify.theme.dark
        ? this.$vuetify.theme.themes.dark.primary
        : this.$vuetify.theme.themes.light.primary;
    }
  }
};
</script>

<style lang="scss">
.app-card {
  &__heading {
    position: relative;
    top: -40px;
    transition: 0.3s ease;
    z-index: 1;
  }
}
</style>
