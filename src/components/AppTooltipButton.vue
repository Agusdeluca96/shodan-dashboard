<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        :loading="loading"
        :color="color ? color : 'primary'"
        @click="handleClick"
        v-bind="attrs"
        v-on="on"
        :text="!contained"
      >
        <p v-if="text" class="text-subtitle-2">{{ text }}</p>
        <v-icon v-if="icon">{{ icon }}</v-icon>
      </v-btn>
    </template>
    <span>{{ tooltip }}</span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: ""
    },
    tooltip: {
      type: String,
      default: ""
    },
    onClickEmit: {
      type: String,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    contained: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: null
    }
  },

  methods: {
    handleClick() {
      this.$emit(this.onClickEmit);
    }
  }
};
</script>
