import useAsyncQuery from "~/composables/useAsyncQuery"
import type { IChangeDeviceStatusPayload } from "~/api/device/types"

export interface IDeviceChangeRGBPayload extends IChangeDeviceStatusPayload{
    h:number
    s:number
    v:number
}
export default async function apiDeviceChangeRGB (props:IDeviceChangeRGBPayload) {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.post(path + '/device/ChangeStatusHSV/', props)
  })
}
