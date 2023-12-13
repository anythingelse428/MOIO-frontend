import useAsyncQuery from '~/composables/useAsyncQuery'
import type { IAllDevicesResponse } from "~/api/device/getAll"

export interface IDevicesInCategory {
    [key:string]:IAllDevicesResponse[]
}
export default async function apiCategoryGetDevicesById (id:number, homeId:string):Promise<IDevicesInCategory> {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.get(path + '/category/GetDevicesByCategoryAndGroup/?categoryId=' + id + `&groupId=${homeId}`)
  })
}
