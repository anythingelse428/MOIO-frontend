export interface IAllScenariosResponse {
data:{
  id:string,
  name:string
}[]
}
export default async function apiScenariosGetAll ():Promise<IAllScenariosResponse> {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.get(path + '/Scenarios/GetUserScenarios')
  })
}
