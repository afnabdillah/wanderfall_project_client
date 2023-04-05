<script>
import Header from '../components/Header.vue';
import { mapActions, mapState } from 'pinia';
import { useMainStore } from '../stores/mainStore';

export default {
  components: {
    Header
  },

  data() {
    return {
      active: 0
    }
  },

  computed: {
    ...mapState(useMainStore, ['destinations']),
  },

  methods: {

    ...mapActions(useMainStore, ['fetchDestinations']),

    slideImage(num) {
      this.active += num;
      if (this.active > this.destinations.destinations.length - 1) {
        this.active = 0;
      } else if (this.active < 0) {
        this.active = this.destinations.destinations.length - 1;
      }
    },

    goToDestination(destination) {
      this.$router.push(`/destinations/${destination.name.toLowerCase().split(' ').join('-')}-${destination.id}`);
    }
  },

  mounted() {
    let i = 0;
    setInterval(() => {
      if (i > this.destinations.destinations.length - 1) {
        i = 0;
      }
      this.active = i;
      i++;
    }, 10000);
  },

  created() {
    this.fetchDestinations();
  }

}

</script>

<template>
  <Header />
  <main class=" min-h-screen">
    <!-- background image container -->
    <div
      class=" h-[32rem] w-full relative before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-[url('./assets/bg-home.jpg')] before:bg-cover before:bg-center before:brightness-50 flex items-center justify-center text-white">
      <div class="w-1/2 mx-auto text-center z-50">
        <h1 class="text-[3.5rem] font-semibold my-4 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">Wander Fall</h1>
        <p class="text-xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] mb-2">
          Are you having trouble to create your holiday plan? Say no more! Wander Fall will help you create the perfect
          plan for your holiday to make sure you get the most experience!
        </p>
        <p class="text-xl mb-2 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
          Let's start by searching for your dream
          <router-link to="/destinations" class="text-slate-300 hover:text-slate-400">destination!</router-link>
        </p>
        <p class="mb-4 text-xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">Or maybe you want to start right away!</p>
        <div class=" w-1/2 mx-auto flex justify-around">
          <router-link to="/login"
            class=" text-xl bg-green-400 hover:bg-green-500 hover:shadow-xl px-6 py-1 rounded-full drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">Log
            In</router-link>
          <router-link to="/signup"
            class=" text-xl bg-green-400 hover:bg-green-500 hover:shadow-xl px-6 py-1 rounded-full drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">Sign
            Up</router-link>
        </div>
      </div>
    </div>
    <div class="">
      <h1 class="text-[2.5rem] text-center font-semibold my-10">
        Popular Destinations
      </h1>
      <!-- Carousel container -->
      <div class="w-4/5 mx-auto mb-10">
        <div class="relative slide">
          <!-- Carousel indicator -->
          <div class="carousel-indicators absolute bottom-0 flex h-8 w-full justify-center items-center">
            <ol class="z-50 flex w-4/12 justify-center">
              <li v-for="(destination, i) in destinations.destinations" :key="i"
                :class="[active === i ? 'bg-slate-500' : 'bg-gray-300']"
                class="md:w-2 md:h-2 rounded-full cursor-pointer mx-2">
              </li>
            </ol>
          </div>
          <!-- Carousel images -->
          <div class="carousel-inner relative overflow-hidden w-full h-[36rem]">
            <div class="absolute left-0 h-full w-1/12 ">
              <div @click.prevent=slideImage(-1)
                class=" z-40 absolute-middle h-8 aspect-square rounded-full bg-slate-300 hover:bg-slate-200 hover:cursor-pointer">
                <font-awesome-icon class="absolute-middle" icon="fa-solid fa-angle-left" size="lg" />
              </div>
            </div>
            <div class="absolute right-0 h-full w-1/12 ">
              <div @click.prevent="slideImage(1)"
                class=" z-40 absolute-middle h-8 aspect-square rounded-full bg-slate-300 hover:bg-slate-200 hover:cursor-pointer">
                <font-awesome-icon class="absolute-middle" icon="fa-solid fa-angle-right" size="lg" />
              </div>
            </div>
            <div v-for="(destination, i) in destinations.destinations" :id="`slide-${i}`" :key="i"
              :class="`${active === i ? 'active' : 'left-full'}`"
              class="carousel-item inset-0 relative w-full transform transition-all duration-500 ease-in-out">
              <p
                class="absolute right-6 top-4 text-2xl font-semibold text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                {{ destination.name }}</p>
              <img @click.prevent="goToDestination(destination)"
                class="block object-cover w-full h-full hover:cursor-pointer" :src="destination.Images[0].imgUrl"
                alt="First slide" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.left-full {
  left: -100%;
}

.carousel-item {
  float: left;
  position: relative;
  display: block;
  width: 100%;
  margin-right: -100%;
  backface-visibility: hidden;
}

.carousel-item.active {
  left: 0;
}</style>