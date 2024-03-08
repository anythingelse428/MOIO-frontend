import type { AxiosError } from "axios"
import useAsyncQuery from '~/composables/useAsyncQuery'

export default async function apiGroupDelete (groupId:string) {
  return await useAsyncQuery(async ({ axios, path }) => {
    try {
      const response = await axios.delete(path + `/v1/groups/remove`, { data: { groupId } })
      return response.status === 200 && response
    } catch (e) {
      useNotification('error', <string>(e as AxiosError)?.response?.data ?? 'Произошла ошибка при удалении группы')
    }
  })
}

