import useAsyncQuery from '~/composables/useAsyncQuery'
import type { IAllDevicesResponse } from "~/api/device/getAll"

export default async function apiCategoryGetDevicesById (id:number):Promise<IAllDevicesResponse[]> {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.get(path + '/category/getDevicesByCategory/?categoryId=' + id)
  })
}
