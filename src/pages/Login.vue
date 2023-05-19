<script>
import { mapActions, mapState } from "pinia";
import { useMainStore } from "../stores/mainStore";
import GoogleLogin from "../components/GoogleLogin.vue";

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },

  computed: {
    ...mapState(useMainStore, ["loginErrMessage", "loading"]),
  },

  components: {
    GoogleLogin,
  },

  methods: {
    ...mapActions(useMainStore, ["handleLogin"]),

    toastFirer(icon, title) {
      const toast = this.$swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", this.$swal.stopTimer);
          toast.addEventListener("mouseleave", this.$swal.resumeTimer);
        },
      });
      toast.fire({
        icon: icon,
        title: title,
      });
    },

    async login() {
      const inputLogin = {
        email: this.email,
        password: this.password,
      };
      const result = await this.handleLogin(inputLogin);
      if (result) {
        this.toastFirer("success", "Logged In Successfully!");
      } else {
        this.toastFirer("error", this.loginErrMessage);
      }
    },
  },
};
</script>

<template>
  <div
    class="text-white w-screen h-screen flex justify-center items-center bg-[url('./assets/bg-login.jpg')] bg-cover relative"
  >
    <router-link to="/" class="absolute w-10 aspect-square top-5 left-5">
      <font-awesome-icon
        class="absolute-middle"
        icon="fa-solid fa-arrow-left"
        size="xl"
      />
    </router-link>
    <div
      class="w-1/3 h-2/3 rounded-2xl backdrop-blur-[2px] border-white border-4 py-6 px-8 shadow-2xl"
    >
      <div
        class="text-center text-2xl font-bold mb-6 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
      >
        Log In
      </div>
      <form @submit.prevent="login">
        <div class="my-3.5">
          <p class="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">Email :</p>
          <input
            v-model="email"
            class="my-2.5 px-4 py-2 rounded-full w-full text-black"
            type="email"
          />
        </div>
        <div class="my-3.5">
          <p class="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">Password :</p>
          <input
            v-model="password"
            class="my-2.5 px-4 py-2 rounded-full w-full text-black"
            type="password"
          />
        </div>
        <div class="flex justify-center items-center my-3.5">
          <div
            v-if="loading"
            class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-100 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span
              class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
              >Loading...</span
            >
          </div>
          <div v-else-if="!loading" class="text-sm text-center">
            <p class="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
              Don't have an account yet? Sign up
              <router-link
                to="/signup"
                class="hover:underline text-sky-200 hover:text-sky-300 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
                href="#"
                >here</router-link
              >
            </p>
          </div>
        </div>
        <button
          class="my-2.5 w-full bg-green-500 hover:bg-green-600 py-2 rounded-full"
          type="submit"
        >
          Log In
        </button>
      </form>
      <p
        class="text-center text-sm my-3 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
      >
        Or log in with google
      </p>
      <div class="text-center">
        <GoogleLogin />
      </div>
    </div>
  </div>
</template>
