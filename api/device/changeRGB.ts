import useAsyncQuery from "~/composables/useAsyncQuery"
import type { ChangeStatusPayload } from "~/api/device/types"

export interface DeviceChangeRGBPayload extends ChangeStatusPayload{
    h:number
    s:number
    v:number
}
export default async function apiDeviceChangeRGB (props:DeviceChangeRGBPayload) {
  const query = `?clientId=${props.clientId}&deviceId=${props.deviceId}&chanel=${props.chanel}&h=${props.h.toFixed(0)}&s=${props.s.toFixed(0)}&v=${(props.v * 100).toFixed(0)}`
  console.log(query)
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.post(path + '/device/ChangeStatusHSV/' + query)
  })
}
