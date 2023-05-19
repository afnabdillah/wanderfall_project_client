<script>
import Header from "../components/Header.vue";
import DestinationCard from "../components/DestinationCard.vue";
import { useMainStore } from "../stores/mainStore";
import { mapActions, mapState } from "pinia";

export default {
  data() {
    return {
      query: {
        tag: this.$route.query.tag ?? "",
        search: this.$route.query.search ?? "",
        size: this.$route.query.size ?? 5,
        page: this.$route.query.page ?? 1,
      },
      currentPage: 1,
    };
  },

  props: ["loginStatus"],

  components: {
    Header,
    DestinationCard,
  },

  computed: {
    ...mapState(useMainStore, ["destinations", "tags", "loading"]),

    pageCount() {
      return Math.ceil(this.destinations?.count / this.query.size);
    },
  },

  methods: {
    ...mapActions(useMainStore, ["fetchDestinations", "fetchTags"]),

    filterDestination(page) {
      this.query.page = page ?? 1;
      this.currentPage = page ?? 1;
      this.$router.push({ path: "/destinations", query: this.query });
      this.fetchDestinations(this.query);
    },
  },

  created() {
    this.fetchDestinations(this.query);
    this.fetchTags();
  },
};
</script>

<template>
  <Header />
  <main class="w-5/6 mx-auto min-h-screen">
    <!-- Form Container -->
    <div class="mt-10 text-center px-8">
      <h1 class="text-4xl font-semibold">
        Destinations that you might be interested in
      </h1>
      <form
        @submit.prevent="filterDestination(1)"
        class="flex my-10 justify-between"
      >
        <select
          v-model="query.tag"
          class="rounded-xl px-4 py-1 border-2 boreder-solid border-black"
        >
          <option selected hidden value="">Choose tag to filter</option>
          <option v-for="tag in tags" :key="tag.id" :value="tag.name">
            {{ tag.name }}
          </option>
        </select>
        <div>
          <input
            v-model="query.search"
            class="px-4 py-1.5 w-[40rem] rounded-xl border-2 border-black border-solid"
            type="search"
            placeholder="search here..."
          />
        </div>
        <div>
          <label for="count" class="mr-4">Page Size</label>
          <input
            v-model="query.size"
            id="count"
            class="border-2 border-black border-solid p-1 w-12 rounded-xl"
            type="number"
            min="1"
            max="100"
          />
        </div>
        <input
          type="submit"
          class="bg-slate-500 text-white rounded-full px-8 py-1 hover:cursor-pointer hover:bg-slate-400"
          value="filter"
        />
      </form>
    </div>
    <!-- Card Container -->
    <div class="w-full px-8">
      <div v-if="loading" class="flex justify-center items-center h-[42rem] w-full">
        <div
          class="inline-block border-green-400 h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] my-3.5"
          role="status"
        >
          <span
            class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
            >Loading...</span
          >
        </div>
      </div>
      <div v-else-if="!loading">
        <div v-if="destinations.destinations.length === 0">
          <p class="text-center text-2xl">
            There are no destinations with name containing "{{ this.$route.query.search }}".
          </p>
        </div>
        <DestinationCard
          v-else
          v-for="destination in destinations.destinations"
          :destination="destination"
        />
      </div>
    </div>
    <!-- Pagination Destinatoion -->
    <div class="flex items-center justify-between px-4 py-3 sm:px-6">
      <nav
        class="isolate inline-flex -space-x-px rounded-md shadow-sm w-1/6 mx-auto"
        aria-label="Pagination"
      >
        <a
          @click.prevent="filterDestination(page)"
          v-for="page in pageCount"
          :class="[currentPage === page ? 'current-page' : 'default-page']"
          class="hover:cursor-pointer"
          >{{ page }}</a
        >
      </nav>
    </div>
  </main>
</template>
