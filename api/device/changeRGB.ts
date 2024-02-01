import useAsyncQuery from "~/composables/useAsyncQuery"
import type { IChangeDeviceStatusPayload } from "~/api/device/types"

export interface IDeviceChangeRGBPayload extends IChangeDeviceStatusPayload{
    h:number
    s:number
    v:number
}
export default async function apiDeviceChangeRGB (props:IDeviceChangeRGBPayload) {
  const s = props.s
  console.log(props)
  const query = `?clientId=${props.clientId}&deviceId=${props.deviceId}&chanel=${props.chanel}&h=${props.h.toFixed(0)}&s=${Number(s.toFixed(0))}&v=${(props.v).toFixed(0)}`
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.post(path + '/device/ChangeStatusHSV/' + query)
  })
}
