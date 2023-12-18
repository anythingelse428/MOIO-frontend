import useAsyncQuery from "~/composables/useAsyncQuery"
import type { IChangeDeviceStatusPayload } from "~/api/device/types"
export interface IDeviceChangeStatusOpenClose extends IChangeDeviceStatusPayload{
    open:boolean
}
export default async function apiDeviceChangeOpenClose (props:IDeviceChangeStatusOpenClose) {
  const query = `?clientId=${props.clientId}&deviceId=${props.deviceId}&chanel=${props.chanel}&open=${props.open}`
  console.log(query)
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.post(path + '/device/ChangeStatusOpenClose/' + query)
  })
}
