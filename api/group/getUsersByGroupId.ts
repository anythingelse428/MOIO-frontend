import useAsyncQuery from '~/composables/useAsyncQuery'

export interface IUsersByGroupResponse {
  id: number,
  name: string,
  login: string,
  clientId: string,
  password: any,
  role: number
}
export default async function apiGroupGetUserByGroupId (id:string):Promise<IUsersByGroupResponse[]> {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.get(path + `/Group/GetUsersByGroup?groupId=${id}`)
  })
}

