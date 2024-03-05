import { type AxiosError } from "axios"
import useAsyncQuery from '~/composables/useAsyncQuery'
import type { IAllDevicesResponse } from "~/api/device/getAll"

export interface IDevicesInCategory {
    [key:string]:IAllDevicesResponse[]
}
export default async function apiCategoryGetDevicesById (categoryId:number, groupId:string):Promise<IDevicesInCategory> {
  return await useAsyncQuery(async ({ axios, path }) => {
    try {
      const response = await axios.get(path + `/v1/categories/${categoryId}/groups/${groupId}/devices`)
      return response.status === 200 && response
    } catch (e) {
      useNotification('error', <string>(e as AxiosError)?.response?.data ?? 'Что-то пошло не так с получением категорий')
    }
  })
}
