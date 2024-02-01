import useAsyncQuery from "~/composables/useAsyncQuery"
import type { IChangeDeviceStatusPayload } from "~/api/device/types"

export interface IDeviceChangeStatusOnOff extends IChangeDeviceStatusPayload{
  onOffStatus:boolean
}
export default async function apiDeviceChangeOnOff (props:IDeviceChangeStatusOnOff) {
  const query = `?clientId=${props.clientId}&deviceId=${props.deviceId}&chanel=${props.chanel}&onOffStatus=${props.onOffStatus}`
  console.log(props)
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.post(path + '/device/ChangeStatusOnOff/' + query)
  })
}
