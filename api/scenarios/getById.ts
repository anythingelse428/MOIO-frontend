import type { ServiceProps } from "~/components/Service/TheService.vue"

export interface IScenarioResponse {
  id:string,
  name:string
  devicesScenarios:ServiceProps[]
}
export default async function apiScenariosGetById (id:string):Promise<IScenarioResponse> {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.get(path + '/v1/scenarios/' + id)
  })
}
