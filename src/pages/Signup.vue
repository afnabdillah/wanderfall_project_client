<script>
import { mapActions } from 'pinia';
import { useMainStore } from '../stores/mainStore';

export default {
  data() {
    return {
      username: '',
      email: '',
      password: ''
    }
  },

  methods: {
    ...mapActions(useMainStore, ['handleSignUp']),

    async signup() {
      await this.handleSignUp({
        username: this.username,
        email: this.email,
        password: this.password
      });
    }
  }
}

</script>


<template>
  <div class="text-white w-screen h-screen flex justify-center items-center bg-[url('./assets/bg-signup.jpg')] bg-cover">
    <div class="w-1/3 h-2/3  rounded-2xl backdrop-blur-[2px] border-white border-4 py-6 px-8">
      <div class="text-center text-2xl font-bold mb-6">
        Sign Up
      </div>
      <form @submit.prevent="signup">
        <div class="my-3.5">
          <p>Email Address :</p>
          <input v-model="email" class="my-2.5 px-4 py-2 rounded-full w-full text-black" type="email">
        </div>
        <div class="my-3.5">
          <p>Username :</p>
          <input v-model="username" class="my-2.5 px-4 py-2 rounded-full w-full text-black" type="text">
        </div>
        <div class="my-3.5">
          <p>Password :</p>
          <input v-model="password" class="my-2.5 px-4 py-2 rounded-full w-full text-black" type="password">
        </div>
        <div class="my-3.5 text-sm text-center">
          <p>Already have account? Log in
            <router-link to="/login" class="hover:underline text-sky-200 hover:text-sky-300" href="#">here</router-link>
          </p>
        </div>
        <button class=" my-2.5 w-full bg-green-500 hover:bg-green-600 py-2 rounded-full" type="submit">Sign Up</button>
      </form>
    </div>
  </div>
</template>