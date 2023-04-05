<script>
import Header from '../components/Header.vue';
import { mapActions, mapState } from 'pinia';
import { useMainStore } from '../stores/mainStore';


export default {

  data() {
    return {
      showEditSchedule: [],
      plan: '',
      scheduleDate: '',
      scheduleTime: '',
      scheduleEnd: '',
      isSyncWithGoogleCalendar: null,
    }
  },

  components: {
    Header
  },

  computed: {
    ...mapState(useMainStore, ['mySchedules']),

    maxVisitDate() {
      return new Date().toISOString().split('T')[0];
    }
  },

  methods: {
    ...mapActions(useMainStore, ['fetchMySchedules', 'handleEditSchedule']),

    longDateFormatter(scheduleDate) {
      let options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const date = new Date(scheduleDate);
      return new Intl.DateTimeFormat('en-US', options).format(date);
    },

    timeSlicer(time) {
      return time.slice(0, 5);
    },

    showEditForm(index, id) {
      if (this.showEditSchedule[index]) {
        this.showEditSchedule[index] = false;
      } else {
        this.showEditSchedule[index] = true;
        this.plan = this.mySchedules[index].plan;
        this.scheduleDate = this.mySchedules[index].scheduleDate.split('T')[0];
        this.scheduleTime = this.mySchedules[index].scheduleTime;
        this.scheduleEnd = this.mySchedules[index].scheduleEnd;
        this.isSyncWithGoogleCalendar = this.mySchedules[index].isSyncWithGoogleCalendar;
      }
    },

    async editThisSchedule(scheduleId) {
      const input = {
        plan: this.plan,
        scheduleDate: this.scheduleDate,
        scheduleTime: this.scheduleTime.slice(0, 5),
        scheduleEnd: this.scheduleEnd.slice(0, 5),
        isSyncWithGoogleCalendar: this.isSyncWithGoogleCalendar,
      }
      const result = await this.handleEditSchedule(scheduleId, input);
      if (result) {
        this.showEditSchedule[index] = false;
      }
    }
  },

  async created() {
    await this.fetchMySchedules();
    this.showEditSchedule = this.mySchedules.map(el => false);
    const links = this.mySchedules.map(el => el.link);
  }
}

</script>

<template>
  <Header />
  <!-- Timeline design -->
  <main class=" w-4/6 mx-auto mt-8 min-h-screen ">
    <div class="text-center text-4xl font-bold mb-8">
      <h1>My Schedules</h1>
    </div>
    <!-- list schedules -->
    <div v-if="mySchedules.length === 0">
      <p class="text-center text-2xl">You don't have any schedules yet! Let's create a plan by going to <router-link
          to="/destinations" class=" underline">destinations</router-link> first!</p>
    </div>
    <ol class="relative border-l border-gray-200 dark:border-gray-700">
      <li v-for="(mySchedule, index) in mySchedules" class="mb-10 ml-6">
        <!-- Schedule Container -->
        <div>
          <span
            class="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-black dark:bg-blue-900">
            <svg aria-hidden="true" class="w-3 h-3 text-blue-800 dark:text-blue-300" fill="currentColor"
              viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clip-rule="evenodd"></path>
            </svg>
          </span>
          <h3 class="flex items-center mb-1 text-lg font-semibold text-gray-900">A Trip to {{ mySchedule.Destination.name
          }}
          </h3>
          <time class="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
            {{ longDateFormatter(mySchedule.scheduleDate) }} ( from {{ timeSlicer(mySchedule.scheduleTime) }} to {{
              timeSlicer(mySchedule.scheduleEnd) }} )
          </time>
          <p class="mb-4 text-base font-normal text-gray-600 text-justify">
            {{ mySchedule.plan }}
          </p>
          <div class="mb-4">
            <button @click="showEditForm(index, mySchedule.id)" href="#"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700 mr-4">
              Edit this plan
            </button>
            <a v-if="mySchedule.isSyncWithGoogleCalendar" :href="mySchedule.link" target="_blank"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700 mr-4">
              View on Google Calendar
            </a>
          </div>
        </div>
        <!-- Edit Schedule Container -->
        <div class=" w-full origin-top ease-in-out forwards duration-[600ms]"
          :class="[showEditSchedule[index] ? 'h-[32rem] scale-y-100' : 'h-0 scale-y-0']">
          <form @submit.prevent="editThisSchedule(mySchedule.id)">
            <h2 class="text-lg font-semibold my-2">Edit this schedule</h2>
            <p class="mb-2">Have a change in plans?</p>
            <textarea v-model="plan" class="px-2 py-1 border-2 border-solid border-black w-2/3 h-24" id=""></textarea>
            <p class="mb-2">Date :</p>
            <input v-model="scheduleDate" class="mb-2 px-2 border-2 border-solid border-black" type="date"
              :min="maxVisitDate">
            <p class="mb-2">Start Time :</p>
            <input v-model="scheduleTime" class="mb-2 px-2 border-2 border-solid border-black" type="time">
            <p class="mb-2">End Time :</p>
            <input v-model="scheduleEnd" class="mb-2 px-2 border-2 border-solid border-black" type="time">
            <p class="mb-2">Do you want to sync it with Google Calendar? <span class="text-sm">(*You might be asked to
                sign
                in
                first)</span></p>
            <div class="mb-2">
              <input v-model="isSyncWithGoogleCalendar" class="mr-2" type="radio" name="isSyncWithGoogleCalendar"
                value="true">
              <label class="mr-2" for="">Yes</label>
              <input v-model="isSyncWithGoogleCalendar" class="mr-2" type="radio" name="isSyncWithGoogleCalendar"
                value="false">
              <label class="mr-2" for="">No</label>
            </div>
            <button type="submit"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700 mr-4">
              Submit
            </button>
          </form>
        </div>
      </li>
    </ol>
  </main>
</template>