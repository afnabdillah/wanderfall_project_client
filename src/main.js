import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faLocationDot, faMoneyBill, faClock, faStar, faComments, faAngleLeft, faAngleRight, faPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import App from './App.vue'
import router from './routers'
import vue3GoogleLogin from 'vue3-google-login'

library.add(faLocationDot, faMoneyBill, faClock, faStar, faComments, faAngleLeft, faAngleRight, faPlus, faArrowLeft)

const app = createApp(App)
const pinia = createPinia()

pinia.use(({store}) => {
  store.router = markRaw(router)
})

app.use(vue3GoogleLogin, {
  clientId : import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID
})

app.use(pinia)
app.use(router)
app
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app')
