<script>
import { mapActions, mapState } from 'pinia';
import { useMainStore } from '../stores/mainStore';

export default {
  data() {
    return {
      username: '',
      email: '',
      password: ''
    }
  },

  computed : {
    ...mapState(useMainStore, ['signUpErrMessage'])
  },

  methods: {
    ...mapActions(useMainStore, ['handleSignUp']),

    toastFirer(icon, title) {
      const toast = this.$swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      toast.fire({
        icon: icon,
        title: title
      })
    },

    async signup() {
      const result = await this.handleSignUp({
        username: this.username,
        email: this.email,
        password: this.password
      });
      if (result) {
        this.toastFirer('success', 'Signed Up Successfully!');
      } else {
        this.toastFirer('error', this.signUpErrMessage);
      }
    }
  }
}

</script>


<template>
  <div class="text-white w-screen h-screen flex justify-center items-center bg-[url('./assets/bg-signup.jpg')] bg-cover shadow-2xl relative">
    <router-link to="/" class="absolute w-10 aspect-square top-5 left-5">
      <font-awesome-icon class="absolute-middle" icon="fa-solid fa-arrow-left" size="xl" />
    </router-link>
    <div class="w-1/3 h-2/3  rounded-2xl backdrop-blur-[2px] border-white border-4 py-6 px-8">
      <div class="text-center text-2xl font-bold mb-6 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
        Sign Up
      </div>
      <form @submit.prevent="signup">
        <div class="my-3.5">
          <p class="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">Email Address :</p>
          <input v-model="email" class="my-2.5 px-4 py-2 rounded-full w-full text-black" type="email">
        </div>
        <div class="my-3.5">
          <p class="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">Username :</p>
          <input v-model="username" class="my-2.5 px-4 py-2 rounded-full w-full text-black" type="text">
        </div>
        <div class="my-3.5">
          <p class="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">Password :</p>
          <input v-model="password" class="my-2.5 px-4 py-2 rounded-full w-full text-black" type="password">
        </div>
        <div class="my-3.5 text-sm text-center">
          <p class="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">Already have account? Log in
            <router-link to="/login" class="hover:underline text-sky-200 hover:text-sky-300 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]" href="#">here</router-link>
          </p>
        </div>
        <button class=" my-2.5 w-full bg-green-500 hover:bg-green-600 py-2 rounded-full" type="submit">Sign Up</button>
      </form>
    </div>
  </div>
</template>