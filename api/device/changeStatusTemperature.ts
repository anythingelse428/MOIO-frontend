import useAsyncQuery from "~/composables/useAsyncQuery"
import type { ChangeStatusPayload } from "~/api/device/types"

export interface DeviceChangeStatusTemperature extends ChangeStatusPayload {
    temperature:boolean
}
export default async function apiDeviceChangeTemperature (props:DeviceChangeStatusTemperature) {
  const query = `?clientId=${props.clientId}&deviceId=${props.deviceId}&chanel=${props.chanel}&temperature=${props.temperature}`
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.post(path + '/device/ChangeStatusTemperature/' + query)
  })
}
