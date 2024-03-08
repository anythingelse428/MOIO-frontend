import type { AxiosError } from "axios"
import useAsyncQuery from '~/composables/useAsyncQuery'

export default async function apiGroupRemoveUsers (groupsIds:string[], usersLogins:string[] = [], usersIds:number[] = []) {
  return await useAsyncQuery(async ({ axios, path }) => {
    try {
      const response = await axios.delete(path + '/v1/groups/remove/users', {
        data: {
          usersLogins,
          usersIds,
          groupsIds,
        },
      })
      if (response.status === 200) {
        return response
      }
    } catch (e) {
      useNotification('error', <string>(e as AxiosError)?.response?.data ?? "Произошла ошибка")
    }
  })
}
