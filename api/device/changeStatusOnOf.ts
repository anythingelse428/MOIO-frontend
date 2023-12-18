import useAsyncQuery from "~/composables/useAsyncQuery"
import type { IChangeDeviceStatusPayload } from "~/api/device/types"

export interface IDeviceChangeStatusOnOf extends IChangeDeviceStatusPayload{
    onOfStatus:boolean
}
export default async function apiDeviceChangeOnOf (props:IDeviceChangeStatusOnOf) {
  const query = `?clientId=${props.clientId}&deviceId=${props.deviceId}&chanel=${props.chanel}&onOfStatus=${props.onOfStatus}`
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.post(path + '/device/ChangeStatusOnOf/' + query)
  })
}
