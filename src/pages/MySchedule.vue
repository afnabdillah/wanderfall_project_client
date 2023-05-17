<script>
import Header from "../components/Header.vue";
import { mapActions, mapState } from "pinia";
import { useMainStore } from "../stores/mainStore";

export default {
  data() {
    return {
      showEditSchedule: [],
      plan: "",
      scheduleDate: "",
      scheduleTime: "",
      scheduleEnd: "",
      isSyncWithGoogleCalendar: null,
      eventId: "",
    };
  },

  components: {
    Header,
  },

  computed: {
    ...mapState(useMainStore, [
      "mySchedules",
      "editScheduleErrMessage",
      "deleteScheduleErrMessage",
    ]),

    maxVisitDate() {
      return new Date().toISOString().split("T")[0];
    },
  },

  methods: {
    ...mapActions(useMainStore, [
      "fetchMySchedules",
      "handleEditSchedule",
      "handleDeleteSchedule",
    ]),

    longDateFormatter(scheduleDate) {
      let options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const date = new Date(scheduleDate);
      return new Intl.DateTimeFormat("en-US", options).format(date);
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
        this.scheduleDate = this.mySchedules[index].scheduleDate.split("T")[0];
        this.scheduleTime = this.mySchedules[index].scheduleTime;
        this.scheduleEnd = this.mySchedules[index].scheduleEnd;
        this.eventId = this.mySchedules[index].eventId;
        this.isSyncWithGoogleCalendar =
          this.mySchedules[index].isSyncWithGoogleCalendar;
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

    async editThisSchedule(scheduleId) {
      const input = {
        plan: this.plan,
        scheduleDate: this.scheduleDate,
        scheduleTime: this.scheduleTime.slice(0, 5),
        scheduleEnd: this.scheduleEnd.slice(0, 5),
        eventId: this.eventId,
        isSyncWithGoogleCalendar: this.isSyncWithGoogleCalendar,
      };
      this.handleEditSchedule(scheduleId, input, (err, result) => {
        if (err) {
          this.toastFirer("error", err.response.data.message);
        } else {
          this.showEditSchedule.forEach((el) => false);
          this.toastFirer(
            "success",
            "Your Schedule Has been Successfully Updated"
          );
        }
      });
    },

    async deleteSchedule(scheduleId, eventId) {
      this.$swal({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.handleDeleteSchedule(scheduleId, eventId, (err, result) => {
            if (err) {
              console.log(err);
              this.toastFirer("error", this.deleteScheduleErrMessage);
            } else {
              this.toastFirer("success", "Your Schedule Has been Deleted");
            }
          });
        }
      });
    },
  },

  async created() {
    await this.fetchMySchedules();
    this.showEditSchedule = this.mySchedules.map((el) => false);
    const links = this.mySchedules.map((el) => el.link);
  },
};
</script>

<template>
  <Header />
  <!-- Timeline design -->
  <main class="w-4/6 mx-auto mt-8 min-h-screen">
    <div class="text-center text-4xl font-bold mb-8">
      <h1>My Schedules</h1>
    </div>
    <!-- list schedules -->
    <div v-if="mySchedules.length === 0">
      <p class="text-center text-2xl">
        You don't have any schedules yet! Let's create a plan by going to
        <router-link to="/destinations" class="underline"
          >destinations</router-link
        >
        first!
      </p>
    </div>
    <ol class="relative">
      <div
        v-for="(mySchedule, index) in mySchedules"
        class="border-green-600 pl-6 pb-4 border-dashed"
        :class="[index !== mySchedules.length - 1 && 'border-l-[3px]']"
      >
        <li class="ml-6">
          <!-- Schedule Container -->
          <div>
            <span
              class="absolute flex items-center justify-center w-6 h-6 bg-green-500 rounded-full -left-3 ring-8 ring-green-500"
            >
              <svg
                aria-hidden="true"
                class="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </span>
            <h3
              class="flex items-center mb-1 text-lg font-semibold text-gray-900"
            >
              A Trip to {{ mySchedule.Destination.name }}
            </h3>
            <time
              class="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500"
            >
              {{ longDateFormatter(mySchedule.scheduleDate) }} ( from
              {{ timeSlicer(mySchedule.scheduleTime) }} to
              {{ timeSlicer(mySchedule.scheduleEnd) }} )
            </time>
            <p class="mb-4 text-base font-normal text-gray-600 text-justify">
              {{ mySchedule.plan }}
            </p>
            <div class="mb-4">
              <button
                @click="showEditForm(index, mySchedule.id)"
                href="#"
                class="inline-flex items-center px-4 py-2 text-sm font-medium border text-white border-gray-200 rounded-lg hover:bg-green-600 focus:z-10 bg-green-500 mr-4"
              >
                Edit this plan
              </button>
              <button
                @click="deleteSchedule(mySchedule.id, mySchedule.eventId)"
                href="#"
                class="inline-flex items-center px-4 py-2 text-sm font-medium border text-white border-gray-200 rounded-lg hover:bg-green-600 focus:z-10 bg-green-500 mr-4"
              >
                Delete this plan
              </button>
              <a
                v-if="mySchedule.isSyncWithGoogleCalendar"
                :href="mySchedule.link"
                target="_blank"
                class="inline-flex items-center px-4 py-2 text-sm font-medium border text-white border-gray-200 rounded-lg hover:bg-green-600 focus:z-10 bg-green-500 mr-4"
              >
                View on Google Calendar
              </a>
            </div>
          </div>
          <!-- Edit Schedule Container -->
          <div
            class="w-full origin-top ease-in-out forwards duration-[600ms]"
            :class="[
              showEditSchedule[index]
                ? 'h-[28rem] scale-y-100'
                : 'h-0 scale-y-0',
            ]"
          >
            <form @submit.prevent="editThisSchedule(mySchedule.id)">
              <h2 class="text-lg font-semibold my-2">Edit this schedule</h2>
              <p class="mb-2">Have a change in plans?</p>
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
              <p class="mt-2"></p>
              <button
                type="submit"
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700 mr-4"
              >
                Submit
              </button>
            </form>
          </div>
        </li>
      </div>
    </ol>
  </main>
</template>
