import { defineStore } from 'pinia'

import apiDeviceGetAll, { type IAllDevicesResponse } from "~/api/device/getAll"
import type { IDeviceChangeBrightness } from "~/api/device/changeBrightness"
import apiDeviceChangeBrightness from "~/api/device/changeBrightness"
import type { IDeviceChangeRGBPayload } from "~/api/device/changeRGB"
import apiDeviceChangeRGB from "~/api/device/changeRGB"
import type { IDeviceChangeStatusOnOff } from "~/api/device/changeStatusOnOff"
import apiDeviceChangeOnOf from "~/api/device/changeStatusOnOff"
import type { IDeviceChangeStatusOpenClose } from "~/api/device/changeStatusOpenClose"
import apiDeviceChangeOpenClose from "~/api/device/changeStatusOpenClose"
import type { IDeviceChangeStatusTemperature } from "~/api/device/changeStatusTemperature"
import apiDeviceChangeTemperature from "~/api/device/changeStatusTemperature"
import apiDeviceChangeName from "~/api/device/changeName"
import apiDeviceDelete from "~/api/device/delete"
import apiDeviceGetConfig from "~/api/device/getConfig"
import apiDeviceChangeIcon from "~/api/device/changeIcon"
export const useDevicesStore = defineStore('devices', {
  state: () => ({
    devices: [] as IAllDevicesResponse[],
  }),
  getters: {
    allDevices: state => state.devices,
    capabilityById: state => (id:string, capability:string) => state.devices.find(el => el.id === id)?.capabilities.find(el => el.type.includes(capability)),
  },
  actions: {
    async getAllDevices () {
      console.warn('using deprecated method from devices store')
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
        console.log(props)
        await apiDeviceChangeRGB(props)
      } catch (e) {
        useNotification('error', "Произошла ошибка при изменении цвета")
      }
    },
    async changeOnOf (props:IDeviceChangeStatusOnOff) {
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
      return await apiDeviceDelete(id)
    },
    async getConfig () {
      return await apiDeviceGetConfig()
    },
    async changeIcon (deviceIdChanel:string, iconName:string) {
      return await apiDeviceChangeIcon(deviceIdChanel, iconName)
    },
  },
})
