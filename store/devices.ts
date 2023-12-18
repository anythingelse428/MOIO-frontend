import { defineStore } from 'pinia'

import apiDeviceGetAll, { type IAllDevicesResponse } from "~/api/device/getAll"
import type { IDeviceChangeBrightness } from "~/api/device/changeBrightness"
import apiDeviceChangeBrightness from "~/api/device/changeBrightness"
import type { IDeviceChangeRGBPayload } from "~/api/device/changeRGB"
import apiDeviceChangeRGB from "~/api/device/changeRGB"
import type { IDeviceChangeStatusOnOf } from "~/api/device/changeStatusOnOf"
import apiDeviceChangeOnOf from "~/api/device/changeStatusOnOf"
import type { IDeviceChangeStatusOpenClose } from "~/api/device/changeStatusOpenClose"
import apiDeviceChangeOpenClose from "~/api/device/changeStatusOpenClose"
import type { IDeviceChangeStatusTemperature } from "~/api/device/changeStatusTemperature"
import apiDeviceChangeTemperature from "~/api/device/changeStatusTemperature"
import apiDeviceChangeName from "~/api/device/changeName"
import apiDeviceDelete from "~/api/device/delete"
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
      console.error('using deprecated method')
      const data = await apiDeviceGetAll()
      if (data?.length) {
        this.devices = data
      }
    },
    async changeBrightness (props:IDeviceChangeBrightness) {
      try {
        await apiDeviceChangeBrightness(props)
      } catch (e) {
        useNotification('error', "Произошла ошибка при изменении яркости")
      }
    },
    async changeRGB (props: IDeviceChangeRGBPayload) {
      try {
        await apiDeviceChangeRGB(props)
      } catch (e) {
        useNotification('error', "Произошла ошибка при изменении цвета")
      }
    },
    async changeOnOf (props:IDeviceChangeStatusOnOf) {
      try {
        await apiDeviceChangeOnOf(props)
      } catch (e) {
        useNotification('error', "Произошла непредвиденная ошибка")
      }
    },
    async changeOpenClose (props:IDeviceChangeStatusOpenClose) {
      try {
        await apiDeviceChangeOpenClose(props)
      } catch (e) {
        useNotification('error', "Произошла непредвиденная ошибка")
      }
    },
    async changeTemperature (props:IDeviceChangeStatusTemperature) {
      try {
        await apiDeviceChangeTemperature(props)
      } catch (e) {
        useNotification('error', "Произошла непредвиденная ошибка")
      }
    },
    async changeName (id:string, name:string) {
      try {
        const response = await apiDeviceChangeName(id, name)
        if (response) {
          useNotification('info', 'Имя устройства успешно изменено')
        }
      } catch {
        useNotification('error', 'Произошла ошибка при смене имени')
      }
    },
    async deleteDevice (id:string) {
      try {
        await apiDeviceDelete(id)
        useNotification('info', 'Устройство успешно удалено')
      } catch {
        useNotification('error', "Произошла непредвиденная ошибка")
      }
    },
  },
})
