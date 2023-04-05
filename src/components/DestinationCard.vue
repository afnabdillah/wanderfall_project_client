<script>
import { mapActions } from 'pinia';
import { useMainStore } from '../stores/mainStore';

export default {

  data() {
    return {
    }
  },

  props: ["destination"],

  computed: {

    computeRating() {
      const ratings = this.destination.Reviews.map(el => el.rating);
      let avgRating;
      if (ratings.length === 0) {
        avgRating = "-";
      }
      else {
        avgRating = ratings.reduce(((total, num) => total + num), 0) / ratings.length;
      }
      return avgRating;
    },

    sliceDescription() {
      let description;
      if (this.destination.description.length > 500) {
        description = this.destination.description.slice(0, 500);
      }
      else {
        description = this.destination.description;
      }
      return description;
    },

    timeFormatter() {
      if (!this.destination.openTime || !this.destination.closeTime) {
        return "Unavailable";
      }
      else {
        return `${this.destination.openTime.slice(0, 5)} - ${this.destination.closeTime.slice(0, 5)}`;
      }
    },

    priceFormatter() {
      if (this.destination.price > 0) {
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumSignificantDigits: 1
        }).format(this.destination.price);
      }
      else {
        return "Free";
      }
    },
  },

  methods: {
    ...mapActions(useMainStore, ['fetchDestinations']),

    filterByTag(tag) {
      const query = { tag };
      this.$router.push({ path: '/destinations', query })
      this.fetchDestinations(query);
    }
  }
}
</script>

<template>
  <div class="w-full bg-slate-200 rounded-xl border-2 border-black border-solid h-72 flex mb-12 hover:shadow-lg">
    <div class=" aspect-square h-full" :class="[`bg-center`, `bg-cover`]">
      <img :src="destination.Images[0].imgUrl" class=" object-cover w-full h-full rounded-l-xl" alt="">
    </div>
    <div class=" w-5/6 pr-6 pl-3 pb-2 pt-4 grid grid-rows-6 grid-flow-col gap-2">
      <div class="flex justify-between">
        <div class="font-bold text-xl ">
          <router-link :to="`/destinations/${destination.name.toLowerCase().split(' ').join('-')}-${destination.id}`">{{ destination.name }}</router-link>
        </div>
        <div class="flex ml-4">
          <font-awesome-icon class=" text-yellow-300" icon="fa-solid fa-star" size="xl" />
          <p class="ml-2">{{ computeRating }} / 5</p>
        </div>
      </div>
      <div class="row-span-3 overflow-hidden">
        <p class="text-justify">
          {{ sliceDescription }}
          <router-link :to="`/destinations/${destination.name.toLowerCase().split(' ').join('-')}-${destination.id}`"
            class=" text-sky-500 hover:text-sky-600 hover:no-underline">
            Read more ...
          </router-link>
        </p>
      </div>
      <ul class="row-start-5 flex items-end">
        <li v-for="tag in destination.Tags" :key="tag.id" class=" list-disc ml-6">
          <a @click.prevent="filterByTag(tag.name)" class=" text-slate-600 text-sm hover:cursor-pointer">{{ tag.name }}</a>
        </li>
      </ul>
      <div class="grid grid-cols-4 row-start-6 items-center">
        <div class="flex">
          <font-awesome-icon class="text-slate-400" icon="fa-solid fa-location-dot" size="xl" />
          <p class="ml-2">{{ destination.city }}, {{ destination.country }}</p>
        </div>
        <div class="flex ml-4">
          <font-awesome-icon class="text-slate-400" icon="fa-solid fa-money-bill" size="xl" />
          <p class="ml-2">{{ priceFormatter }}</p>
        </div>
        <div class="flex ml-4">
          <font-awesome-icon class="text-slate-400" icon="fa-solid fa-clock" size="xl" />
          <p class="ml-2">{{ timeFormatter }}</p>
        </div>
        <div class="flex ml-4">
          <font-awesome-icon class="text-slate-400" icon="fa-solid fa-comments" size="xl" />
          <p class="ml-2">{{ destination.Reviews.length }} reviews</p>
        </div>
      </div>
    </div>
  </div>
</template>