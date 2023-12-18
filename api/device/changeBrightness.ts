import useAsyncQuery from "~/composables/useAsyncQuery"
import type { IChangeDeviceStatusPayload } from "~/api/device/types"
export interface IDeviceChangeBrightness extends IChangeDeviceStatusPayload{
    brightness:number
}
export default async function apiDeviceChangeBrightness (props:IDeviceChangeBrightness) {
  const query = `?clientId=${props.clientId}&deviceId=${props.deviceId}&chanel=${props.chanel}&brightness=${props.brightness}`
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.post(path + '/device/ChangeStatusBrightness' + query)
  })
}
