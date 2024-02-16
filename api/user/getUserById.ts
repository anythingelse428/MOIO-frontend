import useAsyncQuery from '~/composables/useAsyncQuery'

export interface IUserInfoResponse {
    id: number,
    name: string,
    login: string,
    password: string,
    devices: any,
    role: number
}
export default async function apiUserGetById (id:number):Promise<IUserInfoResponse> {
  return await useAsyncQuery(async ({ axios, path }) => {
    try {
      return await axios.get(path + '/user/GetUser?id=' + id)
    } catch (e) {
      useNotification('error', 'Ошибка в получении пользователя')
    }
  })
}
