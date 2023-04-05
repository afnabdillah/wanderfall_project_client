<script>
import { defineComponent } from "vue";
import { GoogleMap, Marker } from "vue3-google-map";

export default defineComponent({

  data() {
    return {
      api_key : import.meta.env.VITE_GOOGLE_MAPS_KEY
    }
  },

  props : ['lat', 'lng'],

  components: { 
    GoogleMap,
    Marker
  },

  setup(props) {
    const center = { lat: props.lat, lng: props.lng };
    return { center };
  },

});
</script>

<template>
  <GoogleMap
    class="w-full h-[40rem] mb-8"
    :api-key="api_key" 
    :center="center" 
    :zoom="15">
    <Marker 
    :options="{ position: center }" 
  />
  </GoogleMap>
</template>

