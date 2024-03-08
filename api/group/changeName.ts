import type { AxiosError } from "axios"
import useAsyncQuery from '~/composables/useAsyncQuery'

export default async function apiGroupChangeName (groupId:string, groupName:string) {
  return await useAsyncQuery(async ({ axios, path }) => {
    try {
      const response = await axios.put(path + `/v1/groups/update/name`, { groupId, groupName })
      return response.status === 200 && response
    } catch (e) {
      useNotification('error', <string>(e as AxiosError)?.response?.data ?? 'Произошла ошибка при смене названия группы')
    }
  })
}

