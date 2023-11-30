import useAsyncQuery from "~/composables/useAsyncQuery"
import type { ChangeStatusPayload } from "~/api/device/types"

export interface DeviceChangeStatusOnOf extends ChangeStatusPayload{
    onOfStatus:boolean
}
export default async function apiDeviceChangeOnOf (props:DeviceChangeStatusOnOf) {
  const query = `?clientId=${props.clientId}&deviceId=${props.deviceId}&chanel=${props.chanel}&onOfStatus=${props.onOfStatus}`
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.post(path + '/device/ChangeStatusOnOf/' + query)
  })
}
