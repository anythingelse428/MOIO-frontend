import { VNodeIcon } from "~/components/shared/VNodeIcon"

export default function useNotification (type:'info'|'warning'|'error', message:string) {
  let iconName = ''
  switch (type) {
    case "info":
      iconName = 'mdi-information'
      break
    case "error":
      iconName = 'mdi-alert-octagon'
      break
    case "warning":
      iconName = 'mdi-alert'
  }
  nextTick(() => {
    if (process.client) {
      useNuxtApp().$toast[type](message, {
        icon: VNodeIcon(iconName),
        autoClose: 10 * 1000,
        position: 'top-center',
      })
    }
  })
}
