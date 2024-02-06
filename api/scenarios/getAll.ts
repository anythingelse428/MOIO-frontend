export interface IAllScenariosResponse {
  id:string,
  name:string
}
export default async function apiScenariosGetAll ():Promise<IAllScenariosResponse[]> {
  return await useAsyncQuery(async ({ axios, path }) => {
    return await axios.get(path + '/v1/scenarios')
  })
}
