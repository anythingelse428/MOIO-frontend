import { consola } from "consola"
import useAsyncQuery from '~/composables/useAsyncQuery'
export interface IUserInfoResponse {
    id: number,
    name: string,
    login: string,
    password: string,
    devices: any,
    role: number
}
export default async function getUserInfo (id:string):Promise<IUserInfoResponse> {
  return await useAsyncQuery(async ({ axios, path }) => {
    try {
      return await axios.get(path + '/user/GetMyUser?id=' + id)
    } catch (e) {
      consola.error('ПИЗДА БОРОДА' + e)
    }
  })
}
