<script>
import { mapActions } from 'pinia';
import { useMainStore } from '../stores/mainStore';

export default {

  data() {
    return {
      showEditForm: false,
      numDate: this.review.visitDate.split('T')[0],
      reviewContent: this.review.review
    }
  },

  props: ['review'],

  computed: {
    longDateFormatter() {
      let options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const date = new Date();
      return new Intl.DateTimeFormat('en-US', options).format(date);
    },

    showEditButton() {
      return localStorage.username === this.review?.User.username;
    },

    maxReviewDate() {
      return new Date().toISOString().split('T')[0];
    },

    params() {
      let params = this.$route.params.destinationId;
      return +params.split('-').slice(-1)[0];
    }
  },

  methods: {
    ...mapActions(useMainStore, ['handleEditReview', 'handleDeleteReview']),

    toggleForm() {
      if (this.showEditForm) {
        this.showEditForm = false;
      } else {
        this.showEditForm = true;
      }
    },

    async submitEditReview() {
      const input = {
        review: this.reviewContent,
        visitDate: this.numDate
      }
      const result = this.handleEditReview(this.review.id, input, this.params);
      if (result) {
        this.showEditForm = false;
      }
    },

    deleteReview() {
      this.handleDeleteReview(this.review.id, this.params);
    }
  }
}
</script>

<template>
  <div class="bg-slate-100 border-black border-solid border-2 rounded-2xl min-h-[12rem] w-3/4 shadow-lg mb-4 p-4">
    <div class="flex h-full">
      <div class=" w-[6%] h-full">
        <img :src="review?.User?.Profile?.userPhoto" class=" object-cover w-full aspect-square rounded-full">
      </div>
      <div class=" w-11/12 h-full px-4">
        <form @submit.prevent="submitEditReview">
          <div class="float-right flex">
            <font-awesome-icon class=" text-yellow-300" icon="fa-solid fa-star" size="xl" />
            <p class="ml-2">{{ review?.rating }} / 5</p>
          </div>
          <p class="text-sm mb-1 text-slate-700">{{ review?.User?.username }}</p>
          <p class="text-sm mb-2 text-slate-700">visited on
            <span v-if="!showEditForm">{{ longDateFormatter }}</span>
            <input v-else-if="showEditForm" class="bg-slate-100 border-2 border-solid border-slate-400 rounded-lg px-1"
              type="date" v-model="numDate" :max="maxReviewDate">
          </p>
          <div class="grid grid-flow-row grid-rows-3 ">
            <div class="text-justify row-span-2">
              <p v-if="!showEditForm">{{ review.review }}</p>
              <textarea v-model="reviewContent" v-if="showEditForm"
                class="w-full h-full bg-slate-100 border-2 border-solid border-slate-400 rounded-lg py-1 px-2"
                maxlength="250" minlength="10"></textarea>
            </div>
            <div v-if="showEditButton" class="flex gap-5 mt-2">
              <button @click="toggleForm" v-if="!showEditForm"
                class=" rounded-full px-4 py-1 bg-green-400 hover:bg-green-500 hover:cursor-pointer text-white font-semibold">
                Edit
              </button>
              <button type="submit" v-if="showEditForm"
                class=" rounded-full px-4 py-1 bg-green-400 hover:bg-green-500 hover:cursor-pointer text-white font-semibold">
                Save
              </button>
              <button v-if="showEditForm" @click="toggleForm"
                class=" rounded-full px-4 py-1 bg-red-500 hover:bg-red-600 hover:cursor-pointer text-white font-semibold">
                Cancel
              </button>
              <button v-if="!showEditForm" @click="deleteReview"
                class=" rounded-full px-4 py-1 bg-red-500 hover:bg-red-600 hover:cursor-pointer text-white font-semibold">
                Delete
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>