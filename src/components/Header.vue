<script>
import { mapActions, mapState } from 'pinia';
import { useMainStore } from '../stores/mainStore';

export default {

  computed: {
    ...mapState(useMainStore, ['loginStatus', "tokenClient"])
  },

  methods: {
    ...mapActions(useMainStore, ['handleLogout']),

    logout() {
      this.$swal({
        title: 'Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.isConfirmed) {
          this.handleLogout();
          const toast = this.$swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', this.$swal.stopTimer)
              toast.addEventListener('mouseleave', this.$swal.resumeTimer)
            }
          })
          toast.fire({
            icon: 'success',
            title: 'You have been logged out'
          })
        }
      })
    },

    goToHome() {
      this.$router.push('/');
    }
  }
}
</script>


<template>
  <div class="text-white sticky top-0 w-full h-12 bg-green-400 px-10 z-50 grid grid-cols-5 items-center">
    <div class="h-10 col-span-1">
      <img src="../assets/wanderfall_logo.png" @click="goToHome" class="hover:cursor-pointer h-full">
    </div>
    <div class="text-center text-xl text-white col-span-3">
      <p>Plan your wonderful trip here!</p>
    </div>
    <div class="flex col-span-1">
      <div class="mx-2">
        <router-link to="/destinations" class="header-link" href="">Destinations</router-link>
      </div>
      <div v-if="!loginStatus" class="mx-2 col-start-11">
        <router-link to="/login" class="header-link" href="">Log In</router-link>
      </div>
      <div v-if="!loginStatus" class="mx-2 ">
        <router-link to="/signup" class="header-link" href="">Sign Up</router-link>
      </div>
      <div v-if="loginStatus" class="mx-2 ">
        <router-link to="/myschedule" class="header-link" href="">Schedules</router-link>
      </div>
      <div v-if="loginStatus" class="mx-2 ">
        <a @click.prevent="logout" class="header-link" href="">Logout</a>
      </div>
    </div>
  </div>
</template>