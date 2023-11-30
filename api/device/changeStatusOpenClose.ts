import useAsyncQuery from "~/composables/useAsyncQuery"
import type { ChangeStatusPayload } from "~/api/device/types"
export interface DeviceChangeStatusOpenClose extends ChangeStatusPayload{
    open:boolean
}
export default async function apiDeviceChangeOpenClose (props:DeviceChangeStatusOpenClose) {
  const query = `?clientId=${props.clientId}&deviceId=${props.deviceId}&chanel=${props.chanel}&open=${props.open}`
  console.log(query)
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.post(path + '/device/ChangeStatusOpenClose/' + query)
  })
}
