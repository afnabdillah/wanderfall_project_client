import { defineStore } from 'pinia';
import axios from 'axios';

const base_url = 'http://localhost:3000';

export const useMainStore = defineStore('mainStore', {
  state: () => ({
    loginStatus: localStorage.access_token ? true : false,
    destinations: [],
    destinationDetails: null,
    mySchedules: [],
    imageUrls: [],
    tags: [],
  }),

  actions: {
    async handleLogin(input) {
      try {
        const { data } = await axios({
          method: 'POST',
          url: `${base_url}/login`,
          data: input
        });
        const { access_token, username } = data;
        localStorage.access_token = access_token;
        localStorage.username = username;
        this.loginStatus = true;
        this.router.push('/');
        return true;
      } catch (err) {
        console.trace(err);
        console.log(err.response.data);
        return false;
      }
    },

    handleLogout() {
      localStorage.clear();
      this.loginStatus = false;
      this.router.push('/');
    },

    async handleSignUp(input) {
      try {
        const { data } = await axios({
          method: 'POST',
          url: `${base_url}/signup`,
          data: input
        });
        await this.handleLogin({
          email: input.email,
          password: input.password
        });
      } catch (err) {
        console.trace(err);
        console.log(err.response.data);
      }
    },

    async fetchTags() {
      try {
        const { data } = await axios({
          method: 'GET',
          url: `${base_url}/destinations/tags`
        });
        this.tags = data;
      } catch (err) {
        console.trace(err);
        console.log(err.response.data);
      }
    },

    async fetchDestinations(query) {
      try {
        const { data } = await axios({
          method: 'GET',
          url: `${base_url}/destinations`,
          params: query
        })
        this.destinations = data;
      } catch (err) {
        console.trace(err);
        console.log(err.response.data);
      }
    },

    async fetchDestinationDetails(params) {
      try {
        const { data } = await axios({
          method: 'GET',
          url: `${base_url}/destinations/${params}`
        });
        this.destinationDetails = data;
        this.imageUrls = this.getImageUrls(this.destinationDetails.Images, this.destinationDetails.photoAttributes);
      } catch (err) {
        console.trace(err);
        console.log(err.response.data);
      }
    },

    async handleSubmitReview(input, params) {
      try {
        await axios({
          method: 'POST',
          url: `${base_url}/destinations/${params}/reviews`,
          headers: {
            access_token: localStorage.access_token
          },
          data: input
        })
        await this.fetchDestinationDetails(params);
        return true;
      } catch (err) {
        console.log(err.response.data);
        return false;
      }
    },

    async handleAddToSchedule(input, params) {
      try {
        await axios({
          method: 'POST',
          url: `${base_url}/destinations/${params}/schedule`,
          headers: {
            access_token: localStorage.access_token
          },
          data: input
        })
        this.router.push('/myschedule');
        return true;
      } catch (err) {
        console.trace(err);
        console.log(err.response.data);
        return false;
      }
    },

    async fetchMySchedules() {
      try {
        const { data } = await axios({
          method: 'GET',
          url: `${base_url}/schedules`,
          headers: {
            access_token: localStorage.access_token
          }
        })
        this.mySchedules = data;
      } catch (err) {
        console.log(err.response.data);
        console.trace(err);
      }
    },

    async handleEditSchedule(scheduleId, input) {
      try {
        await axios({
          method: 'PUT',
          url: `${base_url}/schedules/${scheduleId}`,
          headers: {
            access_token: localStorage.access_token
          },
          data: input
        });
        this.fetchMySchedules();
        return true;
      } catch (err) {
        console.log(err.response.data);
        console.trace(err);
        return false;
      }
    },

    async handleEditReview(reviewId, input, destinationId) {
      try {
        const config = {
          method: 'PUT',
          url: `${base_url}/destinations/${destinationId}/reviews/${reviewId}`,
          headers: {
            access_token: localStorage.access_token
          },
          data: input
        }
        await axios(config);
        this.fetchDestinationDetails(destinationId);
        return true;
      } catch (err) {
        console.log(err.response.data);
        console.trace(err);
        return false;
      }
    },

    async handleDeleteReview(reviewId, destinationId) {
      try {
        await axios({
          method: 'DELETE',
          url: `${base_url}/destinations/${destinationId}/reviews/${reviewId}`,
          headers: {
            access_token: localStorage.access_token
          }
        })
        this.fetchDestinationDetails(destinationId);
        return true;
      } catch (err) {
        console.log(err.response.data);
        console.trace(err);
        return false;
      }
    },

    async handleGoogleSignIn(response) {
      try {
        const credential = response.credential;
        const { data } = await axios({
          method: 'POST',
          url: `${base_url}/google-sign-in`,
          headers: { credential }
        })
        await this.handleLogin({
          email: data.email,
          password: 'google'
        });
      } catch (err) {
        console.log(err.response.data);
        console.trace(err);
      }

    },

    getImageUrls(images, googleImages) {
      const imgUrls = images.map(el => el.imgUrl);
      const placeImgUrls = googleImages?.map(el => {
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${el.width}&maxheight=${el.height}&photo_reference=${el.photo_reference}&key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}`;
      })
      return [...imgUrls, ...placeImgUrls];
    }
  },
})