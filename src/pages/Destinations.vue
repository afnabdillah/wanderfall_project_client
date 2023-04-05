<script>
import Header from '../components/Header.vue';
import DestinationCard from '../components/DestinationCard.vue';
import { useMainStore } from '../stores/mainStore';
import { mapActions, mapState } from 'pinia';

export default {

  data() {
    return {
      query: {
        tag: '',
        search: '',
        size: 5,
        page: 1,
      },
      currentPage : 1
    }
  },

  props: ['loginStatus'],

  components: {
    Header,
    DestinationCard
  },

  computed: {
    ...mapState(useMainStore, ['destinations', 'tags']),

    pageCount() {
      return Math.ceil(this.destinations?.count / this.query.size);
    }
  },

  watch: {
    query(query) {
      console.log(query, '<<< ini query dari watcher');
    }
  },

  methods: {
    ...mapActions(useMainStore, ['fetchDestinations', 'fetchTags']),

    filterDestination(page) {
      this.query.page = page ?? 1;
      this.currentPage = page ?? 1;
      this.$router.push({ path: '/destinations', query: this.query });
      this.fetchDestinations(this.query);
    }
  },

  created() {
    this.fetchDestinations();
    this.fetchTags();
  }
}
</script>

<template>
  <Header />
  <main class="w-5/6 mx-auto min-h-screen">
    <!-- Form Container -->
    <div class="mt-10 text-center px-8">
      <h1 class="text-4xl font-semibold">Destinations that you might be interested in</h1>
      <form @submit.prevent="filterDestination(1)" class="flex my-10 justify-between">
        <select v-model="query.tag" class="rounded-xl px-4 py-1 border-2 boreder-solid border-black">
          <option selected hidden value="">Choose tag to filter</option>
          <option v-for="tag in tags" :key="tag.id" :value="tag.name">{{ tag.name }}</option>
        </select>
        <div>
          <input v-model="query.search" class="px-4 py-1.5 w-[40rem] rounded-xl border-2 border-black border-solid"
            type="search" placeholder="search here...">
        </div>
        <div>
          <label for="count" class="mr-4">Page Size</label>
          <input v-model="query.size" id="count" class="border-2 border-black border-solid p-1 w-12 rounded-xl"
            type="number" min="1" max="100">
        </div>
        <input type="submit"
          class="bg-slate-500 text-white rounded-full px-8 py-1 hover:cursor-pointer hover:bg-slate-400" value="filter">
      </form>
    </div>
    <!-- Card Container -->
    <div class="w-full px-8">
      <DestinationCard v-for="destination in destinations.destinations" :destination="destination" />
    </div>
    <!-- Pagination Destinatoion -->
    <div class="flex items-center justify-between px-4 py-3 sm:px-6">
      <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm w-1/6 mx-auto" aria-label="Pagination">
        <a @click.prevent="filterDestination(page)" v-for="page in pageCount" :class="[currentPage === page ? 'current-page' : 'default-page']" class="hover:cursor-pointer">{{ page }}</a>
      </nav>
    </div>
  </main>
</template>