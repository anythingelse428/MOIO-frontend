import useAsyncQuery from "~/composables/useAsyncQuery"
import type { ChangeStatusPayload } from "~/api/device/types"
export interface DeviceChangeBrightnessPayload extends ChangeStatusPayload{
    brightness:number
}
export default async function apiDeviceChangeBrightness (props:DeviceChangeBrightnessPayload) {
  const query = `?clientId=${props.clientId}&deviceId=${props.deviceId}&chanel=${props.chanel}&brightness=${props.brightness}`
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.post(path + '/device/ChangeStatusBrightness' + query)
  })
}
