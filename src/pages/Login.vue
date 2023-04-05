<script>
import { mapActions } from 'pinia';
import { useMainStore } from '../stores/mainStore';
import GoogleLogin from '../components/GoogleLogin.vue';

export default {

  data() {
    return {
      email: '',
      password: ''
    }
  },

  components : {
    GoogleLogin
  },

  methods: {

    ...mapActions(useMainStore, ['handleLogin']),

    async login() {
      const inputLogin = {
        email: this.email,
        password: this.password
      }
      await this.handleLogin(inputLogin);
    }
  }
}
</script>

<template>
  <div class="text-white w-screen h-screen flex justify-center items-center bg-[url('./assets/bg-login.jpg')] bg-cover">
    <div class="w-1/3 h-2/3  rounded-2xl backdrop-blur-[2px] border-white border-4 py-6 px-8 shadow-2xl">
      <div class="text-center text-2xl font-bold mb-6 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
        Log In
      </div>
      <form @submit.prevent="login">
        <div class="my-3.5">
          <p class="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">Email :</p>
          <input v-model="email" class="my-2.5 px-4 py-2 rounded-full w-full text-black" type="email">
        </div>
        <div class="my-3.5">
          <p class="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">Password :</p>
          <input v-model="password" class="my-2.5 px-4 py-2 rounded-full w-full text-black" type="password">
        </div>
        <div class="my-3.5 text-sm text-center">
          <p class="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">Don't have an account yet? Sign up
            <router-link to="/signup" class="hover:underline text-sky-200 hover:text-sky-300 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
              href="#">here</router-link>
          </p>
        </div>
        <button class=" my-2.5 w-full bg-green-500 hover:bg-green-600 py-2 rounded-full" type="submit">Log In</button>
      </form>
      <p class="text-center text-sm my-3 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">Or log in with google</p>
      <div class="text-center">
        <GoogleLogin />
      </div>
    </div>
  </div>
</template>