import slider from "vue3-slider"
import 'vue3-toastify/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(slider)
  return {
    provide: {
      slider,
    },
  }
})
