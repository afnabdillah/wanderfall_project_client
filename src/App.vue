<script>
import { mapActions, mapState } from 'pinia';
import { RouterView } from 'vue-router';
import { useMainStore } from './stores/mainStore';

export default {

  computed: {
    ...mapState(useMainStore, ["SCOPES", "DISCOVERY_DOC", "gisInited", "gapiInited", "tokenClient"])
  },

  methods: {
    ...mapActions(useMainStore, ["gapiLoaded", "initializeGapiClient", "gisLoaded"])
  },

  components: {
    RouterView
  },

  created() {
    this.gisLoaded();
    this.gapiLoaded();
  }

}
</script>

<template>
  <RouterView />
</template>

<style>
body {
  font-family: Caudex;
}
</style>