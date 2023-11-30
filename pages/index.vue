<template>
  <div class="home">
    <div class="service-list">
      <the-service
        v-for="device in devices"
        :id="device.id"
        :key="device.id"
        :group-id="device?.device_info?.model"
        :name="device.name"
        :capabilities="device.capabilities"
        :type="device.type"
      />
    </div>
  </div>
</template>

<script setup lang="ts">


import { useDevicesStore } from "~/store/devices"
import TheService from "~/components/Service/TheService.vue"
import { type IAllDevicesResponse } from "~/api/device/getAll"
import { useUserStore } from "~/store/user"
import useSocket from "~/composables/useSocket"

import useNotification from "~/composables/useNotification"
// import useSocket from "~/composables/useSocket"

const devicesStore = useDevicesStore()
const devices = ref<IAllDevicesResponse[]>()
async function fetchData () {
  await devicesStore.getAllDevices()
  devices.value = devicesStore.allDevices
}
fetchData()

function callNotification (e) {
  // const instance = getCurrentInstance()
  // const appContext = instance?.appContext
  // const popa = useNotification({ appContext, props: { type: 'info', message: 'asdasdasd' } })
  // popa.show()
}

// function ping () {
//   useSocket('ping')
// }
// function sendMessage () {
//   useSocket('echo', { data: { message: 'asdasdasdasdasdasd' } })
// }

// const conn = useSocket()
// const test = ref('')
// conn.onclose = () => {
//   alert("Подключение окончено")
// }
// conn.onmessage = (e) => {
//   console.log('from on message', JSON.parse(e.data))
//   test.value = JSON.parse(e.data).payload
// }
// function sendMessage (message:string) {
//   conn.send(JSON.stringify({ event: "chat-message", payload: Math.random() * 5000 }))
// }


</script>

<style lang="scss">
.home{
  padding-inline: clamp(5%,100px,100px);
  @media screen and (max-width: 768px) {
    padding-inline: 28px;
  }
.service-list{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 30px;
}
}
</style>
