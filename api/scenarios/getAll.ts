import { AxiosError } from "axios"

export interface IAllScenariosResponse {
  id:string,
  name:string
}
export default async function apiScenariosGetAll ():Promise<IAllScenariosResponse[]> {
  return await useAsyncQuery(async ({ axios, path }) => {
    try {
      const response = await axios.get(path + '/v1/scenarios')
      return response.status === 200 && response
    } catch (e) {
      useNotification('error', <string>(e as AxiosError)?.response?.data ?? 'Ошибка при получении сценарев')
    }
  })
}
