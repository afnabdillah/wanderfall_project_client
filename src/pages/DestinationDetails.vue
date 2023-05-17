<script>
import Header from "../components/Header.vue";
import GoogleMap from "../components/GoogleMap.vue";
import ReviewCard from "../components/ReviewCard.vue";
import { mapActions, mapState } from "pinia";
import { useMainStore } from "../stores/mainStore";

export default {
  data() {
    return {
      loginStatus: localStorage.access_token ? true : false,
      showGoogleMaps: false,
      currentImage: "",
      showAddReview: false,
      showAddSchedule: false,
      review: "",
      visitDate: new Date(),
      rating: 0,
      plan: "",
      scheduleDate: "",
      scheduleTime: "",
      scheduleEnd: "",
      googlePlacePhoto: null,
    };
  },

  components: {
    Header,
    GoogleMap,
    ReviewCard,
  },

  computed: {
    ...mapState(useMainStore, [
      "destinationDetails",
      "imageUrls",
      "addScheduleErrMessage",
      "addReviewErrMessage",
      "tokenClient",
    ]),

    computeRating() {
      const ratings = this.destinationDetails?.Reviews.map((el) => el.rating);
      let avgRating;
      if (ratings?.length === 0) {
        avgRating = "-";
      } else {
        avgRating =
          ratings?.reduce((total, num) => total + num, 0) / ratings?.length;
        avgRating = avgRating.toFixed(1);
      }
      return avgRating;
    },

    timeFormatter() {
      if (
        !this.destinationDetails?.openTime ||
        !this.destinationDetails?.closeTime
      ) {
        return "Unavailable";
      } else {
        return `${this.destinationDetails?.openTime.slice(
          0,
          5
        )} - ${this.destinationDetails?.closeTime.slice(0, 5)}`;
      }
    },

    priceFormatter() {
      if (this.destinationDetails?.price > 0) {
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumSignificantDigits: 1,
        }).format(this.destinationDetails.price);
      } else {
        return "Free";
      }
    },

    maxVisitDate() {
      return new Date().toISOString().split("T")[0];
    },

    params() {
      let params = this.$route.params.destinationId;
      return +params.split("-").slice(-1)[0];
    },
  },

  methods: {
    ...mapActions(useMainStore, [
      "fetchDestinationDetails",
      "handleSubmitReview",
      "handleAddToSchedule",
      "fetchGooglePlaceImages",
    ]),

    changeImage(i) {
      this.currentImage = this.imageUrls[i];
    },

    slideImage(num) {
      const index = this.imageUrls.indexOf(this.currentImage);
      if (index + num < 0) {
        this.currentImage = this.imageUrls[this.imageUrls.length - 1];
      } else if (index + num > this.imageUrls.length - 1) {
        this.currentImage = this.imageUrls[0];
      } else {
        this.currentImage = this.imageUrls[index + num];
      }
    },

    toggleAddSchedule() {
      if (this.showAddSchedule) {
        this.showAddSchedule = false;
      } else {
        this.showAddSchedule = true;
      }
    },

    changeReviewTab(str) {
      if (str === "add") {
        console.log(
          this.tokenClient,
          "<<<<< ini token client di destination details"
        );
        console.log(gapi.client.getToken(), "<<<<<< ini isi token kita");
        this.showAddReview = true;
      } else {
        this.showAddReview = false;
      }
    },

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

    async submitReview() {
      const input = {
        review: this.review,
        rating: this.rating,
        visitDate: this.visitDate,
      };
      const result = await this.handleSubmitReview(input, this.params);
      if (result) {
        this.showAddReview = false;
        this.toastFirer("success", "Your review has been added!");
      } else {
        this.toastFirer("error", this.addReviewErrMessage);
      }
    },

    async addToSchedule() {
      const input = {
        destinationName: this.destinationDetails.name,
        latitude: this.destinationDetails.latitude,
        longitude: this.destinationDetails.longitude,
        plan: this.plan,
        scheduleDate: this.scheduleDate,
        scheduleTime: this.scheduleTime,
        scheduleEnd: this.scheduleEnd,
        isSyncWithGoogleCalendar: this.isSyncWithGoogleCalendar,
      };
      this.handleAddToSchedule(
        input,
        this.params,
        import.meta.env.VITE_GOOGLE_MAPS_KEY,
        (err, result) => {
          if (err) {
            console.log(err.response, "<<<< ini response");
            this.toastFirer("error", err.response.data.message);
          } else {
            this.toastFirer(
              "success",
              "Your Schedule Has Been Successfully added!"
            );
          }
        }
      );
    },
  },

  async created() {
    await this.fetchDestinationDetails(this.params);
    this.showGoogleMaps = true;
    this.showReviewTab = true;
    this.currentImage = this.imageUrls[0];
  },
};
</script>

<template>
  <Header />
  <main class="w-4/5 mx-auto mt-8 min-h-screen">
    <!-- Destination Description Container -->
    <h1 class="text-center text-4xl font-bold mb-4">
      {{ destinationDetails?.name }}
    </h1>
    <div class="grid grid-cols-2 gap-16 mb-4">
      <div>
        <h2
          class="text-left text-2xl font-bold mb-4 underline underline-offset-8"
        >
          About
        </h2>
        <div class="text-justify">
          {{ destinationDetails?.description }}
        </div>
      </div>
      <div class="text-left">
        <div>
          <h2
            class="text-left text-2xl font-bold mb-4 underline underline-offset-8"
          >
            Tags
          </h2>
          <ul class="grid grid-flow-col grid-rows-4 gap-1 list-disc">
            <li v-for="tag in destinationDetails?.Tags">
              <router-link :to="`/destinations/?tag=${tag?.name}`">{{
                tag?.name
              }}</router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div>
      <h2 class="text-2xl font-bold mb-4 underline underline-offset-8">
        Informations
      </h2>
      <div class="grid grid-cols-6 gap-2 mb-2 items-center">
        <div class="flex">
          <font-awesome-icon
            class="text-yellow-300"
            icon="fa-solid fa-star"
            size="xl"
          />
          <p class="ml-2">{{ computeRating }} / 5</p>
        </div>
        <div class="flex">
          <font-awesome-icon
            class="text-slate-400"
            icon="fa-solid fa-location-dot"
            size="xl"
          />
          <p class="ml-2">
            {{ destinationDetails?.city }}, {{ destinationDetails?.country }}
          </p>
        </div>
        <div class="flex">
          <font-awesome-icon
            class="text-slate-400"
            icon="fa-solid fa-money-bill"
            size="xl"
          />
          <p class="ml-2">{{ priceFormatter }}</p>
        </div>
        <div class="flex">
          <font-awesome-icon
            class="text-slate-400"
            icon="fa-solid fa-clock"
            size="xl"
          />
          <p class="ml-2">{{ timeFormatter }}</p>
        </div>
        <div class="flex">
          <font-awesome-icon
            class="text-slate-400"
            icon="fa-solid fa-comments"
            size="xl"
          />
          <p class="ml-2">{{ destinationDetails?.Reviews.length }} reviews</p>
        </div>
        <div class="flex col-start-6">
          <button
            v-if="loginStatus"
            @click.prevent="toggleAddSchedule()"
            class="rounded-full bg-green-400 hover:bg-green-500 w-full h-full pl-4 pr-2 py-2 text-white flex justify-center items-center hover:cursor-pointer"
          >
            <font-awesome-icon class="mr-2" icon="fa-solid fa-plus" size="lg" />
            <p class="text-sm font-bold">Add To Schedule</p>
          </button>
          <router-link
            to="/login"
            v-else-if="!loginStatus"
            class="rounded-full bg-slate-500 hover:bg-slate-600 w-full h-full pl-4 pr-2 py-2 text-white flex justify-center items-center hover:cursor-pointer"
          >
            <p class="text-sm font-bold">Log In First to Add</p>
          </router-link>
        </div>
      </div>
    </div>
    <!-- Add To Schedule Container -->
    <div
      v-if="loginStatus"
      class="w-full origin-top ease-in-out forwards duration-[600ms]"
      :class="[showAddSchedule ? 'h-[32rem] scale-y-100' : 'h-0 scale-y-0']"
    >
      <form @submit.prevent="addToSchedule">
        <h2 class="text-2xl font-bold mb-4 underline underline-offset-8">
          Add to Your Schedule
        </h2>
        <p class="mb-2">Write your plan here :</p>
        <textarea
          v-model="plan"
          class="px-2 py-1 border-2 border-solid border-black w-2/3 h-24"
          id=""
        ></textarea>
        <p class="mb-2">Date :</p>
        <input
          v-model="scheduleDate"
          class="mb-2 px-2 border-2 border-solid border-black"
          type="date"
          :min="maxVisitDate"
        />
        <p class="mb-2">Start Time :</p>
        <input
          v-model="scheduleTime"
          class="mb-2 px-2 border-2 border-solid border-black"
          type="time"
        />
        <p class="mb-2">End Time :</p>
        <input
          v-model="scheduleEnd"
          class="mb-2 px-2 border-2 border-solid border-black"
          type="time"
        />
        <div class="grid grid-cols-6 mt-4">
          <button
            type="submit"
            class="rounded-full bg-green-400 hover:bg-green-500 w-full h-full pl-4 pr-2 py-2 text-white flex justify-center items-center hover:cursor-pointer"
          >
            <font-awesome-icon class="mr-2" icon="fa-solid fa-plus" size="lg" />
            <p class="text-sm font-bold">Add To Schedule</p>
          </button>
        </div>
      </form>
    </div>
    <!-- Carousel Container -->
    <h2 class="text-2xl font-bold mb-4 underline underline-offset-8">
      Photo Collection
    </h2>
    <div
      class="bg-slate-200 w-full h-[40rem] mb-8 ease-in-out forwards duration-300"
    >
      <div class="pt-8 px-8 pb-4 h-3/4">
        <div class="h-full w-full relative bg-slate-600">
          <img :src="currentImage" class="object-cover h-full w-full" />
          <div
            class="absolute left-0 top-0 w-1/12 h-full hover:bg-gradient-to-r hover:w-[12.5%] hover:from-slate-200 transition-all"
          >
            <div
              @click.prevent="slideImage(-1)"
              class="absolute-vertical-middle left-1/4 w-[40px] aspect-square rounded-full opacity-50 bg-slate-300 hover:opacity-100 hover:cursor-pointer"
            >
              <font-awesome-icon
                class="absolute-middle"
                icon="fa-solid fa-angle-left"
                size="lg"
              />
            </div>
          </div>
          <div
            @click.prevent="slideImage(1)"
            class="absolute right-0 top-0 w-1/12 h-full hover:bg-gradient-to-l hover:w-[12.5%] hover:from-slate-200 transition-all"
          >
            <div
              class="absolute-vertical-middle right-1/4 w-[40px] aspect-square rounded-full opacity-50 bg-slate-300 hover:opacity-100 hover:cursor-pointer"
            >
              <font-awesome-icon
                class="absolute-middle"
                icon="fa-solid fa-angle-right"
                size="lg"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="px-8 py-4 h-1/4 overflow-x-auto flex justify-left">
        <div
          v-for="(image, index) in imageUrls"
          @click.prevent="changeImage(index)"
          :class="[currentImage !== image ? 'opacity-50' : '']"
          class="h-full aspect-square mr-8 bg-slate-800 bg-center bg-cover hover:cursor-pointer"
        >
          <img :src="image" class="object-cover w-full h-full" />
        </div>
      </div>
    </div>
    <!-- Maps Location Container -->
    <div class="">
      <h2 class="text-2xl font-bold mb-4 underline underline-offset-8">
        Find On Google Maps
      </h2>
      <p class="text-left mb-2">
        <span class="font-bold">Address: </span
        >{{ destinationDetails?.address }}
      </p>
    </div>
    <GoogleMap
      v-if="showGoogleMaps"
      :lat="destinationDetails?.latitude"
      :lng="destinationDetails?.longitude"
    />
    <!-- Reviews Container -->
    <div class="flex">
      <h2
        @click.prevent="changeReviewTab('view')"
        :class="[showAddReview ? '' : ' underline-offset-8 underline']"
        class="text-2xl font-bold mb-4 pr-8 hover:cursor-pointer"
      >
        Reviews
      </h2>
      <h2
        @click.prevent="changeReviewTab('add')"
        :class="[showAddReview ? ' underline-offset-8 underline' : '']"
        class="text-2xl font-bold mb-4 pr-8 hover:cursor-pointer"
      >
        Add Your Review
      </h2>
    </div>
    <!-- Reviews -->
    <div class=" pb-20" v-if="showAddReview">
      <form @submit.prevent="submitReview">
        <p class="mb-2">How was your journey?</p>
        <textarea
          v-model="review"
          class="border-2 border-slate-600 border-solid p-2 mb-2 w-2/3 h-24"
          placeholder="write your experience here..."
          maxlength="250"
          minlength="10"
        >
        </textarea>
        <p class="mb-2">When did you visit this place?</p>
        <input
          v-model="visitDate"
          class="border-2 border-slate-600 border-solid px-2 mb-2"
          type="date"
          :max="maxVisitDate"
        />
        <p class="mb-2">How was your experience?</p>
        <select
          v-model="rating"
          class="border-2 border-slate-600 border-solid px-2 py-1 mb-4"
          name=""
          id=""
        >
          <option value="0" hidden>Select your rating</option>
          <option value="5">It was very amazing! (5 star)</option>
          <option value="4">It's great! (4 star)</option>
          <option value="3">Pretty so-so (3 star)</option>
          <option value="2">I was dissapointed (2 star)</option>
          <option value="1">It was terrible (1 star)</option>
        </select>
        <p></p>
        <button
          class="text-white font-semibold px-4 py-2 bg-green-400 hover:bg-green-500 rounded-full mb-4"
          type="submit"
        >
          Submit Your Review
        </button>
      </form>
    </div>
    <div class=" pb-20" v-else-if="!showAddReview">
      <div
        class="h-32 flex items-center"
        v-if="destinationDetails.Reviews.length === 0"
      >
        <p class="text-left text-xl">
          There aren't any review yet! Be the first person to review this place!
        </p>
      </div>
      <ReviewCard
        v-for="review in destinationDetails?.Reviews"
        :key="review.id"
        :review="review"
      />
    </div>
  </main>
</template>
