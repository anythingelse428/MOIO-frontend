import useAsyncQuery from "~/composables/useAsyncQuery"
import type { IChangeDeviceStatusPayload } from "~/api/device/types"
export interface IDeviceChangeStatusOpenClose extends IChangeDeviceStatusPayload{
    open:boolean
}
export default async function apiDeviceChangeOpenClose (props:IDeviceChangeStatusOpenClose) {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.post(path + '/device/ChangeStatusOpenClose/', props)
  })
}
