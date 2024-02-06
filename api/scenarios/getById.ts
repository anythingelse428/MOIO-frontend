import type { IAllDevicesResponse } from "~/api/device/getAll"

export interface IScenarioResponse {
data:{
  id:string,
  name:string
  devicesScenarios:{
    deviceId:string,
    name:string,
    type:string,
    capabilities:IAllDevicesResponse["capabilities"]
  }[]
}
}
export default async function apiScenariosGetById (id:string):Promise<IScenarioResponse> {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.get(path + '/v1/scenarios/' + id)
  })
}
