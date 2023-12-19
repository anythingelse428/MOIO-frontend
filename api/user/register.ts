import useAsyncQuery from '~/composables/useAsyncQuery'

export interface IRegisterUserProps {
    name: string,
    login: string,
    password: string,
}
export interface IRegisterUserResponse {
    accessToken: string,
    refreshToken: string,
    username: string,
    role: string
}
export default async function apiUserRegister (props:IRegisterUserProps):Promise<IRegisterUserResponse> {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.post(path + '/user/register', props)
  })
}
