<script>
import { mapActions } from 'pinia';
import { useMainStore } from '../stores/mainStore';

export default {

  methods: {
    ...mapActions(useMainStore, ['handleGoogleSignIn']),
  }
}
</script>

<template>
  <div class="w-full">
    <GoogleLogin :callback="handleGoogleSignIn" />
  </div>
</template>