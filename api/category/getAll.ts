import type { AxiosError } from "axios"
import useAsyncQuery from '~/composables/useAsyncQuery'

export interface IGetAllResponseItem {
    id: number|string,
    name: string,
    devices: any
}

export default async function apiCategoryGetAll ():Promise<IGetAllResponseItem[]> {
  return await useAsyncQuery(async ({ axios, path }) => {
    try {
      const response = await axios.get(path + '/v1/categories')
      return response.status === 200 && response
    } catch (e) {
      useNotification('error', <string>(e as AxiosError)?.response?.data ?? 'Что-то пошло не так с получением категорий')
    }
  })
}
