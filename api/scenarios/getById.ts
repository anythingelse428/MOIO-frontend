import { AxiosError } from "axios"
import type { ServiceProps } from "~/components/Service/TheService.vue"

export interface IScenarioResponse {
  id:string,
  name:string
  devicesScenarios:ServiceProps[]
}
export default async function apiScenariosGetById (id:string):Promise<IScenarioResponse> {
  return await useAsyncQuery(async ({ axios, path }) => {
    try {
      const response = await axios.get(path + '/v1/scenarios/' + id)
      return response.status === 200 && response
    } catch (e) {
      useNotification('error', <string>(e as AxiosError)?.response?.data ?? 'Ошибка при получении сценария')
    }
  })
}
