


import VNodeIcon from "~/components/shared/VNodeIcon"

export default function useNotification (type:'info'|'warning'|'error', message:string) {
  let iconName = ''
  switch (type) {
    case "info":
      iconName = 'notification/information'
      break
    case "error":
      iconName = 'notification/alert-octagon'
      break
    case "warning":
      iconName = 'notification/alert'
  }
  nextTick(() => {
    if (process.client) {
      useNuxtApp().$toast[type](message, {
        icon: () => h(h(VNodeIcon), { src: '/_nuxt/assets/icons/' + iconName + '.svg' }),
        autoClose: 10 * 1000,
        position: 'top-center',
      })
    }
  })
}
