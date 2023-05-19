import { defineStore } from "pinia";
import axios from "axios";

const base_url = "http://localhost:8080";
// const base_url = "https://wanderfall.fly.dev";

export const useMainStore = defineStore("mainStore", {
  state: () => ({
    loginStatus: localStorage.access_token ? true : false,
    loginErrMessage: "",
    signUpErrMessage: "",
    addScheduleErrMessage: "",
    editScheduleErrMessage: "",
    deleteScheduleErrMessage: "",
    addReviewErrMessage: "",
    editReviewErrMessage: "",
    deleteReviewErrMessage: "",
    destinations: [],
    destinationDetails: null,
    mySchedules: [],
    imageUrls: [],
    loading: false,
    tags: [],
    // For google calendar needs
    SCOPES: "https://www.googleapis.com/auth/calendar",
    DISCOVERY_DOC:
      "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
    gisInited: false,
    gapiInited: false,
    tokenClient: null,
  }),

  actions: {
    async handleLogin(input) {
      try {
        this.loading = true;
        const { data } = await axios({
          method: "POST",
          url: `${base_url}/login`,
          data: input,
        });
        const { access_token, username } = data;
        localStorage.access_token = access_token;
        localStorage.username = username;
        this.loginStatus = true;
        this.loading = false;
        this.router.push("/");
        return true;
      } catch (err) {
        this.loading = false;
        console.log(err.response.data);
        this.loginErrMessage = err.response.data.message;
        return false;
      }
    },

    handleLogout() {
      const token = gapi.client.getToken();
      if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken("");
      }
      localStorage.clear();
      this.loginStatus = false;
      this.router.push("/");
    },

    async handleSignUp(input) {
      try {
        this.loading = true;
        await axios({
          method: "POST",
          url: `${base_url}/signup`,
          data: input,
        });
        await this.handleLogin({
          email: input.email,
          password: input.password,
        });
        this.loading = false;
        return true;
      } catch (err) {
        this.loading = false;
        this.signUpErrMessage = err.response.data.message;
        return false;
      }
    },

    async fetchTags() {
      try {
        this.loading = true;
        const { data } = await axios({
          method: "GET",
          url: `${base_url}/destinations/tags`,
        });
        this.tags = data;
        this.loading = false;
      } catch (err) {
        this.loading = false;
        console.trace(err);
        console.log(err.response.data);
      }
    },

    async fetchDestinations(query) {
      try {
        this.loading = true;
        const { data } = await axios({
          method: "GET",
          url: `${base_url}/destinations`,
          params: query,
        });
        this.destinations = data;
        this.loading = false;
      } catch (err) {
        this.loading = false;
        console.trace(err);
        console.log(err.response.data);
      }
    },

    async fetchDestinationDetails(params) {
      try {
        this.loading = true;
        const { data } = await axios({
          method: "GET",
          url: `${base_url}/destinations/${params}`,
        });
        this.destinationDetails = data;
        this.imageUrls = this.getImageUrls(
          this.destinationDetails.Images,
          this.destinationDetails.photoAttributes
        );
        this.loading = false;
      } catch (err) {
        this.loading = false;
        console.trace(err);
        console.log(err.response.data);
      }
    },

    async handleSubmitReview(input, params) {
      try {
        this.loading = true;
        await axios({
          method: "POST",
          url: `${base_url}/destinations/${params}/reviews`,
          headers: {
            access_token: localStorage.access_token,
          },
          data: input,
        });
        await this.fetchDestinationDetails(params);
        this.loading = false;
        return true;
      } catch (err) {
        this.loading = false;
        this.addReviewErrMessage = err.response.data.message;
        return false;
      }
    },

    handleAddToSchedule(input, params, maps_api_key, cb) {
      this.tokenClient.callback = async () => {
        try {
          this.loading = true;
          const timeZone = await this.getTimeZone(
            input.latitude,
            input.longitude,
            maps_api_key
          );
          const event = {
            summary: input.plan,
            location: input.address,
            description: `I'm going to have fun in ${input.destinationName}!`,
            start: {
              dateTime: `${input.scheduleDate}T${input.scheduleTime}:00`,
              timeZone,
            },
            end: {
              dateTime: `${input.scheduleDate}T${input.scheduleEnd}:00`,
              timeZone,
            },
          };

          const response = await gapi.client.calendar.events.insert({
            calendarId: "primary",
            resource: event,
          });

          input.link = response.result.htmlLink;
          input.eventId = response.result.id;
          input.isSyncWithGoogleCalendar = true;

          await axios({
            method: "POST",
            url: `${base_url}/destinations/${params}/schedule`,
            headers: {
              access_token: localStorage.access_token,
            },
            data: input,
          });
          this.loading = false;
          this.router.push("/myschedule");
          return cb(null, true);
        } catch (err) {
          this.loading = false;
          cb(err);
        }
      };
      if (gapi.client.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        this.tokenClient.requestAccessToken({ prompt: "consent" });
      } else {
        // Skip display of account chooser and consent dialog for an existing session.
        this.tokenClient.requestAccessToken({ prompt: "" });
      }
    },

    async fetchMySchedules() {
      try {
        this.loading = true;
        const { data } = await axios({
          method: "GET",
          url: `${base_url}/schedules`,
          headers: {
            access_token: localStorage.access_token,
          },
        });
        this.mySchedules = data;
        this.loading = false;
      } catch (err) {
        this.loading = false;
        console.log(err.response.data);
        console.trace(err);
      }
    },

    handleEditSchedule(scheduleId, input, cb) {
      this.tokenClient.callback = async () => {
        try {
          this.loading = true;
          const event = {
            summary: input.plan,
            location: input.address,
            start: {
              dateTime: `${input.scheduleDate}T${input.scheduleTime}:00`,
              timeZone: "Asia/Jakarta",
            },
            end: {
              dateTime: `${input.scheduleDate}T${input.scheduleEnd}:00`,
              timeZone: "Asia/Jakarta"
            },
          };
          await gapi.client.calendar.events.update({
            calendarId: "primary",
            eventId: input.eventId,
            resource: event,
          });
          await axios({
            method: "PUT",
            url: `${base_url}/schedules/${scheduleId}`,
            headers: {
              access_token: localStorage.access_token,
            },
            data: input,
          });
          await this.fetchMySchedules();
          this.loading = false;
          cb(null, true);
        } catch (err) {
          this.loading = false;
          cb(err);
        }
      }
      if (gapi.client.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        this.tokenClient.requestAccessToken({ prompt: "consent" });
      } else {
        // Skip display of account chooser and consent dialog for an existing session.
        this.tokenClient.requestAccessToken({ prompt: "" });
      }
    },

    async handleEditReview(reviewId, input, destinationId) {
      try {
        this.loading = true;
        const config = {
          method: "PUT",
          url: `${base_url}/destinations/${destinationId}/reviews/${reviewId}`,
          headers: {
            access_token: localStorage.access_token,
          },
          data: input,
        };
        await axios(config);
        await this.fetchDestinationDetails(destinationId);
        this.loading = false;
        return true;
      } catch (err) {
        this.loading = false;
        this.editReviewErrMessage = err.response.data.message;
        return false;
      }
    },

    async handleDeleteReview(reviewId, destinationId) {
      try {
        this.loading = true;
        await axios({
          method: "DELETE",
          url: `${base_url}/destinations/${destinationId}/reviews/${reviewId}`,
          headers: {
            access_token: localStorage.access_token,
          },
        });
        await this.fetchDestinationDetails(destinationId);
        this.loading = false;
        return true;
      } catch (err) {
        this.loading = false;
        this.deleteReviewErrMessage = err.response.data.message;
        return false;
      }
    },

    async handleGoogleSignIn(response) {
      try {
        this.loading = true;
        const credential = response.credential;
        const { data } = await axios({
          method: "POST",
          url: `${base_url}/google-sign-in`,
          headers: { credential },
        });
        await this.handleLogin({
          email: data.email,
          password: "google",
        });
        this.loading = false;
      } catch (err) {
        this.loading = false;
        console.log(err.response.data);
        console.trace(err);
      }
    },

    handleDeleteSchedule(scheduleId, eventId, cb) {
      this.tokenClient.callback = async () => {
        try {
          this.loading = true;
          await gapi.client.calendar.events.delete({
            calendarId: "primary",
            eventId,
          });
          await axios({
            method: "DELETE",
            url: `${base_url}/schedules/${scheduleId}`,
            headers: {
              access_token: localStorage.access_token,
            },
          });
          await this.fetchMySchedules();
          this.loading = false;
          cb(null, true);
        } catch (err) {
          this.loading = false;
          cb(err);
        }
      }
      if (gapi.client.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        this.tokenClient.requestAccessToken({ prompt: "consent" });
      } else {
        // Skip display of account chooser and consent dialog for an existing session.
        this.tokenClient.requestAccessToken({ prompt: "" });
      }
    },

    getImageUrls(images, googleImages) {
      const imgUrls = images.map((el) => el.imgUrl);
      const placeImgUrls = googleImages?.map((el) => {
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${
          el.width
        }&maxheight=${el.height}&photo_reference=${el.photo_reference}&key=${
          import.meta.env.VITE_GOOGLE_MAPS_KEY
        }`;
      });
      return [...imgUrls, ...placeImgUrls];
    },

    gapiLoaded() {
      gapi.load("client", this.initializeGapiClient);
    },

    initializeGapiClient() {
      gapi.client
        .init({
          apiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
          discoveryDocs: [this.DISCOVERY_DOC],
        })
        .then(() => {
          this.gapiInited = true;
        });
    },

    gisLoaded() {
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID,
        scope: this.SCOPES,
        access_type: "offline",
        callback: "", // defined later
      });
      this.gisInited = true;
    },

    async getTimeZone(lat, lng, maps_api_key) {
      try {
        const timestamp = Math.floor(new Date().getTime() / 1000);
        const config = {
          method: "get",
          url: `https://maps.googleapis.com/maps/api/timezone/json?location=${lat}%2C${lng}&timestamp=${timestamp}&key=${maps_api_key}`,
          headers: {},
        };
        const response = await axios(config);
        return response.data.timeZoneId;
      } catch (err) {
        console.log(err);
      }
    },
  },
});
