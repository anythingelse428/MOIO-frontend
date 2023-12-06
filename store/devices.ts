import { defineStore } from 'pinia'
import { consola } from "consola"
import apiDeviceGetAll, { type IAllDevicesResponse } from "~/api/device/getAll"
import type { DeviceChangeBrightnessPayload } from "~/api/device/changeBrightness"
import apiDeviceChangeBrightness from "~/api/device/changeBrightness"
import type { DeviceChangeRGBPayload } from "~/api/device/changeRGB"
import apiDeviceChangeRGB from "~/api/device/changeRGB"
import type { DeviceChangeStatusOnOf } from "~/api/device/changeStatusOnOf"
import apiDeviceChangeOnOf from "~/api/device/changeStatusOnOf"
import type { DeviceChangeStatusOpenClose } from "~/api/device/changeStatusOpenClose"
import apiDeviceChangeOpenClose from "~/api/device/changeStatusOpenClose"
import type { DeviceChangeStatusTemperature } from "~/api/device/changeStatusTemperature"
import apiDeviceChangeTemperature from "~/api/device/changeStatusTemperature"
import apiDeviceGetById from "~/api/device/getById"
// store 2 sample
export const useDevicesStore = defineStore('devices', {
  state: () => ({
    devices: [] as IAllDevicesResponse[],
  }),
  getters: {
    allDevices: state => state.devices,
    capabilityById: state => (id:string, capability:string) => state.devices.find(el => el.id === id)?.capabilities.find(el => el.type.includes(capability)),
  },
  actions: {
    setDeviceCapability (deviceId:string, chanel:string, type:string, newValue:any) {
      console.log('fromset')
      const oldDeviceIdx = this.devices.findIndex(el => el.id === deviceId + '_ch' + chanel)
      const capabilityIdx = this.devices[oldDeviceIdx].capabilities.findIndex(el => el.type === type)
      if (capabilityIdx > -1 && oldDeviceIdx > -1) {
        if (type.includes('on_off') || type.includes('range') || type.includes('temperature')) {
          this.devices[oldDeviceIdx].capabilities[capabilityIdx].value = newValue
        }
        if (type.includes('color')) {
          this.devices[oldDeviceIdx].capabilities[capabilityIdx].hsv.v = Number(newValue)
        }
      }
    },
    async getAllDevices () {
      console.log('getAllDevices')
      const data = await apiDeviceGetAll()
      if (data?.length) {
        this.devices = data
      }
    },
    async changeBrightness (props:DeviceChangeBrightnessPayload) {
      try {
        await apiDeviceChangeBrightness(props)
      } catch (e) {
        useNotification('error', "Произошла ошибка при изменении яркости")
      }
    },
    async changeRGB (props: DeviceChangeRGBPayload) {
      console.log(props)
      try {
        await apiDeviceChangeRGB(props)
      } catch (e) {
        useNotification('error', "Произошла ошибка при изменении цвета")
      }
    },
    async changeOnOf (props:DeviceChangeStatusOnOf) {
      console.log(new Date().getUTCDate())
      try {
        await apiDeviceChangeOnOf(props)
      } catch (e) {
        useNotification('error', "Произошла непредвиденная ошибка")
      }
    },
    async changeOpenClose (props:DeviceChangeStatusOpenClose) {
      try {
        await apiDeviceChangeOpenClose(props)
        console.log('store',
          this.devices.find(el => el.id === props.deviceId + '_ch' + props.chanel),
        )
      } catch (e) {
        useNotification('error', "Произошла непредвиденная ошибка")
      }
    },
    async changeTemperature (props:DeviceChangeStatusTemperature) {
      try {
        await apiDeviceChangeTemperature(props)
      } catch (e) {
        useNotification('error', "Произошла непредвиденная ошибка")
      }
    },
  },
})
