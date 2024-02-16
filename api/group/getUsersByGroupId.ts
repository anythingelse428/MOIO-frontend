import useAsyncQuery from '~/composables/useAsyncQuery'

export interface IUsersByGroupResponse {
  id: number,
  name: string,
  login: string,
  clientId: string|any,
  password: any,
  role: number|any,
  groups:{id:string, name:string}[]
}
export default async function apiGroupGetUserByGroupId (id:string):Promise<IUsersByGroupResponse[]> {
  return await useAsyncQuery(async ({ axios, path }) => {
    try {
      const response = await axios.get(path + `/v1/groups/${id}/users`)
      if (response.status === 200) {
        return response
      }
    } catch {
      useNotification('error', 'Произошла ошибка получения гостей')
    }
  })
}

