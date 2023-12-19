import useAsyncQuery from "~/composables/useAsyncQuery"
import type { IChangeDeviceStatusPayload } from "~/api/device/types"

export interface IDeviceChangeStatusTemperature extends IChangeDeviceStatusPayload {
    temperature:boolean
}
export default async function apiDeviceChangeTemperature (props:IDeviceChangeStatusTemperature) {
  const query = `?clientId=${props.clientId}&deviceId=${props.deviceId}&chanel=${props.chanel}&temperature=${Number(props.temperature)}`
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.post(path + '/device/ChangeStatusTemperature/' + query)
  })
}
