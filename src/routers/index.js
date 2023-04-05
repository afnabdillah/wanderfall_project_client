import { createRouter, createWebHistory } from 'vue-router';
import Login from '../pages/Login.vue';
import Signup from '../pages/Signup.vue';
import Destinations from '../pages/Destinations.vue';
import DestinationDetails from '../pages/DestinationDetails.vue';
import MySchedule from '../pages/MySchedule.vue';
import Home from '../pages/Home.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path : '/',
      name : 'home',
      component : Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },
    {
      path: '/destinations',
      name: 'destinations',
      component: Destinations
    },
    {
      path: '/destinations/:destinationId',
      name: 'destinationDetails',
      component: DestinationDetails
    },
    {
      path: '/myschedule',
      name: 'mySchedule',
      component: MySchedule
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name === 'login' && localStorage.access_token) {
    next({ name: 'home' });
  } else if (to.name === 'mySchedule' && !localStorage.access_token) {
    next({ name: 'login' });
  } else {
    next();
  }
})

export default router;