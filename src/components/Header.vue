<script>
import { mapActions, mapState } from 'pinia';
import { useMainStore } from '../stores/mainStore';

export default {

  computed : {
    ...mapState(useMainStore, ['loginStatus'])
  },

  methods: {
    ...mapActions(useMainStore, ['handleLogout']),

    logout() {
      this.handleLogout();
    },

    goToHome() {
      this.$router.push('/');
    }
  }
}
</script>


<template>
  <div class="text-white sticky top-0 w-full h-12 bg-green-400 grid grid-cols-12 px-10 items-center z-50">
    <div class="col-span-1">
      <img src="../assets/wanderfall_logo.png" @click="goToHome" class="hover:cursor-pointer">
    </div>
    <div class="col-start-4 col-span-6 text-center text-xl text-white">
      <p>Plan your wonderful trip here!</p>
    </div>
    <div v-if="!loginStatus" class="mx-2 col-start-11">
      <router-link to="/login" class="header-link" href="">Log In</router-link>
    </div>
    <div v-if="!loginStatus" class="mx-2 ">
      <router-link to="/signup" class="header-link" href="">Sign Up</router-link>
    </div>
    <div v-if="loginStatus" class="mx-2 ">
      <router-link to="/destinations" class="header-link" href="">Destinations</router-link>
    </div>
    <div v-if="loginStatus" class="mx-2 ">
      <router-link to="/myschedule" class="header-link" href="">My Schedules</router-link>
    </div>
    <div v-if="loginStatus" class="mx-2 ">
      <a @click.prevent="logout" class="header-link" href="">Logout</a>
    </div>
  </div>
</template>