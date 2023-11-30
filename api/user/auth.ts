import useAsyncQuery from '~/composables/useAsyncQuery'

export interface IAuthUserProps {
    login: string,
    password: string,
}
export interface IAuthUserResponse {
    access_token: string,
    refresh_token: string,
    username: string,
    role: string
}
export default async function apiUserAuth (props:IAuthUserProps):Promise<IAuthUserResponse> {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.post(path + `/user/login`, props)
  })
}
