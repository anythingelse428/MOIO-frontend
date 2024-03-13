import type { AxiosError } from "axios"
import useAsyncQuery from '~/composables/useAsyncQuery'

export interface IUsersByGroupResponse {
  id: number,
  name: string,
  login: string,
  isPending:boolean,
  groupsIsPending:{id:string, name:string, isPending:boolean}[]
}
export default async function apiGroupGetUserByGroupId (id:string):Promise<IUsersByGroupResponse[]> {
  return await useAsyncQuery(async ({ axios, path }) => {
    try {
      const response = await axios.get(path + `/v1/groups/${id}/users`)
      if (response.status === 200) {
        return response
      }
    } catch (e) {
      useNotification('error', <string>(e as AxiosError)?.response?.data ?? 'Произошла ошибка получения гостей')
    }
  })
}

