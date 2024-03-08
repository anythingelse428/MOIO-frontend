import type { AxiosError } from "axios"
import useAsyncQuery from '~/composables/useAsyncQuery'

export interface IRegisterUserProps {
    name: string,
    login: string,
    password: string,
    clientId?:string,
    confirmationCode?:string
}
export interface IRegisterUserResponse {
    accessToken: string,
    refreshToken: string,
    username: string,
    role: string
}
export default async function apiUserRegister (props:IRegisterUserProps):Promise<IRegisterUserResponse> {
  return await useAsyncQuery(async ({ axios, path }) => {
    const response = await axios.post(path + '/v1/users/Register', props)
    try {
      if (response.status === 200) {
        return response
      }
    } catch (e) {
      console.log(e)
      useNotification('error', <string>(e as AxiosError)?.response?.data ?? 'Ошибка регистрации')
    }
  })
}
