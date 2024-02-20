import useAsyncQuery from '~/composables/useAsyncQuery'

export interface IUserInfoResponse {
    name: string,
    login: string,
}
export default async function apiUserGetById (id:number):Promise<IUserInfoResponse> {
  return await useAsyncQuery(async ({ axios, path }) => {
    try {
      const response = await axios.get(path + '/v1/users/' + id)
      if (response.status === 200) {
        return response
      }
    } catch (e) {
      useNotification('error', 'Ошибка в получении пользователя')
    }
  })
}
